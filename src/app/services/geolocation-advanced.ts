import {Injectable} from "@angular/core";

@Injectable()
export class AGeolocation {

    constructor(
    ) {
        this.initService();
    }

    private initService() {
        if (cordova && cordova['AdvancedGeolocation']) {
            console.log()
        }
    }
}
