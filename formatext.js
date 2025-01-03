const fs = require("fs");
const jsonFile=require("./main.json");
const { rgbaToCssString, effectProccesor } = require("./supporter");
const prssentty = jsonFile["nodes"]["1:180"]["document"];

function treeMapper(parent,tabIndex){
    let rootString = `${'\t'.repeat(tabIndex)}-${parent["name"]}\n`;
    let cssGenerator = `\n*/${parent["name"]}*/\n`;
    if(parent["backgroundColor"]){
        const bckclr=parent["backgroundColor"];
        cssGenerator+=rgbaToCssString(bckclr.r,bckclr.g, bckclr.b, bckclr.a);
    }
    if(parent["effects"]?.length>0){
        cssGenerator+=effectProccesor(parent["effects"]);
    }
    parent["children"]?.forEach((lls,inx)=> {
        rootString+=treeMapper(lls, tabIndex+1).rootString;
        cssGenerator+=treeMapper(lls, tabIndex+1).cssGenerator;
    })
    return {rootString, cssGenerator};
}
const {rootString,cssGenerator} = treeMapper(prssentty,0);

fs.writeFile("output.txt",`${rootString}\n\n${cssGenerator}`,(err)=> {
    if(err){
        throw err;
    }else{
        console.log("file has been written.");
    }
})