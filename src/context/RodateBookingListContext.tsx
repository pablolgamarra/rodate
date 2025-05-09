import * as React from 'react';

export interface IBookingListContextProvider {}

const CustomContext = React.createContext<IBookingListContextProvider | undefined>(undefined);

const CustomProvider: React.FunctionComponent<IBookingListContextProvider> = ({
	children,
}: React.PropsWithChildren<IBookingListContextProvider>) => {
	return <CustomContext.Provider value={{}}>{children}</CustomContext.Provider>;
};

const useCustomContext = (): IBookingListContextProvider => {
	const loadFunc = React.useContext(CustomContext);

	if (loadFunc === undefined) {
		throw new Error('useCustomContext must be used within the CustomProvider');
	}

	return loadFunc;
};

CustomContext.displayName = 'CustomContext';
CustomProvider.displayName = 'CustomProvider';

export { CustomProvider, useCustomContext };
