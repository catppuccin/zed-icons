import { deepStrictEqual, equal, ok } from "node:assert/strict";
import { flavorEntries } from "@catppuccin/palette";

Deno.test("monochrome themes retain associations and resolve recolored assets", async () => {
  const root = new URL("../", import.meta.url);
  const { themes } = JSON.parse(
    await Deno.readTextFile(new URL("icon_themes/catppuccin-icons.json", root)),
  );
  equal(themes.length, 8);
  for (const [id, flavor] of flavorEntries) {
    const name = `Catppuccin ${flavor.name}`;
    const original = themes.find((theme: { name: string }) =>
      theme.name === name
    );
    const monochrome = themes.find((theme: { name: string }) =>
      theme.name === `${name} Monochrome`
    );
    ok(original && monochrome, `Missing ${name} variant`);
    deepStrictEqual(
      JSON.parse(
        JSON.stringify(monochrome)
          .replaceAll(`${id}-monochrome/`, `${id}/`)
          .replace(`${name} Monochrome`, name),
      ),
      original,
    );
    const paths = new Set<string>(
      JSON.stringify(monochrome).match(/\.\/icons\/[^" ]+\.svg/g),
    );
    ok(paths.size > 0);
    for (const path of paths) {
      const svg = await Deno.readTextFile(new URL(path, root));
      ok(!svg.includes("var("), `Unresolved color in ${path}`);
      ok(svg.includes(flavor.colors.text.hex), `Missing text color in ${path}`);
      const source = await Deno.readTextFile(
        new URL(
          `src/vscode-icons/icons/css-variables/${path.split("/").pop()}`,
          root,
        ),
      );
      equal(
        svg,
        source.replaceAll(/var\(--vscode-ctp-\w+\)/g, flavor.colors.text.hex),
        `Geometry or non-palette SVG attributes changed in ${path}`,
      );
    }
  }
});
