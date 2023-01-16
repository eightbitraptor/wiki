# MMTk

MMTk starts in `rb_objspace_alloc` in gc.c. Weirdly it initialises the builder
object after the call to `calloc` to allocate Ruby's objectspace. I thought mmtk
was managing allocations - so what's `objspace` used for here?

All the functions in `mmtk.h` are part of the MMTk Ruby binding layer. the
mmtk.h headers are autogenerated using `cbindgen` from the binding project
`mmtk-ruby`.

it uses an `MMTk_Builder` type (defined in `mmtk.h` as a `typedef void *`),
which it creates using `mmtk_builder_default` (again, defined in `mmtk.h`).

It then does a few things

- `mmtk_builder_set_plan` (NoGC, or MarkSweep at the moment)
- sets the heap limit on the builder (either dynamic or fixed depending on the
  results of `rb_mmtk_heap_limit`)
- `mmtk_init_binding` (not sure what this does yet).

## `mmtk_builder_default`

This is defined in `lib/api.rs` inside the Ruby bindings and creates a reference
to an `MMTKBuilder` object (using `Box`), which it then converts into a raw pointer.

`MMTkBuilder` is a Rust struct in mmtk core (`lib/mmtk.rs`). It contains a single
public member options, which is of type Options (this looks like just a
collection of interesting options like which plan we're using, the number of
threads we're allowed, and some default settings, I'm going to ignore this for
now and assume there's no magic going on in here).

MMTkBuilder has an `impl Default` - which defines a `default` function, all this
does is call `new` on the default impl. `new` just creats a struct of
`MMTkBuilder`, with a default `Options` instance - so not much interesting happening
here.

## `mmtk_builder_set_plan`

This is again in the Ruby binding layer `lib/api.rs`. This reads the plan name
we set from the command line option (`NoGC` or `MarkSweep`), and does what looks
like a constant lookup based on the name

```
let plan_selector: PlanSelector = plan_name_str.parse::<PlanSelector>().unwrap();
```

_butterfly meme:_ is this metaprogramming?

then it just assigns the plan name to the options in the `MMTk_Builder` object that we built.

## `rb_mmtk_heap_limit`

This is fully implemented inside Ruby - specifically in `gc.c`

switches on `mmtk_max_heap_size`. where is this from - this can be passed in
using `--mmtk-make-heap` at runtime, otherwise it's 0.

Ok, so basically - if we've defined a fixed heap size, either using the command
line argument or the environment variable `THIRD_PARTY_HEAP_LIMIT` then we set
`is_dynamic_heap` to false, and we calculate the min and the max sizes.

max size is calculated using `rb_mmtk_parse_heap_limit` - this is basically just
trying to convert the string that was passed in, to a size_t.

if nothing was passed then `is_dynamic_heap` is set to `true`. At this point min and
max are set to the default values (10Mb and 80% of the computers physical memory
respectively)

## `mmtk_builder_set_{dynamic,fixed}_heap_size`

These are functions in the ruby binding layer that set a gc_trigger on the
options inside the builder

These use a struct called `GCTriggerSelector::FixedHeapSize` and `DynamicHeapSize`
respectively.

All this stuff is essentially just setting options on the Ruby heap though -
where is the actual heap allocation happening?

## `mmtk_init_binding`

this function consumes the `MMTk_Builder` object - but it's return void. so what's
happening - does it replace the target of the pointer? it's defined in the Ruby
binding layer.

This function takes the pointer to the builder, as well as some binding options
and a static C struct of function pointers called upcalls (which is a Rust type
that's abi bound to a C struct defined in gc.c)

Ruby upcalls contains function pointers to init gc worker threads, stop the
world, block and resume mutators. It looks like this is where most of the actual
work is triggered from. All these functions are defined inside gc.c.

it calls mmtk_init to return a boxed `MMTK<Ruby>` instance - what is this? and
also `mmtk_static` which is a mutable pointer to the boxed MMTk Ruby instance
(created using `Box::leak` - as per the comments in `memory_manager.rs` we use
leak here to give the boxed MMTk pointer a static lifetime rather than a
lifetime that is bound to the box pointer).

It then builds a `RubyBinding` with the static instance, the options and a borrow
of the upcalls. and does something with `OnceCell` with that binding.

it returns `()`. So something must be happening with this line of code to give
Ruby access back to the RubyBinding

```
    crate::BINDING
        .set(binding)
        .unwrap_or_else(|_| panic!("Binding is already initialized"));
```

Ok. so BINDING is a pub static OnceCell inside the mmtk ruby bindings. This
makes it a singleton object. publicly accessible and can be assigned to at most
once. But how is this exposed? is it in mmtk.h in the ruby project?

actually does this even need to be exposed to the Ruby side. This is probably
just an MMTk object that's used within the binding and MMTk core right?

Ok, so BINDING is a global, and we set an instance of the Ruby Binding into it,
and then unwrap it because reasons.

## mmtk_init

Ok, so now we know how the builder is initialized and builds an MMTk instance we
should look into how the MMTk system is actually being initialized.

First, this function takes a parameter, which is an immutable borrow of the
builder object, and it returns a boxed pointer of MMTk<RubyBinding>

RubyBinding is an object that wraps the MMTk instance, the binding options, the
upcalls and the plan name - the VMBinding trait.

VMBinding's job seems to be to define some generic types for the binding, in
this case it only really seems to care about VMEdge (type aliased to RubyEdge),
and VMMemorySlice (type aliased to RubyMemorySlice).

RubyEdge according to the comments, doesn't really matter right now as we don't
do edge enqueing (whatever that means). and Ruby memory slice is actually just
another type alias for UnimplementedMemorySlice.

aside from some logger shenanigans, this just calls back into builder.build and
then boxes the result.

## MMTKBuilder::build

straight up does MMTK::new passing in a reference counted clone of the options
struct (using Arc).

## MMTK::new

Ok, now we're getting somewhere.

firstly, what is SFT_MAP? Apparently it mamages the SFT Table, but what is the
SFTTable? Ok - apparently the sft is defined inside mmtk-core. It's something to
do with space specific dynamic dispatch.... I'm just going to ignore this for
now and hope it's not important yet. Good start

