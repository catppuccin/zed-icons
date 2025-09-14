import { flavorEntries, version } from "@catppuccin/palette";
import { fileIcons } from "./vscode-icons/src/defaults/fileIcons.ts";

console.log("-- ctp/palette v" + version);

const ZED_THEME = {
  $schema: "https://zed.dev/schema/icon_themes/v0.2.0.json",
  name: "Catppuccin Icons",
  author: "Catppuccin <releases@catppuccin.com>",
  themes: [],
};

const THEME_OVERRIDES = {
  chevron_icons: {
    collapsed: null,
    expanded: null,
  },
  file_stems: {
    LICENSE: "license",
    README: "readme",
    "README.md": "readme",
    "README.txt": "readme",
    Makefile: "makefile",
    Caddyfile: "caddy",
    ".DS_Store": "macos",
  },
};

// stage 1: create `file_suffixes` for zed schema
// example: `{ "aep": "adobe-ae" }`
let suffixEntries = {};
suffixEntries["file_suffixes"] = {
  Rproj: "rproj",
  Rmd: "rmd",
  RData: "rdata",
  Rhistory: "r",
  Dockerfile: "docker",
};
for (const [vsCodeFileIcons_key, vscodeFileIcons_value] of Object.entries(
  fileIcons,
)) {
  vscodeFileIcons_value.fileNames?.forEach((data) => {
    if (!suffixEntries.hasOwnProperty(data)) {
      suffixEntries["file_suffixes"][data] = vsCodeFileIcons_key;
    } else {
      console.warn(
        `-- Key '${vsCodeFileIcons_key}' already exists, appending anyway...`,
      );
      suffixEntries["file_suffixes"][data] = vsCodeFileIcons_key;
    }
  });

  vscodeFileIcons_value.fileExtensions?.forEach((data) => {
    if (!suffixEntries.hasOwnProperty(data)) {
      suffixEntries["file_suffixes"][data] = vsCodeFileIcons_key;
    } else {
      console.warn(
        `-- Key '${vsCodeFileIcons_key}' already exists, appending anyway...`,
      );
      suffixEntries["file_suffixes"][data] = vsCodeFileIcons_key;
    }
  });
}

// stage 2: compile flavor specific properties
const FILE_ICON_OVERRIDES = {
  lock: "lock",
  settings: "config",
};

function createDirectoryIcons(flvr: string) {
  return {
    directory_icons: {
      collapsed: `./icons/${flvr}/_folder.svg`,
      expanded: `./icons/${flvr}/_folder_open.svg`,
    },
  };
}

const themes = flavorEntries.map(([id, flavor]) => {
  const localFileIconEntries: {
    file_icons: { [key: string]: { path: string } };
  } = { file_icons: {} };

  // Theme-specific properties
  const currentFlavorProperties = {
    name: `Catppuccin ${flavor.name}`,
    appearance: flavor.dark ? "dark" : "light",
  };

  const directoryIconsEntries = createDirectoryIcons(id);

  // Populate from vscode-icons defaults first
  for (const [vsCodeFileIcons_key, _] of Object.entries(fileIcons)) {
    localFileIconEntries["file_icons"][vsCodeFileIcons_key] = {
      path: `./icons/${id}/${vsCodeFileIcons_key}.svg`,
    };
  }

  // Apply FILE_ICON_OVERRIDES
  for (const [overrideKey, iconName] of Object.entries(FILE_ICON_OVERRIDES)) {
    localFileIconEntries["file_icons"][overrideKey] = {
      path: `./icons/${id}/${iconName}.svg`,
    };
  }

  return {
    ...currentFlavorProperties,
    ...directoryIconsEntries,
    ...THEME_OVERRIDES,
    ...suffixEntries,
    ...localFileIconEntries,
  };
});

ZED_THEME.themes.push(...themes);

// stage 3: create final theme
const ZED_THEME_JSON = JSON.stringify(ZED_THEME, null, 2);
const ZED_THEME_FILENAME = "../icon_themes/catppuccin-icons.json";
// console.log(ZED_THEME_JSON);

try {
  await Deno.writeTextFile(ZED_THEME_FILENAME, ZED_THEME_JSON);
  console.log(`Data successfully saved to ${ZED_THEME_FILENAME}`);
} catch (error) {
  console.error("Error writing to file:", error);
}
