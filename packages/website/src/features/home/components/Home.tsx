import React from 'react';
import styled from 'styled-components';

import Container from '../../../components/atoms/Container';
import BeakOverview from './molecules/BeakOverview';
import FeatureOverview from './molecules/FeatureOverview';
import HeaderCta from './molecules/HeaderCta';
import SneakPeak from './molecules/SneakPeak';

const Home: React.FunctionComponent = () => (
	<React.Fragment>
		<Header>
			<Container>
				<Title>
					{'The '}
					<span>{'feathery'}</span>{' '}
					{'cross-platform API crafting tool'}
				</Title>
				<SubTitle>
					{'Beak makes building 🛠, spying 🕵️‍♀️, and collaborating 👪 on API '}
					{'development fast, frictionless, and dare we say... fun'}
				</SubTitle>

				<HeaderCta />
				<SneakPeak />
			</Container>
		</Header>
		<Main>
			<Container>
				<FeatureOverview />
				<BeakOverview />
			</Container>
		</Main>
	</React.Fragment>
);

const Header = styled.div`
	padding-top: 125px;
	text-align: center;

	background: ${p => p.theme.ui.background};
`;

const Title = styled.h1`
	margin: 0 auto;
	max-width: 510px;
	padding: 0 25px;
	font-size: 60px;
	font-weight: 800;
	line-height: 75px;

	> span {
		color: ${p => p.theme.ui.textHighlight};
	}
`;

const Main = styled.main`
	position: relative;
	z-index: 1;
	margin-top: -80px;
	padding-top: 80px;

	background: ${p => p.theme.ui.secondaryBackground};
	color: ${p => p.theme.ui.textMinorMuted};
`;

const SubTitle = styled.h2`
	margin: 0 auto;
	margin-top: 20px;
	max-width: 550px;
	padding: 0 25px;

	font-size: 20px;
	font-weight: 100;
	line-height: 35px;
	color: ${p => p.theme.ui.textMinorMuted};
`;

export default Home;
