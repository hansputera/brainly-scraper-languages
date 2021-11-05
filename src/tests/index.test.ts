import { Brainly } from "../lib/main";

it("should return information about question and answer", (done) => {
    const brain = new Brainly(false, "id");
    brain.search("id", "Pythagoras").then((results) => {
        console.log(results[0].question)
        expect(results).toBeDefined();
        done();
    }).catch(done);
});