import {
	InputOnChangeData,
	OptionOnSelectData,
	SelectionEvents,
	TextareaOnChangeData,
} from '@fluentui/react-components';
import useServiceContext from '@hooks/useServiceContext';
import { useVehicleList } from '@hooks/useVehicleList';
import { VehicleBookingFormState } from '@models/VehicleBookingFormState';
import { useState } from 'react';

const initialState: VehicleBookingFormState = {
	id: undefined,
	vehicle: undefined,
	userId: undefined,
	startDate: undefined,
	endDate: undefined,
	bookingReason: undefined,
	bookingDetails: undefined,
	status: undefined,
};

export const useVehicleBookingForm = (): {
	formState: VehicleBookingFormState;
	setFormState: React.Dispatch<React.SetStateAction<VehicleBookingFormState>>;
	handleInputChanges: (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void;
	handleDropdownChanges: (event: SelectionEvents, data: OptionOnSelectData) => void;
	handleDatePickerChanges: (name: string, date: Date | null | undefined) => void;
	handleTextAreaChanges: (ev: React.ChangeEvent<HTMLTextAreaElement>, data: TextareaOnChangeData) => void;
} => {
	const [formState, setFormState] = useState(initialState);
	const { vehicleService } = useServiceContext();
	const { list: vehicleList } = useVehicleList(vehicleService);

	const handleInputChanges = (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void => {
		if (!ev.target.getAttribute('name')) {
			return;
		}

		const name = ev.target.getAttribute('name');
		setFormState({ ...formState, [name!]: data.value });
	};

	const handleDropdownChanges = (event: SelectionEvents, data: OptionOnSelectData): void => {
		setFormState({
			...formState,
			vehicle: vehicleList?.find(
				(vehicle) => vehicle.Id === (data.optionValue ? Number.parseInt(data.optionValue) : -1),
			),
		});
	};

	const handleDatePickerChanges = (name: string, date: Date | null | undefined): void => {};

	const handleTextAreaChanges = (ev: React.ChangeEvent<HTMLTextAreaElement>, data: TextareaOnChangeData): void => {};

	return {
		formState,
		setFormState,
		handleInputChanges,
		handleDropdownChanges,
		handleDatePickerChanges,
		handleTextAreaChanges,
	};
};
