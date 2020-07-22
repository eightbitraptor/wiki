# Ruby Objspace

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