import { BookingStatus } from '@common/enums/BookingStatus';
import Vehicle from '@models/Vehicle';

export interface VehicleBookingFormState {
	id: number | undefined;
	vehicle: Vehicle | undefined;
	userId: number | undefined;
	startDate: Date | undefined;
	endDate: Date | undefined;
	bookingReason: string | undefined;
	bookingDetails: string | undefined;
	status: BookingStatus | undefined;
}
