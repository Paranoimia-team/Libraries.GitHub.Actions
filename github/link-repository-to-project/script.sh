#!/usr/bin/env bash

while getopts repository:project:token: flag
do
    case "${flag}" in
        repository) repository=${OPTARG};;
        project) project=${OPTARG};;
        token) token=${OPTARG};;
    esac
done

get_query()
{
cat <<EOF
    mutation 
    { 
        linkRepositoryToProject
        (
            input: 
            { 
                projectId: \"$project\", 
                repositoryId: \"$repository\" 
            }
        ) 
        { 
            clientMutationId 
            project { id } 
            repository { id } 
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

curl \
    -X POST \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    https://api.github.com/graphql \
    --data $(get_body)
