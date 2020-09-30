import Brainly from "./src/Base";

const Brainly1 = async (query: string, count = 5, lang?: string) => {
    return await Brainly(query, count, lang);
}

export = Brainly1;