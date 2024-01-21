import { HttpClient } from "@actions/http-client";
import { PersonalAccessTokenCredentialHandler } from "@actions/http-client/lib/auth";
import * as utilities from "@github/utilities";
import fs from "fs";
import * as core from "@actions/core";

type Inputs = 
{
    owner: string;
    repository: string;
    token: string;
    api_version: string;
    ruleset_path: string;
};

await utilities.github_core.run<Inputs>
(
    async (inputs) =>
    {
        const authHandler = new PersonalAccessTokenCredentialHandler(inputs.token);

        const client = new HttpClient("Paranoimia-team", [authHandler]);
        
        try
        {
            const json = await fs.promises.readFile(inputs.ruleset_path, { encoding: "utf-8" });

            const body = JSON.parse(json);

            const url = utilities.http.buildUrl
            (
                "https://api.github.com/repos/{owner}/{repository}/rulesets",
                inputs
            );

            core.info(`POST ${url}`);
            core.info(`Body ${utilities.system.stringify(body)}`);

            const response = await client.postJson
            (
                url,
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

            core.info(`Success ${utilities.system.stringify(response)}`);
        }
        finally
        {
            client.dispose();
        }
    }
);

export {}
