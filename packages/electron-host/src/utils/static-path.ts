import * as path from 'path';

// Is our app packaged in a binary or still in Electron?
// @ts-ignore
const appIsPackaged = !process.defaultApp;

/**
 * Get the path to the `static` folder.
 * This is a temporary hack, waiting for the 2 issues to be fixed.
 *
 * @see https://github.com/electron-userland/electron-webpack/issues/52
 * @see https://github.com/electron-userland/electron-webpack/issues/157
 */
const staticPath = appIsPackaged ? __dirname.replace(/app\.asar$/, 'static') : path.join(process.cwd(), 'static');

export { staticPath };

// file:///Users/afr/Source/github.com/beak-app/beak/packages/electron-host/dist-electron/mac/Beak.app/Contents/Resources/static/index.html?container=welcome&windowId=1
