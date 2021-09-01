const fs = require('fs-extra')
const path = require('path')
const { spawn } = require('child_process')

module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'mex',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: './assets/icon.png',
        format: 'ULFO',
      },
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/index.tsx',
              name: 'mex_window',
            },
            {
              html: './src/Spotlight/index.html',
              js: './src/Spotlight/index.tsx',
              name: 'spotlight_window',
            },
          ],
        },
      },
    ],
    [
      '@timfish/forge-externals-plugin',
      {
        externals: ['active-win'],
        includeDeps: true,
      },
    ],
  ],
}