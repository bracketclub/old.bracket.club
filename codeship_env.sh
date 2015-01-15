#!/usr/bin/env bash

if [ "$CI_BRANCH" == "master" ]; then
    DIVSHOT_ENV="production"
elif [ "$CI_BRANCH" == "staging" ]; then
    DIVSHOT_ENV="staging"
else
    DIVSHOT_ENV="development"
fi
echo $DIVSHOT_ENV