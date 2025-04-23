import Vehicle from '@models/Vehicle';

export default interface IVehicleService {
	configure(listName: string): void;
	getAll(): Promise<Vehicle[]>;
	getById(id: number): Promise<Vehicle>;
	getPaged(pageSize: number, requestedPage: number): Promise<{ vehiclesPage: Vehicle[]; count: number }>;
	createItem(vehicle: Vehicle): Promise<boolean>;
	updateItem(vehicle: Vehicle): Promise<boolean>;
	deleteItem(vehicle: Vehicle): Promise<boolean>;
}
