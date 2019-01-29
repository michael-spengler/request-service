import { StandardBufferService } from "./standard-buffer-service"

const optionsISS: any = { url: "http://api.open-notify.org/iss-now.json" }
const optionsAstronauts: any = { url: "http://api.open-notify.org/astros.json" }

describe("FSBasedBufferService", () => {

    it("returns undefined when no entry foud for options", async () => {
        const standardBufferService: StandardBufferService = new StandardBufferService()
        await standardBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() })

        expect(standardBufferService.getBufferedResult(optionsAstronauts))
            .toEqual(undefined)
    })

    it("delivers buffered result for options", async () => {
        const standardBufferService: StandardBufferService = new StandardBufferService()

        const lastRequestDate: Date = new Date()

        await standardBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate })
        await standardBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() })

        expect(standardBufferService.getBufferedResult(optionsISS))
            .toEqual({
                data: {},
                lastRequestDate,
                options: { url: "http://api.open-notify.org/iss-now.json" },
            })

    })

    it("deletes buffer", async () => {
        const standardBufferService: StandardBufferService = new StandardBufferService()

        await standardBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() })
        await standardBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() })

        expect(standardBufferService.getCompleteBufferContent().length)
            .toEqual(2)

        standardBufferService.deleteBuffer()
        expect(standardBufferService.getCompleteBufferContent())
            .toEqual([])
    })

    it("deletes specific buffer entry", async () => {
        const standardBufferService: StandardBufferService = new StandardBufferService()

        try {
            await standardBufferService.deleteBufferEntry({ url: "notInBuffer" })
            fail("hmm - please let me think about it")
        } catch (error) {
            // works as designed
        }

        await standardBufferService.addToBuffer({ options: optionsISS, data: {}, lastRequestDate: new Date() })
        await standardBufferService.addToBuffer({ options: optionsAstronauts, data: {}, lastRequestDate: new Date() })

        await standardBufferService.getBufferedResult(optionsISS)
        await standardBufferService.getBufferedResult(optionsAstronauts)

        try {
            await standardBufferService.deleteBufferEntry(optionsISS)
            expect(standardBufferService.getCompleteBufferContent().length)
                .toEqual(1)

        } catch (error) {
            fail(error.message)
        }

        await standardBufferService.deleteBufferEntry(optionsAstronauts)
        expect(standardBufferService.getCompleteBufferContent().length)
            .toEqual(0)

    })

})
