export default class BrainlyError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "BrainlyError";
    }
}