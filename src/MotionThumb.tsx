import * as React from 'react';
import CSSMotion from 'rc-motion';
import classNames from 'classnames';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { composeRef } from 'rc-util/lib/ref';
import type { SegmentedValue } from '.';

export interface MotionThumbInterface {
  containerRef: React.RefObject<HTMLDivElement>;
  value: SegmentedValue;
  getValueIndex: (value: SegmentedValue) => number;
  prefixCls: string;
  motionName: string;
  onMotionStart: VoidFunction;
  onMotionEnd: VoidFunction;
}

const calcThumbStyle = (
  targetElement: HTMLElement | null | undefined,
): React.CSSProperties =>
  targetElement
    ? {
        transform: `translateX(${targetElement.offsetLeft}px)`,
        width: targetElement.clientWidth,
      }
    : {};

export default function MotionThumb(props: MotionThumbInterface) {
  const {
    prefixCls,
    containerRef,
    value,
    getValueIndex,
    motionName,
    onMotionStart,
    onMotionEnd,
  } = props;

  const thumbRef = React.useRef<HTMLDivElement>(null);
  const [prevValue, setPrevValue] = React.useState(value);

  // =========================== Effect ===========================
  const findValueElement = (val: SegmentedValue) =>
    containerRef.current?.querySelector<HTMLDivElement>(
      `.${prefixCls}-item:nth-child(${getValueIndex(val) + 1})`,
    );

  const [prevElement, setPrevElement] = React.useState<
    HTMLDivElement | null | undefined
  >();
  const [nextElement, setNextElement] = React.useState<
    HTMLDivElement | null | undefined
  >();

  useLayoutEffect(() => {
    if (prevValue !== value) {
      const prev = findValueElement(prevValue);
      const next = findValueElement(value);

      setPrevElement(prev);
      setNextElement(next);

      if (prev && next) {
        onMotionStart();
      } else {
        onMotionEnd();
      }
    }
  }, [value]);

  // =========================== Motion ===========================
  const onAppearStart = () => {
    const style = calcThumbStyle(prevElement);
    return style;
  };
  const onAppearActive = () => {
    const style = calcThumbStyle(nextElement);
    return style;
  };
  const onAppearEnd = () => {
    setPrevElement(null);
    setNextElement(null);
    setPrevValue(value);
    onMotionEnd();
  };

  // =========================== Render ===========================
  // No need motion when nothing exist in queue
  if (!prevElement || !nextElement) {
    return null;
  }

  return (
    <CSSMotion
      visible
      motionName={motionName}
      motionAppear
      onAppearStart={onAppearStart}
      onAppearActive={onAppearActive}
      onAppearEnd={onAppearEnd}
    >
      {({ className: motionClassName, style: motionStyle }, ref) => {
        return (
          <div
            ref={composeRef(thumbRef, ref)}
            style={motionStyle}
            className={classNames(`${prefixCls}-thumb`, motionClassName)}
          />
        );
      }}
    </CSSMotion>
  );
}
