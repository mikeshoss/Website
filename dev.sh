#!/bin/bash
# Usage: ./dev.sh [branch]
# Examples:
#   ./dev.sh                                    → pulls main
#   ./dev.sh claude/build-personal-website-4bj8L → pulls that branch

BRANCH="${1:-main}"

# Kill any existing dev servers on port 4321
lsof -ti:4321 | xargs kill -9 2>/dev/null

git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"
npm install
npm run dev
