import { describe, it, expect } from "vitest";

import { ensure } from "@/ensure";

describe("ensure", () => {
  describe("synchronous values", () => {
    it("should return Ok for non-null string values", () => {
      const result = ensure("hello");

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("hello");
      }
    });

    it("should return Ok for non-null number values", () => {
      const result = ensure(42);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("should return Ok for boolean true", () => {
      const result = ensure(true);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(true);
      }
    });

    it("should return Ok for boolean false", () => {
      const result = ensure(false);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(false);
      }
    });

    it("should return Ok for zero", () => {
      const result = ensure(0);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(0);
      }
    });

    it("should return Ok for empty string", () => {
      const result = ensure("");

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("");
      }
    });

    it("should return Ok for objects", () => {
      const obj = { id: 1, name: "test" };
      const result = ensure(obj);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(obj);
        expect(result.value.id).toBe(1);
        expect(result.value.name).toBe("test");
      }
    });

    it("should return Ok for arrays", () => {
      const arr = [1, 2, 3];
      const result = ensure(arr);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(arr);
        expect(result.value).toEqual([1, 2, 3]);
      }
    });

    it("should return Ok for symbols", () => {
      const sym = Symbol("test");
      const result = ensure(sym);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(sym);
      }
    });

    it("should return Ok for bigint values", () => {
      const big = BigInt(123);
      const result = ensure(big);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(big);
      }
    });

    it("should return Err for null values", () => {
      const result = ensure(null);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Value is null or undefined");
      }
    });

    it("should return Err for undefined values", () => {
      const result = ensure(undefined);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Value is null or undefined");
      }
    });
  });

  describe("asynchronous values (Promises)", () => {
    it("should return ResultPromise for resolved non-null values", async () => {
      const promise = Promise.resolve("async success");
      const resultPromise = ensure(promise);

      expect(resultPromise).toBeDefined();

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("async success");
      }
    });

    it("should return ResultPromise for resolved number values", async () => {
      const promise = Promise.resolve(100);
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(100);
      }
    });

    it("should return ResultPromise for resolved boolean values", async () => {
      const truePromise = Promise.resolve(true);
      const falsePromise = Promise.resolve(false);

      const trueResult = await ensure(truePromise);
      const falseResult = await ensure(falsePromise);

      expect(trueResult.isOk()).toBe(true);
      expect(falseResult.isOk()).toBe(true);

      if (trueResult.isOk()) expect(trueResult.value).toBe(true);
      if (falseResult.isOk()) expect(falseResult.value).toBe(false);
    });

    it("should return ResultPromise for resolved zero values", async () => {
      const promise = Promise.resolve(0);
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(0);
      }
    });

    it("should return ResultPromise for resolved empty string", async () => {
      const promise = Promise.resolve("");
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("");
      }
    });

    it("should return ResultPromise for resolved objects", async () => {
      const obj = { type: "async", data: [1, 2, 3] };
      const promise = Promise.resolve(obj);
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(obj);
        expect(result.value.type).toBe("async");
        expect(result.value.data).toEqual([1, 2, 3]);
      }
    });

    it("should return ResultPromise for resolved arrays", async () => {
      const arr = ["a", "b", "c"];
      const promise = Promise.resolve(arr);
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(arr);
        expect(result.value).toEqual(["a", "b", "c"]);
      }
    });

    it("should return ResultPromise for resolved symbols", async () => {
      const sym = Symbol("async");
      const promise = Promise.resolve(sym);
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(sym);
      }
    });

    it("should return ResultPromise for resolved bigint values", async () => {
      const big = BigInt(456);
      const promise = Promise.resolve(big);
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(big);
      }
    });

    it("should return ResultPromise with Err for resolved null", async () => {
      const promise = Promise.resolve(null);
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Value is null or undefined");
      }
    });

    it("should return ResultPromise with Err for resolved undefined", async () => {
      const promise = Promise.resolve(undefined);
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Value is null or undefined");
      }
    });

    it("should return ResultPromise with Err for rejected promises", async () => {
      const promise = Promise.reject(new Error("Promise rejected"));
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Promise rejected");
      }
    });

    it("should return ResultPromise with Err for rejected promises with non-Error values", async () => {
      const promise = Promise.reject("string error");
      const resultPromise = ensure(promise);

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe("Promise rejected");
      }
    });
  });

  describe("type inference and edge cases", () => {
    it("should correctly infer return types for string values", () => {
      const result = ensure("test");

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(typeof result.value).toBe("string");
      }
    });

    it("should correctly infer return types for number values", () => {
      const result = ensure(42);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(typeof result.value).toBe("number");
      }
    });

    it("should correctly infer return types for boolean values", () => {
      const trueResult = ensure(true);
      const falseResult = ensure(false);

      expect(trueResult.isOk()).toBe(true);
      expect(falseResult.isOk()).toBe(true);

      if (trueResult.isOk()) expect(typeof trueResult.value).toBe("boolean");
      if (falseResult.isOk()) expect(typeof falseResult.value).toBe("boolean");
    });

    it("should correctly infer return types for object values", () => {
      const obj = { id: 1 };
      const result = ensure(obj);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(typeof result.value).toBe("object");
        expect(result.value.id).toBe(1);
      }
    });

    it("should correctly infer return types for async values", async () => {
      const stringPromise = ensure(Promise.resolve("async string"));
      const numberPromise = ensure(Promise.resolve(100));
      const objectPromise = ensure(Promise.resolve({ async: true }));

      const stringResult = await stringPromise;
      const numberResult = await numberPromise;
      const objectResult = await objectPromise;

      expect(stringResult.isOk()).toBe(true);
      expect(numberResult.isOk()).toBe(true);
      expect(objectResult.isOk()).toBe(true);

      if (stringResult.isOk()) expect(typeof stringResult.value).toBe("string");
      if (numberResult.isOk()) expect(typeof numberResult.value).toBe("number");
      if (objectResult.isOk()) expect(typeof objectResult.value).toBe("object");
    });

    it("should handle complex nested objects", async () => {
      const complexObj = {
        id: 1,
        data: {
          nested: {
            value: "deep",
            array: [1, 2, 3],
            func: () => "function value",
          },
        },
      };

      const syncResult = ensure(complexObj);
      const asyncResult = await ensure(Promise.resolve(complexObj));

      expect(syncResult.isOk()).toBe(true);
      expect(asyncResult.isOk()).toBe(true);

      if (syncResult.isOk()) {
        expect(syncResult.value.id).toBe(1);
        expect(syncResult.value.data.nested.value).toBe("deep");
        expect(syncResult.value.data.nested.array).toEqual([1, 2, 3]);
        expect(typeof syncResult.value.data.nested.func).toBe("function");
      }

      if (asyncResult.isOk()) {
        expect(asyncResult.value.id).toBe(1);
        expect(asyncResult.value.data.nested.value).toBe("deep");
        expect(asyncResult.value.data.nested.array).toEqual([1, 2, 3]);
        expect(typeof asyncResult.value.data.nested.func).toBe("function");
      }
    });

    it("should handle edge cases with falsy but non-null values", () => {
      const testCases = [
        { value: 0, expected: true, description: "zero" },
        { value: "", expected: true, description: "empty string" },
        { value: false, expected: true, description: "false boolean" },
        { value: NaN, expected: true, description: "NaN" },
      ];

      testCases.forEach(({ value, expected }) => {
        const result = ensure(value);
        expect(result.isOk()).toBe(expected);
        if (result.isOk()) {
          expect(result.value).toBe(value);
        }
      });
    });

    it("should handle edge cases with async falsy but non-null values", async () => {
      const testCases = [
        { value: Promise.resolve(0), expected: true, description: "zero" },
        { value: Promise.resolve(""), expected: true, description: "empty string" },
        { value: Promise.resolve(false), expected: true, description: "false boolean" },
        { value: Promise.resolve(NaN), expected: true, description: "NaN" },
      ];

      for (const { value, expected } of testCases) {
        const result = await ensure(value);
        expect(result.isOk()).toBe(expected);
        if (result.isOk()) {
          expect(result.value).toBe(await value);
        }
      }
    });
  });
});
