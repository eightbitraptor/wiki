## Building Ruby

Lots of good resources into how we can build Ruby in [Koichi's Ruby Hack
challenge](https://github.com/ko1/rubyhackchallenge).

A previous version of this page advocated for splitting the Ruby working tree
into several different directories, one for source code, one for build artifacts
and one for installed binaries in the same way as the Ruby hack challenge does.
Personally, I found this too complex to work with on a day to day basis,
preferring instead to just push everything into the same directory.

Here are some pros and cons I've found of using a unified build directory:

**Pros**:

* Editors have a better time - some necessary files are generated at compile
  time, headers and suchlike. Generally, having everything in the same tree
  makes things easier for editors to find and integrating features like error
  detection, code completion and jumping between tags is easier
* Building is a simpler process - No more running `./configure` in the wrong
  directory by accident!

**Cons**

* Sometimes you can get into an inconsistent state, when `make clean` doesn't
  clean up everything you expect it to and subsequent compilations don't give
  the results you expect.

Realistically there isn't much in it. I don't like configuring editors all that
much so the pros of a single tree outweigh the cons for me. And I've found that
the main con can be easily worked around with the liberal use of `make
distclean` or `git clean -fdx`

## Getting the build structure ready

Simples: for me this looks like this...

```
cd src
git clone git@github.com/ruby/ruby.git
cd ruby
```

Then build:

* ~~run `autoconf`~~. Don't use `autoconf` it's too low level and may not always do what you expect. Instead either use `./autogen.sh` or call `autoreconf --install` (which is basically what `autogen.sh` does anyway). `autoreconf` wraps `autogen` and some of the other `auto*` tools
* `./configure --enable-shared --with-openssl-dir="$(brew --prefix openssl)" --with-readline-dir="$(brew --prefix readline)" --disable-libedit`

### Alternative `configure`

Aaron recommended doing:

```shell
begin
  set -lx debugflags '-g'
  set -lx optflags '-O0'
  set -lx RUBY_DEVEL 'yes'
  ./configure --prefix=~../install --disable-install-doc --with-openssl-dir=(brew --prefix)/opt/openssl
end
```

This is [Fish shell syntax](https://fishshell.com), which is what I use. YMMV
for other shells but you may be able to get away with swapping the `set -lx`
commands for `export`

This will make sure that every time Ruby builds either itself or any of the
included gems it always builds with:

* `-g` include debug symbols - needed for C function labelling and decent
  debugger context (otherwise `lldb` just shows you assembly). You can
* `-O0` minimal optimisations - this is needed to make sure that `cmake` doesn't
  optimise out any local variables or useful information that you can use while
  debugging.
* `RUBY_DEVEL` enabled - I don't actually know what this does yet.
* `--enable-shared` has been removed. Omitting this flag will mean that Ruby
  gets built as one big statically linked binary instead of a small binary and a
  larger shared library. This makes debugging easier because it will make
  following code through the stacktrace easier. Make sure to enable shared
  libraries when doing benchmarking, as this is how Ruby is compiled for release
  builds.

It's also possible to compile without this and then edit the generated
`Makefile`, but this doesn't apply these to any gems that are built - just the
main `miniruby` and `ruby` binaries. Which can be a pain.

The above `configure` commands are for building on a Mac where we have to
workaround the Apple/Homebrew OpenSSL situation. These days I do almost all of
my dev on a Linux box where you can omit the `--with-openssl-dir` flag.

## Configuring multiple targets

Generally I alias the snippet above to a function in fish shell so I can have
different combinations of compile flags and install targets for different
branches.

Here is the function I use to configure a default development version, when I
want as near to standard settings as possible (but making debugging easier).

```
function configure-main
  set -lx debugflags '-ggdb3'
  set -lx optflags '-O0'
  set -lx RUBY_DEVEL 'yes'
  ./configure --prefix=$HOME/.rbenv/versions/main --disable-install-doc
end
```

I am working on a feature that requires some extra build flags, so I use a seperate command to build for that case

```
function configure-rvargc
  set -lx debugflags '-ggdb3'
  set -lx optflags '-O0'
  set -lx RUBY_DEVEL 'yes'
  set -lx cflags '-DUSE_RVARGC=1'
  ./configure --prefix=$HOME/.rbenv/versions/rvargc --disable-install-doc
end
```

Note the different `prefix` locations, so I can `make install` and switch
between two rubies that are built identically other than the presence of my
feature flag.

## Building and installing

First find out how many working cpu's you've got

On Linux that's done with `nproc`:

```
~/src/ruby master ≡ mattvh@deunan
❯ nproc --all
12
```

on a Mac you can use `sysctl`

```
~/src/ruby master ≡ mattvh@kyouko
❯ sysctl -n hw.activecpu
12
```

A good general rule of thumb is to tell make to use `cpu_count + 1` threads
using the `-j` flag. You *can* run `make -j` without a specific number but I
don't because it can make things slower. Here's a quote from [Managing Projects
with GNU Make 3rd Edition
(O'Reilly)](https://www.oreilly.com/library/view/managing-projects-with/0596006101/)

> The `--jobs` option can be used without a number. If so, make will spawn as
> many jobs as there are targets to be updated. This is usually a bad idea,
> because a large number of jobs will usually swamp a processor and can run much
> slower than even a single job.

Then build Ruby and install it to your prefix:

- `make -j13 && make install`

This will build and install `ruby`, `irb`, `gem`, `bundler` et al and dump them
in your configured install directory. This takes time (rougly 5 minutes on my
work MacBook Pro, longer on my personal Surface Pro).

## Alternative `make` targets that are useful

* `make miniruby` - Useful when you just need core ruby, doesn't build gems or stdlib, you can't use `require` but it's really fast so useful for a quick feedback loop. I use this all the time when working on GC stuff.
* `make` - the default target, builds `ruby` binary
* `make prepare-gems` - installs the default set of gems that are built with ruby into the current build path (running the full test suite requires this)
* `make clean` - cleans up all the build artifacts. Use this when making changes to configure flags that affect the core binaries. This doesn't clean up the `./configure` script itself, or any artifacts created by `configure`, so you can just `make` again to build from scratch
* `make distclean` - cleans up all artifacts created by configure and by make. if you get into an odd situation with build flags or weird `make` behaviour, generally this is a good way out. You'll need to `./configure` again because this will clean up the generated `Makefile`

Once Ruby/miniruby is built you should be good to start development. See

* [[running-tests]]
* [[debugging]]

[//begin]: # "Autogenerated link references for markdown compatibility"
[running-tests]: running-tests "Running Tests"
[debugging]: debugging "debugging"
[//end]: # "Autogenerated link references"
