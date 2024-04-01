import { Hex, bytesToHex } from "@noble/curves/abstract/utils";
import { ed25519 } from "@noble/curves/ed25519";
import { BuiltWallet, HexBytes } from "./types";
import { sign } from "./utils";

class WalletInstance {
    BuiltWallet!:BuiltWallet; // 68 characters
    PrivateKey!:Hex;
    PublicKey!:Hex;
    Published:boolean
    Built:boolean;

    constructor(){
        this.Built = false;
        this.Published = false
    }

    async publish(url:string){
        if(this.Published===false){
            const response = await fetch(url + "/api/v0/createWallet",{method:"POST",headers: {"Content-Type": "application/json"},body:JSON.stringify({"id":this.BuiltWallet})});
            const data = await JSON.parse(await response.text());
            if(data.success===false){
            return false
            }
            this.Published=true}
        
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
    balance!: number;
    token!: string;
    WalletInstance!: WalletInstance;
    built: boolean;

    constructor(){
        this.built = false;
    }
    async init(url:string,WalletInstance:WalletInstance){
        this.url = url;
        this.WalletInstance = WalletInstance;
        if(WalletInstance.Published===false){
            await this.WalletInstance.publish(this.url)
        }
        await this.renewToken();
        this.built = true;
    }
    
    async renewToken(){
        const response = await fetch(this.url + "/api/v0/getToken",{method:"POST",headers: {"Content-Type": "application/json"},body:JSON.stringify({"id":this.WalletInstance.BuiltWallet})});
        const data = await JSON.parse(await response.text());
        this.token=data.data.token;
    }
    async getBalance(){
        const response = await fetch(this.url + "/api/v0/getWallet",{method:"POST",headers: {"Content-Type": "application/json"},body:JSON.stringify({id:this.WalletInstance.BuiltWallet,signature:sign(this.WalletInstance, this.token)})} );
        const data = await JSON.parse(await response.text());
        await this.renewToken();
        this.balance =Number(data.data.balance);
    }
    async send(trx:Transaction){
        const response = await fetch(this.url + "/api/v0/trx",{method:"POST",headers: {"Content-Type": "application/json"},body:JSON.stringify({id:this.WalletInstance.BuiltWallet,signature:sign(this.WalletInstance, this.token),amt:trx.amt.valueOf(),destination:trx.destination})} );
        var data = await response.json()
        console.log(data.error)
        await this.renewToken();
        await this.getBalance()
    }

}

class Transaction {
    origin:string
    destination:string
    amt:number

    constructor(origin:string,destination:string,amt:number){
        this.origin=origin,
        this.destination=destination
        this.amt = amt
    }
}

export {WalletInstance,NetworkInstance,Transaction}