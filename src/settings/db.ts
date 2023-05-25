import { CreateTableCommand } from "@aws-sdk/client-dynamodb"

import { ddbClient } from "../index"

export const createDB = async () => {
  const command = new CreateTableCommand({
    TableName: "HealthScan",

    AttributeDefinitions: [
      {
        AttributeName: "family_member",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "family_member",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  })

  const response = await ddbClient.send(command)

  if (!response) {
    console.error("Error. Table not created")
  }

  return response
}
