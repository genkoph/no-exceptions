type UnknownResult = Result<any, any>;
type MaybePromise<T> = T | Promise<T>;

type DistributeOk<T> = [T] extends [never] ? never : Ok<T>;
type DistributeErr<T> = [T] extends [never] ? never : Err<T>;

type ValueOf<T extends UnknownResult> = T extends Ok<infer U> ? U : never;
type ErrorOf<T extends UnknownResult> = T extends Err<infer U> ? U : never;

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
  async: ResultPromise<Result<T, E>>;

  /**
   * If this is an Err, applies the function to the error and returns the result.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns A new Result with the transformed error or the original Ok.
   */
  or<U, V>(fn: (error: E) => Result<U, V>): Result<T | U, V>;

  /**
   * If this is an Ok, applies the function to the value and returns the result.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns A new Result with the transformed value or the original Err.
   */
  and<U, V>(fn: (value: T) => Result<U, V>): Result<U, E | V>;

  /**
   * If this is an Err, applies the function to the error and returns an Err with the result.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns A new Result with the transformed error or the original Ok.
   */
  orMap<U>(fn: (error: E) => U): Result<T, U>;

  /**
   * If this is an Ok, applies the function to the value and returns an Ok with the result.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns A new Result with the transformed value or the original Err.
   */
  andMap<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * If this is an Err, applies the function to the error for side effects and returns this.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns This Result unchanged.
   */
  orTee(fn: (error: E) => unknown): Result<T, E>;

  /**
   * If this is an Ok, applies the function to the value for side effects and returns this.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns This Result unchanged.
   */
  andTee(fn: (value: T) => unknown): Result<T, E>;
}

interface ResultPromiseCore<R extends UnknownResult> {
  /**
   * If this is an Err, applies the function to the error and returns the result.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns A new ResultPromise with the transformed error or the original Ok.
   */
  or<U, V>(
    fn: (error: ErrorOf<R>) => MaybePromise<Result<U, V>>,
  ): R extends Ok<unknown>
    ? ResultPromise<R>
    : ResultPromise<DistributeOk<ValueOf<R> | U> | DistributeErr<V>>;

  /**
   * If this is an Ok, applies the function to the value and returns the result.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns A new ResultPromise with the transformed value or the original Err.
   */
  and<U, V>(
    fn: (value: ValueOf<R>) => MaybePromise<Result<U, V>>,
  ): R extends Err<unknown>
    ? ResultPromise<R>
    : ResultPromise<DistributeOk<U> | DistributeErr<ErrorOf<R> | V>>;

  /**
   * If this is an Err, applies the function to the error and returns an Err with the result.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns A new ResultPromise with the transformed error or the original Ok.
   */
  orMap<U>(
    fn: (error: ErrorOf<R>) => MaybePromise<U>,
  ): R extends Ok<unknown>
    ? ResultPromise<R>
    : ResultPromise<DistributeOk<ValueOf<R>> | DistributeErr<U>>;

  /**
   * If this is an Ok, applies the function to the value and returns an Ok with the result.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns A new ResultPromise with the transformed value or the original Err.
   */
  andMap<U>(
    fn: (value: ValueOf<R>) => MaybePromise<U>,
  ): R extends Err<unknown>
    ? ResultPromise<R>
    : ResultPromise<DistributeOk<U> | DistributeErr<ErrorOf<R>>>;

  /**
   * If this is an Err, applies the function to the error for side effects and returns this.
   * If this is an Ok, returns this Ok unchanged.
   * @param fn Function to apply to the error if this is an Err.
   * @returns This ResultPromise unchanged.
   */
  orTee(fn: (error: ErrorOf<R>) => MaybePromise<unknown>): ResultPromise<R>;

  /**
   * If this is an Ok, applies the function to the value for side effects and returns this.
   * If this is an Err, returns this Err unchanged.
   * @param fn Function to apply to the value if this is an Ok.
   * @returns This ResultPromise unchanged.
   */
  andTee(fn: (value: ValueOf<R>) => MaybePromise<unknown>): ResultPromise<R>;
}

/**
 * A Result type that represents either a success (Ok) or failure (Err) value.
 * This is a union type of Ok<T> and Err<E>.
 * @template T The type of the success value
 * @template E The type of the error value
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Represents a successful result containing a value.
 * @template T The type of the contained value
 */
export class Ok<T> implements ResultCore<T, never> {
  constructor(readonly value: T) {}

  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is never {
    return false;
  }

  get async() {
    return ResultPromise.ok(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  or<U = never, V = never>(fn: (error: never) => Result<U, V>): this {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orMap<U>(fn: (error: never) => U): this {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orTee(fn: (error: never) => unknown): this {
    return this;
  }

  and<U = never, V = never>(fn: (value: T) => Result<U, V>): DistributeOk<U> | DistributeErr<V> {
    return fn(this.value) as DistributeOk<U> | DistributeErr<V>;
  }

  andMap<U>(fn: (value: T) => U): Ok<U> {
    return ok(fn(this.value));
  }

  andTee(fn: (value: T) => unknown): this {
    try {
      fn(this.value);
    } catch {
      /* empty */
    }

    return this;
  }
}

/**
 * Represents a failed result containing an error.
 * @template E The type of the contained error
 */
export class Err<E> implements ResultCore<never, E> {
  constructor(readonly error: E) {}

  isOk(): this is never {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }

  get async() {
    return ResultPromise.err(this.error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  and<U = never, V = never>(fn: (value: never) => Result<U, V>): this {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  andMap<U>(fn: (value: never) => U): this {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  andTee(fn: (value: never) => unknown): this {
    return this;
  }

  or<U = never, V = never>(fn: (error: E) => Result<U, V>): DistributeOk<U> | DistributeErr<V> {
    return fn(this.error) as DistributeOk<U> | DistributeErr<V>;
  }

  orMap<U>(fn: (error: E) => U): Err<U> {
    return err(fn(this.error));
  }

  orTee(fn: (error: E) => unknown): this {
    try {
      fn(this.error);
    } catch {
      /* empty */
    }

    return this;
  }
}

/**
 * A Promise-like wrapper around a Result that provides async Result operations.
 * @template R The Result type being wrapped
 */
export class ResultPromise<R extends UnknownResult>
  implements PromiseLike<R>, ResultPromiseCore<R>
{
  private constructor(private promise: Promise<R>) {}

  then<U = R, V = never>(
    onSuccess?: (value: R) => U | PromiseLike<U>,
    onFailure?: (reason: unknown) => V | PromiseLike<V>,
  ): PromiseLike<U | V> {
    return this.promise.then(onSuccess, onFailure);
  }

  or<U = never, V = never>(
    fn: (error: ErrorOf<R>) => MaybePromise<Result<U, V>>,
  ): R extends Ok<unknown>
    ? ResultPromise<R>
    : ResultPromise<DistributeOk<U> | DistributeOk<ValueOf<R>> | DistributeErr<V>> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isOk()) {
          return this as ValueOf<R>;
        }

        return (await fn(result.error)) as ValueOf<R> | ErrorOf<R>;
      }),
    ) as any;
  }

  and<U = never, V = never>(
    fn: (value: ValueOf<R>) => MaybePromise<Result<U, V>>,
  ): R extends Err<unknown>
    ? ResultPromise<R>
    : ResultPromise<DistributeOk<U> | DistributeErr<V> | DistributeErr<ErrorOf<R>>> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isErr()) {
          return this as ErrorOf<R>;
        }

        return (await fn(result.value)) as ValueOf<R> | ErrorOf<R>;
      }),
    ) as any;
  }

  orMap<U>(
    fn: (error: ErrorOf<R>) => MaybePromise<U>,
  ): R extends Ok<unknown>
    ? ResultPromise<R>
    : ResultPromise<DistributeOk<ValueOf<R>> | DistributeErr<U>> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isOk()) {
          return this as ValueOf<R>;
        }

        return err(await fn(result.error)) as ErrorOf<R>;
      }),
    ) as any;
  }

  andMap<U>(
    fn: (value: ValueOf<R>) => MaybePromise<U>,
  ): R extends Err<unknown>
    ? ResultPromise<R>
    : ResultPromise<DistributeOk<U> | DistributeErr<ErrorOf<R>>> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isErr()) {
          return this as ErrorOf<R>;
        }

        return ok(await fn(result.value)) as ValueOf<R>;
      }),
    ) as any;
  }

  orTee(fn: (error: ErrorOf<R>) => unknown): ResultPromise<R> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isErr()) {
          try {
            await fn(result.error);
          } catch {
            // empty
          }
        }
        return result;
      }),
    );
  }

  andTee(fn: (value: ValueOf<R>) => unknown): ResultPromise<R> {
    return new ResultPromise(
      this.promise.then(async (result) => {
        if (result.isOk()) {
          try {
            await fn(result.value);
          } catch {
            // empty
          }
        }
        return result;
      }),
    );
  }

  /**
   * Creates a ResultPromise that resolves to an Ok with the given value.
   * @param value The value to wrap in an Ok, or a Promise that resolves to a value
   * @returns A ResultPromise that resolves to Ok<T>
   */
  static ok<T>(value: MaybePromise<T>): ResultPromise<Ok<T>> {
    if (value instanceof Promise) {
      return new ResultPromise(value.then(ok));
    }

    return new ResultPromise(Promise.resolve(ok(value)));
  }

  /**
   * Creates a ResultPromise that resolves to an Err with the given error.
   * @param error The error to wrap in an Err, or a Promise that resolves to an error
   * @returns A ResultPromise that resolves to Err<E>
   */
  static err<E>(error: MaybePromise<E>): ResultPromise<Err<E>> {
    if (error instanceof Promise) {
      return new ResultPromise(error.then(err));
    }

    return new ResultPromise(Promise.resolve(err(error)));
  }

  /**
   * Creates a ResultPromise from an existing Result or Promise that resolves to a Result.
   * @param result The Result to wrap, or a Promise that resolves to a Result
   * @returns A ResultPromise wrapping the given Result
   */
  static from<R extends UnknownResult>(result: MaybePromise<R>): ResultPromise<R> {
    if (result instanceof Promise) {
      return new ResultPromise(result);
    }

    return new ResultPromise(Promise.resolve(result));
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
