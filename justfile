default: setup generate build

alias i := setup
alias install := setup
@setup:
    git submodule update --init --recursive
    uv sync --frozen

alias run := generate
@generate: setup
    uv run --no-sync python3 src/generate.py
    echo '-- OK - Generated icons in "icons/"'

# build zed JSON template
@build:
    whiskers zed-icons.tera
    echo "-- OK - Built 'icon_themes/catppuccin-icons.json'"

alias publish := deploy
[doc('git push tag to trigger PR request to zed-industries/extensions')]
[confirm]
@deploy tag:
    git tag -s {{ tag }} -m {{ tag }}
    git push origin {{ tag }}
    gh release create {{ tag }} --generate-notes --draft

alias t := test
@test:
    uv run --no-sync  src/test.py

alias ts := test-sync
[group('ci')]
@test-sync:
    mkdir -vp "zed/assets/icons/file_icons"
    uv run --no-sync src/sync.py

alias v := validate
@validate:
    uv run --no-sync src/test.py --validate

[group('ci')]
@act event_name="" +args="":
    act -P ubuntu-24.04-arm=catthehacker/ubuntu:act-latest {{ event_name }} -s GITHUB_TOKEN="$(gh auth token)" {{ args }}

alias aj := act-job
[group('ci')]
@act-job job_name:
    act -P ubuntu-24.04-arm=catthehacker/ubuntu:act-latest -j {{ job_name }} -s GITHUB_TOKEN="$(gh auth token)"
