# Inspecting internal CRuby structs  in Lldb

You can cast stuff in lldb, this is especially useful when looking at `VALUE`'s
(see [[ruby-object-lifecycle]])

Example: Let's take a look at the global object `argf` (which is something we
had to do recently when looking at a bug):

```
(lldb) p argf
(VALUE) $80 = 0x00000001018353b8
```

Because it's a VALUE, we can use `rp` (providing we configured `lldb` to import
the `lldb_cruby.py` helper script mentioned in [[lldb-tips]]).

```
(lldb) rp argf
T_DATA: (const char *) wrap_struct_name = 0x000000010033e302 "ARGF"
(struct RTypedData) $16 = {
  basic = (flags = 0x000000000000000c, klass = 0x0000000101043b78)
  type = 0x00000001003d4488
  typed_flag = 0x0000000000000001
  data = 0x0000000100823cd0
}
```

We can see that this is a `T_DATA` struct that's explosed to the Ruby layer as
the constant `ARGF`.

If we look at how `argf` is being used in the C. We can see that it's often used
as `ARGF` - which in MRI is a macro that takes the `RData` struct and converts
it to an `argf` struct

```
#define argf_of(obj) (*(struct argf *)DATA_PTR(obj))
#define ARGF argf_of(argf)
```

So, whilst me don't have any preprocessor directives in an `lldb` session, we
can do this conversion ourselves.

We can find out that `RDATA_PTR` is just a macro that expands to grab the
contents of the `data` member of the struct, like this:

```
#define DATA_PTR(obj)             RDATA(obj)->data
```

So. We can

1. cast `argf` to `RData`, allowing us to reference it's `data` member
2. cast the `VALUE` in the `data` member to a pointer to an `argf` struct (which
   is what `argf_of` is doing)
3. dereference the pointer to a `struct argf`. Because at this point, we're
   holding a struct rather than a pointer we can just use `p` to print it,
   rather than `rp` which will try and treat it as a `VALUE`

Altogether that looks like this:

```
(lldb) p *(struct argf *)((struct RTypedData *)argf)->data
(struct argf) $82 = {
  filename = 0x00000001018356d8
  current_file = 0x0000000000000008
  last_lineno = 1
  lineno = 0
  argv = 0x0000000101835408
  inplace = 0x000000010105a2d8
  encs = {
    enc = 0x0000000000000000
    enc2 = 0x0000000000000000
    ecflags = 0
    ecopts = 0x0000000000000000
  }
  init_p = '\0'
  next_p = '\0'
  binmode = '\0'
}
```

If we want to look at one of the members, we can assume it's a `VALUE` by
casting it and then using `rp` to dereference and print it.

```
(lldb) rp (VALUE)(*(struct argf *)((struct RTypedData *)argf)->data).inplace
T_STRING: [FROZEN] (const char [4]) $84 = ".bak"
```

However, if we back up a step and don't dereference the `struct argf *` then we
don't need to do the explicit value cast as `rp` will handle that for us. This
is probably safer as we're not having to do an explicit cast, also it's less
typing.

The following two expressions are equivalent (but the first is maybe better):

```
(lldb) rp ((struct argf *)((struct RTypedData *)argf)->data)->inplace
T_STRING: [FROZEN] (const char [4]) $93 = ".bak"
(lldb) rp (VALUE)(*(struct argf *)((struct RTypedData *)argf)->data).inplace
T_STRING: [FROZEN] (const char [4]) $95 = ".bak"
```

One lesson that we should learn from this is that not having macros in `lldb` is
an absolute pain. If you find yourself manually constructing a macro more than a
handful of times, consider implementing it in Python inside the `lldb_cruby.py`
scripts, because other people may find that useful too.

## `obj_info`, `p` and `rp`

`rp` is super useful, but there are things that you sometimes need to get that it doesn't show you.

```
(lldb) rp obj
bits: [     ]
T_STRING: [UTF_8] (const char [51]) $7 = "    def print_counters(counters, prefix:, prompt:)\n"
(lldb) p *(RString *)obj
(RString) $8 = {
  basic = (flags = 0x0000000000402005, klass = 0x00007ffff6cb2458)
  as = {
    heap = {
      len = 51
      ptr = 0x0000555555b1b410 "    def print_counters(counters, prefix:, prompt:)\n"
      aux = (capa = 51, shared = 0x0000000000000033)
    }
    embed = (ary = "3")
  }
}
```

Above you can see us using `rp` first to print out the object, and then
underneath directly using `p` to cast the `VALUE` to an `RString *` and
immediately dereference it.

`rp` shows us the flags associated with that slot in a heap page too which is
super useful for GC work. That's the `bits: [     ]` part. This particular set
of flags is empty, but if the slot were marked or pinned, we'd see that here.

We can't tell whether the string is embedded or heap allocated from the `rp`
output though and sometimes that's useful. Looking at the actual struct by
dereferencing it using `p` we can see that in this case it's allocated on the
heap. there's a pointer to our memory region containing the actual `char *` of
our string, and the length.

We can actually print that string out in `lldb` using `printf` and the `ptr`
address that our string is stored at:

```
(lldb) p printf("%s", 0x0000555555b1b410)
    def print_counters(counters, prefix:, prompt:)
(int) $9 = 51
```

There is also a C function `obj_info` that we can use. `rp` is basically
`obj_info` but implemented in the debugger rather than the interpreter. `rp` is
slightly more user friendly when you're directly interacting with it. However
`obj_info` can be used in code, especially in conjunction with print statements
for old fashioned debugging.

I do variations of this *a lot*

```
fprintf(stderr, "%s\n", obj_info(obj));
```

# Inspecting heap pages

Recently I was pairing and I learned some new useful lldb tricks. I
used these in the context of heap pages, but the approach is
generalisable to all arrays. It's worth pointing out that an array in
C is basically just a contiguous memory region and some helper
functions to read it.

This prints out the pointer value for every entry in the heap pages
sorted list. I don't know how this works yet.

```
p *(void *(*)[25])ruby_current_vm_ptr->objspace->heap_pages.sorted
```
We can also use very similar code to print out all the heap pages in that list too:

```
p *(heap_page(*)[364])ruby_current_vm_ptr->objspace->heap_pages.sorted
```

[This is a really good article talking about pointers and
arrays](https://eli.thegreenplace.net/2010/01/11/pointers-to-arrays-in-c)

The weird `void * (*)[25]` syntax is a pointer to an array, not the
more commonly used, pointer to the first element of an array!


[//begin]: # "Autogenerated link references for markdown compatibility"
[ruby-object-lifecycle]: ruby-object-lifecycle "Ruby Object/GC Lifecycle"
[lldb-tips]: lldb-tips "Lldb Tips"
[//end]: # "Autogenerated link references"
