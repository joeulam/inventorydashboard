export default async function barcodeAPI(barcode: string) {
  const res = await fetch(`/api/barcodeAPI?upc=${barcode}`);
  if (!res.ok) throw new Error("Barcode lookup failed");
  return res.json();
}
