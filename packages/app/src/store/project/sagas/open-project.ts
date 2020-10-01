import { call, put, setContext } from 'redux-saga/effects';
import { PayloadAction } from 'typesafe-actions';

import { setProjectSingleton } from '@beak/common/src/beak-project';
import BeakProject from '@beak/common/src/beak-project/project';
import { RequestNode } from '@beak/common/src/beak-project/types';
import * as actions from '../actions';

export default function* workerOpenProject({ payload }: PayloadAction<string, { projectPath: string }>) {
	const { projectPath } = payload;
	const project = new BeakProject(projectPath);

	setProjectSingleton(project);

	yield call([project, project.loadProject]);
	yield call([project, project.loadTree]);
	// yield call([project, project.printTree]);
	yield call([project, project.startWatching]);
	yield setContext({ beakProject: project });

	const pf = project.getProject()!;
	const pp = project.getProjectPath();
	const tree = project.getTree();

	yield put(actions.projectOpened({
		name: pf.name,
		projectPath: pp,
		tree,
	}));

	// TODO(afr): Remove this, is just for debugging
	const firstRequest = Object.values(tree).filter(n => n.type === 'request')[0] as RequestNode;

	yield put(actions.requestSelected(firstRequest.id));
}