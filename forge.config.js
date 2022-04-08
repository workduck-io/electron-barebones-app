const { version } = require('./package.json')
const semver = require('semver')

const checkAlpha = (version) => {
  const parsed = semver.parse(version)
  if (parsed.prerelease[0] === 'alpha') return true

  return false
}
const isAlpha = checkAlpha(version)

const appBundleId = isAlpha ? 'com.workduck.eba-alpha' : 'com.workduck.eba'
const icon = isAlpha ? 'assets/icon-alpha.icns' : 'assets/icon.icns'

module.exports = {
  packagerConfig: {
    icon: icon,
    appBundleId: appBundleId
  },
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
