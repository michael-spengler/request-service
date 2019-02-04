import { IBufferEntry, IBufferService } from "./types";
export declare class FSBasedBufferService implements IBufferService {
    private readonly bufferFilePath;
    constructor(bufferFilePath?: string);
    addToBuffer(bufferEntry: IBufferEntry): Promise<void>;
    getBufferedResult(options: any): IBufferEntry | undefined;
    deleteBuffer(): void;
    deleteBufferEntry(options: any): Promise<void>;
    getCompleteBufferContent(): Promise<IBufferEntry[]>;
    read(options?: any): IBufferEntry[];
}
