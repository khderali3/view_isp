import Spinner from '../jsx/spinner';

import Input from './Input';

export default function Form({
	config,
	isLoading,
	btnText,
	onChange,
	onSubmit,
	ReCAPTCHA=null,
	locale=null,
	recaptchaRef=null,
	onChangeRecaptcha=null,

}) {
	return (
		<form   onSubmit={onSubmit}     >
			 
			{config.map(input => (
				<Input
					key={input.labelId}
					labelId={input.labelId}
					type={input.type}
					onChange={onChange}
					value={input.value}
					required={input.required}
					link={input.link}
					
				>
					{input.labelText}
				</Input>
			))}

 

			{ReCAPTCHA !== null &&
				<ReCAPTCHA
					sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPCHA_SITE_KEY}
					onChange={onChangeRecaptcha}
					ref={recaptchaRef}
					hl={locale}
				/>
			}

			<div>
				<button
					type='submit'
					className='w-100 btn btn-lg btn-primary m-0 mt-2'
					disabled={isLoading}
				>
					{isLoading ? <Spinner />  : `${btnText}`}
				</button>
			</div>
		</form>
	);
}