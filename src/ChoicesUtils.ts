import { Choice } from './SlashCommandOptions';

/**
 * A collection of utility method for slash command option choice.
 */
export class ChoicesUtils extends null {
    /**
     * Creates a choices array using key of `record` as name and it's value as `value`.
     * @param record The record to transform
     * @returns A array of choices
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
     */
    static values<T extends (string | number)[]>(...values: T): ReadonlyArray<Choice<T[number]>> {
        return values.map((value) => {
            return { name: `${value}`, value };
        });
    }
}
