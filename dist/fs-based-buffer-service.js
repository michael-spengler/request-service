"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class FSBasedBufferService {
    async addToBuffer(bufferEntry) {
        const bufferEntries = this.read();
        bufferEntries.push(bufferEntry);
        fs.writeFileSync(path.join(__dirname, "../buffer.json"), JSON.stringify(bufferEntries));
    }
    getBufferedResult(options) {
        let bufferedEntriesForOptions = [];
        bufferedEntriesForOptions = this.read(options);
        if (bufferedEntriesForOptions.length === 1) {
            return bufferedEntriesForOptions[0];
        }
        return undefined;
    }
    // tslint:disable-next-line:prefer-function-over-method
    deleteBuffer() {
        fs.writeFileSync(path.join(__dirname, "../buffer.json"), JSON.stringify([]));
    }
    async deleteBufferEntry(options) {
        const bufferedResults = this.read();
        const entryToBeDeleted = bufferedResults.filter((entry) => JSON.stringify(entry.options) === JSON.stringify(options))[0];
        const indexOfEntryWhichShallBeDeleted = bufferedResults.indexOf(entryToBeDeleted);
        if (indexOfEntryWhichShallBeDeleted === -1) {
            throw new Error("You tried to delete a buffer entry which was not in the buffer.");
        }
        else {
            bufferedResults.splice(indexOfEntryWhichShallBeDeleted, 1);
        }
    }
    async getCompleteBufferContent() {
        return this.read();
    }
    // tslint:disable-next-line:prefer-function-over-method
    read(options) {
        let fileBuffer;
        let allBufferEntries = [];
        try {
            fileBuffer = fs.readFileSync(path.join(__dirname, "../buffer.json"));
            allBufferEntries = JSON.parse(fileBuffer.toString());
        }
        catch (error) {
            // buffer file may not exist yet - no problem
        }
        if (options === undefined) {
            return allBufferEntries;
        }
        return allBufferEntries.filter((entry) => JSON.stringify(entry.options) === JSON.stringify(options));
    }
}
exports.FSBasedBufferService = FSBasedBufferService;
