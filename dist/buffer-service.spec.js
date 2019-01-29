"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_service_1 = require("./buffer-service");
describe("BufferHandler", () => {
    it("deletes buffer", async () => {
        const bufferReader = new buffer_service_1.StandardBufferService();
        bufferReader.deleteBuffer();
        expect(bufferReader.getCompleteBufferContent())
            .toEqual([]);
    });
    it("deletes specific buffer entry", async () => {
        const bufferReader = new buffer_service_1.StandardBufferService();
        try {
            await bufferReader.deleteBufferEntry({ url: "notInBuffer" });
            fail("hmm - please let me think about it");
        }
        catch (error) {
            // works as designed
        }
        const optionsISS = { url: "http://api.open-notify.org/iss-now.json" };
        const optionsAstronauts = { url: "http://api.open-notify.org/astros.json" };
        await bufferReader.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() });
        await bufferReader.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() });
        await bufferReader.getBufferedResult(optionsISS);
        await bufferReader.getBufferedResult(optionsAstronauts);
        try {
            await bufferReader.deleteBufferEntry(optionsISS);
            expect(bufferReader.getCompleteBufferContent().length)
                .toEqual(1);
        }
        catch (error) {
            fail(error.message);
        }
        await bufferReader.deleteBufferEntry(optionsAstronauts);
        expect(bufferReader.getCompleteBufferContent().length)
            .toEqual(0);
    });
});
