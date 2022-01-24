import React from 'react';
import classNames from 'classnames';
import Column, { segmentedColumn } from './column';

export interface segmentedProps {
  prefixCls?: string;
  bottom?: React.ReactNode;
  maxColumnsPerRow?: number;
  columns?: segmentedColumn[];
  theme?: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
  backgroundColor?: string;
  columnLayout?: 'space-around' | 'space-between';
}

const segmented: React.FC<segmentedProps> = ({
  prefixCls = 'rc-segmented',
  className,
  style,
  bottom,
  columns,
  maxColumnsPerRow,
  backgroundColor,
  columnLayout,
  theme = 'dark',
  ...restProps
}) => {
  const segmentedClassName = classNames(`${prefixCls}`, className, {
    [`${prefixCls}-${theme}`]: !!theme,
  });
  const shouldWrap =
    typeof maxColumnsPerRow === 'number' && maxColumnsPerRow > 0;
  return (
    <segmented
      {...restProps}
      className={segmentedClassName}
      style={{
        ...style,
        backgroundColor,
      }}
    >
      <section className={`${prefixCls}-container`}>
        {columns && columns.length > 0 && (
          <section
            className={`${prefixCls}-columns`}
            style={{
              justifyContent: columnLayout,
              flexWrap: shouldWrap ? 'wrap' : undefined,
            }}
          >
            {columns.map(
              (
                {
                  title,
                  icon,
                  style: columnStyle,
                  className: columnClassName,
                  items = [],
                },
                i,
              ) => {
                const styleObject = { ...columnStyle } as React.CSSProperties;
                if (shouldWrap) {
                  styleObject.flex = `0 0 ${
                    100 / (maxColumnsPerRow! + 1) + 0.1
                  }%`;
                }
                return (
                  <Column
                    key={i}
                    prefixCls={prefixCls}
                    title={title}
                    icon={icon}
                    items={items}
                    style={styleObject}
                    className={columnClassName}
                  />
                );
              },
            )}
          </section>
        )}
      </section>
      {bottom && (
        <section className={`${prefixCls}-bottom`}>
          <div className={`${prefixCls}-bottom-container`}>{bottom}</div>
        </section>
      )}
    </segmented>
  );
};

export default segmented;
