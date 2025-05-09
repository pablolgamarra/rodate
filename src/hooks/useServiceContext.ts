import { IServicesProvider, ServicesContext } from '@context/ServiceContext';
import { useContext } from 'react';

export default function useServiceContext(): IServicesProvider {
	const serviceContext = useContext(ServicesContext);
	if (!serviceContext) {
		throw new Error('useServiceContext must be used within a ServiceProvider');
	}
	return serviceContext;
}
