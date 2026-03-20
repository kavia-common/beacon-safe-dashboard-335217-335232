#!/bin/bash
cd /home/kavia/workspace/code-generation/beacon-safe-dashboard-335217-335232/beacon_safe_frontend
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
 if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

