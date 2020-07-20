# Current Todo List

## Allocate Garbage

- [X] Vault project update
- [X] Fix Warning: vm_eval.c:545:13: warning: enumeration value 'RUBY_T_GARBAGE'
  not handled in switch [-Wswitch]
- [**X**] Fix Warning: gc.c:2223:17: warning: incompatible pointer to integer
  conversion assigning to 'VALUE' (aka 'unsigned long') from 'void *'
- [ ] gc.c:2207:30: warning: comparison of integers of different signs:
  'unsigned long' and 'short' [-Wsign-compare]
- [ ] Fix Segfault: When `GC.compact` run from `test.rb`
- [ ] Fix Segfault: When `RGENGC_CHECK_MODE` is enabled we get corrupted object

## GC during boot bug

- [ ] Investigate test failures when rebased on master
- [ ] Feedback from Aaron