"""
To be used in CI

Determine diffs between `file_types.json`
and generate `catppuccin-icons.json`
"""

import json
import logging
import os

LOGLEVEL = os.environ.get('LOGLEVEL', 'INFO').upper()
logging.basicConfig(level=LOGLEVEL, format="%(asctime)s %(message)s")
log = logging.getLogger()

def set_output(key: str, value: str):
    """Set output that works both locally and in GitHub Actions"""
    if 'GITHUB_OUTPUT' in os.environ:
        with open(os.environ['GITHUB_OUTPUT'], 'a') as fh:
            print(f"{key}={value}", file=fh)
    else:
        # For local testing, just print to stdout
        log.info(f"GITHUB_OUTPUT += '{key}={value}'")

def check_missing_icons():
    with open('zed/assets/icons/file_icons/file_types.json') as f:
        file_types = json.load(f)

    with open('icon_themes/catppuccin-icons.json') as f:
        icon_theme = json.load(f)

    suffix_icons = set(file_types['suffixes'].values())
    theme_icons = set(icon_theme['themes'][0]['file_icons'].keys())
    missing_icons = suffix_icons - theme_icons

    if missing_icons:
        set_output("updated", "true")
    else:
        log.info("OK - All Zed icons accounted for!")

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



if __name__ == "__main__":

    missing_icons = check_missing_icons()
    insert_missing_icons_in_template(missing_icons, 'zed-icons.tera')

    set_output("missing_icons", str(missing_icons))
    set_output("n_missing_icons", str(len(missing_icons)))
