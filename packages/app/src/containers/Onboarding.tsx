import Squawk from '@beak/common/utils/squawk';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import Button from '../components/atoms/Button';
import FormError from '../components/atoms/FormError';
import FormInput from '../components/atoms/FormInput';
import Input from '../components/atoms/Input';
import Label from '../components/atoms/Label';
import { isDarwin } from '../globals';
import { ipcNestService } from '../lib/ipc';

const { ipcRenderer } = window.require('electron');

const Onboarding: React.FunctionComponent = () => {
	const [emailAddress, setEmailAddress] = useState('');
	const [manualInfo, setManualInfo] = useState('');
	const [doing, setDoing] = useState(false);
	const [error, setError] = useState<Squawk>();
	const [magicError, setMagicError] = useState<Squawk>();
	const inputRef = useRef<HTMLInputElement>();
	const [done, setDone] = useState(false);
	const [resender, setResender] = useState<number | null>(null);
	const [showManualInfo, setShowManualInfo] = useState(false);
	const enabled = emailAddress && !doing && !done;

	useEffect(() => {
		ipcRenderer.on('inbound-magic-link', (_event, payload: { code: string; state: string }) => {
			ipcNestService
				.handleMagicLink({ ...payload, fromOnboarding: true })
				.catch(error => {
					setMagicError(error);
				});
		});
	}, []);

	useEffect(() => {
		if (resender === null)
			return;

		const newVal = resender - 1;

		if (newVal >= 0)
			window.setTimeout(() => setResender(newVal), 1000);
		else
			setResender(null);
	}, [resender]);

	useEffect(() => {
		inputRef.current?.focus();
	}, [inputRef.current]);

	function sendMagicLink() {
		inputRef.current?.blur();

		setDoing(true);
		setDone(false);
		setShowManualInfo(false);
		setManualInfo('');
		setError(void 0);

		ipcNestService.sendMagicLink(emailAddress)
			.then(() => {
				setDone(true);
				setResender(30);
			})
			.catch(error => setError(error))
			.finally(() => setDoing(false));
	}

	function validManualInfo() {
		const params = new URLSearchParams(manualInfo);
		const code = params.get('code');
		const state = params.get('state');

		return Boolean(code && state);
	}

	function submitManualInfo() {
		const params = new URLSearchParams(manualInfo);
		const code = params.get('code')!;
		const state = params.get('state')!;

		ipcNestService
			.handleMagicLink({ code, state, fromOnboarding: true })
			.catch(error => {
				setMagicError(error);
			});
	}

	function getButtonContent() {
		if (doing)
			return 'Sending magic link';

		if (resender !== null)
			return `Resend (${resender}s)`;

		return 'Send magic link';
	}

	return (
		<Wrapper>
			<DragBar />

			<Container>
				<Title>{'Welcome to the Beak Beta!'}</Title>
				<SubTitle>
					{'To sign in please enter the email address enrolled in the Beta Beta. '}
					{'We\'ll send you a magic link you can use to sign in. If you aren\'t in the Beta yet, you can '}
					{'request access over at '}
					<Anchor
						target={'_blank'}
						href={'https://getbeak.app'}
					>
						{'https://getbeak.app'}
					</Anchor>
				</SubTitle>

				<FormInput>
					<Label>{'Email address'}</Label>
					<Input
						placeholder={'taylor.swift@gmail.com'}
						value={emailAddress}
						type={'text'}
						ref={i => {
							inputRef.current = i!;
						}}
						onChange={e => setEmailAddress(e.target.value)}
						onKeyDown={e => {
							if (!enabled)
								return;

							if (e.key === 'Enter')
								sendMagicLink();
						}}
					/>
					{error && (
						<FormError>
							{`There was a problem sending the magic link (${error.code})`}
						</FormError>
					)}
				</FormInput>

				{done && (
					<React.Fragment>
						<SmolPara>
							{'Your magic link is on the way to '}
							<strong>{emailAddress}</strong>
							{'. Click the link in the email to sign into Beak.'}
						</SmolPara>

						{magicError && (
							<FormError>
								{`There was a problem with that magic link (${magicError.code})`}
							</FormError>
						)}

						{!showManualInfo && (
							<OtherSmolPara>
								{'Link in the email not opening Beak? '}
								<ShowManualInfo onClick={() => setShowManualInfo(true)}>
									{'Click here'}
								</ShowManualInfo>
							</OtherSmolPara>
						)}

						{showManualInfo && (
							<React.Fragment>
								<Label>
									{'Paste the code from the magic page below 👇'}
								</Label>
								<Input
									placeholder={'code=xxxx&state=xxyy'}
									value={manualInfo}
									type={'text'}
									onChange={e => setManualInfo(e.target.value)}
								/>
								<ManualButton
									disabled={!validManualInfo()}
									onClick={() => submitManualInfo()}
								>
									{'Submit magics'}
								</ManualButton>
							</React.Fragment>
						)}
					</React.Fragment>
				)}

				<ActionsWrapper>
					<Button
						disabled={!enabled}
						onClick={() => sendMagicLink()}
					>
						{getButtonContent()}
					</Button>
				</ActionsWrapper>
			</Container>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background: ${props => props.theme.ui.background};
	height: 100vh;
`;

const DragBar = styled.div`
	-webkit-app-region: drag;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 60px;
`;

const Container = styled.div`
	position: relative;
	padding: 15px;
	height: calc(100vh - 30px);

	z-index: 2;
`;

const Title = styled.h1`
	margin: 0;
	margin-bottom: 5px;
	${isDarwin() && 'margin-top: 15px;'}
	font-size: 28px;
	font-weight: 300;
`;

const SubTitle = styled.h2`
	font-size: 14px;
	margin: 0;
	margin-bottom: 10px;
	font-weight: 400;
	color: ${props => props.theme.ui.textMinor};
`;

const Anchor = styled.a`
	color: #e08130;
`;

const ActionsWrapper = styled.div`
	position: absolute;
	bottom: 15px;
	right: 15px;
`;

const SmolPara = styled.p`
	margin-top: 0;
	font-size: 13px;
`;

const OtherSmolPara = styled(SmolPara)`
	margin-top: 0px;
	color: ${p => p.theme.ui.textMinor};
`;

const ShowManualInfo = styled.a`
	color: ${p => p.theme.ui.primaryFill};
	cursor: pointer;
`;

const ManualButton = styled(Button)`
	margin-top: 5px;
`;

export default Onboarding;
