import { injectable } from 'inversify';

@injectable()
class ContactViewOption {
    constructor(option: any) {
        this.FormSelector = option.FormSelector;
        this.SubmitButtonSelector = option.SubmitButtonSelector;
    }
    FormSelector: string;
    SubmitButtonSelector: string;
}

interface IContactViewOption {
    FormSelector: string;
    SubmitButtonSelector: string
}
export { ContactViewOption, IContactViewOption }