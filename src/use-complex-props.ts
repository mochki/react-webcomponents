import React, { RefObject } from 'react';
import { IAnyObject, ICustomElement } from './types';

function setupProps(element: ICustomElement, complexProps: IAnyObject): void {
  for (const [prop, value] of Object.entries(complexProps)) {
    element[prop] = value;
  }
}

/**
 * Attaches the given complex props (props whose types are not basic, and that cannot be assigned via html attributes)
 * directly to the custom element's object.
 * @param ref The ref to the custom element
 * @param complexProps The map of complex props to attach to the element
 */
export function useComplexProps<T extends ICustomElement>(ref: RefObject<T>, complexProps: IAnyObject) {
  React.useEffect(() => {
    if (ref.current) {
      setupProps(ref.current, complexProps);
    }
  }, [complexProps, ref.current]);
}
