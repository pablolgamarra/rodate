import * as React from 'react';

import { DateTimePickerField } from '@controls/common/DateTimeField';
import { DropdownField } from '@controls/common/DropdownField';
import { InputField } from '@controls/common/InputField';
import { TextAreaField } from '@controls/common/TextAreaField';
import { Skeleton, SkeletonItem } from '@fluentui/react-components';
import { useId } from '@fluentui/react-utilities';
import { useVehicleBookingForm } from '@hooks/forms/useVehicleBookingForm';
import useServiceContext from '@hooks/useServiceContext';
import { useVehicleList } from '@hooks/useVehicleList';
import Vehicle from '@models/Vehicle';

export interface BookingRegisterFormProps {}

export const BookingRegisterForm: React.FC<BookingRegisterFormProps> = (props) => {
	const id = useId('rodate-booking-register-form');

	const { vehicleService } = useServiceContext();
	const { loading: isLoading, list: vehicleList } = useVehicleList(vehicleService);

	const { formState, handleDatePickerChanges, handleDropdownChanges, handleInputChanges, handleTextAreaChanges } =
		useVehicleBookingForm();

	return (
		<>
			{isLoading ? (
				<Skeleton animation='pulse'>
					<SkeletonItem />
				</Skeleton>
			) : (
				<DropdownField
					id={`${id}-vehicleId`}
					name='vehicle'
					label='Seleccione Vehiculo'
					options={vehicleList.map((v: Vehicle) => ({
						key: v.Id.toString(),
						text: `${v.Brand} - ${v.Model} - ${v.Plate}`,
					}))}
					onOptionSelect={handleDropdownChanges}
				/>
			)}
			<DateTimePickerField
				id={`${id}-startDate`}
				name='startDate'
				label='Fecha de Inicio'
				value={formState.startDate}
				onChange={handleDatePickerChanges}
			/>
			<DateTimePickerField
				id={`${id}-endDate`}
				name='endDate'
				label='Fecha de Estimada de Fin'
				value={formState.endDate}
				onChange={handleDatePickerChanges}
			/>
			<InputField
				id={`${id}-bookingReason`}
				name='bookingReason'
				label={'Motivo de Reservación'}
				placeholder='Ingrese motivo de reservación'
				value={formState.bookingReason || ''}
				type='text'
				onChange={handleInputChanges}
			/>
			<TextAreaField
				id={`${id}-bookingDetails`}
				name='bookingDetails'
				label={'Detalles de Reservación'}
				placeholder='Ingrese detalles de reservación'
				value={formState.bookingDetails || ''}
				onChange={handleTextAreaChanges}
			/>
		</>
	);
};
