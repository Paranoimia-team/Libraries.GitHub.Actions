declare global
{
    interface Object
    {
        setIfNotEmpty<TThis extends Object>(this: TThis, key: keyof TThis, value: TThis[typeof key]): TThis;
    }
}

Object.defineProperty(
    Object.prototype,
    "setIfNotEmpty",
    {
        value: function <TThis extends Object>(this: TThis, key: keyof TThis, value: TThis[typeof key]): TThis
        {
            if (value !== undefined && value !== null)
            {
                this[key] = value;
            }
    
            return this;
        },
        writable: false,
        enumerable: false
    }
);

export {}
