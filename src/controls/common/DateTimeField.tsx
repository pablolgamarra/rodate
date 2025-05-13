import { DatePicker } from '@fluentui/react';
import { Field, Input, makeStyles } from '@fluentui/react-components';
import * as React from 'react';

export interface DateTimePickerFieldProps {
	id: string;
	name: string;
	label: string;
	placeholder?: string;
	value: Date | undefined;
	onChange: (name: string, date: Date | null | undefined) => void;
}

const useStyles = makeStyles({
	container: {
		display: 'flex',
		gap: '8px',
		alignItems: 'center',
	},
});

export const DateTimePickerField: React.FC<DateTimePickerFieldProps> = ({
	id,
	name,
	label,
	placeholder,
	value,
	onChange,
}) => {
	const styles = useStyles();

	const handleDateChange = (date: Date | null | undefined): void => {
		if (!date || !value) return onChange(name, date);
		// Merge selected date with current time
		const updated = new Date(date);
		updated.setHours(value.getHours(), value.getMinutes());
		onChange(name, updated);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const time = e.target.value;
		if (!value) return;
		const [hours, minutes] = time.split(':').map(Number);
		const updated = new Date(value);
		updated.setHours(hours);
		updated.setMinutes(minutes);
		onChange(name, updated);
	};

	const timeString = value
		? `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
		: '';

	return (
		<Field
			id={id}
			label={label}
		>
			<div className={styles.container}>
				<DatePicker
					placeholder={placeholder}
					value={value}
					onSelectDate={handleDateChange}
				/>
				<Input
					type='time'
					value={timeString}
					onChange={handleTimeChange}
				/>
			</div>
		</Field>
	);
};
