import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs"

const REGION = process.env.REGION

//db client
const ddbClient = new DynamoDBClient({ region: REGION, endpoint: "http://localhost:4566" })

//queues
const queueClient = new SQSClient({ region: REGION, endpoint: "http://localhost:4566" })

const BEACHES_QUEUE = ["long_beach", "venice_beach", "santa_monica_beach", "manhattan_beach"]

const SQS_QUEUE_URL = "http://localhost:4566/" + "/000000000000/"

export const lambdaHandler = async (event: APIGatewayProxyEvent) => {
  for (let queue = 0; queue < BEACHES_QUEUE.length; queue++) {
    let messageCount = 0
    let finalAveragePH = 0
    let finalAverageHydrocarbons = 0

    try {
      const receiveMessageParams = {
        QueueUrl: SQS_QUEUE_URL + BEACHES_QUEUE[queue],
        MaxNumberOfMessages: 10, // Max number of messages to read
        WaitTimeSeconds: 5, // Max waiting time for messages (max value 20 secs)
      }

      const command = new ReceiveMessageCommand(receiveMessageParams)
      const response = await queueClient.send(command)
      const messages = response.Messages

      if (messages && messages.length > 0) {
        for (const message of messages) {
          messageCount++
          var body = JSON.parse(message.Body!)
          //console.info("SQS message received")
          finalAveragePH += parseInt(body.ph.split(" ")[0])
          finalAverageHydrocarbons += parseInt(body.hydrocarbons.split(" ")[0])

          await queueClient.send(
            new DeleteMessageCommand({
              QueueUrl: SQS_QUEUE_URL + BEACHES_QUEUE[queue],
              ReceiptHandle: message.ReceiptHandle,
            })
          )
          //console.info("Message eliminated")
        }
      }
      finalAveragePH = parseInt((finalAveragePH / messageCount).toFixed(2))
      finalAverageHydrocarbons = parseInt((finalAverageHydrocarbons / messageCount).toFixed(2))

      //Save into DynamoDB
      const commandDB = new PutItemCommand({
        TableName: "SeaScan",
        Item: {
          beach: { S: BEACHES_QUEUE[queue] },
          ph: { S: finalAveragePH.toString() },
          hydrocarbons: { S: finalAverageHydrocarbons + "µg/L" },
          timeStamp: { S: body.timeStamp },
          dayTime: { S: body.dayTime },
          active: { BOOL: true },
        },
      })
      const responseDB = await ddbClient.send(commandDB)

      if (!responseDB) {
      } else {
        console.info("Database populated")
      }
    } catch (error) {
      console.log("Error reading from queue", error)
    }
  }
}
