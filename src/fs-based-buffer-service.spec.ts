
import { FSBasedBufferService } from "./fs-based-buffer-service"
import { IBufferEntry } from "./types"

const optionsISS: any = { url: "http://api.open-notify.org/iss-now.json" }

describe("FSBasedBufferService", () => {
    const fsBasedBufferService: FSBasedBufferService = new FSBasedBufferService()
    beforeEach(async () => {
        fsBasedBufferService
            .deleteBuffer()
        expect((await fsBasedBufferService.getCompleteBufferContent()).length)
            .toEqual(0)
    })

    afterEach(async () => {
        fsBasedBufferService
            .deleteBuffer()

        expect((await fsBasedBufferService.getCompleteBufferContent()).length)
            .toEqual(0)
    })

    it("returns undefined when no entry foud for options", async () => {

        await fsBasedBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() })

        try {
            await fsBasedBufferService.deleteBufferEntry({ url: "notInBuffer" })
            fail("hmm - please let me think about it")
        } catch (error) {
            // works as designed
        }

        const bufferEntries: IBufferEntry[] = await fsBasedBufferService.getCompleteBufferContent()

        expect(bufferEntries.length)
            .toEqual(1)

        expect(bufferEntries[0].options)
            .toEqual(optionsISS)

        const result: IBufferEntry | undefined =
            fsBasedBufferService.getBufferedResult({ url: "http://api.open-notify.org/astros.json" })

        expect(result)
            .toEqual(undefined)

        expect(1)
            .toEqual(1)
    })

    // it("delivers buffered result for options", async () => {

    //     const lastRequestDate: Date = new Date()

    //     await fsBasedBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate })
    //     await fsBasedBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() })

    //     expect(fsBasedBufferService.getBufferedResult(optionsISS))
    //         .toEqual({
    //             data: {},
    //             lastRequestDate,
    //             options: { url: "http://api.open-notify.org/iss-now.json" },
    //         })

    // })

    // it("deletes buffer", async () => {

    //     await fsBasedBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() })
    //     await fsBasedBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() })

    //     expect((await fsBasedBufferService.getCompleteBufferContent()).length)
    //         .toEqual(2)

    //     fsBasedBufferService.deleteBuffer()
    //     expect(fsBasedBufferService.getCompleteBufferContent())
    //         .toEqual([])
    // })

    // it("deletes specific buffer entry", async () => {

    //     try {
    //         await fsBasedBufferService.deleteBufferEntry({ url: "notInBuffer" })
    //         fail("hmm - please let me think about it")
    //     } catch (error) {
    //         // works as designed
    //     }

    //     await fsBasedBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() })
    //     await fsBasedBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() })

    //     await fsBasedBufferService.getBufferedResult(optionsISS)
    //     await fsBasedBufferService.getBufferedResult(optionsAstronauts)

    //     try {
    //         await fsBasedBufferService.deleteBufferEntry(optionsISS)
    //         expect((await fsBasedBufferService.getCompleteBufferContent()).length)
    //             .toEqual(1)

    //     } catch (error) {
    //         fail(error.message)
    //     }

    //     await fsBasedBufferService.deleteBufferEntry(optionsAstronauts)
    //     expect((await fsBasedBufferService.getCompleteBufferContent()).length)
    //         .toEqual(0)

    // })

})
