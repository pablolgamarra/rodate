import { Body2, Spinner } from '@fluentui/react-components';
import { useVehicleBookingList } from '@hooks/useVehicleBookingList';
import VehicleBooking from '@models/VehicleBooking';
import React, { FC } from 'react';
import { BookingCard } from './card/BookingCard';

export interface VehicleBookingListProps {
	filter: string;
}

const estadoMap: Record<string, string> = {
	approved: 'APROBADO',
	pending: 'PENDIENTE',
	rejected: 'RECHAZADO',
	canceled: 'CANCELADO',
	finished: 'FINALIZADO',
	all: '', // o algún valor por defecto
};

export const VehicleBookingList: FC<VehicleBookingListProps> = ({ filter }) => {
	const odataFilter = estadoMap[filter] ? `ESTADO eq '${estadoMap[filter]}'` : '';

	const { list, loading, error } = useVehicleBookingList(odataFilter);

	if (error) {
		return <Body2>Ha ocurrido un error al listar reservas</Body2>;
	}

	if (loading) {
		return (
			<Spinner
				size='tiny'
				label='Cargando Reservas'
			/>
		);
	}

	if (list.length === 0) {
		return <Body2>No se encontraron reservas.</Body2>;
	}

	return (
		<>
			{list.map((item: VehicleBooking) => (
				<BookingCard
					key={item.Id}
					booking={item}
				/>
			))}
		</>
	);
};
