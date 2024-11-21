import {extractErrorCodeAndModule, ERROR_CODE} from "@local/airdrop-sdk/utils";

export const handleTxError = (e: Error) => {
    const {module, errorCode} = extractErrorCodeAndModule(e.message);
    if (module && errorCode) {
        const errorMessage = ERROR_CODE[module][errorCode.toString()];
        return errorMessage ? errorMessage : e.message
    }
    return e.message;
};
