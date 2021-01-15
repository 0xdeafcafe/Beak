import { IpcDialogServiceMain, ShowMessageBoxReq } from '@beak/common/ipc/dialog';
import { dialog, ipcMain } from 'electron';

import { windowStack } from '../window-management';

const service = new IpcDialogServiceMain(ipcMain);

service.registerShowMessageBox(async (event, payload: ShowMessageBoxReq) => {
	const window = windowStack[event.sender.id]!;
	const result = await dialog.showMessageBox(window, payload);

	return result;
});