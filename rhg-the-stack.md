# Ruby Hacking Guide - The Stack

the machine stack is where arguments to functions and local variables for
functions are stored.

A stac is a data structure that is only accessible at one end. items are pushed
onto one end and pulled out of the same end. This makes it a LIFO data structure
(Last In First Out) - imagine a pile of papers in an in tray.

Each entry on the stack is called a `stack frame`, and each frame contains
information corresponding to one function call. The function that is currently
executing is always at the top of the stack.

Or:
  - when a C function is called, a frame (containing the name of the function
    and the arguments passed to that function) is pushed onto the stack.
  - when a C function returns, a frame is `popped` (removed) from the top of the
    stack.

We talk about the stack having a 'top' and a 'bottom', this may (or may not)
correspond to memory addresses. For instance the stack on the x86 architecture
is a "head down" stack. Which means the bottom of the stack has the highest
memory address and it grows downwards.

We can allocate arbitrary amounts of memory in the stack using the `alloca`
funtion (although the internet tells me that this is no longer recommended).
This allocates memory that is automatically freed when the function returns
(because of how the stack works).

Because `alloca` is non standard some environments reimplement it. Ruby does
this in the file `missing/alloca.c`

