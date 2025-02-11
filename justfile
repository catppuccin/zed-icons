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

[group('ci')]
@act event_name="":
    act -P ubuntu-24.04-arm=catthehacker/ubuntu:act-latest {{ event_name }}

alias aj := act-job

[group('ci')]
@act-job job_name:
    act -P ubuntu-24.04-arm=catthehacker/ubuntu:act-latest -j {{ job_name }}
