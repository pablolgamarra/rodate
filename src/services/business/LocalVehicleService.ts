import { Status } from '@common/enums/Status';
import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import LocalVehicleResponse from '@models/spServiceResponse/LocalVehicleResponse';
import Vehicle from '@models/Vehicle';
import IVehicleService from '@services/business/interfaces/IVehicleService';
import { ISPService } from '@services/core/spService/ISPService';
import { SPService } from '@services/core/spService/SPService';

export default class LocalVehicleService implements IVehicleService {
	public static readonly serviceKey: ServiceKey<IVehicleService> = ServiceKey.create(
		'Rodate.LocalVehicleService',
		LocalVehicleService,
	);

	private _SPService!: ISPService;
	private listName!: string;

	constructor(serviceScope: ServiceScope) {
		try {
			serviceScope.whenFinished(() => {
				this._SPService = serviceScope.consume(SPService.servicekey);
			});
		} catch (e) {
			throw new Error(`Error initializing VehicleService -> ${e}`);
		}
	}

	private mapToVehicle(item: LocalVehicleResponse): Vehicle {
		return {
			Id: item.Id,
			Plate: item.Title,
			Brand: item.MARCA,
			Model: item.MODELO,
			Active: item.ESTADO as Status,
			Key: item.LLAVE,
		};
	}

	private formatSharepoint(item: Vehicle): LocalVehicleResponse {
		return {
			Id: item.Id,
			Title: item.Plate,
			MARCA: item.Brand,
			MODELO: item.Model,
			ESTADO: item.Active.toString(),
			LLAVE: item.Key || 'EN RECEPCION',
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

	public async getAll(): Promise<Vehicle[]> {
		try {
			const queryResults: LocalVehicleResponse[] = await this._SPService.getAllItems(this.listName, false);

			return queryResults.map(this.mapToVehicle);
		} catch (e) {
			throw new Error(`Error retrieving all vehicles -> ${e}`);
		}
	}

	public async getById(id: number): Promise<Vehicle> {
		try {
			if (!id) {
				throw new Error(`Id not valid`);
			}

			const queryResults: LocalVehicleResponse[] = await this._SPService.getAllItems(this.listName, false);
			const results = queryResults.map(this.mapToVehicle);

			return results[0];
		} catch (e) {
			throw new Error(`Error retrieving all vehicles -> ${e}`);
		}
	}

	public async getPaged(
		pageSize: number,
		requestedPage: number,
	): Promise<{ vehiclesPage: Vehicle[]; count: number }> {
		try {
			const { results, totalCount } = await this._SPService.getListItemsPaged(
				this.listName,
				pageSize,
				requestedPage,
				false,
			);

			const vehiclePage = results.map(this.mapToVehicle);

			return { vehiclesPage: vehiclePage, count: totalCount };
		} catch (e) {
			throw Error(`Error retrieving vehicles from page ${requestedPage}-> ${e}`);
		}
	}

	public async createItem(vehicle: Vehicle): Promise<boolean> {
		try {
			if (!vehicle) {
				throw new Error(`Cannot Insert. Vehicle not valid`);
			}

			const vehicleInsert = this.formatSharepoint(vehicle);
			await this._SPService.insertItem(this.listName, vehicleInsert, false);

			return true;
		} catch (e) {
			throw Error(`Error inserting vehicle data -> ${e}`);
		}
	}

	public async updateItem(vehicle: Vehicle): Promise<boolean> {
		try {
			if (!vehicle) {
				throw new Error(`Cannot Update. Vehicle not valid`);
			}

			const vehicleUpdate = this.formatSharepoint(vehicle);
			await this._SPService.updateItem(this.listName, vehicleUpdate, false);
			return true;
		} catch (e) {
			throw Error(`Error updating vehicle data -> ${e}`);
		}
	}

	public async deleteItem(vehicle: Vehicle): Promise<boolean> {
		try {
			if (!vehicle) {
				throw new Error(`Cannot Delete. Vehicle not valid`);
			}
			const vehicleDelete = this.formatSharepoint(vehicle);
			await this._SPService.deleteItem(this.listName, vehicleDelete.Id, false);
			return true;
		} catch (e) {
			throw Error(`Error deleting vehicle data -> ${e}`);
		}
	}
}
