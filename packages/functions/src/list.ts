import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Util } from "@sst-notes/core/util";
import { Resource } from "sst";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

interface Item {
  attachment: string;
  content: string;
  createdAt: number;
  noteId: string;
  userId: string;
}

export const main = Util.handler(async () => {
  const command = new ScanCommand({
    TableName: Resource.Notes.name,
  });
  const response = await dynamoDb.send(command);
  const unmarshallResponse = response.Items?.map((item) => unmarshall(item));
  return JSON.stringify(unmarshallResponse);
});
