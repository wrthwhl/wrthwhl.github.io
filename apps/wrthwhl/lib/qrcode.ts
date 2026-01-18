import QRCode from 'qrcode';

export interface QRCodeData {
  path: string;
  viewBox: string;
  size: number;
}

/**
 * Generates QR code data for the given URL.
 * Used at build time, rendered by QRCode component.
 */
export async function generateQRCode(url: string): Promise<QRCodeData> {
  const size = 64;
  const svg = await QRCode.toString(url, {
    type: 'svg',
    margin: 0,
    width: size,
  });

  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] || '0 0 29 29';
  const path = svg.match(/stroke="#000000" d="([^"]+)"/)?.[1] || '';

  return { path, viewBox, size };
}
