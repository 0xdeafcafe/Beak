import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as uuid from 'uuid';

import { staticPath } from './utils/static-path';

type Container = 'about' | 'project-main' | 'welcome';

const DEV_URL = 'http://localhost:3000';
const environment = process.env.NODE_ENV;

export const windowStack: Record<string, BrowserWindow> = {};

function generateLoadUrl(container: Container, additionalParams?: Record<string, string>) {
	let loadUrl = new URL(url.format({
		pathname: path.join(staticPath, 'dist', 'index.html'),
		protocol: 'file:',
		slashes: true,
	}));

	if (environment !== 'production')
		loadUrl = new URL(DEV_URL);

	if (additionalParams) {
		Object.keys(additionalParams).forEach(k => {
			if (k === 'container')
				return; // Just to be extra safe

			const urlSafe = encodeURIComponent(additionalParams[k]);

			loadUrl.searchParams.set(k, urlSafe);
		});
	}

	loadUrl.searchParams.set('container', container);

	return loadUrl.toString();
}

function createWindow(
	windowOpts: BrowserWindowConstructorOptions,
	container: Container,
	additionalParams?: Record<string, string>,
) {
	const windowId = uuid.v4();
	const window = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
		},
		...windowOpts,
	});

	window.loadURL(generateLoadUrl(container, additionalParams));
	window.on('closed', () => {
		delete windowStack[windowId];
	});

	windowStack[windowId] = window;
}

export function createWelcomeWindow() {
	const windowOpts = {
		height: 550,
		width: 900,
		frame: false,
		resizable: false,
		title: 'Welcome to Beak!',
	};

	createWindow(windowOpts, 'welcome');
}

export function createAboutWindow() {
	const windowOpts: BrowserWindowConstructorOptions = {
		height: 500,
		width: 450,
		titleBarStyle: 'hiddenInset',
		maximizable: false,
		resizable: false,
		title: 'About Beak',
	};

	createWindow(windowOpts, 'about');
}

export function createProjectMainWindow(projectFilePath: string) {
	const windowOpts: BrowserWindowConstructorOptions = {
		height: 580,
		width: 980,
		minHeight: 435,
		minWidth: 760,
		title: 'Loading... - Beak',
	};

	createWindow(windowOpts, 'project-main', { projectFilePath });
}