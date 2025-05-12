import { BookingStatus } from '@common/enums/BookingStatus';
import VehicleBooking from '@models/VehicleBooking';

export default interface IVehicleBookingService {
	configure(listName: string): void;
	getAll(): Promise<VehicleBooking[]>;
	getAllFiltered(filter: string): Promise<VehicleBooking[]>;
	getById(id: number): Promise<VehicleBooking>;
	getPaged(
		pageSize: number,
		requestedPage: number,
	): Promise<{ vehicleBookingsPage: VehicleBooking[]; count: number }>;
	getBookingsByUser(userId: number, status?: BookingStatus): Promise<VehicleBooking[]>;
	createItem(vehicleBooking: VehicleBooking): Promise<boolean>;
	updateItem(vehicleBooking: VehicleBooking): Promise<boolean>;
	deleteItem(vehicleBooking: VehicleBooking): Promise<boolean>;
}
