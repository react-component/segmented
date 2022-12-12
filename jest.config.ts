import { createConfig, type Config } from '@umijs/test';

const defaultConfig = createConfig({
  target: 'browser',
});

const config: Config.InitialOptions = {
  ...defaultConfig,
  setupFiles: [
    ...(defaultConfig.setupFiles || []),
    './tests/setup.ts'
  ],
  setupFilesAfterEnv: [
    ...(defaultConfig.setupFilesAfterEnv || []),
    './tests/setupFilesAfterEnv.ts'
  ],
}

export default config;
