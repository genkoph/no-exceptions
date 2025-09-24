type MaybePromise<T> = T | Promise<T>;

interface ResultCore<T, E> {
  /**
   * Checks if the result is an Ok variant.
   * @returns True if this is an Ok result, false otherwise.
   */
  isOk(): this is Ok<T>;

  /**
   * Checks if the result is an Err variant.
   * @returns True if this is an Err result, false otherwise.
   */
  isErr(): this is Err<E>;

  /**
   * Returns a ResultPromise that wraps this Result, allowing for async chaining.
   */
  async: ResultPromise<T, E>;

  /**
   * If this is an Ok, applies the function to the value and returns the result.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns A new Result with the transformed value or the original Err.
   */
  and<U, V>(fn: (value: T) => Result<U, V>): Result<U, E | V>;

  /**
   * If this is an Err, applies the function to the error and returns the result.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns A new Result with the transformed error or the original Ok.
   */
  andErr<U, V>(fn: (error: E) => Result<U, V>): Result<T | U, V>;

  /**
   * If this is an Ok, applies the function to the value and returns an Ok with the result.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns A new Result with the transformed value or the original Err.
   */
  map<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * If this is an Err, applies the function to the error and returns an Err with the result.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns A new Result with the transformed error or the original Ok.
   */
  mapErr<U>(fn: (error: E) => U): Result<T, U>;

  /**
   * If this is an Ok, applies the function to the value for side effects and returns this.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns This Result unchanged.
   */
  tap(fn: (value: T) => unknown): Result<T, E>;

  /**
   * If this is an Err, applies the function to the error for side effects and returns this.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns This Result unchanged.
   */
  tapErr(fn: (error: E) => unknown): Result<T, E>;

  /**
   * **⚠️ WARNING: This method can throw and should be used with extreme care!**
   *
   * Returns the contained Ok value, or a provided default if this is an Err.
   * If this is an Err result and no fallback is provided, this method will throw an error.
   *
   * Use this method only when you are absolutely certain the result is Ok, or always provide a fallback.
   * Consider using `map`, `and`, or other safe methods instead.
   * @param fallback Optional default value to return if this is an Err.
   * @returns The Ok value or the provided default.
   * @throws Error if this is an Err result and no fallback is provided.
   */
  unwrap<V = never>(fallback?: V): T | V;

  /**
   * If this is an Ok, attempts to apply the function to the value, catching any thrown errors.
   * If this is an Err, returns this Err unchanged.
   * Any thrown errors (including non-Error values) are wrapped in a generic Error with the original error as the cause.
   * @param fn Function to apply to the value if this is an Ok. If this function throws, the error will be caught and wrapped.
   * @returns A new Result with the transformed value, or an Err containing the caught error, or the original Err.
   */
  attempt<U>(fn: (value: T) => U): Result<U, E | Error>;
}

interface ResultPromiseCore<T, E> {
  /**
   * If this is an Ok, applies the function to the value and returns the result.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns A new ResultPromise with the transformed value or the original Err.
   */
  and<U, V>(fn: (value: T) => MaybePromise<Result<U, V>>): ResultPromise<U, E | V>;

  /**
   * If this is an Err, applies the function to the error and returns the result.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns A new ResultPromise with the transformed error or the original Ok.
   */
  andErr<U, V>(fn: (error: E) => MaybePromise<Result<U, V>>): ResultPromise<T | U, V>;

  /**
   * If this is an Ok, applies the function to the value and returns an Ok with the result.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns A new ResultPromise with the transformed value or the original Err.
   */
  map<U>(fn: (value: T) => MaybePromise<U>): ResultPromise<U, E>;

  /**
   * If this is an Err, applies the function to the error and returns an Err with the result.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns A new ResultPromise with the transformed error or the original Ok.
   */
  mapErr<U>(fn: (error: E) => MaybePromise<U>): ResultPromise<T, U>;

  /**
   * If this is an Ok, applies the function to the value for side effects and returns this.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns This ResultPromise unchanged.
   */
  tap(fn: (value: T) => MaybePromise<unknown>): ResultPromise<T, E>;

  /**
   * If this is an Err, applies the function to the error for side effects and returns this.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns This ResultPromise unchanged.
   */
  tapErr(fn: (error: E) => MaybePromise<unknown>): ResultPromise<T, E>;

  /**
   * **⚠️ WARNING: This method can throw and should be used with extreme care!**
   *
   * Returns the contained Ok value, or a provided default if this is an Err.
   * If this is an Err result and no fallback is provided, this method will throw an error.
   *
   * Use this method only when you are absolutely certain the result is Ok, or always provide a fallback.
   * Consider using `map`, `and`, or other safe methods instead.
   * @param fallback Optional default value to return if this is an Err.
   * @returns A Promise that resolves to the Ok value or the provided default.
   * @throws Error if this is an Err result and no fallback is provided.
   */
  unwrap<V = never>(fallback?: V): Promise<T | V>;

  /**
   * If this is an Ok, attempts to apply the function to the value, catching any thrown errors.
   * If this is an Err, returns this Err unchanged.
   * Any thrown errors (including non-Error values) are wrapped in a generic Error with the original error as the cause.
   * @param fn Function to apply to the value if this is an Ok. If this function throws, the error will be caught and wrapped.
   * @returns A new ResultPromise with the transformed value, or an Err containing the caught error, or the original Err.
   */
  attempt<U>(fn: (value: T) => MaybePromise<U>): ResultPromise<U, E | Error>;
}

/**
 * A Result type that represents either a success (Ok) or failure (Err) value.
 * This is a union type of Ok<T> and Err<E>.
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Represents a successful result containing a value.
 */
export class Ok<T> implements ResultCore<T, never> {
  constructor(readonly value: T) {}

  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is never {
    return false;
  }

  get async(): ResultPromise<T, never> {
    return ResultPromise.fromPromise(Promise.resolve(ok(this.value)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  andErr<U, V>(fn: (error: never) => Result<U, V>): Result<T | U, V> {
    return ok(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mapErr<U>(fn: (error: never) => U): Result<T, U> {
    return ok(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tapErr(fn: (error: never) => unknown): Result<T, never> {
    return ok(this.value);
  }

  and<U, V>(fn: (value: T) => Result<U, V>): Result<U, never | V> {
    return fn(this.value);
  }

  map<U>(fn: (value: T) => U): Result<U, never> {
    return ok(fn(this.value));
  }

  tap(fn: (value: T) => unknown): Result<T, never> {
    try {
      fn(this.value);
    } catch {
      /* empty */
    }

    return ok(this.value);
  }

  attempt<U>(fn: (value: T) => U): Result<U, never | Error> {
    try {
      return ok(fn(this.value));
    } catch (error) {
      return err(new Error("Unknown error occurred", { cause: error }));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unwrap<V = never>(fallback?: V): T | V {
    return this.value;
  }
}

/**
 * Represents a failed result containing an error.
 */
export class Err<E> implements ResultCore<never, E> {
  constructor(readonly error: E) {}

  isOk(): this is never {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }

  get async(): ResultPromise<never, E> {
    return ResultPromise.fromPromise(Promise.resolve(err(this.error)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  and<U, V>(fn: (value: never) => Result<U, V>): Result<U, E | V> {
    return err(this.error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map<U>(fn: (value: never) => U): Result<U, E> {
    return err(this.error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tap(fn: (value: never) => unknown): Result<never, E> {
    return err(this.error);
  }

  andErr<U, V>(fn: (error: E) => Result<U, V>): Result<never | U, V> {
    return fn(this.error);
  }

  mapErr<U>(fn: (error: E) => U): Result<never, U> {
    return err(fn(this.error));
  }

  tapErr(fn: (error: E) => unknown): Result<never, E> {
    try {
      fn(this.error);
    } catch {
      /* empty */
    }

    return err(this.error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attempt<U>(fn: (value: never) => U): Result<U, E | Error> {
    return err(this.error);
  }

  unwrap<V = never>(fallback?: V): never | V {
    if (arguments.length > 0) {
      return fallback!;
    }

    throw new Error("Failed to unwrap Result");
  }
}

/**
 * A Promise-like wrapper around a Result that provides async Result operations.
 */
export class ResultPromise<T = never, E = never>
  implements PromiseLike<Result<T, E>>, ResultPromiseCore<T, E>
{
  private constructor(private promise: Promise<Result<T, E>>) {}

  then<U = Result<T, E>, V = never>(
    onSuccess?: (value: Result<T, E>) => U | PromiseLike<U>,
    onFailure?: (reason: unknown) => V | PromiseLike<V>,
  ): PromiseLike<U | V> {
    return this.promise.then(onSuccess, onFailure);
  }

  andErr<U, V>(fn: (error: E) => MaybePromise<Result<U, V>>): ResultPromise<T | U, V> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isOk()) {
          return ok(result.value) as Result<T | U, V>;
        }

        return fn(result.error);
      }),
    );
  }

  and<U, V>(fn: (value: T) => MaybePromise<Result<U, V>>): ResultPromise<U, E | V> {
    return new ResultPromise(
      this.promise.then((result) => {
        if (result.isErr()) {
          return err(result.error) as Result<U, E | V>;
        }

        return fn(result.value);
      }),
    );
  }

  mapErr<U>(fn: (error: E) => MaybePromise<U>): ResultPromise<T, U> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isOk()) {
          return ok(result.value);
        }

        return err(await fn(result.error));
      }),
    );
  }

  map<U>(fn: (value: T) => MaybePromise<U>): ResultPromise<U, E> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isErr()) {
          return err(result.error);
        }

        return ok(await fn(result.value));
      }),
    );
  }

  tapErr(fn: (error: E) => MaybePromise<unknown>): ResultPromise<T, E> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isOk()) {
          return ok(result.value);
        }

        try {
          await fn(result.error);
        } catch {
          /* empty */
        }

        return err(result.error);
      }),
    );
  }

  tap(fn: (value: T) => MaybePromise<unknown>): ResultPromise<T, E> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isErr()) {
          return err(result.error);
        }

        try {
          await fn(result.value);
        } catch {
          /* empty */
        }

        return ok(result.value);
      }),
    );
  }

  attempt<U>(fn: (value: T) => MaybePromise<U>): ResultPromise<U, E | Error> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isErr()) {
          return err(result.error) as Result<U, E | Error>;
        }

        try {
          return ok(await fn(result.value));
        } catch (error) {
          return err(new Error("Unknown error occurred", { cause: error }));
        }
      }),
    );
  }

  async unwrap<V>(fallback?: V): Promise<T | V> {
    return this.promise.then((result) => result.unwrap(fallback));
  }

  /**
   * Creates a ResultPromise from a Promise that resolves to a Result.
   * @param result The Result to wrap, or a Promise that resolves to a Result
   * @returns A ResultPromise wrapping the given Result
   */
  static fromPromise<T = never, E = never>(result: Promise<Result<T, E>>): ResultPromise<T, E> {
    return new ResultPromise(result);
  }

  /**
   * Creates a function that returns a ResultPromise.
   * @param fn An async function that returns a Promise resolving to a Result
   * @returns A new function with the same signature that returns a ResultPromise
   */
  static fromFunction<T = never, E = never>(
    fn: (...args: any[]) => Promise<Result<T, E>>,
  ): (...args: any[]) => ResultPromise<T, E> {
    return (...args) => {
      return ResultPromise.fromPromise(fn(...args));
    };
  }
}

/**
 * Creates a new Ok result with the given value.
 * @param value The successful value to wrap
 * @returns A new Ok<T> instance
 */
export function ok<T>(value: T): Ok<T> {
  return new Ok(value);
}

/**
 * Creates a new Err result with the given error.
 * @param error The error value to wrap
 * @returns A new Err<E> instance
 */
export function err<E>(error: E): Err<E> {
  return new Err(error);
}
