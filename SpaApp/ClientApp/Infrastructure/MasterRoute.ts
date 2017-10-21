import { injectable, interfaces } from "inversify";
import { GetController } from './IocConfig';
import { AboutAreaRoute } from './../AppArea/AboutArea';

import { HomeController, AboutController } from './../AppArea';

declare var Router: any;
declare var director: any;

@injectable()
export class MasterRoute {
    constructor() {
        this.Init();
    }

    Init(): void {
        var router: any = null;

        router = Router(this.GetRoutes()).configure({
            on: this.GetListener(),
            recurse: 'forward',
            async: true
        }).init('/');
    }
    GetRoutes() {
        var aboutAreaRoute = new AboutAreaRoute().InitRoute();
        var routes = {
            '/': {
                on: (next) => {
                    document.title = "Home | SpaApp";
                    GetController<HomeController>(HomeController).Init(next);
                }
            }
        };
        $.extend(routes, aboutAreaRoute);
        return routes;
    }

    public GetListener() {
        console.log("Listener at: " + window.location);
    }
}