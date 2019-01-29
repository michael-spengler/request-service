import { FSBasedBufferService } from "./fs-based-buffer-service"
import { RequestService } from "./request-service"
import { StandardBufferService } from "./standard-buffer-service"
import { IBufferEntry } from "./types"

jest.mock("request")

describe("RequestService", () => {

    const request: any = require("request-promise")
    const optionsISS: any = { url: "http://api.open-notify.org/iss-now.json" }
    const bufferIntervalInMilliSeconds: number = 60 * 60 * 1000 // hourly
    const bufferService: StandardBufferService = new StandardBufferService()
    // const bufferService: FSBasedBufferService = new FSBasedBufferService()

    beforeEach(async () => {
        jest.clearAllMocks()
        jest.spyOn(bufferService, "deleteBufferEntry")
        jest.spyOn(bufferService, "addToBuffer")

        const mockGet: any = request.get
        mockGet.mockImplementation(() => ({ someContent: "hello world" }))
        await bufferService.deleteBuffer()
    })

    it("performs two subsequent requests - delivering buffered data from buffer", async () => {
        const requestService: RequestService =
            RequestService.getInstance([bufferService])

        const firstCallsResult: IBufferEntry = await requestService.get(optionsISS, bufferIntervalInMilliSeconds)
        expect(firstCallsResult.data)
            .toEqual({ someContent: "hello world" })

        expect(bufferService.addToBuffer)
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

    // it("performs two subsequent requests - replacing outdated data in buffer", async () => {
    //     const requestService: RequestService =
    //         RequestService.getInstance([bufferService])

    //     const firstCallsResult: IBufferEntry =
    //         await requestService.get(optionsISS, bufferIntervalInMilliSeconds)

    //     expect(firstCallsResult.data)
    //         .toEqual({ someContent: "hello world" })

    //     expect(firstCallsResult.options)
    //         .toEqual(optionsISS)

    //     const aShortMomentInTime: number = 0.0001

    //     const secondCallsResult: IBufferEntry =
    //         await requestService.get(optionsISS, aShortMomentInTime)

    //     expect(bufferService.deleteBufferEntry)
    //         .toHaveBeenCalledTimes(1)

    //     expect(firstCallsResult === secondCallsResult)
    //         .toBeFalsy()

    // })
})
