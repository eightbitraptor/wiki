## RubyKaigi 2023 References

A list of resources I used when writing my talk about Plug & Play Garbage Collection in Ruby/MMTk

### Papers

* [Recursive Functions of Symbolic Expressions and their Computation by Machine, Part 1](http://www-formal.stanford.edu/jmc/recursive.html), John McCarthy, April 1960.
* [The LISP system for the Q-32 computer](https://www.softwarepreservation.org/projects/LISP/book/III_LispBook_Apr66.pdf), Robert Saunders, 1974 (Description of Edwards 2-finger compaction algorithm, taken from the book "The Programming Language LISP: Its Operation and Applictions, 4th edition published in 1974, pages 220 onwards).
* [Generational Scavengine: A Non-disruptive High Performance Storage Reclamation Algorithm](http://www.cs.tufts.edu/comp/250RTS/archive/david-ungar/generation-scavenging.pdf). David Ungar, Berkeley, 1984.
* [Deferred Gratification: Engineering for Hight Performance Garbage Collection From the Get Go](https://www.cs.utexas.edu/users/mckinley/papers/php-memory-mspc-2011.pdf), Blackburn & McKinley et al. 2011
* [Immix: A Mark-Region Garbage Collector with Space Efficiency, Fast Collection, and Mutator Performance](https://users.cecs.anu.edu.au/~steveb/pubs/papers/immix-pldi-2008.pdf), Blackburn & McKinley, 2008
* [Low-Latency, High Throughput Garbage Collection](https://dl.acm.org/doi/10.1145/3519939.3523440), Wenyu Zhao, Blackburn & McKinley, 2022

### Books

* [The Garbage Collection Handbook](https://gchandbook.org/), Jones, Hosking & Moss.

### Talks

* [Memory Managemnt with MMTk: Lessons learned from replacing Ruby's Garbage Collector](), Angus Atkinson, linux.conf.au 2022.
* [Low Latency, High Throughput Garbage Collection](https://www.youtube.com/watch?v=1TLmawuxHfY), Wenyu Zhao.
* [MPLR 2020 Keynote](https://www.youtube.com/watch?v=3L6XEVaYAmU), Steve Blackburn.
* [Something Old, Something New: Memory Management today and looking forwards](https://www.youtube.com/watch?v=73djjTs4sew), Steve Blackburn. A talk given at Microsoft Research, 2016.

### Code

* [MMTk core](https://github.com/mmtk/mmtk-core)
* [MMTk Ruby bindings](https://github.com/mmtk/mmtk-ruby)
* [MMTk Nightly builder](https://github.com/Shopify/ruby-mmtk-builder)

### People

Thanks to Steve Blackburn and Kunshan Wang, both part of the MMTk team
at the Australian National University who are working on the Ruby/MMTk
integration.

Thanks to my wife, for letting me practice this talk at her, and helping me edit and tell a coherant story..

And thanks to Chris Seaton. He is missed.

* [Steve Blackburn](https://users.cecs.anu.edu.au/~steveb/).
* [Kunshan Wang](https://wks.github.io/).
* [Chris Seaton](https://chrisseaton.com/).

