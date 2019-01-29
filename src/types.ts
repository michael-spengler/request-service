export interface IBufferEntry {
    options: any
    lastRequestDate: Date | string
    data: any
}

export interface IBufferService {
    addToBuffer(bufferEntry: IBufferEntry): Promise<void>
    getBufferedResult(options: any): Promise<IBufferEntry | undefined> | IBufferEntry | undefined
    deleteBufferEntry(options: any): Promise<void>
    deleteBuffer(): Promise<void> | void
    getCompleteBufferContent(): Promise<IBufferEntry[]> | IBufferEntry[]
}
