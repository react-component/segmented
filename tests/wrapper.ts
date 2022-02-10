import { mount as enzymeMount } from 'enzyme';
import type { ReactWrapper } from 'enzyme';

export type MountParam = Parameters<typeof enzymeMount>;

export interface WrapperType<P, S, C> extends ReactWrapper<P, S, C> {
  triggerMotionEvent: (target?: ReactWrapper) => WrapperType<P, S, C>;
}

export function mount<
  C extends React.Component,
  P = C['props'],
  S = C['state'],
>(...args: MountParam) {
  return enzymeMount(...args) as WrapperType<P, S, C>;
}
