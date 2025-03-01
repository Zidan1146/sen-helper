export class MissingDirectory extends Error {
    constructor(message:string) {
        super(message);
        this.name = "MissingDirectory";
    }
}