import { FSBasedBufferService } from "./fs-based-buffer-service"
import { RequestService } from "./request-service"
import { IBufferEntry } from "./types"

jest.mock("request")

describe("RequestService using the FSBasedBuffer as an example for an IBufferService implementation", () => {

    const request: any = require("request-promise")
    const optionsISS: any = { url: "http://api.open-notify.org/iss-now.json" }
    const bufferIntervalInMilliSeconds: number = 60 * 60 * 1000 // hourly
    const fSBasedBufferService: FSBasedBufferService = new FSBasedBufferService()

    beforeEach(async () => {
        jest.clearAllMocks()

        jest.spyOn(fSBasedBufferService, "deleteBufferEntry")
        jest.spyOn(fSBasedBufferService, "addToBuffer")

        const mockGet: any = request.get
        mockGet.mockImplementation(() => ({ someContent: "hello world" }))
        fSBasedBufferService
            .deleteBuffer()
    })

    it("performs two subsequent requests - delivering buffered data from buffer", async () => {
        const requestService: RequestService = RequestService.getInstance([fSBasedBufferService])

        const firstCallsResult: IBufferEntry = await requestService.get(optionsISS, bufferIntervalInMilliSeconds)
        expect(firstCallsResult.data)
            .toEqual({ someContent: "hello world" })

        expect(fSBasedBufferService.addToBuffer)
            .toHaveBeenCalledTimes(1)

        expect(firstCallsResult.options)
            .toEqual(optionsISS)

        const secondCallsResult: IBufferEntry = await requestService.get(optionsISS, bufferIntervalInMilliSeconds)
        expect(firstCallsResult.data)
            .toEqual(secondCallsResult.data)

        expect(firstCallsResult.options)
            .toEqual(secondCallsResult.options)

        expect(firstCallsResult.lastRequestDate)
            .toEqual(secondCallsResult.lastRequestDate)

    })

    it("performs two subsequent requests - replacing outdated data in buffer", async () => {
        const requestService: RequestService =
            RequestService.getInstance([fSBasedBufferService])

        const firstCallsResult: IBufferEntry =
            await requestService.get(optionsISS, bufferIntervalInMilliSeconds)

        expect(firstCallsResult.data)
            .toEqual({ someContent: "hello world" })

        expect(firstCallsResult.options)
            .toEqual(optionsISS)

        expect(fSBasedBufferService.addToBuffer)
            .toHaveBeenCalledTimes(1)

        const aShortMomentInTime: number = 0.0001

        const secondCallsResult: IBufferEntry =
            await requestService.get(optionsISS, aShortMomentInTime)

        //     expect(fSBasedBufferService.deleteBufferEntry)
        //         .toHaveBeenCalledTimes(1)

        //     expect(firstCallsResult === secondCallsResult)
        //         .toBeFalsy()

    })

})
