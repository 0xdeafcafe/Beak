import BasicTableEditor from '@beak/app/features/basic-table-editor/components/BasicTableEditor';
import actions from '@beak/app/store/project/actions';
import { RequestPreferenceMainTab } from '@beak/common/dist/types/beak-hub';
import { RequestNode } from '@beak/common/types/beak-project';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import TabBar from '../../../../components/atoms/TabBar';
import TabItem from '../../../../components/atoms/TabItem';
import TabSpacer from '../../../../components/atoms/TabSpacer';
import RequestPreferencesContext from '../../contexts/request-preferences-context';
import BodyTab from './BodyTab';
import OptionsView from './OptionsView';

export interface ModifiersProps {
	node: RequestNode;
}

const Modifiers: React.FunctionComponent<ModifiersProps> = props => {
	const dispatch = useDispatch();
	const reqPref = useContext(RequestPreferencesContext)!;
	const { node } = props;
	const [tab, setTabInner] = useState<RequestPreferenceMainTab>(reqPref.getPreferences().mainTab);

	function setTab(tab: RequestPreferenceMainTab) {
		setTabInner(tab);

		reqPref.setMainTab(tab);
	}

	return (
		<Container>
			<TabBar centered>
				<TabSpacer />
				<TabItem
					active={tab === 'headers'}
					onClick={() => setTab('headers')}
				>
					{'Headers'}
				</TabItem>
				<TabItem
					active={tab === 'url_query'}
					onClick={() => setTab('url_query')}
				>
					{'URL query'}
				</TabItem>
				<TabItem
					active={tab === 'body'}
					onClick={() => setTab('body')}
				>
					{'Body'}
				</TabItem>
				<TabItem
					active={tab === 'options'}
					onClick={() => setTab('options')}
				>
					{'Options'}
				</TabItem>
				<TabSpacer />
			</TabBar>

			<TabBody>
				{tab === 'headers' && (
					<BasicTableEditor
						items={node.info.headers}
						addItem={() => dispatch(actions.requestHeaderAdded({ requestId: node.id }))}
						removeItem={id => dispatch(actions.requestHeaderRemoved({
							requestId: node.id,
							identifier: id,
						}))}
						updateItem={(type, id, value) => dispatch(actions.requestHeaderUpdated({
							requestId: node.id,
							identifier: id,
							[type]: value,
						}))}
					/>
				)}
				{tab === 'url_query' && (
					<BasicTableEditor
						items={node.info.query}
						addItem={() => dispatch(actions.requestQueryAdded({ requestId: node.id }))}
						removeItem={id => dispatch(actions.requestQueryRemoved({
							requestId: node.id,
							identifier: id,
						}))}
						updateItem={(type, id, value) => dispatch(actions.requestQueryUpdated({
							requestId: node.id,
							identifier: id,
							[type]: value,
						}))}
					/>
				)}
				{tab === 'body' && <BodyTab node={node} />}
				{tab === 'options' && <OptionsView node={node} />}
			</TabBody>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
`;

const TabBody = styled.div`
	flex-grow: 2;

	overflow-y: auto;
	height: 100%;
`;

export default Modifiers;
