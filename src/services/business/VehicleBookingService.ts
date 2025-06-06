import { BookingStatus } from '@common/enums/BookingStatus';
import VehicleBookingResponse from '@models/spServiceResponse/VehicleBookingResponse';
import Vehicle from '@models/Vehicle';
import VehicleBooking from '@models/VehicleBooking';
import IVehicleBookingService from '@services/business/interfaces/IVehicleBookingService';
import IVehicleService from '@services/business/interfaces/IVehicleService';
import { ISPService } from '@services/core/spService/ISPService';

export default class VehicleBookingService implements IVehicleBookingService {
	private _SPService!: ISPService;
	private _vehicleService!: IVehicleService;
	private listName!: string;

	constructor(spService: ISPService, vehicleService: IVehicleService) {
		try {
			this._SPService = spService;
			this._vehicleService = vehicleService;
		} catch (e) {
			throw new Error(`Error initializing VehicleService -> ${e}`);
		}
	}

	private mapToVehicleBooking(item: VehicleBookingResponse, vehicle: Vehicle[]): VehicleBooking {
		return {
			Id: item.Id,
			UserId: item.SOLICITANTEId,
			Vehicle: vehicle.find((vehicle) => vehicle.Id === item.RODADOId) || ({} as Vehicle),
			BookingReason: item.MOTIVO,
			BookingStatus: item.ESTADO,
			StartingDate: item.FECHA_INICIO,
			FinishDate: item.FECHA_FIN,
		};
	}

	private formatSharepoint(item: VehicleBooking): VehicleBookingResponse {
		return {
			Id: item.Id,
			SOLICITANTEId: item.UserId,
			RODADOId: item.Vehicle.Id,
			MOTIVO: item.BookingReason,
			ESTADO: item.BookingStatus,
			FECHA_INICIO: item.StartingDate,
			FECHA_FIN: item.FinishDate,
			ID: item.Id,
		};
	}

	configure(listName: string): void {
		try {
			if (!listName) {
				console.log(`ListName not valid -> ${listName}`);
				throw new Error(`ListName not valid`);
			}
			this.listName = listName;
		} catch (e) {
			throw new Error(`Error configuring vehicle service -> ${e}`);
		}
	}

	public async getAll(): Promise<VehicleBooking[]> {
		try {
			const queryResults: VehicleBookingResponse[] = await this._SPService.getAllItems(this.listName, false);
			const vehicleList = await this._vehicleService.getAll();
			return queryResults.map((item) => {
				return this.mapToVehicleBooking(item, vehicleList);
			});
		} catch (e) {
			throw new Error(`Error retrieving all vehicles -> ${e}`);
		}
	}

	public async getAllFiltered(filter: string): Promise<VehicleBooking[]> {
		try {
			const queryResults: VehicleBookingResponse[] = await this._SPService.getItemsFiltered(
				this.listName,
				filter,
				false,
			);
			const vehicleList = await this._vehicleService.getAll();
			return queryResults.map((item) => {
				return this.mapToVehicleBooking(item, vehicleList);
			});
		} catch (e) {
			throw new Error(`Error retrieving all vehicles -> ${e}`);
		}
	}

	public async getById(id: number): Promise<VehicleBooking> {
		try {
			if (!id) {
				throw new Error(`Id not valid`);
			}

			const queryResults: VehicleBookingResponse[] = await this._SPService.getAllItems(this.listName, false);
			const vehicleList = await this._vehicleService.getAll();

			const results = queryResults.map((item) => {
				return this.mapToVehicleBooking(item, vehicleList);
			});
			return results[0];
		} catch (e) {
			throw new Error(`Error retrieving vehicle bookings for id ${id} -> ${e}`);
		}
	}

	public async getPaged(
		pageSize: number,
		requestedPage: number,
	): Promise<{ vehicleBookingsPage: VehicleBooking[]; count: number }> {
		try {
			const { results, totalCount } = await this._SPService.getListItemsPaged(
				this.listName,
				pageSize,
				requestedPage,
				false,
			);
			const vehicleList = await this._vehicleService.getAll();

			const vehiclePage = results.map((item) => {
				return this.mapToVehicleBooking(item, vehicleList);
			});

			return { vehicleBookingsPage: vehiclePage, count: totalCount };
		} catch (e) {
			throw Error(`Error retrieving vehicles from page ${requestedPage}-> ${e}`);
		}
	}

	public async getBookingsByUser(userId: number, status?: BookingStatus): Promise<VehicleBooking[]> {
		try {
			const vehicleList = await this._vehicleService.getAll();

			if (!userId || userId <= 0) {
				throw Error(`userId ${userId} is not a valid value`);
			}

			if (status) {
				const filter = `SOLICITANTEId eq ${userId} and ESTADO eq '${status}'`;
				const queryResults: VehicleBookingResponse[] = await this._SPService.getItemsFiltered(
					this.listName,
					filter,
					false,
				);
				return queryResults.map((item) => {
					return this.mapToVehicleBooking(item, vehicleList);
				});
			}

			const filter = `SOLICITANTEId eq '${userId}'`;

			const queryResults: VehicleBookingResponse[] = await this._SPService.getItemsFiltered(
				this.listName,
				filter,
				false,
			);
			return queryResults.map((item) => {
				return this.mapToVehicleBooking(item, vehicleList);
			});
		} catch (e) {
			throw new Error(`Error retrieving vehicle bookings for user with id ${userId}  -> ${e}`);
		}
	}

	public async createItem(vehicleBooking: VehicleBooking): Promise<boolean> {
		try {
			if (!vehicleBooking) {
				throw new Error(`Cannot Insert. Vehicle Booking not valid`);
			}

			const vehicleInsert = this.formatSharepoint(vehicleBooking);
			await this._SPService.insertItem(this.listName, vehicleInsert, false);

			return true;
		} catch (e) {
			throw Error(`Error inserting vehicle booking data -> ${e}`);
		}
	}

	public async updateItem(vehicle: VehicleBooking): Promise<boolean> {
		try {
			if (!vehicle) {
				throw new Error(`Cannot Update. VehicleBooking not valid`);
			}

			const vehicleUpdate = this.formatSharepoint(vehicle);
			await this._SPService.updateItem(this.listName, vehicleUpdate, false);
			return true;
		} catch (e) {
			throw Error(`Error updating vehicle booking data -> ${e}`);
		}
	}

	public async deleteItem(vehicleBooking: VehicleBooking): Promise<boolean> {
		try {
			if (!vehicleBooking) {
				throw new Error(`Cannot Delete. Vehicle Booking not valid`);
			}
			const vehicleDelete = this.formatSharepoint(vehicleBooking);
			await this._SPService.deleteItem(this.listName, vehicleDelete.Id, false);
			return true;
		} catch (e) {
			throw Error(`Error deleting vehicle booking data -> ${e}`);
		}
	}
}
