#!/usr/bin/env bash

while [ $# -gt 0 ] ; do
  case $1 in
    --repository) repository=$2;;
    --project) project=$2;;
    --token) token=$2;;
  esac
  shift
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
        "query": "$(get_query | tr -d '\n' | tr -d ' ' | jq -Rs)"
    }
EOF
}

body=$(get_body | jq -c)

echo "Body"
echo $body

curl \
    -X POST \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    https://api.github.com/graphql \
    -d $body \
    -v
