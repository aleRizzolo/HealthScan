import { CreateQueueCommand } from "@aws-sdk/client-sqs"

import { queueClient } from "../index"

const HEALTH_QUEUE_NAMES = ["weight", "bpm", "O2", "cholesterols", "error"]

export const createQueues = async (sqsQueueName = HEALTH_QUEUE_NAMES) => {
  for (let queue = 0; queue < HEALTH_QUEUE_NAMES.length; queue++) {
    const command = new CreateQueueCommand({
      QueueName: HEALTH_QUEUE_NAMES[queue],
      Attributes: {
        DelaySeconds: "60",
        MessageRetentionPeriod: "86400",
      },
    })

    const response = await queueClient.send(command)

    if (!response) {
      console.error("Error. Queue", HEALTH_QUEUE_NAMES[queue], "not created")
    }

    console.info("Queue", HEALTH_QUEUE_NAMES[queue], "created")
  }
}
