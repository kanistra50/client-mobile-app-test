import {Provider} from '@angular/core';

import {AGeolocationPluginInterface} from "./advanced-geolocation.interface";
import {TR_CORDOVA_A_GEOLOCATION_TOKEN} from "./tr-cordova-token";

declare const cordova;

export const tokenProviderList: Provider[] = [
    {provide: 'Window', useFactory: getWindow},
    {provide: 'Document', useFactory: getDocument},
    {
        provide: TR_CORDOVA_A_GEOLOCATION_TOKEN,
        useFactory: trCordovaAdvancedGeolocation,
    },
];

export function getWindow(): any {
    return window;
}

export function getDocument(): any {
    return window.document;
}

export function trCordovaAdvancedGeolocation(): AGeolocationPluginInterface {
    try {
        console.log('cordova', cordova);
        if (cordova && cordova.define.moduleMap && cordova.define.moduleMap['cordova-plugin-advanced-geolocation.AdvancedGeolocation'].exports) {
            console.log(cordova.define.moduleMap['cordova-plugin-advanced-geolocation.AdvancedGeolocation'].exports);
            return cordova.define.moduleMap['cordova-plugin-advanced-geolocation.AdvancedGeolocation'].exports;
        } else {
            return {} as AGeolocationPluginInterface;
        }
    } catch (e) {
        console.error('Problems with AdvancedGeolocation plugin', e);
        return {} as AGeolocationPluginInterface;
    }
}
