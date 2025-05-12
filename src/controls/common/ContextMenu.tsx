import { Button, Menu, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import React from 'react';

export interface ContextMenuProps {
	buttonText: string;
	menuOptions: React.ReactElement[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ buttonText, menuOptions }) => {
	return (
		<Menu positioning={{ autoSize: true }}>
			<MenuTrigger disableButtonEnhancement>
				<Button>{buttonText}</Button>
			</MenuTrigger>

			<MenuPopover>
				<MenuList>{menuOptions.map((item, index) => React.cloneElement(item, { key: index }))}</MenuList>
			</MenuPopover>
		</Menu>
	);
};
