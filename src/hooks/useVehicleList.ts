import { useEffect, useState } from 'react';

import Vehicle from '@models/Vehicle';
import IVehicleService from '@services/business/interfaces/IVehicleService';

export function useVehicleList(service: IVehicleService): {
	list: Vehicle[];
	loading: boolean;
	error: string | undefined;
} {
	const [list, setList] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | undefined>(undefined);

	useEffect(() => {
		const fetchVehicles = async (): Promise<void> => {
			try {
				setLoading(true);
				const data = await service.getAll();
				setList(data);
			} catch (err) {
				setError(`Error fetching Vehicles ${err}`);
			} finally {
				setLoading(false);
			}
		};

		fetchVehicles();
	});

	return { list, loading, error };
}
