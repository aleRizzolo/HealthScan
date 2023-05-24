#!/bin/bash

docker run -d --rm -p 4566:4566 --name aws localstack/localstack

#check if the container exists
container=$(docker container ps -f "name=aws")

#if the container is not running exit 
if [ -z "$container" ];
then
    echo "Failed to create a container"
    exit 1
fi

echo "*** Installing dependencies ***"
npm install

echo -e "\n *** Generating JavaScript ***"
npm run build
clear

echo "*** Creating clients ***"
npm run start

echo -e "\n*** Setting up ***"
npm run setup

echo -e "\n*** Populating DB ***"
npm run populate
clear