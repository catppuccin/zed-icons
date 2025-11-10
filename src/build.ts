import { flavorEntries, version } from "@catppuccin/palette";
import { fileIcons } from "./vscode-icons/src/defaults/fileIcons.ts";
import { folderIcons } from "./vscode-icons/src/defaults/folderIcons.ts";

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
  // apply case-sensitive file icon fixes here
  file_stems: {
    LICENSE: "license",
    README: "readme",
    "README.md": "readme",
    "README.txt": "readme",
    Makefile: "makefile",
    Caddyfile: "caddy",
    ".DS_Store": "macos",
    "CMakeLists.txt": "cmake",
    "Cargo.lock": "cargo-lock",
    "Cargo.toml": "cargo",
  },
};

// define method to define folder icons
// example:
// ".angular": {
//     "collapsed": "./icons/folder_angular.svg",
//     "expanded": "./icons/folder_angular_open.svg"
//   }
// }
function createDirectoryIcons(flvr: string) {
  let namedDirectoryIconEntries = {};
  namedDirectoryIconEntries["named_directory_icons"] = {};

  let defaultFolderIcons = {};
  defaultFolderIcons["directory_icons"] = {
    collapsed: `./icons/${flvr}/_folder.svg`,
    expanded: `./icons/${flvr}/_folder_open.svg`,
  };

  for (const [vsCodeFolderIcons_key, vscodeFolderIcons_value] of Object.entries(
    folderIcons,
  )) {
    vscodeFolderIcons_value.folderNames?.forEach((data) => {
      namedDirectoryIconEntries["named_directory_icons"][data] = {
        collapsed: `./icons/${flvr}/folder_${vsCodeFolderIcons_key}.svg`,
        expanded: `./icons/${flvr}/folder_${vsCodeFolderIcons_key}_open.svg`,
      };
    });
  }

  // console.log(namedDirectoryIconEntries);
  // console.log(defaultFolderIcons);

  return {
    ...defaultFolderIcons,
    ...namedDirectoryIconEntries,
  };
}

try {
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
  await Deno.writeTextFile(ZED_THEME_FILENAME, ZED_THEME_JSON);
  console.log(`Data successfully saved to ${ZED_THEME_FILENAME}`);
} catch (error) {
  console.error("Preview generation failed: ", error);
  Deno.exit(1);
}
