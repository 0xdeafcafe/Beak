import React from 'react';
import { Col } from 'react-grid-system';

import ColumnTitle from '../atoms/ColumnTitle';
import GetStartedButton from '../molecules/GetStartedButton';

const GetStartedColumn: React.FunctionComponent = () => (
	<Col>
		<ColumnTitle>{'Get started'}</ColumnTitle>

		<GetStartedButton
			title={'Create a new project'}
			description={'Creates a new local project'}
		/>

		<GetStartedButton
			title={'Open an existing project'}
			description={'Opens an existing local project'}
		/>

		<GetStartedButton
			disabled
			title={'Create a team project'}
			description={'Creates a new cloud-based team project'}
		/>
	</Col>
);

export default GetStartedColumn;
