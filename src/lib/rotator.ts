import { Brainly } from "./main";

interface BlockedCountry {
    country: string;
    blockedAt: number;
}

export class Rotator {
    constructor(private client: Brainly) {}

    public countries: string[] = [];
    private blockedCountries: BlockedCountry[] = [];

    // ....
}