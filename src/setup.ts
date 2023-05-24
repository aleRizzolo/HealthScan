import { runDB } from "./settings/db"
import { createQueues } from "./settings/createQueues"

const tablesSetup = runDB()
  .then(() => console.info("Table created"))
  .catch((err) => console.error(err))

const queueSetup = createQueues()
  .then(() => console.info("Queues created"))
  .catch((err) => console.error(err))
