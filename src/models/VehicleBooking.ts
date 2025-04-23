import { BookingStatus } from '@common/enums/BookingStatus';
import Vehicle from '@models/Vehicle';

export default interface VehicleBooking {
	Id: number;
	UserId: number;
	BookingStatus: BookingStatus;
	BookingReason: string;
	Vehicle: Vehicle;
	StartingDate: Date;
	FinishDate: Date;
}
