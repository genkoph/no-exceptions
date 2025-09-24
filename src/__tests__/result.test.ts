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

describe("ResultPromise.ok", () => {
  describe("instantiation", () => {
    it.each(values)("ResultPromise.Ok('%s') returns Ok with correct value", async (value) => {
      const result = ResultPromise.ok(value);

      expect(result).toBeInstanceOf(ResultPromise);

      const awaited = await result;

      expect(awaited).toBeInstanceOf(Ok);
      expect(awaited.value).toEqual(value);
    });
  });

  describe(".or", () => {
    it.each(values)("ResultPromise.Ok('%s').or() returns original Ok unchanged", async (value) => {
      const orFn = vitest.fn();
      const resultPromise = ResultPromise.ok(value).or(orFn);

      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);

      expect(orFn).not.toBeCalled();
    });
  });

  describe(".orMap", () => {
    it.each(values)(
      "ResultPromise.Ok('%s').orMap() returns original Ok unchanged",
      async (value) => {
        const orMapFn = vitest.fn();
        const resultPromise = ResultPromise.ok(value).orMap(orMapFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);

        expect(orMapFn).not.toBeCalled();
      },
    );
  });

  describe(".orTee", () => {
    it.each(values)(
      "ResultPromise.Ok('%s').orTee() returns original Ok unchanged",
      async (value) => {
        const orTeeFn = vitest.fn();
        const resultPromise = ResultPromise.ok(value).orTee(orTeeFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);

        expect(orTeeFn).not.toBeCalled();
      },
    );
  });

  describe(".and", () => {
    it.each(values)("ResultPromise.Ok('%s').and() applies function to value", async (value) => {
      const resultPromise = ResultPromise.ok(value).and((x) => ok(x));

      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);
    });

    it.each(values)("ResultPromise.Ok('%s').and() applies function to value", async (value) => {
      const resultPromise = ResultPromise.ok(value).and((x) => err(x));

      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);
    });
  });

  describe(".andMap", () => {
    it.each(values)("ResultPromise.Ok('%s').andMap() applies function to value", async (value) => {
      const resultPromise = ResultPromise.ok(value).andMap((x) => x);

      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);
    });
  });

  describe(".andTee", () => {
    it.each(values)("ResultPromise.Ok('%s').andTee() applies function to value", async (value) => {
      const andTeeFn = vitest.fn().mockImplementation(() => {
        throw new Error("hi");
      });

      const resultPromise = ResultPromise.ok(value).andTee(andTeeFn);

      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);

      expect(andTeeFn).toBeCalledTimes(1);
    });
  });
});

describe("ResultPromise.err", () => {
  describe("instantiation", () => {
    it.each(values)("ResultPromise.Err('%s') returns Err with correct value", async (value) => {
      const result = ResultPromise.err(value);

      expect(result).toBeInstanceOf(ResultPromise);

      const awaited = await result;

      expect(awaited).toBeInstanceOf(Err);
      expect(awaited.error).toEqual(value);
    });
  });

  describe(".or", () => {
    it.each(values)("ResultPromise.Err('%s').or() applies function to value", async (value) => {
      const resultPromise = ResultPromise.err(value).or((x) => err(x));

      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);
    });

    it.each(values)("ResultPromise.Err('%s').or() applies function to value", async (value) => {
      const resultPromise = ResultPromise.err(value).or((x) => ok(x));

      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);
    });
  });

  describe(".orMap", () => {
    it.each(values)("ResultPromise.Err('%s').orMap() applies function to value", async (value) => {
      const resultPromise = ResultPromise.err(value).orMap((x) => x);

      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);
    });
  });

  describe(".orTee", () => {
    it.each(values)("ResultPromise.Err('%s').orTee() applies function to value", async (value) => {
      const orTeeFn = vitest.fn().mockImplementation(() => {
        throw new Error("hi");
      });
      const resultPromise = ResultPromise.err(value).orTee(orTeeFn);

      expect(resultPromise).toBeInstanceOf(ResultPromise);

      const result = await resultPromise;

      expect(result).toBeInstanceOf(Err);
      expect(result.error).toEqual(value);

      expect(orTeeFn).toBeCalledTimes(1);
    });
  });

  describe(".and", () => {
    it.each(values)(
      "ResultPromise.Err('%s').and() returns original Err unchanged",
      async (value) => {
        const andFn = vitest.fn();
        const resultPromise = ResultPromise.err(value).and(andFn);

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
      "ResultPromise.Err('%s').andMap() returns original Err unchanged",
      async (value) => {
        const andMapFn = vitest.fn();
        const resultPromise = ResultPromise.err(value).andMap(andMapFn);

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
      "ResultPromise.Err('%s').andTee() returns original Err unchanged",
      async (value) => {
        const andTeeFn = vitest.fn();
        const resultPromise = ResultPromise.err(value).andTee(andTeeFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);

        expect(andTeeFn).not.toBeCalled();
      },
    );
  });
});

describe("ResultPromise.from", () => {
  describe("instantiation", () => {
    it.each(values)("ResultPromise.from('%s') returns Ok with correct value", async (value) => {
      const result = ResultPromise.from(ok(value));

      expect(result).toBeInstanceOf(ResultPromise);

      const awaited = await result;

      expect(awaited).toBeInstanceOf(Ok);
      expect(awaited.value).toEqual(value);
    });

    it.each(values)("ResultPromise.from('%s') returns Err with correct value", async (value) => {
      const result = ResultPromise.from(err(value));

      expect(result).toBeInstanceOf(ResultPromise);

      const awaited = await result;

      expect(awaited).toBeInstanceOf(Err);
      expect(awaited.error).toEqual(value);
    });
  });

  describe(".or", () => {
    it.each(values)(
      "ResultPromise.from(ok('%s')).or() returns original Ok unchanged",
      async (value) => {
        const orFn = vitest.fn();
        const resultPromise = ResultPromise.from(ok(value)).or(orFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
        expect(orFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.from(err('%s')).or() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.from(err(value)).or((x) => err(x));
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.from(err('%s')).or() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.from(err(value)).or((x) => ok(x));
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
      },
    );
  });

  describe(".orMap", () => {
    it.each(values)(
      "ResultPromise.from(ok('%s')).orMap() returns original Ok unchanged",
      async (value) => {
        const orMapFn = vitest.fn();
        const resultPromise = ResultPromise.from(ok(value)).orMap(orMapFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);

        expect(orMapFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.from(err('%s')).orMap() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.from(err(value)).orMap((x) => x);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
      },
    );
  });

  describe(".orTee", () => {
    it.each(values)(
      "ResultPromise.from(ok('%s')).orTee() returns original Ok unchanged",
      async (value) => {
        const orTeeFn = vitest.fn();
        const resultPromise = ResultPromise.from(ok(value)).orTee(orTeeFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);

        expect(orTeeFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.from(err('%s')).orTee() applies function to value",
      async (value) => {
        const orTeeFn = vitest.fn().mockImplementation(() => {
          throw new Error("hi");
        });
        const resultPromise = ResultPromise.from(err(value)).orTee(orTeeFn);

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
      "ResultPromise.from(ok('%s')).and() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.from(ok(value)).and((x) => ok(x));
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.from(ok('%s')).and() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.from(ok(value)).and((x) => err(x));
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.from(err('%s')).and() returns original Err unchanged",
      async (value) => {
        const andFn = vitest.fn();
        const resultPromise = ResultPromise.from(err(value)).and(andFn);
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
      "ResultPromise.from(ok('%s')).andMap() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.from(ok(value)).andMap((x) => x);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);
      },
    );

    it.each(values)(
      "ResultPromise.from(err('%s')).andMap() returns original Err unchanged",
      async (value) => {
        const andMapFn = vitest.fn();
        const resultPromise = ResultPromise.from(err(value)).andMap(andMapFn);

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
      "ResultPromise.from(ok('%s')).andTee() applies function to value",
      async (value) => {
        const andTeeFn = vitest.fn().mockImplementation(() => {
          throw new Error("hi");
        });

        const resultPromise = ResultPromise.from(ok(value)).andTee(andTeeFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);
        expect(result.value).toEqual(value);

        expect(andTeeFn).toBeCalledTimes(1);
      },
    );

    it.each(values)(
      "ResultPromise.from(err('%s')).andTee() returns original Err unchanged",
      async (value) => {
        const andTeeFn = vitest.fn();
        const resultPromise = ResultPromise.from(err(value)).andTee(andTeeFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);
        expect(result.error).toEqual(value);

        expect(andTeeFn).not.toBeCalled();
      },
    );
  });
});
