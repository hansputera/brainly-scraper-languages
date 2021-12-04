import { Brainly } from "../lib/main";

it("should return information about question and answer", (done) => {
    const brain = new Brainly('id');
    expect(brain.findPassedCountries()).resolves.toBe(
        expect.any('array'),
    );
    done();
});