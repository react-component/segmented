import useControlledState from '@rc-component/util/lib/hooks/useControlledState';
import omit from '@rc-component/util/lib/omit';
import { composeRef } from '@rc-component/util/lib/ref';
import { clsx } from 'clsx';
import * as React from 'react';

import MotionThumb from './MotionThumb';

export type SemanticName = 'item' | 'label';
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

type ItemRender = (
  node: React.ReactNode,
  info: { item: SegmentedLabeledOption },
) => React.ReactNode;

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
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
  itemRender?: ItemRender;
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
  style?: React.CSSProperties;
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
  data: SegmentedLabeledOption;
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
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (e?: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onKeyUp: (e: React.KeyboardEvent) => void;
  onMouseDown: () => void;
  itemRender?: ItemRender;
}> = ({
  prefixCls,
  className,
  style,
  styles,
  classNames: segmentedClassNames,
  data,
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
  onKeyUp,
  onMouseDown,
  itemRender = (node: React.ReactNode) => node,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    onChange(event, value);
  };
  const itemContent: React.ReactNode = (
    <label
      className={clsx(className, { [`${prefixCls}-item-disabled`]: disabled })}
      style={style}
      onMouseDown={onMouseDown}
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
        onKeyUp={onKeyUp}
      />
      <div
        className={clsx(`${prefixCls}-item-label`, segmentedClassNames?.label)}
        title={title}
        role="radio"
        aria-checked={checked}
        style={styles?.label}
      >
        {label}
      </div>
    </label>
  );
  return itemRender(itemContent, { item: data });
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
      style,
      styles,
      classNames: segmentedClassNames,
      motionName = 'thumb-motion',
      itemRender,
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
    const [rawValue, setRawValue] = useControlledState(
      defaultValue ?? segmentedOptions[0]?.value,
      value,
    );

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
    const [isKeyboard, setIsKeyboard] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const handleMouseDown = () => {
      setIsKeyboard(false);
    };

    // capture keyboard tab interaction for correct focus style
    const handleKeyUp = (event: React.KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsKeyboard(true);
      }
    };

    // ======================= Keyboard ========================
    const onOffset = (offset: number) => {
      const currentIndex = segmentedOptions.findIndex(
        (option) => option.value === rawValue,
      );

      const total = segmentedOptions.length;
      const nextIndex = (currentIndex + offset + total) % total;

      const nextOption = segmentedOptions[nextIndex];
      if (nextOption) {
        setRawValue(nextOption.value);
        onChange?.(nextOption.value);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          onOffset(-1);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          onOffset(1);
          break;
      }
    };

    const renderOption = (segmentedOption: SegmentedLabeledOption) => {
      const { value: optionValue, disabled: optionDisabled } = segmentedOption;

      return (
        <InternalSegmentedOption
          {...segmentedOption}
          name={name}
          data={segmentedOption}
          itemRender={itemRender}
          key={optionValue}
          prefixCls={prefixCls}
          className={clsx(
            segmentedOption.className,
            `${prefixCls}-item`,
            segmentedClassNames?.item,
            {
              [`${prefixCls}-item-selected`]:
                optionValue === rawValue && !thumbShow,
              [`${prefixCls}-item-focused`]:
                isFocused && isKeyboard && optionValue === rawValue,
            },
          )}
          style={styles?.item}
          classNames={segmentedClassNames}
          styles={styles}
          checked={optionValue === rawValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onMouseDown={handleMouseDown}
          disabled={!!disabled || !!optionDisabled}
        />
      );
    };

    return (
      <div
        role="radiogroup"
        aria-label="segmented control"
        tabIndex={disabled ? undefined : 0}
        style={style}
        {...divProps}
        className={clsx(
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
          {segmentedOptions.map(renderOption)}
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
