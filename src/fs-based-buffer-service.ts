import * as fs from "fs"
import * as path from "path"

import { IBufferEntry, IBufferService } from "./types"

export class FSBasedBufferService implements IBufferService {

    public async addToBuffer(bufferEntry: IBufferEntry): Promise<void> {
        const bufferEntries: IBufferEntry[] = this.read()
        bufferEntries.push(bufferEntry)
        fs.writeFileSync(path.join(__dirname, "../buffer.json"), JSON.stringify(bufferEntries))
    }

    public getBufferedResult(options: any): IBufferEntry | undefined {

        let bufferedEntriesForOptions: IBufferEntry[] = []

        bufferedEntriesForOptions = this.read(options)

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

        const bufferedResults: IBufferEntry[] = this.read()

        const entryToBeDeleted: IBufferEntry = bufferedResults.filter((entry: IBufferEntry) =>
            JSON.stringify(entry.options) === JSON.stringify(options))[0]

        const indexOfEntryWhichShallBeDeleted: number = bufferedResults.indexOf(entryToBeDeleted)

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
    public read(options?: any): IBufferEntry[] {
        let fileBuffer: any
        let allBufferEntries: IBufferEntry[] = []

        try {
            fileBuffer = fs.readFileSync(path.join(__dirname, "../buffer.json"))

            allBufferEntries = JSON.parse(fileBuffer.toString())

        } catch (error) {
            // buffer file may not exist yet - no problem
        }

        if (options === undefined) {
            return allBufferEntries
        }

        return allBufferEntries.filter((entry: IBufferEntry) =>
            JSON.stringify(entry.options) === JSON.stringify(options),
        )

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
