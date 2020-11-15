import { ReflexSplitter as RS, ReflexSplitterProps as RSP } from 'react-reflex';
import styled from 'styled-components';

// TODO(afr): Get rid of importants when css import is removed

export interface ReflexSplitterProps extends RSP {
	orientation: 'horizontal' | 'vertical';
	hideVisualIndicator?: boolean;
}

const ReflexSplitter = styled(RS)<ReflexSplitterProps>`
	width: ${props => props.orientation === 'vertical' ? '2px' : 'auto'} !important;
	height: ${props => props.orientation === 'horizontal' ? '2px' : 'auto'} !important;
	background-color: ${props => props.theme.ui.backgroundBorderSeparator} !important;
	border: none !important;

	${p => p.hideVisualIndicator ? `
	background: linear-gradient(
		${p.theme.ui.background} 0px,
		${p.theme.ui.background} 72px,
		${p.theme.ui.surface} 73px,
		${p.theme.ui.surface} 100%
	);
	` : ''}
`;

export default ReflexSplitter;
