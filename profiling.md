# Profiling

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
