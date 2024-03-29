export class Slide {
  primaryString: string;
  secondaryString: string;
  constructor(primary: string, secondary: string) {
    this.primaryString = primary;
    this.secondaryString = secondary;
  }
}

export class Hymnal {
  id: string;
  name: string;
  language: string;
  constructor(id: string, name: string, language: string) {
    this.id = id;
    this.name = name;
    this.language = language;
  }
}

export class Hymn {
  title: string;
  number: number;
  lyrics: Map<string, string>;
  constructor(title: string, number: number, lyrics: Map<string, string>) {
    this.title = title;
    this.number = number;
    this.lyrics = lyrics;
  }

  getSlides(): Array<Slide> {
    const slides = [new Slide(`${this.number} | ${this.title}`, '')];

    let refrainSlide: Slide | undefined = undefined;

    const stanzas: Array<Slide> = [];

    // All Stanzas are made Slides
    for (const [context, content] of this.lyrics.entries() as IterableIterator<[string, string]>) {
      if (Number.isNaN(parseInt(context))) {
        // Refrain
        refrainSlide = new Slide(content, context);
      }
      else {
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

