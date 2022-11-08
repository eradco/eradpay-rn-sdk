export interface IQueryParams {
    [key: string]: any;
}

export const queryParamsConfigMap = {
    amount: "am",
    amount_first_time: "am_ft",
    auth_auto_capture_mode: "auth_cm",
    auth_time: "auth_t",
    currency: "cu",
    customer_id: "c_id",
    frequency: "fr",
    email: "em",
    email_deprecated: "em_d",
    fullname: "fn",
    lastname: "ln",
    is_authorize_only: "is_ao",
    mode: "m",
    payment_id: "pa_id",
    payments_number: "pa_n",
    phone_code: "ph_c",
    phone_code_dial: "ph_c_d",
    phone_number: "ph_n",
    phone_number_deprecated: "pn",
    platform: "pl",
    product_name: "pr_n",
    start_date: "st_d",
    token: "t",
    type: "tp",
    webhook_url: "w_url",
    redirect_url: "r_url",
    is_save_card_needed: "sc",
};

export const buildShortQueryParams = (
    queryParams: IQueryParams,
    config: IQueryParams = {}
) => {
    const queryParamsShortMapKeys = Object.keys(config);
    return Object.keys(queryParams).reduce(
        (acc, key) => ({
            ...acc,
            [queryParamsShortMapKeys.includes(key) ? config[key] : key]:
                queryParams[key],
        }),
        {}
    );
};

export const restoreOriginalQueryParams = (
    shortQueryParams: IQueryParams,
    config: IQueryParams = {}
) => {
    const queryParamsShortMapKeys = Object.keys(config);
    const queryParamsShortMapValues: string[] = Object.values(config);
    return Object.keys(shortQueryParams).reduce((acc, key) => {
        const keyIndex = queryParamsShortMapValues.indexOf(key);
        const preparedKey =
            keyIndex === -1 ? key : queryParamsShortMapKeys[keyIndex];
        return { ...acc, [preparedKey]: shortQueryParams[key] };
    }, {}) as IQueryParams;
};
