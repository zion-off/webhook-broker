# Webhook Broker

## Supported actions

- Register a new webhook
- Get a list of registered webhooks
- Trigger an action

## API Endpoints

- `POST /api/v0/webhooks`
- `GET /api/v0/webhooks?page_size=<page-size>&offset=<offset>`
- `GET /api/v0/webhooks/<event-name>`
- `POST /api/v0/trigger-event/<event-name>`

## Architecture

- To register a webhook, the client sends a POST request with an event name and
  a webhook URL.

  ```json
  {
    "eventName": "upload_image",
    "webhookUrl": "https://demo.m.pipedream.net"
  }
  ```

- Event to URL mappings are stored in Redis by the route service function. The
  key is the `eventName`, and the value is a Redis set containing all the
  `webhookUrl` strings.

  ```javascript
  await client.sAdd("upload_image", ["https://demo.m.pipedream.net"]);
  ```

- When a call to the event trigger endpoint is made, the route service function
  retrieves the set of corresponding URLs mapped to the event's name, and
  enqueues it for processsing.
- The BullMQ queue is configured to handle retries with exponential delays. This
  ensures idempotency.
- A worker picks up the message and parses it to get the event name and the URL.
  It then makes a network request (using fetch or axios) to the URL.

## Running Locally

- Configure the .env file and start the Redis server. It is recommended to run
  Redis on a port other than the default.

## Potential Failssafe Mechanisms

The primary issue with relying solely on Redis is that, while it can be
configured to be non-volatile, it is not ACID compliant. As such, if at any
stage Redis fails, we stand the risk of losing information about requests that
may not be sent later due to the data loss, or of making duplicate requests to
clients. For example, if Redis fails to register a job as having been picked up
by a worker, a different worker instance might pick up the same job and make the
same request again to the client.

To get around this, we can introduce a persistent database layer to log workflow
updates when events are triggered. When a request to trigger a webhook comes in,
we write so in the database, along with a unique job ID. a `uuid`, for example.
We then enqueue the job with the same ID in the BullMQ queue. These two steps
may be done in one database transaction, so that changes to the database can be
rolled back if something goes wrong.

When a worker pulls a job from the queue, we write appropriate logs before and
after the event, and then again after the HTTP response is received from the
client after making a request to the webhook URL. This way, the database stands
as the single source of truth, and we may refer to it to spot inconsistencies in
our workflow. This also enables us to flush Redis whenever necessary, or remove
completed jobs from it to free up memory space, as they are not relevant to our
workflow any longer.

A background task periodically checks the logs in the database for
inconsistencies. For example, if a job is marked to have been picked up from the
queue, but there is no information following this event, we can assume a Redis
failure somewhere in between, and decide to retry this job. This CRON job
aggregates these failed jobs, and sends them to the retry queue for retrying,
and it may use a cursor to keep track of jobs that have succeeded in a sequence.

To enhance security when validating the webhook broker, a public and private key 
system can be implemented. The webhook broker will encrypt the payload using the 
recipient's public key, ensuring that only the recipient can decrypt it using 
their private key. Additionally, the recipient can verify the authenticity of the
payload by validating the signature with the sender's public key.

To further enhance security, we can implement key rotation practices, regularly
updating our encryption keys to mitigate risks associated with potential key
compromise or vulnerabilities in long-term key usage.
