import { defineConfig } from 'dumi';
import path from 'path';

const basePath = process.env.GH_PAGES ? '/segmented/' : '/';
const publicPath = basePath;

export default defineConfig({
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'Segmented',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
  outputPath: 'docs-dist',
  exportStatic: {},
  base: basePath,
  publicPath,
  alias: {
    '@rc-component/segmented$': path.resolve(__dirname, 'src/index.tsx'),
    '@rc-component/segmented/es': path.resolve(__dirname, 'src'),
    '@rc-component/segmented/assets': path.resolve(__dirname, 'assets'),
  },
});
