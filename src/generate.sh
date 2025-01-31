#!/bin/bash

mkdir -p ./icons
for dir in frappe latte macchiato mocha; do
    cp -r "src/vscode-icons/icons/$dir" "./icons/"
done
rm -rf "./assets"
cp -r "src/vscode-icons/assets" "./assets"

for theme in frappe latte macchiato mocha; do
    for file in icons/$theme/*.svg; do
        sed -i '' \
            -e 's/width="[^"]*"//g' \
            -e 's/height="[^"]*"//g' \
            -e 's/viewBox="[^"]*"//g' \
            -e 's/<svg /<svg viewBox="0 0 24 24" /' \
            -e 's/[[:space:]]\{2,\}/ /g' \
            -e 's/ >/>/g' \
            "$file"
        echo "Processed $file"
    done
done