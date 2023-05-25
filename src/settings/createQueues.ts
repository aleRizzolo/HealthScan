import { CreateQueueCommand } from "@aws-sdk/client-sqs"

import { queueClient } from "../index"

const ELDERY_FAMILY_MEMBERS = [
  "paternal_grandfather",
  "maternal_grandfather",
  "paternal_grandmother",
  "maternal_grandmother",
  "error",
]

export const createQueues = async (sqsQueueName = ELDERY_FAMILY_MEMBERS) => {
  for (let member = 0; member < ELDERY_FAMILY_MEMBERS.length; member++) {
    const command = new CreateQueueCommand({
      QueueName: ELDERY_FAMILY_MEMBERS[member],
      Attributes: {
        DelaySeconds: "60",
        MessageRetentionPeriod: "86400",
      },
    })

    const response = await queueClient.send(command)

    if (!response) {
      console.error("Error. Queue", ELDERY_FAMILY_MEMBERS[member], "not created")
    }

    console.info("Queue", ELDERY_FAMILY_MEMBERS[member], "created")
  }
}
