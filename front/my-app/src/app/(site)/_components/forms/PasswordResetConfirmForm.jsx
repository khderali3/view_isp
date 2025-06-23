'use client';


import useResetPasswordConfirm from '../hooks/use-reset-password-confirm';

import Form from './Form';


import { useTranslations } from 'next-intl';

export default function PasswordResetConfirmForm({ uid, token }) {

	const t = useTranslations('site.account.reset_password_set.form')

	const { new_password, re_new_password, isLoading, onChange, onSubmit } =
		useResetPasswordConfirm(uid, token);

	const config = [
		{
			labelText: t('new_password'),
			labelId: 'new_password',
			type: 'password',
			onChange,
			value: new_password,
			required: true,
		},
		{
			labelText: t('re_new_password'),
			labelId: 're_new_password',
			type: 'password',
			onChange,
			value: re_new_password,
			required: true,
		},
	];

	return (
		<Form
			config={config}
			isLoading={isLoading}
			btnText={t('btnText')}
			onChange={onChange}
			onSubmit={onSubmit}
		/>
	);
}