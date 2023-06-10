import { PutItemCommand } from "@aws-sdk/client-dynamodb"

import { ddbClient } from "../index"

//zones array for creating entries in db
const BEACHES = ["long_beach", "venice_beach", "santa_monica_beach", "manhattan_beach"]

//variables for store the random result
let result
//get timestamp
let timestamp = Date.now().toString()
//get the full date. "en-GB" is for get DD/MM/YYYY
let fullDate = new Date().toLocaleString("en-GB")

export const populateDB = async () => {
  for (let beach = 0; beach < BEACHES.length; beach++) {
    const command = new PutItemCommand({
      TableName: "SeaScan",
      Item: {
        beach: { S: BEACHES[beach] },
        ph: { S: (result = getValue(0, 14).toString()) },
        hydrocarbons: { S: (result = getValue(0, 10).toString() + "µg/L") },
        eCholi: { S: (result = getValue(0, 500).toString() + "UFC/100ml") },
        bacterias: { S: (result = getValue(0, 200).toString() + "bacterias/100ml") },
        timeStamp: { S: timestamp },
        dayTime: { S: fullDate },
        active: { BOOL: true },
      },
    })
    const response = await ddbClient.send(command)

    if (!response) {
      console.error("Error populating DB\n")
    }
    console.info("Database populated with", BEACHES[beach])
  }
}

//generates a random integer between two values, inclusive
const getValue = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

populateDB()
