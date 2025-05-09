import { ContextMenu } from '@controls/common/ContextMenu';
import { Card, CardHeader, Divider, MenuItem } from '@fluentui/react-components';
import VehicleBooking from '@models/VehicleBooking';
import React from 'react';

export interface BookingCardProps {
	booking: VehicleBooking;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
	return (
		<>
			<Card>
				<CardHeader
					title={`#${booking.Id} - ${booking.Vehicle.Model} - ${booking.Vehicle.Plate} - ${booking.BookingReason}`}
					action={
						<ContextMenu
							buttonText='...'
							menuOptions={[
								<MenuItem key={`editBtn-ctx-${booking.Id}`}>Editar</MenuItem>,
								<MenuItem key={`editBtn-ctx-${booking.Id}`}>Finalizar</MenuItem>,
								<MenuItem key={`editBtn-ctx-${booking.Id}`}>Cancelar</MenuItem>,
							]}
						/>
					}
				/>
				<Divider />
				{`Fecha y Hora de Inicio: ${new Date(booking.FinishDate).toDateString()}`}
				{`Fecha y Hora de Fin Estimada: ${new Date(booking.FinishDate).toDateString()}`}
				{`Solicitante: ${booking.UserId}`}
			</Card>
		</>
	);
};
