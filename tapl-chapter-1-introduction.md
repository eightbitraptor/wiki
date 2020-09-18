# TAPL Chapter 1: Introduction

- Type systems are a lightweight formal method for ensuring the correctness of a
  program

> A type system is a tractable syntactic method for proving the absense of
> certain program behaviours by classifying phrases according to the kinds of
> values they compute

Types systems were first formalised in the 1900's as a way of avoiding logical
paradoxes in mathematics.

**Sidenote**: Bertrand Russels paradox is to do with the definition of naive set
theory. Naive set theory states that any definable collection is a set. the
Contradiction arises when you define the set R to be the set of all sets that
are not members of themselves. If R is not a member of itself, then it must
contain itself, by definition, and if it contains itself, then it doesn't match
its own definition

```
R = { x | x ∉ x }, then R ∈ R ⟺ R ∉ R
```

- A type system can be thought of as creating a compile time approximation of
  the run time behaviour of the program.
- The word 'static' is often added explicitly to distinguish compile time
  analysis, from the latent typing found in languages such as scheme
- Type systems are conservative, they can prove the absence of some bad
  behaviour but cannot prove their presence, and hence must sometimes reject
  programs that behave well at run time

- Language Safety
  - contentious topic
  - a safe language is one that protects its own abstractions
  - examples: an array can only be changed by updating it explicitly, not by
    running off the end of some other memory. or variables can only be addressed
    within their scopes. A safe language makes these guarantees, an unsafe one
    does not
  - this means that unsafe languages are not technically type safe, even when
    statically typed (like C and C++), because they can't provide any guarantees
    that well typed programs are well behaved. It's more of a "best effort" type
    check.
  - Interesting aside: even statically checked safe languages do array bounds
    checking dynamically, static bounds checking is a long term goal of type
    systems designers.
  - "A safe language is completely defined by its programmer's manual" - Love
    this. if the definition is everything a programmer needs to predict the
    behaviour of any program written in the language, then the manual for C
    doesn't constitute a definition, because it won't allow you to determine
    what happens if a program does unchecked array access - the behaviour of
    this program is dependant on the memory layout, which is an implementation
    detail of the compiler.

