# Profiling

## gperftools
```
brew install gperftools graphviz
```

Then configure and make Ruby with the profiling library linked

```shell
begin
  set -lx LIBS '-lprofiler'
  set -lx cflags '-fno-omit-frame-pointer'
  set -lx LDFLAGS '-Wl,-no_pie'
  set -lx debugflags '-g'
  set -lx optflags '-O0'
  set -lx RUBY_DEVEL 'yes'
  ../ruby/configure --prefix=/Users/mattvh/src/ruby/install --disable-install-doc --with-openssl-dir=(brew --prefix)/opt/openssl
end
```

Once this has been done you can set the environment variable `CPUPROFILE` to a
file path in order to have the binary write profiling informatin to the file at
that path.

So to run our `test.rb` with `miniruby` and generate a profile we can do this

```
CPUPROFILE=./master.prof ./miniruby -I../ruby/lib -I. -I.ext/common   ../ruby/test.rb
```

Then you can use the `pprof` tool to inspect the results by passing in the
profile file and the compiled binary that generated the profile.

```
pprof ./miniruby ./master.prof
```

This will dump you into a `repl` where you can get various different kinds of
visualisations and outputs. You can pass args to the cli if you know what you
need.

```
   --text              Generate text report
   --stacks            Generate stack traces similar to the heap profiler (requires --text)
   --callgrind         Generate callgrind format to stdout
   --gv                Generate Postscript and display
   --evince            Generate PDF and display
   --web               Generate SVG and display
   --list=<regexp>     Generate source listing of matching routines
   --disasm=<regexp>   Generate disassembly of matching routines
   --symbols           Print demangled symbol names found at given addresses
   --dot               Generate DOT file to stdout
   --ps                Generate Postscript to stdout
   --pdf               Generate PDF to stdout
   --svg               Generate SVG to stdout
   --gif               Generate GIF to stdout
   --raw               Generate symbolized pprof data (useful with remote fetch)
   --collapsed         Generate collapsed stacks for building flame graphs
                       (see http://www.brendangregg.com/flamegraphs.html)
```

## Coz the causal profiler

Install in Ubuntu - clone from master, the packaged one is old.

Follow the instructions in the readme except:

```
CXXFLAGS=-D_GLIBCXX_USE_CXX11_ABI=0 cmake ..
```

also make sure to change the permissions for `perf`

```
sudo sh -c "echo 2 > /proc/sys/kernel/perf_event_paranoid "
```

Then: compile Ruby with:

```
export debugflags='-ggdb3'
export optflags='-O3 -DRGENGC_CHECK_MODE=0 -DRGENGC_DEBUG=0 -DVM_CHECK_MODE=0'
export cppflags="-DUSE_RVARGC=0 -ldl"
```

Also don't enable shared libraries or Coz won't be able to find your code.

Then use the macros `COZ_PROGRESS`, `COZ_PROGRESS_NAMED` to measure throughput and `COZ_BEGIN`, `COZ_END` to measure latency.

Run like

```
coz run -s "%gc.c" --- $HOME/.rubies/rvargc/bin/ruby bin/bench
```

The `-s` restricts the coz testing to only one file, `%` is a wildcard.

This generates a `profile.coz`. Drop that file into [https://plasma-umass.org/coz/]

