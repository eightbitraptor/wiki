# Debugging Ruby GC

## Custom info from weird parts of the code

There's a common pattern of printing to `stderr` by doing

```c
if (0) fprintf(stderr, "stuff");
```

This is particularly prevalent around the GC and the VM code

## General debug information

### `GC_DEBUG`

Enable by editing the `Makefile` and adding `-DGC_DEBUG` to the `debugflags`

embeds GC debugging information inside the RVALUE struct (file and line that the
object was created)

This is added in `gc.c` during the `newobj_init` function.

It's also used during `gc_mark_children`

### `RGENGC_DEBUG`

Enable by editing the `Makefile` and adding `-DRGENGC_DEBUG=<n>` to the
`debugflags`

Where `<n>` is a number representing the level at which we want to print out
debug information.

* 1 - Basic information
* 2 - remember set information
* 3 - mark
* 4 - dunno, this is blank in the comments
* 5 - sweep

### `'RGENGC_CHECK_MODE`

This checks the internal state of the GC at various points (and is basically the
only way to trigger the `gc_check_internal_consistency` function)

### Notes on current bug (21/07/2020)

gc.c: 6332

data.live_object_count is the analysis of the heap. we walk all the heap pages counting which ones are live (side note, objects with finalizers are treated seperately because we can't guarantee whether they're free or live or what yet)

objspace_live_slots: this is the cached values in the gc objspace of what's been allocated and deallocated,

These things should always be the same.

