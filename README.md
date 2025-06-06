<h3 align="center">
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png" width="100" alt="Logo"/><br/>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
	Catppuccin Icons for <a href="https://zed.dev/">Zed</a>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/catppuccin/zed-icons/stargazers"><img src="https://img.shields.io/github/stars/catppuccin/zed-icons?colorA=363a4f&colorB=b7bdf8&style=for-the-badge"></a>
	<a href="https://github.com/catppuccin/zed-icons/issues"><img src="https://img.shields.io/github/issues/catppuccin/zed-icons?colorA=363a4f&colorB=f5a97f&style=for-the-badge"></a>
	<a href="https://github.com/catppuccin/zed-icons/contributors"><img src="https://img.shields.io/github/contributors/catppuccin/zed-icons?colorA=363a4f&colorB=a6da95&style=for-the-badge"></a>
</p>

<p align="center">
	<img src="https://raw.githubusercontent.com/catppuccin/vscode-icons/v1.18.0/assets/catwalk.webp"/>
</p>

<p align="center">
	<img src="assets/preview.webp"/>
</p>

## Previews

<details>
<summary>🌻 Latte</summary>
<img src="assets/latte.webp"/>
</details>
<details>
<summary>🪴 Frappé</summary>
<img src="assets/frappe.webp"/>
</details>
<details>
<summary>🌺 Macchiato</summary>
<img src="assets/macchiato.webp"/>
</details>
<details>
<summary>🌿 Mocha</summary>
<img src="assets/mocha.webp"/>
</details>

## Usage

1. Open Zed.
2. Open the command palette (<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) and enter _zed: extensions_.
3. Search for the _Catppuccin Icons_ extension and install.
4. Enter _icon theme selector: toggle_ in the command palette and select the Catppuccin Icons theme in your preferred flavor in the dropdown.

## Development

<details>

### Theme Generation

Get started by installing the following:

1. [deno](https://docs.deno.com/runtime/getting_started/installation/), zero-config runtime for typescript
used to easily pull `vscode-icons`'s [`fileIcons.ts`](src/vscode-icons/src/defaults/fileIcons.ts) definitions.
2. [just](https://just.systems/man/en/packages.html), a simple command line runner.

Once installed, run the following to initialize the project & generate all JSON definitions in the `icon_themes/` directory.

```bash
just setup
just build
```

</details>

### Publishing to the Marketplace

See the [Zed documentation](https://zed.dev/docs/extensions/developing-extensions#updating-an-extension) for more information.

## 💝 Thanks to

- [tecandrew](https://github.com/tecandrew)

&nbsp;

<p align="center">
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/footers/gray0_ctp_on_line.svg?sanitize=true" />
</p>

<p align="center">
	Copyright &copy; 2021-present <a href="https://github.com/catppuccin" target="_blank">Catppuccin Org</a>
</p>

<p align="center">
	<a href="https://github.com/catppuccin/catppuccin/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor=d9e0ee&colorA=363a4f&colorB=b7bdf8"/></a>
</p>
