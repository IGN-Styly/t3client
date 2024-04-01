import { bytesToHex } from '@noble/hashes/utils';
import { sha512 } from '@noble/hashes/sha512';
import { describe, expect } from "vitest";
import { BuiltWalletSchema,RedirectWalletSchema,ClientRedirect } from "@/types";
import { NetworkInstance, WalletInstance } from "@/index";
import { sign, verify } from "@/utils";

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
  });
  it("SIGN Test",async ()=>{
    const msg = "hi";
    const wallet = new WalletInstance;
    wallet.create()
    const sig = sign(wallet,msg)
    expect(verify(wallet.PublicKey,sig,msg))
  });
  it("POST Wallet",async()=>{
    const wallet = new WalletInstance();
    wallet.create()
    const network = new NetworkInstance();
    
    await network.init("http://localhost:3000",wallet)

    expect(network.WalletInstance.Published).toBe(true)
    expect(network.token).toBeTypeOf("string")
  })
  it("GET Bal",async()=>{
    const wallet = new WalletInstance();
    wallet.create()
    const network = new NetworkInstance();
    
    await network.init("http://localhost:3000",wallet)
    await network.getBalance(network.token)
    expect(network.WalletInstance.Published).toBe(true)
    expect(network.balance).toBeTypeOf("bigint")
    expect(network.balance).toBe(BigInt(0))
  })
  
});
