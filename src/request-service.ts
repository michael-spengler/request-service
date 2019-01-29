const request: any = require("request-promise")

import { IntervalChecker } from "./interval-checker"
import { IBufferEntry, IBufferService } from "./types"

export class RequestService {

    private static instance: RequestService

    public static getInstance(bufferServices: IBufferService[]): RequestService {
        if (RequestService.instance === undefined) {
            RequestService.instance = new RequestService(bufferServices)
        }

        return RequestService.instance
    }

    // private constructor to ensure singleton concept
    private constructor(private bufferServices: IBufferService[]) {
    }

    public async get(options: any, bufferIntervalInMilliseconds: number): Promise<IBufferEntry> {
        const validBufferedResult: IBufferEntry | undefined =
            await this.getValidResultFromBuffer(options, bufferIntervalInMilliseconds)

        return (validBufferedResult === undefined) ?
            this.getNewRequestResult(options) :
            validBufferedResult
    }

    private async getValidResultFromBuffer(options: any, bufferIntervalInMilliseconds: number):
        Promise<IBufferEntry | undefined> {
        let validBufferedResult: IBufferEntry | undefined
        for (const bufferService of this.bufferServices) {
            const bufferedResult: IBufferEntry | undefined =
                await bufferService.getBufferedResult(options)

            if (!(bufferedResult === undefined)) {
                const lastRequestDate: Date = (typeof (bufferedResult.lastRequestDate) === "string") ?
                    new Date(bufferedResult.lastRequestDate) :
                    bufferedResult.lastRequestDate

                if (IntervalChecker.isWithinInterval(bufferIntervalInMilliseconds, lastRequestDate)) {
                    validBufferedResult = bufferedResult
                    validBufferedResult.lastRequestDate = lastRequestDate
                } else {
                    await bufferService.deleteBufferEntry(options)
                }
            }
        }

        return validBufferedResult
    }

    private async getNewRequestResult(options: any): Promise<IBufferEntry> {
        const currentRequestResult: any = await request.get(options)

        const result: IBufferEntry = {
            data: currentRequestResult,
            lastRequestDate: new Date(),
            options,
        }

        this.bufferServices.forEach(async (bufferService: IBufferService) => {
            await bufferService.addToBuffer(result)
        })

        return result
    }
}
