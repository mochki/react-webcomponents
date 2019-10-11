import React from 'react';
import { ICustomElement } from './types';

function parseClassListToSet(classListString: string): Set<string> {
  return new Set(classListString.split(' ').filter((truthy) => truthy));
}

function setDelta(setA: Set<string>, setB: Set<string>): Array<Set<string>> {
  const removals = new Set<string>(setA);
  const additions = new Set<string>(setB);

  setB.forEach((item) => {
    if (setA.has(item)) {
      removals.delete(item);
      additions.delete(item);
    }
  });
  return [removals, additions];
}

/**
 * Listens to changes in the classes provided by the consumer and utilizes the classList API to add and remove classes
 * to the custom element.
 * @param ref The ref to the custom element
 * @param reactClasses The string of classes provided by the consumer
 */
export function useClassListManager<T extends ICustomElement>(ref: React.RefObject<T>, reactClasses: string) {
  // A ref to keep track of the previous classes
  const previousReactClassesRef = React.useRef<Set<string>>(new Set<string>());

  React.useEffect(() => {
    if (ref.current) {
      const newReactClasses = parseClassListToSet(reactClasses || '');
      const [toRemove, toAdd] = setDelta(previousReactClassesRef.current, newReactClasses);
      ref.current.classList.add(...toAdd);
      ref.current.classList.remove(...toRemove);

      // Update for next cycle
      previousReactClassesRef.current = newReactClasses;
    }
  }, [reactClasses]);
}
