#!/bin/sh

if [ "$NODE_ENV" == "production" ]
then
  npm run start

elif [ "$NODE_ENV" == "development" ]
then
  npm run dev
fi
