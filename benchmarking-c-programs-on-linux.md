## Benchmarking C programs on linux

Here are some things to do to reduce variance when attempting to run benchmarks
on Linux.

## Use Bare metal

Avoid the overhead and complexity of a hypervisor, use an actual computer.

## Get the CPU clock stable

Set teh CPU performance governer to "Performance" to keep the cpu at the max
speed. On Fedora this can be done by installing the `kernel-tools` package
and then starting the `cpupower` service with the default config.

the thing you need in `/etc/sysconfig/cpupower` is

```
# See 'cpupower help' and cpupower(1) for more info
CPUPOWER_START_OPTS="frequency-set -g performance"
CPUPOWER_STOP_OPTS="frequency-set -g ondemand"
```

then the systemd job will do the right thing.

Also turn off turbo boost. On my Ryzen I can do that with:

```
echo 0 | sudo tee /sys/devices/system/cpu/cpufreq/boost
```

verify with

```
❯ cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor | uniq
performance
❯ sudo cat /sys/devices/system/cpu/cpu*/cpufreq/cpuinfo_cur_freq | uniq
3600000
```

## Isolate the benchmark to a single CPU

to avoid overhead from context switching. Do this using cgroups.

1. Install the cgroups cli tooling. It's in `libcgroups-tools` on Fedora.
2. Create a cgroup called `singlecpu` in the `cpuset` container: `sudo cgcreate
   -g cpuset:singlecpu`. This is going to create some files in `/sys/fs/cgroups/singlecpu`
3. Set the `cpus` param to only allow cpu 0: `sudo cgset -r cpuset.cpus=0 singlecpu`
4. Run the process in the cgroup: `sudo cgexec -g cpuset:singlecpu myprocess`

If you're trying to do something like benchmark a ruby program that requires a
lot of environment, one way of getting it into a cgroup is to run your shell
with `cgexec` and then work in that.

I did this with:

```
sudo cgexec -g cpuset:singlecpu sudo -umattvh fish
```

Note the nested sudo, otherwise fish will start in the root env.

## Disable ASLR

Address Space Layout Randomisation, is a kernel security feature that randomises
the memory space of each process. Good for security, bad for benchmarking
consistency because it'll completely change the cache performance.

```
echo 0 | tee /proc/sys/kernel/randomize_va_space
```

You can make the change permanent in sysctl too, but probably shouldn't, it's a
security risk.
