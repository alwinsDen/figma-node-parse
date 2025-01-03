const cssMp=require("./mappedType.json");

const rgbaToCssString=(r, g, b, a)=> {
    let {blue,green,red,opacity}=rgbaProcess({r,g,b,a});
    return `${cssMp.background}: rgba(${red}, ${green}, ${blue}, ${opacity});\n`;
}

const effectProccesor=(kks)=>{
    let cmpx = `${cssMp.boxShadow}: `
    kks.forEach((mss,inx)=>{
        if(mss.type==="DROP_SHADOW"&&mss.visible===true){
            let {blue,green,red,opacity}=rgbaProcess(mss.color);
            let z=mss?.radius;
            let {x,y} = mss?.offset;
            cmpx+=`${x}px ${y}px ${z}px rgba(${red}, ${green}, ${blue}, ${opacity})`
            if(inx===kks.length-1){
                cmpx+=";\n";
            }else{
                cmpx+=", ";
            }
        }
    })
    return cmpx;
}

const rgbaProcess=({r,g,b,a})=>{
    const red = Math.round(r * 255);
    const green = Math.round(g * 255);
    const blue = Math.round(b * 255);
    const opacity = a;
    return {red,green,blue,opacity}
}

module.exports={
    rgbaToCssString,
    effectProccesor
}