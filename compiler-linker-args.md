## Compiler & Linker Arguments

## Passing linker arguments using Autotools

So far the only way I've found to do this is using `LDFLAGS`, but this clobbers
any existing `LDFLAGS` that are already set up. At least this is the case in
Ruby anyway.

## Setting the stack size

`LDFLAGS="-Wl,-stack_size,0x4000"`

* This sets a 32Kb stack
* Stack values must be in multiples of the system segment size otherwise bad
  things will happen (configure will fail with random errors)

