import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs"

import { queueClient } from "../index"

const BEACHES_QUEUE = ["long_beach", "venice_beach", "santa_monica_beach", "manhattan_beach"]

const SQS_QUEUE_URL = process.env.ENDPOINT + "/000000000000/"

const recieve = async () => {
  let finalAverage = 0
  for (let queue = 0; queue < BEACHES_QUEUE.length; queue++) {
    try {
      const receiveMessageParams = {
        QueueUrl: SQS_QUEUE_URL + BEACHES_QUEUE[queue],
        MaxNumberOfMessages: 10, // Max number of messages to read
        WaitTimeSeconds: 20, // Max waiting time for messages (max value 20 secs)
      }

      const command = new ReceiveMessageCommand(receiveMessageParams)
      const response = await queueClient.send(command)
      const messages = response.Messages

      while (messages && messages.length > 0) {
        for (const message of messages) {
          const body = JSON.parse(message.Body!)
          console.info("SQS message received")
          finalAverage += parseInt(body.ph.split(" ")[0])

          await queueClient.send(
            new DeleteMessageCommand({
              QueueUrl: SQS_QUEUE_URL + BEACHES_QUEUE[queue],
              ReceiptHandle: message.ReceiptHandle,
            })
          )
          console.info("Message eliminated")
        }
      }
    } catch (error) {
      console.error("Error during SQS reading", error)
    }
  }
  finalAverage = finalAverage / 4
}

recieve()
