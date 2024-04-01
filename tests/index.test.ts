import { bytesToHex } from '@noble/hashes/utils';
import { sha512 } from '@noble/hashes/sha512';
import { describe, expect } from "vitest";
import { BuiltWalletSchema,RedirectWalletSchema,ClientRedirect } from "@/types";
import { NetworkInstance, Transaction, WalletInstance } from "@/index";
import { sign, sleep, verify } from "@/utils";

describe("Wallet tests", (it) => {
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
    await network.getBalance()
    expect(network.WalletInstance.Published).toBe(true)
    expect(network.balance).toBeTypeOf("number")
    expect(network.balance).toBe(0)
  })
  it("TRX test",async()=>{
    const wallet0 = new WalletInstance();
    wallet0.init("pkey") //replace with your own private key for your own test wallet with 100 ZMR
   
    const wallet1= new WalletInstance();
    wallet1.create();
    const net0 = new NetworkInstance();
    const net1 = new NetworkInstance();
    await net0.init("http://localhost:3000",wallet0)
    await net1.init("http://localhost:3000",wallet1)
    const trx = new Transaction(wallet0.BuiltWallet,wallet1.BuiltWallet,1);
    await net0.send(trx)
    await net1.getBalance()
    expect(net0.balance).toBe(99)
    expect(net1.balance).toBe(1)

    await net1.send(new Transaction(wallet1.BuiltWallet,wallet0.BuiltWallet,1))
    await sleep(400)
    await net0.getBalance()
    expect(net0.balance).toBe(100)
    expect(net1.balance).toBe(0)
  })
});
