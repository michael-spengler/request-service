import { IBufferEntry, IBufferService } from "./types"

export class StandardBufferService implements IBufferService {

    private bufferedResults: IBufferEntry[] = []

    public async addToBuffer(bufferEntry: IBufferEntry): Promise<void> {
        this.bufferedResults.push(bufferEntry)
    }

    public getBufferedResult(options: any): Promise<IBufferEntry | undefined> | IBufferEntry | undefined {

        const bufferedEntriesForOptions: IBufferEntry[] =
            this.bufferedResults.filter((bufferEntry: IBufferEntry) =>
                bufferEntry.options === options)

        if (bufferedEntriesForOptions.length === 1) {
            return bufferedEntriesForOptions[0]
        }

        return undefined
    }

    public deleteBuffer(): Promise<void> | void {
        this.bufferedResults = []
    }

    public async deleteBufferEntry(options: any): Promise<void> {

        const bufferEntry: IBufferEntry =
            this.bufferedResults.filter((entry: IBufferEntry) => entry.options.toString() === options.toString())[0]

        const indexOfEntryWhichShallBeDeleted: number =
            this.bufferedResults.indexOf(bufferEntry)

        if (indexOfEntryWhichShallBeDeleted === -1) {
            throw new Error("You tried to delete a buffer entry which was not in the buffer.")
        } else {
            this.bufferedResults.splice(indexOfEntryWhichShallBeDeleted, 1)
        }

    }

    public getCompleteBufferContent(): IBufferEntry[] {
        return this.bufferedResults
    }

}
