#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import NamedTuple

class IconStatus(NamedTuple):
    ok_count: int = 0
    missing_icon_count: int = 0
    missing_json_count: int = 0

def validate_icons(validate_only: bool = False) -> IconStatus:
    json_file = "icon_themes/catppuccin-icons.json"

    # Load JSON data
    with open(json_file, 'r') as f:
        data = json.load(f)

    ok_count = missing_icon_count = missing_json_count = 0

    # Check defined paths
    for theme in data['themes']:
        theme_name = theme['name']

        # Check directory icons
        for key, path in theme['directory_icons'].items():
            if Path(path.lstrip('./')).exists():
                print(f"✓ | OK | {theme_name} | directory/{key}: \"path\": {path}")
                ok_count += 1
            else:
                print(f"✗ | Missing Icon | {theme_name} | directory/{key}: \"path\": {path}")
                missing_icon_count += 1

        # Check file icons
        for key, value in theme['file_icons'].items():
            path = value['path']
            if Path(path.lstrip('./')).exists():
                print(f"✓ | OK | {theme_name} | file/{key}: \"path\": {path}")
                ok_count += 1
            else:
                print(f"✗ | Missing Icon | {theme_name} | file/{key}: \"path\": {path}")
                missing_icon_count += 1

    # Check for undefined files
    if not validate_only:
        theme_map = {
            'latte': 'Catppuccin Latte',
            'frappe': 'Catppuccin Frappé',
            'macchiato': 'Catppuccin Macchiato',
            'mocha': 'Catppuccin Mocha'
        }

        for theme, theme_name in theme_map.items():
            icon_dir = Path(f"icons/{theme}")
            if icon_dir.exists():
                for svg_file in icon_dir.glob("*.svg"):
                    rel_path = f"./icons/{theme}/{svg_file.name}"
                    if not any(rel_path in str(icon) for theme in data['themes']
                             for icon in [*theme['file_icons'].values(), *theme['directory_icons'].values()]):
                        print(f"✗ | Missing JSON Definition | {theme_name} | undefined: \"path\": {rel_path}")
                        missing_json_count += 1

    # Print summary
    total_defined = ok_count + missing_icon_count
    print("\nSummary:")
    print(f"✓ Successful matches: {ok_count}/{total_defined}")
    print(f"✗ Missing icons: {missing_icon_count}")
    if not validate_only:
        print(f"✗ Missing JSON definitions: {missing_json_count}")

    return IconStatus(ok_count, missing_icon_count, missing_json_count)

if __name__ == "__main__":
    validate_only = "--validate" in sys.argv
    status = validate_icons(validate_only)

    if validate_only:
        sys.exit(1 if status.missing_icon_count > 0 else 0)
    else:
        sys.exit(1 if (status.missing_icon_count + status.missing_json_count) > 0 else 0)