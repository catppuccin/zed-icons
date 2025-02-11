"""
To be used in CI

Determine diffs between `file_types.json`
and generate `catppuccin-icons.json`
"""

import json
import re
import logging
import os

LOGLEVEL = os.environ.get('LOGLEVEL', 'INFO').upper()
logging.basicConfig(level=LOGLEVEL, format="%(asctime)s %(message)s")
log = logging.getLogger()

def check_missing_icons():
    with open('zed/assets/icons/file_icons/file_types.json') as f:
        file_types = json.load(f)

    with open('icon_themes/catppuccin-icons.json') as f:
        icon_theme = json.load(f)

    suffix_icons = set(file_types['suffixes'].values())
    theme_icons = set(icon_theme['themes'][0]['file_icons'].keys())
    missing_icons = suffix_icons - theme_icons

    if missing_icons:
        log.debug(f"Missing icons: {missing_icons}")
        print("::set-output name=updated::true")
    else:
        log.debug("OK - All Zed icons accounted for!")

    return missing_icons

def insert_missing_icons_in_template(missing_icons: set, template_path: str):
    # Read the template file
    with open(template_path, 'r') as f:
        lines = f.readlines()

    # Create the new lines for missing icons
    new_icon_lines = []
    for icon in sorted(missing_icons):
        new_icon_lines.append(f'        "{icon}": {{ "path": "./icons/{{{{ flavor.identifier }}}}/{icon}.svg" }},\n')

    # Find all lines with "file_icons": { and insert new lines after each occurrence
    modified_lines = []
    for line in lines:
        modified_lines.append(line)
        if '"file_icons": {' in line:
            modified_lines.extend(new_icon_lines)

    # Write back to file
    with open(template_path, 'w') as f:
        f.writelines(modified_lines)

    log.debug(f"Added {len(missing_icons)} new icon entries to each theme section")
    print(f"::set-output name=n_missing_icons::{len(missing_icons)}")


if __name__ == "__main__":

    missing_icons = check_missing_icons()
    insert_missing_icons_in_template(missing_icons, 'zed-icons.tera')

    # Read version from extension.toml
    with open('extension.toml', 'r') as f:
        content = f.read()
        tag_version = re.search(r'version = "(.*?)"', content).group(1) # type: ignore

    print(f"::set-output name=latest_tag::{tag_version}")
    print(f"::set-output name=missing_icons::{missing_icons}")
