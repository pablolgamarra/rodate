// SPServiceFactory.ts
import { ServiceScope } from '@microsoft/sp-core-library';
import { SPService } from './SPService';

export const createSPService = async (serviceScope: ServiceScope, webUrl?: string): Promise<SPService> => {
	// Esperamos a que el scope esté listo antes de crear la instancia
	return new Promise((resolve) => {
		serviceScope.whenFinished(() => {
			const service = new SPService(serviceScope, webUrl);
			resolve(service);
		});
	});
};
