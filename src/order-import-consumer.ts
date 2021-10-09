import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  ssl: true,
  sasl: {
    username: "example-user",
    password: "example-pass",
    mechanism: "plain",
  },
  clientId: "kafka-app",
  brokers: [""],
});

const producer = kafka.producer();

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  if (!event.body) {
    return {
      statusCode: 400,
    };
  }
  const order = JSON.stringify(JSON.parse(event.body));

  await producer.connect();
  await producer.send({
    topic: "example-topic",
    messages: [{ key: "example-key", value: order }],
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ event, context }),
  };
};
