export interface IToggleChangeEventDetail {
  checked: boolean;
}

export class Toggle extends HTMLElement {
  // A getter/setter for a value property.
  get checked() {
    return this.hasAttribute('checked') && this.getAttribute('checked') !== 'false';
  }

  set checked(val: boolean) {
    // Reflect the value of the value property as an HTML attribute.
    if (val) {
      this.setAttribute('checked', '');
      this.classList.remove('unchecked');
      this.classList.add('checked');
    } else {
      this.removeAttribute('checked');
      this.classList.remove('checked');
      this.classList.add('unchecked');
    }
  }

  // A getter/setter for a disabled property.
  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val: boolean) {
    // Reflect the value of the disabled property as an HTML attribute.
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  wrappedInput: HTMLInputElement | null = null;

  // An arbitrary "complex" prop for testing purposes.
  complexProp: { testing: boolean } | null = null;

  attributeChangedCallback(name: string, _: string, newVal: string) {
    if (name === 'checked') {
      this.checked = newVal !== null;
    }
  }

  connectedCallback() {
    // Setup classes on the element.
    this.classList.add('rwc-toggle', 'unchecked');

    // Setup inner input.
    const wrappedInput = document.createElement('input');
    wrappedInput.type = 'checkbox';
    wrappedInput.checked = this.checked;
    wrappedInput.addEventListener('change', this.handleInputChange);
    this.wrappedInput = wrappedInput;
    this.appendChild(wrappedInput);
  }

  disconnectedCallback() {
    if (this.wrappedInput) {
      this.wrappedInput.removeEventListener('change', this.handleInputChange);
    }
  }

  handleInputChange = () => {
    this.checked = this.wrappedInput!.checked;
    this.dispatchEvent(
      new CustomEvent<IToggleChangeEventDetail>('toggle-changed', { bubbles: true, detail: { checked: this.checked } })
    );
  };
}
