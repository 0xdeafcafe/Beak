import { ipcNestService } from '@beak/app/lib/ipc';
import { NewsItem, NewsItemType } from '@beak/common/types/nest';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import GenericBanner from './molecules/GenericBanner';

const supportedCodes = ['generic_banner'];

const NewsBannerContainer: React.FunctionComponent = () => {
	const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

	useEffect(() => {
		ipcNestService.listNewsItems().then(items => {
			setNewsItems(items);
		});
	}, []);

	if (newsItems.length === 0)
		return null;

	return (
		<Container>
			{newsItems.map(n => {
				let renderItem: NewsItemType | undefined = void 0;
				const primaryCode = n.primary.code;
				const hasFallback = Boolean(n.fallback);
				const supported = supportedCodes.includes(primaryCode);

				if (supported)
					renderItem = n.primary;
				else if (hasFallback && supportedCodes.includes(n.fallback!.code))
					renderItem = n.fallback!;

				if (!renderItem)
					return null;

				switch (renderItem.code) {
					case 'generic_banner':
						return <GenericBanner key={n.id} item={renderItem} />;

					default:
						return null;
				}
			})}
		</Container>
	);
};

const Container = styled.div`
	padding-bottom: 20px;
`;

export default NewsBannerContainer;
