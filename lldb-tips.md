# Lldb Tips

Here are some things I've learned about using the `lldb` debugger.

## basic navigation

- most things can be abbreviated, `b == breakpoint`, `f == frame` etc
- `bt` prints the backtrace
- `frame n` where `n` is an integer, jumps to stack frame `n`
- `frame variable` prints a list of the locals in the current stack frame
- `source list` shows you where you are

## running expressions

You can run expressions using `expr` or `p`. This is useful to look at
variables, or check truthiness of stuff.

Some examples:

```
(lldb) p objspace->flags
(rb_objspace::(anonymous struct)) $7 = {
  mode = 0
  immediate_sweep = 1
  dont_gc = 0
  dont_incremental = 0
  during_gc = 0
  during_compacting = 0
  gc_stressful = 0
  has_hook = 0
  during_minor_gc = 0
  during_incremental_marking = 0
}
```

```
(lldb) p objspace->flags.mode == 1
(bool) $8 = false
```

In both of these cases you can see lldb has saved the result of the expression
to a register as well as printing it out (the `$7` in the first example and the
`$8` in the second). These are sequentially incrementing for the life of your
lldb session starting at `$0`.

You can refer to them again in other expressions.

```
(lldb) p $7.mode == $8
(bool) $10 = true
```
