import { describe, it, expectTypeOf } from "vitest";
import { ok, err, ResultPromise, type Result, type Ok, type Err } from "@/result";

describe("result types", () => {
  describe("ok function", () => {
    it("should infer correct types for basic values", () => {
      const stringResult = ok("hello");
      expectTypeOf(stringResult).toEqualTypeOf<Result<string, never>>();

      const numberResult = ok(42);
      expectTypeOf(numberResult).toEqualTypeOf<Result<number, never>>();

      const booleanResult = ok(true);
      expectTypeOf(booleanResult).toEqualTypeOf<Result<boolean, never>>();
    });

    it("should handle generic type specification", () => {
      const result = ok<string, Error>("test");
      expectTypeOf(result).toEqualTypeOf<Result<string, Error>>();
    });

    it("should handle complex object types", () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const user: User = { id: 1, name: "John", email: "john@example.com" };
      const result = ok(user);
      expectTypeOf(result).toEqualTypeOf<Result<User, never>>();
    });

    it("should handle null and undefined", () => {
      const nullResult = ok(null);
      expectTypeOf(nullResult).toEqualTypeOf<Result<null, never>>();

      const undefinedResult = ok(undefined);
      expectTypeOf(undefinedResult).toEqualTypeOf<Result<undefined, never>>();
    });

    it("should handle function types", () => {
      const fn = () => "test";
      const result = ok(fn);
      expectTypeOf(result).toEqualTypeOf<Result<() => string, never>>();
    });

    it("should handle array types", () => {
      const arrayResult = ok([1, 2, 3]);
      expectTypeOf(arrayResult).toEqualTypeOf<Result<number[], never>>();

      const stringArrayResult = ok(["a", "b", "c"]);
      expectTypeOf(stringArrayResult).toEqualTypeOf<Result<string[], never>>();
    });
  });

  describe("err function", () => {
    it("should infer correct types for basic error values", () => {
      const stringError = err("error");
      expectTypeOf(stringError).toEqualTypeOf<Result<never, string>>();

      const numberError = err(404);
      expectTypeOf(numberError).toEqualTypeOf<Result<never, number>>();

      const errorObject = err(new Error("test"));
      expectTypeOf(errorObject).toEqualTypeOf<Result<never, Error>>();
    });

    it("should handle generic type specification", () => {
      const result = err<string, number>(42);
      expectTypeOf(result).toEqualTypeOf<Result<string, number>>();
    });

    it("should handle complex error types", () => {
      interface ApiError {
        code: number;
        message: string;
        details?: unknown;
      }

      const apiError: ApiError = { code: 500, message: "Internal Server Error" };
      const result = err(apiError);
      expectTypeOf(result).toEqualTypeOf<Result<never, ApiError>>();
    });

    it("should handle null and undefined errors", () => {
      const nullError = err(null);
      expectTypeOf(nullError).toEqualTypeOf<Result<never, null>>();

      const undefinedError = err(undefined);
      expectTypeOf(undefinedError).toEqualTypeOf<Result<never, undefined>>();
    });
  });

  describe("Result type", () => {
    it("should correctly represent union of Ok and Err", () => {
      type TestResult = Result<string, number>;
      expectTypeOf<TestResult>().toEqualTypeOf<Ok<string, number> | Err<string, number>>();
    });

    it("should handle never types", () => {
      type NeverResult = Result<never, string>;
      expectTypeOf<NeverResult>().toEqualTypeOf<Ok<never, string> | Err<never, string>>();
    });
  });

  describe("ResultPromise static methods", () => {
    it("should infer correct types for ResultPromise.ok", async () => {
      const stringPromise = ResultPromise.ok("test");
      expectTypeOf(stringPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const asyncPromise = ResultPromise.ok(Promise.resolve("async"));
      expectTypeOf(asyncPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const numberPromise = ResultPromise.ok<number, string>(42);
      expectTypeOf(numberPromise).toEqualTypeOf<ResultPromise<number, string>>();
    });

    it("should infer correct types for ResultPromise.err", async () => {
      const stringErrorPromise = ResultPromise.err("error");
      expectTypeOf(stringErrorPromise).toEqualTypeOf<ResultPromise<never, string>>();

      const asyncErrorPromise = ResultPromise.err(Promise.resolve("async error"));
      expectTypeOf(asyncErrorPromise).toEqualTypeOf<ResultPromise<never, string>>();

      const typedErrorPromise = ResultPromise.err<string, number>(404);
      expectTypeOf(typedErrorPromise).toEqualTypeOf<ResultPromise<string, number>>();
    });

    it("should infer correct types for ResultPromise.from", async () => {
      const okResult = ok("test");
      const fromOkPromise = ResultPromise.from(okResult);
      expectTypeOf(fromOkPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const errResult = err("error");
      const fromErrPromise = ResultPromise.from(errResult);
      expectTypeOf(fromErrPromise).toEqualTypeOf<ResultPromise<never, string>>();

      const asyncResultPromise = ResultPromise.from(Promise.resolve(ok("async")));
      expectTypeOf(asyncResultPromise).toEqualTypeOf<ResultPromise<string, never>>();
    });
  });

  describe("ResultPromise instance methods", () => {
    it("should preserve types through map operations", async () => {
      const resultPromise = ResultPromise.ok("hello");

      const mappedPromise = resultPromise.andMap((value) => value.toUpperCase());
      expectTypeOf(mappedPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const asyncMappedPromise = resultPromise.andMap(async (value) => value.toUpperCase());
      expectTypeOf(asyncMappedPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const typeChangedPromise = resultPromise.andMap((value) => value.length);
      expectTypeOf(typeChangedPromise).toEqualTypeOf<ResultPromise<number, never>>();
    });

    it("should preserve types through mapErr operations", async () => {
      const resultPromise = ResultPromise.err("error");

      const mappedErrPromise = resultPromise.orMap((error) => error.toUpperCase());
      expectTypeOf(mappedErrPromise).toEqualTypeOf<ResultPromise<never, string>>();

      const asyncMappedErrPromise = resultPromise.orMap(async (error) => error.toUpperCase());
      expectTypeOf(asyncMappedErrPromise).toEqualTypeOf<ResultPromise<never, string>>();

      const typeChangedErrPromise = resultPromise.orMap((error) => error.length);
      expectTypeOf(typeChangedErrPromise).toEqualTypeOf<ResultPromise<never, number>>();
    });

    it("should handle or operations with type unions", async () => {
      const resultPromise = ResultPromise.err("error");

      const orPromise = resultPromise.or(() => ok("fallback"));
      expectTypeOf(orPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const asyncOrPromise = resultPromise.or(async () => ok("async fallback"));
      expectTypeOf(asyncOrPromise).toEqualTypeOf<ResultPromise<string, never>>();
    });

    it("should handle and operations with type intersections", async () => {
      const resultPromise = ResultPromise.ok("success");

      const andPromise = resultPromise.and((value) => ok(`processed: ${value}`));
      expectTypeOf(andPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const asyncAndPromise = resultPromise.and(async (value) => ok(`async processed: ${value}`));
      expectTypeOf(asyncAndPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const typeChangedAndPromise = resultPromise.and((value) => ok(value.length));
      expectTypeOf(typeChangedAndPromise).toEqualTypeOf<ResultPromise<number, never>>();
    });
  });

  describe("async property types", () => {
    it("should have correct types for Ok async methods", async () => {
      const okResult = ok("hello");

      // Test async.map
      const mappedPromise = okResult.async.andMap((value) => value.toUpperCase());
      expectTypeOf(mappedPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const asyncMappedPromise = okResult.async.andMap(async (value) => value.toUpperCase());
      expectTypeOf(asyncMappedPromise).toEqualTypeOf<ResultPromise<string, never>>();

      // Test async.mapErr (should not change the value)
      const mapErrPromise = okResult.async.orMap((error) => error);
      expectTypeOf(mapErrPromise).toEqualTypeOf<ResultPromise<string, never>>();

      // Test async.or (should not execute)
      const orPromise = okResult.async.or(() => ok("fallback"));
      expectTypeOf(orPromise).toEqualTypeOf<ResultPromise<string, never>>();

      // Test async.and
      const andPromise = okResult.async.and((value) => ok(`processed: ${value}`));
      expectTypeOf(andPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const asyncAndPromise = okResult.async.and(async (value) => ok(`async processed: ${value}`));
      expectTypeOf(asyncAndPromise).toEqualTypeOf<ResultPromise<string, never>>();

      // Test async.orTee (should not execute)
      const orTeePromise = okResult.async.orTee(() => {});
      expectTypeOf(orTeePromise).toEqualTypeOf<ResultPromise<string, never>>();

      // Test async.andTee
      const andTeePromise = okResult.async.andTee(() => {});
      expectTypeOf(andTeePromise).toEqualTypeOf<ResultPromise<string, never>>();
    });

    it("should have correct types for Err async methods", async () => {
      const errResult = err("error");

      // Test async.map (should not execute)
      const mappedPromise = errResult.async.andMap((value) => value);
      expectTypeOf(mappedPromise).toEqualTypeOf<ResultPromise<never, string>>();

      // Test async.mapErr
      const mapErrPromise = errResult.async.orMap((error) => error.toUpperCase());
      expectTypeOf(mapErrPromise).toEqualTypeOf<ResultPromise<never, string>>();

      const asyncMapErrPromise = errResult.async.orMap(async (error) => error.toUpperCase());
      expectTypeOf(asyncMapErrPromise).toEqualTypeOf<ResultPromise<never, string>>();

      // Test async.or
      const orPromise = errResult.async.or(() => ok("fallback"));
      expectTypeOf(orPromise).toEqualTypeOf<ResultPromise<string, never>>();

      const asyncOrPromise = errResult.async.or(async () => ok("async fallback"));
      expectTypeOf(asyncOrPromise).toEqualTypeOf<ResultPromise<string, never>>();

      // Test async.and (should not execute)
      const andPromise = errResult.async.and((value) => ok(`processed: ${value}`));
      expectTypeOf(andPromise).toEqualTypeOf<ResultPromise<string, string>>();

      // Test async.orTee
      const orTeePromise = errResult.async.orTee(() => {});
      expectTypeOf(orTeePromise).toEqualTypeOf<ResultPromise<never, string>>();

      // Test async.andTee (should not execute)
      const andTeePromise = errResult.async.andTee(() => {});
      expectTypeOf(andTeePromise).toEqualTypeOf<ResultPromise<never, string>>();
    });

    it("should handle type transformations correctly", async () => {
      const okResult = ok("hello");

      // Test type change in map
      const typeChangedPromise = okResult.async.andMap((value) => value.length);
      expectTypeOf(typeChangedPromise).toEqualTypeOf<ResultPromise<number, never>>();

      // Test type change in and
      const typeChangedAndPromise = okResult.async.and((value) => ok(value.length));
      expectTypeOf(typeChangedAndPromise).toEqualTypeOf<ResultPromise<number, never>>();

      // Test error type change in mapErr
      const errResult = err("error");
      const errorTypeChangedPromise = errResult.async.orMap((error) => error.length);
      expectTypeOf(errorTypeChangedPromise).toEqualTypeOf<ResultPromise<never, number>>();
    });
  });

  describe("type guards", () => {
    it("should narrow types correctly with isOk", () => {
      const result: Result<string, number> = ok("test");

      if (result.isOk()) {
        expectTypeOf(result.value).toEqualTypeOf<string>();
      }
    });

    it("should narrow types correctly with isErr", () => {
      const result: Result<string, number> = err(404);

      if (result.isErr()) {
        expectTypeOf(result.error).toEqualTypeOf<number>();
      }
    });

    it("should work with complex types", () => {
      interface User {
        id: number;
        name: string;
      }

      interface UserError {
        code: string;
        message: string;
      }

      const result: Result<User, UserError> = ok({ id: 1, name: "John" });

      if (result.isOk()) {
        expectTypeOf(result.value).toEqualTypeOf<User>();
        expectTypeOf(result.value.id).toEqualTypeOf<number>();
        expectTypeOf(result.value.name).toEqualTypeOf<string>();
      }

      if (result.isErr()) {
        expectTypeOf(result.error).toEqualTypeOf<UserError>();
        expectTypeOf(result.error.code).toEqualTypeOf<string>();
        expectTypeOf(result.error.message).toEqualTypeOf<string>();
      }
    });
  });

  describe("PromiseLike interface", () => {
    it("should implement PromiseLike correctly", async () => {
      const resultPromise = ResultPromise.ok("test");

      expectTypeOf(resultPromise.then).toBeFunction();

      const thenResult = await resultPromise.then((result) => {
        expectTypeOf(result).toEqualTypeOf<Result<string, never>>();
        return result;
      });

      expectTypeOf(thenResult).toEqualTypeOf<Result<string, never>>();
    });
  });

  describe("complex type scenarios", () => {
    it("should handle nested Result types", () => {
      const nestedResult = ok(ok("nested"));
      expectTypeOf(nestedResult).toEqualTypeOf<Result<Result<string, never>, never>>();

      if (nestedResult.isOk() && nestedResult.value.isOk()) {
        expectTypeOf(nestedResult.value.value).toEqualTypeOf<string>();
      }
    });

    it("should handle Result with Promise types", () => {
      const promiseResult = ok(Promise.resolve("async"));
      expectTypeOf(promiseResult).toEqualTypeOf<Result<Promise<string>, never>>();

      if (promiseResult.isOk()) {
        expectTypeOf(promiseResult.value).toEqualTypeOf<Promise<string>>();
      }
    });

    it("should handle generic constraints", () => {
      interface ApiResponse<T> {
        data: T;
        status: number;
      }

      const apiResult = ok<ApiResponse<string>, Error>({ data: "test", status: 200 });
      expectTypeOf(apiResult).toEqualTypeOf<Result<ApiResponse<string>, Error>>();

      if (apiResult.isOk()) {
        expectTypeOf(apiResult.value.data).toEqualTypeOf<string>();
        expectTypeOf(apiResult.value.status).toEqualTypeOf<number>();
      }
    });
  });
});
