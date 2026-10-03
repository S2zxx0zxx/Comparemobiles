import { describe, expect, it } from "vitest";
import { prepareDeviceImport } from "@/data/importer/prepare-device";
import { AppleOfficialImporter, AsusRogOfficialImporter, GoogleOfficialImporter, HmdNokiaOfficialImporter, HonorOfficialImporter, LavaOfficialImporter, MotorolaOfficialImporter, NothingOfficialImporter, OppoRealmeOfficialImporter, TranssionOfficialImporter, XiaomiFamilyOfficialImporter } from "@/data/importer/manufacturers";

const context={checkedAt:"2026-10-01",region:"IN" as const};

describe("major manufacturer coverage",()=>{
  it("maps Apple official records without inventing unpublished memory values",()=>{
    const adapter=new AppleOfficialImporter(async()=>[]);
    const value=adapter.transform({sourceKey:"apple:test",productName:"iPhone Test",region:"IN",status:"available",sourceUrl:"https://www.apple.com/in/iphone/",display:{},variants:[{storageGb:256}]},context);
    const prepared=prepareDeviceImport(value);
    expect(prepared.device.brand).toBe("Apple");
    expect(prepared.variants[0]?.ramGb).toBeUndefined();
  });

  it("maps Google official records",()=>{
    const adapter=new GoogleOfficialImporter(async()=>[]);
    const value=adapter.transform({recordId:"google:test",name:"Pixel Test",region:"IN",status:"available",url:"https://store.google.com/in/",screen:{}},context);
    expect(prepareDeviceImport(value).device.brand).toBe("Google");
  });

  it("preserves Xiaomi sub-brand identity",()=>{
    const adapter=new XiaomiFamilyOfficialImporter(async()=>[]);
    const value=adapter.transform({sourceKey:"poco:test",brand:"POCO",productName:"POCO Test",region:"IN",status:"available",sourceUrl:"https://www.mi.com/in/",display:{}},context);
    expect(prepareDeviceImport(value).device.brand).toBe("POCO");
  });

  it("preserves OPPO and realme identity",()=>{
    const adapter=new OppoRealmeOfficialImporter(async()=>[]);
    const value=adapter.transform({id:"realme:test",brand:"realme",title:"realme Test",region:"IN",lifecycle:"available",canonicalUrl:"https://www.realme.com/in/",display:{}},context);
    expect(prepareDeviceImport(value).device.brand).toBe("realme");
  });

  it("maps Motorola and Nothing records",()=>{
    const moto=new MotorolaOfficialImporter(async()=>[]).transform({sourceKey:"moto:test",name:"moto Test",region:"IN",status:"available",sourceUrl:"https://www.motorola.in/",screen:{}},context);
    const nothing=new NothingOfficialImporter(async()=>[]).transform({sourceKey:"nothing:test",name:"Phone Test",region:"IN",status:"available",sourceUrl:"https://in.nothing.tech/",display:{}},context);
    expect(prepareDeviceImport(moto).device.brand).toBe("Motorola");
    expect(prepareDeviceImport(nothing).device.brand).toBe("Nothing");
  });

  it("covers important long-tail India manufacturer families without cross-brand leakage",()=>{
    const records = [
      new HonorOfficialImporter(async()=>[]).transform({sourceKey:"honor:test",brand:"HONOR",productName:"HONOR Test",region:"IN",status:"available",sourceUrl:"https://www.honor.com/in/"},context),
      new HmdNokiaOfficialImporter(async()=>[]).transform({sourceKey:"hmd:test",brand:"HMD",productName:"HMD Test",region:"IN",status:"available",sourceUrl:"https://www.hmd.com/en_in"},context),
      new AsusRogOfficialImporter(async()=>[]).transform({sourceKey:"rog:test",brand:"ROG",productName:"ROG Test",region:"IN",status:"available",sourceUrl:"https://rog.asus.com/in/phones/"},context),
      new TranssionOfficialImporter(async()=>[]).transform({sourceKey:"tecno:test",brand:"TECNO",productName:"TECNO Test",region:"IN",status:"available",sourceUrl:"https://www.tecno-mobile.com/in/"},context),
      new LavaOfficialImporter(async()=>[]).transform({sourceKey:"lava:test",brand:"Lava",productName:"Lava Test",region:"IN",status:"available",sourceUrl:"https://www.lavamobiles.com/"},context),
    ];
    expect(records.map((record)=>prepareDeviceImport(record).device.brand)).toEqual(["HONOR","HMD","ROG","TECNO","Lava"]);
    expect(()=>new HonorOfficialImporter(async()=>[]).transform({sourceKey:"bad:test",brand:"HMD",productName:"Wrong Family",region:"IN",status:"available",sourceUrl:"https://www.hmd.com/en_in"},context)).toThrow(/not supported/);
  });
});
