import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import KeyCode from 'rc-util/lib/KeyCode';
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
  /**
   * html `title` property for label
   */
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
  vertical?: boolean;
  name?: string;
}

function getValidTitle(option: SegmentedLabeledOption) {
  if (typeof option.title !== 'undefined') {
    return option.title;
  }

  // read `label` when title is `undefined`
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
  name?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    value: SegmentedRawOption,
  ) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}> = ({
  prefixCls,
  className,
  disabled,
  checked,
  label,
  title,
  value,
  name,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    // Do not add focus style when clicking
    onBlur();
    onChange(event, value);
  };

  return (
    <label
      className={classNames(className, {
        [`${prefixCls}-item-disabled`]: disabled,
      })}
    >
      <input
        name={name}
        className={`${prefixCls}-item-input`}
        type="radio"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
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
      vertical,
      options = [],
      disabled,
      defaultValue,
      value,
      name,
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

    // Note: We should not auto switch value when value not exist in options
    // which may break single source of truth.
    const [rawValue, setRawValue] = useMergedState(segmentedOptions[0]?.value, {
      value,
      defaultValue,
    });

    // ======================= Change ========================
    const [thumbShow, setThumbShow] = React.useState(false);

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      val: SegmentedRawOption,
    ) => {
      setRawValue(val);
      onChange?.(val);
    };

    const divProps = omit(restProps, ['children']);

    // ======================= Focus ========================
    const [isFocused, setIsFocused] = React.useState(false);

    const currentIndex = segmentedOptions.findIndex(
      (option) => option.value === rawValue,
    );

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    // ======================= Keyboard ========================
    const getNextIndex = (current: number, offset: number) => {
      if (disabled) {
        return current;
      }

      const total = segmentedOptions.length;
      const nextIndex = (current + offset + total) % total;

      if (segmentedOptions[nextIndex]?.disabled) {
        return getNextIndex(nextIndex, offset);
      }
      return nextIndex;
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      let offset = 0;

      switch (event.which) {
        case KeyCode.LEFT:
        case KeyCode.UP:
          event.preventDefault();
          offset = -1;
          break;
        case KeyCode.RIGHT:
        case KeyCode.DOWN:
          event.preventDefault();
          offset = 1;
          break;
        default:
          return;
      }

      const nextIndex = getNextIndex(currentIndex, offset);
      const nextOption = segmentedOptions[nextIndex];

      if (nextOption) {
        setRawValue(nextOption.value);
        onChange?.(nextOption.value);
      }
    };

    return (
      <div
        role="listbox"
        aria-label="segmented control"
        tabIndex={0}
        {...divProps}
        className={classNames(
          prefixCls,
          {
            [`${prefixCls}-rtl`]: direction === 'rtl',
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-vertical`]: vertical,
          },
          className,
        )}
        ref={mergedRef}
      >
        <div className={`${prefixCls}-group`}>
          <MotionThumb
            vertical={vertical}
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
              name={name}
              key={segmentedOption.value}
              prefixCls={prefixCls}
              className={classNames(
                segmentedOption.className,
                `${prefixCls}-item`,
                {
                  [`${prefixCls}-item-selected`]:
                    segmentedOption.value === rawValue && !thumbShow,
                  [`${prefixCls}-item-focused`]:
                    isFocused && segmentedOption.value === rawValue,
                },
              )}
              checked={segmentedOption.value === rawValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
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
