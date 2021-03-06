import { ProjectFile } from '@beak/common/types/beak-project';
import path from 'path-browserify';

import { readJsonAndValidate } from '../fs';
import { projectSchema } from './schemas';

export async function readProjectFile(projectPath: string) {
	const projectFilePath = path.join(projectPath, 'project.json');
	const { file } = await readJsonAndValidate<ProjectFile>(projectFilePath, projectSchema);

	if (file.version !== '0.2.0')
		throw new Error('Unsupported project version');

	return file;
}
