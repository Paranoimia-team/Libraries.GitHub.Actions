#!/usr/bin/env bash

while getopts owner:organization:token:api_version:team_slug:repository:permission: flag
do
    case "${flag}" in
        owner) owner=${OPTARG};;
        organization) organization=${OPTARG};;
        token) token=${OPTARG};;
        api_version) api_version=${OPTARG};;
        team_slug) team_slug=${OPTARG};;
        owner) owner=${OPTARG};;
        repository) repository=${OPTARG};;
        permission) permission=${OPTARG};;
    esac
done

data=$([ -z "$permission" ] && echo '{}' || echo '{"permission":"$permission"}')

curl \
    -L \
    -X PUT \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $token" \
    -H "X-GitHub-Api-Version: $api_version" \
    https://api.github.com/orgs/$organization/teams/$team_slug/repos/$owner/$repository \
    -d $data
