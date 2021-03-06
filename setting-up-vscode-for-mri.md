# Setting up VSCode for MRI development

## Spacing and indentation

MRI's spacing is a mix of tabs and spaces. We should indent using spaces (and
change the indentation of any lines we touch to spaces as per [this
issue](https://bugs.ruby-lang.org/issues/14246), the emacs major mode endorsed
by Matz and included in MRI has been updated to use spaces only).

I think the width that a tab character is considered to be is not consistent
across the codebase, a value of `8` is the most common, however generally an
indent level is 4 spaces (with 8 spaces automatically converted to a tab).

So we need to tell VSCode:

* Always indent with spaces.
* when you see a tab, treat it as 8 spaces.
* when the tab key is pressed, insert 4 spaces.

Do that by adding this to your `settings.json`

```javascript
"[c]": {
    "editor.tabSize": 8,
    "editor.insertSpaces": true,
    "editor.useTabStops": true,
    "editor.detectIndentation": false,
}
  ```

## Building

Building profiles in VSCode are controlled by profiles defined in the
`tasks.json` file within the workspace. Assuming your Ruby workspace is set up
following the conventions in the Ruby Hacking guide

```bash
  ruby
    ├── ruby
    │   └── <git checkout here>
    └── build
        └── <Makefile and other build root artifacts>
```

And you have this configuration in your projects `.vscode/tasks.json`

```javascript
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "makeMiniruby",
      "type": "shell",
      "command": "make -C ${workspaceRoot}/../build miniruby",
      "problemMatcher": [],
      "group": {
          "kind": "build",
          "isDefault": true
        }
    }
  ]
}
```

Then you can build `miniruby` with the default build command.

## Debugging

See [[debugging]]

We can use either `lldb` or `gdb` to debug `miniruby`. `lldb` is preferred on a
Mac as it comes with the XCode toolchain provided by Apple.

Ruby ships with a make task that runs `lldb ./miniruby -- ../ruby/test.rb` so we
just need to replicate this as a VSCode launch configuration.

Workspace launch configurations are stored in `.vscode/launch.json` within the
workspace directory.

Here is the launch configuration to run our `test.rb` script via `miniruby`
inside `lldb`

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "MINIRUBY - DEBUG",
            "type": "cppdbg",
            "request": "launch",
            "program": "${workspaceFolder}/../build/miniruby",
            "args": ["--", "../ruby/test.rb"],
            "stopAtEntry": false,
            "cwd": "${workspaceFolder}/../build",
            "environment": [],
            "externalConsole": false,
            "MIMode": "lldb",
            "preLaunchTask": "makeMiniruby",
            "setupCommands": [
            {
              "text": "command script import ../ruby/misc/lldb_cruby.py",
              "ignoreFailures": false
            }
        }
    ]
}
```

Interesting points:

- `preLaunchTask` - we set this to `makeMiniruby` which is the task we
  previously defined to build miniruby. This means that whenever we start a
  debugging session, VSCode will first make sure that our binary is up to date.
- `setupCommands` - this is specific to GDB and LLDB and provides a set of
  commands to load into the debugger before running our session.

## Intellisense

Mostly just works thanks to the C/C++ extensions. Although because of the way
that the ruby and build directories are laid out adding some entries to the
include path will help VSCode find all of your references, and stop it from
showing the red squigglies underneat some of the `#include` statements for
auto-generated files. Do that like this:

```
"includePath": [
    "${workspaceFolder}/**",
    "${workspaceFolder}/include/**",
    "${workspaceFolder}/internal/**",
    "${workspaceFolder}/../build"
],
```

[//begin]: # "Autogenerated link references for markdown compatibility"
[debugging]: debugging "Debugging"
[//end]: # "Autogenerated link references"