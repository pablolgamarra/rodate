import * as React from 'react';

import { Field, Input, InputOnChangeData } from '@fluentui/react-components';

export interface InputFieldProps {
	id?: string;
	label?: string;
	name?: string;
	placeholder?: string;
	type?:
		| 'number'
		| 'time'
		| 'text'
		| 'search'
		| 'email'
		| 'password'
		| 'tel'
		| 'url'
		| 'date'
		| 'datetime-local'
		| 'month'
		| 'week'
		| undefined;
	value?: string | number | undefined;
	onChange?: (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void;
	required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
	id,
	label,
	name,
	placeholder,
	type,
	value,
	onChange,
	required,
}) => {
	return (
		<Field
			id={id}
			label={label}
			required={required}
		>
			<Input
				name={name}
				type={type}
				placeholder={placeholder}
				value={value?.toString()}
				onChange={onChange}
			/>
		</Field>
	);
};
