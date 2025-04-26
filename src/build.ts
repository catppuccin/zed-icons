import { flavorEntries, version } from "@catppuccin/palette";
import { fileIcons } from "./vscode-icons/src/defaults/fileIcons.ts";

console.log("-- ctp/palette v" + version);

const ZED_THEME = {
  "$schema": "https://zed.dev/schema/icon_themes/v0.2.0.json",
  "name": "Catppuccin Icons",
  "author": "Catppuccin <releases@catppuccin.com>",
  "themes": []
};

const THEME_OVERRIDES = {
  "chevron_icons": {
    "collapsed": null,
    "expanded": null
  },
  "file_stems": {
    "LICENSE": "license",
    "README": "readme",
    "Makefile": "makefile",
    "Caddyfile": "caddy",
    "Dockerfile": "docker"
  }
}

// stage 1: create `file_suffixes` for zed schema
// example: `{ "aep": "adobe-ae" }`
let suffixEntries = {};
suffixEntries["file_suffixes"] = {};
for (const [vsCodeFileIcons_key, vscodeFileIcons_value] of Object.entries(fileIcons)) {

  vscodeFileIcons_value.fileNames?.forEach(data => {
    if (!suffixEntries.hasOwnProperty(data)) {
      suffixEntries["file_suffixes"][data] = vsCodeFileIcons_key;
    } else {
      console.warn(`-- Key '${vsCodeFileIcons_key}' already exists, appending anyway...`);
      suffixEntries["file_suffixes"][data] = vsCodeFileIcons_key;
    }
  });

  vscodeFileIcons_value.fileExtensions?.forEach(data => {
    if (!suffixEntries.hasOwnProperty(data)) {
      suffixEntries["file_suffixes"][data] = vsCodeFileIcons_key;
    } else {
      console.warn(`-- Key '${vsCodeFileIcons_key}' already exists, appending anyway...`);
      suffixEntries["file_suffixes"][data] = vsCodeFileIcons_key;
    }
  });
}

// stage 2: compile flavor specific properties
let THEME = {};
const fileIconEntries = {};
fileIconEntries["file_icons"] = {};
const flavorProperties: { [key: string]: any } = {};

function createDirectoryIcons(flvr: string) {
  return {
    directory_icons: {
      collapsed: `./icons/${flvr}/_folder.svg`,
      expanded: `./icons/${flvr}/_folder_open.svg`
    }
  };
}

flavorEntries.map(([_, flavor]) => {

  const flvr = flavor.name.replace('é', 'e').toLowerCase();
  // console.log(`-- Generating paths for ${flavor.name} (${flvr})`)

  flavorProperties["name"] = `Catppuccin ${flavor.name}`
  flavorProperties["appearance"] = `${flavor.dark ? "dark" : "light"}`;
  const directoryIconsEntries = createDirectoryIcons(flvr);

  for (const [vsCodeFileIcons_key, _] of Object.entries(fileIcons)) {

    if (!fileIconEntries.hasOwnProperty(vsCodeFileIcons_key)) {
      fileIconEntries["file_icons"][vsCodeFileIcons_key] = { "path": `./icons/${flvr}/${vsCodeFileIcons_key}.svg` };
    } else {
      // console.warn(`-- Key '${"file_icons"}' already exists, appending anyway...`);
      fileIconEntries["file_icons"][vsCodeFileIcons_key] = { "path": `./icons/${flvr}/${vsCodeFileIcons_key}.svg` };
    }
  }

  THEME = { ...flavorProperties, ...directoryIconsEntries, ...THEME_OVERRIDES, ...suffixEntries, ...fileIconEntries };
  ZED_THEME.themes.push(THEME);
});

// stage 3: create final theme
const ZED_THEME_JSON = JSON.stringify(ZED_THEME, null, 2);
const ZED_THEME_FILENAME = "../icon_themes/catppuccin-icons.json";
console.log(ZED_THEME_JSON);

try {
  await Deno.writeTextFile(ZED_THEME_FILENAME, ZED_THEME_JSON);
  console.log(`Data successfully saved to ${ZED_THEME_FILENAME}`);
} catch (error) {
  console.error("Error writing to file:", error);
}
