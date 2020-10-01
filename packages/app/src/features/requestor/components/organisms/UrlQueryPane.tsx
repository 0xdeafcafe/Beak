import { RequestNode, ToggleKeyValue } from '@beak/common/src/beak-project/types';
import { TypedObject } from '@beak/common/src/helpers/typescript';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { actions } from '../../../../store/project';

export interface UrlQueryPaneProps {
	node: RequestNode;
}

const UrlQueryPane: React.FunctionComponent<UrlQueryPaneProps> = ({ node }) => {
	const dispatch = useDispatch();
	const requestId = node.id;

	function onChange(type: keyof ToggleKeyValue, queryId: string, value: string | boolean) {
		const payload = {
			requestId,
			queryId,
			[type]: value,
		};

		dispatch(actions.requestQueryUpdated(payload));
	}

	return (
		<React.Fragment>
			<EntryTable>
				<thead>
					<tr>
						<Header></Header>
						<Header>{'Name'}</Header>
						<Header>{'Value'}</Header>
						<Header></Header>
					</tr>
				</thead>
				<tbody>
					{TypedObject.keys(node.info.uri.query).map(k => {
						const entry = node.info.uri.query[k];

						return (
							<Row key={k}>
								<ToggleCell>
									<InputToggle
										type={'checkbox'}
										checked={entry.enabled}
										onChange={e => onChange('enabled', k, e.target.checked)}
									/>
								</ToggleCell>
								<td>
									<InputText
										value={entry.name}
										onChange={e => onChange('name', k, e.target.value)}
									/>
								</td>
								<td>
									<InputText
										value={entry.value}
										onChange={e => onChange('value', k, e.target.value)}
									/>
								</td>
								<ToggleCell>
									<Button>{'Remove'}</Button>
								</ToggleCell>
							</Row>
						);
					})}
				</tbody>
			</EntryTable>

			<AddButtonWrapper>
				<Button>{'Add'}</Button>
			</AddButtonWrapper>
		</React.Fragment>
	);
};

const EntryTable = styled.table`
	width: 100%;
	border-collapse: collapse;
`;

const Header = styled.th`
	text-align: left;
	font-size: 13px;
	font-weight: 400;

	color: ${props => props.theme.ui.textOnFill};
`;

const Row = styled.tr`
	border-bottom: 1px solid ${props => props.theme.ui.backgroundBorderSeparator};
`;

const ToggleCell = styled.td`
	width: 20px;
`;

const InputToggle = styled.input`

`;

const InputText = styled.input`
	width: calc(100% - 10px);
	border: none;
	background: transparent;
	padding: 2px 5px;
	margin: 0; margin-bottom: -2px;
	border: 1px solid transparent;

	color: ${props => props.theme.ui.textOnFill};
	font-size: 12px;

	&:focus {
		outline: none;
		border: 1px solid ${props => props.theme.ui.primaryFill};
	}
`;

const Button = styled.button`
	background: transparent;
	border: 1px solid ${props => props.theme.ui.backgroundBorderSeparator};
	border-radius: 10px;
	color: ${props => props.theme.ui.textOnSurfaceBackground};

	padding: 3px 8px;
	font-size: 11px;

	&:hover, &:focus {
		outline: none;
		border-color: ${props => props.theme.ui.primaryFill};
	}
	&:active {
		background-color: ${props => props.theme.ui.primaryFill};
	}
`;

const AddButtonWrapper = styled.div`
	display: flex;
	justify-content: flex-end;

	margin-top: 10px;
	margin-right: 2px;
`;

export default UrlQueryPane;