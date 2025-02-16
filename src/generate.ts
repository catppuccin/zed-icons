// src/generate.ts
import { fileIcons } from "./vscode-icons/src/defaults/fileIcons.ts";

// Generate mappings with 4-space indent
const suffixEntries: string[] = [];
const iconEntries: string[] = [];

for (const [iconKey, def] of Object.entries(fileIcons)) {
    iconEntries.push(`    "${iconKey}": { "path": "./icons/{{ flavor.identifier }}/${iconKey}.svg" }`);

    def.fileNames?.forEach(name =>
        suffixEntries.push(`    "${name}": "${iconKey}"`));

    def.fileExtensions?.forEach(ext =>
        suffixEntries.push(`    "${ext}": "${iconKey}"`));
}

// Read template and replace placeholders
const template = await Deno.readTextFile("./zed-icons.tmpl");
const updated = template
    .replace(
        '"file_suffixes": {',
        `"file_suffixes": { \n    ${suffixEntries.join(",\n    ")},`
    )
    .replace(
        '"file_icons": {',
        `"file_icons": {\n    ${iconEntries.join(",\n    ")},`
    );

await Deno.writeTextFile("zed-icons.tera", updated);
