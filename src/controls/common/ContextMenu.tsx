import {
	Button,
	ForwardRefComponent,
	Menu,
	MenuItemProps,
	MenuList,
	MenuPopover,
	MenuTrigger,
} from '@fluentui/react-components';
import React from 'react';

export interface ContextMenuProps {
	buttonText: string;
	menuOptions: React.ReactElement[];
}

export const ContextMenu: React.FC<ContextMenuProps> = (triggerText, menuOptions) => {
	return (
		<Menu positioning={{ autoSize: true }}>
			<MenuTrigger disableButtonEnhancement>
				<Button>{triggerText}</Button>
			</MenuTrigger>

			<MenuPopover>
				<MenuList>{menuOptions.map((item: ForwardRefComponent<MenuItemProps>) => item)}</MenuList>
			</MenuPopover>
		</Menu>
	);
};
