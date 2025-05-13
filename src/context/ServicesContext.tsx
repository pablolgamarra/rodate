import { WebPartContext } from '@microsoft/sp-webpart-base';
import IVehicleBookingService from '@services/business/interfaces/IVehicleBookingService';
import IVehicleService from '@services/business/interfaces/IVehicleService';
import { ISPService } from '@services/core/spService/ISPService';
import * as React from 'react';

export interface IServicesProvider {
	spService: ISPService;
	vehicleService: IVehicleService;
	bookingService: IVehicleBookingService;
	spWebPartContext: WebPartContext;
}

export const ServicesContext = React.createContext<IServicesProvider>({} as IServicesProvider);

export const ServicesProvider: React.FC<IServicesProvider> = ({
	children,
	spService,
	vehicleService,
	bookingService,
	spWebPartContext,
}: React.PropsWithChildren<IServicesProvider>) => {
	return (
		<ServicesContext.Provider
			value={{
				spService: spService,
				vehicleService: vehicleService,
				bookingService: bookingService,
				spWebPartContext: spWebPartContext,
			}}
		>
			{children}
		</ServicesContext.Provider>
	);
};

ServicesContext.displayName = 'ServicesContext';
ServicesProvider.displayName = 'ServicesProvider';
