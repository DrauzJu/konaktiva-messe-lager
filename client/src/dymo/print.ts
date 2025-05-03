import getLabelXML from "./labelXML";

export default async function printLabel(barcode: number, companyName: string) {
  await new Promise((resolve) => {
    dymo.label.framework.init(resolve);
  });

  const currentYear = new Date().getFullYear().toString();
  const labelXML = getLabelXML(barcode, companyName, currentYear);
  const label = dymo.label.framework.openLabelXml(labelXML);

  const printers = dymo.label.framework.getPrinters();
  if (printers.length === 0) {
    throw new Error("No printers!");
  }

  label.print(printers[0].name);
}
