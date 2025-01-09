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
    "webhook_url": "https://demo.m.pipedream.net"
  }
  ```

- Event to URL mappings are stored in Redis by the route service function. The
  key is the `eventName`, and the value is a Redis set containing all the
  `webhookUrl` strings.

  ```javascript
  await client.sAdd("eventName", ["https://demo.m.pipedream.net"]);
  ```

- When a call to the event trigger endpoint is made, the route service function retrieves the set of corresponding URLs mapped to the event's name.
- The producer creates unique messages for each of those URLs, each containing the event name, the URL, and a message ID.
- A consumer picks up the message and parses it to get the event name, the URL, and the message ID.
- It then makes a network request (using fetch or axios) to the URL.
- If the network request fails, it requeues the message.