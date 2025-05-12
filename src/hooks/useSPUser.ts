// hooks/useCurrentSPUser.ts
import useServiceContext from '@hooks/useServiceContext';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import { useEffect, useState } from 'react';

export function useSPUser(): { user: ISiteUserInfo | undefined } {
	const { spService } = useServiceContext();
	const [user, setUser] = useState<ISiteUserInfo | undefined>(undefined);

	useEffect(() => {
		let isMounted = true;

		const loadUser = async (): Promise<void> => {
			try {
				const { spSiteUser } = spService.getSPUser();
				const result = await spSiteUser;
				if (isMounted) setUser(result);
			} catch (error) {
				console.error('Error getting SP user', error);
			}
		};

		loadUser();

		return () => {
			isMounted = false;
		};
	}, [spService]);

	return { user };
}
