import {z} from 'zod'
import {hexToBytes,bytesToHex} from '@noble/hashes/utils'
import {ed25519} from '@noble/curves/ed25519'
import {v4} from 'uuid'
import { Hex } from '@noble/curves/abstract/utils';
type HexBytes = Uint8Array;




type TokenType = z.infer<typeof TokenSchema>;
type BuiltWallet = z.infer<typeof BuiltWalletSchema>;

const BuiltWalletSchema = z.string().length(68).startsWith("zmr"); // Zero Monero Wallet
const RedirectWalletSchema = z.string().length(68).startsWith("zrr"); // Zero Monero Redirect Wallet
const TokenSchema = z.string().uuid();


function ClientRedirect(){
   return "zrrx" + v4().replace(/\-/g, "")+v4().replace(/\-/g, "");
}
export { RedirectWalletSchema, TokenType, BuiltWalletSchema, BuiltWallet, ClientRedirect, HexBytes, Hex };