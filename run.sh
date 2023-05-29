#!/bin/bash

ROOT=$(pwd)

docker run -d -v /var/run/docker.sock:/var/run/docker.sock --rm -p 4566:4566 --name aws localstack/localstack

#check if the container exists
container=$(docker container ps -f "name=aws")

#if the container is not running exit 
if [ -z "$container" ];
then
    echo "Failed to create a container"
    exit 1
fi

echo -e "\n*** Installing dependencies ***"
npm install

echo -e "\n *** Generating JavaScript ***"
npm run build
clear

echo -e "\n *** Starting application ***"
npm run start
clear

echo -e "\n *** Setting up lambda ***"
mkdir average && cp -r dist average/functions/average.js
zip -r average.zip average
clear

echo -e "\n *** Creating lamda rules ***"
aws iam create-role --role-name lambdarole --assume-role-policy-document file://role_policy.json --query 'Role.Arn' \
 --endpoint-url=http://localhost:4566

 aws iam put-role-policy --role-name lambdarole \
 --policy-name lambdapolicy --policy-document file://policy.json --endpoint-url=http://localhost:4566

 aws lambda create-function --function-name average \
 --zip-file fileb://average.zip --handler average/dist/functions/average.lambdaHandler \
 --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambdarole --endpoint-url=http://localhost:4566

clear
echo -e "\n *** Setting up ***"
npm run setup