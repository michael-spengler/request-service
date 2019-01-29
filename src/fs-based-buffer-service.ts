import * as fs from "fs"
import * as path from "path"

import { IBufferEntry, IBufferService } from "./types"

export class FSBasedBufferService implements IBufferService {

    public async addToBuffer(bufferEntry: IBufferEntry): Promise<void> {
        const bufferEntries: IBufferEntry[] = await this.read()
        bufferEntries.push(bufferEntry)
        fs.writeFileSync(path.join(__dirname, "../buffer.json"), JSON.stringify(bufferEntries))
    }

    public async getBufferedResult(options: any): Promise<IBufferEntry | undefined> {

        const bufferedEntriesForOptions: IBufferEntry[] =
            await this.read(options)
        if (bufferedEntriesForOptions.length === 1) {
            return bufferedEntriesForOptions[0]
        }

        return undefined
    }

    // tslint:disable-next-line:prefer-function-over-method
    public deleteBuffer(): void {
        fs.writeFileSync(path.join(__dirname, "../buffer.json"), JSON.stringify([]))
    }

    public async deleteBufferEntry(options: any): Promise<void> {

        const bufferedResults: IBufferEntry[] = await this.read()

        const indexOfEntryWhichShallBeDeleted: number =
            bufferedResults.indexOf(bufferedResults.filter((entry: IBufferEntry) => entry.options === options)[0], 1)

        if (indexOfEntryWhichShallBeDeleted === -1) {
            throw new Error("You tried to delete a buffer entry which was not in the buffer.")
        } else {
            bufferedResults.splice(indexOfEntryWhichShallBeDeleted, 1)
        }

    }

    public async getCompleteBufferContent(): Promise<IBufferEntry[]> {
        return this.read()
    }

    // tslint:disable-next-line:prefer-function-over-method
    public async read(options?: any): Promise<IBufferEntry[]> {
        let fileBuffer: any
        let allBufferEntries: IBufferEntry[] = []
        let requestedBufferEntries: IBufferEntry[] = []

        try {
            fileBuffer = fs.readFileSync(path.join(__dirname, "../buffer.json"))

            allBufferEntries = JSON.parse(fileBuffer.toString())

        } catch (error) {
            // buffer file may not exist yet - no problem
        }
        requestedBufferEntries = (options === undefined) ?
            allBufferEntries :
            allBufferEntries.filter((entry: IBufferEntry) => entry.options.toString() === options.toString())

        return requestedBufferEntries
    }

    // public async saveBufferEntry(bufferEntry: IBufferEntry): Promise<void> {
    //     if (this.isBufferEntryValid(bufferEntry)) {
    //         const currentBufferEntries: IBufferEntry[] = await this.read()
    //         currentBufferEntries.push(bufferEntry)
    //         fs.writeFileSync(path.join(__dirname, "../buffer.json"), JSON.stringify(currentBufferEntries))
    //     }
    // }

    // // tslint:disable-next-line:prefer-function-over-method
    // private isBufferEntryValid(bufferEntry: IBufferEntry): boolean {
    //     return true
    // }
}
