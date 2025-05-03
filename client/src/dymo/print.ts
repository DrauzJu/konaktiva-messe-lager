import getLabelXML from "./labelXML";
import anyAscii from 'any-ascii';

export default async function printLabel(barcode: number, companyName: string) {
  await new Promise((resolve) => {
    dymo.label.framework.init(resolve);
  });

  const currentYear = new Date().getFullYear().toString();
  const labelXML = getLabelXML(
    barcode,
    // Remove unicode characters and escape & sign
    anyAscii(companyName).replaceAll("&", "&amp;").substring(0, 15),
    currentYear
  );
  const label = dymo.label.framework.openLabelXml(labelXML);

  const printers = dymo.label.framework.getPrinters();
  if (printers.length === 0) {
    throw new Error("No printers!");
  }

  label.print(printers[0].name);
}
