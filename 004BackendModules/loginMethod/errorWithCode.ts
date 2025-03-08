// codeプロパティを追加したErrorクラスを作成

export class ErrorWithCode extends Error {
    code: string;
  
    constructor(code: string, message?: string) {
      super(message);
      this.code = code;
      this.name = this.constructor.name;
      // プロトタイプチェーンを正しくセットするために必要です
      Object.setPrototypeOf(this, ErrorWithCode.prototype);
    }
  }