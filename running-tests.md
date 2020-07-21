# Running Tests

## Running tests

There are a bunch of ways to verify your changes to Ruby after you've build the
binary. Which one you'll use will depend on where you're working in the
codebase, and how quickly you need feedback.

From fastest (least coverage) to slowest (most coverage), these are:

- `make btest` requires `miniruby`. ~1400 tests, ~50 seconds on my mac.
- `make test` requires full `ruby` and runs a test suite. ~1400 tests, ~60
  seconds on my Macbook.
- `make test-all` requires full `ruby`, 20k tests, ~20 minutes.

## Running specific tests

You can run a single test file with

```
make test-all TESTS=/path/to/test/file.rb
```



