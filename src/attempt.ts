import { ok, err, ResultPromise, type Result } from "@/result";

type AnyToUnknown<T> = 0 extends 1 & NoInfer<T> ? unknown : T;
type ThunkResult<T extends SyncThunk | AsyncThunk, V = AnyToUnknown<ReturnType<T>>> =
  V extends Promise<infer U> ? ResultPromise<U, Error> : Result<V, Error>;

const handleValue = <T>(value: T) => ok(value);
const handleError = <E>(error: E) => err(new Error("Unknown error occurred", { cause: error }));
const handlePromise = <T>(promise: Promise<T>) =>
  ResultPromise.create(promise.then(handleValue).catch(handleError));

/**
 * A synchronous function that returns a value.
 * @template T The type of the returned value
 */
export type SyncThunk<T = unknown> = () => T;

/**
 * An asynchronous function that returns a Promise.
 * @template T The type of the Promise's resolved value
 */
export type AsyncThunk<T = unknown> = () => Promise<T>;

/**
 * A function that follows the Promise executor pattern.
 * @template T The type of the resolved value
 */
export type Executor<T = unknown> = (
  resolve: (value: T) => void,
  reject: (error: unknown) => void,
) => void;

/**
 * Attempts to execute a synchronous function that returns never, catching any errors.
 * @param thunk The synchronous function to execute
 * @returns A Result containing the success value or error
 */
export function attempt(thunk: SyncThunk<never>): Result<never, Error>;

/**
 * Attempts to execute an asynchronous function that returns never, catching any errors.
 * @param thunk The asynchronous function to execute
 * @returns A ResultPromise containing the success value or error
 */
export function attempt(thunk: AsyncThunk<never>): ResultPromise<never, Error>;

/**
 * Attempts to execute a Promise that resolves to never, catching any errors.
 * @param promise The Promise to execute
 * @returns A ResultPromise containing the success value or error
 */
export function attempt(promise: Promise<never>): ResultPromise<never, Error>;

/**
 * Attempts to execute a synchronous or asynchronous function, catching any errors.
 * @param thunk The function to execute (sync or async)
 * @returns A Result or ResultPromise containing the success value or error
 */
export function attempt<T extends SyncThunk | AsyncThunk>(thunk: T): ThunkResult<T>;

/**
 * Attempts to execute a Promise executor function, catching any errors.
 * @param executor The executor function to execute
 * @returns A ResultPromise containing the success value or error
 */
export function attempt<T = unknown>(executor: Executor<T>): ResultPromise<T, Error>;

/**
 * Attempts to execute a Promise, catching any errors.
 * @param promise The Promise to execute
 * @returns A ResultPromise containing the success value or error
 */
export function attempt<T>(promise: Promise<T>): ResultPromise<T, Error>;

export function attempt(
  operation: SyncThunk | AsyncThunk | Executor | Promise<unknown>,
): Result<unknown, unknown> | ResultPromise<unknown, unknown> {
  if (operation instanceof Promise) {
    return handlePromise(operation);
  }

  if (operation.length === 0) {
    try {
      const value = (operation as SyncThunk | AsyncThunk)();

      if (value instanceof Promise) {
        return handlePromise(value);
      }

      return handleValue(value);
    } catch (error) {
      return handleError(error);
    }
  }

  return handlePromise(new Promise(operation));
}
