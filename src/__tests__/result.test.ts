import { it, expect, vitest, describe } from "vitest";

import { values } from "@/__tests__/utils";
import { ok, Ok, Err, err, ResultPromise } from "@/result";

describe("Result.ok", () => {
  describe("instantiation", () => {
    it.each(values)("Ok('%s') returns correct value", (value) => {
      const result = ok(value);

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);

      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
    });
  });

  describe(".or", () => {
    it.each(values)("Ok('%s').or() returns original Ok unchanged", (value) => {
      const orFn = vitest.fn();
      const result = ok(value).or(orFn);

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);

      expect(orFn).not.toBeCalled();
    });
  });

  describe(".orMap", () => {
    it.each(values)("Ok('%s').orMap() returns original Ok unchanged", (value) => {
      const orMapFn = vitest.fn();
      const result = ok(value).orMap(orMapFn);

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);

      expect(orMapFn).not.toBeCalled();
    });
  });

  describe(".orTee", () => {
    it.each(values)("Ok('%s').orTee() returns original Ok unchanged", (value) => {
      const orTeeFn = vitest.fn();
      const result = ok(value).orTee(orTeeFn);

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);

      expect(orTeeFn).not.toBeCalled();
    });
  });

  describe(".and", () => {
    it.each(values)("Ok('%s').and() applies function to value", (value) => {
      const result = ok(value).and((x) => ok(x));

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);
    });

    it.each(values)("Ok('%s').and() applies function to value", (value) => {
      const result = ok(value).and((x) => err(x));

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);
    });
  });

  describe(".andMap", () => {
    it.each(values)("Ok('%s').andMap() applies function to value", (value) => {
      const result = ok(value).andMap((x) => x);

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);
    });
  });

  describe(".andTee", () => {
    it.each(values)("Ok('%s').andTee() applies function to value", (value) => {
      const andTeeFn = vitest.fn().mockImplementation(() => {
        throw new Error("hi");
      });

      const result = ok(value).andTee(andTeeFn);

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);

      expect(andTeeFn).toBeCalledTimes(1);
    });
  });
});

describe("Result.err", () => {
  describe("instantiation", () => {
    it.each(values)("Err('%s') returns correct value", (value) => {
      const result = err(value);

      expect(result).toBeInstanceOf(Err);

      if (typeof value === "number" && isNaN(value)) {
        expect(result.error).toBeNaN();
      } else {
        expect(result.error).toEqual(value);
      }

      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
    });
  });

  describe(".or", () => {
    it.each(values)("Err('%s').or() applies function to value", (value) => {
      const result = err(value).or((x) => err(x));

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);
    });

    it.each(values)("Err('%s').or() applies function to value", (value) => {
      const result = err(value).or((x) => ok(x));

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);
    });
  });

  describe(".orMap", () => {
    it.each(values)("Err('%s').orMap() applies function to value", (value) => {
      const result = err(value).orMap((x) => x);

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);
    });
  });

  describe(".orTee", () => {
    it.each(values)("Err('%s').orTee() applies function to value", (value) => {
      const orTeeFn = vitest.fn().mockImplementation(() => {
        throw new Error("hi");
      });
      const result = err(value).orTee(orTeeFn);

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);

      expect(orTeeFn).toBeCalledTimes(1);
    });
  });

  describe(".and", () => {
    it.each(values)("Err('%s').and() returns original Err unchanged", (value) => {
      const andFn = vitest.fn();
      const result = err(value).and(andFn);

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);

      expect(andFn).not.toBeCalled();
    });
  });

  describe(".andMap", () => {
    it.each(values)("Err('%s').andMap() returns original Err unchanged", (value) => {
      const andMapFn = vitest.fn();
      const result = err(value).andMap(andMapFn);

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);

      expect(andMapFn).not.toBeCalled();
    });
  });

  describe(".andTee", () => {
    it.each(values)("Err('%s').andTee() returns original Err unchanged", (value) => {
      const andTeeFn = vitest.fn();
      const result = err(value).andTee(andTeeFn);

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);

      expect(andTeeFn).not.toBeCalled();
    });
  });
});

describe("ResultPromise.fromPromise", () => {
  describe("instantiation", () => {
    it.each(values)(
      "ResultPromise.fromPromise('%s') returns Ok with correct value",
      async (value) => {
        const result = ResultPromise.fromPromise(Promise.resolve(ok(value)));

        expect(result).toBeInstanceOf(ResultPromise);

        const awaited = await result;

        expect(awaited).toBeInstanceOf(Ok);
        expect(awaited.value).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromPromise('%s') returns Err with correct value",
      async (value) => {
        const result = ResultPromise.fromPromise(Promise.resolve(err(value)));

        expect(result).toBeInstanceOf(ResultPromise);

        const awaited = await result;

        expect(awaited).toBeInstanceOf(Err);
        expect(awaited.error).toEqual(value);
      },
    );
  });

  describe(".or", () => {
    it.each(values)(
      "ResultPromise.fromPromise(ok('%s')).or() returns original Ok unchanged",
      async (value) => {
        const orFn = vitest.fn();
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(ok(value))).or(orFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
        expect(orFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.fromPromise(err('%s')).or() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(err(value))).or((x) =>
          err(x),
        );
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromPromise(err('%s')).or() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(err(value))).or((x) =>
          ok(x),
        );
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
      },
    );
  });

  describe(".orMap", () => {
    it.each(values)(
      "ResultPromise.fromPromise(ok('%s')).orMap() returns original Ok unchanged",
      async (value) => {
        const orMapFn = vitest.fn();
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(ok(value))).orMap(orMapFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);

        expect(orMapFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.fromPromise(err('%s')).orMap() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(err(value))).orMap(
          (x) => x,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
      },
    );
  });

  describe(".orTee", () => {
    it.each(values)(
      "ResultPromise.fromPromise(ok('%s')).orTee() returns original Ok unchanged",
      async (value) => {
        const orTeeFn = vitest.fn();
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(ok(value))).orTee(orTeeFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);

        expect(orTeeFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.fromPromise(err('%s')).orTee() applies function to value",
      async (value) => {
        const orTeeFn = vitest.fn().mockImplementation(() => {
          throw new Error("hi");
        });
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(err(value))).orTee(orTeeFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);

        expect(orTeeFn).toBeCalledTimes(1);
      },
    );
  });

  describe(".and", () => {
    it.each(values)(
      "ResultPromise.fromPromise(ok('%s')).and() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(ok(value))).and((x) =>
          ok(x),
        );
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromPromise(ok('%s')).and() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(ok(value))).and((x) =>
          err(x),
        );
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromPromise(err('%s')).and() returns original Err unchanged",
      async (value) => {
        const andFn = vitest.fn();
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(err(value))).and(andFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
        expect(andFn).not.toBeCalled();
      },
    );
  });

  describe(".andMap", () => {
    it.each(values)(
      "ResultPromise.fromPromise(ok('%s')).andMap() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(ok(value))).andMap(
          (x) => x,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromPromise(err('%s')).andMap() returns original Err unchanged",
      async (value) => {
        const andMapFn = vitest.fn();
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(err(value))).andMap(
          andMapFn,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);

        expect(andMapFn).not.toBeCalled();
      },
    );
  });

  describe(".andTee", () => {
    it.each(values)(
      "ResultPromise.fromPromise(ok('%s')).andTee() applies function to value",
      async (value) => {
        const andTeeFn = vitest.fn().mockImplementation(() => {
          throw new Error("hi");
        });

        const resultPromise = ResultPromise.fromPromise(Promise.resolve(ok(value))).andTee(
          andTeeFn,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);

        expect(andTeeFn).toBeCalledTimes(1);
      },
    );

    it.each(values)(
      "ResultPromise.fromPromise(err('%s')).andTee() returns original Err unchanged",
      async (value) => {
        const andTeeFn = vitest.fn();
        const resultPromise = ResultPromise.fromPromise(Promise.resolve(err(value))).andTee(
          andTeeFn,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);

        expect(andTeeFn).not.toBeCalled();
      },
    );
  });
});

describe("ResultPromise.fromFunction", () => {
  describe("instantiation", () => {
    it.each(values)(
      "ResultPromise.fromFunction returns function that returns Ok with correct value",
      async (value) => {
        const fn = ResultPromise.fromFunction(async (x: typeof value) => {
          return ok(x);
        });

        expect(typeof fn).toBe("function");

        const resultPromise = fn(value);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromFunction returns function that returns Err with correct value",
      async (value) => {
        const fn = ResultPromise.fromFunction(async (x: typeof value) => {
          return err(x);
        });

        expect(typeof fn).toBe("function");

        const resultPromise = fn(value);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
      },
    );
  });

  describe("function chaining", () => {
    it.each(values)(
      "ResultPromise.fromFunction with .or() returns original Ok unchanged",
      async (value) => {
        const orFn = vitest.fn();
        const fn = ResultPromise.fromFunction(async (x: typeof value) => {
          return ok(x);
        });

        const resultPromise = fn(value).or(orFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
        expect(orFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.fromFunction with .or() applies function to error",
      async (value) => {
        const fn = ResultPromise.fromFunction(async (x: typeof value) => {
          return err(x);
        });

        const resultPromise = fn(value).or((error) => err(error));
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromFunction with .or() transforms error to success",
      async (value) => {
        const fn = ResultPromise.fromFunction(async (x: typeof value) => {
          return err(x);
        });

        const resultPromise = fn(value).or((error) => ok(error));
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromFunction with .and() applies function to value",
      async (value) => {
        const fn = ResultPromise.fromFunction(async (x: typeof value) => {
          return ok(x);
        });

        const resultPromise = fn(value).and((val) => ok(val));
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromFunction with .and() transforms success to error",
      async (value) => {
        const fn = ResultPromise.fromFunction(async (x: typeof value) => {
          return ok(x);
        });

        const resultPromise = fn(value).and((val) => err(val));
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.fromFunction with .and() returns original error unchanged",
      async (value) => {
        const andFn = vitest.fn();
        const fn = ResultPromise.fromFunction(async (x: typeof value) => {
          return err(x);
        });

        const resultPromise = fn(value).and(andFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
        expect(andFn).not.toBeCalled();
      },
    );
  });

  describe("parameter handling", () => {
    it("handles multiple parameters correctly", async () => {
      const fn = ResultPromise.fromFunction(async (id: string, name: string, age: number) => {
        return ok({ id, name, age });
      });

      const resultPromise = fn("123", "John", 30);
      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;
      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual({ id: "123", name: "John", age: 30 });
    });

    it("handles no parameters correctly", async () => {
      const fn = ResultPromise.fromFunction(async () => {
        return ok("no params");
      });

      const resultPromise = fn();
      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;
      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toBe("no params");
    });

    it("preserves function signature and types", async () => {
      const fn = ResultPromise.fromFunction(async (id: string) => {
        if (id.length > 5) {
          return ok(id.toUpperCase());
        }
        return err("ID too short");
      });

      // Test success case
      const successPromise = fn("validid");
      const successResult = await successPromise;
      expect(successResult).toBeInstanceOf(Ok);

      if (successResult.isOk()) {
        expect(successResult.value).toBe("VALIDID");
      }

      // Test error case
      const errorPromise = fn("abc");
      const errorResult = await errorPromise;
      expect(errorResult).toBeInstanceOf(Err);

      if (errorResult.isErr()) {
        expect(errorResult.error).toBe("ID too short");
      }
    });
  });
});
