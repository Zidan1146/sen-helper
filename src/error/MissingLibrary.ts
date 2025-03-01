export class MissingLibrary extends Error {
    constructor(message:string) {
        super(message);
        this.name = "MissingLibrary";
    }
}