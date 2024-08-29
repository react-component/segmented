import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import omit from 'rc-util/lib/omit';
import { composeRef } from 'rc-util/lib/ref';
import * as React from 'react';

import MotionThumb from './MotionThumb';

export type SegmentedValue = string | number;

export type SegmentedRawOption = SegmentedValue;

export interface SegmentedLabeledOption<ValueType = SegmentedRawOption> {
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  value: ValueType;
  title?: string;
}

type SegmentedOptions<T = SegmentedRawOption> = (
  | T
  | SegmentedLabeledOption<T>
)[];

export interface SegmentedProps<ValueType = SegmentedValue>
  extends Omit<
    React.HTMLProps<HTMLDivElement>,
    'defaultValue' | 'value' | 'onChange'
  > {
  options: SegmentedOptions<ValueType>;
  defaultValue?: ValueType;
  value?: ValueType;
  onChange?: (value: ValueType) => void;
  disabled?: boolean;
  prefixCls?: string;
  direction?: 'ltr' | 'rtl';
  motionName?: string;
  position?: 'horizontal' | 'vertical'; // Add position prop
}

function getValidTitle(option: SegmentedLabeledOption) {
  if (typeof option.title !== 'undefined') {
    return option.title;
  }
  if (typeof option.label !== 'object') {
    return option.label?.toString();
  }
}

function normalizeOptions(options: SegmentedOptions): SegmentedLabeledOption[] {
  return options.map((option) => {
    if (typeof option === 'object' && option !== null) {
      const validTitle = getValidTitle(option);
      return {
        ...option,
        title: validTitle,
      };
    }
    return {
      label: option?.toString(),
      title: option?.toString(),
      value: option,
    };
  });
}

const InternalSegmentedOption: React.FC<{
  prefixCls: string;
  className?: string;
  disabled?: boolean;
  checked: boolean;
  label: React.ReactNode;
  title?: string;
  value: SegmentedRawOption;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    value: SegmentedRawOption,
  ) => void;
}> = ({
  prefixCls,
  className,
  disabled,
  checked,
  label,
  title,
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    onChange(event, value);
  };

  return (
    <label
      className={classNames(className, {
        [`${prefixCls}-item-disabled`]: disabled,
      })}
    >
      <input
        className={`${prefixCls}-item-input`}
        type="radio"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />
      <div
        className={`${prefixCls}-item-label`}
        title={title}
        role="option"
        aria-selected={checked}
      >
        {label}
      </div>
    </label>
  );
};

const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (props, ref) => {
    const {
      prefixCls = 'rc-segmented',
      direction,
      position = 'horizontal', // Default to 'horizontal'
      options = [],
      disabled,
      defaultValue,
      value,
      onChange,
      className = '',
      motionName = 'thumb-motion',
      ...restProps
    } = props;

    const containerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = React.useMemo(
      () => composeRef<HTMLDivElement>(containerRef, ref),
      [containerRef, ref],
    );

    const segmentedOptions = React.useMemo(() => {
      return normalizeOptions(options);
    }, [options]);

    const [rawValue, setRawValue] = useMergedState(segmentedOptions[0]?.value, {
      value,
      defaultValue,
    });

    const [thumbShow, setThumbShow] = React.useState(false);

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      val: SegmentedRawOption,
    ) => {
      if (disabled) {
        return;
      }
      setRawValue(val);
      onChange?.(val);
    };

    const divProps = omit(restProps, ['children']);
    console.log('rawValue', rawValue);
    return (
      <div
        role="listbox"
        aria-label="segmented control"
        {...divProps}
        className={classNames(
          prefixCls,
          {
            [`${prefixCls}-rtl`]: direction === 'rtl',
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-vertical`]: position === 'vertical', // Apply vertical class if position is 'vertical'
          },
          className,
        )}
        ref={mergedRef}
      >
        <div
          className={classNames(
            `${prefixCls}-group`,
            `${prefixCls}-${position}-group`,
          )}
        >
          <MotionThumb
            position={position}
            prefixCls={prefixCls}
            value={rawValue}
            containerRef={containerRef}
            motionName={`${prefixCls}-${motionName}`}
            direction={direction}
            getValueIndex={(val) =>
              segmentedOptions.findIndex((n) => n.value === val)
            }
            onMotionStart={() => {
              setThumbShow(true);
            }}
            onMotionEnd={() => {
              setThumbShow(false);
            }}
          />
          {segmentedOptions.map((segmentedOption) => (
            <InternalSegmentedOption
              {...segmentedOption}
              key={segmentedOption.value}
              prefixCls={prefixCls}
              className={classNames(
                segmentedOption.className,
                `${prefixCls}-item`,
                {
                  [`${prefixCls}-item-selected`]:
                    segmentedOption.value === rawValue && !thumbShow,
                },
              )}
              checked={segmentedOption.value === rawValue}
              onChange={handleChange}
              disabled={!!disabled || !!segmentedOption.disabled}
            />
          ))}
        </div>
      </div>
    );
  },
);

if (process.env.NODE_ENV !== 'production') {
  Segmented.displayName = 'Segmented';
}

const TypedSegmented = Segmented as <ValueType>(
  props: SegmentedProps<ValueType> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => ReturnType<typeof Segmented>;

export default TypedSegmented;
