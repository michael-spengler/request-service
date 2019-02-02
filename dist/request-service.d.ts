import { IBufferEntry, IBufferService } from "./types";
export declare class RequestService {
    private readonly bufferService;
    private static instance;
    static getInstance(bufferService: IBufferService): RequestService;
    private constructor();
    get(options: any, bufferIntervalInMilliseconds: number): Promise<IBufferEntry>;
    private getValidResultFromBuffer;
    private getNewRequestResult;
}
