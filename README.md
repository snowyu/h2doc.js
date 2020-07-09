# h2doc

Prcocess html to a specified format document.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/h2doc.svg)](https://npmjs.org/package/h2doc)
[![Downloads/week](https://img.shields.io/npm/dw/h2doc.svg)](https://npmjs.org/package/h2doc)
[![License](https://img.shields.io/npm/l/h2doc.svg)](https://github.com/snowyu/h2doc/blob/master/package.json)

<!-- toc -->

- [h2doc](#h2doc)
- [Features](#features)
- [Usage](#usage)
  - [Configuaration](#configuaration)
- [Commands](#commands)
  - [`h2doc autocomplete [SHELL]`](#h2doc-autocomplete-shell)
  - [`h2doc help [COMMAND]`](#h2doc-help-command)
  - [`h2doc server [DIR]`](#h2doc-server-dir)
  - [`h2doc tags FOLDER`](#h2doc-tags-folder)
  <!-- tocstop -->

# Features

- Save markdown and pics to the current(specified) folder(`root`)
- decides the rules for stored file name and dir name:
  1. markdown file with the same makrdown name folder
     - markdown file: `${folder}/${title}.md`
     - markdown assets folder: `${folder}/${title}/`
     - markdown assets base file name: `${assetBaseName}`
  2. markdown name folder, index(README).md as markdown name in folder
     - markdown file: `${folder}/${title}/index.md`
     - markdown assets folder: `${folder}/${title}/`
     - markdown assets base file name: `${assetBaseName}`
  - you can customize by youself

* `folder`: the relative to `root` directory (coming from Joplin Web Clipper)
* `title`: (come from Joplin Web Clipper)
* `assetBaseName`: the name should not include the `extname`.
* `date`: the ISO format date time.
* `index`: the index number of asset.
* `slug` : the smart slug of the title.
* `shortid()`: return the short unique id.
* `toSlug(str)`: convert the str to a smart slug.

# Usage

<!-- usage -->

```sh-session
$ npm install -g h2doc
$ h2doc COMMAND
running command...
$ h2doc (-v|--version|version)
h2doc/0.0.3 linux-x64 node-v12.18.2
$ h2doc --help [COMMAND]
USAGE
  $ h2doc COMMAND
...
```

<!-- usagestop -->

## Configuaration

The config file name could be `.md-config.(yaml|json)` or `md-config.(yaml|json)`.

The config file search order:

1. ./.md-config.(yaml|json)
2. ~/.md-config.(yaml|json)
3. \$APP/config/.md-config.(yaml|json)

````yml
output:
  root: . # the root folder, defaults to current working directory.
  exclude:
    - node_modules
  deep: 5 # Specifies the maximum depth of a read directory relative to the root.
  markdown: ${folder}/${title}.md # whether use the smart slug as markdown file name
  asset: ${folder}/${title}/
  assetBaseName: ${assetBaseName} # do not include extname
slug: # the smart slug options, if it is string which means separator
  separator: '-' # String to replace whitespace with, defaults to -
  lang: '' # ISO 639-1 two-letter language code, defaults to auto-detected language
  tone: false # add tone numbers to Pinyin transliteration of Chinese, defaults to true
  separateNumbers: false # separate numbers that are within a word, defaults to false
  maintainCase: false # maintain the original string's casing, defaults to false
download: true # whether download assets
format: # WARNING: these options maybe changed in the future
  headingStyle: 'atx' # setext or atx
  hr: '---'
  bulletListMarker: '*'
  codeBlockStyle: 'fenced' # indented or fenced
  fence: '```' # ``` or ~~~
  emDelimiter: '_' # _ or *
  strongDelimiter: '**' # ** or __
  linkStyle: 'inlined' # inlined or referenced
  linkReferenceStyle: 'full' # full, collapsed, or shortcut
  gfw:
    strikethrough: true # for converting <strike>, <s>, and <del> elements
    tables: true
    taskListItems: true
frontMatter: # whether use front matter(insert into markdown).
  title: true
  url: true
  author: true
  date: true
  publisher: true
  lang: true
  description: true
  image: true
  video: true
  audio: true
````

# Commands

<!-- commands -->

- [`h2doc autocomplete [SHELL]`](#h2doc-autocomplete-shell)
- [`h2doc help [COMMAND]`](#h2doc-help-command)
- [`h2doc server [DIR]`](#h2doc-server-dir)
- [`h2doc tags FOLDER`](#h2doc-tags-folder)

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

## `h2doc server [DIR]`

The Joplin Web Clipper Server to save markdown and images

```
USAGE
  $ h2doc server [DIR]

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

_See code: [src/oclif/commands/server.ts](https://github.com/snowyu/h2doc/blob/v0.0.3/src/oclif/commands/server.ts)_

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

_See code: [src/oclif/commands/tags.ts](https://github.com/snowyu/h2doc/blob/v0.0.3/src/oclif/commands/tags.ts)_

<!-- commandsstop -->
