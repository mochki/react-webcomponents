import { fireEvent, render, waitForElement } from '@testing-library/react';
import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import { RWCToggle } from '../testing/setup-tests';

const ClassListTestComponent: React.FC = () => {
  const [bool, toggleBool] = useState(false);
  return (
    <div>
      <RWCToggle data-testid="el" className={`Always ${bool ? 'Sometimes' : ''}`} />
      <button data-testid="toggle" onClick={() => toggleBool(!bool)} />
    </div>
  );
};

test('should manage class names on the element', async () => {
  const { getByTestId } = render(<ClassListTestComponent />);
  const element = await waitForElement(() => getByTestId('el'));
  const button = await waitForElement(() => getByTestId('toggle'));
  expect(element).toHaveClass('Always');
  expect(element).not.toHaveClass('Sometimes');
  fireEvent.click(button);
  expect(element).toHaveClass('Always', 'Sometimes');
  fireEvent.click(button);
  expect(element).toHaveClass('Always');
  expect(element).not.toHaveClass('Sometimes');
  act(() => element.classList.add('Testing'));
  expect(element).toHaveClass('Always', 'Testing');
  expect(element).not.toHaveClass('Sometimes');
});
