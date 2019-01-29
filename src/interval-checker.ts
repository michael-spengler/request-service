// tslint:disable-next-line:no-unnecessary-class
export class IntervalChecker {

    public static isWithinInterval(milliseconds: number, referenceDate: Date): boolean {

        return (new Date(Number(referenceDate.getTime()) + milliseconds).getTime() > new Date().getTime()) ?
            true :
            false
    }

}
