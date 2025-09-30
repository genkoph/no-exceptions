# no-exceptions

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/no-exceptions.svg)](https://www.npmjs.com/package/no-exceptions)

A minimal and opinionated TypeScript implementation of the Result pattern for explicit and type-safe error handling, aiming to be an easy-to-adopt solution for any project.

## Table of Contents

- [Description](#description)
- [Install](#install)
- [API Reference](#api-reference)
  - [Core Types](#core-types)
    - [`Result`](#resultt-e)
    - [`Ok`](#okt)
    - [`Err`](#erre)
    - [`ResultPromise`](#resultpromiset-e)
  - [Utility Functions](#utility-functions)
    - [`ok`](#oktvalue-t-okt)
    - [`err`](#erreerror-e-erre)
    - [`attempt`](#attemptt-resultt-error--resultpromiset-error)
  - [Result Methods](#result-methods)
    - [`map`](#mapufn-value-t--u-resultu-e)
    - [`mapErr`](#maperrufn-error-e--u-resultt-u)
    - [`and`](#andu-vfn-value-t--resultu-v-resultu-e--v)
    - [`andErr`](#anderru-vfn-error-e--resultu-v-resultt--u-v)
    - [`tap`](#tapfn-value-t--unknown-resultt-e)
    - [`tapErr`](#taperrfn-error-e--unknown-resultt-e)
    - [`unwrap`](#unwrapvfallback-v-t--v)
    - [`attempt`](#attemptufn-value-t--u-resultu-e--error)
    - [`async`](#async-resultpromiset-e)
    - [`ResultPromise.create`](#resultpromisecreatet-eresult-promiseresultt-e-resultpromiset-e)
    - [`ResultPromise.createFunction`](#resultpromisecreatefunctiont-efn-args-any--promiseresultt-e-args-any--resultpromiset-e)
- [License](#license)

## Description

**no-exceptions** is an implementation of the Result pattern - a design pattern for explicit, type-safe error handling originating in languages like Rust, Haskell, and Elm.

Unlike traditional methods where functions return null or throw exceptions to signify failure, the Result pattern wraps the outcome in a `Result` object. This object can either represent a successful outcome containing the expected data or an unsuccessful outcome with error information.

By making error states part of a function’s type signature and enforcing explicit handling of both success and failure, this approach leads to safer, more predictable code and consistent, visible error handling, reducing unhandled errors and unexpected crashes.

---

**no-exceptions** implements the Result pattern using two core classes:

- `Ok<T>`: Represents a successful outcome and holds a value of type `T`.
- `Err<E>`: Represents a failed outcome and holds an error of type `E`.

Both `Ok` and `Err` expose a rich set of identical methods, allowing you to transform, chain, and handle results in a fluent and type-safe way, without ever needing to unwrap the values.

These two classes are unified under the `Result<T, E>` type, which is simply a union: `Ok<T> | Err<E>`. This means any function returning a `Result` will always be explicit about both its success and failure possibilities.

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

## API Reference

### Core Types

#### `Result<T, E>`

A union type representing either a successful result (`Ok<T>`) or a failed result (`Err<E>`). This is the main type used throughout the library for error handling.

```typescript
type Result<T, E> = Ok<T> | Err<E>;
```

#### `Ok<T>`

Represents a successful result containing a value of type `T`.

```typescript
class Ok<T> {
  constructor(readonly value: T);
}
```

#### `Err<E>`

Represents a failed result containing an error of type `E`.

```typescript
class Err<E> {
  constructor(readonly error: E);
}
```

#### `ResultPromise<T, E>`

A wrapper for `Result` that allows you to work with results asynchronously.

```typescript
class ResultPromise<T, E> {
  constructor(promise: Promise<Result<T, E>>);
}
```

### Utility Functions

#### `ok<T>(value: T): Ok<T>`

Creates a new `Ok` result with the given value.

```typescript
const result = ok(42);
// result: Ok<number>
```

#### `err<E>(error: E): Err<E>`

Creates a new `Err` result with the given error.

```typescript
const result = err("Something went wrong");
// result: Err<string>
```

#### `attempt<T>(...): Result<T, Error> | ResultPromise<T, Error>`

Executes a function or Promise and catches any errors, returning a Result or ResultPromise.

```typescript
// sync
function attempt<T>(fn: () => T): Result<T, Error>;

// async
function attempt<T>(fn: () => Promise<T>): ResultPromise<T, Error>;

// promise
function attempt<T>(promise: Promise<T>): ResultPromise<T, Error>;

// executor (Promise constructor)
function attempt<T>(
  executor: (
    resolve: (value: T) => void,
    reject:  (error: unknown) => void
  ) => void,
): ResultPromise<T, Error>;
```

> **⚠️ Note:** The executor overload requires the generic type parameter `<T>` to be explicitly specified.

```typescript
const result = attempt(() => JSON.parse('{"valid": "json"}'));
// result: Result<any, Error>

const result = attempt(async () => fetch("/api/data"));
// result: ResultPromise<Response, Error>

const result = attempt(fetch("/api/data"));
// result: ResultPromise<Response, Error>

const result = attempt<string>((resolve, reject) => {
  setTimeout(() => resolve("success"), 1000);
});
// result: ResultPromise<string, Error>
```

### Result Methods

#### `isOk(): boolean`

Checks if the result is an Ok variant.

```typescript
const result = ok(42);
if (result.isOk()) {
  console.log(result.value); // 42
}
```

#### `isErr(): boolean`

Checks if the result is an Err variant.

```typescript
const result = err("Something went wrong");
if (result.isErr()) {
  console.log(result.error); // "Something went wrong"
}
```

#### `map<U>(fn: (value: T) => U): Result<U, E>`

Transforms the success value if this is an Ok, otherwise returns the Err unchanged.

```typescript
const result = ok(42);
const doubled = result.map((x) => x * 2);
// doubled: Ok<number> with value 84
```

#### `mapErr<U>(fn: (error: E) => U): Result<T, U>`

Transforms the error value if this is an Err, otherwise returns the Ok unchanged.

```typescript
const result = err("network error");
const formatted = result.mapErr((err) => `Error: ${err}`);
// formatted: Err<string> with error "Error: network error"
```

#### `and<U, V>(fn: (value: T) => Result<U, V>): Result<U, E | V>`

Chains another Result-returning function if this is an Ok, otherwise returns the Err unchanged.

```typescript
const result = ok(42);
const processed = result.and((x) => ok(x.toString()));
// processed: Ok<string> with value "42"
```

#### `andErr<U, V>(fn: (error: E) => Result<U, V>): Result<T | U, V>`

Chains another Result-returning function if this is an Err, otherwise returns the Ok unchanged.

```typescript
const result = err("network error");
const recovered = result.andErr((err) => ok(`Recovered from: ${err}`));
// recovered: Ok<string> with value "Recovered from: network error"
```

#### `tap(fn: (value: T) => unknown): Result<T, E>`

Executes a side effect on the success value and returns the original Result unchanged.

```typescript
const result = ok(42);
const logged = result.tap((x) => console.log(`Got value: ${x}`));
// Logs: Got value: 42
// logged: Ok<number> with value 42
```

#### `tapErr(fn: (error: E) => unknown): Result<T, E>`

Executes a side effect on the error value and returns the original Result unchanged.

```typescript
const result = err("Something went wrong");
const logged = result.tapErr((err) => console.log(`Error: ${err}`));
// Logs: Error: Something went wrong
// logged: Err<string> with error "Something went wrong"
```

#### `unwrap<V>(fallback?: V): T | V`

**⚠️ WARNING: This method can throw and should be used with extreme care!**

Returns the contained Ok value, or a provided default if this is an Err.

```typescript
const result = ok(42);
const value = result.unwrap();
// value: 42

const errResult = err("error");
const fallback = errResult.unwrap("default");
// fallback: "default"

const errResult = err("error");
const fallback = errResult.unwrap();
// throws an Error
```

#### `attempt<U>(fn: (value: T) => U): Result<U, E | Error>`

Safely executes a function on the success value, catching any thrown errors.

```typescript
const result = ok('{"valid": "json"}');
const parsed = result.attempt((str) => JSON.parse(str));
// parsed: Ok<{valid: string}> or Err<Error>
```

#### `async: ResultPromise<T, E>`

Converts the Result to a ResultPromise for async operations.

```typescript
const result = ok(42);
const asyncResult = result.async
  .map((x) => fetch(`/api/data/${x}`))
  .and((response) => response.json());
// asyncResult: ResultPromise<any, Error>
```

#### `ResultPromise.create<T, E>(result: Promise<Result<T, E>>): ResultPromise<T, E>`

Creates a ResultPromise from a Promise that resolves to a Result.

```typescript
const promise = fetch("/api/data").then((response) =>
  response.ok ? ok(response) : err("Request failed"),
);
const resultPromise = ResultPromise.create(promise);
// resultPromise: ResultPromise<Response, string>
```

#### `ResultPromise.createFunction<T, E>(fn: (...args: any[]) => Promise<Result<T, E>>): (...args: any[]) => ResultPromise<T, E>`

Utility for creating async Result functions.

```typescript
const asyncFn = async (id: number) => {
  const response = await fetch(`/api/users/${id}`);
  return response.ok ? ok(await response.json()) : err("Not found");
};

const wrappedFn = ResultPromise.createFunction(asyncFn);
const result = wrappedFn(123);
// result: ResultPromise<User, string>
```

## License

MIT
