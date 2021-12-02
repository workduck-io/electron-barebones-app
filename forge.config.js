const { inherits } = require('util')

module.exports = {
  packagerConfig: {
    icon: 'assets/icon.icns'
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'mex'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      }
    }
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
              name: 'mex_window'
            }
          ]
        }
      }
    ],
    [
      '@timfish/forge-externals-plugin',
      {
        externals: ['active-win-universal'],
        includeDeps: true
      }
    ]
  ]
}
