import { Choice } from './SlashCommandOptions';

/**
 * A collection of utility method for slash command option choice.
 */
export class ChoicesUtils extends null {
    /**
     * Creates a choices array using key of `record` as name and it's value as `value`.
     * @param record The record to transform
     * @returns A array of choices
     * @example
     * nameValueRecord({
     *    cat: 0,
     *    dog: 1,
     *    rabbit: 2,
     * })
     * // Return
     * [
     *      { name: 'cat', value: 0 },
     *      { name: 'dog', value: 1 },
     *      { name: 'rabbit', value: 2 },
     * ]
     */
    static nameValueRecord<T extends string | number>(record: Record<string, T>): ReadonlyArray<Choice<T>> {
        return Object.entries(record).map(([name, value]) => {
            return { name, value };
        });
    }

    /**
     * Creates a choices array using key of `record` as value and it's key as value.
     * @param record The record to transform
     * @returns A array of choices
     * @example
     * valueNameRecord({
     *    cat: 'The Cat',
     *    dog: 'The Dog',
     *    rabbit: 'The Rabbit',
     * })
     * // Return
     * [
     *      { name: 'The Cat', value: 'cat' },
     *      { name: 'The Dog', value: 'dog' },
     *      { name: 'The Rabbit', value: 'rabbit' },
     * ]
     */
    static valueNameRecord<T extends string>(record: Record<T, string>): ReadonlyArray<Choice<T>> {
        return (Object.entries<string>(record) as [T, string][]).map(([value, name]) => {
            return { name, value };
        });
    }

    /**
     * Creates a choices array using the `values` as name and value of choices.
     * @param values The value of choices
     * @returns A array of choices
     * @example
     * values('A', 'B', 'C')
     * // Return
     * [
     *     { name: 'A', value: 'A' },
     *     { name: 'B', value: 'B' },
     *     { name: 'C', value: 'C' },
     * ]
     * @example
     * values(1, 2, 3)
     * // Return
     * [
     *     { name: '1', value: 1 },
     *     { name: '2', value: 2 },
     *     { name: '3', value: 3 },
     * ]
     */
    static values<T extends (string | number)[]>(...values: T): ReadonlyArray<Choice<T[number]>> {
        return values.map((value) => {
            return { name: `${value}`, value };
        });
    }
}
