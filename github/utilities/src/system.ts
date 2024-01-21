declare global
{
    interface Object
    {
        setIfNotEmpty<TThis extends object>(this: TThis, key: keyof TThis, value: TThis[typeof key]): TThis;
    }
}

export {}
