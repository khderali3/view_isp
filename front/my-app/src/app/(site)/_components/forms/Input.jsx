
import Link from 'next/link';

export default function Input({
	labelId,
	type,
	onChange,
	value,
	children,
	required = false,
	link,
}) {


	return (
		<div className="form-floating    pb-1"  >
				<input
					id={labelId}
					name={labelId}
					type={type}
					onChange={onChange}
					value={value}
					required={required}
					className="form-control"
					placeholder={labelId}
				/>
				<label	htmlFor={labelId} className='text-end '  >
					{children}
				</label>

				{link && (
					// <p className='text-end'>
						<p className=' '>

						<Link
							className='text-light'
							href={link.linkUrl}
						>
							{link.linkText}
						</Link>
					</p>
				)}


			</div>
	);
}