import { HttpClient } from "@actions/http-client";
import { PersonalAccessTokenCredentialHandler } from "@actions/http-client/lib/auth";
import * as utilities from "@github/utilities";

type Inputs = 
{
    api_version: string;
    token: string;
    repository: string;
    owner: string;
    name: string;
    description: string;
    delete_branch_on_merge: string;
    allow_auto_merge: string;
};

type Body = 
{
    name: string;
    description: string;
    delete_branch_on_merge: boolean;
    allow_auto_merge: boolean;
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
                .setIfNotEmpty("name", inputs.name)
                .setIfNotEmpty("description", inputs.description)
                .setIfNotEmpty("allow_auto_merge", inputs.allow_auto_merge)
                .setIfNotEmpty("delete_branch_on_merge", inputs.delete_branch_on_merge);

            const response = await client.patchJson
            (
                utilities.http.buildUrl
                (
                    "https://api.github.com/repos/{owner}/{repository}",
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
