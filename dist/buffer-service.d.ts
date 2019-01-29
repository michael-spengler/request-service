import { IBufferEntry } from "./types";
export interface IBufferService {
    addToBuffer(bufferEntry: IBufferEntry): Promise<void>;
    getBufferedResult(options: any): Promise<IBufferEntry | undefined>;
    deleteBufferEntry(options: any): Promise<void>;
}
export declare class StandardBufferService implements IBufferService {
    private bufferedResults;
    addToBuffer(bufferEntry: IBufferEntry): Promise<void>;
    getBufferedResult(options: any): Promise<IBufferEntry | undefined>;
    deleteBuffer(): void;
    deleteBufferEntry(options: any): Promise<void>;
    getCompleteBufferContent(): IBufferEntry[];
}
