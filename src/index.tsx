import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import omit from 'rc-util/lib/omit';
import { composeRef } from 'rc-util/lib/ref';
import * as React from 'react';

import MotionThumb from './MotionThumb';

export type SegmentedValue = string | number;

export type SegmentedRawOption = SegmentedValue;

export interface SegmentedLabeledOption {
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  value: SegmentedRawOption;
  /**
   * html `title` property for label
   */
  title?: string;
}

type SegmentedOptions = (SegmentedRawOption | SegmentedLabeledOption)[];

/**
 * Generic parameter `Value` is supported since 2.3.0
 */
export interface SegmentedProps<Value extends SegmentedValue = SegmentedValue>
  extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
  options: SegmentedOptions;
  defaultValue?: Value;
  value?: Value;
  onChange?: (value: Value) => void;
  disabled?: boolean;
  prefixCls?: string;
  direction?: 'ltr' | 'rtl';
  motionName?: string;
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

interface InternalSegmentedOptionProps {
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
}

const InternalSegmentedOption = (props: InternalSegmentedOptionProps) => {
  const {
    prefixCls,
    className,
    disabled,
    checked,
    label,
    title,
    value,
    onChange,
  } = props;

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
      <div className={`${prefixCls}-item-label`} title={title}>
        {label}
      </div>
    </label>
  );
};

const Segmented = (
  props: SegmentedProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const {
    prefixCls = 'rc-segmented',
    direction,
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
    if (disabled) {
      return;
    }

    setRawValue(val);

    onChange?.(val);
  };

  const divProps = omit(restProps, ['children']);

  return (
    <div
      {...divProps}
      className={classNames(
        prefixCls,
        {
          [`${prefixCls}-rtl`]: direction === 'rtl',
          [`${prefixCls}-disabled`]: disabled,
        },
        className,
      )}
      ref={mergedRef}
    >
      <div className={`${prefixCls}-group`}>
        <MotionThumb
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
};

const RefSegmented = React.forwardRef(Segmented);
RefSegmented.displayName = 'Segmented';

export default RefSegmented as <Value extends SegmentedValue = SegmentedValue>(
  props: SegmentedProps<Value> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
