import { BaseService } from './base.service';
import { Field, SearchSortRequest, SearchRequest, SearchParams } from '../models/entities';
import { ServerResponse } from '../models/custom.models';


export class UtilsService extends BaseService {

    getMetaData(typeFullNameList: string[]): Promise<any> {
        return this.postList("/api/utils/GetMetaData", typeFullNameList, false);
    }

    search(typeFullName: string, searchObj: any, take?: number, page?: number, sort?: SearchSortRequest, blockui?:boolean): Promise<ServerResponse<any>> {
        var req: SearchRequest = { TypeFullName: typeFullName, EntityJson: JSON.stringify(searchObj) };
        let arr: SearchSortRequest[] = null;
        if (sort) {
            arr = [sort];
        }
        var body: SearchParams = { Request: req, Take: take, Page: page, Sort: arr }
        return this.postListServerResponse("/api/Utils/Search", body, blockui);
    }

    resetServerApp(): Promise<number> {
        return this.getSingle("/api/utils/ResetServerApp", false);
    }

    queryLog(query: string): Promise<any[]> {
        return this.getList("/api/utils/QueryLog?query=" + btoa(query), true);
    }

    getConnectedUsers(): Promise<any[]> {
        return this.getList("/api/utils/GetConnectedUsers", false);
    }
}

//export type MetadataType = {[typeName:string]: Field[]};