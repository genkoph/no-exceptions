import { it, expect, describe } from "vitest";

import { ok, Ok, ResultPromise, err, Err, type Result } from "@/result";

describe("result", () => {
  describe("ok", () => {
    it("should create an Ok result with the provided value", () => {
      const result = ok("test");

      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      if (result.isOk()) {
        expect(result.value).toBe("test");
      }
    });

    it("should create an Ok result with number value", () => {
      const result = ok(42);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("should create an Ok result with object value", () => {
      const result = ok({ name: "test", count: 5 });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({ name: "test", count: 5 });
      }
    });

    it("should create an Ok result with null value", () => {
      const result = ok(null);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(null);
      }
    });

    it("should create an Ok result with undefined value", () => {
      const result = ok(undefined);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(undefined);
      }
    });

    it("should return true for isOk()", () => {
      const result = ok("test");
      expect(result.isOk()).toBe(true);
    });

    it("should return false for isErr()", () => {
      const result = ok("test");
      expect(result.isErr()).toBe(false);
    });

    it("should be an instance of Ok class", () => {
      const result = ok("test");
      expect(result).toBeInstanceOf(Ok);
      expect(result.isOk()).toBe(true);
    });

    it("should preserve primitive values exactly", () => {
      const stringResult = ok("hello");
      const numberResult = ok(123);
      const booleanResult = ok(true);

      if (stringResult.isOk()) expect(stringResult.value).toBe("hello");
      if (numberResult.isOk()) expect(numberResult.value).toBe(123);
      if (booleanResult.isOk()) expect(booleanResult.value).toBe(true);
    });

    it("should preserve reference for objects", () => {
      const obj = { id: 1, name: "test" };
      const result = ok(obj);

      if (result.isOk()) {
        expect(result.value).toBe(obj);
        expect(result.value.id).toBe(1);
        expect(result.value.name).toBe("test");
      }
    });

    it("should preserve array references", () => {
      const arr = [1, 2, 3];
      const result = ok(arr);

      if (result.isOk()) {
        expect(result.value).toBe(arr);
        expect(result.value).toEqual([1, 2, 3]);
      }
    });

    it("should handle empty string", () => {
      const result = ok("");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("");
      }
    });

    it("should handle zero", () => {
      const result = ok(0);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(0);
      }
    });

    it("should handle false boolean", () => {
      const result = ok(false);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(false);
      }
    });

    it("should handle empty object", () => {
      const result = ok({});
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({});
      }
    });

    it("should handle empty array", () => {
      const result = ok([]);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([]);
      }
    });

    it("should handle function values", () => {
      const fn = () => "test";
      const result = ok(fn);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(fn);
        expect(result.value()).toBe("test");
      }
    });
  });

  describe("err", () => {
    it("should create an Err result with the provided error", () => {
      const result = err("error");

      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("error");
      }
    });

    it("should create an Err result with number error", () => {
      const result = err(404);

      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(404);
      }
    });

    it("should create an Err result with object error", () => {
      const result = err({ code: 500, message: "Internal Server Error" });

      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toEqual({ code: 500, message: "Internal Server Error" });
      }
    });

    it("should create an Err result with null error", () => {
      const result = err(null);

      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(null);
      }
    });

    it("should create an Err result with undefined error", () => {
      const result = err(undefined);

      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(undefined);
      }
    });

    it("should return false for isOk()", () => {
      const result = err("test error");
      expect(result.isOk()).toBe(false);
    });

    it("should return true for isErr()", () => {
      const result = err("test error");
      expect(result.isErr()).toBe(true);
    });

    it("should be an instance of Err class", () => {
      const result = err("test error");
      expect(result).toBeInstanceOf(Err);
      expect(result.isErr()).toBe(true);
    });

    it("should preserve primitive error values exactly", () => {
      const stringResult = err("string error");
      const numberResult = err(500);
      const booleanResult = err(false);

      if (stringResult.isErr()) expect(stringResult.error).toBe("string error");
      if (numberResult.isErr()) expect(numberResult.error).toBe(500);
      if (booleanResult.isErr()) expect(booleanResult.error).toBe(false);
    });

    it("should preserve reference for error objects", () => {
      const errorObj = { id: 1, message: "test error" };
      const result = err(errorObj);

      if (result.isErr()) {
        expect(result.error).toBe(errorObj);
        expect(result.error.id).toBe(1);
        expect(result.error.message).toBe("test error");
      }
    });

    it("should preserve array references for error arrays", () => {
      const errorArr = ["error1", "error2", "error3"];
      const result = err(errorArr);

      if (result.isErr()) {
        expect(result.error).toBe(errorArr);
        expect(result.error).toEqual(["error1", "error2", "error3"]);
      }
    });

    it("should handle empty string errors", () => {
      const result = err("");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("");
      }
    });

    it("should handle zero errors", () => {
      const result = err(0);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(0);
      }
    });

    it("should handle false boolean errors", () => {
      const result = err(false);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(false);
      }
    });

    it("should handle empty object errors", () => {
      const result = err({});
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toEqual({});
      }
    });

    it("should handle empty array errors", () => {
      const result = err([]);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toEqual([]);
      }
    });

    it("should handle function errors", () => {
      const errorFn = () => "error message";
      const result = err(errorFn);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(errorFn);
        expect(result.error()).toBe("error message");
      }
    });

    it("should handle Error objects", () => {
      const error = new Error("Something went wrong");
      const result = err(error);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe(error);
        expect(result.error.message).toBe("Something went wrong");
        expect(result.error).toBeInstanceOf(Error);
      }
    });

    it("should maintain correct type information", () => {
      const result: Result<never, string> = err("error message");

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(typeof result.error).toBe("string");
        expect(result.error).toBe("error message");
      }
    });

    it("should allow generic type specification", () => {
      const result = err<number, string>("error");

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("error");
      }
    });

    it("should default to unknown type when no generic is specified", () => {
      const result = err("any error");

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("any error");
      }
    });
  });

  describe("async property", () => {
    describe("Ok async methods", () => {
      it("should map over Ok values with synchronous function", async () => {
        const result = ok("hello");
        const mappedPromise = result.async.andMap((value) => value.toUpperCase());

        const mappedResult = await mappedPromise;
        expect(mappedResult.isOk()).toBe(true);
        if (mappedResult.isOk()) {
          expect(mappedResult.value).toBe("HELLO");
        }
      });

      it("should map over Ok values with asynchronous function", async () => {
        const result = ok("hello");
        const mappedPromise = result.async.andMap(async (value) => value.toUpperCase());

        const mappedResult = await mappedPromise;
        expect(mappedResult.isOk()).toBe(true);
        if (mappedResult.isOk()) {
          expect(mappedResult.value).toBe("HELLO");
        }
      });

      it("should not map over Ok values with mapErr", async () => {
        const result = ok("hello");
        const mappedPromise = result.async.orMap((error) => error);

        const mappedResult = await mappedPromise;
        expect(mappedResult.isOk()).toBe(true);
        if (mappedResult.isOk()) {
          expect(mappedResult.value).toBe("hello");
        }
      });

      it("should not execute or function for Ok values", async () => {
        const result = ok("success");
        const orPromise = result.async.or(() => ok("fallback"));

        const orResult = await orPromise;
        expect(orResult.isOk()).toBe(true);
        if (orResult.isOk()) {
          expect(orResult.value).toBe("success");
        }
      });

      it("should execute and function for Ok values with synchronous result", async () => {
        const result = ok("success");
        const andPromise = result.async.and((value) => ok(`processed: ${value}`));

        const andResult = await andPromise;
        expect(andResult.isOk()).toBe(true);
        if (andResult.isOk()) {
          expect(andResult.value).toBe("processed: success");
        }
      });

      it("should execute and function for Ok values with asynchronous result", async () => {
        const result = ok("success");
        const andPromise = result.async.and(async (value) => ok(`async processed: ${value}`));

        const andResult = await andPromise;
        expect(andResult.isOk()).toBe(true);
        if (andResult.isOk()) {
          expect(andResult.value).toBe("async processed: success");
        }
      });

      it("should not execute orTee function for Ok values", async () => {
        const result = ok("success");
        let sideEffectExecuted = false;

        const orTeePromise = result.async.orTee(() => {
          sideEffectExecuted = true;
        });

        const orTeeResult = await orTeePromise;
        expect(sideEffectExecuted).toBe(false);
        expect(orTeeResult.isOk()).toBe(true);
        if (orTeeResult.isOk()) {
          expect(orTeeResult.value).toBe("success");
        }
      });

      it("should execute andTee function for Ok values", async () => {
        const result = ok("success");
        let sideEffectExecuted = false;

        const andTeePromise = result.async.andTee(() => {
          sideEffectExecuted = true;
        });

        const andTeeResult = await andTeePromise;
        expect(sideEffectExecuted).toBe(true);
        expect(andTeeResult.isOk()).toBe(true);
        if (andTeeResult.isOk()) {
          expect(andTeeResult.value).toBe("success");
        }
      });
    });

    describe("Err async methods", () => {
      it("should not map over Err values", async () => {
        const result = err("error");
        const mappedPromise = result.async.andMap((value) => value);

        const mappedResult = await mappedPromise;
        expect(mappedResult.isErr()).toBe(true);
        if (mappedResult.isErr()) {
          expect(mappedResult.error).toBe("error");
        }
      });

      it("should map over Err values with mapErr", async () => {
        const result = err("error");
        const mappedPromise = result.async.orMap((error) => error.toUpperCase());

        const mappedResult = await mappedPromise;
        expect(mappedResult.isErr()).toBe(true);
        if (mappedResult.isErr()) {
          expect(mappedResult.error).toBe("ERROR");
        }
      });

      it("should map over Err values with asynchronous mapErr", async () => {
        const result = err("error");
        const mappedPromise = result.async.orMap(async (error) => error.toUpperCase());

        const mappedResult = await mappedPromise;
        expect(mappedResult.isErr()).toBe(true);
        if (mappedResult.isErr()) {
          expect(mappedResult.error).toBe("ERROR");
        }
      });

      it("should execute or function for Err values with synchronous result", async () => {
        const result = err("error");
        const orPromise = result.async.or(() => ok("fallback"));

        const orResult = await orPromise;
        expect(orResult.isOk()).toBe(true);
        if (orResult.isOk()) {
          expect(orResult.value).toBe("fallback");
        }
      });

      it("should execute or function for Err values with asynchronous result", async () => {
        const result = err("error");
        const orPromise = result.async.or(async () => ok("async fallback"));

        const orResult = await orPromise;
        expect(orResult.isOk()).toBe(true);
        if (orResult.isOk()) {
          expect(orResult.value).toBe("async fallback");
        }
      });

      it("should not execute and function for Err values", async () => {
        const result = err("error");
        const andPromise = result.async.and((value) => ok(`processed: ${value}`));

        const andResult = await andPromise;
        expect(andResult.isErr()).toBe(true);
        if (andResult.isErr()) {
          expect(andResult.error).toBe("error");
        }
      });

      it("should execute orTee function for Err values", async () => {
        const result = err("error");
        let sideEffectExecuted = false;

        const orTeePromise = result.async.orTee(() => {
          sideEffectExecuted = true;
        });

        const orTeeResult = await orTeePromise;
        expect(sideEffectExecuted).toBe(true);
        expect(orTeeResult.isErr()).toBe(true);
        if (orTeeResult.isErr()) {
          expect(orTeeResult.error).toBe("error");
        }
      });

      it("should not execute andTee function for Err values", async () => {
        const result = err("error");
        let sideEffectExecuted = false;

        const andTeePromise = result.async.andTee(() => {
          sideEffectExecuted = true;
        });

        const andTeeResult = await andTeePromise;
        expect(sideEffectExecuted).toBe(false);
        expect(andTeeResult.isErr()).toBe(true);
        if (andTeeResult.isErr()) {
          expect(andTeeResult.error).toBe("error");
        }
      });
    });
  });

  describe("ResultPromise", () => {
    describe("static methods", () => {
      describe("ResultPromise.ok", () => {
        it("should create a ResultPromise with a resolved Ok value", async () => {
          const resultPromise = ResultPromise.ok("test");

          expect(resultPromise).toBeInstanceOf(ResultPromise);

          const result = await resultPromise;

          expect(result.isOk()).toBe(true);

          if (result.isOk()) {
            expect(result.value).toBe("test");
          }
        });

        it("should create a ResultPromise with a Promise value", async () => {
          const resultPromise = ResultPromise.ok(Promise.resolve("test"));

          const result = await resultPromise;

          expect(result.isOk()).toBe(true);

          if (result.isOk()) {
            expect(result.value).toBe("test");
          }
        });

        // it("should handle rejected promises", async () => {
        //   const rejectedPromise = Promise.reject(new Error("rejected"));
        //   const resultPromise = ResultPromise.ok(rejectedPromise);

        //   await expect(resultPromise).rejects.toThrow("rejected");
        // });
      });

      describe("ResultPromise.err", () => {
        it("should create a ResultPromise with a resolved Err value", async () => {
          const resultPromise = ResultPromise.err("error");

          expect(resultPromise).toBeInstanceOf(ResultPromise);

          const result = await resultPromise;
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("error");
          }
        });

        it("should create a ResultPromise with a Promise error", async () => {
          const resultPromise = ResultPromise.err(Promise.resolve("async error"));

          const result = await resultPromise;
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("async error");
          }
        });
      });

      describe("ResultPromise.from", () => {
        it("should create a ResultPromise from a resolved Ok Result", async () => {
          const okResult = ok("test");
          const resultPromise = ResultPromise.from(okResult);

          const result = await resultPromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("test");
          }
        });

        it("should create a ResultPromise from a resolved Err Result", async () => {
          const errResult = err("error");
          const resultPromise = ResultPromise.from(errResult);

          const result = await resultPromise;
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("error");
          }
        });
      });
    });

    describe("instance methods", () => {
      describe("map", () => {
        it("should map over Ok values with synchronous function", async () => {
          const resultPromise = ResultPromise.ok("hello");
          const mappedPromise = resultPromise.andMap((value) => value.toUpperCase());

          const result = await mappedPromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("HELLO");
          }
        });

        it("should map over Ok values with asynchronous function", async () => {
          const resultPromise = ResultPromise.ok("hello");
          const mappedPromise = resultPromise.andMap(async (value) => value.toUpperCase());

          const result = await mappedPromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("HELLO");
          }
        });

        it("should not map over Err values", async () => {
          const resultPromise = ResultPromise.err("error");
          const mappedPromise = resultPromise.andMap((value: string) => value.toUpperCase());

          const result = await mappedPromise;
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("error");
          }
        });

        it("should handle mapping function errors", async () => {
          const resultPromise = ResultPromise.ok("test");
          const mappedPromise = resultPromise.andMap(() => {
            throw new Error("mapping error");
          });

          await expect(mappedPromise).rejects.toThrow("mapping error");
        });
      });

      describe("mapErr", () => {
        it("should map over Err values with synchronous function", async () => {
          const resultPromise = ResultPromise.err("error");
          const mappedPromise = resultPromise.orMap((error) => error.toUpperCase());

          const result = await mappedPromise;
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("ERROR");
          }
        });

        it("should map over Err values with asynchronous function", async () => {
          const resultPromise = ResultPromise.err("error");
          const mappedPromise = resultPromise.orMap(async (error) => error.toUpperCase());

          const result = await mappedPromise;
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("ERROR");
          }
        });

        it("should not map over Ok values", async () => {
          const resultPromise = ResultPromise.ok("success");
          const mappedPromise = resultPromise.orMap((error: string) => error.toUpperCase());

          const result = await mappedPromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("success");
          }
        });
      });

      describe("or", () => {
        it("should not execute function for Ok values", async () => {
          const resultPromise = ResultPromise.ok("success");
          const orPromise = resultPromise.or(() => ok("fallback"));

          const result = await orPromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("success");
          }
        });

        it("should execute function for Err values with synchronous result", async () => {
          const resultPromise = ResultPromise.err("error");
          const orPromise = resultPromise.or(() => ok("fallback"));

          const result = await orPromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("fallback");
          }
        });

        it("should execute function for Err values with asynchronous result", async () => {
          const resultPromise = ResultPromise.err("error");
          const orPromise = resultPromise.or(async () => ok("async fallback"));

          const result = await orPromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("async fallback");
          }
        });
      });

      describe("and", () => {
        it("should execute function for Ok values with synchronous result", async () => {
          const resultPromise = ResultPromise.ok("success");
          const andPromise = resultPromise.and((value) => ok(`processed: ${value}`));

          const result = await andPromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("processed: success");
          }
        });

        it("should execute function for Ok values with asynchronous result", async () => {
          const resultPromise = ResultPromise.ok("success");
          const andPromise = resultPromise.and(async (value) => ok(`async processed: ${value}`));

          const result = await andPromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("async processed: success");
          }
        });

        it("should not execute function for Err values", async () => {
          const resultPromise = ResultPromise.err("error");
          const andPromise = resultPromise.and((value) => ok(`processed: ${value}`));

          const result = await andPromise;
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("error");
          }
        });
      });

      describe("orTee", () => {
        it("should execute side effect for Err values and return original error", async () => {
          const resultPromise = ResultPromise.err("error");
          let sideEffectExecuted = false;

          const orTeePromise = resultPromise.orTee(() => {
            sideEffectExecuted = true;
          });

          const result = await orTeePromise;
          expect(sideEffectExecuted).toBe(true);
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("error");
          }
        });

        it("should not execute side effect for Ok values", async () => {
          const resultPromise = ResultPromise.ok("success");
          let sideEffectExecuted = false;

          const orTeePromise = resultPromise.orTee(() => {
            sideEffectExecuted = true;
          });

          const result = await orTeePromise;
          expect(sideEffectExecuted).toBe(false);
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("success");
          }
        });

        it("should handle side effect errors gracefully", async () => {
          const resultPromise = ResultPromise.err("error");

          const orTeePromise = resultPromise.orTee(() => {
            throw new Error("side effect error");
          });

          const result = await orTeePromise;
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("error");
          }
        });
      });

      describe("andTee", () => {
        it("should execute side effect for Ok values and return original value", async () => {
          const resultPromise = ResultPromise.ok("success");
          let sideEffectExecuted = false;

          const andTeePromise = resultPromise.andTee(() => {
            sideEffectExecuted = true;
          });

          const result = await andTeePromise;
          expect(sideEffectExecuted).toBe(true);
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("success");
          }
        });

        it("should not execute side effect for Err values", async () => {
          const resultPromise = ResultPromise.err("error");
          let sideEffectExecuted = false;

          const andTeePromise = resultPromise.andTee(() => {
            sideEffectExecuted = true;
          });

          const result = await andTeePromise;
          expect(sideEffectExecuted).toBe(false);
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe("error");
          }
        });

        it("should handle side effect errors gracefully", async () => {
          const resultPromise = ResultPromise.ok("success");

          const andTeePromise = resultPromise.andTee(() => {
            throw new Error("side effect error");
          });

          const result = await andTeePromise;
          expect(result.isOk()).toBe(true);
          if (result.isOk()) {
            expect(result.value).toBe("success");
          }
        });
      });
    });

    describe("PromiseLike interface", () => {
      it("should work with then method", async () => {
        const resultPromise = ResultPromise.ok("test");

        const thenResult = await resultPromise.then((result) => {
          expect(result.isOk()).toBe(true);
          return result;
        });

        expect(thenResult.isOk()).toBe(true);
      });

      it("should work with then method error handling", async () => {
        const resultPromise = ResultPromise.ok("test");

        const thenResult = await resultPromise.then(
          (result) => result,
          (error: unknown) => {
            expect(error).toBeUndefined();
            return err("caught");
          },
        );

        expect(thenResult.isOk()).toBe(true);
      });

      it("should chain then calls", async () => {
        const resultPromise = ResultPromise.ok("test");
        let sideEffectExecuted = false;

        const chainedResult = await resultPromise
          .then((result) => {
            sideEffectExecuted = true;
            return result;
          })
          .then((result) => result);

        expect(sideEffectExecuted).toBe(true);
        expect(chainedResult.isOk()).toBe(true);
      });
    });

    describe("chaining", () => {
      it("should chain multiple operations", async () => {
        const resultPromise = ResultPromise.ok("hello");

        const chainedResult = await resultPromise
          .andMap((value) => value.toUpperCase())
          .and((value) => ok(`processed: ${value}`))
          .andTee((value) => {
            // Side effect
            expect(value).toBe("processed: HELLO");
          });

        expect(chainedResult.isOk()).toBe(true);
        if (chainedResult.isOk()) {
          expect(chainedResult.value).toBe("processed: HELLO");
        }
      });

      it("should handle errors in chain", async () => {
        const resultPromise = ResultPromise.err("initial error");

        const chainedResult = await resultPromise
          .andMap((value: string) => value.toUpperCase())
          .or(() => ok("fallback"))
          .orMap((error: string) => `mapped: ${error}`);

        expect(chainedResult.isOk()).toBe(true);
        if (chainedResult.isOk()) {
          expect(chainedResult.value).toBe("fallback");
        }
      });
    });
  });
});
