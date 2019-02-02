"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_service_1 = require("./request-service");
const standard_buffer_service_1 = require("./standard-buffer-service");
jest.mock("request");
describe("RequestService using the StandardBuffer as an example for an IBufferService implementation", () => {
    const request = require("request-promise");
    const optionsISS = { url: "http://api.open-notify.org/iss-now.json" };
    const bufferIntervalInMilliSeconds = 60 * 60 * 1000; // hourly
    const standardBufferService = new standard_buffer_service_1.StandardBufferService();
    beforeEach(async () => {
        jest.clearAllMocks();
        jest.spyOn(standardBufferService, "deleteBufferEntry");
        jest.spyOn(standardBufferService, "addToBuffer");
        const mockGet = request.get;
        mockGet.mockImplementation(() => ({ someContent: "hello world" }));
        await standardBufferService
            .deleteBuffer();
    });
    it("performs two subsequent requests - replacing outdated data in buffer", async () => {
        const requestService = request_service_1.RequestService.getInstance(standardBufferService);
        const firstCallsResult = await requestService.get(optionsISS, bufferIntervalInMilliSeconds);
        expect(firstCallsResult.data)
            .toEqual({ someContent: "hello world" });
        expect(firstCallsResult.options)
            .toEqual(optionsISS);
        const aShortMomentInTime = 0.0001;
        const secondCallsResult = await requestService.get(optionsISS, aShortMomentInTime);
        expect(standardBufferService.deleteBufferEntry)
            .toHaveBeenCalledTimes(1);
        expect(firstCallsResult === secondCallsResult)
            .toBeFalsy();
    });
    it("performs two subsequent requests - delivering buffered data from buffer", async () => {
        const requestService = request_service_1.RequestService.getInstance(standardBufferService);
        const firstCallsResult = await requestService.get(optionsISS, bufferIntervalInMilliSeconds);
        expect(firstCallsResult.data)
            .toEqual({ someContent: "hello world" });
        expect(standardBufferService.addToBuffer)
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
});
