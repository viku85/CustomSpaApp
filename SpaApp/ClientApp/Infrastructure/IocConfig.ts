import { Container, interfaces } from 'inversify';

import { HttpRequestResponse, JqueryEventHelper, Form } from './../Component/IndexInternal';
import { HomeController } from './../AppArea/HomeArea/HomeController';
import { AboutController } from './../AppArea/AboutArea/AboutController';
import { ContactController } from './../AppArea/AboutArea/ContactArea/ContactController';

import { BaseController } from './../Base/BaseController';

let container = new Container();

// Helper
container.bind<HttpRequestResponse>(HttpRequestResponse).toSelf().inSingletonScope();
container.bind<JqueryEventHelper>(JqueryEventHelper).toSelf().inSingletonScope();
container.bind<Notification>(Notification).toSelf().inSingletonScope();
container.bind<Form>(Form).toSelf().inSingletonScope();

// Controllers
container.bind<HomeController>(HomeController).toSelf();

container.bind<AboutController>(AboutController).toSelf();
container.bind<ContactController>(ContactController).toSelf();

function GetObject<T>(service: any): T {
    return IsAlreadyInitilized(service) ? <T>container.get(service) : null;
}
function IsAlreadyInitilized(service): boolean {
    return container.isBound(service);
}
function SetConstant(service: any, instanc: any) {
    if (!container.isBound(service)) {
        container.bind(service)
            .toConstantValue(instanc);
    }
    else {
        console.log(`${service.name} is already registered.`);
    }
}

function GetController<T extends BaseController>(
    controller: interfaces.ServiceIdentifier<T>): T {
    return container.get<T>(controller);
}

export { GetObject, SetConstant, GetController, IsAlreadyInitilized };