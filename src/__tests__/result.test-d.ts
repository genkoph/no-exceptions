import { describe, assertType } from "vitest";

import { ok, Ok, err, Err, ResultPromise, Result } from "@/result";

describe("Ok (types)", () => {
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

  describe(".andErr", () => {
    assertType<Result<string | number, never>>(ok("hello").andErr(() => ok(42)));
    assertType<Result<string, string>>(ok("hello").andErr(() => err("error")));
    assertType<Result<number | string, never>>(ok(42).andErr(() => ok("world")));
    assertType<Result<number, number>>(ok(42).andErr(() => err(123)));
    assertType<Result<boolean, never>>(ok(true).andErr(() => ok(false)));
    assertType<Result<boolean, string>>(ok(true).andErr(() => err("test")));
    assertType<Result<string | number, never>>(ok("test").andErr(() => ok(123)));
    assertType<Result<number, string>>(ok(42).andErr(() => err("error")));
    assertType<Result<boolean | string, never>>(ok(true).andErr(() => ok("string")));
    assertType<Result<number[] | string, never>>(ok([1, 2, 3]).andErr(() => ok("array")));
    assertType<Result<{ a: number }, string>>(ok({ a: 1 }).andErr(() => err("object")));
    assertType<Result<symbol | number, never>>(ok(Symbol("test")).andErr(() => ok(42)));
    assertType<Result<() => void, string>>(ok(() => {}).andErr(() => err("function")));
  });

  describe(".mapErr", () => {
    assertType<Result<string, string>>(ok("hello").mapErr(() => "world"));
    assertType<Result<number, number>>(ok(42).mapErr(() => 123));
    assertType<Result<boolean, boolean>>(ok(true).mapErr(() => false));
    assertType<Result<number[], number[]>>(ok([1, 2, 3]).mapErr(() => [4, 5, 6]));
    assertType<Result<{ a: number }, { b: number }>>(ok({ a: 1 }).mapErr(() => ({ b: 2 })));
  });

  describe(".tapErr", () => {
    assertType<Result<string, never>>(ok("hello").tapErr(() => {}));
    assertType<Result<number, never>>(ok(42).tapErr(() => {}));
    assertType<Result<boolean, never>>(ok(true).tapErr(() => {}));
  });

  describe(".and", () => {
    assertType<Result<number, never>>(ok("hello").and(() => ok(42)));
    assertType<Result<never, string>>(ok("hello").and(() => err("error")));
    assertType<Result<string, never>>(ok(42).and(() => ok("world")));
    assertType<Result<never, number>>(ok(42).and(() => err(123)));
    assertType<Result<boolean, never>>(ok(true).and(() => ok(false)));
    assertType<Result<never, string>>(ok(true).and(() => err("test")));
  });

  describe(".map", () => {
    assertType<Result<number, never>>(ok("hello").map(() => 42));
    assertType<Result<string, never>>(ok(42).map(() => "world"));
    assertType<Result<boolean, never>>(ok("test").map(() => true));
    assertType<Result<number[], never>>(ok("array").map(() => [1, 2, 3]));
    assertType<Result<{ b: number }, never>>(ok("object").map(() => ({ b: 2 })));
  });

  describe(".tap", () => {
    assertType<Result<string, never>>(ok("hello").tap(() => {}));
    assertType<Result<number, never>>(ok(42).tap(() => {}));
    assertType<Result<boolean, never>>(ok(true).tap(() => {}));
  });

  describe(".attempt", () => {
    assertType<Result<number, Error>>(ok("hello").attempt(() => 42));
    assertType<Result<string, Error>>(
      ok("hello").attempt(() => {
        throw new Error("test");
      }),
    );
    assertType<Result<boolean, Error>>(ok(42).attempt(() => true));
    assertType<Result<number[], Error>>(ok("array").attempt(() => [1, 2, 3]));
    assertType<Result<{ b: number }, Error>>(ok("object").attempt(() => ({ b: 2 })));
    assertType<Result<symbol, Error>>(ok("symbol").attempt(() => Symbol("test")));
    assertType<Result<() => void, Error>>(ok("function").attempt(() => () => {}));
  });
});

describe("Err (types)", () => {
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

  describe(".andErr", () => {
    assertType<Result<number, never>>(err("hello").andErr(() => ok(42)));
    assertType<Result<never, string>>(err("hello").andErr(() => err("error")));
    assertType<Result<string, never>>(err(42).andErr(() => ok("world")));
    assertType<Result<never, number>>(err(42).andErr(() => err(123)));
    assertType<Result<boolean, never>>(err(true).andErr(() => ok(false)));
    assertType<Result<never, string>>(err(true).andErr(() => err("test")));
  });

  describe(".mapErr", () => {
    assertType<Result<never, number>>(err("hello").mapErr(() => 42));
    assertType<Result<never, string>>(err(42).mapErr(() => "world"));
    assertType<Result<never, boolean>>(err("test").mapErr(() => true));
    assertType<Result<never, number[]>>(err("array").mapErr(() => [1, 2, 3]));
    assertType<Result<never, { b: number }>>(err("object").mapErr(() => ({ b: 2 })));
  });

  describe(".tapErr", () => {
    assertType<Result<never, string>>(err("hello").tapErr(() => {}));
    assertType<Result<never, number>>(err(42).tapErr(() => {}));
    assertType<Result<never, boolean>>(err(true).tapErr(() => {}));
  });

  describe(".and", () => {
    assertType<Result<number, string>>(err("hello").and(() => ok(42)));
    assertType<Result<never, string>>(err("hello").and(() => err("error")));
    assertType<Result<string, number>>(err(42).and(() => ok("world")));
    assertType<Result<never, number>>(err(42).and(() => err(123)));
    assertType<Result<boolean, boolean>>(err(true).and(() => ok(false)));
    assertType<Result<never, string | boolean>>(err(true).and(() => err("test")));
  });

  describe(".map", () => {
    assertType<Result<number, string>>(err("hello").map(() => 42));
    assertType<Result<string, number>>(err(42).map(() => "world"));
    assertType<Result<boolean, string>>(err("test").map(() => true));
    assertType<Result<number[], string>>(err("array").map(() => [1, 2, 3]));
    assertType<Result<{ b: number }, string>>(err("object").map(() => ({ b: 2 })));
  });

  describe(".tap", () => {
    assertType<Result<never, string>>(err("hello").tap(() => {}));
    assertType<Result<never, number>>(err(42).tap(() => {}));
    assertType<Result<never, boolean>>(err(true).tap(() => {}));
  });

  describe(".attempt", () => {
    assertType<Result<number, string | Error>>(err("hello").attempt(() => 42));
    assertType<Result<string, string | Error>>(err("hello").attempt(() => "world"));
    assertType<Result<boolean, number | Error>>(err(42).attempt(() => true));
    assertType<Result<number[], string | Error>>(err("array").attempt(() => [1, 2, 3]));
    assertType<Result<{ b: number }, string | Error>>(err("object").attempt(() => ({ b: 2 })));
    assertType<Result<symbol, string | Error>>(err("symbol").attempt(() => Symbol("test")));
    assertType<Result<() => void, string | Error>>(err("function").attempt(() => () => {}));
  });
});

describe("ResultPromise.create (types)", () => {
  describe("instantiation", () => {
    assertType<ResultPromise<number, never>>(ResultPromise.create(Promise.resolve(ok(42))));
    assertType<ResultPromise<string, never>>(
      ResultPromise.create(Promise.resolve(ok("hello"))),
    );
    assertType<ResultPromise<boolean, never>>(ResultPromise.create(Promise.resolve(ok(true))));
    assertType<ResultPromise<boolean, never>>(
      ResultPromise.create(Promise.resolve(ok(false))),
    );
    assertType<ResultPromise<null, never>>(ResultPromise.create(Promise.resolve(ok(null))));
    assertType<ResultPromise<undefined, never>>(
      ResultPromise.create(Promise.resolve(ok(undefined))),
    );
    assertType<ResultPromise<number, never>>(ResultPromise.create(Promise.resolve(ok(0))));
    assertType<ResultPromise<string, never>>(ResultPromise.create(Promise.resolve(ok(""))));
    assertType<ResultPromise<number, never>>(ResultPromise.create(Promise.resolve(ok(NaN))));
    assertType<ResultPromise<number, never>>(
      ResultPromise.create(Promise.resolve(ok(Infinity))),
    );
    assertType<ResultPromise<number, never>>(
      ResultPromise.create(Promise.resolve(ok(-Infinity))),
    );
    assertType<ResultPromise<never, number>>(ResultPromise.create(Promise.resolve(err(42))));
    assertType<ResultPromise<never, string>>(
      ResultPromise.create(Promise.resolve(err("hello"))),
    );
    assertType<ResultPromise<never, boolean>>(
      ResultPromise.create(Promise.resolve(err(true))),
    );
    assertType<ResultPromise<never, boolean>>(
      ResultPromise.create(Promise.resolve(err(false))),
    );
    assertType<ResultPromise<never, null>>(ResultPromise.create(Promise.resolve(err(null))));
    assertType<ResultPromise<never, undefined>>(
      ResultPromise.create(Promise.resolve(err(undefined))),
    );
    assertType<ResultPromise<never, number>>(ResultPromise.create(Promise.resolve(err(0))));
    assertType<ResultPromise<never, string>>(ResultPromise.create(Promise.resolve(err(""))));
    assertType<ResultPromise<never, number>>(ResultPromise.create(Promise.resolve(err(NaN))));
    assertType<ResultPromise<never, number>>(
      ResultPromise.create(Promise.resolve(err(Infinity))),
    );
    assertType<ResultPromise<never, number>>(
      ResultPromise.create(Promise.resolve(err(-Infinity))),
    );
    assertType<ResultPromise<never[], never>>(ResultPromise.create(Promise.resolve(ok([]))));
    assertType<ResultPromise<number[], never>>(
      ResultPromise.create(Promise.resolve(ok([1, 2, 3]))),
    );
    assertType<ResultPromise<Record<string, unknown>, never>>(
      ResultPromise.create(Promise.resolve(ok({}))),
    );
    assertType<ResultPromise<{ a: number; b: string }, never>>(
      ResultPromise.create(Promise.resolve(ok({ a: 1, b: "test" }))),
    );
    assertType<ResultPromise<symbol, never>>(
      ResultPromise.create(Promise.resolve(ok(Symbol("sym")))),
    );
    assertType<ResultPromise<() => void, never>>(
      ResultPromise.create(Promise.resolve(ok(function () {}))),
    );
    assertType<ResultPromise<() => number, never>>(
      ResultPromise.create(Promise.resolve(ok(() => 123))),
    );
    assertType<ResultPromise<never, never[]>>(ResultPromise.create(Promise.resolve(err([]))));
    assertType<ResultPromise<never, number[]>>(
      ResultPromise.create(Promise.resolve(err([1, 2, 3]))),
    );
    assertType<ResultPromise<never, Record<string, unknown>>>(
      ResultPromise.create(Promise.resolve(err({}))),
    );
    assertType<ResultPromise<never, { a: number; b: string }>>(
      ResultPromise.create(Promise.resolve(err({ a: 1, b: "test" }))),
    );
    assertType<ResultPromise<never, symbol>>(
      ResultPromise.create(Promise.resolve(err(Symbol("sym")))),
    );
    assertType<ResultPromise<never, () => void>>(
      ResultPromise.create(Promise.resolve(err(function () {}))),
    );
    assertType<ResultPromise<never, () => number>>(
      ResultPromise.create(Promise.resolve(err(() => 123))),
    );
  });

  describe(".andErr", () => {
    assertType<ResultPromise<string | number, never>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).andErr(() => ok(42)),
    );
    assertType<ResultPromise<string, string>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).andErr(() => err("error")),
    );
    assertType<ResultPromise<number | string, never>>(
      ResultPromise.create(Promise.resolve(ok(42))).andErr(() => ok("world")),
    );
    assertType<ResultPromise<number, number>>(
      ResultPromise.create(Promise.resolve(ok(42))).andErr(() => err(123)),
    );
    assertType<ResultPromise<number, never>>(
      ResultPromise.create(Promise.resolve(err("hello"))).andErr(() => ok(42)),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.create(Promise.resolve(err("hello"))).andErr(() => err("error")),
    );
    assertType<ResultPromise<string, never>>(
      ResultPromise.create(Promise.resolve(err(42))).andErr(() => ok("world")),
    );
    assertType<ResultPromise<never, number>>(
      ResultPromise.create(Promise.resolve(err(42))).andErr(() => err(123)),
    );
  });

  describe(".mapErr", () => {
    assertType<ResultPromise<string, string>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).mapErr(() => "world"),
    );
    assertType<ResultPromise<number, number>>(
      ResultPromise.create(Promise.resolve(ok(42))).mapErr(() => 123),
    );
    assertType<ResultPromise<boolean, boolean>>(
      ResultPromise.create(Promise.resolve(ok(true))).mapErr(() => false),
    );
    assertType<ResultPromise<never, number>>(
      ResultPromise.create(Promise.resolve(err("hello"))).mapErr(() => 42),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.create(Promise.resolve(err(42))).mapErr(() => "world"),
    );
    assertType<ResultPromise<never, boolean>>(
      ResultPromise.create(Promise.resolve(err("test"))).mapErr(() => true),
    );
  });

  describe(".tapErr", () => {
    assertType<ResultPromise<string, never>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).tapErr(() => {}),
    );
    assertType<ResultPromise<number, never>>(
      ResultPromise.create(Promise.resolve(ok(42))).tapErr(() => {}),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.create(Promise.resolve(err("hello"))).tapErr(() => {}),
    );
    assertType<ResultPromise<never, number>>(
      ResultPromise.create(Promise.resolve(err(42))).tapErr(() => {}),
    );
  });

  describe(".and", () => {
    assertType<ResultPromise<number, never>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).and(() => ok(42)),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).and(() => err("error")),
    );
    assertType<ResultPromise<string, never>>(
      ResultPromise.create(Promise.resolve(ok(42))).and(() => ok("world")),
    );
    assertType<ResultPromise<never, number>>(
      ResultPromise.create(Promise.resolve(ok(42))).and(() => err(123)),
    );
    assertType<ResultPromise<number, string>>(
      ResultPromise.create(Promise.resolve(err("hello"))).and(() => ok(42)),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.create(Promise.resolve(err("hello"))).and(() => err("error")),
    );
    assertType<ResultPromise<string, number>>(
      ResultPromise.create(Promise.resolve(err(42))).and(() => ok("world")),
    );
    assertType<ResultPromise<never, number>>(
      ResultPromise.create(Promise.resolve(err(42))).and(() => err(123)),
    );
  });

  describe(".map", () => {
    assertType<ResultPromise<number, never>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).map(() => 42),
    );
    assertType<ResultPromise<string, never>>(
      ResultPromise.create(Promise.resolve(ok(42))).map(() => "world"),
    );
    assertType<ResultPromise<boolean, never>>(
      ResultPromise.create(Promise.resolve(ok("test"))).map(() => true),
    );
    assertType<ResultPromise<number, string>>(
      ResultPromise.create(Promise.resolve(err("hello"))).map(() => 42),
    );
    assertType<ResultPromise<string, number>>(
      ResultPromise.create(Promise.resolve(err(42))).map(() => "world"),
    );
    assertType<ResultPromise<boolean, string>>(
      ResultPromise.create(Promise.resolve(err("test"))).map(() => true),
    );
  });

  describe(".tap", () => {
    assertType<ResultPromise<string, never>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).tap(() => {}),
    );
    assertType<ResultPromise<number, never>>(
      ResultPromise.create(Promise.resolve(ok(42))).tap(() => {}),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.create(Promise.resolve(err("hello"))).tap(() => {}),
    );
    assertType<ResultPromise<never, number>>(
      ResultPromise.create(Promise.resolve(err(42))).tap(() => {}),
    );
  });

  describe(".attempt", () => {
    assertType<ResultPromise<number, Error>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).attempt(() => 42),
    );
    assertType<ResultPromise<string, Error>>(
      ResultPromise.create(Promise.resolve(ok("hello"))).attempt(() => {
        throw new Error("test");
      }),
    );
    assertType<ResultPromise<boolean, Error>>(
      ResultPromise.create(Promise.resolve(ok(42))).attempt(() => true),
    );
    assertType<ResultPromise<number[], Error>>(
      ResultPromise.create(Promise.resolve(ok("array"))).attempt(() => [1, 2, 3]),
    );
    assertType<ResultPromise<{ b: number }, Error>>(
      ResultPromise.create(Promise.resolve(ok("object"))).attempt(() => ({ b: 2 })),
    );
    assertType<ResultPromise<number, string | Error>>(
      ResultPromise.create(Promise.resolve(err("hello"))).attempt(() => 42),
    );
    assertType<ResultPromise<string, string | Error>>(
      ResultPromise.create(Promise.resolve(err("hello"))).attempt(() => "world"),
    );
    assertType<ResultPromise<boolean, number | Error>>(
      ResultPromise.create(Promise.resolve(err(42))).attempt(() => true),
    );
  });
});

describe("ResultPromise.createFunction (types)", () => {
  describe("instantiation", () => {
    assertType<(...args: [number]) => ResultPromise<number, never>>(
      ResultPromise.createFunction(async (x: number) => ok(x)),
    );
    assertType<(...args: [string]) => ResultPromise<string, never>>(
      ResultPromise.createFunction(async (x: string) => ok(x)),
    );
    assertType<(...args: [boolean]) => ResultPromise<boolean, never>>(
      ResultPromise.createFunction(async (x: boolean) => ok(x)),
    );
    assertType<(...args: [null]) => ResultPromise<null, never>>(
      ResultPromise.createFunction(async (x: null) => ok(x)),
    );
    assertType<(...args: [undefined]) => ResultPromise<undefined, never>>(
      ResultPromise.createFunction(async (x: undefined) => ok(x)),
    );
    assertType<(...args: [number]) => ResultPromise<never, number>>(
      ResultPromise.createFunction(async (x: number) => err(x)),
    );
    assertType<(...args: [string]) => ResultPromise<never, string>>(
      ResultPromise.createFunction(async (x: string) => err(x)),
    );
    assertType<(...args: [boolean]) => ResultPromise<never, boolean>>(
      ResultPromise.createFunction(async (x: boolean) => err(x)),
    );
    assertType<(...args: [number[]]) => ResultPromise<number[], never>>(
      ResultPromise.createFunction(async (x: number[]) => ok(x)),
    );
    assertType<
      (...args: [{ a: number; b: string }]) => ResultPromise<{ a: number; b: string }, never>
    >(ResultPromise.createFunction(async (x: { a: number; b: string }) => ok(x)));
    assertType<(...args: [symbol]) => ResultPromise<symbol, never>>(
      ResultPromise.createFunction(async (x: symbol) => ok(x)),
    );
    assertType<(...args: []) => ResultPromise<string, never>>(
      ResultPromise.createFunction(async () => ok("no params")),
    );
    assertType<(...args: [string]) => ResultPromise<string, string>>(
      ResultPromise.createFunction(async (x: string) => (x.length > 0 ? ok(x) : err("empty"))),
    );
  });

  describe(".andErr", () => {
    assertType<ResultPromise<string | number, never>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").andErr(() => ok(42)),
    );
    assertType<ResultPromise<string, string>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").andErr(() => err("error")),
    );
    assertType<ResultPromise<number, never>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").andErr(() => ok(42)),
    );
    assertType<ResultPromise<never, number>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").andErr(() => err(42)),
    );
  });

  describe(".mapErr", () => {
    assertType<ResultPromise<string, string>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").mapErr(() => "mapped"),
    );
    assertType<ResultPromise<string, number>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").mapErr(() => 42),
    );
    assertType<ResultPromise<never, number>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").mapErr(() => 42),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").mapErr(() => "mapped"),
    );
  });

  describe(".tapErr", () => {
    assertType<ResultPromise<string, never>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").tapErr(() => {}),
    );
    assertType<ResultPromise<string, never>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").tapErr(() => {}),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").tapErr(() => {}),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").tapErr(() => {}),
    );
  });

  describe(".and", () => {
    assertType<ResultPromise<number, never>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").and((val) => ok(val.length)),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").and((val) => err(val)),
    );
    assertType<ResultPromise<never, string>>(
      // @ts-expect-error val is of type never
      ResultPromise.createFunction(async (x: string) => err(x))("test").and((val) => ok(val.length)),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").and((val) => err(val)),
    );
  });

  describe(".map", () => {
    assertType<ResultPromise<number, never>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").map((val) => val.length),
    );
    assertType<ResultPromise<string, never>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").map((val) =>
        val.toUpperCase(),
      ),
    );
    assertType<ResultPromise<never, string>>(
      // @ts-expect-error val is of type never
      ResultPromise.createFunction(async (x: string) => err(x))("test").map((val) => val.length),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").map((val) => val),
    );
  });

  describe(".tap", () => {
    assertType<ResultPromise<string, never>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").tap(() => {}),
    );
    assertType<ResultPromise<string, never>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").tap(() => {}),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").tap(() => {}),
    );
    assertType<ResultPromise<never, string>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").tap(() => {}),
    );
  });

  describe(".attempt", () => {
    assertType<ResultPromise<number, Error>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").attempt(() => 42),
    );
    assertType<ResultPromise<string, Error>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").attempt(() => {
        throw new Error("test");
      }),
    );
    assertType<ResultPromise<boolean, Error>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").attempt(() => true),
    );
    assertType<ResultPromise<number[], Error>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").attempt(() => [1, 2, 3]),
    );
    assertType<ResultPromise<{ b: number }, Error>>(
      ResultPromise.createFunction(async (x: string) => ok(x))("test").attempt(() => ({ b: 2 })),
    );
    assertType<ResultPromise<number, string | Error>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").attempt(() => 42),
    );
    assertType<ResultPromise<string, string | Error>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").attempt(() => "world"),
    );
    assertType<ResultPromise<boolean, string | Error>>(
      ResultPromise.createFunction(async (x: string) => err(x))("test").attempt(() => true),
    );
  });
});
