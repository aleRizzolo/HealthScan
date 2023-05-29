import { APIGatewayProxyEvent } from "aws-lambda"
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs"

const ENDPOINT = process.env.ENDPOINT
const REGION = process.env.REGION

//db client
const ddbClient = new DynamoDBClient({ region: REGION, endpoint: ENDPOINT })

//queues
const queueClient = new SQSClient({ region: REGION, endpoint: ENDPOINT })

const BEACHES_QUEUE = ["long_beach", "venice_beach", "santa_monica_beach", "manhattan_beach"]

const SQS_QUEUE_URL = process.env.ENDPOINT + "/000000000000/"

export const lambdaHandler = async (event: APIGatewayProxyEvent) => {
  for (let queue = 0; queue < BEACHES_QUEUE.length; queue++) {
    let messageCount = 0
    let finalAverage = 0

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
          finalAverage += parseInt(body.ph.split(" ")[0])
          /*console.log("Body message:", body)
          console.log("Average intermediate:", finalAverage)*/

          await queueClient.send(
            new DeleteMessageCommand({
              QueueUrl: SQS_QUEUE_URL + BEACHES_QUEUE[queue],
              ReceiptHandle: message.ReceiptHandle,
            })
          )
          //console.info("Message eliminated")
        }
      }
      finalAverage = parseInt((finalAverage / messageCount).toFixed(2))
      console.log("Average for", BEACHES_QUEUE[queue], ":", finalAverage)

      //Save into DynamoDB
      const commandDB = new PutItemCommand({
        TableName: "SeaScan",
        Item: {
          zone: { S: BEACHES_QUEUE[queue] },
          ph: { S: finalAverage.toString() },
          timeStamp: { S: body.timeStamp },
          dayTime: { S: body.dayTime },
        },
      })
      const responseDB = await ddbClient.send(commandDB)

      if (!responseDB) {
      } else {
        console.info("Database populated")
      }
    } catch (error) {
      console.log("Error reading from queue", error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "some error happened",
        }),
      }
    }
  }
}

//lambdaHandler()
