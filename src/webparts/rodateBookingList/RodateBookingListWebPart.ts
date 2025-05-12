import { Version } from '@microsoft/sp-core-library';
import {
	type IPropertyPaneConfiguration,
	PropertyPaneTextField,
	PropertyPaneToggle,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { IServicesProvider, ServicesProvider } from '@context/ServiceContext';
import { VehicleBooking } from '@controls/booking/list/VehicleBooking';
import ErrorComponent from '@controls/ErrorComponent';
import IVehicleBookingService from '@services/business/interfaces/IVehicleBookingService';
import IVehicleService from '@services/business/interfaces/IVehicleService';
import LocalVehicleService from '@services/business/LocalVehicleService';
import RemoteVehicleService from '@services/business/RemoteVehicleService';
import VehicleBookingService from '@services/business/VehicleBookingService';
import { ISPService } from '@services/core/spService/ISPService';
import { createSPService } from '@services/core/spService/SPServiceFactory';
import * as strings from 'RodateBookingListWebPartStrings';

export interface IRodateBookingListWebPartProps {
	bookingListName: string;
	vehicleListName: string;
	useRemoteVehicleList: boolean;
	remoteVehicleUrl: string;
}

export default class RodateBookingListWebPart extends BaseClientSideWebPart<IRodateBookingListWebPartProps> {
	private vehicleService!: IVehicleService;
	private vehicleBookingService!: IVehicleBookingService;
	private spService!: ISPService;

	private app!: React.FunctionComponentElement<IServicesProvider>;

	public async render(): Promise<void> {
		try {
			this.spService = await createSPService(this.context.pageContext);
		} catch (e) {
			throw Error(`Error inicializando SPService: -> ${e}`);
		}

		try {
			const configs = this.properties;

			if (!(configs.bookingListName || configs.vehicleListName || configs.remoteVehicleUrl)) {
				throw new Error('Missing required lists names in the webpart configuration panel');
			}

			if (configs.useRemoteVehicleList) {
				this.vehicleService = new RemoteVehicleService(this.spService);
				this.vehicleService.configure(configs.remoteVehicleUrl);
			} else {
				this.vehicleService = new LocalVehicleService(this.spService);
				this.vehicleService.configure(configs.vehicleListName);
			}

			this.vehicleBookingService = new VehicleBookingService(this.spService, this.vehicleService);
			this.vehicleBookingService.configure(configs.bookingListName);

			this.app = React.createElement(
				ServicesProvider,
				{
					vehicleService: this.vehicleService,
					bookingService: this.vehicleBookingService,
					spWebPartContext: this.context,
				},
				React.createElement(VehicleBooking, {}),
			);
		} catch (e) {
			console.error(e);
			this.app = React.createElement(
				ServicesProvider,
				{
					vehicleService: this.vehicleService,
					bookingService: this.vehicleBookingService,
					spWebPartContext: this.context,
				},
				React.createElement(ErrorComponent, { message: `${e}` }),
			);
		}

		try {
			ReactDom.render(this.app, this.domElement);
		} catch (e) {
			console.error(e);
		}
	}

	protected async onInit(): Promise<void> {
		await super.onInit();
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription,
					},
					groups: [
						{
							groupName: strings.BasicGroupName,
							groupFields: [
								PropertyPaneTextField('bookingListName', {
									label: 'Ingresar Nombre de Lista de Reservas',
								}),
								PropertyPaneTextField('vehicleListName', {
									label: 'Ingresar Nombre de Lista de Vehiculos',
								}),
								PropertyPaneToggle('useRemoteVehicleList', {
									label: 'Usar Lista de Vehiculos Remota',
								}),
								PropertyPaneTextField('remoteVehicleUrl', {
									label: 'Ingresar URL de Lista de Vehiculos',
								}),
							],
						},
					],
				},
			],
		};
	}
}
