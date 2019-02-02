import { IBufferEntry, IBufferService } from "./types";
export declare class FSBasedBufferService implements IBufferService {
    addToBuffer(bufferEntry: IBufferEntry): Promise<void>;
    getBufferedResult(options: any): IBufferEntry | undefined;
    deleteBuffer(): void;
    deleteBufferEntry(options: any): Promise<void>;
    getCompleteBufferContent(): Promise<IBufferEntry[]>;
    read(options?: any): IBufferEntry[];
}
