import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { PageContext } from '@microsoft/sp-page-context';
import { spfi, SPFI, SPFx } from '@pnp/sp/';
import '@pnp/sp/files';
import '@pnp/sp/folders';
import '@pnp/sp/items';
import '@pnp/sp/lists';
import '@pnp/sp/sites';
import '@pnp/sp/webs';
import { ISPService } from '@services/core/spService/ISPService';

export class SPService implements ISPService {
	//Debido a que en el constructor es necesario tener webUrl, se crea un ServiceKey customizado para poder instanciar el servicio desde el WebPart.
	// En el caso de que no se pase webUrl, se usara el contexto actual de la pagina.
	public static readonly servicekey: ServiceKey<ISPService> = ServiceKey.createCustom(
		'Rodate.SPService',
		(serviceScope: ServiceScope, webUrl?: string): SPService => {
			return new SPService(serviceScope, webUrl);
		},
	);

	private _sp!: SPFI;
	private _alternativeSp!: SPFI;
	private _pageContext!: PageContext;

	constructor(serviceScope: ServiceScope, webUrl?: string) {
		serviceScope.whenFinished(() => {
			try {
				this._pageContext = serviceScope.consume(PageContext.serviceKey);
				this._sp = spfi().using(SPFx({ pageContext: this._pageContext }));

				if (webUrl) {
					this._alternativeSp = spfi(webUrl).using(SPFx({ pageContext: this._pageContext }));
				}
			} catch (e) {
				throw new Error(`Error initializing SPService: ${e}`);
			}
		});
	}

	public async getAllItems<T = any>(listName: string, useAlternative: boolean): Promise<T[]> {
		try {
			if (useAlternative) {
				if (!this._alternativeSp) {
					throw new Error(`Alternative SP context is not available`);
				}
				return await this._alternativeSp.web.lists.getByTitle(listName).items();
			}
			return await this._sp.web.lists.getByTitle(listName).items();
		} catch (e) {
			if (useAlternative) {
				throw new Error(`Error retrieving list items from alternative site list: ${listName}: ${e}`);
			}
			throw new Error(`Error retrieving list items from ${listName}: ${e}`);
		}
	}

	public async getItemsFiltered<T = any>(listName: string, filter: string, useAlternative: boolean): Promise<T[]> {
		try {
			if (useAlternative) {
				if (!this._alternativeSp) {
					throw new Error(`Alternative SP context is not available`);
				}
				return await this._alternativeSp.web.lists.getByTitle(listName).items.filter(filter)();
			}
			return await this._sp.web.lists.getByTitle(listName).items.filter(filter)();
		} catch (e) {
			if (useAlternative) {
				throw new Error(`Error retrieving filtered items from alternative site list: ${listName}: ${e}`);
			}
			throw new Error(`Error retrieving filtered items from ${listName}: ${e}`);
		}
	}

	public async getItemById<T = any>(listName: string, id: number, useAlternative: boolean): Promise<T> {
		try {
			if (useAlternative) {
				if (!this._alternativeSp) {
					throw new Error(`Alternative SP context is not available`);
				}
				return await this._alternativeSp.web.lists.getByTitle(listName).items();
			}
			return await this._sp.web.lists.getByTitle(listName).items.getById(id)();
		} catch (e) {
			if (useAlternative) {
				throw new Error(`Error retrieving item with ${id} from alternative site list: ${listName}: ${e}`);
			}
			throw new Error(`Error retrieving item with ${id} from ${listName}: ${e}`);
		}
	}

	public async insertItem<T extends { Id?: number }>(
		listName: string,
		item: T,
		useAlternative: boolean,
	): Promise<boolean> {
		try {
			if (useAlternative) {
				if (!this._alternativeSp) {
					throw new Error(`Alternative SP context is not available`);
				}
				return await this._alternativeSp.web.lists.getByTitle(listName).items();
			}
			await this._sp.web.lists.getByTitle(listName).items.add(item);
			return true;
		} catch (e) {
			if (useAlternative) {
				throw new Error(`Error inserting item to alternative site list: ${listName}: ${e}`);
			}
			throw new Error(`Error inserting item into ${listName}: ${e}`);
		}
	}

	public async updateItem<T extends { Id: number }>(
		listName: string,
		item: T,
		useAlternative: boolean,
	): Promise<boolean> {
		try {
			if (useAlternative) {
				if (!this._alternativeSp) {
					throw new Error(`Alternative SP context is not available`);
				}
				return await this._alternativeSp.web.lists.getByTitle(listName).items();
			}
			await this._sp.web.lists.getByTitle(listName).items.getById(item.Id).update(item);
			return true;
		} catch (e) {
			if (useAlternative) {
				throw new Error(`Error updating item ${item.Id} in alternative site list: ${listName}: ${e}`);
			}
			throw new Error(`Error updating item ${item.Id} in ${listName}: ${e}`);
		}
	}

	public async deleteItem(listName: string, id: number, useAlternative: boolean): Promise<boolean> {
		try {
			if (useAlternative) {
				if (!this._alternativeSp) {
					throw new Error(`Alternative SP context is not available`);
				}
				return await this._alternativeSp.web.lists.getByTitle(listName).items();
			}
			await this._sp.web.lists.getByTitle(listName).items.getById(id).delete();
			return true;
		} catch (e) {
			if (useAlternative) {
				throw new Error(`Error deleting item with Id: ${id} from  alternative site list: ${listName}: ${e}`);
			}
			throw new Error(`Error deleting item with Id: ${id} from ${listName}: ${e}`);
		}
	}

	public async insertDocument<T extends { Id: number; file: File }>(
		libraryName: string,
		item: T,
		useAlternative: boolean,
	): Promise<boolean> {
		try {
			const fileNamePath = encodeURI(item.file.name);

			if (useAlternative) {
				if (!this._alternativeSp) {
					throw new Error(`Alternative SP context is not available`);
				}
				await this._alternativeSp.web
					.getFolderByServerRelativePath(libraryName)
					.files.addUsingPath(fileNamePath, item.file, { Overwrite: true });
				const uploadedFile = await this._alternativeSp.web
					.getFolderByServerRelativePath(`${libraryName}/${fileNamePath}`)
					.getItem();
				await uploadedFile.update({ Title: fileNamePath });
				return true;
			}

			await this._sp.web
				.getFolderByServerRelativePath(libraryName)
				.files.addUsingPath(fileNamePath, item.file, { Overwrite: true });
			const uploadedFile = await this._sp.web
				.getFolderByServerRelativePath(`${libraryName}/${fileNamePath}`)
				.getItem();
			await uploadedFile.update({ Title: fileNamePath });
			return true;
		} catch (e) {
			if (useAlternative) {
				throw new Error(`Error inserting document into alternative site list: ${libraryName}: ${e}`);
			}
			throw new Error(`Error inserting document into ${libraryName}: ${e}`);
		}
	}

	public async getDocument(
		libraryName: string,
		fileNameURI: string,
		useAlternative: boolean,
	): Promise<ArrayBuffer | undefined> {
		try {
			if (useAlternative) {
				if (!this._alternativeSp) {
					throw new Error(`Alternative SP context is not available`);
				}
				return await this._alternativeSp.web
					.getFolderByServerRelativePath(libraryName)
					.files.getByUrl(fileNameURI)
					.getBuffer();
			}
			return await this._sp.web
				.getFolderByServerRelativePath(libraryName)
				.files.getByUrl(fileNameURI)
				.getBuffer();
		} catch (e) {
			if (useAlternative) {
				throw new Error(
					`Error retrieving document ${fileNameURI} from alternative site list: ${libraryName}: ${e}`,
				);
			}
			throw new Error(`Error retrieving document ${fileNameURI} from ${libraryName}: ${e}`);
		}
	}

	public async getListItemsPaged<T = any>(
		listName: string,
		pageSize: number,
		pageNumber: number,
		useAlternative: boolean,
	): Promise<{ results: T[]; totalCount: number }> {
		try {
			const value2Skip = pageSize * (pageNumber - 1);

			if (useAlternative) {
				if (!this._alternativeSp) {
					throw new Error(`Alternative SP context is not available`);
				}
				const results = await this._alternativeSp.web.lists
					.getByTitle(listName)
					.items.top(pageSize)
					.skip(value2Skip)();
				const listInfo = await this._alternativeSp.web.lists.getByTitle(listName).select('ItemCount')();
				return { results, totalCount: listInfo.ItemCount };
			}

			const results = await this._sp.web.lists.getByTitle(listName).items.top(pageSize).skip(value2Skip)();
			const listInfo = await this._sp.web.lists.getByTitle(listName).select('ItemCount')();
			return { results, totalCount: listInfo.ItemCount };
		} catch (e) {
			if (useAlternative) {
				throw new Error(`Error retrieving paged items from alternative site list: ${listName}: ${e}`);
			}
			throw new Error(`Error retrieving paged items from ${listName}: ${e}`);
		}
	}
}
