import Brainly from "../../index";

it("should return information about question and answer", (done) => {
    const brain = new Brainly("id");
    brain.search("ru", "Pythagoras").then((results) => {
        console.log(results[0].question)
        expect(results).toBeDefined();
        done();
    }).catch(done);
});