import { injectable } from "inversify";
import { HttpRequestResponse } from './../../Component/IndexInternal';
import { BaseController, IGeneralRouteController } from './../../Base/BaseController';
import { HomeViewHolderOption } from './HomeViewHolderOption';

var HomeView = require("./HomeView.handlebars");

@injectable()
class HomeController
    extends BaseController
    implements IGeneralRouteController {
    constructor(public HolderOption: HomeViewHolderOption) {
        super();
    }

    Init(routeNextWrapper?: (isInitialized?: boolean) => void) {
        if (window.location.hash.slice(2) == '' ||
            !$(this.HolderOption.ContainerSelector).data('child-init')) {
            this.InitPage();
        }

        routeNextWrapper();
    }

    InitPage() {
        $(this.HolderOption.ContainerSelector).html(HomeView);
    }
}
export { HomeController }