#!/bin/bash

image=$(docker run -d --rm -p 4566:4566 --name aws localstack/localstack)

#if the container is not running exit 
if [ -z "$image" ];
then
    echo "Failed to create a container"
    exit 1
fi