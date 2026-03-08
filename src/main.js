class StyleKit{
    constructor(){
        this.utilities={};
        this.generated=new Set();
        this.cssEl=null;
    }

    scanClasses(el){
        const classes=new Set();
        if(el?.classList)el.classList.forEach(c=>{classes.add(c)});
        (el||document).querySelectorAll?.("*").forEach(child=>{
            child.classList.forEach(c=>{classes.add(c)})
        });
    }

    parseClass(cls){
        const parts=cls.split("-");
        return {
            prefix: parts[0],
            value:parts.slice(1).join("-")
        }
    }

    generateRule(cls){
        const {prefix,value}=this.parseClass(cls);
        const util=this.utilities[prefix];
        if(!util)return null;
        const rule=util(value);
        if(!rule)return null;

        return `.${cls}{${rule}`
    }

    buildCSS(classes){
        let css="";
        classes.forEach(c=>{
            if(this.generated.has(c))return;
            const rule=this.generateRule(cls);
            if(rule){
                css+= rule+"\n";
                this.generated.add(cls);
            }
        });

        return css;
    }

    applyCSS(css){
        if(!this.cssEl){
            this.cssEl=document.createElement("style");
            this.cssEl.id="StyleKit";

            document.head.appendChild(this.cssEl);
        }
        this.cssEl.innerHTML+=css;
    }

    run(){
        const classes=this.scanClasses();
        const css=this.buildCSS(classes);
        this.applyCSS(css);
    }
}