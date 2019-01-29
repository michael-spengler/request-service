import { IBufferEntry, IBufferService } from "./types";
export declare class StandardBufferService implements IBufferService {
    private bufferedResults;
    addToBuffer(bufferEntry: IBufferEntry): Promise<void>;
    getBufferedResult(options: any): Promise<IBufferEntry | undefined> | IBufferEntry | undefined;
    deleteBuffer(): Promise<void> | void;
    deleteBufferEntry(options: any): Promise<void>;
    getCompleteBufferContent(): IBufferEntry[];
}
