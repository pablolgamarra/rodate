import { Status } from '@common/enums/Status';

export default interface Vehicle {
	Id: number;
	Plate: string;
	Brand: string;
	Model: string;
	Active: Status;
	Key?: string;
}
