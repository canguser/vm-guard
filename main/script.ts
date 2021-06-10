import { Worker } from './worker';

export class Script {

  private resolve: (r: any) => void;
  private reject: (r: any) => void;
  private promise: Promise<any>;
  private timeoutId: NodeJS.Timer;
  private worker: Worker;

  constructor(public content: string, public timeout: number = 1000, public path?: string) {
  }

  public bindWorker(worker: Worker) {
    this.worker = worker;
  }

  public getScriptResult(): Promise<any> {
    if (!this.promise) {
      this.promise = new Promise<any>((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
    return this.promise;
  }

  public assertStart(): Promise<any> {
    this.timeoutId = setTimeout(() => {
      const error = new Error(`Script execute timeout: '${this.content.replace(/[\n\s\t\r]+/g, ' ').trim()}'`);
      if (this.worker) {
        this.worker.deferError(error);
      } else {
        this.error(error);
      }
    }, this.timeout);
    return this.getScriptResult();
  }

  private assertStop() {
    clearTimeout(this.timeoutId);
  }

  public defer(r: any): void {
    if (this.resolve) {
      this.resolve(r);
      this.clearDefers();
    }
  }

  public error(r: any): void {
    if (this.reject) {
      this.reject(r);
      this.clearDefers();
    }
  }

  private clearDefers() {
    this.assertStop();
    this.resolve = this.reject = null;
  }

}