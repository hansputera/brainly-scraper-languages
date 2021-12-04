import { Brainly } from "../lib/main";

it("should return information about question and answer", (done) => {
    const brain = new Brainly('id');
    expect(brain.search('id', 'pythagoras')).resolves.toBe(
        expect.objectContaining({
            'id': expect.any('number'),
            'content': expect.any('string'),
        }),
    );
    done();
});