# Ruby Heap Pages

`struct heap_page` - created in `heap_page_allocate`, which creates a page
containing a page_body

`total_slots`, the number of slots inside that heap page, this is set by
`HEAP_PAGE_OBJ_LIMIT` and currently evaluates to 292.

`free_slots`, the number of slots that are `T_FREE`, this is also initialised to
`HEAP_PAGE_OBJ_LIMIT` because all slots are free to start with.

`pinned_slots`, The number of slots that contain objects that are not movable by the GC Compacter.

`final_objects`, The number of objects that have declared finalizers. A
finalizer is a proc that gets run when the object is garbage collected.

`flags`, These are just standard accounting bits, 4 bit wide bitfield.
  - `before_sweep`, marked true at the start of a sweep, and then false as each page is swept
  - `has_remembered_objects`, dunno what this is for, but it looks to be tied up with the generational garbage collector (transient heap?)
  - `has_uncollectible_shady_objects`, lol dunno
  - `in_tomb` - this bit is set when the page is added to the tomb heap. The tomb heap is where pages are moved to if after a GC sweep, they contain no more live objects.

`free_next`, this is a `heap_page *`, it references the next free page in the
heap. This means that we have a singly linked list of free pages I think.

`start`, an `RVALUE *` pointing to the first slot in the page. This is also a singly linked list.

`freelist`, an `RVALUE *` referencing the first slot in the page that is free.
This is a singly linked list on master (but doubly linked in our current working
branch, the tail is being pointed at by `freelist_tail`).

The next few fields are all bitmaps with their size controlled by
`HEAP_PAGE_BITMAP_LIMIT`, They are `struct bits_t` and I don't really know what
this is, it looks in `lldb` like an array of `unsigned long`'s - the array is
five elements long and an `unsigned long` is 8 bytes - so that's 5 * 64 bits =
320 bits. This means there are spare bits at the end as we only use 292 slots
per page and only having 4 `unsigned long`'s would have only given us coverage
for 4 * 64 = 256 slots.