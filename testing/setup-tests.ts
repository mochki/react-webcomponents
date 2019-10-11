import '@testing-library/jest-dom/extend-expect';
import { ChangeEventHandler } from 'react';
import { adapt } from '../src';
import { IToggleChangeEventDetail, Toggle } from './toggle';

customElements.define('rwc-toggle', Toggle);

type CustomEventHandler<T> = (event: CustomEvent<T>) => void;

interface IToggleProps {
  checked?: boolean;
  complexProp?: { testing: boolean } | null;
  onToggleChanged?: CustomEventHandler<IToggleChangeEventDetail>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
export const RWCToggle = adapt<Toggle, IToggleProps>('rwc-toggle', {
  customEvents: { onToggleChanged: 'toggle-changed' },
  customProps: { checked: 'checked' },
  displayName: 'RWCToggle',
});
