import { injectable } from "inversify";
import { HttpRequestResponse } from './../../Component/IndexInternal';
import { BaseController } from './../../Base/BaseController';
import { HomeViewHolderOption } from './../HomeArea';
import { GetObject, GetController } from './../../Infrastructure/IocConfig';
import { AboutViewOption } from './AboutViewOption';

var AboutView = require("./AboutView.handlebars");

@injectable()
class AboutController
    extends BaseController {
    constructor(public HolderOption: HomeViewHolderOption) {
        super();
    }

    Init(aboutOption: AboutViewOption,
        routeName: string,
        routeNextWrapper?: (isInitialized?: boolean) => void) {
        if (aboutOption == null ||
            !$(aboutOption.ContactContainerSelector).data('child-init') ||
            window.location.hash.slice(2) == routeName
        ) {
            this.InitPage();
        }

        routeNextWrapper();
    }

    InitPage() {
        $(this.HolderOption.ContainerSelector).html(AboutView({
            Title: 'About',
            Message: 'Your application description page.'
        })).data('child-init', true);
    }
}
export { AboutController }