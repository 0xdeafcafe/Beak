import React, { useState } from 'react';
import styled from 'styled-components';

import TabBar from '../../../../components/atoms/TabBar';
import TabItem from '../../../../components/atoms/TabItem';
import TabSpacer from '../../../../components/atoms/TabSpacer';
import { Flight } from '../../../../store/flight/types';
import DebuggerPane from './DebuggerPane';

type Tab = 'debugging' | 'overview' | 'request' | 'response';

export interface InspectorTabsProps {
	flight: Flight;
}

const InspectorTabs: React.FunctionComponent<InspectorTabsProps> = props => {
	const [tab, setTab] = useState<Tab>('debugging');

	return (
		<React.Fragment>
			<TabBar centered>
				<TabSpacer />
				<TabItem
					active={tab === 'debugging'}
					onClick={() => setTab('debugging')}
				>
					{'Debugging'}
				</TabItem>
				<TabItem
					active={tab === 'overview'}
					onClick={() => setTab('overview')}
				>
					{'Overview'}
				</TabItem>
				<TabItem
					active={tab === 'request'}
					onClick={() => setTab('request')}
				>
					{'Request'}
				</TabItem>
				<TabItem
					active={tab === 'response'}
					onClick={() => setTab('response')}
				>
					{'Response'}
				</TabItem>
				<TabSpacer />
			</TabBar>

			<TabBody>
				{tab === 'debugging' && <DebuggerPane flight={props.flight} />}
			</TabBody>
		</React.Fragment>
	);
};

const TabBody = styled.div`
	flex-grow: 2;

	overflow-y: auto;

	padding: 0 15px;
`;

export default InspectorTabs;
