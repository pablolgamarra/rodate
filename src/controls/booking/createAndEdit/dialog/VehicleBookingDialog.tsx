import * as React from 'react';

import { UploadState } from '@common/enums/UploadState';
import { BookingRegisterForm } from '@controls/booking/createAndEdit/dialog/content/register/BookingRegisterForm';
import CustomDialog from '@controls/common/CustomDialog';
import {
	Button,
	DialogActions,
	DialogTrigger,
	Spinner,
	Toast,
	ToastBody,
	Toaster,
	ToastTitle,
	useId,
	useToastController,
} from '@fluentui/react-components';
import { useVehicleBookingForm } from '@hooks/forms/useVehicleBookingForm';
import useServiceContext from '@hooks/useServiceContext';
import { useVehicleBookingValidation } from '@hooks/useVehicleBookingValidation';

interface VehicleBookingDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerButton: React.ReactElement;
}

const VehicleBookingDialog: React.FC<VehicleBookingDialogProps> = ({ open, setOpen, triggerButton }) => {
	const { bookingService } = useServiceContext();
	const { formState } = useVehicleBookingForm();
	const [uploadingState, setUploadingState] = React.useState<UploadState>(UploadState.Idle);

	const toasterId = useId('vehicleBookingToaster');
	const { dispatchToast } = useToastController(toasterId);

	const handleSubmit = async (): Promise<void> => {
		try {
			const { parseIfValid } = useVehicleBookingValidation();

			const booking = await parseIfValid(formState);

			if (!booking) {
				throw Error(`Campos con error`);
			}

			setUploadingState(UploadState.Uploading);
			await bookingService.createItem(booking);
		} catch (e) {
			console.error('Error saving booking', e);
			setUploadingState(UploadState.Failed);
		}
	};

	React.useEffect(() => {
		switch (uploadingState) {
			case UploadState.Uploading:
				dispatchToast(
					<Toast>
						<ToastTitle media={<Spinner size='tiny' />}>Guardando reserva</ToastTitle>
						<ToastBody>Enviando datos al servidor...</ToastBody>
					</Toast>,
				);
				break;
			case UploadState.Uploaded:
				dispatchToast(
					<Toast>
						<ToastTitle>Reserva creada</ToastTitle>
						<ToastBody>La reserva se registró correctamente</ToastBody>
					</Toast>,
					{ intent: 'success' },
				);
				setTimeout(() => {
					window.location.reload();
				}, 1000);
				break;
			case UploadState.Failed:
				dispatchToast(
					<Toast>
						<ToastTitle>Error al guardar</ToastTitle>
						<ToastBody>Por favor, vuelva a intentarlo más tarde</ToastBody>
					</Toast>,
					{ intent: 'error' },
				);
				break;
		}
	}, [uploadingState, dispatchToast]);

	return (
		<>
			{triggerButton}
			<CustomDialog
				title={`Reservar vehículo`}
				open={open}
				setOpen={setOpen}
				dialogActions={
					<DialogActions>
						<DialogTrigger>
							<Button
								appearance='secondary'
								onClick={() => setOpen(false)}
							>
								Cancelar
							</Button>
						</DialogTrigger>
						<DialogTrigger>
							<Button
								appearance='primary'
								onClick={handleSubmit}
							>
								Reservar
							</Button>
						</DialogTrigger>
					</DialogActions>
				}
			>
				<BookingRegisterForm />;
			</CustomDialog>
			<Toaster
				toasterId={toasterId}
				position='top-end'
				pauseOnHover
			/>
		</>
	);
};

export default VehicleBookingDialog;
