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

describe("ResultPromise.ok (types)", () => {
  describe("instantiation", () => {
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(42));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.ok("hello"));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.ok(true));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.ok(false));
    assertType<ResultPromise<Ok<null>>>(ResultPromise.ok(null));
    assertType<ResultPromise<Ok<undefined>>>(ResultPromise.ok(undefined));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(0));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.ok(""));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(NaN));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(Infinity));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(-Infinity));
    assertType<ResultPromise<Ok<never[]>>>(ResultPromise.ok([]));
    assertType<ResultPromise<Ok<number[]>>>(ResultPromise.ok([1, 2, 3]));
    assertType<ResultPromise<Ok<Record<string, unknown>>>>(ResultPromise.ok({}));
    assertType<ResultPromise<Ok<{ a: number; b: string }>>>(ResultPromise.ok({ a: 1, b: "test" }));
    assertType<ResultPromise<Ok<symbol>>>(ResultPromise.ok(Symbol("sym")));
    assertType<ResultPromise<Ok<() => void>>>(ResultPromise.ok(function () {}));
    assertType<ResultPromise<Ok<() => number>>>(ResultPromise.ok(() => 123));
  });

  describe(".or", () => {
    assertType<ResultPromise<Ok<string>>>(ResultPromise.ok("hello").or(() => ok(42)));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.ok("hello").or(() => err("error")));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(42).or(() => ok("world")));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(42).or(() => err(123)));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.ok(true).or(() => ok(false)));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.ok(true).or(() => err("test")));
  });

  describe(".orMap", () => {
    assertType<ResultPromise<Ok<string>>>(ResultPromise.ok("hello").orMap(() => "world"));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(42).orMap(() => 123));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.ok(true).orMap(() => false));
    assertType<ResultPromise<Ok<number[]>>>(ResultPromise.ok([1, 2, 3]).orMap(() => [4, 5, 6]));
    assertType<ResultPromise<Ok<{ a: number }>>>(
      ResultPromise.ok({ a: 1 }).orMap(() => ({ b: 2 })),
    );
  });

  describe(".orTee", () => {
    assertType<ResultPromise<Ok<string>>>(ResultPromise.ok("hello").orTee(() => {}));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(42).orTee(() => {}));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.ok(true).orTee(() => {}));
  });

  describe(".and", () => {
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok("hello").and(() => ok(42)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.ok("hello").and(() => err("error")));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.ok(42).and(() => ok("world")));
    assertType<ResultPromise<Err<number>>>(ResultPromise.ok(42).and(() => err(123)));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.ok(true).and(() => ok(false)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.ok(true).and(() => err("test")));
  });

  describe(".andMap", () => {
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok("hello").andMap(() => 42));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.ok(42).andMap(() => "world"));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.ok("test").andMap(() => true));
    assertType<ResultPromise<Ok<number[]>>>(ResultPromise.ok("array").andMap(() => [1, 2, 3]));
    assertType<ResultPromise<Ok<{ b: number }>>>(
      ResultPromise.ok("object").andMap(() => ({ b: 2 })),
    );
  });

  describe(".andTee", () => {
    assertType<ResultPromise<Ok<string>>>(ResultPromise.ok("hello").andTee(() => {}));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.ok(42).andTee(() => {}));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.ok(true).andTee(() => {}));
  });
});

describe("ResultPromise.err (types)", () => {
  describe("instantiation", () => {
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(42));
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("hello"));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.err(true));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.err(false));
    assertType<ResultPromise<Err<null>>>(ResultPromise.err(null));
    assertType<ResultPromise<Err<undefined>>>(ResultPromise.err(undefined));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(0));
    assertType<ResultPromise<Err<string>>>(ResultPromise.err(""));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(NaN));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(Infinity));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(-Infinity));
    assertType<ResultPromise<Err<never[]>>>(ResultPromise.err([]));
    assertType<ResultPromise<Err<number[]>>>(ResultPromise.err([1, 2, 3]));
    assertType<ResultPromise<Err<Record<string, unknown>>>>(ResultPromise.err({}));
    assertType<ResultPromise<Err<{ a: number; b: string }>>>(
      ResultPromise.err({ a: 1, b: "test" }),
    );
    assertType<ResultPromise<Err<symbol>>>(ResultPromise.err(Symbol("sym")));
    assertType<ResultPromise<Err<() => void>>>(ResultPromise.err(function () {}));
    assertType<ResultPromise<Err<() => number>>>(ResultPromise.err(() => 123));
  });

  describe(".or", () => {
    assertType<ResultPromise<Ok<number>>>(ResultPromise.err("hello").or(() => ok(42)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("hello").or(() => err("error")));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.err(42).or(() => ok("world")));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(42).or(() => err(123)));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.err(true).or(() => ok(false)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.err(true).or(() => err("test")));
  });

  describe(".orMap", () => {
    assertType<ResultPromise<Err<number>>>(ResultPromise.err("hello").orMap(() => 42));
    assertType<ResultPromise<Err<string>>>(ResultPromise.err(42).orMap(() => "world"));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.err("test").orMap(() => true));
    assertType<ResultPromise<Err<number[]>>>(ResultPromise.err("array").orMap(() => [1, 2, 3]));
    assertType<ResultPromise<Err<{ b: number }>>>(
      ResultPromise.err("object").orMap(() => ({ b: 2 })),
    );
  });

  describe(".orTee", () => {
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("hello").orTee(() => {}));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(42).orTee(() => {}));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.err(true).orTee(() => {}));
  });

  describe(".and", () => {
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("hello").and(() => ok(42)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("hello").and(() => err("error")));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(42).and(() => ok("world")));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(42).and(() => err(123)));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.err(true).and(() => ok(false)));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.err(true).and(() => err("test")));
  });

  describe(".andMap", () => {
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("hello").andMap(() => 42));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(42).andMap(() => "world"));
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("test").andMap(() => true));
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("array").andMap(() => [1, 2, 3]));
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("object").andMap(() => ({ b: 2 })));
  });

  describe(".andTee", () => {
    assertType<ResultPromise<Err<string>>>(ResultPromise.err("hello").andTee(() => {}));
    assertType<ResultPromise<Err<number>>>(ResultPromise.err(42).andTee(() => {}));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.err(true).andTee(() => {}));
  });
});

describe("ResultPromise.from (types)", () => {
  describe("instantiation", () => {
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(42)));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(ok("hello")));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.from(ok(true)));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.from(ok(false)));
    assertType<ResultPromise<Ok<null>>>(ResultPromise.from(ok(null)));
    assertType<ResultPromise<Ok<undefined>>>(ResultPromise.from(ok(undefined)));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(0)));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(ok("")));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(NaN)));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(Infinity)));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(-Infinity)));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(42)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(err("hello")));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.from(err(true)));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.from(err(false)));
    assertType<ResultPromise<Err<null>>>(ResultPromise.from(err(null)));
    assertType<ResultPromise<Err<undefined>>>(ResultPromise.from(err(undefined)));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(0)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(err("")));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(NaN)));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(Infinity)));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(-Infinity)));
    assertType<ResultPromise<Ok<never[]>>>(ResultPromise.from(ok([])));
    assertType<ResultPromise<Ok<number[]>>>(ResultPromise.from(ok([1, 2, 3])));
    assertType<ResultPromise<Ok<Record<string, unknown>>>>(ResultPromise.from(ok({})));
    assertType<ResultPromise<Ok<{ a: number; b: string }>>>(
      ResultPromise.from(ok({ a: 1, b: "test" })),
    );
    assertType<ResultPromise<Ok<symbol>>>(ResultPromise.from(ok(Symbol("sym"))));
    assertType<ResultPromise<Ok<() => void>>>(ResultPromise.from(ok(function () {})));
    assertType<ResultPromise<Ok<() => number>>>(ResultPromise.from(ok(() => 123)));
    assertType<ResultPromise<Err<never[]>>>(ResultPromise.from(err([])));
    assertType<ResultPromise<Err<number[]>>>(ResultPromise.from(err([1, 2, 3])));
    assertType<ResultPromise<Err<Record<string, unknown>>>>(ResultPromise.from(err({})));
    assertType<ResultPromise<Err<{ a: number; b: string }>>>(
      ResultPromise.from(err({ a: 1, b: "test" })),
    );
    assertType<ResultPromise<Err<symbol>>>(ResultPromise.from(err(Symbol("sym"))));
    assertType<ResultPromise<Err<() => void>>>(ResultPromise.from(err(function () {})));
    assertType<ResultPromise<Err<() => number>>>(ResultPromise.from(err(() => 123)));
  });

  describe(".or", () => {
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(ok("hello")).or(() => ok(42)));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(ok("hello")).or(() => err("error")));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(42)).or(() => ok("world")));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(42)).or(() => err(123)));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(err("hello")).or(() => ok(42)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(err("hello")).or(() => err("error")));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(err(42)).or(() => ok("world")));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(42)).or(() => err(123)));
  });

  describe(".orMap", () => {
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(ok("hello")).orMap(() => "world"));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(42)).orMap(() => 123));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.from(ok(true)).orMap(() => false));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err("hello")).orMap(() => 42));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(err(42)).orMap(() => "world"));
    assertType<ResultPromise<Err<boolean>>>(ResultPromise.from(err("test")).orMap(() => true));
  });

  describe(".orTee", () => {
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(ok("hello")).orTee(() => {}));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(42)).orTee(() => {}));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(err("hello")).orTee(() => {}));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(42)).orTee(() => {}));
  });

  describe(".and", () => {
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok("hello")).and(() => ok(42)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(ok("hello")).and(() => err("error")));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(ok(42)).and(() => ok("world")));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(ok(42)).and(() => err(123)));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(err("hello")).and(() => ok(42)));
    assertType<ResultPromise<Err<string>>>(
      ResultPromise.from(err("hello")).and(() => err("error")),
    );
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(42)).and(() => ok("world")));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(42)).and(() => err(123)));
  });

  describe(".andMap", () => {
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok("hello")).andMap(() => 42));
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(ok(42)).andMap(() => "world"));
    assertType<ResultPromise<Ok<boolean>>>(ResultPromise.from(ok("test")).andMap(() => true));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(err("hello")).andMap(() => 42));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(42)).andMap(() => "world"));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(err("test")).andMap(() => true));
  });

  describe(".andTee", () => {
    assertType<ResultPromise<Ok<string>>>(ResultPromise.from(ok("hello")).andTee(() => {}));
    assertType<ResultPromise<Ok<number>>>(ResultPromise.from(ok(42)).andTee(() => {}));
    assertType<ResultPromise<Err<string>>>(ResultPromise.from(err("hello")).andTee(() => {}));
    assertType<ResultPromise<Err<number>>>(ResultPromise.from(err(42)).andTee(() => {}));
  });
});
