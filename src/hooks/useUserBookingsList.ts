import { useEffect, useState } from 'react';

import { BookingStatus } from '@common/enums/BookingStatus';
import useServiceContext from '@hooks/useServiceContext';
import { useSPUser } from '@hooks/useSPUser';
import VehicleBooking from '@models/VehicleBooking';
import '@pnp/sp/site-users/web';
import '@pnp/sp/webs';

export function useUserBookingsList(status: BookingStatus | undefined): {
	list: VehicleBooking[];
	loading: boolean;
	error: string | undefined;
} {
	const { user } = useSPUser();

	const { bookingService: service } = useServiceContext();

	const [list, setList] = useState<VehicleBooking[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | undefined>(undefined);

	const userId = user?.Id;

	useEffect(() => {
		const fetchVehicleBookings = async (): Promise<void> => {
			try {
				if (!service) {
					throw Error(`Vehicle Service not find | loaded`);
				}

				if (!userId) {
					return;
				}

				setLoading(true);
				const results = await service.getBookingsByUser(userId || 0, status);
				setList(results);
			} catch (err) {
				setError(`Error fetching Vehicle Bookings ${err}`);
			} finally {
				setLoading(false);
			}
		};

		fetchVehicleBookings();
	}, [user, status, service]);

	return { list, loading, error };
}
