import { BookingStatus } from '@common/enums/BookingStatus';

export default interface VehicleBookingResponse {
	Id: number;
	SOLICITANTEId: number;
	FECHA_INICIO: Date;
	FECHA_FIN: Date;
	ESTADO: BookingStatus;
	MOTIVO: string;
	RODADOId: number;
	ID: number;
}
