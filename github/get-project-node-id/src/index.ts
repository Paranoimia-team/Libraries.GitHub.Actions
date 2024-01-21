import { HttpClient } from "@actions/http-client";
import { PersonalAccessTokenCredentialHandler } from "@actions/http-client/lib/auth";
import * as utilities from "@github/utilities";
import * as core from "@actions/core";

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
            const url = "https://api.github.com/graphql";

            core.info(`POST ${url}`);
            core.info(`Body ${utilities.system.stringify(body)}`);

            const response = await client.postJson<Response>(url, body);

            if (!utilities.http.isSuccessStatusCode(response.statusCode))
            {
                throw new Error("Unexpected API response", { cause: response });
            }

            core.info(`Success ${utilities.system.stringify(response, 5)}`);

            const result = {
                node_id: response.result.data.organization.projectV2.id
            };

            core.info(utilities.system.stringify(result));

            return result;
        }
        finally
        {
            client.dispose();
        }
    }
);

export {}
