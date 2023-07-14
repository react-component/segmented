import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import omit from 'rc-util/lib/omit';
import { composeRef } from 'rc-util/lib/ref';
import * as React from 'react';

import MotionThumb from './MotionThumb';

export type SegmentedRawValue = string | number;

export type SegmentedValue<T extends SegmentedRawValue = SegmentedRawValue> = T;

export type SegmentedRawOption<T extends SegmentedRawValue> = SegmentedValue<T>;

export interface SegmentedLabeledOption<T extends SegmentedRawValue> {
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  value: SegmentedRawOption<T>;
  /**
   * html `title` property for label
   */
  title?: string;
}

type SegmentedOptions<T extends SegmentedRawValue> = (
  | SegmentedRawOption<T>
  | SegmentedLabeledOption<T>
)[];

type InternalSegmentedOptionProps<T extends SegmentedRawValue> = {
  prefixCls: string;
  className?: string;
  disabled?: boolean;
  checked: boolean;
  label: React.ReactNode;
  title?: string;
  value: SegmentedRawOption<T>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    value: SegmentedRawOption<T>,
  ) => void;
};

export interface SegmentedProps<T extends SegmentedRawValue>
  extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
  options: SegmentedOptions<T>;
  defaultValue?: SegmentedValue<T>;
  value?: SegmentedValue<T>;
  onChange?: (value: SegmentedValue<T>) => void;
  disabled?: boolean;
  prefixCls?: string;
  direction?: 'ltr' | 'rtl';
  motionName?: string;
}

function getValidTitle<T extends SegmentedRawValue>(
  option: SegmentedLabeledOption<T>,
) {
  if (typeof option.title !== 'undefined') {
    return option.title;
  }

  // read `label` when title is `undefined`
  if (typeof option.label !== 'object') {
    return option.label?.toString();
  }
}

function normalizeOptions<T extends SegmentedRawValue>(
  options: SegmentedOptions<T>,
): SegmentedLabeledOption<T>[] {
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

const InternalSegmentedOption: React.FC<InternalSegmentedOptionProps<any>> = <
  T extends SegmentedRawValue,
>({
  prefixCls,
  className,
  disabled,
  checked,
  label,
  title,
  value,
  onChange,
}: InternalSegmentedOptionProps<T>) => {
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

const Segmented = React.forwardRef(
  <T extends SegmentedRawValue>(
    props: React.PropsWithChildren<SegmentedProps<T>>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const {
      prefixCls = 'rc-segmented',
      direction,
      options,
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
      val: SegmentedRawOption<any>,
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
  },
);

Segmented.displayName = 'Segmented';

Segmented.defaultProps = {
  options: [],
};

const TypeSegmented = Segmented as unknown as <T extends SegmentedRawValue>(
  props: React.PropsWithChildren<SegmentedProps<T>> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement;

export default TypeSegmented;
