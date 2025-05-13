import { Dropdown, Field, Option, OptionOnSelectData, SelectionEvents } from '@fluentui/react-components';
import * as React from 'react';

export interface DropdownFieldProps {
	id?: string;
	label?: string;
	name?: string;
	placeholder?: string;
	value?: string;
	options: { key: string; text: string }[];
	onOptionSelect?: (event: SelectionEvents, data: OptionOnSelectData) => void;
	required?: boolean;
	disabled?: boolean;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
	id,
	label,
	name,
	placeholder,
	value,
	options,
	onOptionSelect,
	required,
	disabled,
}) => {
	return (
		<Field
			id={id}
			label={label}
			required={required}
		>
			<Dropdown
				name={name}
				placeholder={placeholder}
				value={value}
				onOptionSelect={onOptionSelect}
				disabled={disabled}
			>
				{options.map((option) => (
					<Option
						key={option.key}
						value={option.key}
					>
						{option.text}
					</Option>
				))}
			</Dropdown>
		</Field>
	);
};
