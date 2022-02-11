import * as React from 'react';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { composeRef } from 'rc-util/lib/ref';
import omit from 'rc-util/lib/omit';

export type SegmentedValue = string | number;

type RawOption = SegmentedValue;

interface LabeledOption {
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  value: RawOption;
}

type Option = RawOption | LabeledOption;

type Options = Option[];

type ExtendedHTMLInputElement = Omit<HTMLInputElement, 'value'> & {
  value: SegmentedValue;
};

export interface SegmentedProps extends React.HTMLProps<HTMLDivElement> {
  options: Options;
  defaultValue?: SegmentedValue;
  value?: SegmentedValue;
  onChange?: (e: React.ChangeEvent<ExtendedHTMLInputElement>) => void;
  disabled?: boolean;
  prefixCls?: string;
  direction?: 'ltr' | 'rtl';
}

function isLabledOption(
  option: RawOption | LabeledOption,
): option is LabeledOption {
  return option === Object(option);
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
      onChange,
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

    const segmentedOptions = React.useMemo(() => {
      return normalizeOptions(options);
    }, [options]);

    const [selected, setSelected] = useMergedState(
      props.defaultValue || segmentedOptions[0]?.value,
    );

    // TODO: should we trigger `options` changes to update `selected`

    const [visualSelected, setVisualSelected] = React.useState<
      RawOption | undefined
    >(selected);

    const [thumbShow, setThumbShow] = React.useState(false);

    const classString = classNames(
      prefixCls,
      {
        [`${prefixCls}-rtl`]: direction === 'rtl',
        [`${prefixCls}-disabled`]: disabled,
      },
      className,
    );

    const calcThumbMoveStyle = (event: React.ChangeEvent<HTMLInputElement>) => {
      const toElement = event.target.closest(`.${prefixCls}-item`);

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

    const handleChange = React.useCallback(
      (
        event: React.ChangeEvent<HTMLInputElement>,
        segmentedOption: LabeledOption,
      ) => {
        if (disabled || segmentedOption.disabled) {
          return;
        }

        if (segmentedOption.value !== selected) {
          calcThumbMoveStyle(event);
        }

        setSelected(segmentedOption.value);

        if (onChange) {
          const mutationTarget = Object.create(event.target, {
            value: {
              value: segmentedOption.value,
            },
          });
          const mutatedEvent = Object.create(event, {
            target: {
              value: mutationTarget,
            },
          });
          onChange(mutatedEvent);
        }
      },
      [selected, disabled],
    );

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
                style={motionStyle}
                className={classNames(`${prefixCls}-thumb`, motionClassName)}
              />
            );
          }}
        </CSSMotion>
        {segmentedOptions.map((segmentedOption) => (
          <label
            key={segmentedOption.value}
            className={classNames(
              `${prefixCls}-item`,
              segmentedOption.className,
              {
                [`${prefixCls}-item-selected`]:
                  segmentedOption.value === visualSelected,
                [`${prefixCls}-item-disabled`]:
                  !!disabled || !!segmentedOption.disabled,
              },
            )}
          >
            <input
              className={`${prefixCls}-item-input`}
              type="radio"
              disabled={!!disabled || !!segmentedOption.disabled}
              checked={segmentedOption.value === selected}
              onChange={(e) => handleChange(e, segmentedOption)}
            />
            <span className={`${prefixCls}-item-label`}>
              {segmentedOption.label}
            </span>
          </label>
        ))}
      </div>
    );
  },
);

Segmented.displayName = 'Segmented';

Segmented.defaultProps = {};

export default Segmented;
