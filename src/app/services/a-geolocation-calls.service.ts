import {Inject, Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {TR_CORDOVA_A_GEOLOCATION_TOKEN} from "./tr-cordova-token";
import {AGeolocationPluginInterface} from "./advanced-geolocation.interface";

@Injectable()
export class AGeolocationCallsService {

    constructor(
        @Inject(TR_CORDOVA_A_GEOLOCATION_TOKEN) private aGeolocation: AGeolocationPluginInterface,
    ) {}

    /**
     * JSON parser of requests
     * @param {string} data
     */
    private _modifyJsonResponse = <T>(data: string): T => {
        let parsedJson;

        try {
            parsedJson = JSON.parse(data);
        } catch (e) {
            console.error(e);
        }

        return parsedJson;
    };

    /**
     * Method that wraps call of native cordova method with observable
     * @param methodName
     * @param params
     * @private
     */
    private _cordovaCall<T>(methodName: string, params: any[]): Observable<T> {

        if (this.aGeolocation[0] === undefined) {
            console.warn('Unreachable TR_CORDOVA_A_GEOLOCATION_TOKEN (methodName)', this.aGeolocation);
            return;
        }
        return from(new Promise(((resolve, reject) => {
            this.aGeolocation[methodName](
                ...params,
                (response: string) => {
                    resolve(this._modifyJsonResponse<T>(response));
                },
                (error: string) => {
                  console.error(error);
                  reject(this._modifyJsonResponse(error));
                }
            );

        })));
    }


    start(params): Observable<any> {
        return this._cordovaCall<any>('start', params);
    }
    stop(params): Observable<any> {
        return this._cordovaCall<any>('stop', params);
    }
    kill(params): Observable<any> {
        return this._cordovaCall<any>('kill', params);
    }
}
