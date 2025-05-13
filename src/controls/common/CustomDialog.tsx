import * as React from 'react';

import {
	Button,
	Dialog,
	DialogActions,
	DialogActionsProps,
	DialogBody,
	DialogContent,
	DialogSurface,
	DialogTitle,
	DialogTrigger,
	FluentProvider,
	Slot,
	webLightTheme,
} from '@fluentui/react-components';

import '../../../assets/dist/tailwind.css';

export interface CustomDialogProps {
	open: boolean;
	setOpen(arg0: boolean): void;
	title: string;
	action?: Slot<'div'>;
	secondaryButtonText?: string;
	primaryButtonText?: string;
	dialogActions?: DialogActionsProps;
}

const CustomDialog: React.FC<React.PropsWithChildren<CustomDialogProps>> = (
	props: React.PropsWithChildren<CustomDialogProps>,
) => {
	const { children, open, setOpen, title, action, secondaryButtonText, primaryButtonText, dialogActions } = props;

	return (
		<Dialog
			open={open}
			onOpenChange={(event, data) => setOpen(data.open)}
			modalType='alert'
		>
			<FluentProvider theme={webLightTheme}>
				<DialogSurface className='tw-bg-slate-50 tw-max-h-[720px] tw-overflow-auto'>
					<DialogBody>
						<DialogTitle action={action}>{title}</DialogTitle>
						<DialogContent>{children}</DialogContent>
						{dialogActions ? (
							dialogActions
						) : (
							<DialogActions className='tw-mt-auto'>
								<DialogTrigger>
									<Button appearance='secondary'>{secondaryButtonText}</Button>
								</DialogTrigger>
								<DialogTrigger>
									<Button appearance='primary'>{primaryButtonText}</Button>
								</DialogTrigger>
							</DialogActions>
						)}
					</DialogBody>
				</DialogSurface>
			</FluentProvider>
		</Dialog>
	);
};

export default CustomDialog;
