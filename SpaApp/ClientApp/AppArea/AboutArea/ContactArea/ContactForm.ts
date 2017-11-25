import { injectable } from "inversify";
import { GetObject } from './../../../Infrastructure/IocConfig';
import { HttpRequestResponse } from './../../../Component/IndexInternal';
import { BaseController, IGeneralRouteController } from './../../../Base/BaseController';
import { AboutViewOption } from './../AboutViewOption';
import { ContactViewOption, IContactViewOption } from './ContactViewOption';
import { Form, JqueryEventHelper, FormValidation } from './../../../Component/IndexInternal';

@injectable()
class ContactForm {
    constructor(
        readonly ContactViewOption: ContactViewOption,
        readonly FormHelper: Form,
        readonly Validation: FormValidation,
        readonly EventHelper: JqueryEventHelper) {
        this.Init();
    }

    Init() {
        this.Validation.RegisterJqueryValidation(this.ContactViewOption.FormSelector);

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