import { TypedObject } from '@beak/common/helpers/typescript';
import Squawk from '@beak/common/utils/squawk';
import { differenceInDays } from 'date-fns';

import { createOnboardingWindow, windowStack } from '../window-management';
import logger from './logger';
import nestClient from './nest-client';
import persistentStore from './persistent-store';

class Arbiter {
	start() {
		this.check().catch(error => logger.error('arbiter: preview user check failed', error));

		setInterval(() => {
			this.check().catch(error =>
				logger.error('arbiter: preview user check failed', error),
			);
		}, 1800000); // 30 minutes
	}

	getStatus() {
		return persistentStore.get('arbiter');
	}

	async check() {
		const auth = nestClient.getAuth();
		let status = this.getStatus();

		if (!auth)
			return;

		try {
			await nestClient.ensureAlphaUser();

			status = {
				lastSuccessfulCheck: new Date().toISOString(),
				lastCheckError: null,
				lastCheck: new Date().toISOString(),
				status: true,
			};
		} catch (error) {
			const squawk = Squawk.coerce(error);
			const expired = checkExpired(status.lastSuccessfulCheck);

			logger.warn('arbiter: preview user request failed', error, squawk);

			status = {
				lastSuccessfulCheck: status.lastSuccessfulCheck,
				lastCheckError: squawk,
				lastCheck: new Date().toISOString(),
				status: !expired,
			};

			switch (true) {
				// No internet connection, do nothing
				case squawk.code === 'ENOTFOUND':
					break;

				// Any error that we do know about
				case squawk.code !== 'unknown': {
					nestClient.setAuth(null);
					status.status = false;

					logger.error('Known but unknown error in arbiter fetching', squawk);

					break;
				}

				default:
					break;
			}
		}

		persistentStore.set('arbiter', status);

		if (status.status === false) {
			persistentStore.set('auth', null);

			const onboardingWindowId = createOnboardingWindow();

			TypedObject.values(windowStack).forEach(window => {
				if (window.id !== onboardingWindowId)
					window.close();
			});

			windowStack[onboardingWindowId].focus();
		} else {
			TypedObject.values(windowStack).forEach(window => {
				if (!window)
					return;

				window.webContents.send('arbiter_broadcast', { code: 'status_update', payload: status });
			});
		}
	}
}

function checkExpired(lastSuccessfulCheck: string) {
	const now = new Date();
	const lastCheck = new Date(lastSuccessfulCheck);
	const diff = differenceInDays(now, lastCheck);

	return diff >= 5;
}

const arbiter = new Arbiter();

export default arbiter;
