"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const interval_checker_1 = require("./interval-checker");
class RequestService {
    // private constructor to ensure singleton concept
    constructor(bufferServices) {
        this.bufferServices = bufferServices;
    }
    static getInstance(bufferServices) {
        if (RequestService.instance === undefined) {
            RequestService.instance = new RequestService(bufferServices);
        }
        return RequestService.instance;
    }
    async get(options, bufferIntervalInMilliseconds) {
        const validBufferedResult = await this.getValidResultFromBuffer(options, bufferIntervalInMilliseconds);
        return (validBufferedResult === undefined) ?
            this.getNewRequestResult(options) :
            validBufferedResult;
    }
    async getValidResultFromBuffer(options, bufferIntervalInMilliseconds) {
        let validBufferedResult;
        for (const bufferService of this.bufferServices) {
            const bufferedResult = await bufferService.getBufferedResult(options);
            if (!(bufferedResult === undefined)) {
                const lastRequestDate = (typeof (bufferedResult.lastRequestDate) === "string") ?
                    new Date(bufferedResult.lastRequestDate) :
                    bufferedResult.lastRequestDate;
                if (interval_checker_1.IntervalChecker.isWithinInterval(bufferIntervalInMilliseconds, lastRequestDate)) {
                    validBufferedResult = bufferedResult;
                    validBufferedResult.lastRequestDate = lastRequestDate;
                }
                else {
                    await bufferService.deleteBufferEntry(options);
                }
            }
        }
        return validBufferedResult;
    }
    async getNewRequestResult(options) {
        const currentRequestResult = await request.get(options);
        const result = {
            data: currentRequestResult,
            lastRequestDate: new Date(),
            options,
        };
        this.bufferServices.forEach(async (bufferService) => {
            await bufferService.addToBuffer(result);
        });
        return result;
    }
}
exports.RequestService = RequestService;
