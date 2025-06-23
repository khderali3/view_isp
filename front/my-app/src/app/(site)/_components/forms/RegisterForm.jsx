'use client';

import useRegister from '../hooks/use-register';


import Form from './Form';

import { useTranslations } from 'next-intl';

export default function RegisterForm() {

	const t = useTranslations('site.account.register_account.form')
	const {
		first_name,
		last_name,
		email,
		password,
		re_password,
		isLoading,
		onChange,
		onSubmit, ReCAPTCHA, locale, recaptchaRef, onChangeRecaptcha
	} = useRegister();

	const config = [
		{
			labelText: t('first_name'),
			labelId: 'first_name',
			type: 'text',
			value: first_name,
			required: true,
		},
		{
			labelText: t('Last_Name'),
			labelId: 'last_name',
			type: 'text',
			value: last_name,
			required: true,
		},
		{
			labelText: t('email'),
			labelId: 'email',
			type: 'email',
			value: email,
			required: true,
		},
		{
			labelText: t('password'),
			labelId: 'password',
			type: 'password',
			value: password,
			required: true,
		},
		{
			labelText: t('re_password'),
			labelId: 're_password',
			type: 'password',
			value: re_password,
			required: true,
		},
	];

	return (
		<Form
			config={config}
			isLoading={isLoading}
			btnText={t('btn_submit')}
			onChange={onChange}
			onSubmit={onSubmit}
			ReCAPTCHA={ReCAPTCHA}
			locale={locale}
			recaptchaRef={recaptchaRef}
			onChangeRecaptcha={onChangeRecaptcha}
 
		/>
	);
}