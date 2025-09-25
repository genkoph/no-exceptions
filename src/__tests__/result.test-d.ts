import { describe, assertType } from "vitest";

import { ok, Ok, err, Err, ResultPromise } from "@/result";

describe("Result.ok (types)", () => {
  describe("instantiation", () => {
    assertType<Ok<number>>(ok(42));
    assertType<Ok<string>>(ok("hello"));
    assertType<Ok<boolean>>(ok(true));
    assertType<Ok<boolean>>(ok(false));
    assertType<Ok<null>>(ok(null));
    assertType<Ok<undefined>>(ok(undefined));
    assertType<Ok<number>>(ok(0));
    assertType<Ok<string>>(ok(""));
    assertType<Ok<number>>(ok(NaN));
    assertType<Ok<number>>(ok(Infinity));
    assertType<Ok<number>>(ok(-Infinity));
    assertType<Ok<never[]>>(ok([]));
    assertType<Ok<number[]>>(ok([1, 2, 3]));
    assertType<Ok<Record<string, unknown>>>(ok({}));
    assertType<Ok<{ a: number; b: string }>>(ok({ a: 1, b: "test" }));
    assertType<Ok<symbol>>(ok(Symbol("sym")));
    assertType<Ok<() => void>>(ok(function () {}));
    assertType<Ok<() => number>>(ok(() => 123));
  });

  describe(".or", () => {
    assertType<Ok<string>>(ok("hello").or(() => ok(42)));
    assertType<Ok<string>>(ok("hello").or(() => err("error")));
    assertType<Ok<number>>(ok(42).or(() => ok("world")));
    assertType<Ok<number>>(ok(42).or(() => err(123)));
    assertType<Ok<boolean>>(ok(true).or(() => ok(false)));
    assertType<Ok<boolean>>(ok(true).or(() => err("test")));
    assertType<Ok<string>>(ok("test").or(() => ok(123)));
    assertType<Ok<number>>(ok(42).or(() => err("error")));
    assertType<Ok<boolean>>(ok(true).or(() => ok("string")));
    assertType<Ok<number[]>>(ok([1, 2, 3]).or(() => ok("array")));
    assertType<Ok<{ a: number }>>(ok({ a: 1 }).or(() => err("object")));
    assertType<Ok<symbol>>(ok(Symbol("test")).or(() => ok(42)));
    assertType<Ok<() => void>>(ok(() => {}).or(() => err("function")));
  });

  describe(".orMap", () => {
    assertType<Ok<string>>(ok("hello").orMap(() => "world"));
    assertType<Ok<number>>(ok(42).orMap(() => 123));
    assertType<Ok<boolean>>(ok(true).orMap(() => false));
    assertType<Ok<number[]>>(ok([1, 2, 3]).orMap(() => [4, 5, 6]));
    assertType<Ok<{ a: number }>>(ok({ a: 1 }).orMap(() => ({ b: 2 })));
  });

  describe(".orTee", () => {
    assertType<Ok<string>>(ok("hello").orTee(() => {}));
    assertType<Ok<number>>(ok(42).orTee(() => {}));
    assertType<Ok<boolean>>(ok(true).orTee(() => {}));
  });

  describe(".and", () => {
    assertType<Ok<number>>(ok("hello").and(() => ok(42)));
    assertType<Err<string>>(ok("hello").and(() => err("error")));
    assertType<Ok<string>>(ok(42).and(() => ok("world")));
    assertType<Err<number>>(ok(42).and(() => err(123)));
    assertType<Ok<boolean>>(ok(true).and(() => ok(false)));
    assertType<Err<string>>(ok(true).and(() => err("test")));
  });

  describe(".andMap", () => {
    assertType<Ok<number>>(ok("hello").andMap(() => 42));
    assertType<Ok<string>>(ok(42).andMap(() => "world"));
    assertType<Ok<boolean>>(ok("test").andMap(() => true));
    assertType<Ok<number[]>>(ok("array").andMap(() => [1, 2, 3]));
    assertType<Ok<{ b: number }>>(ok("object").andMap(() => ({ b: 2 })));
  });

  describe(".andTee", () => {
    assertType<Ok<string>>(ok("hello").andTee(() => {}));
    assertType<Ok<number>>(ok(42).andTee(() => {}));
    assertType<Ok<boolean>>(ok(true).andTee(() => {}));
  });
});

describe("Result.err (types)", () => {
  describe("instantiation", () => {
    assertType<Err<number>>(err(42));
    assertType<Err<string>>(err("hello"));
    assertType<Err<boolean>>(err(true));
    assertType<Err<boolean>>(err(false));
    assertType<Err<null>>(err(null));
    assertType<Err<undefined>>(err(undefined));
    assertType<Err<number>>(err(0));
    assertType<Err<string>>(err(""));
    assertType<Err<number>>(err(NaN));
    assertType<Err<number>>(err(Infinity));
    assertType<Err<number>>(err(-Infinity));
    assertType<Err<never[]>>(err([]));
    assertType<Err<number[]>>(err([1, 2, 3]));
    assertType<Err<Record<string, unknown>>>(err({}));
    assertType<Err<{ a: number; b: string }>>(err({ a: 1, b: "test" }));
    assertType<Err<symbol>>(err(Symbol("sym")));
    assertType<Err<() => void>>(err(function () {}));
    assertType<Err<() => number>>(err(() => 123));
  });

  describe(".or", () => {
    assertType<Ok<number>>(err("hello").or(() => ok(42)));
    assertType<Err<string>>(err("hello").or(() => err("error")));
    assertType<Ok<string>>(err(42).or(() => ok("world")));
    assertType<Err<number>>(err(42).or(() => err(123)));
    assertType<Ok<boolean>>(err(true).or(() => ok(false)));
    assertType<Err<string>>(err(true).or(() => err("test")));
  });

  describe(".orMap", () => {
    assertType<Err<number>>(err("hello").orMap(() => 42));
    assertType<Err<string>>(err(42).orMap(() => "world"));
    assertType<Err<boolean>>(err("test").orMap(() => true));
    assertType<Err<number[]>>(err("array").orMap(() => [1, 2, 3]));
    assertType<Err<{ b: number }>>(err("object").orMap(() => ({ b: 2 })));
  });

  describe(".orTee", () => {
    assertType<Err<string>>(err("hello").orTee(() => {}));
    assertType<Err<number>>(err(42).orTee(() => {}));
    assertType<Err<boolean>>(err(true).orTee(() => {}));
  });

  describe(".and", () => {
    assertType<Err<string>>(err("hello").and(() => ok(42)));
    assertType<Err<string>>(err("hello").and(() => err("error")));
    assertType<Err<number>>(err(42).and(() => ok("world")));
    assertType<Err<number>>(err(42).and(() => err(123)));
    assertType<Err<boolean>>(err(true).and(() => ok(false)));
    assertType<Err<boolean>>(err(true).and(() => err("test")));
  });

  describe(".andMap", () => {
    assertType<Err<string>>(err("hello").andMap(() => 42));
    assertType<Err<number>>(err(42).andMap(() => "world"));
    assertType<Err<string>>(err("test").andMap(() => true));
    assertType<Err<string>>(err("array").andMap(() => [1, 2, 3]));
    assertType<Err<string>>(err("object").andMap(() => ({ b: 2 })));
  });

  describe(".andTee", () => {
    assertType<Err<string>>(err("hello").andTee(() => {}));
    assertType<Err<number>>(err(42).andTee(() => {}));
    assertType<Err<boolean>>(err(true).andTee(() => {}));
  });
});

describe("ResultPromise.from (types)", () => {
  describe("instantiation", () => {
    assertType<ResultPromise<Ok<number>>>(ResultPromise.fromPromise(Promise.resolve(ok(42))));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.fromPromise(Promise.resolve(ok("hello"))));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.fromPromise(Promise.resolve(ok(true))));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.fromPromise(Promise.resolve(ok(false))));
    assertType<ResultPromise<Ok<null>>>(ResultPromise.fromPromise(Promise.resolve(ok(null))));
    assertType<ResultPromise<Ok<undefined>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(undefined))),
    );
    assertType<ResultPromise<Ok<number>>>(ResultPromise.fromPromise(Promise.resolve(ok(0))));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.fromPromise(Promise.resolve(ok(""))));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.fromPromise(Promise.resolve(ok(NaN))));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.fromPromise(Promise.resolve(ok(Infinity))));
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(-Infinity))),
    );
    assertType<ResultPromise<Err<number>>>(ResultPromise.fromPromise(Promise.resolve(err(42))));
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err("hello"))),
    );
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.fromPromise(Promise.resolve(err(true))));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.fromPromise(Promise.resolve(err(false))));
    assertType<ResultPromise<Err<null>>>(ResultPromise.fromPromise(Promise.resolve(err(null))));
    assertType<ResultPromise<Err<undefined>>>(
      ResultPromise.fromPromise(Promise.resolve(err(undefined))),
    );
    assertType<ResultPromise<Err<number>>>(ResultPromise.fromPromise(Promise.resolve(err(0))));
    assertType<ResultPromise<Err<string>>>(ResultPromise.fromPromise(Promise.resolve(err(""))));
    assertType<ResultPromise<Err<number>>>(ResultPromise.fromPromise(Promise.resolve(err(NaN))));
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err(Infinity))),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err(-Infinity))),
    );
    assertType<ResultPromise<Ok<never[]>>>(ResultPromise.fromPromise(Promise.resolve(ok([]))));
    assertType<ResultPromise<Ok<number[]>>>(
      ResultPromise.fromPromise(Promise.resolve(ok([1, 2, 3]))),
    );
    assertType<ResultPromise<Ok<Record<string, unknown>>>>(
      ResultPromise.fromPromise(Promise.resolve(ok({}))),
    );
    assertType<ResultPromise<Ok<{ a: number; b: string }>>>(
      ResultPromise.fromPromise(Promise.resolve(ok({ a: 1, b: "test" }))),
    );
    assertType<ResultPromise<Ok<symbol>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(Symbol("sym")))),
    );
    assertType<ResultPromise<Ok<() => void>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(function () {}))),
    );
    assertType<ResultPromise<Ok<() => number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(() => 123))),
    );
    assertType<ResultPromise<Err<never[]>>>(ResultPromise.fromPromise(Promise.resolve(err([]))));
    assertType<ResultPromise<Err<number[]>>>(
      ResultPromise.fromPromise(Promise.resolve(err([1, 2, 3]))),
    );
    assertType<ResultPromise<Err<Record<string, unknown>>>>(
      ResultPromise.fromPromise(Promise.resolve(err({}))),
    );
    assertType<ResultPromise<Err<{ a: number; b: string }>>>(
      ResultPromise.fromPromise(Promise.resolve(err({ a: 1, b: "test" }))),
    );
    assertType<ResultPromise<Err<symbol>>>(
      ResultPromise.fromPromise(Promise.resolve(err(Symbol("sym")))),
    );
    assertType<ResultPromise<Err<() => void>>>(
      ResultPromise.fromPromise(Promise.resolve(err(function () {}))),
    );
    assertType<ResultPromise<Err<() => number>>>(
      ResultPromise.fromPromise(Promise.resolve(err(() => 123))),
    );
  });

  describe(".or", () => {
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromPromise(Promise.resolve(ok("hello"))).or(() => ok(42)),
    );
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromPromise(Promise.resolve(ok("hello"))).or(() => err("error")),
    );
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(42))).or(() => ok("world")),
    );
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(42))).or(() => err(123)),
    );
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err("hello"))).or(() => ok(42)),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err("hello"))).or(() => err("error")),
    );
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err(42))).or(() => ok("world")),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err(42))).or(() => err(123)),
    );
  });

  describe(".orMap", () => {
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromPromise(Promise.resolve(ok("hello"))).orMap(() => "world"),
    );
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(42))).orMap(() => 123),
    );
    assertType<ResultPromise<Ok<boolean>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(true))).orMap(() => false),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err("hello"))).orMap(() => 42),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err(42))).orMap(() => "world"),
    );
    assertType<ResultPromise<Err<boolean>>>(
      ResultPromise.fromPromise(Promise.resolve(err("test"))).orMap(() => true),
    );
  });

  describe(".orTee", () => {
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromPromise(Promise.resolve(ok("hello"))).orTee(() => {}),
    );
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(42))).orTee(() => {}),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err("hello"))).orTee(() => {}),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err(42))).orTee(() => {}),
    );
  });

  describe(".and", () => {
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok("hello"))).and(() => ok(42)),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(ok("hello"))).and(() => err("error")),
    );
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(42))).and(() => ok("world")),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(42))).and(() => err(123)),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err("hello"))).and(() => ok(42)),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err("hello"))).and(() => err("error")),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err(42))).and(() => ok("world")),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err(42))).and(() => err(123)),
    );
  });

  describe(".andMap", () => {
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok("hello"))).andMap(() => 42),
    );
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(42))).andMap(() => "world"),
    );
    assertType<ResultPromise<Ok<boolean>>>(
      ResultPromise.fromPromise(Promise.resolve(ok("test"))).andMap(() => true),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err("hello"))).andMap(() => 42),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err(42))).andMap(() => "world"),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err("test"))).andMap(() => true),
    );
  });

  describe(".andTee", () => {
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromPromise(Promise.resolve(ok("hello"))).andTee(() => {}),
    );
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromPromise(Promise.resolve(ok(42))).andTee(() => {}),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromPromise(Promise.resolve(err("hello"))).andTee(() => {}),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromPromise(Promise.resolve(err(42))).andTee(() => {}),
    );
  });
});

describe("ResultPromise.fromFunction (types)", () => {
  describe("instantiation", () => {
    assertType<(...args: [number]) => ResultPromise<Ok<number>>>(
      ResultPromise.fromFunction(async (x: number) => ok(x)),
    );
    assertType<(...args: [string]) => ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x)),
    );
    assertType<(...args: [boolean]) => ResultPromise<Ok<boolean>>>(
      ResultPromise.fromFunction(async (x: boolean) => ok(x)),
    );
    assertType<(...args: [null]) => ResultPromise<Ok<null>>>(
      ResultPromise.fromFunction(async (x: null) => ok(x)),
    );
    assertType<(...args: [undefined]) => ResultPromise<Ok<undefined>>>(
      ResultPromise.fromFunction(async (x: undefined) => ok(x)),
    );
    assertType<(...args: [number]) => ResultPromise<Err<number>>>(
      ResultPromise.fromFunction(async (x: number) => err(x)),
    );
    assertType<(...args: [string]) => ResultPromise<Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => err(x)),
    );
    assertType<(...args: [boolean]) => ResultPromise<Err<boolean>>>(
      ResultPromise.fromFunction(async (x: boolean) => err(x)),
    );
    assertType<(...args: [number[]]) => ResultPromise<Ok<number[]>>>(
      ResultPromise.fromFunction(async (x: number[]) => ok(x)),
    );
    assertType<
      (...args: [{ a: number; b: string }]) => ResultPromise<Ok<{ a: number; b: string }>>
    >(ResultPromise.fromFunction(async (x: { a: number; b: string }) => ok(x)));
    assertType<(...args: [symbol]) => ResultPromise<Ok<symbol>>>(
      ResultPromise.fromFunction(async (x: symbol) => ok(x)),
    );
    assertType<(...args: []) => ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async () => ok("no params")),
    );
    assertType<(...args: [string]) => ResultPromise<Ok<string> | Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => (x.length > 0 ? ok(x) : err("empty"))),
    );
  });

  describe(".or", () => {
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").or(() => ok(42)),
    );
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").or(() => err("error")),
    );
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").or(() => ok(42)),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").or(() => err(42)),
    );
  });

  describe(".orMap", () => {
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").orMap(() => "mapped"),
    );
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").orMap(() => 42),
    );
    assertType<ResultPromise<Err<number>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").orMap(() => 42),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").orMap(() => "mapped"),
    );
  });

  describe(".orTee", () => {
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").orTee(() => {}),
    );
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").orTee(() => {}),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").orTee(() => {}),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").orTee(() => {}),
    );
  });

  describe(".and", () => {
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").and((val) => ok(val.length)),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").and((val) => err(val)),
    );
    assertType<ResultPromise<Err<string>>>(
      // @ts-expect-error val is of type never
      ResultPromise.fromFunction(async (x: string) => err(x))("test").and((val) => ok(val.length)),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").and((val) => err(val)),
    );
  });

  describe(".andMap", () => {
    assertType<ResultPromise<Ok<number>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").andMap((val) => val.length),
    );
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").andMap((val) =>
        val.toUpperCase(),
      ),
    );
    assertType<ResultPromise<Err<string>>>(
      // @ts-expect-error val is of type never
      ResultPromise.fromFunction(async (x: string) => err(x))("test").andMap((val) => val.length),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").andMap((val) => val),
    );
  });

  describe(".andTee", () => {
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").andTee(() => {}),
    );
    assertType<ResultPromise<Ok<string>>>(
      ResultPromise.fromFunction(async (x: string) => ok(x))("test").andTee(() => {}),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").andTee(() => {}),
    );
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.fromFunction(async (x: string) => err(x))("test").andTee(() => {}),
    );
  });
});
