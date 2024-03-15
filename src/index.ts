import { Hex, bytesToHex } from "@noble/curves/abstract/utils";
import { ed25519 } from "@noble/curves/ed25519";
import { BuiltWallet, HexBytes } from "./types";

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
class NetworkInstance {
    url!: string;
    balance!: BigInt;
    WalletInstance!: WalletInstance;
    built: boolean;

    constructor(){
        this.built = false;
    }
    init(url:string,WalletInstance:WalletInstance){
        this.url = url;
        this.WalletInstance = WalletInstance;
        this.built = true;
    }
    async getToken(){
        const response = await fetch(this.url + "/api/v0/getToken",{method:"POST",body:JSON.stringify({id:this.WalletInstance.BuiltWallet})});
        const data = await response.json();
        return data.token;
    
    }
    async getBalance(Token:string){

        const response = await fetch(this.url + "/api/v0/getWallet",{method:"POST",body:JSON.stringify({})} );
        const data = await response.json();
        this.balance = BigInt(data.balance);
    }
}
export {WalletInstance,NetworkInstance}