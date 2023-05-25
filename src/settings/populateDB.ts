import { PutItemCommand } from "@aws-sdk/client-dynamodb"

import { ddbClient } from "../index"

//zones array for creating entries in db
const ELDERY_FAMILY_MEMBERS = [
  "paternal_grandfather",
  "maternal_grandfather",
  "paternal_grandmother",
  "maternal_grandmother",
]
//variables for store the random result
let result
//get timestamp
let timestamp = Date.now().toString()
//get the full date. "en-GB" is for get DD/MM/YYYY
let fullDate = new Date().toLocaleString("en-GB")

export const populateDB = async () => {
  for (let member = 0; member < ELDERY_FAMILY_MEMBERS.length; member++) {
    const command = new PutItemCommand({
      TableName: "HealthScan",
      Item: {
        family_member: { S: ELDERY_FAMILY_MEMBERS[member] },
        bloodPressure: { S: (result = getValue(120, 129).toString() + "mmHg") },
        O2: { S: (result = getValue(95, 100).toString() + "SpO2") },
        bpm: { S: (result = getValue(60, 100).toString() + "bpm") },
        cholesterol: { S: (result = getValue(130, 200).toString() + "mg/dl") },
        timeStamp: { S: timestamp },
        dayTime: { S: fullDate },
      },
    })
    const response = await ddbClient.send(command)

    if (!response) {
      console.error("Error populating DB\n")
    }
    console.info("Database populated with", ELDERY_FAMILY_MEMBERS[member])
  }
}

//generates a random integer between two values, inclusive
const getValue = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

populateDB()
