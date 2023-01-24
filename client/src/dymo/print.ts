import getLabelXML from "./labelXML";

export default async function printLabel(barcode: number, companyName: string) {
  await new Promise((resolve) => {
    dymo.label.framework.init(resolve);
  });

  const labelXML = getLabelXML(barcode, companyName);
  const label = dymo.label.framework.openLabelXml(labelXML);

  const printers = dymo.label.framework.getPrinters();
  if (printers.length === 0) {
    throw new Error("No printers!");
  }

  label.print(printers[0].name);
}
