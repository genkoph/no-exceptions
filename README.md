# no-exceptions

A minimal, opinionated Result pattern library for TypeScript.

No exceptions, just Results.

> **⚠️ Early development - use at your own risk. API may change.**

## Installation

```bash
npm install no-exceptions
```

## Usage

```ts
import { attempt } from "no-exceptions";

const rss = attempt(fetch("https://website.com/rss.xml"))
  .and((response) => response.text())
  .and((rawRss) => parseRawRss(rawRss));

if (result.isOk()) {
  console.log(result.value);
}
```

## API

- `ok(value)` - Create a successful result
- `err(error)` - Create an error result
- `attempt(fn)` - Wrap function that may throw in a Result
- `result.isOk()` - Check if result is successful
- `result.isErr()` - Check if result is an error
- `result.and(fn)` - Chain another result operation
- `result.andMap(fn)` - Transform success value
- `result.or(fn)` - Recover from error
- `result.orMap(fn)` - Transform error value
- `result.async` - Access async operations
