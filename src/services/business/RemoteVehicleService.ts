// import { EstadoLogico } from '@common/enums/EstadoLogico'; // ej: DISPONIBLE, EN_USO, VehicleBookingDO
import { Status } from '@common/enums/Status';
import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import Vehicle from '@models/Vehicle';
import RemoteVehicleResponse from '@models/spServiceResponse/RemoteVehicleResponse';
import IVehicleService from '@services/business/interfaces/IVehicleService';
import { ISPService } from '@services/core/spService/ISPService';
import { SPService } from '@services/core/spService/SPService';

export default class RemoteVehicleService implements IVehicleService {
	public static readonly serviceKey: ServiceKey<IVehicleService> = ServiceKey.create(
		'Rodate.RemoteVehicleService',
		RemoteVehicleService,
	);
	private _SPService!: ISPService;
	private _listName!: string;

	constructor(serviceScope: ServiceScope) {
		try {
			serviceScope.whenFinished(() => {
				this._SPService = serviceScope.consume(SPService.servicekey);
			});
		} catch (e) {
			throw new Error(`Error initializing RemoteVehicleService -> ${e}`);
		}
	}

	public configure(vehicleListName: string, VehicleBookingListName?: string): void {
		if (!vehicleListName) throw new Error(`Vehicle List Name is not valid`);
		this._listName = vehicleListName;
	}

	private mapToVehicle(item: RemoteVehicleResponse): Vehicle {
		return {
			Id: item.Id,
			Plate: item.Title,
			Brand: item.Marca,
			Model: item.Modelo,
			Active: item.EstaActivo ? Status.ACTIVO : Status.INACTIVO,
		};
	}

	// Commented out as it is not used in the current implementation
	// private formatSharepoint(item: Vehicle): RemoteVehicleResponse {
	// 	return {
	// 		Id: item.Id,
	// 		Title: item.Plate,
	// 		Marca: item.Brand,
	// 		Modelo: item.Model,
	// 		EstaActivo: item.Active === Status.ACTIVO,
	// 		ID: item.Id,
	// 	};
	// }

	public async getAll(): Promise<Vehicle[]> {
		try {
			const queryResults: RemoteVehicleResponse[] = await this._SPService.getAllItems(this._listName, true);

			return queryResults.map(this.mapToVehicle);
		} catch (e) {
			throw new Error(`Error retrieving all vehicles -> ${e}`);
		}
	}

	public async getById(id: number): Promise<Vehicle> {
		try {
			const allVehicles = await this.getAll();
			return allVehicles.find((v) => v.Id === id)!;
		} catch (e) {
			throw new Error(`Error retrieving vehicle by id -> ${e}`);
		}
	}

	public async getPaged(
		pageSize: number,
		requestedPage: number,
	): Promise<{ vehiclesPage: Vehicle[]; count: number }> {
		// Para simplificar, lo hacemos completo, pero podrías optimizar esto
		try {
			const { results, totalCount } = await this._SPService.getListItemsPaged(
				this._listName,
				pageSize,
				requestedPage,
				true,
			);

			const vehiclePage = results.map(this.mapToVehicle);

			return { vehiclesPage: vehiclePage, count: totalCount };
		} catch (e) {
			throw Error(`Error retrieving vehicles from page ${requestedPage}-> ${e}`);
		}
	}

	public async createItem(vehicle: Vehicle): Promise<boolean> {
		throw new Error('RemoteVehicleService is read-only');
	}

	public async updateItem(vehicle: Vehicle): Promise<boolean> {
		throw new Error('RemoteVehicleService is read-only');
	}

	public async deleteItem(vehicle: Vehicle): Promise<boolean> {
		throw new Error('RemoteVehicleService is read-only');
	}
}
