#!/usr/bin/env python3
import os
import shutil
import re
from pathlib import Path

def process_svg_files():
    # Create icons directory
    Path('./icons').mkdir(exist_ok=True)

    # Copy directories
    themes = ['frappe', 'latte', 'macchiato', 'mocha']
    for theme in themes:
        src = f"src/vscode-icons/icons/{theme}"
        dst = f"./icons/{theme}"
        shutil.copytree(src, dst, dirs_exist_ok=True)

    # Copy assets
    if os.path.exists("./assets"):
        shutil.rmtree("./assets")
    shutil.copytree("src/vscode-icons/assets", "./assets")

    # Process SVG files
    for theme in themes:
        svg_files = Path(f'icons/{theme}').glob('*.svg')
        for file_path in svg_files:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Apply transformations
            content = re.sub(r'width="[^"]*"', '', content)
            content = re.sub(r'height="[^"]*"', '', content)
            content = re.sub(r'viewBox="[^"]*"', '', content)
            content = re.sub(r'<svg ', '<svg viewBox="0 0 24 24" ', content)
            content = re.sub(r'\s{2,}', ' ', content)
            content = re.sub(r' >', '>', content)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Processed {file_path}")

if __name__ == "__main__":
    process_svg_files()