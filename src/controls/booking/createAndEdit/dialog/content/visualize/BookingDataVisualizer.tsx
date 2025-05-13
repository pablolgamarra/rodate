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

export interface BookingDataVisualizerProps {}

export const BookingDataVisualizer: React.FC<BookingDataVisualizerProps> = (props) => {
	const { formState } = useVehicleBookingForm();

	const { vehicleService } = useServiceContext();

	const id = useId('rodate-booking-register-form');

	const { loading: isLoading, list: vehicleList } = useVehicleList(vehicleService);

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
					options={vehicleList.map((v: Vehicle) => ({
						key: v.Id.toString(),
						text: `${v.Brand} - ${v.Model} - ${v.Plate}`,
					}))}
				/>
			)}
			<DateTimePickerField
				id={`${id}-cardNumber`}
				name='startDate'
				label='Número de Tarjeta'
				placeholder=''
				value={formState.startDate}
				onChange={() => {}}
			/>
			<DateTimePickerField
				id={`${id}-cardNumber`}
				name='endDate'
				label='Número de Tarjeta'
				placeholder=''
				value={formState.endDate}
				onChange={() => {}}
			/>
			<InputField
				id={`${id}-assignedValue`}
				name='bookingReason'
				label={'Monto Asignado'}
				placeholder=''
				value={formState.bookingReason || ''}
				type='text'
			/>
			<TextAreaField
				id={`${id}-assignedValue`}
				name='bookingDetails'
				label={'Monto Asignado'}
				placeholder=''
				value={formState.bookingDetails || ''}
			/>
		</>
	);
};
