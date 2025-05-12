import { ISiteUserInfo } from '@pnp/sp/site-users/types';

export interface ISPService {
	getSPUser(): { spSiteUser: Promise<ISiteUserInfo>; alternativeSiteUser: Promise<ISiteUserInfo | undefined> };
	getAllItems<T = any>(listName: string, useAlternativeWeb: boolean): Promise<T[]>;
	getItemsFiltered<T = any>(listName: string, filter: string, useAlternativeWeb: boolean): Promise<T[]>;
	getItemById<T = any>(listName: string, id: number, useAlternativeWeb: boolean): Promise<T>;
	insertItem<T extends { Id?: number }>(listName: string, item: T, useAlternativeWeb: boolean): Promise<boolean>;
	updateItem<T extends { Id: number }>(listName: string, item: T, useAlternativeWeb: boolean): Promise<boolean>;
	deleteItem(listName: string, id: number, useAlternativeWeb: boolean): Promise<boolean>;
	insertDocument?<T extends { Id: number; file: File }>(
		libraryName: string,
		item: T,
		useAlternativeWeb: boolean,
	): Promise<boolean>;
	getDocument?: (
		libraryName: string,
		fileNameURI: string,
		useAlternativeWeb: boolean,
	) => Promise<ArrayBuffer | undefined>;
	getListItemsPaged<T = any>(
		listName: string,
		arg0: number,
		arg1: number,
		useAlternativeWeb: boolean,
	): Promise<{ results: T[]; totalCount: number }>;
}
