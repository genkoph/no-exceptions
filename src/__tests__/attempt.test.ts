import { describe, it, expect } from "vitest";

import { attempt, type Executor, type SyncThunk, type AsyncThunk } from "@/attempt";

describe("attempt", () => {
  describe("synchronous thunks", () => {
    it("should return Ok result for successful synchronous thunk", () => {
      const syncThunk: SyncThunk<string> = () => "success";
      const result = attempt(syncThunk);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("success");
      }
    });

    it("should return Err result for failing synchronous thunk", () => {
      const syncThunk: SyncThunk<never> = () => {
        throw new Error("sync error");
      };
      const result = attempt(syncThunk);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBeInstanceOf(Error);
        expect((result.error.cause as Error).message).toBe("sync error");
      }
    });

    it("should handle synchronous thunk returning different types", () => {
      const stringThunk: SyncThunk<string> = () => "hello";
      const numberThunk: SyncThunk<number> = () => 42;
      const objectThunk: SyncThunk<{ id: number }> = () => ({ id: 1 });

      const stringResult = attempt(stringThunk);
      const numberResult = attempt(numberThunk);
      const objectResult = attempt(objectThunk);

      expect(stringResult.isOk()).toBe(true);
      expect(numberResult.isOk()).toBe(true);
      expect(objectResult.isOk()).toBe(true);

      if (stringResult.isOk()) expect(stringResult.value).toBe("hello");
      if (numberResult.isOk()) expect(numberResult.value).toBe(42);
      if (objectResult.isOk()) expect(objectResult.value).toEqual({ id: 1 });
    });

    it("should wrap thrown errors in Error objects", () => {
      const syncThunk: SyncThunk<never> = () => {
        throw "string error";
      };
      const result = attempt(syncThunk);

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBe("string error");
      }
    });
  });

  describe("asynchronous thunks", () => {
    it("should return ResultPromise for successful async thunk", async () => {
      const asyncThunk: AsyncThunk<string> = async () => "async success";
      const resultPromise = attempt(asyncThunk);

      expect(resultPromise).toBeDefined();

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("async success");
      }
    });

    it("should return ResultPromise for failing async thunk", async () => {
      const resultPromise = attempt(async () => {
        throw new Error("async error");
      });

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBeInstanceOf(Error);
        expect((result.error.cause as Error).message).toBe("async error");
      }
    });

    it("should handle async thunk returning different types", async () => {
      const stringThunk: AsyncThunk<string> = async () => "async hello";
      const numberThunk: AsyncThunk<number> = async () => 100;
      const objectThunk: AsyncThunk<{ name: string }> = async () => ({ name: "test" });

      const stringResult = await attempt(stringThunk);
      const numberResult = await attempt(numberThunk);
      const objectResult = await attempt(objectThunk);

      expect(stringResult.isOk()).toBe(true);
      expect(numberResult.isOk()).toBe(true);
      expect(objectResult.isOk()).toBe(true);

      if (stringResult.isOk()) expect(stringResult.value).toBe("async hello");
      if (numberResult.isOk()) expect(numberResult.value).toBe(100);
      if (objectResult.isOk()) expect(objectResult.value).toEqual({ name: "test" });
    });

    it("should wrap thrown errors in Error objects for async thunks", async () => {
      const asyncThunk: AsyncThunk<never> = async () => {
        throw "async string error";
      };
      const resultPromise = attempt(asyncThunk);

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBe("async string error");
      }
    });
  });

  describe("promises", () => {
    it("should return ResultPromise for resolved promise", async () => {
      const promise = Promise.resolve("promise success");
      const resultPromise = attempt(promise);

      expect(resultPromise).toBeDefined();

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("promise success");
      }
    });

    it("should return ResultPromise for rejected promise", async () => {
      const promise = Promise.reject(new Error("promise error"));
      const resultPromise = attempt(promise);

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBeInstanceOf(Error);
        expect((result.error.cause as Error).message).toBe("promise error");
      }
    });

    it("should handle promise with different value types", async () => {
      const stringPromise = Promise.resolve("promise string");
      const numberPromise = Promise.resolve(200);
      const objectPromise = Promise.resolve({ type: "promise" });

      const stringResult = await attempt(stringPromise);
      const numberResult = await attempt(numberPromise);
      const objectResult = await attempt(objectPromise);

      expect(stringResult.isOk()).toBe(true);
      expect(numberResult.isOk()).toBe(true);
      expect(objectResult.isOk()).toBe(true);

      if (stringResult.isOk()) expect(stringResult.value).toBe("promise string");
      if (numberResult.isOk()) expect(numberResult.value).toBe(200);
      if (objectResult.isOk()) expect(objectResult.value).toEqual({ type: "promise" });
    });

    it("should wrap rejected promise errors in Error objects", async () => {
      const promise = Promise.reject("promise string error");
      const resultPromise = attempt(promise);

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBe("promise string error");
      }
    });
  });

  describe("executor functions", () => {
    it("should return ResultPromise for successful executor", async () => {
      const executor: Executor<string> = (resolve) => {
        resolve("executor success");
      };
      const resultPromise = attempt(executor);

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("executor success");
      }
    });

    it("should return ResultPromise for failing executor", async () => {
      const executor: Executor<never> = (resolve, reject) => {
        reject(new Error("executor error"));
      };
      const resultPromise = attempt(executor);

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBeInstanceOf(Error);
        expect((result.error.cause as Error).message).toBe("executor error");
      }
    });

    it("should handle executor with different value types", async () => {
      const stringExecutor: Executor<string> = (resolve) => resolve("executor string");
      const numberExecutor: Executor<number> = (resolve) => resolve(300);
      const objectExecutor: Executor<{ source: string }> = (resolve) =>
        resolve({ source: "executor" });

      const stringResult = await attempt(stringExecutor);
      const numberResult = await attempt(numberExecutor);
      const objectResult = await attempt(objectExecutor);

      expect(stringResult.isOk()).toBe(true);
      expect(numberResult.isOk()).toBe(true);
      expect(objectResult.isOk()).toBe(true);

      if (stringResult.isOk()) expect(stringResult.value).toBe("executor string");
      if (numberResult.isOk()) expect(numberResult.value).toBe(300);
      if (objectResult.isOk()) expect(objectResult.value).toEqual({ source: "executor" });
    });

    it("should wrap rejected executor errors in Error objects", async () => {
      const executor: Executor<never> = (resolve, reject) => {
        reject("executor string error");
      };
      const resultPromise = attempt(executor);

      const result = await resultPromise;
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Unknown error occurred");
        expect(result.error.cause).toBe("executor string error");
      }
    });
  });

  describe("type inference and edge cases", () => {
    it("should correctly infer return types for sync thunks", () => {
      const stringThunk = () => "inferred string";
      const numberThunk = () => 42;
      const booleanThunk = () => true;

      const stringResult = attempt(stringThunk);
      const numberResult = attempt(numberThunk);
      const booleanResult = attempt(booleanThunk);

      expect(stringResult.isOk()).toBe(true);
      expect(numberResult.isOk()).toBe(true);
      expect(booleanResult.isOk()).toBe(true);

      if (stringResult.isOk()) expect(typeof stringResult.value).toBe("string");
      if (numberResult.isOk()) expect(typeof numberResult.value).toBe("number");
      if (booleanResult.isOk()) expect(typeof booleanResult.value).toBe("boolean");
    });

    it("should correctly infer return types for async thunks", async () => {
      const stringThunk = async () => "async inferred string";
      const numberThunk = async () => 100;
      const booleanThunk = async () => false;

      const stringResult = await attempt(stringThunk);
      const numberResult = await attempt(numberThunk);
      const booleanResult = await attempt(booleanThunk);

      expect(stringResult.isOk()).toBe(true);
      expect(numberResult.isOk()).toBe(true);
      expect(booleanResult.isOk()).toBe(true);

      if (stringResult.isOk()) expect(typeof stringResult.value).toBe("string");
      if (numberResult.isOk()) expect(typeof numberResult.value).toBe("number");
      if (booleanResult.isOk()) expect(typeof booleanResult.value).toBe("boolean");
    });

    it("should handle functions with parameters as executors", async () => {
      const executorWithParams = (
        resolve: (value: string) => void,
      ) => {
        resolve("executor with params");
      };

      // This should be treated as an executor function, not a sync thunk
      const resultPromise = attempt(executorWithParams);

      const result = await resultPromise;
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("executor with params");
      }
    });

    it("should handle complex nested objects", async () => {
      const complexThunk = async () => ({
        id: 1,
        data: {
          nested: {
            value: "deep",
            array: [1, 2, 3],
            func: () => "function value",
          },
        },
      });

      const result = await attempt(complexThunk);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.id).toBe(1);
        expect(result.value.data.nested.value).toBe("deep");
        expect(result.value.data.nested.array).toEqual([1, 2, 3]);
        expect(typeof result.value.data.nested.func).toBe("function");
      }
    });

    it("should handle null and undefined values", async () => {
      const nullThunk = async () => null;
      const undefinedThunk = async () => undefined;

      const nullResult = await attempt(nullThunk);
      const undefinedResult = await attempt(undefinedThunk);

      expect(nullResult.isOk()).toBe(true);
      expect(undefinedResult.isOk()).toBe(true);

      if (nullResult.isOk()) expect(nullResult.value).toBe(null);
      if (undefinedResult.isOk()) expect(undefinedResult.value).toBe(undefined);
    });
  });
});
