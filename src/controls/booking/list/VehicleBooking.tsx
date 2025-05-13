import VehicleBookingForm from '@controls/booking/createAndEdit/VehicleBookingForm';
import { TopNavBar } from '@controls/booking/list/TopNavBar';
import { SelectTabData, SelectTabEvent } from '@fluentui/react-components';
import React, { FC, useState } from 'react';
import { VehicleBookingList } from './VehicleBookingList';

export interface VehicleBookingProps {}

export const VehicleBooking: FC<VehicleBookingProps> = () => {
	const [activeTab, setActiveTab] = useState<string>('approved');

	const onTabSelect = (ev: SelectTabEvent<HTMLElement>, data: SelectTabData): void => {
		setActiveTab(data.value as string);
	};

	return (
		<div className='tw-flex tw-flex-col tw-w-full tw-h-full tw-p-4'>
			<div className='tw-flex tw-flex-row tw-justify-between tw-items-center'>
				<h1 className='tw-text-2xl tw-font-bold'>Mis Reservas</h1>
			</div>
			<div className='tw-mt-4'>
				<VehicleBookingForm />
				<TopNavBar
					selectedValue={activeTab}
					onTabSelect={onTabSelect}
				/>
				<VehicleBookingList filter={activeTab} />
			</div>
		</div>
	);
};
