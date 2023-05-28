# SeaScan

Internet of Things has revolutionized the way we monitor our personal health. With the introduction of wearable devices such as fitness trackers, smartwatches, and health monitors, individuals can now keep a closer eye on their health and wellness. IoT technology allows us to collect and analyze data in real-time to track our physical activity, heart rate, sleep patterns, and even blood pressure. This data not only helps individuals make better-informed decisions about their health but also enables healthcare providers to identify potential health issues before they become serious problems.<br>
This project aims to create an easy way on how to collect and access those informations.

## Table of Contests
- [Overview](#overview)<br>
- [Run this project](#how-to-run-this-project)
    - [Run from script](#executing-from-script) 
    - [Manual run](#manual-run)
- [Future developments](#future-developments)
- [How to contribute](#how-to-contribute)

## Overview
Brief introduction on how this project works

### Project's architecture

![architecture](./images/architecture.png)

## How to run this project
### Prerequisites
1. This repository <code>git clone https://github.com/aleRizzolo/HealthScan.git</code>
2. [Docker](https://www.docker.com/)
3. [AWS cli](https://aws.amazon.com/it/cli/)
4. [Node.js](https://nodejs.org/it) (v18.14.2) and npm  
5. Telegram (?) and a Telegram Api Key (?)  
6. **Optional:** WSL2 if you don't have a Unix-like system (useful if you want to automatize the setup process with <code>run.sh</code> script)

## Get a Telegram bot token
Start [Bot father](https://telegram.me/BotFather) and follow the instruction. Then copy your Telegram Bot API key

## Create .env file
If you want to execute this project, you need to create a .env file in the root folder of the project. In this file, you will enter some confidential variables.<br>
After creating this file, write in it the following variables:
- REGION="the region configured in your cli"
- ENDPOINT="http://127.0.0.1:4566" 
- BOT_TOKEN="your-bot-token"

### Run from script
If you have a Unix-like system (or WSL2), open a terminal in the project's root directory and type: <code>chmod +x run.sh</code> and then type <code>./run.sh</code> to execute the script.<br>
Under the hood, the script will: 
- start the Docker container used for simulating the AWS environment
- install all the dependencies required by the project 
- transpile TypeScript into JavaScript
- start the project
- start all the secondary scripts
- start bot (?)
- setup al the functions (?)

After the script is completed, go to Telegram and interact with the Bot

### Manual run
If you want to run this script manually:
- start the container by typing <code>docker run -d --rm -p 4566:4566 --name aws localstack/localstack </code>
- install the dependencies with <code>npm install</code>
- transpile TypeScript into JavaScript with <code>npm run build</code>
- create clients and setup db and queues with <code>npm run start</code>
- setup the db and queues with <code>npm run setup</code>
- start the script for populating the Database and for simulating the device <code>npm run setup</code> 

The device will send datas every minute. Therefore, if you don't want to stop this process, open another terminal (within the root folder) and keep executing these scripts:

- start other scripts (?)
- start telegram (?)
- setup all the functions (?)

## Future developments
For fure developments this project will add more wearables for other vital parameters. Another goal will be to add email and push notifications in case some parameter is worrying

## How to contribute
1. Open an issue explaining your problem or any idea for improvement
2. Fetch this repo 
3. Create a new branch (on your copy) and work on it
4. Open a Pull Request