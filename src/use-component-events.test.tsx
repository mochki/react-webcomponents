import { fireEvent, render, waitForElement } from '@testing-library/react';
import React, { ChangeEvent } from 'react';
import { RWCToggle } from '../testing/setup-tests';

test('attaches a custom event', async () => {
  const eventHandler = jest.fn();
  const { container, getByTestId } = render(<RWCToggle onToggleChanged={eventHandler} data-testid="toggle" />);
  const toggle = await waitForElement(() => getByTestId('toggle'));
  const innerInput = await waitForElement(() => container.querySelector('input')!);
  expect(toggle).toBeTruthy();
  expect(innerInput).toBeTruthy();
  fireEvent.click(innerInput);
  expect(eventHandler).toHaveBeenCalled();
});

test('converts onChange to onInput', async () => {
  const eventHandler = jest.fn((e: ChangeEvent) => expect(e.type).toBe('input'));
  const { container, getByTestId } = render(<RWCToggle onChange={eventHandler} data-testid="toggle" />);
  const toggle = await waitForElement(() => getByTestId('toggle'));
  const innerInput = await waitForElement(() => container.querySelector('input')!);
  expect(toggle).toBeTruthy();
  expect(innerInput).toBeTruthy();
  fireEvent.click(innerInput);
  expect(eventHandler).toHaveBeenCalled();
});
