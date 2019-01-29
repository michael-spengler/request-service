"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interval_checker_1 = require("./interval-checker");
const bufferIntervalInMilliSeconds = 60 * 60 * 1000; // hourly
describe("IntervalChecker", () => {
    it("Checks Interval Correctly", async () => {
        expect(interval_checker_1.IntervalChecker.isWithinInterval(bufferIntervalInMilliSeconds, new Date()))
            .toBe(true);
        const aVeryShortMomentInTime = 0.000000000001;
        expect(interval_checker_1.IntervalChecker.isWithinInterval(aVeryShortMomentInTime, new Date()))
            .toBe(false);
    });
});
