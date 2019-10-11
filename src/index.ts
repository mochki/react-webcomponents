import React from 'react';
import {
  IAnyObject,
  ICustomElement,
  IDefaultProps,
  IOptions,
  IPropData,
  IStringObject,
  PropsWithForwardedRef,
} from './types';
import { useClassListManager } from './use-class-list-manager';
import { useComplexProps } from './use-complex-props';
import { useComponentEvents } from './use-component-events';
import { useControlledProps } from './use-controlled-props';

const complexAttributeTypes = ['object', 'bigint', 'symbol'];

const reactProps = {
  className: 'class',
  // TODO: https://jira.rms.com/browse/RAD-560
  // dangerouslySetInnerHTML: 'innerHTML',
  htmlFor: 'for',
  onChange: 'onInput',
  style: 'style',
} as IStringObject;

function validateRef(ref: any): void {
  if (typeof ref === 'function') {
    throw new Error(
      'React with custom elements cannot use callback refs. Please use either React.useRef or React.createRef'
    );
  }
}

function parseProps<P>(props: P, options: IOptions): IPropData {
  const customProps = options.customProps || {};
  const customEvents = options.customEvents || {};
  const complexProps: IAnyObject = {}; // Props applied to element with JS DOM API
  const componentEvents: IStringObject = {}; // Custom event applied directly
  const remainingProps: IAnyObject = {}; // Props to pass directly to React

  for (const [prop, value] of Object.entries(props)) {
    if (reactProps.hasOwnProperty(prop)) {
      // set React specific props
      remainingProps[reactProps[prop]] = value;
    } else if (complexAttributeTypes.includes(typeof value)) {
      // custom component prop & object/array/etc.
      complexProps[prop] = value;
    } else if (customProps.hasOwnProperty(prop)) {
      // custom component prop as attribute name
      remainingProps[customProps[prop]] = value;
    } else if (customEvents.hasOwnProperty(prop)) {
      // custom component event
      componentEvents[customEvents[prop]] = value;
    } else {
      // remaining props
      remainingProps[prop] = value;
    }
  }

  return { componentEvents, complexProps, remainingProps };
}

export function connectReact<TElement extends ICustomElement, TProps = {}>(
  WrappedComponent: React.FC<PropsWithForwardedRef<TElement, TProps>>,
  options: IOptions = {}
) {
  const component: React.RefForwardingComponent<TElement, React.PropsWithChildren<TProps> & IDefaultProps> = (
    { children, ...props },
    ref
  ) => {
    validateRef(ref);
    const forwardedRef = (ref as React.RefObject<TElement>) || React.useRef<TElement>(null);
    const {
      complexProps,
      componentEvents,
      remainingProps: { class: reactClasses, ...remainingProps },
    } = parseProps(props, options);

    // Previous & current props made available to MutationObserver & classes watcher
    const remainingPropsRef = React.useRef<IAnyObject>(remainingProps);
    remainingPropsRef.current = remainingProps;

    useComponentEvents(forwardedRef, componentEvents, options);
    useComplexProps(forwardedRef, complexProps);
    useControlledProps(forwardedRef, remainingPropsRef);
    useClassListManager(forwardedRef, reactClasses);

    return React.createElement(WrappedComponent, { forwardedRef, ...remainingProps } as any, children);
  };
  component.displayName = `connectReact(${options.displayName || 'Component'})`;
  return React.forwardRef(component);
}

export function adapt<TElement extends HTMLElement, TProps = {}>(webComponentName: string, options: IOptions = {}) {
  return connectReact<TElement, TProps>(
    ({ children, forwardedRef: ref, ...props }) => React.createElement(webComponentName, { ref, ...props }, children),
    { ...options, displayName: options.displayName || webComponentName }
  );
}
