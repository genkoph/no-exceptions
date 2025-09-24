# no-exceptions

A minimal and opinionated TypeScript library for explicit and type-safe error handling, aiming to be an easy-to-adopt solution for any project.

> ⚠️ **Early Development**: This package is in early development and experimental. The API is subject to change without notice. Use with caution.

[![npm version](https://img.shields.io/npm/v/no-exceptions.svg)](https://www.npmjs.com/package/no-exceptions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

```bash
npm install no-exceptions
```

```bash
yarn add no-exceptions
```

```bash
pnpm add no-exceptions
```

```bash
bun add no-exceptions
```

## Introduction

At the core of `no-exceptions` is the **Result pattern**, a powerful approach to error handling that makes failures explicit in your code. Instead of throwing exceptions that can crash your program unexpectedly, the Result pattern uses a clear, type-safe way to represent both successful and failed operations.

The `Result<T, E>` type is a union that can be either:

- `Ok<T>` - representing a successful operation with a value of type `T`
- `Err<E>` - representing a failed operation with an error value of type `E`

The `Ok<T>` class represents a successful operation and contains a value of type `T`. When a function returns `Ok`, it means the operation completed successfully and you can safely access the `.value` property. To create an `Ok` instance, use the `ok()` function.

The `Err<E>` class represents a failed operation and contains an error value of type `E`. When a function returns `Err`, it means something went wrong and you should handle the error case. To create an `Err` instance, use the `err()` function.

```typescript
import { ok, err, type Result } from "no-exceptions";

const divide = (a: number, b: number): Result<number, "division_by_zero"> => {
  if (b === 0) {
    return err("division_by_zero");
  }

  return ok(a / b);
};

const result = divide(10, 2);

if (result.isOk()) {
  // result: Ok<number>
} else {
  // result: Err<'division_by_zero'>
}
```

For asynchronous operations, `no-exceptions` provides `ResultPromise<T>`, which extends the Result pattern to work seamlessly with Promises. This allows you to handle async errors with the same explicit, type-safe approach, avoiding the need for try-catch blocks and making your async code more predictable and easier to reason about.

```typescript
import { ResultPromise, ok, err, type Result } from "no-exceptions";

const fetchUser = async (id: number): Promise<Result<string, "not_found">> => {
  if (id > 0) {
    return ok(`User ${id}`);
  }
  return err("not_found");
};

const result = await ResultPromise.from(fetchUser(1));

if (result.isOk()) {
  // result: Ok<string>
} else {
  // result: Err<"not_found">
}
```

## API Reference

### Surface-Level Utilities

#### `ok`

Creates a successful result (`Ok`) with a given value.

```ts
import { ok } from "no-exceptions";

const result = ok(42);

result.isOk(); // true
result.isErr(); // false
result.value; // 42
```

---

#### `err`

Creates a failed result (`Err`) with a given error.

```ts
import { err } from "no-exceptions";

const result = err("Something went wrong");

result.isOk(); // false
result.isErr(); // true
result.error; // "Something went wrong"
```

---

#### `ResultPromise.ok`

Wraps a value in a successful `ResultPromise`.

```ts
import { ResultPromise } from "no-exceptions";

const result = await ResultPromise.ok(42);

result.isOk(); // true
result.isErr(); // false
result.value; //42
```

---

#### `ResultPromise.err`

Wraps an error in a failed `ResultPromise`.

```ts
import { ResultPromise } from "no-exceptions";

const result = await ResultPromise.err("Network failure");

result.isOk(); // false
result.isErr(); // true
result.error; // "Network failure"
```

---

#### `ResultPromise.from`

Converts a Promise that resolves to a Result into a `ResultPromise`.

```ts
import { ok, err, ResultPromise, type Result, } from "no-exceptions";

const result = await ResultPromise.from(fs.readFile('example.txt', 'utf8').then(ok).catch(err));

if (result.isOk()) {
  // result: Ok<string>
} else {
  // result: Err<unknown>
}
```

---

#### `attempt`

Executes a function or Promise and wraps the result in a `Result` type, catching any errors that occur during execution.

```ts
// sync

import { attempt } from "no-exceptions";

const data = attempt(() => JSON.parse("}"));

if (data.isErr()) {
  // data: Err<Error>
} else {
  // data: Ok<any>
}
```

```ts
// async

import { attempt } from "no-exceptions";

const data = await attempt(async () => {
  const response = await fetch("/api");
  return response.json();
});

if (data.isErr()) {
  // data: Err<Error>
} else {
  // data: Ok<unknown>
}
```

```ts
// promise

import { attempt } from "no-exceptions";

const data = await attempt(fetch("/api")).andMap((response) => response.json());

if (data.isErr()) {
  // data: Err<Error>
} else {
  // data: Ok<unknown>
}
```

```ts
// executor

import { attempt } from "no-exceptions";
import { readFile } from "node:fs";

const data = await attempt<string>((resolve, reject) => {
  readFile("README.md", (error, data) => {
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
});

if (data.isErr()) {
  // data: Err<Error>
} else {
  // data: Ok<string>
}
```

---

### Result Methods (both Result and ResultPromise)

#### `Result.isOk`

Returns true if the result is `Ok` variant.

```ts
import { ok } from "no-exceptions";

const result = ok(42);
result.isOk(); // true
```

---

#### `Result.isErr`

Returns true if the result is `Err`.

```ts
import { err } from "no-exceptions";

const result = err("Failed");

result.isErr(); // true
```

---

#### `Result.or`

If `Err`, runs a function on the error value to produce a new `Result`, otherwise just skips the function.

```ts
import { ok, err } from "no-exceptions";

const okResult = ok(42);
const errResult = err("error");

okResult.or((e) => ok(e.toUpperCase())); // Ok<42>
errResult.or((e) => ok(e.toUpperCase())); // Err<"ERROR">
```

---

#### `Result.and`

If `Ok`, runs a function on the value to produce a new `Result`, otherwise just skips the function.

```ts
import { ok, err } from "no-exceptions";

const okResult = ok(10)
const errResult = err("fail")

okResult.and((x) => ok(x * 2)); // Err<20>
errResult.and((x) => ok(x * 2)); // Err<"fail">
```

---

#### `Result.orMap`

If `Err`, transforms the error value, otherwise just skips the function.

```ts
import { ok, err } from "no-exceptions";

const okResult = ok(42);
const errResult = err("fail");

okResult.orMap((e) => e.toUpperCase()); // Ok<42>
errResult.orMap((e) => e.toUpperCase()); // Err<"FAIL">
```

---

#### `Result.andMap`

If `Ok`, transforms the value, otherwise just skips the function.

```ts
import { ok, err } from "no-exceptions";

const okResult = ok(21);
const errResult = err("fail");

okResult.andMap((x) => x * 2); // Ok<42>
errResult.andMap((x) => x * 2); // Err<"fail">;
```

---

#### `Result.orTee`

If `Err`, runs a side-effect function on the error, otherwise just skips the function.

```ts
import { ok, err } from "no-exceptions";

const okResult = ok(42);
const errResult = err("fail")

okResult.orTee((e) => console.log(e)); // Ok<42>
errResult.orTee((e) => console.log(e)); // Err<"fail">
```

---

#### `Result.andTee`

If `Ok` runs a side-effect function on the value, otherwise just skips the function.

```ts
import { ok, err } from "no-exceptions";

const okResult = ok(42);
const errResult = err("fail");

okResult.andTee((x) => console.log(x)); // Ok<42>
errResult.andTee((x) => console.log(x)); // Err<"fail">
```

## License

MIT
