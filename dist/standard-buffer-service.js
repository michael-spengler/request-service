"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StandardBufferService {
    constructor() {
        this.bufferedResults = [];
    }
    async addToBuffer(bufferEntry) {
        this.bufferedResults.push(bufferEntry);
    }
    getBufferedResult(options) {
        const bufferedEntriesForOptions = this.bufferedResults.filter((bufferEntry) => bufferEntry.options === options);
        if (bufferedEntriesForOptions.length === 1) {
            return bufferedEntriesForOptions[0];
        }
        return undefined;
    }
    deleteBuffer() {
        this.bufferedResults = [];
    }
    async deleteBufferEntry(options) {
        const bufferEntry = this.bufferedResults.filter((entry) => entry.options.toString() === options.toString())[0];
        const indexOfEntryWhichShallBeDeleted = this.bufferedResults.indexOf(bufferEntry);
        if (indexOfEntryWhichShallBeDeleted === -1) {
            throw new Error("You tried to delete a buffer entry which was not in the buffer.");
        }
        else {
            this.bufferedResults.splice(indexOfEntryWhichShallBeDeleted, 1);
        }
    }
    getCompleteBufferContent() {
        return this.bufferedResults;
    }
}
exports.StandardBufferService = StandardBufferService;
