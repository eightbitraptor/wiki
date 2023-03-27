## Mark-sweep Garbage Collection

All GC schemes are based on one of four fundamental approaches

* Mark-sweep collection
* Copying collection
* Mark-compact collection
* Reference counting

Different collectors can combine these approaches in multiple ways.

For now this book assumes that we're using a stop-the-world approach. This means that there are one or more mutator threads running but only one collector thread, and that while the collector thread is running, all other operations have been stopped. This means that the collector is effectively atomic.

Stopping the world means that we're always looking at a snapshot of the heap, and assumes that it is safe to examine the roots.

