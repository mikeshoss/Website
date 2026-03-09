#!/bin/bash
# Kill any existing dev servers on port 4321
lsof -ti:4321 | xargs kill -9 2>/dev/null
git checkout main
git pull origin main
npm install
npm run dev
