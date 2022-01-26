import * as React from 'react';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { composeRef } from 'rc-util/lib/ref';
import omit from 'rc-util/lib/omit';

type RawOption = string | number;

interface LabeledOption {
  className?: string;
  disabled?: boolean;
  label: string;
  value: RawOption;
}

type Option = RawOption | LabeledOption;

type Options = Option[];

export interface SegmentedProps extends React.HTMLProps<HTMLDivElement> {
  options: Options;
  defaultValue?: RawOption;
  disabled?: boolean;
  prefixCls?: string;
  direction?: 'ltr' | 'rtl';
}

function isLabledOption(
  option: RawOption | LabeledOption,
): option is LabeledOption {
  return option === Object(option);
}

function getDefaultValue(options: Options) {
  const option0 = options[0];
  return isLabledOption(option0) ? option0.value : option0;
}

function normalizeOptions(options: Options): LabeledOption[] {
  return options.map((option) => {
    if (isLabledOption(option)) {
      return option;
    }
    return {
      label: String(option),
      value: option,
    };
  });
}

const calcThumbStyle = (targetElement: HTMLElement): React.CSSProperties => ({
  transform: `translateX(${targetElement.offsetLeft}px)`,
  width: targetElement.clientWidth,
});

const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (props, ref) => {
    const {
      prefixCls = 'rc-segmented',
      direction,
      options,
      disabled,
      onClick,
      prefixCls: customizePrefixCls,
      className = '',
      ...restProps
    } = props;

    const containerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = composeRef<HTMLDivElement>(containerRef, ref);

    const thumbMoveStyles = React.useRef<
      Record<'from' | 'to', React.CSSProperties | null>
    >({
      from: null,
      to: null,
    });

    const [selected, setSelected] = useMergedState(
      props.defaultValue || getDefaultValue(options),
    );
    const [visualSelected, setVisualSelected] = React.useState<
      RawOption | undefined
    >(selected);

    const [thumbShow, setThumbShow] = React.useState(false);

    const segmentedOptions = normalizeOptions(options);

    const classString = classNames(
      prefixCls,
      {
        [`${prefixCls}-rtl`]: direction === 'rtl',
        [`${prefixCls}-disabled`]: disabled,
      },
      className,
    );

    const handleItemClick = React.useCallback(
      (
        segmentedOption: LabeledOption,
        event: React.MouseEvent<HTMLDivElement>,
      ) => {
        if (disabled || segmentedOption.disabled) {
          return;
        }

        if (segmentedOption.value !== selected) {
          calcThumbMoveStyle(event);
        }

        setSelected(segmentedOption.value);

        onClick?.(event);
      },
      [selected],
    );

    const calcThumbMoveStyle = (event: React.MouseEvent<HTMLDivElement>) => {
      const toElement = (event.target as HTMLElement).closest(
        `.${prefixCls}-item`,
      );

      const fromElement = containerRef.current?.querySelector(
        `.${prefixCls}-item-selected`,
      );

      if (fromElement && toElement && thumbMoveStyles.current) {
        thumbMoveStyles.current.from = calcThumbStyle(
          fromElement as HTMLElement,
        );
        thumbMoveStyles.current.to = calcThumbStyle(toElement as HTMLElement);

        setThumbShow(true);
      }
    };

    // --- motion event handlers for thumb move
    const handleThumbEnterStart = () => {
      const fromStyle = thumbMoveStyles.current.from;
      if (fromStyle) {
        setVisualSelected(undefined);
        return fromStyle;
      }
    };

    const handleThumbEnterActive = () => {
      const toStyle = thumbMoveStyles.current.to;
      if (toStyle) {
        return toStyle;
      }
    };

    const handleThumbEnterEnd = React.useCallback(() => {
      setThumbShow(false);
      setVisualSelected(selected);

      if (thumbMoveStyles.current) {
        thumbMoveStyles.current = {
          from: null,
          to: null,
        };
      }
    }, [selected]);

    const divProps = omit(restProps, ['children']);

    return (
      <div {...divProps} className={classString} ref={mergedRef}>
        <CSSMotion
          visible={thumbShow}
          motionName={`${prefixCls}-thumb-motion`}
          motionDeadline={300}
          onEnterStart={handleThumbEnterStart}
          onEnterActive={handleThumbEnterActive}
          onEnterEnd={handleThumbEnterEnd}
        >
          {({ className: motionClassName, style: motionStyle }) => {
            return (
              <div
                className={classNames(`${prefixCls}-thumb`, motionClassName)}
                style={motionStyle}
              />
            );
          }}
        </CSSMotion>
        {segmentedOptions.map((segmentedOption) => (
          <div
            key={segmentedOption.value}
            className={classNames(`${prefixCls}-item`, {
              [`${prefixCls}-item-selected`]:
                segmentedOption.value === visualSelected,
              [`${prefixCls}-item-disabled`]: !!segmentedOption.disabled,
            })}
            onClick={(e) => handleItemClick(segmentedOption, e)}
          >
            <span className={`${prefixCls}-item-label`}>
              {segmentedOption.label}
            </span>
          </div>
        ))}
      </div>
    );
  },
);

Segmented.defaultProps = {};

export default Segmented;
