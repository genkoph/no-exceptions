import { err, ok, ResultPromise, type Result } from "@/result";

type Optional<T> = T | null | undefined;
export type NonFunction = string | number | boolean | symbol | bigint | object;

type MaybePromise<T> = T | Promise<T>;
type MaybeResultPromise<T, E> = Result<T, E> | ResultPromise<T, E>;

const handleValue = <T>(value: T) =>
  value !== null && value !== undefined ? ok(value) : err(new Error("Value is null or undefined"));
const handleError = (error: unknown) => err(new Error("Promise rejected", { cause: error }));

/**
 * Ensures a Promise resolves to a non-null value
 * @param value - A Promise that may resolve to null/undefined
 * @returns ResultPromise with the non-null value or an error
 */
export function ensure<T extends Optional<NonFunction>>(
  value: Promise<T>,
): ResultPromise<NonNullable<T>, Error>;

/**
 * Ensures a value is not null or undefined
 * @param value - A value that may be null/undefined
 * @returns Result with the non-null value or an error
 */
export function ensure<T extends Optional<NonFunction>>(value: T): Result<NonNullable<T>, Error>;

export function ensure<T extends Optional<NonFunction>>(
  value: MaybePromise<T>,
): MaybeResultPromise<NonNullable<T>, Error> {
  if (value instanceof Promise) {
    return ResultPromise.from(value.then(handleValue).catch(handleError));
  }

  return handleValue(value);
}
