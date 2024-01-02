#!/usr/bin/env bash

while getopts owner:repository:token:api_version:ruleset_path: flag
do
    case "${flag}" in
        owner) owner=${OPTARG};;
        repository) repository=${OPTARG};;
        token) token=${OPTARG};;
        api_version) api_version=${OPTARG};;
        ruleset_path) ruleset_path=${OPTARG};;
    esac
done

curl \
    -L \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $token" \
    -H "X-GitHub-Api-Version: $api_version" \
    https://api.github.com/repos/$owner/$repository/rulesets \
    -d "@$ruleset_path"
