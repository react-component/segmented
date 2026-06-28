<div align="center">
  <h1>@rc-component/segmented</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
  <p>🧩 React 分段控制器组件。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/segmented"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/segmented.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/segmented"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/segmented.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/segmented/actions/workflows/react-component-ci.yml"><img alt="build status" src="https://github.com/react-component/segmented/actions/workflows/react-component-ci.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/segmented"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/segmented/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/segmented"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/segmented?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>

## 特性

- 支持字符串、数字和带标签的选项记录。
- 提供受控和不受控的价值流。
- 包括键盘导航、RTL、垂直布局和禁用选项。
- 引入用于项目和标签定制的语义 `classNames` 和 `styles` 插槽。

## 安装

```bash
npm install @rc-component/segmented
```

## 使用

```tsx pure
import Segmented from '@rc-component/segmented';
import '@rc-component/segmented/assets/index.css';

export default () => (
  <Segmented
    options={['Daily', 'Weekly', 'Monthly']}
    defaultValue="Weekly"
    onChange={(value) => {
      console.log(value);
    }}
  />
);
```

在线预览：https://segmented.react-component.vercel.app/

## 示例

运行本地 dumi 站点：

```bash
npm install
npm start
```

然后打开 `http://localhost:8000`。

## API

### Segmented

| 名称           | 类型                                                                     | 默认值           | 说明                         |
| -------------- | ------------------------------------------------------------------------ | ---------------- | ---------------------------- |
| `className`    | string                                                                   | `''`             | 附加 className。             |
| `classNames`   | Partial<Record<'item' \| 'label', string>>                               | -                | 内部插槽的语义化 className。 |
| `defaultValue` | string \| number                                                         | 第一个选项值     | 初始选中值。                 |
| `direction`    | `'ltr'` \| `'rtl'`                                                       | -                | 布局方向。                   |
| `disabled`     | boolean                                                                  | false            | 禁用所有选项。               |
| `itemRender`   | `(node: ReactNode, info: { item: SegmentedLabeledOption }) => ReactNode` | identity         | 自定义选项项渲染器。         |
| `motionName`   | string                                                                   | `'thumb-motion'` | 活动拇指的动画 className。   |
| `name`         | string                                                                   | -                | 单选组名称。                 |
| `onChange`     | `(value: string \| number) => void`                                      | -                | 当所选值更改时触发。         |
| `options`      | Array<string \| number \| SegmentedLabeledOption>                        | -                | 可用选项，必填。             |
| `prefixCls`    | string                                                                   | `'rc-segmented'` | className 前缀。             |
| `style`        | React.CSSProperties                                                      | -                | 根样式。                     |
| `styles`       | Partial<Record<'item' \| 'label', React.CSSProperties>>                  | -                | 内部插槽的语义化样式。       |
| `value`        | string \| number                                                         | -                | 受控选中值。                 |
| `vertical`     | boolean                                                                  | false            | 垂直渲染选项。               |

其他合法的 `div` 属性会透传给根元素。

### SegmentedLabeledOption

| 名称        | 类型             | 默认值   | 说明             |
| ----------- | ---------------- | -------- | ---------------- |
| `className` | string           | -        | 选项 className。 |
| `disabled`  | boolean          | false    | 禁用此选项。     |
| `label`     | ReactNode        | -        | 展示的选项内容。 |
| `title`     | string           | 源自标签 | 标签的原生标题。 |
| `value`     | string \| number | -        | 选项值。         |

## 本地开发

```bash
npm install
npm start
npm test
npm run tsc
npm run compile
npm run build
```

dumi 站点默认运行在 `http://localhost:8000`。

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/segmented 基于 [MIT](./LICENSE) 许可证发布。
