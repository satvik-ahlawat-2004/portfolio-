#!/bin/bash

echo "🚀 Updating your portfolio website..."

# Add all changes
git add .

# Get commit message from user
echo "📝 Enter a brief description of your changes:"
read commit_message

# Commit and push changes
git commit -m "$commit_message"
git push origin main

echo "✨ Changes pushed! Your site will update in 1-2 minutes."
echo "🌐 Visit https://satvik-ahlawat-2004.github.io/portfolio-/ to see your changes." 