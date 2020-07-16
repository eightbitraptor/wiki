# Ruby Object/GC Lifecycle

## Interesting typedefs

* `VALUE` - `unsigned long`, 8 bytes, can be used for pointers or for actual
  data.

* I think that types that are defined with _t means that it's to be treated as
  an actual type in the system. How does this differ from just passing around a
  struct?
    * Answer - C has namespaces for identifiers! structs, enum variables,
      typedef's and other things all have their own separate spaces. So when you
      define a struct with a name `S` you always have to refer to it as `struct
      S` to tell the compiler which namespace to look in, whereas marking
      something with `typedef` puts it in the global namespace.

* GC_DEBUG - defined at the top of `gc.c`, flip this to `1` to enable GC
  logging. I don't know what the output of this looks like yet.

* RVALUE - struct that holds a Ruby object 40 bytes wide.
  * Every value in teh Ruby type union has it's first value as an object of
    RBasic, which contains information about the type of the RVALUE. I'm
    guessing that this is always in the same place in memory. and that's how we
    know what each RVALUE is representing
  * unions loads of things together
    * A struct containing flags, and a pointer to an RVALUE called `next`. I
      don't know what this is yet
    * all possible ruby types
    * a union of all internal types not represented by Ruby ojects (imemo) is
      also part of the original union
        * vm_svar
        * vm_throw_data
        * vm_ifunc
        * MEMO
        * rb_method_entry_struct
        * rb_iseq_t
        * rb_env_t
        * rb_imemo_tmpbuf_struct
        * rb_ast_t
    * a struct called `values`, it contains 3 `VALUES` (`v1`, `v2`, and `v3`)
      and an RBasic struct. I have no idea what this is for - apparently this is used for initializing a generic `RVALUE`
    * If `GC_DEBUG` is turned on then we also store a link to a file and a line.
      This is the file and the line where the object was created. which it
      prints to  stdout when marking.

* `rb_objspace_t` struct - accessed by the `rb_objspace` macro.
  * Contains information about the garbage collector.
  * `malloc_params` - not sure what these are used for (I mean, I assume they're
    given to `malloc` calls, but I don't know what they mean). `limit`,
    `increase`, and optionally if defined, `allocated_size` and `allocations`
  * a struct `flags` that contains some bit fields
    * `mode` - ?
    * `immediate_sweep` - ?
    * `dont_gc` - ?
    * `dont_incremental` - ?
    * `during_gc` - ?
    * `during`compacting` - ?
    * `gc_stressful` - ?
    * `has_hook` - ?
    * `during_minor_gc` - ?
  * A count of the total allocated objects `total_allocated_objects` as well as
    a `VALUE` pointer to the `next_object_id`. I think this is in reference to
    what one of Arron's rubyconf keynotes talked about wrt how object id
    assignment changed. TODO: Look this up later.
  * Probably the most important things here: 2 instances of `rb_heap_t` for the
    `eden_heap` and the `tomb_heap` - These are the heaps where `RVALUE`'s are
    allocated.
  * Some other stuff: TODO: Come back to this later.

* `rb_heap_t` a struct to hold pages of `RVALUE` objects
  * `free_pages` - this is a pointer to a `heap_page`
  * `using_page` - this is also a pointer to a `heap_page`
  * `pages` - this is a `list_head`. Not sure what that is or what this is for
  * `sweeping_page` - this is a pointer to a `heap_page`, the inline comment
    tells me that it's an "iterator for .pages", not sure what this means yet.
  * `total_pages` - ?
  * `total_slots` - ? (how many slots fit in a page)
  * So where do these get initialised?

## The initialisation of the heaps

* Ruby starts up and runs `Init_GC()`, this does a load of stuff, but one of the things it does is
