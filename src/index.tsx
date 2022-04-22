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
  title?: string;
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
      <div className={`${prefixCls}-item-label`} title={title}>
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
      value: props.value,
      defaultValue,
    });

    const [visualSelected, setVisualSelected] = React.useState<
      SegmentedRawOption | undefined
    >(selected);

    const latestVisualSelected = React.useRef(visualSelected);

    React.useEffect(() => {
      latestVisualSelected.current = visualSelected;
    });

    const [thumbShow, setThumbShow] = React.useState(false);

    const doThumbAnimation = React.useCallback(
      (selectedValue: SegmentedRawOption) => {
        const segmentedItemIndex = segmentedOptions.findIndex(
          (n) => n.value === selectedValue,
        );

        // find target element
        const toElement = containerRef.current?.querySelector(
          `.${prefixCls}-item:nth-child(${segmentedItemIndex + 1})`,
        );

        if (toElement) {
          // find source element
          const fromElement = containerRef.current?.querySelector(
            `.${prefixCls}-item-selected`,
          );

          if (fromElement && toElement && thumbMoveStatus.current) {
            // calculate for thumb moving animation
            thumbMoveStatus.current.from = calcThumbStyle(
              fromElement as HTMLElement,
            );
            thumbMoveStatus.current.to = calcThumbStyle(
              toElement as HTMLElement,
            );

            // trigger css-motion starts
            setThumbShow(true);
          }
        }
      },
      [prefixCls, segmentedOptions],
    );

    React.useEffect(() => {
      // Syncing `visualSelected` when `selected` changed
      // and do thumb animation
      if (
        (typeof selected === 'string' || typeof selected === 'number') &&
        selected !== latestVisualSelected.current
      ) {
        doThumbAnimation(selected);
      }
    }, [selected]);

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      val: SegmentedRawOption,
    ) => {
      if (disabled) {
        return;
      }

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
            className={classNames(
              segmentedOption.className,
              `${prefixCls}-item`,
              {
                [`${prefixCls}-item-selected`]:
                  segmentedOption.value === visualSelected,
              },
            )}
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
