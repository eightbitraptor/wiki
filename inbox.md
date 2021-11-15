remember set

if you add a newobj as a child of an old object, the child object is places on the remember set

the other case is part of incremental gc, when you add a child to an object that is already marked black.

RVALUE_WB_UNPROTECTED - write barrier unprotected

free poages pages where we have one or more free slots

heaps free list will point to all the free slots in teh page that we're
currently using, so when we move a page into the using page, we move it's
freelist from the page up to the heap, which is why we have a heap freelist and
a page freelist

if a page is completely free and we have a global freelist, then it's really
hard for us to free a page becuase the slots can be scattered across the linked
list and would be hard to remove, which is why we have a freelist per page.