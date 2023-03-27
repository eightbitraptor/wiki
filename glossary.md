# Glossary

Tech terms that I run into a lot, that I have to look up. When I look them up,
I'll write them down here.

## Transitive closure

A transitive closure is the full set of all the possible connections or
relationships between elements of a set.

Eg. If you have a set consisting of A, B and C, and the relationships (A, B) and
(B, C), then the transitive closure of the relationship set would be the set
that contains not just these relationships, but also the indirect relationship
(A, C) - Because C can be reached from A by going through B.

This is referred to a lot when we talk about tracing GC's. ie. Anything
reachable from a reachable object is itself reachable.

## Tracing

The process of walking the transitive closure of the object graph, starting from
some known roots, in order to determine which objects are reachable (and
therefore can be considered to be live, as they may be accessed again).

Note that tracing GC's consider any object that is reachable as live, even
though that object may not necessarily be used for the rest of the programs
lifetime.
