declare module "pdf-parse" {
  interface TextResult {
    text: string;
  }

  interface LoadParameters {
    data: Buffer | Uint8Array | ArrayBuffer | number[] | string;
  }

  class PDFParse {
    constructor(options: LoadParameters);
    static setWorker(workerSrc?: string): string;
    getText(): Promise<TextResult>;
    destroy(): Promise<void>;
  }

  export { PDFParse };
}
