"use strict";
// import { TGenericErrorResponse } from "../interfaces/error.types"
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerDuplicateError = void 0;
// import { TGenericErrorResponse } from "../interfaces/error.types"
/* eslint-disable @typescript-eslint/no-explicit-any */
const handlerDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`
    };
};
exports.handlerDuplicateError = handlerDuplicateError;
