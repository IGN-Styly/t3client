import { bytesToHex } from '@noble/hashes/utils';
import { WalletInstance } from '@/index';
import { Hex, HexBytes } from '@/types';
import { ed25519 } from '@noble/curves/ed25519';
import { sha512 } from "@noble/hashes/sha512";
function sign(WalletInstance:WalletInstance, message: string): string {
    return bytesToHex(ed25519.sign(sha512(message), WalletInstance.PrivateKey))
}
function verify(PubKey:Hex,Signature:Hex,msg:string):boolean{
    return ed25519.verify(Signature,sha512(msg),PubKey);
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export {sign,verify,sleep}