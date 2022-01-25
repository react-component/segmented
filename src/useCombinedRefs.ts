import * as React from 'react';

function isRefCallback<T>(ref: any): ref is React.RefCallback<T> {
  return typeof ref === 'function';
}

type ReactRef<T> =
  | React.LegacyRef<T>
  | React.RefObject<T>
  | React.MutableRefObject<T>;

export function useMergedRefs<T>(...refs: ReactRef<T>[]): React.RefCallback<T> {
  return React.useCallback(
    (element: T) => {
      refs.forEach((ref) => {
        if (!ref) return;

        // Ref contains three types - a function or an object or a string
        if (typeof ref === 'string') {
          // cannot handle
        } else if (isRefCallback(ref)) {
          ref(element);
        } else {
          (ref as React.MutableRefObject<T>).current = element;
        }
      });
    },
    [refs],
  );
}
