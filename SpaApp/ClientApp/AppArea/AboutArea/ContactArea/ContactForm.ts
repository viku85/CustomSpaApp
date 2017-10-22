import { injectable } from "inversify";
import { GetObject } from './../../../Infrastructure/IocConfig';
import { HttpRequestResponse } from './../../../Component/IndexInternal';
import { BaseController, IGeneralRouteController } from './../../../Base/BaseController';
import { AboutViewOption } from './../AboutViewOption';
import { ContactViewOption, IContactViewOption } from './ContactViewOption';
import { Form, JqueryEventHelper } from './../../../Component/IndexInternal';

@injectable()
class ContactForm {
    constructor(
        readonly ContactViewOption: ContactViewOption,
        readonly FormHelper: Form,
        readonly EventHelper: JqueryEventHelper) {
        this.Init();
    }

    Init() {
        this.EventHelper.RegisterClickEvent(
            this.ContactViewOption.SubmitButtonSelector,
            (evt, selector) => {
                this.FormHelper.SubmitForm({
                    Source: {
                        ButtonEvent: evt
                    },
                    OnPostSuccessResult: (data) => {
                        console.log('Submitted successfully.');
                    }
                });
            });
    }
}
export { ContactForm }