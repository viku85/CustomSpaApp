import { injectable } from "inversify";

@injectable()
class JqueryEventHelper {
    public RegisterClickEvent(
        selector: string,
        clickEvent: (evt: JQuery.Event<HTMLElement, null>, selector: string) => void) {
        this.RegisterEvent({
            Selector: selector,
            EventName: 'click',
            Callback: clickEvent
        });
    };

    public RegisterChangeEvent(
        selector: string,
        clickEvent: (evt: JQuery.Event<HTMLElement, null>, selector: string) => void) {
        this.RegisterEvent({
            Selector: selector,
            EventName: 'change',
            Callback: clickEvent
        });
    };

    private RegisterEvent(option: {
        Selector: string;
        EventName: string;
        Callback: (evt: JQuery.Event<HTMLElement, null>, selector: string) => void;
    }) {
        $(document).off(option.EventName, option.Selector)
            .on(option.EventName, option.Selector, (evt) => {
                option.Callback(evt, option.Selector);
                evt.preventDefault();
            });
    }
}

export { JqueryEventHelper }