#!/bin/bash

docker run -d --rm -p 4566:4566 --name aws localstack/localstack:1.4

#check if the container exists
container=$(docker container ps -f "name=aws")

#if the container is not running exit 
if [ -z "$container" ];
then
    echo "Failed to create a container"
    exit 1
fi

read -p "Insert your email that you will use in the bot: " email
aws ses verify-email-identity --email-address $email --endpoint-url="http://localhost:4566"

clear
echo -e "\n*** Installing dependencies ***"
npm install

echo -e "\n *** Generating JavaScript ***"
npm run build
clear

echo -e "\n *** Starting application ***"
npm run start
clear

echo -e "\n *** Zipping functions ***"
cd deploy
npm install
cd ..
cp ./dist/functions/*.js ./deploy
zip -r functions.zip deploy

clear
echo -e "\n *** Setting up lambda ***"
aws iam create-role --role-name lambdarole --assume-role-policy-document file://role_policy.json --query 'Role.Arn' \
 --endpoint-url=http://localhost:4566

 aws iam put-role-policy --role-name lambdarole \
 --policy-name lambdapolicy --policy-document file://policy.json --endpoint-url=http://localhost:4566

 aws lambda create-function --function-name average \
 --zip-file fileb://functions.zip --handler deploy/average.lambdaHandler \
 --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambdarole --endpoint-url=http://localhost:4566

 aws lambda create-function --function-name onsensors \
 --zip-file fileb://functions.zip --handler deploy/onSensors.lambdaHandler \
 --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambdarole --endpoint-url=http://localhost:4566

 aws lambda create-function --function-name offsensors \
 --zip-file fileb://functions.zip --handler deploy/offSensors.lambdaHandler \
 --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambdarole --endpoint-url=http://localhost:4566

 aws lambda create-function --function-name offsensorbeach \
 --zip-file fileb://functions.zip --handler deploy/offSensorBeach.lambdaHandler \
 --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambdarole --endpoint-url=http://localhost:4566

 aws lambda create-function --function-name onsensorbeach \
 --zip-file fileb://functions.zip --handler deploy/onSensorBeach.lambdaHandler \
 --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambdarole --endpoint-url=http://localhost:4566

clear
echo -e "\n *** Setting up ***"
npm run setup

clear
echo -e "\n *** Install python dependencies ***"
pip install -r bot/requirements.txt