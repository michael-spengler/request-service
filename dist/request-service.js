"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const interval_checker_1 = require("./interval-checker");
class RequestService {
    // private constructor to ensure singleton concept
    constructor(bufferService) {
        this.bufferService = bufferService;
    }
    static getInstance(bufferService) {
        if (RequestService.instance === undefined) {
            RequestService.instance = new RequestService(bufferService);
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
        const bufferedResult = await this.bufferService.getBufferedResult(options);
        if (!(bufferedResult === undefined)) {
            const lastRequestDate = (typeof (bufferedResult.lastRequestDate) === "string") ?
                new Date(bufferedResult.lastRequestDate) :
                bufferedResult.lastRequestDate;
            if (interval_checker_1.IntervalChecker.isWithinInterval(bufferIntervalInMilliseconds, lastRequestDate)) {
                validBufferedResult = bufferedResult;
                validBufferedResult.lastRequestDate = lastRequestDate;
            }
            else {
                await this.bufferService.deleteBufferEntry(options);
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
        await this.bufferService.addToBuffer(result);
        return result;
    }
}
exports.RequestService = RequestService;
