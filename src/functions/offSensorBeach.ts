import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"

const REGION = process.env.REGION

//db client
const ddbClient = new DynamoDBClient({ region: REGION, endpoint: "http://localhost:4566" })

//variables for store the random result
let result
//get timestamp
let timestamp = Date.now().toString()
//get the full date. "en-GB" is for get DD/MM/YYYY
let fullDate = new Date().toLocaleString("en-GB")

export const lambdaHandler = async (event: any) => {
  const beach = event.beach

  try {
    const commandDB = new PutItemCommand({
      TableName: "SeaScan",
      Item: {
        beach: { S: beach },
        ph: { S: (result = getValue(0, 14).toString()) },
        hydrocarbons: { S: 0 + "µg/L" },
        eCholi: { S: 0 + "UFC/100ml" },
        bacterias: { S: 0 + "bacterias/100ml" },
        timeStamp: { S: timestamp },
        dayTime: { S: fullDate },
        active: { BOOL: false },
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

//generates a random integer between two values, inclusive
const getValue = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
