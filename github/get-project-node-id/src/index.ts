import { HttpClient } from "@actions/http-client";
import { PersonalAccessTokenCredentialHandler } from "@actions/http-client/lib/auth";
import * as utilities from "@github/utilities";

type Inputs = 
{
    organization: string;
    project: string;
    token: string;
};

type Outputs = 
{
    node_id: string;
};

type Body = 
{
    query?: string;
};

type Response = 
{
    data: 
    {
        organization: 
        {
            projectV2:
            { 
                id: string;
            }
        }
    }
};

await utilities.github_core.run<Inputs, Outputs>
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
                query 
                { 
                    organization(login: "${inputs.organization}")
                    { 
                        projectV2(number: ${inputs.project}) 
                        { 
                            id
                        }
                    } 
                }
                `
            );

            const body: Body = { query };

            const response = await client.postJson<Response>
            (
                "https://api.github.com/graphql",
                body
            );

            if (!utilities.http.isSuccessStatusCode(response.statusCode))
            {
                throw new Error("Unexpected API response", { cause: response });
            }

            return {
                node_id: response.result.data.organization.projectV2.id
            };
        }
        finally
        {
            client.dispose();
        }
    }
);

export {}
