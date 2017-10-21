import { GetController, GetObject } from './../../Infrastructure/IocConfig';
import { AboutController } from './AboutController';
import { AboutViewOption } from './AboutViewOption';
import { ContactController } from './ContactArea/ContactController';

class AboutAreaRoute {
    InitRoute() {
        var route = {
            '/about': {
                '/contact': {
                    on: (next) => {
                        document.title = "About | Contact | SpaApp";
                        GetController<ContactController>(ContactController).Init(next);
                    },
                },
                on: (next) => {
                    document.title = "About | SpaApp";
                    GetObject<AboutController>(AboutController)
                        .Init(GetObject<AboutViewOption>(AboutViewOption), 'about', next);
                }
            }
        };
        return route;
    }
}
export { AboutAreaRoute }