import React from 'react';
import classNames from 'classnames';

export interface segmentedColumnItem {
  title: React.ReactNode;
  url?: string;
  openExternal?: boolean;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  LinkComponent?: React.ReactType;
}

export interface segmentedColumn {
  prefixCls?: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  items?: segmentedColumnItem[];
  className?: string;
  style?: React.CSSProperties;
}

const Column: React.FC<segmentedColumn> = ({
  prefixCls,
  icon,
  title,
  items = [],
  style,
  className,
}) => (
  <div className={classNames(`${prefixCls}-column`, className)} style={style}>
    {(title || icon) && (
      <h2>
        {icon && <span className={`${prefixCls}-column-icon`}>{icon}</span>}
        {title}
      </h2>
    )}
    {items.map((item, i) => {
      const LinkComponent = item.LinkComponent || 'a';
      return (
        <div
          className={classNames(`${prefixCls}-item`, item.className)}
          style={item.style}
          key={i}
        >
          <LinkComponent
            href={item.url}
            to={typeof LinkComponent !== 'string' ? item.url : undefined}
            target={item.openExternal ? '_blank' : undefined}
            rel={item.openExternal ? 'noopener noreferrer' : undefined}
          >
            {item.icon && (
              <span className={`${prefixCls}-item-icon`}>{item.icon}</span>
            )}
            {item.title}
          </LinkComponent>
          {item.description && (
            <>
              <span className={`${prefixCls}-item-separator`}>-</span>
              <span className={`${prefixCls}-item-description`}>
                {item.description}
              </span>
            </>
          )}
        </div>
      );
    })}
  </div>
);

export default Column;
