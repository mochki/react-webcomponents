# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2019-08-30
Docs, fixer scripts, & GitHub workflows

### Added
- MIT LICENSE file
- fixer scripts
- GitHub workflows


## [1.0.0] - 2019-08-29
The one where we reach 'full compatibility' for the 3rd time.

### Added
- Options parameter to both adapt & connectReact functions. This includes
  - `customEvents` - an object containing keys to what will be defined as a component
    prop in JSX and the actual event that fires from the web component. There is full
    flexibility here. i.e.
    ```js
    {
      onCustomToggle: 'actualCustomToggleEvent',
      'on-custom-drag': 'actualcustomdragvent'
    }
    ```
  - `displayName` - A custom display name we pass into `connectReact` so the DevTool
    will properly show named components. Will default to web-component name if provided.
  - `eventTransformer` - A function that takes in the event name (`string`) used as a prop in JSX
    and transforms it into the actual event name. i.e.
    ```js
    {
      // prop exposed: 'on-custom-drag', actual event: 'customdrag'
      eventTransformer: eventName =>
        eventName.split('-').slice(1).join('')
    }
    ```

### Changed
- Parsing of event names now follows this heirarchy, returning the first value that matches the case:
  1. `Events listed in the customEvents map` 
  1. `Events transformed by a given transformer`
  1. `Events listed as special because of React's native incompatibility`
  1. `defaulting to remove an 'on' at the beginning and lowercasing`
