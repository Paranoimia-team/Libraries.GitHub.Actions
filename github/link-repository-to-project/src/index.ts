import { HttpClient } from "@actions/http-client";
import { PersonalAccessTokenCredentialHandler } from "@actions/http-client/lib/auth";
import * as utilities from "@github/utilities";
import * as core from "@actions/core";

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
            const url = "https://api.github.com/graphql";

            core.info(`PUT ${url}`);
            core.info(`Body ${JSON.stringify(body)}`);

            const response = await client.postJson(url, body);

            if (!utilities.http.isSuccessStatusCode(response.statusCode))
            {
                throw new Error("Unexpected API response", { cause: response });
            }

            core.info(`Success ${JSON.stringify(response)}`);
        }
        finally
        {
            client.dispose();
        }
    }
);

export {}
