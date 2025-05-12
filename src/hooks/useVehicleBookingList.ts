import { useEffect, useState } from 'react';

import useServiceContext from '@hooks/useServiceContext';
import VehicleBooking from '@models/VehicleBooking';

export function useVehicleBookingList(filter: string): {
	list: VehicleBooking[];
	loading: boolean;
	error: string | undefined;
} {
	const { bookingService: service } = useServiceContext();

	const [list, setList] = useState<VehicleBooking[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | undefined>(undefined);

	useEffect(() => {
		const fetchVehicleBookings = async (): Promise<void> => {
			try {
				if (!service) {
					throw Error(`Vehicle Service not find | loaded`);
				}

				if (!filter) {
					setLoading(true);
					const data = await service.getAll();
					setList(data);
				} else {
					setLoading(true);
					const data = await service.getAllFiltered(filter);
					setList(data);
				}
			} catch (err) {
				setError(`Error fetching Vehicle Bookings ${err}`);
			} finally {
				setLoading(false);
			}
		};

		fetchVehicleBookings();
	}, []);

	return { list, loading, error };
}
