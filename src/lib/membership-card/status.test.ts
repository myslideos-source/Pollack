import { describe, it, expect } from "vitest";
import { CARD_STATUSES, CARD_STATUS_LABEL, CARD_STATUS_BADGE_LABEL, CARD_STATUS_SHORT_LABEL, CARD_STATUS_COLOR, isQrValid } from "./status";

describe("membership card status maps", () => {
  it("cover every status with a label, badge label, short label and color", () => {
    for (const status of CARD_STATUSES) {
      expect(CARD_STATUS_LABEL[status]).toBeTruthy();
      expect(CARD_STATUS_BADGE_LABEL[status]).toBeTruthy();
      expect(CARD_STATUS_SHORT_LABEL[status]).toBeTruthy();
      expect(CARD_STATUS_COLOR[status].hex).toMatch(/^#/);
    }
  });
});

describe("isQrValid", () => {
  it("is valid only while the card is active", () => {
    expect(isQrValid("active")).toBe(true);
    expect(isQrValid("paused")).toBe(false);
    expect(isQrValid("locked")).toBe(false);
    expect(isQrValid("expired")).toBe(false);
  });
});
