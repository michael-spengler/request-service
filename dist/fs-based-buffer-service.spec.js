"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_based_buffer_service_1 = require("./fs-based-buffer-service");
const optionsISS = { url: "http://api.open-notify.org/iss-now.json" };
const optionsAstronauts = { url: "http://api.open-notify.org/astros.json" };
describe("FSBasedBufferService", () => {
    const fsBasedufferService = new fs_based_buffer_service_1.FSBasedBufferService();
    beforeEach(async () => {
        fsBasedufferService
            .deleteBuffer();
    });
    it("returns undefined when no entry foud for options", async () => {
        await fsBasedufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() });
        expect((await fsBasedufferService.getBufferedResult(optionsAstronauts)))
            .toEqual(undefined);
    });
    it("delivers buffered result for options", async () => {
        const lastRequestDate = new Date();
        await fsBasedufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate });
        await fsBasedufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() });
        const result = await fsBasedufferService.getBufferedResult(optionsISS);
        expect(result.data)
            .toEqual({});
        expect(result.options)
            .toEqual(optionsISS);
        expect(new Date(result.lastRequestDate))
            .toEqual(lastRequestDate);
    });
    // it("deletes buffer", async () => {
    //     const fsBasedBufferService: FSBasedBufferService = new FSBasedBufferService()
    //     await fsBasedBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() })
    //     await fsBasedBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() })
    //     expect((await fsBasedBufferService.getCompleteBufferContent()).length)
    //         .toEqual(2)
    //     fsBasedBufferService.deleteBuffer()
    //     expect(fsBasedBufferService.getCompleteBufferContent())
    //         .toEqual([])
    //     try {
    //         await fsBasedBufferService.deleteBufferEntry({ url: "notInBuffer" })
    //         fail("hmm - please let me think about it")
    //     } catch (error) {
    //         // works as designed
    //     }
    // })
    // it("deletes specific buffer entry", async () => {
    //     const standardBufferService: FSBasedBufferService = new FSBasedBufferService()
    //     try {
    //         await standardBufferService.deleteBufferEntry({ url: "notInBuffer" })
    //         fail("hmm - please let me think about it")
    //     } catch (error) {
    //         // works as designed
    //     }
    //     await standardBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() })
    //     await standardBufferService.addToBuffer(
    // { options: optionsAstronauts, data: { }, lastRequestDate: new Date() })
    //     await standardBufferService.getBufferedResult(optionsISS)
    //     await standardBufferService.getBufferedResult(optionsAstronauts)
    //     try {
    //         await standardBufferService.deleteBufferEntry(optionsISS)
    //         expect((await standardBufferService.getCompleteBufferContent()).length)
    //             .toEqual(1)
    //     } catch (error) {
    //         fail(error.message)
    //     }
    //     await standardBufferService.deleteBufferEntry(optionsAstronauts)
    //     expect((await standardBufferService.getCompleteBufferContent()).length)
    //         .toEqual(0)
    // })
});
