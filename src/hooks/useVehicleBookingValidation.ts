import { BookingStatus } from '@common/enums/BookingStatus';
import useServiceContext from '@hooks/useServiceContext';
import { useVehicleList } from '@hooks/useVehicleList';
import VehicleBooking from '@models/VehicleBooking';
import { VehicleBookingFormState } from '@models/VehicleBookingFormState';
import { useState } from 'react';

export const useVehicleBookingValidation = (): {
	validate: (state: VehicleBookingFormState) => boolean;
	parseIfValid: (state: VehicleBookingFormState) => Promise<VehicleBooking | undefined>;
	errors: string[];
} => {
	const [errors, setErrors] = useState<string[]>([]);
	const { vehicleService } = useServiceContext();
	const { list: vehicleList, loading } = useVehicleList(vehicleService);

	const validate = (state: VehicleBookingFormState): boolean => {
		const newErrors: string[] = [];

		if (!state.vehicle) {
			newErrors.push('Debe seleccionar un vehículo.');
		}

		if (!state.userId) {
			newErrors.push('Debe seleccionar un funcionario.');
		}

		if (!state.startDate || !state.endDate) {
			newErrors.push('Debe completar ambas fechas.');
		} else if (state.endDate < state.startDate) {
			newErrors.push('La fecha de fin no puede ser anterior a la de inicio.');
		}

		if (!state.bookingReason || state.bookingReason.trim() === '') {
			newErrors.push('Debe ingresar un motivo para la reserva.');
		}

		setErrors(newErrors);
		return newErrors.length === 0;
	};

	const parseIfValid = async (state: VehicleBookingFormState): Promise<VehicleBooking | undefined> => {
		if (!validate(state)) return undefined;

		if (loading) {
			setErrors(['La lista de vehículos aún se está cargando. Por favor espere.']);
			return undefined;
		}

		const vehicle = vehicleList.find((v) => v.Id === state.vehicle?.Id);

		if (!vehicle) {
			setErrors(['No se encontró el vehículo en la lista.']);
			return undefined;
		}

		return {
			Id: state.id!,
			Vehicle: vehicle,
			UserId: state.userId!,
			StartingDate: state.startDate!,
			FinishDate: state.endDate!,
			BookingStatus: BookingStatus.PENDIENTE,
			BookingReason: state.bookingReason!.trim(),
		};
	};

	return { validate, parseIfValid, errors };
};
