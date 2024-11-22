import { Resource } from "sst";
import { Util } from "@sst-notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async () => {
  const params = {
    TableName: Resource.Notes.name,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": "123",
    },
  };

  const result = await dynamoDb.send(new QueryCommand(params));

  return JSON.stringify(result.Items);
});
