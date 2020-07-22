# Current Todo List

## Allocate Garbage

- [X] Vault project update
- [X] Fix Warning: vm_eval.c:545:13: warning: enumeration value 'RUBY_T_GARBAGE'
  not handled in switch [-Wswitch]
- [X] Fix Warning: gc.c:2223:17: warning: incompatible pointer to integer
  conversion assigning to 'VALUE' (aka 'unsigned long') from 'void *'
- [ ] gc.c:2207:30: warning: comparison of integers of different signs:
  'unsigned long' and 'short' [-Wsign-compare]
- [ ] Fix Segfault: When `GC.compact` run from `test.rb`
- [ ] Fix Segfault: When `RGENGC_CHECK_MODE` is enabled we get corrupted object

## GC during boot bug

- [ ] Investigate test failures when rebased on master
- [ ] Feedback from Aaron

### Notes on current bug (21/07/2020)

gc.c: 6332

data.live_object_count is the analysis of the heap. we walk all the heap pages counting which ones are live (side note, objects with finalizers are treated seperately because we can't guarantee whether they're free or live or what yet)

objspace_live_slots: this is the cached values in the gc objspace of what's been allocated and deallocated,

These things should always be the same.
