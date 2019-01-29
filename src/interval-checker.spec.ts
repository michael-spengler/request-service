import { IntervalChecker } from "./interval-checker"

const bufferIntervalInMilliSeconds: number = 60 * 60 * 1000 // hourly

describe("IntervalChecker", () => {

    it("Checks Interval Correctly", async () => {

        expect(IntervalChecker.isWithinInterval(bufferIntervalInMilliSeconds, new Date()))
            .toBe(true)

        const aVeryShortMomentInTime: number = 0.000000000001
        expect(IntervalChecker.isWithinInterval(aVeryShortMomentInTime, new Date()))
            .toBe(false)
    })

})
