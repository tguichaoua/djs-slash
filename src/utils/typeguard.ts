export type TypeGuard<T> = (o: unknown) => o is T;
export type GuardedType<G extends TypeGuard<unknown>> = G extends (o: unknown) => o is infer T ? T : never;

export function isRecord<Specs extends Record<string, TypeGuard<unknown>>>(
    specs: Specs,
): (o: unknown) => o is { [K in keyof Specs]: GuardedType<Specs[K]> } {
    return (o): o is { [K in keyof Specs]: GuardedType<Specs[K]> } =>
        typeof o === 'object' &&
        o !== null &&
        Object.entries(specs).every(([key, guard]) => guard((o as Record<string, unknown>)[key]));
}

export function isRecordOf<T>(guard: TypeGuard<T>): (o: unknown) => o is Record<string, T> {
    return (o): o is Record<string, T> => typeof o === 'object' && o !== null && Object.values(o).every(guard);
}

type TypeOfToType<T> = T extends 'string'
    ? string
    : T extends 'number'
    ? number
    : T extends 'bigint'
    ? bigint
    : T extends 'boolean'
    ? boolean
    : T extends 'symbol'
    ? symbol
    : T extends 'undefined'
    ? undefined
    : T extends 'object'
    ? Record<string, unknown>
    : T extends 'function'
    ? Function // eslint-disable-line @typescript-eslint/ban-types
    : never;

export function isTypeof<
    Types extends ('string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function')[],
>(...types: Types): (o: unknown) => o is TypeOfToType<Types[number]> {
    return (o): o is TypeOfToType<Types[number]> => types.includes(typeof o);
}

export function isArrayOf<T>(guard: TypeGuard<T>): (o: unknown) => o is T[] {
    return (o): o is T[] => Array.isArray(o) && o.every((e) => guard(e));
}

export function isOptionnal<T>(guard: TypeGuard<T>): (o: unknown) => o is T | undefined {
    return (o): o is T | undefined => typeof o === 'undefined' || guard(o);
}
