import { Field, SearchSortRequest, SelectItem } from '../models/entities';
import { ServerResponse } from "../models/custom.models"
import { UtilsService } from '../services/utils.service';
import { store } from '../store/configureStore';

declare var Messenger: any;

export module Toolbox {

    export function showAlert(msg){
        alertify.alert(isString(msg) ? msg : JSON.stringify(msg));
    }

    export function showError(msg) {
        alertify.error(isString(msg) ? msg : JSON.stringify(msg));
    }
    export function showSuccess(msg) {
        alertify.success(isString(msg) ? msg : JSON.stringify(msg));
    }
    export function showConfirm(msg) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            alertify.prompt(msg, function (e, str) {
                if (e) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, "");
        });
    }


    export function isString(o: any): boolean {
        return typeof o === 'string' || o instanceof String;
    }

    export function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    export function isInteger(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }

    export function getParameterByName(name: string, url: string): string {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    export function isUndefinedOrNull(obj){
        return obj === undefined || obj === null;
    }

    export function copyDeep<T>(obj:T) {
        if (obj) {
            return <T>JSON.parse(JSON.stringify(obj));
        }
        return obj;
    }
    export function copyShallow<T>(obj:T, copyProps:T = null){
        if (obj) {
            return <T>Object.assign({}, obj, copyProps);
        }
        return obj;
    }

    export function getAllFunctionNames(obj): string[] {
        let props: string[] = []
    
        do {
            const l = Object.getOwnPropertyNames(obj)
                .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
                .sort()
                .filter((p, i, arr) =>
                    typeof obj[p] === 'function' &&  //only the function
                    p !== 'constructor' &&           //not the constructor
                    (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
                    props.indexOf(p) === -1          //not overridden in a child
                )
            props = props.concat(l)
        }
        while (
            (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
            Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
        )
    
        return props
    }

    export function guid(): string {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    export function toSelectItemList(ds: any[], valueField: string, labelField: string, emptyItem?: SelectItem) {
        if (ds) {
            var selectItemList: SelectItem[] = [];
            if (emptyItem) {
                selectItemList.push(emptyItem);
            }
            ds.forEach((item) => {
                selectItemList.push({ label: item[labelField], value: item[valueField] });
            });

            return selectItemList;
        }
        return null;
    }


    export function setupEnterPressed(func: (p?: any) => any) {
        $(document).keypress((e) => {
            if (e.which == 13) {//13 === enter
                func();
            }
        })
    }


    export function setUpServerSidePagingSearch(utilsService:UtilsService, take: number, first:number, typeFullName: string, searchModel: any, sortField?: string, sortOrder?:number, filters?: any[], blockui?: boolean): Promise<ServerResponse<any>> {
        let page = (first + take) / take;
        let sort: SearchSortRequest = null;
        if (sortField) {
            sort = {};
            sort.field = sortField;
            sort.dir = sortOrder > 0 ? "ASC" : "DESC";
        }
        if (filters) {
            for (let prop in filters) {
                let md = filters[prop];//let type is FilterMetadata =>     value?: string; matchMode?: string;
                searchModel[prop] = md.value
            }
        }

        return utilsService.search(typeFullName, searchModel, take, page, sort, blockui);
    }

    export function getFileNameFromFileInput(id: string): string {
        var filename = null;
        if (id) {
            var fullPath = (<any>document.getElementById(id)).value;
            if (fullPath) {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1);
                }
            }
        }
        return filename;
    }

    export function isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    export function isDesktop() {
        return window.innerWidth > 1024;
    }

    export function isMobile() {
        return window.innerWidth <= 640;
    }
}