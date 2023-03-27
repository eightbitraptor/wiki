## GC Handbook - Chapter 1: Introduction

### Terminology and Notation

- The heap: A contiguouos array of memory words, or a set of discontiguous
  blocks of contiguouos words (ie. the heap may or may not be organised into a
  set of pages)
- A Granule: The smallest unit of allocation, usually a word
- A Chunk: A large contiguouos group of granules
- A Cell: A generally smaller group of contiguouos granules that may be
  allocated, free, wasted or unusable for some reason
- An Object: A cell allocated for use by the application, divided into slots
  or fields.
- A reference: A pointer to a heap object or NULL, usually the canonical
  pointer to the head of the object
- A derived pointer: the result of adding an offset to a reference
- An interior pointer: A derived pointer to an objects internal field.

For Ruby, this probably means that VALUE is a granule, RVALUE is a cell, and it
may be allocated as various types of object (RString, RClass etc) which would be
the Objects.

### Mutator/collector

- Mutator is the thread/s that execute application code, allocate objects, and
  mutate references
- the collector, executes GC code, free's storage occupied by unreachable
  objects

### Mutator roots

This is different to the set of root objects. It is

> a finite set of mutator roots, representing pointers held in storage  that is
>_directly_ accessible to the mutator without going through other objects

Root objects are all objects in the heap that are directly accessible from these
mutator roots.

In practice, this is normally global state, thread local storage (such as
execution stacks), that contains pointers to things on the heap.

### References

```
Pointers(N) = { a | a = &N[i]; ∀i: 0 ≤ i < |N| where N[i] is a pointer}
```

For an Object N: The set of pointer fields of N is all the addresses to fields
that are part of the array, where the contents of the field is a pointer.

Basically: references are all the fields of an object that are pointers to other
things.

### Liveness

An object is live if the mutator will access it in the future. This is [an
undecidable problem](https://en.wikipedia.org/wiki/Undecidable_problem).

A GC is only correct if it never reclaims live objects.

We approximate liveness using pointer reachability. an object N is reachable
from an object M if N can be reached by following a chain of pointers from a
field of M

```
reachable = {N ∈ Nodes | (∃r ∈ Roots : r ⟶ N) ∨ (∃M ∈ reachable: M ⟶ N)}
```

The set of all Reachable objects in Nodes such that there exists a reference
from a root node that points to it, or there exists another object in the
reachable set that points to it.



