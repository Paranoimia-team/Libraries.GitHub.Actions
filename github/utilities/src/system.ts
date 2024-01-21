import util from "util";

export function stringify(argument: any, depth?: number)
{
    return util.inspect(argument, false, depth ?? 3, true);
}
