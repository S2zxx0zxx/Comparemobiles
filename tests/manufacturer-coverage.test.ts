import { describe, expect, it } from "vitest";
import { prepareDeviceImport } from "@/data/importer/prepare-device";
import { AppleOfficialImporter, GoogleOfficialImporter, MotorolaOfficialImporter, NothingOfficialImporter, OppoRealmeOfficialImporter, XiaomiFamilyOfficialImporter } from "@/data/importer/manufacturers";

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
});
