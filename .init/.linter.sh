#!/bin/bash
cd /home/kavia/workspace/code-generation/habit-tracker-and-progress-visualizer-27624-27766/habit_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

