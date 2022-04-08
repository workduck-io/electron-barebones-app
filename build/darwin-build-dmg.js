const createDMG = require('electron-installer-dmg')
const fs = require('fs')

const cwd = process.cwd()
const path = require('path')

function buildDMG(arch) {
  return createDMG({
    appPath: path.join(cwd, `out/Eba Alpha-darwin-${arch}/Eba Alpha.app`),
    name: 'Eba Alpha',
    title: 'Eba Alpha',
    icon: path.join(cwd, './assets/icon.icns'),
    iconSize: 80,
    format: 'ULFO',
    contents: [
      { x: 448, y: 144, type: 'link', path: '/Applications' },
      {
        x: 192,
        y: 144,
        type: 'file',
        path: path.join(cwd, `out/Eba Alpha-darwin-${arch}/Eba Alpha.app`)
      }
    ],
    overwrite: true,
    out: path.join(cwd, 'out/make'),
    additionalDMGOptions: {
      window: {
        size: { width: 600, height: 320 }
      }
    }
  })
}

function getPackageVersion() {
  const data = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json')))
  return data.version
}

function main(arch) {
  buildDMG(arch)
    .then(() => {
      const version = getPackageVersion()
      const newFilename = `Eba Alpha-${version}-mac-${arch}.dmg`
      fs.renameSync(path.join(cwd, 'out/make/Eba Alpha.dmg'), path.join(cwd, 'out/make', newFilename))
    })
    .catch((err) => console.log(err))
}

const arch = process.argv[2]
main(arch)
