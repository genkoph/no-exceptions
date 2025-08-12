import { ok, err, ResultPromise, type Result } from "@/result";

const handleValue = (value: unknown) => ok(value);
const handleError = (error: unknown) => err(new Error("Unknown error occurred", { cause: error }));

/**
 * Attempts to execute a synchronous function and returns a Result
 * @param thunk - A synchronous function that takes no arguments
 * @returns A Result containing the return value or an Error
 */
export function attempt(thunk: SyncThunk<never>): Result<never, Error>;

/**
 * Attempts to execute an asynchronous function and returns a ResultPromise
 * @param thunk - An asynchronous function that takes no arguments
 * @returns A ResultPromise containing the resolved value or an Error
 */
export function attempt(thunk: AsyncThunk<never>): ResultPromise<never, Error>;

/**
 * Attempts to resolve a Promise and returns a ResultPromise
 * @param promise - A Promise to resolve
 * @returns A ResultPromise containing the resolved value or an Error
 */
export function attempt(promise: Promise<never>): ResultPromise<never, Error>;

/**
 * Attempts to execute a thunk (sync or async function) and returns the appropriate Result type
 * @param thunk - A synchronous or asynchronous function that takes no arguments
 * @returns A Result for sync functions or ResultPromise for async functions
 */
export function attempt<T extends SyncThunk | AsyncThunk>(thunk: T): ThunkResult<T>;

/**
 * Attempts to execute a Promise executor and returns a ResultPromise
 * @param executor - A function that creates a Promise using resolve/reject callbacks
 * @returns A ResultPromise containing the resolved value or an Error
 */
export function attempt<T>(executor: Executor<T>): ResultPromise<T, Error>;

/**
 * Attempts to resolve a Promise and returns a ResultPromise
 * @param promise - A Promise to resolve
 * @returns A ResultPromise containing the resolved value or an Error
 */
export function attempt<T>(promise: Promise<T>): ResultPromise<T, Error>;

export function attempt(
  operation: SyncThunk | AsyncThunk | Executor | Promise<unknown>,
): Result<unknown, unknown> | ResultPromise<unknown, unknown> {
  if (operation instanceof Promise) {
    return ResultPromise.from(operation.then(handleValue).catch(handleError));
  }

  const type = operation.constructor.name;
  const argsLength = operation.length === 0;

  const isSyncThunk = type === "Function" && argsLength;
  const isAsyncThunk = type === "AsyncFunction" && argsLength;

  if (isAsyncThunk) {
    return ResultPromise.from((operation as AsyncThunk)().then(handleValue).catch(handleError));
  }

  if (isSyncThunk) {
    try {
      return handleValue((operation as SyncThunk)());
    } catch (error) {
      return handleError(error);
    }
  }

  return ResultPromise.from(new Promise(operation).then(handleValue).catch(handleError));
}

/**
 * A function that creates a Promise using resolve and reject callbacks
 * @param resolve - Callback to resolve the Promise with a value
 * @param reject - Callback to reject the Promise with an error
 */
export type Executor<T = unknown> = (
  resolve: (value: T) => void,
  reject: (error: unknown) => void,
) => void;

/**
 * A synchronous function that takes no arguments and returns a value
 */
export type SyncThunk<T = unknown> = () => T;

/**
 * An asynchronous function that takes no arguments and returns a Promise
 */
export type AsyncThunk<T = unknown> = () => Promise<T>;

/**
 * A function that takes no arguments and returns a value
 */
export type Thunk = SyncThunk | AsyncThunk;

type AnyToUnknown<T> = 0 extends 1 & NoInfer<T> ? unknown : T;
type ThunkResult<T extends Thunk, V = AnyToUnknown<ReturnType<T>>> =
  V extends Promise<infer U> ? ResultPromise<U, Error> : Result<V, Error>;
