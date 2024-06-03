import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ItemsCollectionResponce } from "../models/_ApiBase/ItemsCollectionResponce";
import { ApiResponseSuccessfullUpdate } from "../models/_ApiBase/ApiResponseSuccessfullUpdate";
import { ApiResponseSuccessfullCreate } from "../models/_ApiBase/ApiResponseSuccessfullCreate";
import { BackendApiEndpoints } from "../helpers/BackendApiEndpoints";
import { PageSettings } from "../models/_Pagging/PageSetting";
import { FormatHelper } from "../helpers/FormatHelper";

export abstract class BaseCrudService<TGetModel, TCreateModel, TUpdateModel> {
    abstract typeName: string;
    constructor(protected httpClient: HttpClient) {

    }

    public GetAll(): Observable<ItemsCollectionResponce<TGetModel>> {
        return this.httpClient.get<ItemsCollectionResponce<TGetModel>>
            (BackendApiEndpoints.GetAll(this.typeName));
    }

    public GetPage(pageSettings: PageSettings): Observable<ItemsCollectionResponce<TGetModel>> {
        return this.httpClient.get<ItemsCollectionResponce<TGetModel>>
            (BackendApiEndpoints.Page(this.typeName), {
                params: {
                    startIndex: pageSettings.curentPage * pageSettings.itemsPerPage,
                    itemsPerPage: pageSettings.itemsPerPage,
                    filterString: pageSettings.currentFilterString
                }
            });
    }

    public GetPageFilter(filterString: string): Observable<ItemsCollectionResponce<TGetModel>> {
        return this.httpClient.get<ItemsCollectionResponce<TGetModel>>
            (BackendApiEndpoints.Page(this.typeName), {
                params: {
                    startIndex: 0,
                    itemsPerPage: 999999999,
                    filterString: filterString ?? ""
                }
            });
    }

    public Get(modelId: string): Observable<any> {
        return this.httpClient.get<TGetModel>(
            BackendApiEndpoints.Get(this.typeName) + `/${modelId}`
        );
    }

    public Delete(modelId: string): Observable<any> {
        return this.httpClient.delete<any>(
            BackendApiEndpoints.Delete(this.typeName) + `/${modelId}`
        );
    }

    public Create(newModel: TCreateModel): Observable<ApiResponseSuccessfullCreate> {
        let body = this.SpecifyDateFormat(newModel);
        return this.httpClient.post<ApiResponseSuccessfullCreate>(
            BackendApiEndpoints.Create(this.typeName),
            body
        );
    }

    public Update(updateModel: TUpdateModel): Observable<ApiResponseSuccessfullUpdate> {        
        let body = this.SpecifyDateFormat(updateModel);        
        return this.httpClient.put<ApiResponseSuccessfullUpdate>(
            BackendApiEndpoints.Update(this.typeName),
            body
        );
    }

    protected SpecifyDateFormat(model: TUpdateModel | TCreateModel | Object) {
        const newModel = Object.create({});
        Object.assign(newModel, model);
        for (let prop in newModel) {
            let value = newModel[prop];
            if (value instanceof Date) {
                if (newModel[prop].getHours() === 0 && newModel[prop].getMinutes() === 0 && newModel[prop].getSeconds() === 0 && newModel[prop].getMilliseconds() === 0) {
                    newModel[prop] = FormatHelper.DateToISOFormatString(newModel[prop]);
                }
                else {
                    newModel[prop] = newModel[prop].toISOString();
                }
            }
        }
        return newModel;
    }
}