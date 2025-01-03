const fs = require("fs");
const jsonFile=require("./main.json");
const { rgbaToCssString, effectProccesor } = require("./supporter");
const prssentty = jsonFile["nodes"]["1:180"]["document"];
const cssMp=require("./mappedType.json");

const treeMapXY=[];

function treeMapper(parent,tabIndex){
    let rootString = `${'\t'.repeat(tabIndex)}-${parent["name"]}\n`;
    let cssGenerator = `\n/* ${parent["name"]} */\n`;
    if(parent["backgroundColor"]){
        const bckclr=parent["backgroundColor"];
        cssGenerator+=rgbaToCssString(bckclr.r,bckclr.g, bckclr.b, bckclr.a);
    }
    if(parent["effects"]?.length>0){
        cssGenerator+=effectProccesor(parent["effects"]);
    }
    if(parent["cornerRadius"]){
        cssGenerator+=`${cssMp.borderRadius}:${parent["cornerRadius"]}px;\n`
    }
    if(parent["strokeAlign"]){
        if(parent["strokeAlign"]==="INSIDE"){
            cssGenerator+=`${cssMp.boxSizing}: border-box;\n`
        }
    }
    if(parent["blendMode"]){
        if(parent["blendMode"]==="NORMAL"){
            cssGenerator+=`${cssMp.mixBlend}: normal;\n`
        }
    }
    if(parent["opacity"]!==undefined && parent["opacity"]!==null){
        cssGenerator+=`${cssMp.opacity}:${parent["opacity"]};\n`
    }
    if(parent["absoluteBoundingBox"]?.["width"]){
        let sss = parent["absoluteBoundingBox"]["width"];
        cssGenerator+=`${cssMp.width}:${sss}px;\n`
    }
    if(parent["absoluteBoundingBox"]?.["height"]){
        let sss = parent["absoluteBoundingBox"]["height"];
        cssGenerator+=`${cssMp.height}:${sss}px;\n`
    }
    //this gives us the x and y of the parent
    if(parent["absoluteBoundingBox"]?.["x"]&&parent["absoluteBoundingBox"]?.["y"]&&treeMapXY.length===0){
        treeMapXY.push({
            x:parent["absoluteBoundingBox"]["x"],
            y:parent["absoluteBoundingBox"]["y"]
        })
    }
    if(parent["constraints"]){
        if(parent["constraints"]?.["horizontal"]==="LEFT"||parent["constraints"]?.["horizontal"]==="RIGHT"){
            if(parent["constraints"]?.["horizontal"]==="LEFT"){
                cssGenerator+=`${cssMp.left}:${parent["absoluteBoundingBox"]["x"] - treeMapXY[0].x}px;\n`
            }else{
                // let scale = parent["absoluteRenderBounds"]["width"]/parent["absoluteBoundingBox"]["width"];
                // cssGenerator+=`${cssMp.right}:${treeMapXY[0].x - parent["absoluteBoundingBox"]["x"]}px;\n`
            }
        }
    }
    parent["children"]?.forEach((lls,inx)=> {
        rootString+=treeMapper(lls, tabIndex+1).rootString;
        cssGenerator+=treeMapper(lls, tabIndex+1).cssGenerator;
    })
    return {rootString, cssGenerator};
}
const {rootString,cssGenerator} = treeMapper(prssentty,0,0);
fs.writeFile("output.txt",`${rootString}\n\n${cssGenerator}`,(err)=> {
    if(err){
        throw err;
    }else{
    }
})