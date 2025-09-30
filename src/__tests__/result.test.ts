import { it, expect, vitest, describe } from "vitest";

import { ok, Ok, Err, err, ResultPromise } from "@/result";

import { values } from "./utils";

describe("Ok", () => {
  describe("instantiation", () => {
    it.each(values)("Ok('%s') returns correct value", (value) => {
      const result = ok(value);

      expect(result).toBeInstanceOf(Ok);
      expect(result.value).toEqual(value);

      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
    });
  });

  describe(".and", () => {
    it.each(values)("Ok('%s').and() applies function to value", (value) => {
      const result = ok(value).and((x) => ok(x));

      expect(result).toBeInstanceOf(Ok);

      if (result.isOk()) {
        expect(result.value).toEqual(value);
      }
    });

    it.each(values)("Ok('%s').and() applies function to value", (value) => {
      const result = ok(value).and((x) => err(x));

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toEqual(value);
      }
    });
  });

  describe(".map", () => {
    it.each(values)("Ok('%s').map() applies function to value", (value) => {
      const result = ok(value).map((x) => x);

      expect(result).toBeInstanceOf(Ok);

      if (result.isOk()) {
        expect(result.value).toEqual(value);
      }
    });
  });

  describe(".tap", () => {
    it.each(values)("Ok('%s').tap() applies function to value", (value) => {
      const tapFn = vitest.fn().mockImplementation(() => {
        throw new Error("hi");
      });

      const result = ok(value).tap(tapFn);

      expect(result).toBeInstanceOf(Ok);

      if (result.isOk()) {
        expect(result.value).toEqual(value);
      }

      expect(tapFn).toBeCalledTimes(1);
    });
  });

  describe(".andErr", () => {
    it.each(values)("Ok('%s').andErr() returns original Ok unchanged", (value) => {
      const orFn = vitest.fn();
      const result = ok(value).andErr(orFn);

      expect(result).toBeInstanceOf(Ok);
      expect(result.unwrap()).toEqual(value);

      expect(orFn).not.toBeCalled();
    });
  });

  describe(".mapErr", () => {
    it.each(values)("Ok('%s').mapErr() returns original Ok unchanged", (value) => {
      const orMapFn = vitest.fn();
      const result = ok(value).mapErr(orMapFn);

      expect(result).toBeInstanceOf(Ok);

      if (result.isOk()) {
        expect(result.value).toEqual(value);
      }

      expect(orMapFn).not.toBeCalled();
    });
  });

  describe(".tapErr", () => {
    it.each(values)("Ok('%s').tapErr() returns original Ok unchanged", (value) => {
      const tapErrFn = vitest.fn();
      const result = ok(value).tapErr(tapErrFn);

      expect(result).toBeInstanceOf(Ok);

      if (result.isOk()) {
        expect(result.value).toEqual(value);
      }

      expect(tapErrFn).not.toBeCalled();
    });
  });

  describe(".attempt", () => {
    it.each(values)("Ok('%s').attempt() applies function to value successfully", (value) => {
      const result = ok(value).attempt((x) => x);

      expect(result).toBeInstanceOf(Ok);

      if (result.isOk()) {
        expect(result.value).toEqual(value);
      }
    });

    it.each(values)("Ok('%s').attempt() catches thrown errors", (value) => {
      const result = ok(value).attempt((x) => {
        throw new Error(`Error processing ${String(x)}`);
      });

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBeInstanceOf(Error);
        expect((result.error.cause as Error).message).toBe(`Error processing ${String(value)}`);
      }
    });

    it.each(values)("Ok('%s').attempt() catches non-Error thrown values", (value) => {
      const result = ok(value).attempt(() => {
        throw "string error";
      });

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBe("string error");
      }
    });

    it.each(values)("Ok('%s').attempt() transforms value successfully", (value) => {
      const result = ok(value).attempt((x) => `transformed: ${String(x)}`);

      expect(result).toBeInstanceOf(Ok);

      if (result.isOk()) {
        expect(result.value).toBe(`transformed: ${String(value)}`);
      }
    });
  });

  describe(".unwrap", () => {
    it.each(values)("Ok('%s').unwrap() returns value", (value) => {
      const result = ok(value).unwrap();

      expect(result).toEqual(value);
    });

    it.each(values)("Ok('%s').unwrap(fallback) returns value", (value) => {
      const fallback = "fallback";
      const result = ok(value).unwrap(fallback);

      expect(result).toEqual(value);
    });
  });
});

describe("Err", () => {
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

  describe(".and", () => {
    it.each(values)("Err('%s').and() returns original Err unchanged", (value) => {
      const andFn = vitest.fn();
      const result = err(value).and(andFn);

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toEqual(value);
      }

      expect(andFn).not.toBeCalled();
    });
  });

  describe(".map", () => {
    it.each(values)("Err('%s').map() returns original Err unchanged", (value) => {
      const mapFn = vitest.fn();
      const result = err(value).map(mapFn);

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toEqual(value);
      }

      expect(mapFn).not.toBeCalled();
    });
  });

  describe(".tap", () => {
    it.each(values)("Err('%s').tap() returns original Err unchanged", (value) => {
      const tapFn = vitest.fn();
      const result = err(value).tap(tapFn);

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toEqual(value);
      }

      expect(tapFn).not.toBeCalled();
    });
  });

  describe(".andErr", () => {
    it.each(values)("Err('%s').andErr() applies function to value", (value) => {
      const result = err(value).andErr((x) => err(x));

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toEqual(value);
      }
    });

    it.each(values)("Err('%s').andErr() applies function to value", (value) => {
      const result = err(value).andErr((x) => ok(x));

      expect(result).toBeInstanceOf(Ok);

      if (result.isOk()) {
        expect(result.value).toEqual(value);
      }
    });
  });

  describe(".mapErr", () => {
    it.each(values)("Err('%s').mapErr() applies function to error", (value) => {
      const result = err(value).mapErr((x) => x);

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toEqual(value);
      }
    });
  });

  describe(".tapErr", () => {
    it.each(values)("Err('%s').tapErr() applies function to value", (value) => {
      const tapErrFn = vitest.fn().mockImplementation(() => {
        throw new Error("hi");
      });
      const result = err(value).tapErr(tapErrFn);

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toEqual(value);
      }

      expect(tapErrFn).toBeCalledTimes(1);
    });
  });

  describe(".attempt", () => {
    it.each(values)("Err('%s').attempt() returns original Err unchanged", (value) => {
      const attemptFn = vitest.fn();
      const result = err(value).attempt(attemptFn);

      expect(result).toBeInstanceOf(Err);

      if (result.isErr()) {
        expect(result.error).toEqual(value);
      }

      expect(attemptFn).not.toBeCalled();
    });
  });

  describe(".unwrap", () => {
    it.each(values)("Err('%s').unwrap() throws error", (value) => {
      expect(() => err(value).unwrap()).toThrow("Failed to unwrap Result");
    });

    it.each(values)("Err('%s').unwrap(fallback) returns fallback", (value) => {
      const result = err("error").unwrap(value);

      expect(result).toEqual(value);
    });
  });
});

describe("ResultPromise.create", () => {
  describe("instantiation", () => {
    it.each(values)(
      "ResultPromise.create('%s') returns Ok with correct value",
      async (value) => {
        const result = ResultPromise.create(Promise.resolve(ok(value)));

        expect(result).toBeInstanceOf(ResultPromise);

        const awaited = await result;

        expect(awaited).toBeInstanceOf(Ok);

        if (awaited.isOk()) {
          expect(awaited.value).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.create('%s') returns Err with correct value",
      async (value) => {
        const result = ResultPromise.create(Promise.resolve(err(value)));

        expect(result).toBeInstanceOf(ResultPromise);

        const awaited = await result;

        expect(awaited).toBeInstanceOf(Err);

        if (awaited.isErr()) {
          expect(awaited.error).toEqual(value);
        }
      },
    );
  });

  describe(".and", () => {
    it.each(values)(
      "ResultPromise.create(ok('%s')).and() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).and((x) =>
          ok(x),
        );
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.create(ok('%s')).and() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).and((x) =>
          err(x),
        );
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.create(err('%s')).and() returns original Err unchanged",
      async (value) => {
        const andFn = vitest.fn();
        const resultPromise = ResultPromise.create(Promise.resolve(err(value))).and(andFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }

        expect(andFn).not.toBeCalled();
      },
    );
  });

  describe(".map", () => {
    it.each(values)(
      "ResultPromise.create(ok('%s')).map() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).map((x) => x);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.create(err('%s')).map() returns original Err unchanged",
      async (value) => {
        const mapFn = vitest.fn();
        const resultPromise = ResultPromise.create(Promise.resolve(err(value))).map(mapFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }

        expect(mapFn).not.toBeCalled();
      },
    );
  });

  describe(".tap", () => {
    it.each(values)(
      "ResultPromise.create(ok('%s')).tap() applies function to value",
      async (value) => {
        const tapFn = vitest.fn().mockImplementation(() => {
          throw new Error("hi");
        });

        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).tap(tapFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }

        expect(tapFn).toBeCalledTimes(1);
      },
    );

    it.each(values)(
      "ResultPromise.create(err('%s')).tap() returns original Err unchanged",
      async (value) => {
        const tapFn = vitest.fn();
        const resultPromise = ResultPromise.create(Promise.resolve(err(value))).tap(tapFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }

        expect(tapFn).not.toBeCalled();
      },
    );
  });

  describe(".andErr", () => {
    it.each(values)(
      "ResultPromise.create(ok('%s')).andErr() returns original Ok unchanged",
      async (value) => {
        const orFn = vitest.fn();
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).andErr(orFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }

        expect(orFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.create(err('%s')).andErr() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(err(value))).andErr((x) =>
          err(x),
        );
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.create(err('%s')).andErr() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(err(value))).andErr((x) =>
          ok(x),
        );
        expect(resultPromise).toBeInstanceOf(ResultPromise);
        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      },
    );
  });

  describe(".mapErr", () => {
    it.each(values)(
      "ResultPromise.create(ok('%s')).mapErr() returns original Ok unchanged",
      async (value) => {
        const orMapFn = vitest.fn();
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).mapErr(orMapFn);

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }

        expect(orMapFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.create(err('%s')).mapErr() applies function to value",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(err(value))).mapErr(
          (x) => x,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }
      },
    );
  });

  describe(".tapErr", () => {
    it.each(values)(
      "ResultPromise.create(ok('%s')).tapErr() returns original Ok unchanged",
      async (value) => {
        const tapErrFn = vitest.fn();
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).tapErr(
          tapErrFn,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }

        expect(tapErrFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.create(err('%s')).tapErr() applies function to value",
      async (value) => {
        const tapErrFn = vitest.fn().mockImplementation(() => {
          throw new Error("hi");
        });
        const resultPromise = ResultPromise.create(Promise.resolve(err(value))).tapErr(
          tapErrFn,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }

        expect(tapErrFn).toBeCalledTimes(1);
      },
    );
  });

  describe(".attempt", () => {
    it.each(values)(
      "ResultPromise.create(ok('%s')).attempt() applies function to value successfully",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).attempt(
          (x) => x,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.create(ok('%s')).attempt() catches thrown errors",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).attempt((x) => {
          throw new Error(`Error processing ${String(x)}`);
        });

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(Error);
          expect(result.error.message).toBe("Unknown error occurred");
          expect(result.error.cause).toBeInstanceOf(Error);
          expect((result.error.cause as Error).message).toBe(`Error processing ${String(value)}`);
        }
      },
    );

    it.each(values)(
      "ResultPromise.create(ok('%s')).attempt() catches async thrown errors",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).attempt(
          async (x) => {
            throw new Error(`Async error processing ${String(x)}`);
          },
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(Error);
          expect(result.error.message).toBe("Unknown error occurred");
          expect(result.error.cause).toBeInstanceOf(Error);
          expect((result.error.cause as Error).message).toBe(
            `Async error processing ${String(value)}`,
          );
        }
      },
    );

    it.each(values)(
      "ResultPromise.create(ok('%s')).attempt() transforms value successfully",
      async (value) => {
        const resultPromise = ResultPromise.create(Promise.resolve(ok(value))).attempt(
          (x) => `transformed: ${String(x)}`,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toBe(`transformed: ${String(value)}`);
        }
      },
    );

    it.each(values)(
      "ResultPromise.create(err('%s')).attempt() returns original Err unchanged",
      async (value) => {
        const attemptFn = vitest.fn();
        const resultPromise = ResultPromise.create(Promise.resolve(err(value))).attempt(
          attemptFn,
        );

        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }

        expect(attemptFn).not.toBeCalled();
      },
    );
  });
});

describe("ResultPromise.createFunction", () => {
  describe("instantiation", () => {
    it.each(values)(
      "ResultPromise.createFunction returns function that returns Ok with correct value",
      async (value) => {
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return ok(x);
        });

        expect(typeof fn).toBe("function");

        const resultPromise = fn(value);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.createFunction returns function that returns Err with correct value",
      async (value) => {
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return err(x);
        });

        expect(typeof fn).toBe("function");

        const resultPromise = fn(value);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }
      },
    );
  });

  describe(".andErr", () => {
    it.each(values)(
      "ResultPromise.createFunction with .andErr() returns original Ok unchanged",
      async (value) => {
        const andErrFn = vitest.fn();
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return ok(x);
        });

        const resultPromise = fn(value).andErr(andErrFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }

        expect(andErrFn).not.toBeCalled();
      },
    );

    it.each(values)(
      "ResultPromise.createFunction with .andErr() applies function to error",
      async (value) => {
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return err(x);
        });

        const resultPromise = fn(value).andErr((error) => err(error));
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.createFunction with .andErr() transforms error to success",
      async (value) => {
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return err(x);
        });

        const resultPromise = fn(value).andErr((error) => ok(error));
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      },
    );
  });

  describe(".and", () => {
    it.each(values)(
      "ResultPromise.createFunction with .and() applies function to value",
      async (value) => {
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return ok(x);
        });

        const resultPromise = fn(value).and((val) => ok(val));
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.createFunction with .and() transforms success to error",
      async (value) => {
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return ok(x);
        });

        const resultPromise = fn(value).and((val) => err(val));
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }
      },
    );

    it.each(values)(
      "ResultPromise.createFunction with .and() returns original error unchanged",
      async (value) => {
        const andFn = vitest.fn();
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return err(x);
        });

        const resultPromise = fn(value).and(andFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }

        expect(andFn).not.toBeCalled();
      },
    );
  });

  describe(".attempt", () => {
    it.each(values)(
      "ResultPromise.createFunction with .attempt() applies function to value successfully",
      async (value) => {
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return ok(x);
        });

        const resultPromise = fn(value).attempt((val) => `transformed: ${String(val)}`);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toBe(`transformed: ${String(value)}`);
        }
      },
    );

    it.each(values)(
      "ResultPromise.createFunction with .attempt() catches thrown errors",
      async (value) => {
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return ok(x);
        });

        const resultPromise = fn(value).attempt((val) => {
          throw new Error(`Error processing ${String(val)}`);
        });
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(Error);
          expect(result.error.message).toBe("Unknown error occurred");
          expect(result.error.cause).toBeInstanceOf(Error);
          expect((result.error.cause as Error).message).toBe(`Error processing ${String(value)}`);
        }
      },
    );

    it.each(values)(
      "ResultPromise.createFunction with .attempt() catches async thrown errors",
      async (value) => {
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return ok(x);
        });

        const resultPromise = fn(value).attempt(async (val) => {
          throw new Error(`Async error processing ${String(val)}`);
        });
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(Error);
          expect(result.error.message).toBe("Unknown error occurred");
          expect(result.error.cause).toBeInstanceOf(Error);
          expect((result.error.cause as Error).message).toBe(
            `Async error processing ${String(value)}`,
          );
        }
      },
    );

    it.each(values)(
      "ResultPromise.createFunction with .attempt() returns original error unchanged",
      async (value) => {
        const attemptFn = vitest.fn();
        const fn = ResultPromise.createFunction(async (x: typeof value) => {
          return err(x);
        });

        const resultPromise = fn(value).attempt(attemptFn);
        expect(resultPromise).toBeInstanceOf(ResultPromise);

        const result = await resultPromise;
        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error).toEqual(value);
        }

        expect(attemptFn).not.toBeCalled();
      },
    );
  });
});
