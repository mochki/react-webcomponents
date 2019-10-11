import React, { RefObject } from 'react';
import { ICustomElement, IOptions, IStringObject } from './types';

function parseEventName(eventName: string, options: IOptions): string {
  const { customEvents = {}, eventTransformer } = options;
  return (customEvents && customEvents[eventName]) || (eventTransformer && eventTransformer(eventName)) || eventName;
}

function setupEvents<P>(element: ICustomElement, componentEvents: P, options: IOptions): void {
  for (const [prop, value] of Object.entries(componentEvents)) {
    element.addEventListener(parseEventName(prop, options), value);
  }
}

function clearEvents<P>(element: ICustomElement, props: P, options: IOptions): void {
  for (const [prop, value] of Object.entries(props)) {
    if (typeof value === 'function') {
      element.removeEventListener(parseEventName(prop, options), value);
    }
  }
}

/**
 * Sets up events on the custom element as provided by the consumer. One of the weaknesses of React + Web Components is
 * that react doesn't support events on the custom element. To get around this, we attach event listeners to the custom
 * element using the DOM API directly. Additionally, there are some special cases that we must handle, such as mapping
 * the onChange event to onInput.
 * @param ref The ref to the custom element
 * @param componentEvents The map of event names -> event handlers that will be attached to the custom element
 * @param options Options for custom event name transformations
 */
export function useComponentEvents<T extends ICustomElement>(
  ref: RefObject<T>,
  componentEvents: IStringObject,
  options: IOptions
) {
  React.useEffect(() => {
    if (ref.current) {
      // We capture the current value of ref.current so the tear-down closure has access to this specific instance.
      const refInstance = ref.current;
      setupEvents(refInstance, componentEvents, options);

      return () => {
        clearEvents(refInstance, componentEvents, options);
      };
    }
  }, [componentEvents, ref.current]);
}
