import { BookingStatus } from '@common/enums/BookingStatus';
import { Body2, Spinner } from '@fluentui/react-components';
import { useUserBookingsList } from '@hooks/useUserBookingsList';
import VehicleBooking from '@models/VehicleBooking';
import React, { FC } from 'react';
import { BookingCard } from './card/BookingCard';

export interface VehicleBookingListProps {
	filter: string;
}

const estadoMap: Record<string, BookingStatus> = {
	approved: BookingStatus.APROBADO,
	pending: BookingStatus.PENDIENTE,
	rejected: BookingStatus.RECHAZADO,
	canceled: BookingStatus.CANCELADO,
	finished: BookingStatus.FINALIZADO,
};

export const VehicleBookingList: FC<VehicleBookingListProps> = ({ filter }) => {
	const odataFilter = estadoMap[filter] ? estadoMap[filter] : undefined;

	const { list, loading, error } = useUserBookingsList(odataFilter);

	if (error) {
		console.log(error);
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
