# React Webcomponents


> React HOC & generator to wrap webcomponents as a React component with full compatibility.

## Usage
Make sure any custom web components are defined on the page using the browser independent
[customElements.define](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)
or through a helper function provided by a framework, such as Stencil's helper.

```jsx
import React, { Component } from 'react'
import { adapt, connectReact } from '@rms/react-webcomponents'

// Recommended
const CustomButton = adapt('custom-button');

// And use as any other React component
function App() {
  return (
    <CustomButton onClick={e => {console.log(e.target.value)}}>
      Click me
    </CustomButton>
  )
}
```

You have a few more options in how to this if we don't want to use the adapt function. It works with
class or function components using the connectReact HOC. The requirement is that we assign
`props.forwardedRef` to the webcomponent's ref and we pass through the `children`.

```jsx
class CustomHeaderA extends Component {
  render() {
    return (
      <custom-header ref={this.props.forwardedRef}>
        {this.props.children}
      </custom-header>
    );
  }
}

function CustomHeaderB(props) {
  return <custom-header ref={props.forwardedRef}>{props.children}</custom-header>
}

const ReactCustomHeaderA = connectReact(CustomHeaderA)
const ReactCustomHeaderB = connectReact(CustomHeaderB)

// Or, more tersely
const ReactCustomHeaderC = connectReact(({ children, forwardedRef: ref, ...props }) =>
  React.createElement(webComponentName, { ref, ...props }, children)
);
```

## Docs

### Options
`connectReact` and `adapt` both accept an options object that can help with additional configuration.
This includes:
  - `customEvents` - an object containing keys to what will be defined as a component
    prop in JSX and the actual event that fires from the web component. There is full
    flexibility here. i.e.
    ```js
    {
      onCustomToggle: 'actualCustomToggleEvent',
      'on-custom-drag': 'actualcustomdragvent'
    }
    ```
  - `customProps` - an object containing keys to what will be defined as a component
    prop in JSX and the actual attribute that will be passed to the DOM element in HTML. i.e.
    ```js
    {
      primaryColor: 'primary-color'
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

Parsing of event names thus follows this heirarchy, returning the first value that matches the case:
  1. `Events listed in the customEvents map`
  1. `Events transformed by a given transformer`
  1. `Events listed as special because of React's native incompatibility`
  1. `defaulting to remove an 'on' at the beginning and lowercasing`

### Refs
Refs are a powerful tool in React for creating a reference to the DOM instance. Because of how we wrap
the custom element in an HOC, we have to use ref forwarding to ensure we have the original instance in
the HOC. If you need a ref to the DOM instance when using a React wrapped custom element, you can simply
pass in a ref and we handle forwarding that _as_ the main ref to use.

```jsx
function App() {
  const ref = React.useRef(null)
  return <CustomTextInput ref={ref}>Click Me</CustomTextInput>
}
```

Keep in mind, this returns the ref to the actual custom element, not any child of it (though you can
access them through traversal). For example, if you have a custom input element, the current value
likely won't be present on the ref and you will have to traverse. A better pattern would be to have your
components entirely controlled by the parent so no traversing is necessary.


#### Invalid Refs
Refs work in most cases, but it specifically **_does not work callback refs._** Avoid them.

```
Function components cannot have refs. Did you mean to use React.forwardRef()?
```

You may also see the above error if the ref is invalid. Ensure that the ref you pass in has been created with
React.useRef or React.createRef.
