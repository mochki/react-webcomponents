import React from 'react';

interface ICustomElement extends HTMLElement {
  [key: string]: any;
}

interface IOptions {
  customEvents?: {
    [key: string]: string;
  };
  displayName?: string;
  eventTransformer?: (rawEventName: string) => string;
}

const specialEvents: { [key: string]: string } = {
  onChange: 'input',
  onDoubleClick: 'dblclick',
  onDragExit: 'dragend',
};

function parseEventName(eventName: string, options: IOptions): string {
  const { customEvents = {}, eventTransformer } = options;
  return (
    (customEvents && customEvents[eventName]) ||
    (eventTransformer && eventTransformer(eventName)) ||
    specialEvents[eventName] ||
    eventName.replace(/^on/, '').toLowerCase()
  );
}

function validateRef(ref: any): void {
  if (typeof ref === 'function') {
    throw new Error(
      'React with custom elements cannot use callback refs. Please use either React.useRef or React.createRef'
    );
  }
}

function setupEventsAndProps<P>(element: ICustomElement, props: P, options: IOptions): void {
  for (const [prop, value] of Object.entries(props)) {
    if (/* Events */ typeof value === 'function') {
      element.addEventListener(parseEventName(prop, options), value);
    } /* Props */ else {
      element[prop] = value;
    }
  }
}

function clearEvents<P>(element: ICustomElement, props: P, options: IOptions): void {
  for (const [prop, value] of Object.entries(props)) {
    if (typeof value === 'function') {
      element.removeEventListener(parseEventName(prop, options), value);
    }
  }
}

export function connectReact(WrappedComponent: React.ComponentType<any>, options: IOptions = {}) {
  const component: React.FC = ({ children, ...props }, ref: React.RefObject<ICustomElement>) => {
    validateRef(ref);
    const forwardedRef = ref || React.useRef<ICustomElement>(null);

    React.useEffect(() => {
      if (forwardedRef.current) {
        setupEventsAndProps(forwardedRef.current, props, options);
      }
      return () => {
        if (forwardedRef.current) {
          clearEvents(forwardedRef.current, props, options);
        }
      };
    }, [props]);

    return React.createElement(WrappedComponent, { forwardedRef }, children);
  };
  component.displayName = `connectReact(${options.displayName || 'Component'})`;
  return React.forwardRef(component);
}

export function adapt(webComponentName: string, options: IOptions = {}): React.FunctionComponent<any> {
  return connectReact(
    ({ children, forwardedRef: ref, ...props }) => React.createElement(webComponentName, { ref, ...props }, children),
    { ...options, displayName: options.displayName || webComponentName }
  );
}
