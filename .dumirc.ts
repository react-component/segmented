import { defineConfig } from 'dumi';
import path from 'path';

const basePath = process.env.GH_PAGES ? '/segmented/' : '/';
const publicPath = process.env.GH_PAGES ? '/segmented/' : '/';

export default defineConfig({
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'Segmented',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
  outputPath: '.doc',
  exportStatic: {},
  base: basePath,
  publicPath,
  alias: {
    'rc-segmented': path.resolve(__dirname, 'src/index.tsx'),
  },
});
