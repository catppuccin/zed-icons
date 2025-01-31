#!/bin/bash

# Script assumes it's run from project root
json_file="icon_themes/catppuccin-icons.json"
ok_count=0
missing_icon_count=0
missing_json_count=0

validate_only=false
if [ "$1" == "--validate" ]; then
    validate_only=true
fi

# Get and check all defined paths
while IFS=$'\t' read -r theme type path; do
    if [ -f "${path#./}" ]; then
        echo "✓ | OK | $theme | $type: \"path\": $path"
        ((ok_count++))
    else
        echo "✗ | Missing Icon | $theme | $type: \"path\": $path"
        ((missing_icon_count++))
    fi
done < <(jq -r '
    .themes[] | .name as $theme | (
        (.directory_icons | to_entries[] | [$theme, "directory/\(.key)", .value]),
        (.file_icons | to_entries[] | [$theme, "file/\(.key)", .value.path])
    ) | @tsv
' "$json_file")

total_defined=$((ok_count + missing_icon_count))

# Check for undefined files only if not in validate mode
if [ "$validate_only" = false ]; then
    for theme in latte frappe macchiato mocha; do
        case $theme in
            latte) theme_name="Catppuccin Latte" ;;
            frappe) theme_name="Catppuccin Frappé" ;;
            macchiato) theme_name="Catppuccin Macchiato" ;;
            mocha) theme_name="Catppuccin Mocha" ;;
        esac

        while IFS= read -r file; do
            rel_path="./icons/$theme/$(basename "$file")"
            if ! jq -e --arg path "$rel_path" '
                .themes[].file_icons[].path == $path or
                .themes[].directory_icons[] == $path
            ' "$json_file" >/dev/null; then
                echo "✗ | Missing JSON Definition | $theme_name | undefined: \"path\": $rel_path"
                ((missing_json_count++))
            fi
        done < <(find "icons/$theme" -maxdepth 1 -name "*.svg" 2>/dev/null)
    done
fi

echo
echo "Summary:"
echo "✓ Successful matches: $ok_count/$total_defined"
echo "✗ Missing icons: $missing_icon_count"
if [ "$validate_only" = false ]; then
    echo "✗ Missing JSON definitions: $missing_json_count"
fi

# Exit with error if any missing files
if [ "$validate_only" = true ]; then
    [ $missing_icon_count -gt 0 ] && exit 1 || exit 0
else
    [ $((missing_icon_count + missing_json_count)) -gt 0 ] && exit 1 || exit 0
fi
