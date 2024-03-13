import { describe, expect } from "vitest";
import { WalletInstance, BuiltWalletSchema,RedirectWalletSchema,ClientRedirect } from "@/types";

describe("Wallet Generation", (it) => {
  // Normal Wallets
  it("zmr Schema", () => {
    const wallet = new WalletInstance();
    wallet.create();

    expect(BuiltWalletSchema.parse(wallet.BuiltWallet)).toBe(
      wallet.BuiltWallet
    );
  });
  // Redirect Wallets
  it("zrr Schema", ()=>{
    const RedirectWallet = ClientRedirect();
    expect(RedirectWalletSchema.parse(RedirectWallet)).toBe(RedirectWallet);
  })
});
