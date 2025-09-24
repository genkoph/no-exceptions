import { it, expect, describe } from "vitest";

import { Err, Ok } from "@/result";
import { attempt } from "@/attempt";

import { values } from "./utils";

describe("attempt", () => {
  describe("sync thunk", () => {
    describe("success", () => {
      it.each(values)("returns Ok with correct value for '%s'", (value) => {
        const result = attempt(() => value);

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      });
    });

    describe("failure", () => {
      it.each(values)("returns Err with correct value for '%s'", (value) => {
        const result = attempt(() => {
          throw new Error("Test message.", { cause: value });
        });

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          // @ts-expect-error result.error.cause is of type unknown
          expect(result.error.cause.cause).toEqual(value);
        }
      });
    });
  });

  describe("async thunk", () => {
    describe("success", () => {
      it.each(values)("returns Ok with correct value for '%s'", async (value) => {
        const result = await attempt(async () => value);

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      });
    });

    describe("failure", () => {
      it.each(values)("returns Err with correct value for '%s'", async (value) => {
        const result = await attempt(async () => {
          throw new Error("Test message.", { cause: value });
        });

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          // @ts-expect-error result.error.cause is of type unknown
          expect(result.error.cause.cause).toEqual(value);
        }
      });
    });
  });

  describe("promise", () => {
    describe("success", () => {
      it.each(values)("returns Ok with correct value for '%s'", async (value) => {
        const result = await attempt(Promise.resolve(value));

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      });
    });

    describe("failure", () => {
      it.each(values)("returns Err with correct value for '%s'", async (value) => {
        const result = await attempt(Promise.reject(value));

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error.cause).toEqual(value);
        }
      });
    });
  });

  describe("executor", () => {
    describe("success", () => {
      it.each(values)("returns Ok with correct value for '%s'", async (value) => {
        const result = await attempt<typeof value>((resolve) => resolve(value));

        expect(result).toBeInstanceOf(Ok);

        if (result.isOk()) {
          expect(result.value).toEqual(value);
        }
      });
    });

    describe("failure", () => {
      it.each(values)("returns Err with correct value for '%s'", async (value) => {
        const result = await attempt<typeof value>((_, reject) => reject(value));

        expect(result).toBeInstanceOf(Err);

        if (result.isErr()) {
          expect(result.error.cause).toEqual(value);
        }
      });
    });
  });
});
