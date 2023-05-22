import * as dotenv from "dotenv"
import { SQSClient } from "@aws-sdk/client-sqs"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

import { runDB } from "./settings/db"
import { createQueues } from "./settings/createQueues"

dotenv.config()

const ENDPOINT = process.env.ENDPOINT
const REGION = process.env.REGION

//db client
const ddbClient = new DynamoDBClient({ region: REGION, endpoint: ENDPOINT })

//queues
const queueClient = new SQSClient({ region: REGION, endpoint: ENDPOINT })

const createTable = runDB()
  .then(() => console.info("Table created"))
  .catch((err) => console.error(err))

const queueSetup = createQueues()
  .then(() => console.info("Queues created"))
  .catch((err) => console.error(err))

export { ddbClient, queueClient }
