"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standard_buffer_service_1 = require("./standard-buffer-service");
const optionsISS = { url: "http://api.open-notify.org/iss-now.json" };
const optionsAstronauts = { url: "http://api.open-notify.org/astros.json" };
describe("FSBasedBufferService", () => {
    it("returns undefined when no entry foud for options", async () => {
        const standardBufferService = new standard_buffer_service_1.StandardBufferService();
        await standardBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() });
        expect(standardBufferService.getBufferedResult(optionsAstronauts))
            .toEqual(undefined);
    });
    it("delivers buffered result for options", async () => {
        const standardBufferService = new standard_buffer_service_1.StandardBufferService();
        const lastRequestDate = new Date();
        await standardBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate });
        await standardBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() });
        expect(standardBufferService.getBufferedResult(optionsISS))
            .toEqual({
            data: {},
            lastRequestDate,
            options: { url: "http://api.open-notify.org/iss-now.json" },
        });
    });
    it("deletes buffer", async () => {
        const standardBufferService = new standard_buffer_service_1.StandardBufferService();
        await standardBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() });
        await standardBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() });
        expect(standardBufferService.getCompleteBufferContent().length)
            .toEqual(2);
        standardBufferService.deleteBuffer();
        expect(standardBufferService.getCompleteBufferContent())
            .toEqual([]);
    });
    it("deletes specific buffer entry", async () => {
        const standardBufferService = new standard_buffer_service_1.StandardBufferService();
        try {
            await standardBufferService.deleteBufferEntry({ url: "notInBuffer" });
            fail("hmm - please let me think about it");
        }
        catch (error) {
            // works as designed
        }
        await standardBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() });
        await standardBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() });
        await standardBufferService.getBufferedResult(optionsISS);
        await standardBufferService.getBufferedResult(optionsAstronauts);
        try {
            await standardBufferService.deleteBufferEntry(optionsISS);
            expect(standardBufferService.getCompleteBufferContent().length)
                .toEqual(1);
        }
        catch (error) {
            fail(error.message);
        }
        await standardBufferService.deleteBufferEntry(optionsAstronauts);
        expect(standardBufferService.getCompleteBufferContent().length)
            .toEqual(0);
    });
});
