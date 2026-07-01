<div align="center">
  <h1>@rc-component/segmented</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Part of the Ant Design ecosystem.</sub></p>
  <p>🧩 React segmented control for switching between compact options.</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/segmented"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/segmented.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/segmented"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/segmented.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/segmented/actions/workflows/react-component-ci.yml"><img alt="build status" src="https://github.com/react-component/segmented/actions/workflows/react-component-ci.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/segmented"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/segmented/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/segmented"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/segmented?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center">English | <a href="./README.zh-CN.md">简体中文</a></p>


## Highlights

- Supports string, number, and labeled option records.
- Provides controlled and uncontrolled value flows.
- Includes keyboard navigation, RTL, vertical layout, and disabled options.
- Exposes semantic `classNames` and `styles` slots for item and label customization.

## Install

```bash
npm install @rc-component/segmented
```

## Usage

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

Online preview: https://segmented.react-component.vercel.app/

## Examples

Run the local dumi site:

```bash
npm install
npm start
```

Then open `http://localhost:8000`.

## API

### Segmented

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | string | `''` | Additional class name. |
| `classNames` | Partial<Record<'item' \| 'label', string>> | - | Semantic class names for internal slots. |
| `defaultValue` | string \| number | first option value | Initial selected value. |
| `direction` | `'ltr'` \| `'rtl'` | - | Layout direction. |
| `disabled` | boolean | false | Disable all options. |
| `itemRender` | `(node: ReactNode, info: { item: SegmentedLabeledOption }) => ReactNode` | identity | Custom option item renderer. |
| `motionName` | string | `'thumb-motion'` | Motion class name for the active thumb. |
| `name` | string | - | Radio group name. |
| `onChange` | `(value: string \| number) => void` | - | Triggered when the selected value changes. |
| `options` | Array<string \| number \| SegmentedLabeledOption> | - | Available options. Required. |
| `prefixCls` | string | `'rc-segmented'` | Prefix class name. |
| `style` | React.CSSProperties | - | Root style. |
| `styles` | Partial<Record<'item' \| 'label', React.CSSProperties>> | - | Semantic styles for internal slots. |
| `value` | string \| number | - | Controlled selected value. |
| `vertical` | boolean | false | Render options vertically. |

Additional valid `div` props are passed to the root element.

### SegmentedLabeledOption

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | string | - | Option class name. |
| `disabled` | boolean | false | Disable this option. |
| `label` | ReactNode | - | Displayed option content. |
| `title` | string | derived from label | Native title for the label. |
| `value` | string \| number | - | Option value. |

## Development

```bash
npm install
npm start
npm test
npm run tsc
npm run compile
npm run build
```

The dumi site runs at `http://localhost:8000` by default.

## Release

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command after the package build.

## License

@rc-component/segmented is released under the [MIT](./LICENSE) license.
