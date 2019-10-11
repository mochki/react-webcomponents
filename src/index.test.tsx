import { render, waitForElement } from '@testing-library/react';
import React from 'react';
import { RWCToggle } from '../testing/setup-tests';

test('renders a div component', async () => {
  const { getByTestId } = render(<RWCToggle data-testid="toggle" />);
  const toggle = await waitForElement(() => getByTestId('toggle'));
  expect(toggle).toBeTruthy();
});

test('applies a component display name', () => {
  expect((RWCToggle as any).render.displayName).toBe('connectReact(RWCToggle)');
});

test('should not allow functions as ref prop', () => {
  const spy = jest.spyOn(console, 'error');
  spy.mockImplementation(() => undefined);
  expect(() =>
    render(
      <RWCToggle
        ref={() => {
          jest.fn();
        }}
      />
    )
  ).toThrow();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
