import * as React from 'react';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { composeRef } from 'rc-util/lib/ref';
import omit from 'rc-util/lib/omit';

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
  htmlTitle?: string;
}

type SegmentedOptions = (SegmentedRawOption | SegmentedLabeledOption)[];

type ExtendedHTMLInputElement = Omit<HTMLInputElement, 'value'> & {
  value: SegmentedValue;
};

export interface SegmentedProps extends React.HTMLProps<HTMLDivElement> {
  options: SegmentedOptions;
  defaultValue?: SegmentedValue;
  value?: SegmentedValue;
  onChange?: (e: React.ChangeEvent<ExtendedHTMLInputElement>) => void;
  disabled?: boolean;
  prefixCls?: string;
  direction?: 'ltr' | 'rtl';
  motionName?: string;
}

function normalizeOptions(options: SegmentedOptions): SegmentedLabeledOption[] {
  return options.map((option) => {
    if (typeof option === 'object' && option !== null) {
      // read `value` when label is `undefined`
      const validLabel =
        typeof option.label !== 'undefined'
          ? option.label
          : option.value.toString();
      // read `label` and `value` when htmlTitle is `undefined`
      const validHtmlTitle =
        typeof option.htmlTitle !== 'undefined'
          ? option.htmlTitle
          : React.isValidElement(validLabel)
          ? option.value.toString()
          : validLabel.toString();

      return {
        ...option,
        label: validLabel,
        htmlTitle: validHtmlTitle,
      };
    }
    return {
      label: option?.toString(),
      htmlTitle: option?.toString(),
      value: option,
    };
  });
}

const calcThumbStyle = (targetElement: HTMLElement): React.CSSProperties => ({
  transform: `translateX(${targetElement.offsetLeft}px)`,
  width: targetElement.clientWidth,
});

const InternalSegmentedOption: React.FC<{
  prefixCls: string;
  className?: string;
  disabled?: boolean;
  checked: boolean;
  label: React.ReactNode;
  htmlTitle?: string;
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
  htmlTitle,
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
      <div className={`${prefixCls}-item-label`} title={htmlTitle}>
        {label}
      </div>
    </label>
  );
};

interface ThumbMoveStatus {
  from: React.CSSProperties | null;
  to: React.CSSProperties | null;
}

const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (props, ref) => {
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
    const mergedRef = composeRef<HTMLDivElement>(containerRef, ref);

    const thumbMoveStatus = React.useRef<ThumbMoveStatus>({
      from: null,
      to: null,
    });

    const segmentedOptions = React.useMemo(() => {
      return normalizeOptions(options);
    }, [options]);

    const [selected, setSelected] = useMergedState(segmentedOptions[0]?.value, {
      value,
      defaultValue,
    });

    const [visualSelected, setVisualSelected] = React.useState<
      SegmentedRawOption | undefined
    >(selected);

    const [thumbShow, setThumbShow] = React.useState(false);

    const calcThumbMoveStatus = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const toElement = event.target.closest(`.${prefixCls}-item`);

      const fromElement = containerRef.current?.querySelector(
        `.${prefixCls}-item-selected`,
      );

      if (fromElement && toElement && thumbMoveStatus.current) {
        thumbMoveStatus.current.from = calcThumbStyle(
          fromElement as HTMLElement,
        );
        thumbMoveStatus.current.to = calcThumbStyle(toElement as HTMLElement);

        setThumbShow(true);
      }
    };

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      val: SegmentedRawOption,
    ) => {
      if (disabled) {
        return;
      }

      calcThumbMoveStatus(event);

      setSelected(val);

      if (onChange) {
        const mutatedTarget = Object.create(event.target, {
          value: {
            value: val,
          },
        });
        const mutatedEvent = Object.create(event, {
          target: {
            value: mutatedTarget,
          },
        });
        onChange(mutatedEvent);
      }
    };

    // --- motion event handlers for thumb move
    const handleThumbEnterStart = () => {
      const fromStyle = thumbMoveStatus.current.from;
      if (fromStyle) {
        setVisualSelected(undefined);
        return fromStyle;
      }
    };

    const handleThumbEnterActive = () => {
      const toStyle = thumbMoveStatus.current.to;
      if (toStyle) {
        return toStyle;
      }
    };

    const handleThumbEnterEnd = () => {
      setThumbShow(false);
      setVisualSelected(selected);

      if (thumbMoveStatus.current) {
        thumbMoveStatus.current = {
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
          <InternalSegmentedOption
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

Segmented.defaultProps = {
  options: [],
};

export default Segmented;
