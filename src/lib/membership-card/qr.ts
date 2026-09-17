/** Namespaced so a future scanner can tell a card token from any other QR content it might
 *  encounter — the token itself is the only thing that identifies the card, never a name,
 *  email, phone number or the internal member id. */
export function buildQrPayload(qrToken: string): string {
  return `sppollack:card:${qrToken}`;
}
