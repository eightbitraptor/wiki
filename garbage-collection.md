## Garbage Collection

### Tracing GC's

These are collectors that use reachability to determine liveness. Tracing the
transitive closure of the object graph to determine reachability.

There are 3 canonical types of tracing GC.

* **mark-sweep** - Normally uses a freelist based allocator. collects by tracing
  the graph, and setting a mark bit for every object that is reachable. Collects
  by scanning the whole heap, and adding any object without a mark bit back to
  the freelist. allocation is generally slow, but sweeping to freelist is fast.
  The heap can get fragmented here which means more memory can be used. There
  will be empty gaps between objects that the allocator is unable to allocate
  into. Mark-sweep is pretty quick because it never moves stuff, but the memory
  usage is bad.
* **semi-space** - divides the heap in two. allocates using a bump pointer,
  collects by a process called evacuation: moving live objects from the old
  space into the new space, compacting as it goes. when collection is done it
  swaps the spaces around and empties the old from space. Bump pointer means
  allocation is fast, but evacuations is slow. generally evacuation speed is
  offset by the increase in allocation speed, making this pretty quick, it's
  also fairly memory efficient because it doesn't get fragmented. But it
  requires a larger maximum heap size to account for the unused to space.
* **mark-compact** - mark compact generally uses a bump pointer allocation, but
  to make this work across the whole heap (rather than just half as in
  semi-space), collection is done using compaction. All live objects are moved
  over to one side of the heap. Allocation is fast here, but collection is
  really slow. Memory usage is better than semi space and mark-sweep, as it
  solves the fragmentation problem, and doesn't require the split heap of
  semi-space, but the speed is worse because compaction is a massive bottleneck.

There's also reference counting, which is simply where objects keep track of how
many things are referring to them, and then, when that counter hits 0, the
object is reclaimed. Reference counting is fast, but naive, it can't cope with
circular references, and is often used in conjunction with a tracing collector,
for some specific purposes.

### Immix

Immix is a GC algorithm developed by Steve Blackburn and Kathryn McKinley and
presented in the paper [Immix: a mark-region garbage collector with space
efficiency, fast collection, and mutator
performance](http://users.cecs.anu.edu.au/~steveb/pubs/papers/immix-pldi-2008.pdf)
at PLDI08.

Immix introduces a fourth type of tracing GC:

### Mark-region





