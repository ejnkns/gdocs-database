export type PageProps = {
  page: string
}

export class Page {
  name: string;
  path: string;
  docsUrl: string;

  constructor(name: string, path: string, docsUrl: string) {
    this.name = name;
    this.path = path;
    this.docsUrl = docsUrl;
  }
}


export type PlayerProps = {
    url: string;
}