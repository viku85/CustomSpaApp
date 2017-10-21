import { injectable } from 'inversify';

@injectable()
class AboutViewOption
    implements IAboutViewOption {
    constructor(option: IAboutViewOption) {
        this.ContactContainerSelector = option.ContactContainerSelector;
    }
    ContactContainerSelector: string;
}
interface IAboutViewOption {
    ContactContainerSelector: string;
}
export { AboutViewOption, IAboutViewOption }