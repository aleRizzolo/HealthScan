# ⚠️ Project currently under development
# SeaScan

Internet of Things has revolutionized the way we monitor environment. IoT technology allows us to collect and analyze data in real-time to track all the metrics of the environment around us. This data allows a better awareness by the people about the ecosystem in wich they are <br>

## Table of Contents
- [Overview](#overview)<br>
- [Run this project](#how-to-run-this-project)
    - [Run from script](#executing-from-script) 
    - [Manual run](#manual-run)
- [Future developments](#future-developments)
- [How to contribute](#how-to-contribute)

## Overview
SeaScan is a simulation of IoT sensors that collect data across multiple beach zones. The project is based on an IoT Cloud architecture where several IoT sensors collect the datas and send them on Cloud where they are processed through Serverless Computing and stored in a NoSQL database to be easily accessible by a Telegram Bot. The IoT sensors are placed directly into the sea and collect datas such as: 
- beach name
- ph level
- hydrocarbons level
- eCholi levels
- date time
- a status that indicates if the sensor is on or off

### Project's architecture
Sensors write their parameters on SQS queues. A lambda calculates the average parameters and then sends the result in DynamoDB (this function can also be triggered manually).
A user can access those informations by interacting with a Telegram bot. The user can also request all the information and the bot sends an email to the specified address.
The user can also decide to switch on or off the sensors, by giving command to the bot that triggers another lambda function

![architecture](./images/architecture.png)

## How to run this project
### Prerequisites
1. This repository <code>git clone https://github.com/aleRizzolo/HealthScan.git</code>
2. [Docker](https://www.docker.com/)
3. [AWS cli](https://aws.amazon.com/it/cli/)
4. [Node.js](https://nodejs.org/it) (v18.14.2) and npm 
5. [Python3](https://www.python.org/) and pip 
6. Telegram and a Telegram Bot token  
7. **Optional:** WSL2 if you don't have a Unix-like system (useful if you want to automatize the setup process with <code>run.sh</code> script)

### Get a Telegram bot token and chat id
- Start [Bot father](https://telegram.me/BotFather) and follow the instruction. Then copy your Telegram Bot API key
- After copying your Telegram Bot token, start the bot and then open a browser and go to <code>https://api.telegram.org/bot<\API-access-token>/getUpdates?offset=0</code>, send a message to the bot and then refresh the page. In the response, copy the numerical string "id" in "chat" object 

### Create .env file
If you want to execute this project, you need to create a <code>.env</code> file in the root folder of the project. In this file, you will enter some confidential variables.<br>
After creating this file, write in it the following variables:
- REGION="the region configured in your cli"
- ENDPOINT="http://127.0.0.1:4566" 
- BOT_TOKEN="your-bot-token"
- CHAT_ID="your-chat-id"
- SENDER_EMAIL="your-email"
- AWS_ACCESS_KEY_ID="your-aws-access-key"
- AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"

After that, copy the .env file in <code>bot</code> directory

## Run from script
If you have a Unix-like system (or WSL2), open a terminal in the project's root directory and type: <code>chmod +x run.sh</code> and then type <code>./run.sh</code> to execute the script.<br>
Under the hood, the script will: 
- start the Docker container used for simulating the AWS environment
- install all the dependencies required by the project 
- transpile TypeScript into JavaScript
- start the project
- start all the secondary scripts
- setup all the functions
- install all the dependencies required by the bot

After the script is completed, start the bot by typing in a terminal within the root directory: <code>python bot/bot.py</code>

**NOTE**: the creation of lambda functions may block the script execution. If the script is stuck, press <code>CTRL+C</code> to execute next step

## Manual run
If you want to run this script manually:
- start the container by typing <code>docker run -d -v /var/run/docker.sock:/var/run/docker.sock --rm -p 4566:4566 --name aws localstack/localstack</code>
- install the dependencies with <code>npm install</code>
- transpile TypeScript into JavaScript with <code>npm run build</code>
- create clients and setup db and queues with <code>npm run start</code>
- from <code>/dist/functions</code> copy all the functions that you want to execute in <code>deploy</code> directory
- go inside deploy directory <code>cd deploy</code> and <code>npm install</code> after that, go back inside the root directory
- zip the function with <code>tar -a -c -f functions.zip deploy</code> or if you are on Mac/Linux <code>zip functions.zip deploy</code>
- create a new aws role with <code>aws iam create-role --role-name lambdarole --assume-role-policy-document file://role_policy.json --query 'Role.Arn' --endpoint-url=http://localhost:4566</code>
- attach the policy <code>aws iam put-role-policy --role-name lambdarole --policy-name lambdapolicy --policy-document file://policy.json --endpoint-url=http://localhost:4566</code>
- create the average function and save the Arn <code>aws lambda create-function --function-name average --zip-file fileb://functions.zip --handler deploy/average.lambdaHandler --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambdarole --endpoint-url=http://localhost:4566</code>
- create the function for switch all the sensors off and save the Arn <code>aws lambda create-function --function-name offsensors --zip-file fileb://functions.zip --handler deploy/offSensors.lambdaHandler --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambdarole --endpoint-url=http://localhost:4566</code>
- - create the function for switch all the sensors on and save the Arn <code>aws lambda create-function --function-name onsensors --zip-file fileb://functions.zip --handler deploy/onSensors.lambdaHandler --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambdarole --endpoint-url=http://localhost:4566</code>
- start the script for populating the Database and for simulating the device <code>npm run setup</code>
- install bot's dependencies with <code>pip install -r requirements.txt</code>
- start the bot by writing: <code>python bot/bot.py</code>

After that, you need to start the Telegram bot:
- inside the <code>bot directory</code>, run <code>pip install -r requirements.txt</code>
- start the bot by running <code>python bot.py</code>

## Future developments
For fure developments this project will add more metrics for scanning Sea water quality. Another goal will be to add email and push notifications in case some parameter is worrying

## How to contribute
1. Open an issue explaining your problem or any idea for improvement
2. Fork this repo 
3. Create a new branch (on your copy) and work on it
4. Open a Pull Request
