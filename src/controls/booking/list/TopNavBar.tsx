import { SelectTabData, SelectTabEvent, Tab, TabList } from '@fluentui/react-components';
import React from 'react';

export interface TopNavBarProps {
	selectedValue: string;
	onTabSelect: (ev: SelectTabEvent<HTMLElement>, data: SelectTabData) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ selectedValue, onTabSelect }) => {
	return (
		<TabList
			selectedValue={selectedValue}
			onTabSelect={onTabSelect}
		>
			<Tab value='approved'>Aprobadas</Tab>
			<Tab value='pending'>Pendientes</Tab>
			<Tab value='rejected'>Rechazadas</Tab>
			<Tab value='canceled'>Canceladas</Tab>
			<Tab value='finished'>Finalizadas</Tab>
			<Tab value='all'>Todas</Tab>
		</TabList>
	);
};
