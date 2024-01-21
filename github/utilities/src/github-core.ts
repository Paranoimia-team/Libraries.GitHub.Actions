import * as core from "@actions/core";
import * as system from "./system";

export type GithubActionIoParameters = {
    [key: string]: string;
};

export function getInputs<TInputs extends GithubActionIoParameters>()
{
    return new Proxy
    (
        {}, 
        {
            get(target, key)
            {
                if (typeof key === 'symbol')
                    return target[key];

                let value = target[key];

                if (value === undefined)
                {
                    value = core.getInput(key);

                    target[key] = value ? value : null;
                }

                return value;
            }
        }
    ) as TInputs;
}

export function setOutputs<TOutputs extends GithubActionIoParameters>
(
    parameters: TOutputs
)
{
    for(const key in parameters)
    {
        core.setOutput(key, parameters[key]);
    }
}

export async function run
<
    TInputs extends GithubActionIoParameters | void = void,
    TOutputs extends GithubActionIoParameters | void = void
>
(
    action: (inputs: TInputs) => Promise<TOutputs> | TOutputs
)
{
    try
    {
        const inputs = getInputs();

        const outputs = await action(inputs as TInputs);

        if (outputs)
            setOutputs(outputs);
    }
    catch(error)
    {
        if (error instanceof Error)
        {
            core.error(system.stringify(error.cause));
        }
        else
        {
            core.error(system.stringify(error));
        }

        core.setFailed(error);
    }
}
