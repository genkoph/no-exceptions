/**
 * Represents a value that can be either a direct value or a Promise of that value.
 */
type MaybePromise<T> = T | Promise<T>;

/**
 * Represents a value that can be either a synchronous or an asynchronous Result.
 */
type MaybeResultPromise<T, E> = Result<T, E> | Promise<Result<T, E>> | ResultPromise<T, E>;

/**
 * Core interface for Result operations
 */
interface ResultCore<T, E> {
  readonly async: ResultPromiseCore<T, E>;

  /**
   * Determines if the Result is an Ok instance
   */
  isOk(): this is Ok<T, E>;

  /**
   * Determines if the Result is an Err instance
   */
  isErr(): this is Err<T, E>;

  /**
   * If Result is an Err instance, attempts to recover by calling the provided function
   */
  or<U, V>(fn: (error: E) => Result<U, V>): Result<T | U, V>;

  /**
   * If Result is an Ok instance, chains another Result operation
   */
  and<U, V>(fn: (value: T) => Result<U, V>): Result<U, E | V>;

  /**
   * If Result is an Err instance, transforms the error value
   */
  orMap<U>(fn: (error: E) => U): Result<T, U>;

  /**
   * If Result is an Ok instance, transforms the success value
   */
  andMap<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * If Result is an Err instance, executes a side effect, returns the original result
   */
  orTee(fn: (error: E) => unknown): Result<T, E>;

  /**
   * If Result is an Ok instance, executes a side effect, returns the original result
   */
  andTee(fn: (value: T) => unknown): Result<T, E>;
}

/**
 * Core interface for asynchronous Result operations
 */
interface ResultPromiseCore<T, E> {
  /**
   * If Result is an Err instance, attempts to recover by calling the provided function
   */
  or<U, V>(fn: (error: E) => MaybeResultPromise<U, V>): ResultPromise<T | U, V>;

  /**
   * If Result is an Ok instance, chains another Result operation
   */
  and<U, V>(fn: (value: T) => MaybeResultPromise<U, V>): ResultPromise<U, E | V>;

  /**
   * If Result is an Err instance, transforms the error value
   */
  orMap<U>(fn: (error: E) => MaybePromise<U>): ResultPromise<T, U>;

  /**
   * If Result is an Ok instance, transforms the success value
   */
  andMap<U>(fn: (value: T) => MaybePromise<U>): ResultPromise<U, E>;

  /**
   * If Result is an Err instance, executes a side effect, returns the original result
   */
  orTee(fn: (error: E) => MaybePromise<unknown>): ResultPromise<T, E>;

  /**
   * If Result is an Ok instance, executes a side effect, returns the original result
   */
  andTee(fn: (value: T) => MaybePromise<unknown>): ResultPromise<T, E>;
}

/**
 * A Result type that represents either a successful value (Ok) or an error (Err)
 * This is a union type of Ok<T, E> and Err<T, E>
 */
export type Result<T, E> = Ok<T, E> | Err<T, E>;

/**
 * Represents a successful result containing a value
 */
export class Ok<T = unknown, E = never> implements ResultCore<T, E> {
  constructor(readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  andMap<U>(fn: (value: T) => U): Result<U, E> {
    return ok(fn(this.value));
  }

  and<U, V>(fn: (value: T) => Result<U, V>): Result<U, E | V> {
    return fn(this.value);
  }

  andTee(fn: (value: T) => unknown): Result<T, E> {
    try {
      fn(this.value);
    } catch {}

    return ok(this.value);
  }

  orMap<U>(fn: (error: E) => U): Result<T, U> {
    return ok(this.value);
  }

  or<U, V>(fn: (error: E) => Result<U, V>): Result<T | U, V> {
    return ok(this.value);
  }

  orTee(fn: (error: E) => unknown): Result<T, E> {
    return ok(this.value);
  }

  readonly async: ResultPromiseCore<T, E> = {
    orTee: (fn: (error: E) => MaybePromise<unknown>): ResultPromise<T, E> => {
      return ResultPromise.ok(this.value);
    },
    andTee: (fn: (value: T) => MaybePromise<unknown>): ResultPromise<T, E> => {
      try {
        fn(this.value);
      } catch {}

      return ResultPromise.ok(this.value);
    },
    orMap: <U>(fn: (error: E) => MaybePromise<U>): ResultPromise<T, U> => {
      return ResultPromise.ok(this.value);
    },
    andMap: <U>(fn: (value: T) => MaybePromise<U>): ResultPromise<U, E> => {
      return ResultPromise.ok(fn(this.value));
    },
    or: <U, V>(fn: (error: E) => MaybeResultPromise<U, V>): ResultPromise<T | U, V> => {
      return ResultPromise.ok(this.value);
    },
    and: <U, V>(fn: (value: T) => MaybeResultPromise<U, V>): ResultPromise<U, E | V> => {
      const result = fn(this.value);

      if (result instanceof ResultPromise) {
        return result;
      }

      return ResultPromise.from(result);
    },
  };
}

/**
 * Represents a failed result containing an error
 */
export class Err<T = never, E = unknown> implements ResultCore<T, E> {
  constructor(readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  orMap<U>(fn: (error: E) => U): Result<T, U> {
    return err(fn(this.error));
  }

  or<U, V>(fn: (error: E) => Result<U, V>): Result<T | U, V> {
    return fn(this.error);
  }

  orTee(fn: (error: E) => unknown): Result<T, E> {
    try {
      fn(this.error);
    } catch {}

    return err(this.error);
  }

  andMap<U>(fn: (value: T) => U): Result<U, E> {
    return err(this.error);
  }

  and<U, V>(fn: (value: T) => Result<U, V>): Result<U, E | V> {
    return err(this.error);
  }

  andTee(fn: (value: T) => unknown): Result<T, E> {
    return err(this.error);
  }

  readonly async: ResultPromiseCore<T, E> = {
    orTee: (fn: (error: E) => MaybePromise<unknown>): ResultPromise<T, E> => {
      try {
        fn(this.error);
      } catch {}
      return ResultPromise.err(this.error);
    },
    andTee: (fn: (value: T) => MaybePromise<unknown>): ResultPromise<T, E> => {
      return ResultPromise.err(this.error);
    },
    orMap: <U>(fn: (error: E) => MaybePromise<U>): ResultPromise<T, U> => {
      return ResultPromise.err(fn(this.error));
    },
    andMap: <U>(fn: (value: T) => MaybePromise<U>): ResultPromise<U, E> => {
      return ResultPromise.err(this.error);
    },
    or: <U, V>(fn: (error: E) => MaybeResultPromise<U, V>): ResultPromise<T | U, V> => {
      const result = fn(this.error);

      if (result instanceof ResultPromise) {
        return result;
      }

      return ResultPromise.from(result);
    },
    and: <U, V>(fn: (value: T) => MaybeResultPromise<U, V>): ResultPromise<U, E | V> => {
      return ResultPromise.err(this.error);
    },
  };
}

/**
 * Represents an asynchronous Result that can be awaited
 */
export class ResultPromise<T, E> implements ResultPromiseCore<T, E>, PromiseLike<Result<T, E>> {
  private constructor(private promise: Promise<Result<T, E>>) {}

  then<U = Result<T, E>, V = never>(
    onSuccess?: (value: Result<T, E>) => U | PromiseLike<U>,
    onFailure?: (reason: unknown) => V | PromiseLike<V>,
  ): PromiseLike<U | V> {
    return this.promise.then(onSuccess, onFailure);
  }

  andMap<U>(fn: (value: T) => MaybePromise<U>): ResultPromise<U, E> {
    return new ResultPromise(
      this.promise.then(async function map(result) {
        if (result.isErr()) {
          return err(result.error);
        }

        const value = await fn(result.value);

        return ok(value);
      }),
    );
  }

  orMap<U>(fn: (error: E) => MaybePromise<U>): ResultPromise<T, U> {
    return new ResultPromise(
      this.promise.then(async function mapErr(result) {
        if (result.isOk()) {
          return ok(result.value);
        }

        const error = await fn(result.error);

        return err(error);
      }),
    );
  }

  or<U, V>(fn: (error: E) => MaybeResultPromise<U, V>): ResultPromise<T | U, V> {
    return new ResultPromise(
      this.promise.then(async function or(result) {
        if (result.isOk()) {
          return ok(result.value);
        }

        return await fn(result.error);
      }),
    );
  }

  and<U, V>(fn: (value: T) => MaybeResultPromise<U, V>): ResultPromise<U, E | V> {
    return new ResultPromise(
      this.promise.then(async function and(result) {
        if (result.isErr()) {
          return err(result.error);
        }

        return await fn(result.value);
      }),
    );
  }

  orTee(fn: (error: E) => MaybePromise<unknown>): ResultPromise<T, E> {
    return new ResultPromise(
      this.promise.then(async function orTee(result) {
        if (result.isOk()) {
          return result;
        }

        try {
          await fn(result.error);
        } catch {}

        return err(result.error);
      }),
    );
  }

  andTee(fn: (value: T) => MaybePromise<unknown>): ResultPromise<T, E> {
    return new ResultPromise(
      this.promise.then(async function andTee(result) {
        if (result.isErr()) {
          return result;
        }

        try {
          await fn(result.value);
        } catch {}

        return ok(result.value);
      }),
    );
  }

  /**
   * Creates a ResultPromise that resolves to an Ok result
   * @param value - The value to wrap in an Ok result
   * @returns A ResultPromise that resolves to Ok(value)
   */
  static ok<T = unknown, E = never>(value: MaybePromise<T>): ResultPromise<T, E> {
    if (value instanceof Promise) {
      return new ResultPromise(value.then(ok));
    }

    return new ResultPromise(Promise.resolve(ok(value)));
  }

  /**
   * Creates a ResultPromise that resolves to an Err result
   * @param error - The error to wrap in an Err result
   * @returns A ResultPromise that resolves to Err(error)
   */
  static err<T = never, E = unknown>(error: MaybePromise<E>): ResultPromise<T, E> {
    if (error instanceof Promise) {
      return new ResultPromise(error.then(err));
    }

    return new ResultPromise(Promise.resolve(err(error)));
  }

  /**
   * Creates a ResultPromise from an existing Result or Promise<Result>
   * @param result - The Result or Promise<Result> to wrap
   * @returns A ResultPromise that resolves to the given result
   */
  static from<T, E>(result: MaybePromise<Result<T, E>>): ResultPromise<T, E> {
    if (result instanceof Promise) {
      return new ResultPromise(result);
    }

    return new ResultPromise(Promise.resolve(result));
  }
}

/**
 * Creates a successful Result containing the given value
 * @param value - The value to wrap in an Ok result
 * @returns An Ok result containing the value
 */
export function ok<T = unknown, E = never>(value: T): Result<T, E> {
  return new Ok(value);
}

/**
 * Creates a failed Result containing the given error
 * @param error - The error to wrap in an Err result
 * @returns An Err result containing the error
 */
export function err<T = never, E = unknown>(error: E): Result<T, E> {
  return new Err(error);
}
