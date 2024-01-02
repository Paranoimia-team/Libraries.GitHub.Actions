#!/usr/bin/env bash

while getopts organization:project:token: flag
do
    case "${flag}" in
        organization) organization=${OPTARG};;
        project) project=${OPTARG};;
        token) token=${OPTARG};;
    esac
done

get_query()
{
cat <<EOF
    query 
    { 
        organization(login: $organization) 
        { 
            projectV2(number: $project) 
            { 
                id 
            }
        } 
    }
EOF
}

get_body()
{
cat <<EOF
    {
        "query": "$(get_query)"
    }
EOF
}

result=$( \
    curl \
        -X POST \
        -H "Authorization: Bearer $token" \
        https://api.github.com/graphql \
        -d $(get_body) \
)

"result=$result" >> "$GITHUB_OUTPUT"
