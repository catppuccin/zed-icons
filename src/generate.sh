#!/bin/bash

mkdir -p ./icons
for dir in frappe latte macchiato mocha; do
    cp -r "src/vscode-icons/icons/$dir" "./icons/"
done
