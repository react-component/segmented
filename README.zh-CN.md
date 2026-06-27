<div align="center">
  <h1>@rc-component/segmented</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
  <p>🧩 React 分段控制器组件。</p>

  <p>
    <a href="https://www.npmjs.com/package/@rc-component/segmented"><img src="https://img.shields.io/npm/v/@rc-component/segmented.svg?style=flat-square" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@rc-component/segmented"><img src="https://img.shields.io/npm/dm/@rc-component/segmented.svg?style=flat-square" alt="npm downloads" /></a>
    <a href="https://github.com/react-component/segmented/actions"><img src="https://github.com/react-component/segmented/actions/workflows/react-component-ci.yml/badge.svg" alt="CI" /></a>
    <a href="https://codecov.io/gh/react-component/segmented"><img src="https://codecov.io/gh/react-component/segmented/branch/master/graph/badge.svg" alt="Codecov" /></a>
    <a href="https://bundlephobia.com/package/@rc-component/segmented"><img src="https://badgen.net/bundlephobia/minzip/@rc-component/segmented" alt="bundle size" /></a>
    <a href="https://github.com/umijs/dumi"><img src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square" alt="dumi" /></a>
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

## API

### Segmented

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `className` | string | `''` | 附加className。 |
| `classNames` | 部分<记录<'项目'\| '标签'，字符串>> | - | 内部插槽的语义化 className。 |
| `defaultValue` | string \| number | 第一个选项值 | 初始选中值。 |
| `direction` | `'ltr'` \| `'rtl'` | - | Layout direction. |
| `disabled` | boolean | false | 禁用所有选项。 |
| `itemRender` | `(node: ReactNode, info: { item: SegmentedLabeledOption }) => ReactNode` | identity | 自定义选项项渲染器。 |
| `motionName` | string | `'thumb-motion'` | 活动拇指的运动className称。 |
| `name` | string | - | Radio group name. |
| `onChange` | `(value: string \| number) => void` | - | 当所选值更改时触发。 |
| `options` | Array<string \| number \| SegmentedLabeledOption> | - | 可用选项，必填。 |
| `prefixCls` | string | `'rc-segmented'` | 前缀className。 |
| `style` | React.CSSProperties | - | 根样式。 |
| `styles` | 部分<记录<'项目'\| '标签'，React.CSSProperties>> | - | 内部插槽的语义化样式。 |
| `value` | string \| number | - | 受控选中值。 |
| `vertical` | boolean | false | 垂直渲染选项。 |

其他合法的 `div` 属性会透传给根元素。

### SegmentedLabeledOption

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `className` | string | - | 选项className称。 |
| `disabled` | boolean | false | 禁用此选项。 |
| `label` | ReactNode | - | 展示的选项内容。 |
| `title` | string | 源自标签 | 标签的原生标题。 |
| `value` | string \| number | - | 选项值。 |

## 本地开发

```bash
npm install
npm start
npm test
npm run tsc
npm run compile
npm run build
```

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/segmented 基于 [MIT](./LICENSE.md) 许可证发布。
