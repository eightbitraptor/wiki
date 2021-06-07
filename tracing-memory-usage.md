# Tracing Memory Usage

## `malloc_history`

available on macOS, not sure what else exists for other OS's.

the man page says

> malloc_history inspects a given process and lists the malloc and anonymous VM
> allocations performed by it

### How do we use it?

- Run your process

```
MallocStackLoggingNoCompact=1 ruby
```
