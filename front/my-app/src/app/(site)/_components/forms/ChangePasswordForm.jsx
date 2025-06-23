'use client';

import useChangePassword from '../hooks/use-change-password';
import Form from './Form';


import { useTranslations } from 'next-intl';



export default function ChangePasswordForm() {
	const {  new_password, re_new_password, current_password, isLoading, onChange, onSubmit } = useChangePassword();
	const t = useTranslations('site.account.change_password')

	const config = [

		{
			labelText: t('form.current_password'),
			labelId: 'current_password',
			type: 'password',
			value: current_password,
			required: true,
		},
		{
			labelText: t('form.new_password'),
			labelId: 'new_password',
			type: 'password',
			value: new_password,
			required: true,
		},
		{
			labelText: t('form.re_new_password'),
			labelId: 're_new_password',
			type: 'password',
			value: re_new_password,
			required: true,
		},





	];

	return (
		<Form
			config={config}
			isLoading={isLoading}
			btnText={t('form.btnText')}
			onChange={onChange}
			onSubmit={onSubmit}
		/>
	);
}
