import util from "util";

export function stringify(argument: any)
{
    return util.inspect(argument, false, 3, true);
}
