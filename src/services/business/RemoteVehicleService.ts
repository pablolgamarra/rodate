// import { EstadoLogico } from '@common/enums/EstadoLogico'; // ej: DISPONIBLE, EN_USO, VehicleBookingDO
import { Status } from '@common/enums/Status';
import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import Vehicle from '@models/Vehicle';
import RemoteVehicleResponse from '@models/spServiceResponse/RemoteVehicleResponse';
import VehicleBookingService from '@services/business/VehicleBookingService';
import IVehicleBookingService from '@services/business/interfaces/IVehicleBookingService';
import IVehicleService from '@services/business/interfaces/IVehicleService';
import { ISPService } from '@services/core/spService/ISPService';
import { SPService } from '@services/core/spService/SPService';

export default class RemoteVehicleService implements IVehicleService {
	public static readonly serviceKey: ServiceKey<IVehicleService> = ServiceKey.create(
		'Rodate.RemoteVehicleService',
		RemoteVehicleService,
	);
	private _SPService!: ISPService;
	private _VehicleBookingService!: IVehicleBookingService;
	private _listName!: string;
	private _webUrl!: string;

	constructor(serviceScope: ServiceScope) {
		try {
			serviceScope.whenFinished(() => {
				this._SPService = serviceScope.consume(SPService.servicekey._factory(serviceScope, this._webUrl));
				this._VehicleBookingService = serviceScope.consume(VehicleBookingService.serviceKey);
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

	private formatSharepoint(item: Vehicle): RemoteVehicleResponse {
		return {
			Id: item.Id,
			Title: item.Plate,
			Marca: item.Brand,
			Modelo: item.Model,
			EstaActivo: item.Active === Status.ACTIVO,
			ID: item.Id,
		};
	}

	// private calcularEstadoLogico(vehicle: Vehicle, VehicleBookings: VehicleBooking[]): EstadoLogico {
	// 	const ahora = new Date();

	// 	const VehicleBookingsDeEsteVehiculo = VehicleBookings.filter(
	// 		(r) => r.VehiculoId === vehicle.Id && r.Estado === 'VehicleBooking',
	// 	);

	// 	const enUso = VehicleBookingsDeEsteVehiculo.some((r) => r.FechaInicio <= ahora && r.FechaFin >= ahora);

	// 	if (enUso) return EstadoLogico.EN_USO;

	// 	const futuro = VehicleBookingsDeEsteVehiculo.some((r) => r.FechaInicio > ahora);

	// 	if (futuro) return EstadoLogico.VehicleBookingDO;

	// 	return EstadoLogico.DISPONIBLE;
	// }

	public async getAll(): Promise<Vehicle[]> {
		try {
			const queryResults: RemoteVehicleResponse[] = await this._SPService.getAllItems(this.listName);

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
		const all = await this.getAll();
		const start = (requestedPage - 1) * pageSize;
		const end = start + pageSize;
		return {
			vehiclesPage: all.slice(start, end),
			count: all.length,
		};
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
