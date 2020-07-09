# h2doc

html to document

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/h2doc.svg)](https://npmjs.org/package/h2doc)
[![Downloads/week](https://img.shields.io/npm/dw/h2doc.svg)](https://npmjs.org/package/h2doc)
[![License](https://img.shields.io/npm/l/h2doc.svg)](https://github.com/snowyu/h2doc/blob/master/package.json)

<!-- toc -->
* [h2doc](#h2doc)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g h2doc
$ h2doc COMMAND
running command...
$ h2doc (-v|--version|version)
h2doc/0.0.2 linux-x64 node-v12.18.2
$ h2doc --help [COMMAND]
USAGE
  $ h2doc COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`h2doc autocomplete [SHELL]`](#h2doc-autocomplete-shell)
* [`h2doc download URL`](#h2doc-download-url)
* [`h2doc help [COMMAND]`](#h2doc-help-command)
* [`h2doc markdown URL|FILE [SECOND URL|FILE] [...]`](#h2doc-markdown-urlfile-second-urlfile-)
* [`h2doc sever [DIR]`](#h2doc-sever-dir)
* [`h2doc tags FOLDER`](#h2doc-tags-folder)

## `h2doc autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ h2doc autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ h2doc autocomplete
  $ h2doc autocomplete bash
  $ h2doc autocomplete zsh
  $ h2doc autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.2.0/src/commands/autocomplete/index.ts)_

## `h2doc download URL`

download html from a url only

```
USAGE
  $ h2doc download URL

ARGUMENTS
  URL  the html url or file to be processed

OPTIONS
  -f, --[no-]force            defaults to overwrite existing files
  -h, --help                  show CLI help
  -t, --format=markdown|html  [default: markdown] the converted format
```

_See code: [src/oclif/commands/download.ts](https://github.com/snowyu/h2doc/blob/v0.0.2/src/oclif/commands/download.ts)_

## `h2doc help [COMMAND]`

display help for h2doc

```
USAGE
  $ h2doc help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_

## `h2doc markdown URL|FILE [SECOND URL|FILE] [...]`

process html url or file and convert to markdown format and save the images

```
USAGE
  $ h2doc markdown URL|FILE [SECOND URL|FILE] [...]

ARGUMENTS
  URL|FILE         the html url or file to be processed
  SECOND URL|FILE
  ...

OPTIONS
  -h, --help           show CLI help
  -o, --output=output  [default: .] the folder to output, defaults to current dir

ALIASES
  $ h2doc md
```

_See code: [src/oclif/commands/markdown.ts](https://github.com/snowyu/h2doc/blob/v0.0.2/src/oclif/commands/markdown.ts)_

## `h2doc sever [DIR]`

The Joplin Web Clipper Server to save markdown and images

```
USAGE
  $ h2doc sever [DIR]

ARGUMENTS
  DIR  [default: .] which folder to save

OPTIONS
  -h, --help       show CLI help
  -h, --host=host  [default: localhost] the host to serve
  -p, --port=port  [default: 41184] the port to serve

DESCRIPTION


ALIASES
  $ h2doc default
  $ h2doc srv
  $ h2doc svr
```

_See code: [src/oclif/commands/sever.ts](https://github.com/snowyu/h2doc/blob/v0.0.2/src/oclif/commands/sever.ts)_

## `h2doc tags FOLDER`

collect all tags from the front-matter in the folder and save to file

```
USAGE
  $ h2doc tags FOLDER

ARGUMENTS
  FOLDER  [default: .] the folder to collect tags, defaults to the current directory

OPTIONS
  -c, --cache=cache       [default: .md-tags.yaml] cache all the tags in the folder to the file
  -h, --help              show CLI help
  -s, --skip              skip the cache file
  -t, --format=yaml|json  [default: yaml] the display tags format
  -w, --write             write to the cache file
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [src/oclif/commands/tags.ts](https://github.com/snowyu/h2doc/blob/v0.0.2/src/oclif/commands/tags.ts)_
<!-- commandsstop -->
