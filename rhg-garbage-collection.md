# Ruby Hacking Guide - Garbage Collection

## Memory

A general C program has 4 areas in it's memory space.

1. the text area
2. a place for static and global variables
3. the machine stack
4. the heap

The text area is where the code lives, the actual compiled machine code of the
program that is running.

the area reserved for static's and globals is similarly uninteresting for our
purposes.

I wrote a bit about the stack here: [[rhg-the-stack]]

## The heap and GC

The heap is for actual data that we want to store and retain access to for the
lifetime of the program. we allocate memory here using `malloc` and we're
required to `free` it when we're done.

When you call `malloc` you pass as arguments the number of bytes of memory you
wish to allocated and then `malloc` returns a pointer to the start of that
memory address.

when you call `free` you pass the pointer to a region of memory previously
allocated with `malloc`, no value is returned.

Having to do this manually would be super hard in an OO language, where we have
webs of objects that are pointing to each other.

so GC is misnamed a bit really - it's primary job is to manage our use of
memory, so that we don't have to manually `malloc` and `free`.

Thinking about things in terms of objects and links between them we can say that
some objects are definitely necessary. some examples of these are:

- objects pointed to by global variables
- objects in any frame on the stack
- any object that can be reached by travelling down links from one of these
  objects (so, instance variables etc).

When you categorise objects like this you end up with a series of tree
structures, where the root of the tree is a necessary object.

Any object that is not part of the tree (so any object that isn't depended on in
some way by one of our defined "root" nodes) is not necessary for the
functioning of the program, and it's memory can be released for the program to
reuse.

### Mark & Sweep

This is how the main GC in Ruby works (this was the only GC when this guide was
written, these days there is also the transient heap which uses generation GC -
I think).

the algorithm looks like

- first find and mark the root objects
  - then mark all reachable objects
- if there are no more reachable objects
  - iterate the entire objectspace (the heap)
    - release any objects that are not marked

Advantages of Mark & Sweep are:

- unlike some other methods there doesn't need to be any concern for garbage
  collection outside of the implementation of the garbage collector (almost
  everything in ruby is contained in `gc.c`)
- unlike some other methods, it's possible to release cyclical object graphs, as
  long as none of the objects in the cycle are reachable from a root node.

Disadvantages are:
- In order to sweep, we have to walk every object at least once
- The load of the GC is concentrated at one point. We need to stop the world and
  prevent new objects from being created while we walk the heap to mark stuff.

There are other GC algorithms that the Ruby Hacking guide talks about, but I'm
not going to write about them as Ruby doesn't use them.

An interesting alternative to look at is called Reference counting. This is the
main mechanism that Python uses. Although it also implements a backup mark and
sweep algorithm in order to free cyclic references.

## Object management

It's really important to only consider GC in the context of object management.
You can't keep track of and clean up objects unless the system knows about them.

So this will cause a memory leak:

```c
void not_ok()
{
  malloc(1024);
}
```

whereas this is fine (because `rb_ary_new` uses `rb_newobj_of` internally, which
is a function in the garbage collector that allocates a new `RVALUE` in Ruby's
object space).

```c
void this_is_file()
{
  rb_ary_new();
}
```

### RVALUE

see [[rvalue]] for more notes.

Every Ruby object is represented by a struct, like `RClass`, `RFloat`, `RString`
etc.

To keep things simpler a union of all the structs of builtin objects is declared
and that union is the one that's always used when referring to memory.

Here is a clipped version of that union.

```c
typedef struct RVALUE {
    union {
        struct {
            VALUE flags;		/* always 0 for freed obj */
            struct RVALUE *prev;
            struct RVALUE *next;
        } free;
        struct RMoved  moved;
        struct RGarbage garbage;
        struct RBasic  basic;
        struct RObject object;
        struct RClass  klass;
        struct RFloat  flonum;
        struct RString string;
        struct RArray  array;
        struct RRegexp regexp;
        struct RHash   hash;
        struct RData   data;
        struct RTypedData   typeddata;
        struct RStruct rstruct;
        struct RBignum bignum;
        struct RFile   file;
        struct RMatch  match;
        struct RRational rational;
        struct RComplex complex;
    } as;
} RVALUE;
```

Ruby Object structure discussed in more detail [[rhg-ruby-objects]]

[//begin]: # "Autogenerated link references for markdown compatibility"
[rhg-the-stack]: rhg-the-stack "Ruby Hacking Guide - The Stack"
[rvalue]: rvalue "Rvalue"
[rhg-ruby-objects]: rhg-ruby-objects "Ruby Hacking Guide - Ruby Objects"
[//end]: # "Autogenerated link references"