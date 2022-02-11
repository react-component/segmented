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
  motionName?: string;
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

const SegmentedOption: React.FC<{
  prefixCls: string;
  className?: string;
  disabled?: boolean;
  checked: boolean;
  label: React.ReactNode;
  value: RawOption;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: RawOption) => void;
}> = ({ prefixCls, className, disabled, checked, label, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    onChange(event, value);
  };

  return (
    <label
      className={classNames(`${prefixCls}-item`, className, {
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
      <span className={`${prefixCls}-item-label`}>{label}</span>
    </label>
  );
};

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
      motionName = 'thumb-motion',
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

    const [visualSelected, setVisualSelected] = React.useState<
      RawOption | undefined
    >(selected);

    const [thumbShow, setThumbShow] = React.useState(false);

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

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      value: RawOption,
    ) => {
      if (disabled) {
        return;
      }

      if (value !== selected) {
        calcThumbMoveStyle(event);
      }

      setSelected(value);

      if (onChange) {
        const mutationTarget = Object.create(event.target, {
          value: {
            value,
          },
        });
        const mutatedEvent = Object.create(event, {
          target: {
            value: mutationTarget,
          },
        });
        onChange(mutatedEvent);
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

    const handleThumbEnterEnd = () => {
      setThumbShow(false);
      setVisualSelected(selected);

      if (thumbMoveStyles.current) {
        thumbMoveStyles.current = {
          from: null,
          to: null,
        };
      }
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
        <CSSMotion
          visible={thumbShow}
          motionName={`${prefixCls}-${motionName}`}
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
          <SegmentedOption
            key={segmentedOption.value}
            prefixCls={prefixCls}
            className={classNames(segmentedOption.className, {
              [`${prefixCls}-item-selected`]:
                segmentedOption.value === visualSelected,
            })}
            checked={segmentedOption.value === selected}
            onChange={handleChange}
            {...segmentedOption}
          />
        ))}
      </div>
    );
  },
);

Segmented.displayName = 'Segmented';

Segmented.defaultProps = {};

export default Segmented;
