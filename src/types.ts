export interface IBufferEntry {
    options: any
    lastRequestDate: Date
    data: any
}

export interface IBufferService {
    addToBuffer(bufferEntry: IBufferEntry): Promise<void>
    getBufferedResult(options: any): Promise<IBufferEntry | undefined> | IBufferEntry | undefined
    deleteBufferEntry(options: any): Promise<void>
    deleteBuffer(): void
    getCompleteBufferContent(): Promise<IBufferEntry[]> | IBufferEntry[]
}
