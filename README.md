# rc-segmented

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] [![dumi](https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square)](https://github.com/umijs/dumi) [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![Dependencies][david-image]](david-url) [![DevDependencies][david-dev-image]][david-dev-url] [![bundle size][bundlephobia-image]][bundlephobia-url]

[npm-image]: http://img.shields.io/npm/v/rc-segmented.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-segmented
[github-actions-image]: https://github.com/react-component/segmented/workflows/CI/badge.svg
[github-actions-url]: https://github.com/react-component/segmented/actions
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/segmented/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/react-component/segmented/branch/master
[david-url]: https://david-dm.org/react-component/segmented
[david-image]: https://david-dm.org/react-component/segmented/status.svg?style=flat-square
[david-dev-url]: https://david-dm.org/react-component/segmented?type=dev
[david-dev-image]: https://david-dm.org/react-component/segmented/dev-status.svg?style=flat-square
[download-image]: https://img.shields.io/npm/dm/rc-segmented.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-segmented
[bundlephobia-url]: https://bundlephobia.com/result?p=rc-segmented
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/rc-segmented

Pretty segmented react component used in [ant.design](https://ant.design) and [antv.vision](https://antv.vision).

![](https://gw.alipayobjects.com/zos/antfincdn/z4ie3X8x6u/1cb23945-ec67-45a3-b521-f8da62e12255.png)

## Live Demo

https://react-component.github.io/segmented/

## Install

[![rc-segmented](https://nodei.co/npm/rc-segmented.png)](https://npmjs.org/package/rc-segmented)

## Usage

```js
import segmented from 'rc-segmented';
import 'rc-segmented/assets/index.css'; // import 'rc-segmented/asssets/index.less';
import { render } from 'react-dom';

render(
  <segmented
    columns={[
      {
        icon: (
          <img src="https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg" />
        ),
        title: '语雀',
        url: 'https://yuque.com',
        description: '知识创作与分享工具',
        openExternal: true,
      },
    ]}
    bottom="Made with ❤️ by AFX"
  />,
  mountNode,
);
```

## API

| Property         | Type                              | Default        | Description                                 |
| ---------------- | --------------------------------- | -------------- | ------------------------------------------- |
| prefixCls        | string                            | rc-segmented   |                                             |
| className        | string                            | ''             | additional class name of segmented          |
| style            | React.CSSProperties               |                | style properties of segmented               |
| columns          | [Column](#Column) Array           | []             | columns data inside segmented               |
| bottom           | ReactNode                         |                | extra bottom area beneath segmented columns |
| theme            | 'light' \| 'dark'                 | 'dark'         | preset theme of segmented                   |
| backgroundColor  | string                            | '#000'         | background color of segmented               |
| columnLayout     | 'space-around' or 'space-between' | 'space-around' | justify-content value of columns element    |
| maxColumnsPerRow | number                            | -              | max count of columns for each row           |

### Column

| Property  | Type                       | Default | Description                        |
| --------- | -------------------------- | ------- | ---------------------------------- |
| icon      | ReactNode                  |         | icon that before column title      |
| title     | ReactNode                  |         | title of column                    |
| items     | [Item](#Column-Item) Array | []      | items data inside each column      |
| className | string                     | ''      | additional class name of segmented |
| style     | React.CSSProperties        |         | style properties of segmented      |

### Column Item

| Property      | Type                | Default | Description                                             |
| ------------- | ------------------- | ------- | ------------------------------------------------------- |
| icon          | ReactNode           |         | icon that before column title                           |
| title         | ReactNode           |         | title of column                                         |
| description   | ReactNode           |         | description of column, come after title                 |
| url           | string              |         | link url of item title                                  |
| openExternal  | boolean             | false   | link target would be `_blank` if `openExternal` is ture |
| className     | string              | ''      | additional class name of segmented                      |
| style         | React.CSSProperties |         | style properties of segmented                           |
| LinkComponent | React.ReactType     | 'a'     | the link element to render item                         |

## Development

```
npm install
npm start
```

## License

rc-segmented is released under the MIT license.
