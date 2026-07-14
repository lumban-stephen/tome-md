# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-07-14

### Added

- Cross-file navigation: relative `.md`/`.markdown` links in rendered
  documents now open in place instead of doing a full page reload, with
  browser back/forward support. Navigation is restricted to files within
  the directory of the file Tome was opened with.
- File tree rendering: fenced code blocks containing `tree`-style ASCII
  output are now detected and rendered as a proper nested file tree with
  folder/file icons instead of a plain code block.
- Live reload now watches the entire directory of the opened file, so
  edits to any linked document trigger a refresh, not just the initial file.

## [0.1.0] - 2026-07-10

### Added

- Initial Tome MVP: local Markdown viewer with page and scroll reading
  modes, light/dark/system themes, GitHub-flavored Markdown, Shiki syntax
  highlighting, and live reload.

[0.2.0]: https://github.com/lumban-stephen/tome-md/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/lumban-stephen/tome-md/releases/tag/v0.1.0
