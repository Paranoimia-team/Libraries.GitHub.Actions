import { StatusCodes } from "http-status-codes";

type QueryParametersKeys<TQueryTemplate extends string> = 
(
    TQueryTemplate extends `${infer TLeft}&${infer TRight}`
        ? QueryParametersKeys<TLeft> | QueryParametersKeys<TRight>
        : TQueryTemplate extends `{${infer TParameter}}`
            ? TParameter
            : never
);

type PathParametersKeys<TPathTemplate extends string> = 
(
    TPathTemplate extends `${infer TLeft}/${infer TRight}`
        ? PathParametersKeys<TLeft> | PathParametersKeys<TRight>
        :   TPathTemplate extends `?${infer TQuery}`
            ? QueryParametersKeys<TQuery>
            : TPathTemplate extends `{${infer TParameter}}`
                ? TParameter
                : never
);

type UrlParametersKeys<TUrlTemplate extends string> =
(
    TUrlTemplate extends `${string}://${infer TRight}`
        ? PathParametersKeys<TRight>
        : PathParametersKeys<TUrlTemplate>
);

export type UrlTemplateParameters<TUrl extends string> = 
{
    [key in UrlParametersKeys<TUrl>]: string;
};

export function buildUrl<TUrlTemplate extends string>
(
    template: TUrlTemplate, 
    parameters: UrlTemplateParameters<TUrlTemplate>
)
{
    if (!parameters)
        return template;

    const parts = template.split("?");

    const path = parts[0].replaceAll
    (
        /\{([A-Za-z_\.-])+\}/, 
        (full, name) => encodeURIComponent(parameters[name])
    );

    const query = parts[1]?.replaceAll
    (
        /\{([A-Za-z_\.-])+\}/, 
        (full, name) => `${encodeURIComponent(name)}=${encodeURIComponent(parameters[name])}`
    );

    return query 
        ? [path, query].join("?")
        : path;
}

export function isSuccessStatusCode(statusCode: StatusCodes)
{
    return statusCode >= 200 && statusCode <= 299;
}
