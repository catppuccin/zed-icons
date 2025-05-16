default:
    just --list

alias i := setup
alias init := setup
[doc('pull icons from `src/vscode-icons` submodule')]
@setup:
    git submodule update --init --recursive
    mkdir -p icons
    cp -r src/vscode-icons/icons/{frappe,latte,macchiato,mocha} icons/

# build catppuccin-icons.json Zed theme template
[working-directory: 'src']
@build:
    deno task run

alias publish := deploy
[doc('git push tag to trigger PR request to zed-industries/extensions')]
[group('github')]
[confirm]
@deploy tag:
    git tag -s {{ tag }} -m {{ tag }}
    git push origin {{ tag }}
    gh release create {{ tag }} --generate-notes --draft

[group('github')]
@act event_name="" +args="":
    act -P ubuntu-24.04-arm=catthehacker/ubuntu:act-latest {{ event_name }} -s GITHUB_TOKEN="$(gh auth token)" {{ args }}

alias aj := act-job
[group('github')]
@act-job job_name:
    act -P ubuntu-24.04-arm=catthehacker/ubuntu:act-latest -j {{ job_name }} -s GITHUB_TOKEN="$(gh auth token)"
