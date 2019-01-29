import { FSBasedBufferService } from "./fs-based-buffer-service"
import { RequestService } from "./request-service"
import { StandardBufferService } from "./standard-buffer-service"
import { IBufferEntry, IBufferService } from "./types"

jest.mock("request")

describe("RequestService", () => {

    const request: any = require("request-promise")
    const optionsISS: any = { url: "http://api.open-notify.org/iss-now.json" }
    const bufferIntervalInMilliSeconds: number = 60 * 60 * 1000 // hourly
    const standardBufferService: StandardBufferService = new StandardBufferService()
    // const fSBasedBufferService: FSBasedBufferService = new FSBasedBufferService()

    beforeEach(async () => {
        jest.clearAllMocks()
        jest.spyOn(standardBufferService, "deleteBufferEntry")
        jest.spyOn(standardBufferService, "addToBuffer")

        // jest.spyOn(fSBasedBufferService, "deleteBufferEntry")
        // jest.spyOn(fSBasedBufferService, "addToBuffer")

        const mockGet: any = request.get
        mockGet.mockImplementation(() => ({ someContent: "hello world" }))
        await standardBufferService
            .deleteBuffer()
        //        await fSBasedBufferService.deleteBuffer()
    })

    it("performs two subsequent requests - replacing outdated data in buffer", async () => {
        const requestService: RequestService =
            RequestService.getInstance([standardBufferService])

        const firstCallsResult: IBufferEntry =
            await requestService.get(optionsISS, bufferIntervalInMilliSeconds)

        expect(firstCallsResult.data)
            .toEqual({ someContent: "hello world" })

        expect(firstCallsResult.options)
            .toEqual(optionsISS)

        const aShortMomentInTime: number = 0.0001

        const secondCallsResult: IBufferEntry =
            await requestService.get(optionsISS, aShortMomentInTime)

        expect(standardBufferService.deleteBufferEntry)
            .toHaveBeenCalledTimes(1)

        expect(firstCallsResult === secondCallsResult)
            .toBeFalsy()

    })

    it("performs two subsequent requests - delivering buffered data from buffer", async () => {
        const requestService: RequestService = RequestService.getInstance([standardBufferService])

        const firstCallsResult: IBufferEntry = await requestService.get(optionsISS, bufferIntervalInMilliSeconds)
        expect(firstCallsResult.data)
            .toEqual({ someContent: "hello world" })

        expect(standardBufferService.addToBuffer)
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

    // it("performs two subsequent requests - delivering buffered data from buffer", async () => {
    //     const requestService: RequestService = RequestService.getInstance([fSBasedBufferService])

    //     const firstCallsResult: IBufferEntry = await requestService.get(optionsISS, bufferIntervalInMilliSeconds)
    //     expect(firstCallsResult.data)
    //         .toEqual({ someContent: "hello world" })

    //     expect(fSBasedBufferService.addToBuffer)
    //         .toHaveBeenCalledTimes(1)

    //     expect(firstCallsResult.options)
    //         .toEqual(optionsISS)

    //     const secondCallsResult: IBufferEntry = await requestService.get(optionsISS, bufferIntervalInMilliSeconds)
    //     expect(firstCallsResult.data)
    //         .toEqual(secondCallsResult.data)

    //     expect(firstCallsResult.options)
    //         .toEqual(secondCallsResult.options)

    //     expect(firstCallsResult.lastRequestDate)
    //         .toEqual(secondCallsResult.lastRequestDate)

    // })

    // it("performs two subsequent requests - replacing outdated data in buffer", async () => {
    //     const requestService: RequestService =
    //         RequestService.getInstance([fSBasedBufferService])

    //     const firstCallsResult: IBufferEntry =
    //         await requestService.get(optionsISS, bufferIntervalInMilliSeconds)

    //     expect(firstCallsResult.data)
    //         .toEqual({ someContent: "hello world" })

    //     expect(firstCallsResult.options)
    //         .toEqual(optionsISS)

    //     const aShortMomentInTime: number = 0.0001

    //     const secondCallsResult: IBufferEntry =
    //         await requestService.get(optionsISS, aShortMomentInTime)

    //     expect(fSBasedBufferService.deleteBufferEntry)
    //         .toHaveBeenCalledTimes(1)

    //     expect(firstCallsResult === secondCallsResult)
    //         .toBeFalsy()

    // })

})
