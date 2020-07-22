# Vim Buffer Management

## Turn on sane buffer management

By default Vim unloads a buffer from memory when you load another buffer. This
is why if you try and edit another file when you have unsaved changes it prompts
you to save them. This unloading also throws away undo history which is annoying.

Make vim hide buffers rather than closing them with

```vimscript
set hidden
```
## Bufkill

This is a plugin that makes working with multiple buffers easier. You can delete
buffers whilst keeping their window open (useful when you're using split
windows).

```vimscript
Plug 'vim-scripts/bufkill.vim'
```

It'll still close your window when you close the last buffer in the list though. Change this with:

## Scratch

```vimscript
Plug 'vim-scripts/scratch.vim'
```

This introduces a scratch buffer, an ephemeral buffer that's not associated with
a file where you can dump notes and stuff. It will get thrown away when Vim is
closed.

Now when you kill the last buffer you will always just switch to the scratch
buffer instead of exiting vim.

## toggle between two most recent buffers

by double tapping `,`

```vimscript
noremap ,, <c-^>
```