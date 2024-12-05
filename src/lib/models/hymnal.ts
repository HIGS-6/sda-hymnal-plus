export default class Hymnal {
    id: string;
    name: string;
    language: string;
    constructor(id: string, name: string, language: string) {
        this.id = id;
        this.name = name;
        this.language = language;
    }
}