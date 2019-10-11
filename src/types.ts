import React from 'react';

export interface IAnyObject {
  [key: string]: any;
}

export interface IStringObject {
  [key: string]: string;
}

export interface ICustomElement extends HTMLElement, IAnyObject {}

export interface IOptions {
  customEvents?: IStringObject;
  customProps?: IStringObject;
  displayName?: string;
  eventTransformer?: (rawEventName: string) => string;
}

export interface IPropData {
  complexProps: IAnyObject;
  componentEvents: IStringObject;
  remainingProps: IAnyObject;
}

export interface IDefaultProps {
  className?: string;
  style?: React.CSSProperties;
}

export type PropsWithForwardedRef<TElement extends ICustomElement, TProps> = TProps & {
  forwardedRef: React.RefObject<TElement>;
};
