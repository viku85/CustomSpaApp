import { injectable } from "inversify";
import { HttpRequestResponse } from './../../../Component/IndexInternal';
import { BaseController, IGeneralRouteController } from './../../../Base/BaseController';
import { AboutViewOption } from './../AboutViewOption';

var ContactView = require("./ContactView.handlebars");
@injectable()
class ContactController
    extends BaseController
    implements IGeneralRouteController {
    constructor(public AboutViewOption: AboutViewOption) {
        super();
    }

    Init(routeNextWrapper?: (isInitialized?: boolean) => void) {
        if (!$.trim($(this.AboutViewOption.ContactContainerSelector).html()).length) {
            this.InitPage();
        }
        routeNextWrapper();
    }

    InitPage() {
        $(this.AboutViewOption.ContactContainerSelector).html(ContactView({
            Title: 'Contact',
            Message: 'Your contact page.'
        })).data('child-init', true);
    }
}
export { ContactController }