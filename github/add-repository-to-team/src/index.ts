import { HttpClient } from "@actions/http-client";
import { PersonalAccessTokenCredentialHandler } from "@actions/http-client/lib/auth";
import * as utilities from "@github/utilities";

type Inputs = 
{
    owner: string;
    organization: string;
    token: string;
    api_version: string;
    team_slug: string;
    repository: string;
    permission?: string;
};

type Body = 
{
    permission?: string;
};

await utilities.github_core.run<Inputs>
(
    async (inputs) =>
    {
        const authHandler = new PersonalAccessTokenCredentialHandler(inputs.token);

        const client = new HttpClient("Paranoimia-team", [authHandler]);
        
        try
        {
            const body = ({} as Body)
                .setIfNotEmpty("permission", inputs.permission);

            const response = await client.putJson
            (
                utilities.http.buildUrl
                (
                    "https://api.github.com/orgs/{organization}/teams/{team_slug}/repos/{owner}/{repository}",
                    inputs
                ),
                body,
                {
                    accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": inputs.api_version
                }
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
