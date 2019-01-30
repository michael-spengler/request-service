"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_based_buffer_service_1 = require("./fs-based-buffer-service");
const request_service_1 = require("./request-service");
jest.mock("request");
describe("RequestService using the FSBasedBuffer as an example for an IBufferService implementation", () => {
    const request = require("request-promise");
    const optionsISS = { url: "http://api.open-notify.org/iss-now.json" };
    const bufferIntervalInMilliSeconds = 60 * 60 * 1000; // hourly
    const fSBasedBufferService = new fs_based_buffer_service_1.FSBasedBufferService();
    beforeEach(async () => {
        jest.clearAllMocks();
        jest.spyOn(fSBasedBufferService, "deleteBufferEntry");
        jest.spyOn(fSBasedBufferService, "addToBuffer");
        const mockGet = request.get;
        mockGet.mockImplementation(() => ({ someContent: "hello world" }));
        fSBasedBufferService
            .deleteBuffer();
    });
    it("performs two subsequent requests - delivering buffered data from buffer", async () => {
        const requestService = request_service_1.RequestService.getInstance([fSBasedBufferService]);
        const firstCallsResult = await requestService.get(optionsISS, bufferIntervalInMilliSeconds);
        expect(firstCallsResult.data)
            .toEqual({ someContent: "hello world" });
        expect(fSBasedBufferService.addToBuffer)
            .toHaveBeenCalledTimes(1);
        expect(firstCallsResult.options)
            .toEqual(optionsISS);
        const secondCallsResult = await requestService.get(optionsISS, bufferIntervalInMilliSeconds);
        expect(firstCallsResult.data)
            .toEqual(secondCallsResult.data);
        expect(firstCallsResult.options)
            .toEqual(secondCallsResult.options);
        expect(firstCallsResult.lastRequestDate)
            .toEqual(secondCallsResult.lastRequestDate);
    });
    it("performs two subsequent requests - replacing outdated data in buffer", async () => {
        const requestService = request_service_1.RequestService.getInstance([fSBasedBufferService]);
        const firstCallsResult = await requestService.get(optionsISS, bufferIntervalInMilliSeconds);
        expect(firstCallsResult.data)
            .toEqual({ someContent: "hello world" });
        expect(firstCallsResult.options)
            .toEqual(optionsISS);
        expect(fSBasedBufferService.addToBuffer)
            .toHaveBeenCalledTimes(1);
        const aShortMomentInTime = 0.0001;
        const secondCallsResult = await requestService.get(optionsISS, aShortMomentInTime);
        //     expect(fSBasedBufferService.deleteBufferEntry)
        //         .toHaveBeenCalledTimes(1)
        //     expect(firstCallsResult === secondCallsResult)
        //         .toBeFalsy()
    });
});
