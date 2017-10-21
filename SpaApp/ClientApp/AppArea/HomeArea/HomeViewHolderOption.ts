import { injectable } from 'inversify';

@injectable()
class HomeViewHolderOption
    implements IHomeViewHolderOption {
    constructor(option: IHomeViewHolderOption) {
        this.ContainerSelector = option.ContainerSelector;
    }
    ContainerSelector: string;
}
interface IHomeViewHolderOption {
    ContainerSelector: string;
}
export { HomeViewHolderOption, IHomeViewHolderOption }