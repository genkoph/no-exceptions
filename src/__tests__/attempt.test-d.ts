import { describe, assertType } from "vitest";

import { attempt } from "@/attempt";
import { ResultPromise, type Result } from "@/result";

describe("attempt (types)", () => {
  describe("sync thunk", () => {
    assertType<Result<number, Error>>(attempt(() => 42));
    assertType<Result<string, Error>>(attempt(() => "hello"));
    assertType<Result<boolean, Error>>(attempt(() => true));
    assertType<Result<boolean, Error>>(attempt(() => false));
    assertType<Result<null, Error>>(attempt(() => null));
    assertType<Result<undefined, Error>>(attempt(() => undefined));
    assertType<Result<number, Error>>(attempt(() => 0));
    assertType<Result<string, Error>>(attempt(() => ""));
    assertType<Result<number, Error>>(attempt(() => NaN));
    assertType<Result<number, Error>>(attempt(() => Infinity));
    assertType<Result<number, Error>>(attempt(() => -Infinity));
    assertType<Result<never[], Error>>(attempt(() => []));
    assertType<Result<number[], Error>>(attempt(() => [1, 2, 3]));
    assertType<Result<Record<string, unknown>, Error>>(attempt(() => ({})));
    assertType<Result<{ a: number; b: string }, Error>>(attempt(() => ({ a: 1, b: "test" })));
    assertType<Result<symbol, Error>>(attempt(() => Symbol("sym")));
    assertType<Result<() => void, Error>>(attempt(() => function () {}));
    assertType<Result<() => number, Error>>(attempt(() => () => 123));
  });

  describe("async thunk", () => {
    assertType<ResultPromise<number, Error>>(attempt(async () => 42));
    assertType<ResultPromise<string, Error>>(attempt(async () => "hello"));
    assertType<ResultPromise<boolean, Error>>(attempt(async () => true));
    assertType<ResultPromise<boolean, Error>>(attempt(async () => false));
    assertType<ResultPromise<null, Error>>(attempt(async () => null));
    assertType<ResultPromise<undefined, Error>>(attempt(async () => undefined));
    assertType<ResultPromise<number, Error>>(attempt(async () => 0));
    assertType<ResultPromise<string, Error>>(attempt(async () => ""));
    assertType<ResultPromise<number, Error>>(attempt(async () => NaN));
    assertType<ResultPromise<number, Error>>(attempt(async () => Infinity));
    assertType<ResultPromise<number, Error>>(attempt(async () => -Infinity));
    assertType<ResultPromise<never[], Error>>(attempt(async () => []));
    assertType<ResultPromise<number[], Error>>(attempt(async () => [1, 2, 3]));
    assertType<ResultPromise<Record<string, unknown>, Error>>(attempt(async () => ({})));
    assertType<ResultPromise<{ a: number; b: string }, Error>>(
      attempt(async () => ({ a: 1, b: "test" })),
    );
    assertType<ResultPromise<symbol, Error>>(attempt(async () => Symbol("sym")));
    assertType<ResultPromise<() => void, Error>>(attempt(async () => function () {}));
    assertType<ResultPromise<() => number, Error>>(attempt(async () => () => 123));
  });

  describe("promise", () => {
    assertType<ResultPromise<number, Error>>(attempt(Promise.resolve(42)));
    assertType<ResultPromise<string, Error>>(attempt(Promise.resolve("hello")));
    assertType<ResultPromise<boolean, Error>>(attempt(Promise.resolve(true)));
    assertType<ResultPromise<boolean, Error>>(attempt(Promise.resolve(false)));
    assertType<ResultPromise<null, Error>>(attempt(Promise.resolve(null)));
    assertType<ResultPromise<undefined, Error>>(attempt(Promise.resolve(undefined)));
    assertType<ResultPromise<number, Error>>(attempt(Promise.resolve(0)));
    assertType<ResultPromise<string, Error>>(attempt(Promise.resolve("")));
    assertType<ResultPromise<number, Error>>(attempt(Promise.resolve(NaN)));
    assertType<ResultPromise<number, Error>>(attempt(Promise.resolve(Infinity)));
    assertType<ResultPromise<number, Error>>(attempt(Promise.resolve(-Infinity)));
    assertType<ResultPromise<never[], Error>>(attempt(Promise.resolve([])));
    assertType<ResultPromise<number[], Error>>(attempt(Promise.resolve([1, 2, 3])));
    assertType<ResultPromise<Record<string, unknown>, Error>>(attempt(Promise.resolve({})));
    assertType<ResultPromise<{ a: number; b: string }, Error>>(
      attempt(Promise.resolve({ a: 1, b: "test" })),
    );
    assertType<ResultPromise<symbol, Error>>(attempt(Promise.resolve(Symbol("sym"))));
    assertType<ResultPromise<() => void, Error>>(attempt(Promise.resolve(function () {})));
    assertType<ResultPromise<() => number, Error>>(attempt(Promise.resolve(() => 123)));
  });

  describe("executor", () => {
    assertType<ResultPromise<number, Error>>(attempt<number>((resolve) => resolve(42)));
    assertType<ResultPromise<string, Error>>(attempt<string>((resolve) => resolve("hello")));
    assertType<ResultPromise<boolean, Error>>(attempt<boolean>((resolve) => resolve(true)));
    assertType<ResultPromise<boolean, Error>>(attempt<boolean>((resolve) => resolve(false)));
    assertType<ResultPromise<null, Error>>(attempt<null>((resolve) => resolve(null)));
    assertType<ResultPromise<undefined, Error>>(
      attempt<undefined>((resolve) => resolve(undefined)),
    );
    assertType<ResultPromise<number, Error>>(attempt<number>((resolve) => resolve(0)));
    assertType<ResultPromise<string, Error>>(attempt<string>((resolve) => resolve("")));
    assertType<ResultPromise<number, Error>>(attempt<number>((resolve) => resolve(NaN)));
    assertType<ResultPromise<number, Error>>(attempt<number>((resolve) => resolve(Infinity)));
    assertType<ResultPromise<number, Error>>(attempt<number>((resolve) => resolve(-Infinity)));
    assertType<ResultPromise<never[], Error>>(attempt<never[]>((resolve) => resolve([])));
    assertType<ResultPromise<number[], Error>>(attempt<number[]>((resolve) => resolve([1, 2, 3])));
    assertType<ResultPromise<Record<string, unknown>, Error>>(
      attempt<Record<string, unknown>>((resolve) => resolve({})),
    );
    assertType<ResultPromise<{ a: number; b: string }, Error>>(
      attempt<{ a: number; b: string }>((resolve) => resolve({ a: 1, b: "test" })),
    );
    assertType<ResultPromise<symbol, Error>>(attempt<symbol>((resolve) => resolve(Symbol("sym"))));
  });
});
