import VehicleBookingDialog from '@controls/booking/createAndEdit/dialog/VehicleBookingDialog';
import { Button } from '@fluentui/react-components';
import * as React from 'react';

export interface VehicleBookingFormProps {}

const VehicleBookingForm: React.FC<VehicleBookingFormProps> = () => {
	const [registerFormShow, setRegisterFormShow] = React.useState<boolean>(false);

	return (
		<>
			<VehicleBookingDialog
				open={registerFormShow}
				setOpen={setRegisterFormShow}
				triggerButton={
					<Button
						onClick={() => {
							setRegisterFormShow(!registerFormShow);
						}}
					>
						Nueva Reserva
					</Button>
				}
			/>
		</>
	);
};

export default VehicleBookingForm;
