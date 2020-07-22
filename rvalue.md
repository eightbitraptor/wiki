# Rvalue

* RVALUE - struct that holds a Ruby object 40 bytes wide.
  * Every value in teh Ruby type union has it's first value as an object of
    RBasic, which contains information about the type of the RVALUE. I'm
    guessing that this is always in the same place in memory. and that's how we
    know what each RVALUE is representing
  * unions loads of things together
    * A struct containing flags, and a pointer to an RVALUE called `next`. I
      don't know what this is yet
    * all possible ruby types
    * a union of all internal types not represented by Ruby ojects (imemo) is
      also part of the original union
        * vm_svar
        * vm_throw_data
        * vm_ifunc
        * MEMO
        * rb_method_entry_struct
        * rb_iseq_t
        * rb_env_t
        * rb_imemo_tmpbuf_struct
        * rb_ast_t
    * a struct called `values`, it contains 3 `VALUES` (`v1`, `v2`, and `v3`)
      and an RBasic struct. I have no idea what this is for - apparently this is used for initializing a generic `RVALUE`
    * If `GC_DEBUG` is turned on then we also store a link to a file and a line.
      This is the file and the line where the object was created. which it
      prints to  stdout when marking.