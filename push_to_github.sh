#!/bin/bash
echo "--------------------------------------------------------"
echo "  Setting up Git repository for Tagverse CRM..."
echo "--------------------------------------------------------"

# Initialize git if not already initialized
if [ ! -d .git ]; then
  git init
fi

# Add remote if not already exists
git remote remove origin 2>/dev/null
git remote add origin https://github.com/tagverseiio-png/Tagverse_crm.git

# Set branch name to main
git branch -M main

# Add files
git add index.html endpoint.js run.sh

# Commit
git commit -m "Initial commit - Tagverse CRM with Interactive Signature and SVG Reports"

echo "--------------------------------------------------------"
echo "  Files are committed locally!"
echo "  To push your code to GitHub, run:"
echo "  git push -u origin main"
echo "--------------------------------------------------------"
