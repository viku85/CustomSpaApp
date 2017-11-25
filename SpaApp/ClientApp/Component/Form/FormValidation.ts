import { injectable } from "inversify";
import { HttpRequestResponse } from './../RequestResponse/HttpRequestResponse';

@injectable()
class FormValidation {
    private AppendError(form: JQuery<HTMLFormElement> | JQuery<HTMLElement>,
        error: JQuery<HTMLElement>, element: JQuery<HTMLElement>) {
        let errorSelector = $(`#${$(element).attr("id")}Error`);
        errorSelector = errorSelector.length ? errorSelector : $(`#${$(element).attr("id")}-error`);

        if (errorSelector.length) {
            errorSelector.removeClass('field-validation-valid').addClass('field-validation-error');
            errorSelector.text(error.text());
        }
        else {
            $(element)
                .parent().after(
                `<div id='${$(element).attr('name')}Holder' class="field-validation-error"></div>`);
            $(`#${(element).attr('name')}Holder`).append(error);
        }
    }

    ParseModelStateError(data: JQuery.jqXHR<any>, eachErrorCallback: (message: string, propName: string) => void) {
        if (data == undefined || data.responseJSON == undefined) {
            return;
        }
        var message = '';
        var propStrings = Object.keys(data.responseJSON);
        $.each(propStrings, (errIndex, propString) => {
            var propErrors = data.responseJSON[propString];
            $.each(propErrors, (errMsgIndex, propError) => {
                message += propError;
            });
            message += '\n';
            eachErrorCallback(message, propString);
            message = '';
        });
    }

    private RemoteValidation(elementName: string,
        form: JQuery<HTMLFormElement> | JQuery<HTMLElement>) {
        let getData = () => {
            let serializedData = {};
            $(form).serializeArray()
                .map((key) => { serializedData[key.name] = key.value; });
            return JSON.stringify(serializedData);
        }

        let remote: JQueryAjaxSettings = {
            url: `${form.attr('action')}?validate=${elementName}`,
            type: "post",
            async: true,
            contentType: 'application/json',
            beforeSend: (xhr, setting) => {
                setting.data = getData();
            },
            dataFilter: (response) => {
                if ($.parseJSON(response) == true) {
                    return response;
                }
                var data = $.parseJSON(response);
                var validator: any = $(form).validate();
                validator.invalid[elementName] = data[elementName] != undefined;
                return JSON.stringify(data[elementName] != undefined ? data[elementName] : true);
            }
        };
        return remote;
    }
    RegisterJqueryValidation(formSelector: string) {
        let form = $(formSelector);

        $.ajax({
            url: form.attr('action') + '?validation=jquery',
            data: '{}',
            contentType: 'application/json',
            method: 'post',
            success: (validationRule: JQueryValidation.ValidationOptions) => {
                if (validationRule != undefined && validationRule.rules != undefined) {
                    validationRule.errorPlacement = (error, element) =>
                        this.AppendError(form, error, element);

                    validationRule.success = (label, input) =>
                        label.empty();

                    $.each(validationRule.rules, (prop: any) => {
                        if (validationRule.rules[prop].hasOwnProperty('remote')) {
                            validationRule.rules[prop].remote = () => this.RemoteValidation(prop, form);
                        }
                    });

                    $.validator.setDefaults({ ignore: '' });
                    var validator = form.validate(validationRule);
                }
            }
        });
    }
}

export { FormValidation }