# Vim Tags and Navigation

## fzf

I use `fzf` for navigating around between files. Install the binary and the
plugin with:

```vimscript
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'
```

Then configure some keybindings

```vimscript
nnoremap <leader>f :Files<CR>
nnoremap <leader>o :Buffers<CR>
nnoremap <leader>l :Lines<CR>
nnoremap <leader>ta :Tags<CR>
```

- Files: fuzzy match against filenames in the project
- Buffers: fuzzy match against all your open buffers (see [[vim-buffer-management]])
- Lines: jump to line in the current file (with preview)
- Tags: fuzzy match against ctags in the current project

the first time you try to view tags fzf will prompt you to create a tags file
using ctags. If you don't have `ctags` available this will fail.

Get ctags somehow. On my mac I do this:

```
brew install ctags
```

Jump to the tag under the cursor with `Ctrl-]`. Jump back with `Ctrl-o`

## tagbar

```vimscript
Plug 'majutsushi/tagbar'

noremap <leader>tt :TagbarToggle<CR>
```

This opens up a split on the right hand side that lists all the tags in the
current file ordered by type. hit return on one to jump to that tag in the main
file.

## Nerd tree

Sometimes you want to just see the directory structure.

```vimscript
Plug 'scrooloose/nerdtree'

nnoremap <leader>n <ESC>:NERDTreeToggle<cr>
```

now `<leader>n` will open up a file browser in the left hand side of hte window
like basically every other text editor ever.





[//begin]: # "Autogenerated link references for markdown compatibility"
[vim-buffer-management]: vim-buffer-management "Vim Buffer Management"
[//end]: # "Autogenerated link references"