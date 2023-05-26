import { CreateQueueCommand } from "@aws-sdk/client-sqs"

import { queueClient } from "../index"

const BEACHES_QUEUE = ["long_beach", "venice_beach", "santa_monica_beach", "manhattan_beach", "error"]

export const createQueues = async (sqsQueueName = BEACHES_QUEUE) => {
  for (let beach = 0; beach < BEACHES_QUEUE.length; beach++) {
    const command = new CreateQueueCommand({
      QueueName: BEACHES_QUEUE[beach],
      Attributes: {
        DelaySeconds: "60",
        MessageRetentionPeriod: "86400",
      },
    })

    const response = await queueClient.send(command)

    if (!response) {
      console.error("Error. Queue", BEACHES_QUEUE[beach], "not created")
    }

    console.info("Queue", BEACHES_QUEUE[beach], "created")
  }
}
