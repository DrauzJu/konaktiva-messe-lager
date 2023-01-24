/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, object, any>;
  export default component;
}

declare global {
  interface Array<T> {
    findLast(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thisArg?: any
    ): T | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type DymoInitCb = (value: any) => void;

  type DymoPrinter = { name: string };
  type DymoPrinters = Array<DymoPrinter>;

  declare namespace dymo {
    declare namespace label {
      declare namespace framework {
        interface ILabel {
          print(printerName: string): void;
        }

        function init(cb: DymoInitCb): string;
        function openLabelXml(xmlString: string): ILabel;
        function getPrinters(): DymoPrinters;
      }
    }
  }
}
