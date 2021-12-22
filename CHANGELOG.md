# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Types of changes:
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

> Date format: YYYY-MM-DD

> If we have some "Breaking changes" we can mark it in message by `**BREAKING**` preffix, like:  
> `- **BREAKING**: Some message`

-------------

## TODOs
> Todo list for future

- ...

-------------

-------------
## 3.6.0-beta.14 - 2021-12-22
### Fixed
-  img-src starts with "//"

## 3.6.0-beta.13 - 2021-11-09
### Fixed
- possibility to remove API versions

## 3.6.0-beta.11 - 2021-10-14
### Changed
- better support for SSR (render placeholders with correct sizes via SSR stage)


## 3.5.1 - 2021-07-27
### Fixed
- domain property in config


## 3.5.0 - 2021-07-23
### Added
- new property: **customDomain**


## 3.4.0 - 2021-06-19
### Deprecated
Property **ignoreNodeImgSize** is deprecated. Use **imageSizeAttributes: 'ignore'** instead
### Added
- new property: **imageSizeAttributes**


## 3.3.2 - 2020-06-26
### Added
- onImgLoad handler to Img and BackgroundImg components


## 3.3.2 - 2020-09-09
### Added
- allow unmounting the provider


## 3.3.1 - 2020-06-10
### Added
- delay property to handle cases when we need wait till some layout is loaded first


## 3.3.0 - 2020-04-29
### Added
- missing properties in the documentation (README), fix some mistakes
### Fixed
- problem with not setting ratio on preview load when no image is set


## 3.2.4 - 2020-04-28

### Fixed
- problem with srcset attribute

### Added
- add SSR support

## 3.2.3 - 2020-04-28

### Changed
- improve logic for bound resize

## 3.2.2 - 2020-04-25

### Added
- add possibility to configure minLowQualityWidth

### Changed
- improve logic for bound resize

## 3.2.1 - 2020-04-25

### Fixed
- problem with not setting ratio
- if use params as objects remove from html

## 3.1.0 - 2020-04-02

### Changed
- babel version from 6.x.x to 7.x.x

## 1.2.0 - 2020-04-22

### Changed
- improve logic structure / core refactoring

## 1.1.1 - 2020-04-16

### Added
- separate build without polyfills to support Gatsby
