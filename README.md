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
may not be sent later due to the data loss.

To get around this, we can introduce a persistent database layer to log trigger
workflow updates. When a request to trigger a webhook comes in, we write so in
the database, along with a job ID. We then enqueue the job with the same ID in
the BullMQ queue. When a worker pulls a job from the queue, we write appropriate
logs before and after the event, and then again after the HTTP response is
received from the webhook URL.

A background task periodically checks the logs in the database for
inconsistencies. For example, if a job is marked to have been picked up from the
queue, but there is no information following this event, we can assume a Redis
failure somewhere in between. This CRON job aggregates these failed jobs, and
sends them to the retry queue for retrying, and it may use a cursor to keep
track of jobs that have succeeded in a sequence.
