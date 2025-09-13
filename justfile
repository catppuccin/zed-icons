default:
    just --list

alias i := setup
alias init := setup
[doc('pull icons from `src/vscode-icons` submodule')]
setup:
    curl -fsSL https://deno.land/install.sh | sh
    git submodule update --init --recursive

[doc('build JSON theme')]
build:
    mkdir -p icons
    cp -r src/vscode-icons/icons/{frappe,latte,macchiato,mocha} icons/
    cd src/ && deno task run

alias publish := deploy
[doc('git push tag to trigger PR request to zed-industries/extensions')]
[group('github')]
[confirm]
deploy tag:
    git tag -s {{ tag }} -m {{ tag }}
    git push origin {{ tag }}
    gh release create {{ tag }} --generate-notes --draft
