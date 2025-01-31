#!/bin/bash

# Create the destination directory if it doesn't exist
mkdir -p ./icons

# Copy the specified directories
for dir in frappe latte macchiato mocha; do
    cp -r "src/vscode-icons/icons/$dir" "./icons/"
done
