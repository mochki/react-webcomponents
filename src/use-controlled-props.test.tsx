import { fireEvent, render, wait, waitForElement } from '@testing-library/react';
import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import { RWCToggle } from '../testing/setup-tests';
import { Toggle } from '../testing/toggle';

const TestTruthyComponent: React.FC = () => {
  const [value, setValue] = useState<boolean | undefined>(false);
  const setUndefined = () => setValue(undefined);
  return (
    <div>
      <RWCToggle data-testid="toggle" checked={value} onChange={(e) => setValue(e.target.checked)} />
      <button data-testid="button" onClick={setUndefined} />
    </div>
  );
};

test('controls a boolean value', async () => {
  // starts falsy (unchecked)
  const { container, getByTestId } = render(<TestTruthyComponent />);
  const toggle = await waitForElement(() => getByTestId('toggle') as Toggle);
  const input = await waitForElement(() => container.querySelector('input')!);

  expect(toggle).toBeTruthy();
  expect(toggle.checked).toBeFalsy();
  expect(input).toBeTruthy();

  // update the value internally
  act(() => {
    toggle.checked = true;
  });
  // it will initially be truthy
  expect(toggle.checked).toBeTruthy();
  // but then should become falsy again.
  await wait(() => expect(toggle.checked).toBeFalsy());

  // toggle the toggle
  fireEvent.click(input);
  // and it should turn truthy.
  await wait(() => expect(toggle.checked).toBeTruthy());

  // update the value internally again
  act(() => {
    toggle.checked = false;
  });
  // it will initially be truthy
  expect(toggle.checked).toBeFalsy();
  // but then should become truthy again.
  await wait(() => expect(toggle.checked).toBeTruthy());
});

test('undefined controlled value removes the attribute completely.', async () => {
  // starts falsy (unchecked)
  const { container, getByTestId } = render(<TestTruthyComponent />);
  const toggle = await waitForElement(() => getByTestId('toggle') as Toggle);
  const button = await waitForElement(() => getByTestId('button'));
  const input = await waitForElement(() => container.querySelector('input')!);

  expect(toggle).toBeTruthy();
  expect(toggle.checked).toBeFalsy();
  expect(button).toBeTruthy();
  expect(input).toBeTruthy();

  // toggle the toggle
  fireEvent.click(input);
  // and it should turn truthy.
  await wait(() => expect(toggle.checked).toBeTruthy());

  // set the value to undefined
  fireEvent.click(button);
  // and it should turn falsy.
  await wait(() => expect(toggle.checked).toBeFalsy());

  // update the value internally
  act(() => {
    toggle.checked = true;
  });
  // it will initially be truthy
  expect(toggle.checked).toBeTruthy();
  // but then should become falsy again.
  await wait(() => expect(toggle.checked).toBeFalsy());

  expect(toggle).not.toHaveAttribute('checked');
});
