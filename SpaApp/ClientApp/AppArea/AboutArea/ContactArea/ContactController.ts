import { injectable } from "inversify";
import { GetObject } from './../../../Infrastructure/IocConfig';
import { HttpRequestResponse } from './../../../Component/IndexInternal';
import { BaseController, IGeneralRouteController } from './../../../Base/BaseController';
import { AboutViewOption } from './../AboutViewOption';
import { ContactViewOption, IContactViewOption } from './ContactViewOption';
import { Form, JqueryEventHelper } from './../../../Component/IndexInternal';

var ContactView = require("./ContactView.handlebars");

@injectable()
class ContactController
    extends BaseController
    implements IGeneralRouteController {
    constructor(public AboutViewOption: AboutViewOption,
        readonly FormHelper: Form,
        readonly EventHelper: JqueryEventHelper) {
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