import { HttpClient } from "@actions/http-client";
import { PersonalAccessTokenCredentialHandler } from "@actions/http-client/lib/auth";
import * as utilities from "@github/utilities";

type Inputs = 
{
    project: string;
    repository: string;
    token: string;
};

type Body =
{
    query: string;
};

await utilities.github_core.run<Inputs>
(
    async (inputs) =>
    {
        const authHandler = new PersonalAccessTokenCredentialHandler(inputs.token);

        const client = new HttpClient("Paranoimia-team", [authHandler]);
        
        try
        {
            const query = utilities.graph_ql.minify
            (
                `
                mutation 
                {
                    linkProjectV2ToRepository
                    (
                        input: 
                        { 
                            projectId: "${inputs.project}", 
                            repositoryId: "${inputs.repository}"
                        }
                    ) 
                    { 
                        clientMutationId 
                        repository { id }
                    } 
                }
                `
            );

            const body: Body = { query };

            const response = await client.postJson
            (
                "https://api.github.com/graphql",
                body
            );

            if (!utilities.http.isSuccessStatusCode(response.statusCode))
            {
                throw new Error("Unexpected API response", { cause: response });
            }
        }
        finally
        {
            client.dispose();
        }
    }
);

export {}
