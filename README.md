<div align="center">
  <h1>@rc-component/segmented</h1>
  <p>🧩 React segmented control for switching between compact options.</p>
  <p>
    <img alt="Ant Design" src="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FBw7Rr5aC7AAAAAAAAAAAAAADrJ8AQ/original" height="24" />
  </p>
  <p>Part of the Ant Design ecosystem.</p>

  <p>
    <a href="https://www.npmjs.com/package/@rc-component/segmented"><img src="https://img.shields.io/npm/v/@rc-component/segmented.svg?style=flat-square" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@rc-component/segmented"><img src="https://img.shields.io/npm/dm/@rc-component/segmented.svg?style=flat-square" alt="npm downloads" /></a>
    <a href="https://github.com/react-component/segmented/actions"><img src="https://github.com/react-component/segmented/actions/workflows/react-component-ci.yml/badge.svg" alt="CI" /></a>
    <a href="https://codecov.io/gh/react-component/segmented"><img src="https://codecov.io/gh/react-component/segmented/branch/master/graph/badge.svg" alt="Codecov" /></a>
    <a href="https://bundlephobia.com/package/@rc-component/segmented"><img src="https://badgen.net/bundlephobia/minzip/@rc-component/segmented" alt="bundle size" /></a>
    <a href="https://github.com/umijs/dumi"><img src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square" alt="dumi" /></a>
  </p>
</div>

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

## Release

```bash
npm run prepublishOnly
```

`prepublishOnly` builds the package with Father and publishes through `rc-np`. Run `npm run gh-pages` to deploy the dumi site.

## License

@rc-component/segmented is released under the MIT license.
