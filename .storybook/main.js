// Storybook 10 configuration. The stories live in one CSF file so the
// component helpers (lottie-control etc.) are not picked up as stories.
export default {
  stories: ['../src/stories/**/*.stories.js'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  // The package keeps JSX in plain .js files (src/index.js), so tell Vite to
  // parse those with the JSX loader as well.
  viteFinal: async (config) => {
    config.esbuild = {
      ...(config.esbuild || {}),
      include: /\/src\/.*\.js$/,
      // Vite excludes plain .js files from the esbuild transform by default.
      exclude: [],
      loader: 'jsx',
    };

    // The dependency pre-bundler also scans the stories and needs to know that
    // plain .js files in src contain JSX.
    config.optimizeDeps = {
      ...(config.optimizeDeps || {}),
      esbuildOptions: {
        ...((config.optimizeDeps || {}).esbuildOptions || {}),
        loader: {
          ...(((config.optimizeDeps || {}).esbuildOptions || {}).loader || {}),
          '.js': 'jsx',
        },
      },
    };
    return config;
  },
};
