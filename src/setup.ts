import { createDB } from "./settings/db"
import { createQueues } from "./settings/createQueues"

const tableSetup = createDB()
  .then(() => console.info("Table created"))
  .catch((err) => console.error(err))

const queueSetup = createQueues()
  .then(() => console.info("Queues created"))
  .catch((err) => console.error(err))
