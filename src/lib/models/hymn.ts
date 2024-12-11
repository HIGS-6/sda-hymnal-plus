import { Hymnal, Slide } from "./";

export default class Hymn {
  id: string;
  title: string;
  number: number;
  lyrics: Map<string, string>;
  hymnal: string;
  slides: Slide[];
  constructor(
    id: string,
    title: string,
    number: number,
    lyrics: Map<string, string>,
    hymnal: string,
  ) {
    this.id = id;
    this.title = title;
    this.number = number;
    this.lyrics = lyrics;
    this.hymnal = hymnal;
    this.slides = this.getSlides();
  }

  getSlides(): Slide[] {
    const slides = [new Slide(`${this.number} | ${this.title}`, "")];

    let refrainSlide: Slide | undefined = undefined;

    const stanzas: Slide[] = [];

    // All Stanzas are made Slides
    for (const [context, content] of this.lyrics.entries() as IterableIterator<
      [string, string]
    >) {
      if (Number.isNaN(parseInt(context))) {
        // Refrain
        refrainSlide = new Slide(content, context);
      } else {
        // Stanza
        stanzas.push(new Slide(content, context));
      }
    }

    // Insert Refrain in front of each stanza
    if (refrainSlide) {
      const magicNum = stanzas.length * 2;
      for (let i = 0; i < magicNum; i++) {
        if (i % 2 != 0) {
          stanzas.splice(i, 0, Object.assign({}, refrainSlide));
        }
      }
    }

    slides.push(...stanzas);

    return slides;
  }
}
