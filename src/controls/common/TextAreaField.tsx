import { Field, Textarea, TextareaOnChangeData } from '@fluentui/react-components';
import * as React from 'react';

export interface TextAreaFieldProps {
	id: string;
	label: string;
	required?: boolean;
	name: string;
	placeholder: string;
	value: string;
	size?: 'small' | 'medium' | 'large';
	resize?: 'none' | 'both' | 'horizontal' | 'vertical';
	onChange?: (ev: React.ChangeEvent<HTMLTextAreaElement>, data: TextareaOnChangeData) => void;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
	id,
	label,
	required,
	name,
	placeholder,
	value,
	size,
	resize,
	onChange,
}) => {
	return (
		<Field
			id={id}
			label={label}
			required={required}
		>
			<Textarea
				name={name}
				placeholder={placeholder}
				size={size}
				resize={resize}
				value={value?.toString()}
				onChange={onChange}
			/>
		</Field>
	);
};
