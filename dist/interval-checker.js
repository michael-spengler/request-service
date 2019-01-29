"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-unnecessary-class
class IntervalChecker {
    static isWithinInterval(milliseconds, referenceDate) {
        return (new Date(Number(referenceDate.getTime()) + milliseconds).getTime() > new Date().getTime()) ?
            true :
            false;
    }
}
exports.IntervalChecker = IntervalChecker;
