# TAPL Chapter 5 The Untyped Lambda Calculus

## Part 1: Basics

- Also known as the pure Lambda Calculus.
- most of the type systems in tapl are based on this. it is the underlying
  "computational substrate" as the book puts it.
- A formal system where all of computation is reduced to the basdic operations
  of function definition and application.
- It can be seen as both a simple programming language in which computations can
  be described _and_ as a mathematical object about which rigorous statements
  can be proved.
- Is one of many different types of Calculus.

*Q* This chapter seems to imply that Haskell, ML and Scheme are all direct
descendents of the LC. In that we can just layer certain abstractions (like
numbers, tuples etc) over the top of the raw implementation in LC and we'd end
up with these languages. Is this true? Does this extrapolate to most functional
languages, are they all just varying complexity implementatins of LC?

λ is shorthand for a function.

Take for example a factorial functin:

```
int factorial(int n) {
  if (n == 0) return 1;
  return (n * factorial(n-1));
}
```

we can express this as:

```
factorial = λn. if n=0 then 1 else n * factorial(n-1)
```

generally `λn.body` should be read as

> the function that, for each n yields body

the λ-calculus is basically this kind of function definition taken to it's
logical conclusion. ie. everything is a function, arguments, functions, the
results returned by functions are also functions etc.

The syntax only comprises 3 terms

```
t ::=
  x         # variable
  λx.t      # abstration
  t t       # application
```

Programming languages have two levels of structure:

- *concrete syntax* The syntax that we read and write
- *abstract syntax* the internal representation of a program as a labeled tree.

<div class="mermaid">
graph LR
A(concrete syntax) --> B[Lexer]
B -- tokens --> C[Parser]
C --> D(AST)
</div>

There's a really nice example about how AST's can represent programs more simply
than concrete syntax because things like operator precedence don't have to be
explicitly specified in trees.

The expression `1 + 2 * 3` can be considered ambiguous unless you know operator
precedence rules. In most languages `*` binds tighter than `+`. Which means that
this expression can only expand to one tree.

```
  +
 / \
1   *
   / \
  2   3
```

Trees are resolved from the bottom up, so we need to calculate `2*3` before we
can calculate `1 + 6`.

We adopt conventions when writing lambda expressions:

1. application associates to the left. ie.
   ```
   s t u == ((s t) u)
   ```
   and is the linear representation of the following tree:
   ```
       λ
      / \
     λ   u
    / \
   s   t
   ```

2. the bodies of abstractions are taken to extend as far to the right as
   possible. So treat the parens like greedy regexps basically:

   ```
   λx. λy. x y x == λx. (λy. ((x y) x))
                 != λx. (λy. (x)) y x
   ```

**Scope**: bound variables are variables used in the body of an abstraction,
free variables are not enclosed by an abstraction.

We can say that, for `λx. t`: `λx` is a _binder_ whose scope is `t`.

An occurance of `x` is free if it is not bound by an enclosing abstraction on
`x`

```
λx. x y
    ^ ^
    | free
    bound
 ```

A term with no free variables is said to be closed.

A term with no free variables is _closed_. A closed term is also called a
**combinator**. The simplest one is the **identity function** a function that
when called returns its argument.

```
id = λx. x;
```

**Operational Semantics**: The only way we can compute terms is by applying
functions to arguments. This can be broken down to a series of steps where each
step means _substituting the right hand component for the bound variable in the
abstractions body._

This is written as

```
(λx. t1) t2 ⟶ [x ⟼ t2]t1
```

Apparently `[x ⟼ t2]t1` means **the term obtained by replacing all free
occurrences of x in t1 by t2`

Any term that can be reduced like this is called a **redux**. and reducing it
(like we've just done) is called **beta-reduction**

a term that cannot be reduced any further is called a **value**

Better example:

```
(λx. x (λx.x)) (u r) # => u r (λx.x)
```

A good way to think about this is similar to Ruby lambdas, so `λx.x` is
equivalent to `-> (x) { x}`, and the `(u r)` bit is equivalent to `.call(u r)`

so if you had the lambda

```
-> x { x * (x + 1) }.call(42)
```
Then you can think of that "reducing" to

```
42 * (42 + 1)
```

because the function definition, and the calling of the function kind of cancel
each other out.

There are different strategies for how to choose which reductions to carry out
on each step of the evaluation.

- full beta-reduction
- normal order strategy
- call by name
- call by value

This book uses **call by value** as that's the semantics that most programming
languages use (except Haskell which is a variation on call by name).

**Call by value**:
- only outermost reduxes are reduced, and
- a redux is only reduced when it's RHS has already been reduced to a value

Example:

```
(λx.x) ((λx.x) (λz.(λx.x) z)) # => replacing the identity function with id:
id (id (λz. id z))
```

This contains 3 reduxes (terms that can be reduced), the whole term, the sub
term `(id (λz. id z))` and the sub term of that `id (λz. z)`

So using our rules above. We have to reduce the RHS to a value before we can
reduce the whole redux. So, the first redux we can reduce is `(id (λz. id z))`.

This reduces to: `λz. id z` (because we're calling the identity function with
the argument `λz. id z` and the identity function just returns the argument).

The next reduction we can do is to reduce `(id (λz. id z))`.

The book says that this reduces down to `λz. id z` but I can't work out why
based on the rules defined above.

I can't see how we have reduced any of the right hand terms down to values yet...