import React from 'react';
import { IAnyObject, ICustomElement } from './types';

function mutatorCallback(
  elementRef: React.RefObject<ICustomElement>,
  remainingPropsRef: React.MutableRefObject<IAnyObject>
) {
  return (mutationList: MutationRecord[]) => {
    mutationList.map(({ attributeName }) => {
      const attributeValue = elementRef.current!.getAttribute(attributeName!);
      const propValue = remainingPropsRef.current[attributeName!];

      if (
        // If prop isn't set in React, allow uncontrolled behavior
        !remainingPropsRef.current.hasOwnProperty(attributeName!) ||
        propValue === attributeValue ||
        (typeof propValue === 'boolean' && propValue === DOMTruthiness(attributeValue)) ||
        (typeof propValue === 'number' && propValue === Number(attributeValue))
      ) {
        return;
      } else if (propValue === undefined) {
        elementRef.current!.removeAttribute(attributeName!);
      } else {
        elementRef.current!.setAttribute(attributeName!, propValue);
      }
    });
  };
}

function DOMTruthiness(val: string | null): boolean {
  switch (val) {
    case '':
    case 'true':
      return true;
    case null:
    case 'false':
    default:
      return false;
  }
}

/**
 * Initializes a MutationObserver instance to watch changes to the attributes of the custom element in order to ensure
 * that the consumer-provided props are the source of truth, and any internal updates to the attributes of the custom
 * elements are then overwritten by the consumer-provided props.
 * @param ref The ref to the custom element
 * @param propsRef A reference to the props that are controlled by the consumer
 */
export function useControlledProps<T extends ICustomElement>(
  ref: React.RefObject<T>,
  propsRef: React.MutableRefObject<IAnyObject>
) {
  // Setup & teardown MutationObserver & classes
  React.useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(mutatorCallback(ref, propsRef));
      observer.observe(ref.current, { attributes: true });

      return () => {
        observer.disconnect();
      };
    }
  }, []);
}
