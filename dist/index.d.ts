declare const Brainly1: (query: string, count?: number, lang?: string | undefined) => Promise<{
    success: boolean;
    length: number;
    message: string;
    data: {
        pertanyaan: string;
        jawaban: any[];
        questionMedia: any;
    }[];
}>;
export = Brainly1;
