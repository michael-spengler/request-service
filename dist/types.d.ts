export interface IBufferEntry {
    options: any;
    lastRequestDate: Date;
    data: any;
}
export interface IPersistencyService {
    delete(options?: any): Promise<void>;
    read(options?: any): Promise<IBufferEntry[]>;
    saveBufferEntry(bufferEntry: IBufferEntry): Promise<void>;
}
