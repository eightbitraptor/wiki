# Ruby Hacking Guide - Ruby Objects

see also: [[ruby-object-lifecycle]]

In Object Oriented programming sense, an object is a combination of data (state)
and behaviour. Preferably combined in such a way that makes sense in the context
of the program in which it lives.

1. Identity. The ability to differentiate itself from other objects.
2. Methods. The ability to respond to messages sent to it by other objects.
3. Instance variables. Data local to the object where it can store it's internal
   state.

In Ruby the body of an object is always expressed as a struct (one of the
members of the `as` union in an `RVALUE` that we talked about in
[[rhg-garbage-collection]] and [[rvalue]]).

A different struct will be used by each class but it will always be pointed to
by a `VALUE` pointer.

Different structs used are:

- `struct RObject` 	all things for which none of the following applies
- `struct RClass` 	class object
- `struct RFloat` 	small numbers
- `struct RArray` 	array
- `struct RRegexp` 	regular expression
- `struct RHash` 	hash table
- `struct RFile` 	`IO`, `File`, `Socket`, etc…
- `struct RData` 	all the classes defined at C level, except the ones mentioned above
- `struct RStruct` 	Ruby’s `Struct` class
- `struct RBignum` 	big integers

Because `VALUE` is defined as `unsigned long` it must be cast before being used
as a pointer. Macros exist for each object struct to cast value pointers to the
correct pointer type.

```
RSTRING(obj)->len; // ((struct RString*)obj)->len
```

Note: I was unfamiliar with the `->` syntax in C when I started looking at this.
it turns out it is broadly equivalent to the `.` operator, ie it accesses a
member or calls a function. But it treats the caller as a pointer and
dereferences it first. so `obj->bar` is the same as `(*obj).bar`.

Every object struct contains an `RBasic` as it's first member (named `basic`).

RBasic looks pretty much like this (and is defined in `internal/core/rbasic.h`)

```
struct RBasic {
  unsigned long flags;
  VALUE klass;
}
```

- `flags` are multipurpose flags

[//begin]: # "Autogenerated link references for markdown compatibility"
[ruby-object-lifecycle]: ruby-object-lifecycle "Ruby Object/GC Lifecycle"
[rhg-garbage-collection]: rhg-garbage-collection "Ruby Hacking Guide - Garbage Collection"
[rvalue]: rvalue "Rvalue"
[//end]: # "Autogenerated link references"