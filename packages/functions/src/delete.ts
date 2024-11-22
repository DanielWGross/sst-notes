import { Resource } from "sst";
import { Util } from "@sst-notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const command = new DeleteCommand({
    TableName: Resource.Notes.name,
    Key: {
      userId: "123",
      noteId: event?.pathParameters?.id,
    },
  });

  await dynamoDb.send(command);

  return JSON.stringify({ status: true });
});
