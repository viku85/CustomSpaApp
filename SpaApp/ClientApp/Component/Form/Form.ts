import { injectable } from "inversify";

@injectable()
class Form {
    constructor() {
    }
    SubmitForm(option: AjaxFormPostContent) {
        var form: JQuery;
        var buttonSource: JQuery;
        var curEvent: JQuery.Event<HTMLElement, null>;
        if (option.Source.ButtonEvent) {
            buttonSource = $(option.Source.ButtonEvent.currentTarget);
            form = buttonSource.closest("form");
            curEvent = option.Source.ButtonEvent;
        }
        else if (option.Source.FormSubmitEvent) {
            form = $(option.Source.FormSubmitEvent.currentTarget);
            curEvent = option.Source.FormSubmitEvent;
        }
        curEvent.preventDefault();

        var formId = $(form).attr('id');

        if (!formId) {
            console.error('form id not specified');
            return;
        }

        var triggeredForm = "#" + formId;

        if (!$(triggeredForm).attr('action').length) {
            console.error('URL missing for form submit.');
            return;
        }

        if (form.hasClass("loading")) {
            curEvent.preventDefault();
            return;
        }

        form.addClass("loading");

        $.each($(form).find("button[type='submit']"), (index, btn) => {
            $(btn).addClass("loading");
        });

        $.validator.unobtrusive.parse(`#${formId}`);

        var serializedData = {};
        $(triggeredForm).serializeArray()
            .map((key) => { serializedData[key.name] = key.value; });

        if (option.SerializeData != undefined) {
            option.SerializeData(serializedData);
        }
        var formProgress = (state: boolean) => {
            // TODO: Add progess status for form.
        };
        if ($(triggeredForm).valid()) {
            formProgress(true);
            $.ajax({
                url: $(triggeredForm).attr('action'),
                data: JSON.stringify(serializedData),
                contentType: 'application/json',
                method: 'post',
                success: (data) => {
                    if (data != undefined && data != '') {
                        if (option.OnPostSuccess != undefined) {
                            option.OnPostSuccess(data);
                        }
                        if (option.OnPostSuccessResult) {
                            option.OnPostSuccessResult(data);
                            // TODO: Success notification
                        }
                        return;
                    }
                },
                error: (data, b, c) => {
                    if (data != undefined &&
                        data.responseJSON != undefined &&
                        data.status == 400) {
                        if (option.OnValidationFailure) {
                            option.OnValidationFailure(data.responseJSON);
                        }
                        if (option.OnValidationFailureMessageHandling == undefined) {
                            var message = '';
                            var propStrings = Object.keys(data.responseJSON);
                            $.each(propStrings, (errIndex, propString) => {
                                var propErrors = data.responseJSON[propString];
                                $.each(propErrors, (errMsgIndex, propError) => {
                                    message += propError;
                                });
                                message += '\n';
                                $(`#${propString}Error`).html(message)
                                    .removeClass('field-validation-valid').addClass('field-validation-error');
                                message = '';
                            });
                        }
                        else {
                            option.OnValidationFailureMessageHandling(data.responseJSON);
                        }
                        return;
                    }

                    if (option.OnFailure != undefined) {
                        option.OnFailure();
                    }
                    else {
                        // TODO: Failure notification
                    }
                },
                complete: () => {
                    formProgress(false);
                }
            });
        }

        form.removeClass("loading");
        $.each($(form).find("button[type='submit']"), (index, btn) => {
            $(btn).removeClass("loading");
        });
        // TODO: Reset loading state of buttons that are blocked in initial function start
    }
}
interface AjaxFormPostContent {
    Source: {
        ButtonEvent?: JQuery.Event<HTMLElement, null>,
        FormSubmitEvent?: JQuery.Event<HTMLElement, null>,
    },
    SerializeData?: (data) => void;
    OnPostSuccess?: (data: string) => void;
    OnFailure?: () => void;
    OnPostSuccessResult?: (data: any) => void;
    OnValidationFailure?: (data: JSON) => void;
    OnValidationFailureMessageHandling?: (data: JSON) => void;
}
export { Form, AjaxFormPostContent }