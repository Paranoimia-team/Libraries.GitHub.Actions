declare global
{
    interface Object
    {
        setIfNotEmpty<TThis extends object>(this: TThis, key: keyof TThis, value: TThis[typeof key]): TThis;
    }
}

Object.prototype.setIfNotEmpty = function <TThis extends object>(this: TThis, key: keyof TThis, value: TThis[typeof key]): TThis
{
    if (value !== undefined && value !== null)
    {
        this[key] = value;
    }

    return this;
};

export {}
