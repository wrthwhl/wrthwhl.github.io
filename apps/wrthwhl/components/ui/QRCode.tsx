import type { QRCodeData } from '../../lib/qrcode';

/**
 * QR Code component for print.
 * Path data is generated at build time.
 */
export function QRCode({ data }: { data: QRCodeData }) {
  return (
    <svg
      className="qr-code hidden print:block"
      viewBox={data.viewBox}
      width={data.size}
      height={data.size}
      role="img"
      aria-label="QR code linking to online resume"
    >
      <path d={data.path} stroke="currentColor" />
    </svg>
  );
}
