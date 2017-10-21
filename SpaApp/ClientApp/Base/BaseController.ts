import { injectable } from 'inversify';

@injectable()
abstract class BaseController {
}

interface IGeneralRouteController {
    Init(routeNextWrapper?: (isInitialized?: boolean) => void);
}
export { BaseController, IGeneralRouteController }