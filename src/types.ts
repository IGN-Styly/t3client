import {z} from 'zod'
import {hexToBytes,bytesToHex} from '@noble/hashes/utils'
import {ed25519} from '@noble/curves/ed25519'
import {v4} from 'uuid'
type Hex = string;
type HexBytes = Uint8Array;

class WalletInstance {
    BuiltWallet!:BuiltWallet; // 68 characters
    PrivateKey!:Hex;
    PublicKey!:Hex;
    Built:boolean;

    constructor(){
        this.Built = false;
    }

    create(){
        this.PrivateKey = bytesToHex(ed25519.utils.randomPrivateKey());
        this.PublicKey = bytesToHex(ed25519.getPublicKey(this.PrivateKey));
        this.BuiltWallet = "zmrx" + this.PublicKey;
        this.Built = true;
    }

    init(PrivateKey:Hex|HexBytes){
        if (typeof PrivateKey === "string"){
            this.PrivateKey = PrivateKey;
        }
        if (typeof PrivateKey === "object"){
            this.PrivateKey = bytesToHex(PrivateKey);
        }
        this.PublicKey = bytesToHex(ed25519.getPublicKey(this.PrivateKey));
        this.BuiltWallet = "zmrx" + this.PublicKey;
        this.Built = true;
    }

}




type TokenType = z.infer<typeof TokenSchema>;
type BuiltWallet = z.infer<typeof BuiltWalletSchema>;

const BuiltWalletSchema = z.string().length(68).startsWith("zmr"); // Zero Monero Wallet
const RedirectWalletSchema = z.string().length(68).startsWith("zrr"); // Zero Monero Redirect Wallet
const TokenSchema = z.string().uuid();


function ClientRedirect(){
   return "zrrx" + v4().replace(/\-/g, "")+v4().replace(/\-/g, "");
}
export {WalletInstance,RedirectWalletSchema,TokenType,BuiltWalletSchema,BuiltWallet,ClientRedirect}