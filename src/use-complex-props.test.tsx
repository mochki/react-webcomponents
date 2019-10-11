import { render, waitForElement } from '@testing-library/react';
import React from 'react';
import { RWCToggle } from '../testing/setup-tests';
import { Toggle } from '../testing/toggle';

test('attaches complex props', async () => {
  const complexProp = { testing: true };
  const { getByTestId } = render(<RWCToggle data-testid="toggle" complexProp={complexProp} />);
  const toggle = await waitForElement(() => getByTestId('toggle') as Toggle);
  expect(toggle).toBeTruthy();
  expect(toggle.complexProp).toBe(complexProp);
});

test('passes null to complex props when the value is null', async () => {
  const { getByTestId } = render(<RWCToggle data-testid="toggle" complexProp={null} />);
  const toggle = await waitForElement(() => getByTestId('toggle') as Toggle);
  expect(toggle).toBeTruthy();
  expect(toggle.complexProp).toBe(null);
});

test('passes complex props and normal props', async () => {
  const { getByTestId } = render(<RWCToggle data-testid="toggle" complexProp={null} checked={true} />);
  const toggle = await waitForElement(() => getByTestId('toggle') as Toggle);
  expect(toggle).toBeTruthy();
  expect(toggle.complexProp).toBe(null);
  expect(toggle.checked).toBe(true);
});
