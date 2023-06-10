import { APIGatewayProxyEvent } from "aws-lambda"
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"

const REGION = process.env.REGION

//db client
const ddbClient = new DynamoDBClient({ region: REGION, endpoint: "http://localhost:4566" })

let result
//get timestamp
let timestamp = Date.now().toString()
//get the full date. "en-GB" is for get DD/MM/YYYY
let fullDate = new Date().toLocaleString("en-GB")

const BEACHES = ["long_beach", "venice_beach", "santa_monica_beach", "manhattan_beach"]

export const lambdaHandler = async (event: APIGatewayProxyEvent) => {
  for (let beach = 0; beach < BEACHES.length; beach++) {
    try {
      const commandDB = new PutItemCommand({
        TableName: "SeaScan",
        Item: {
          beach: { S: BEACHES[beach] },
          ph: { S: (result = getValue(0, 14).toString()) },
          hydrocarbons: { S: (result = getValue(0, 10).toString() + "µg/L") },
          eCholi: { S: (result = getValue(0, 500).toString() + "UFC/100ml") },
          bacterias: { S: (result = getValue(0, 200).toString() + "bacterias/100ml") },
          timeStamp: { S: timestamp },
          dayTime: { S: fullDate },
          active: { BOOL: true },
        },
      })
      const responseDB = await ddbClient.send(commandDB)

      if (!responseDB) {
      } else {
        console.info("Database populated")
      }
    } catch (error) {
      console.error(error)
    }
  }
}

//generates a random integer between two values, inclusive
const getValue = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
