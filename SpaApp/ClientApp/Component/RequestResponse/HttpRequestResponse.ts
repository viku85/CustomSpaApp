import { injectable } from 'inversify';

@injectable()
class HttpRequestResponse {
    // Set value on DI.
    private rootUrl: string = '/';

    GetRootUrl(): string {
        return this.rootUrl;
    }

    GetGemsUrl(...relativeUrl: string[]): string {
        // TODO: Could be joined with any base URL for the entire application.
        return `${relativeUrl.join('/')}`
    }

    AjaxPost(option: AjaxRequest) {
        this.Ajax(option);
    }
    AjaxGet(option: AjaxRequest) {
        this.Ajax(option, 'GET');
    }

    private Ajax(option: AjaxRequest, ajaxRequestType: string = "POST") {
        $.ajax({
            url: this.GetGemsUrl(option.Url),
            type: ajaxRequestType,
            cache: false,
            data: option.DataToPost,
            success(data) {
                if (option.OnSuccess != undefined) {
                    option.OnSuccess(data);
                }
            },
            error() {
                if (option.OnFailure != undefined) {
                    option.OnFailure();
                }
            }
        });
    }
}

interface AjaxRequest {
    Url: string;
    DataToPost?: any;
    OnSuccess?: (data: any) => void;
    OnFailure?: () => void;
}
export { HttpRequestResponse, AjaxRequest };