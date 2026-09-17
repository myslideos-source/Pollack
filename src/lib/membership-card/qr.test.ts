import { describe, it, expect } from "vitest";
import { buildQrPayload } from "./qr";

describe("buildQrPayload", () => {
  it("namespaces the token and carries no other data", () => {
    const token = "11111111-1111-1111-1111-111111111111";
    expect(buildQrPayload(token)).toBe(`sppollack:card:${token}`);
  });

  it("never embeds the token's own value inside anything resembling an email or name field", () => {
    const payload = buildQrPayload("abcd-1234");
    expect(payload).not.toMatch(/@/);
    expect(payload.split(":")).toEqual(["sppollack", "card", "abcd-1234"]);
  });
});
