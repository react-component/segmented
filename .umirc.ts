// more config: https://d.umijs.org/config
import { defineConfig } from 'dumi';

const basePath = process.env.GH_PAGES ? '/segmented/' : '/';
const publicPath = process.env.GH_PAGES ? '/segmented/' : '/';

export default defineConfig({
  title: 'rc-segmented',
  favicon: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  outputPath: '.doc',
  exportStatic: {},
  base: basePath,
  publicPath,
  hash: true,
  styles: [
    `
      .markdown table {
        width: auto !important;
      }
    `,
  ],
});
