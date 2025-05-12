// SPServiceFactory.ts
import { PageContext } from '@microsoft/sp-page-context';
import { ISPService } from '@services/core/spService/ISPService';
import { SPService } from './SPService';

export const createSPService = async (pageContext: PageContext, webUrl?: string): Promise<ISPService> => {
	return new Promise((resolve, reject) => {
		try {
			const service = new SPService(pageContext, webUrl);
			resolve(service);
		} catch (e) {
			console.log(e);
			reject('Error inicializando SP Service');
		}
	});
};
