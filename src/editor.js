class editor{
    static curProcessor = false
    static storageSelected = false
    static storageType = false
    static editmode = false
    static selectProcessor = (id) =>{
        if (this.curProcessor){
            this.unhighlightProcessor(this.curProcessor)
        }
        if (id == this.curProcessor || !id){
            this.curProcessor = false
            document.getElementById("code").innerHTML = ""
            document.getElementById("debug").innerHTML = ""
            return
        }
        this.curProcessor = id
        this.highlightProcessor(id)
        this.updateBtns()
        this.displayCode()
        this.displayCurInstruction(core.getProcessor(this.curProcessor).curInstrucion)
        this.displayVariables()
    }
    static selectStorage = (id,type) =>{
        document.getElementById("debug").innerHTML = ""
        if (this.storageSelected !== false){
            core["getMem"+this.storageType](this.storageSelected).btn.classList.remove("selected2")
        }
        if (id == this.storageSelected && type == this.storageType || !id){
            this.storageType = false
            this.storageSelected = false
            if (this.curProcessor){
                this.displayVariables()
            }
            return
        }
        core["getMem"+type](id).btn.classList.add("selected2")
        this.storageSelected = id
        this.storageType = type
        this.displayStorageVariables()
    }
    static highlightProcessor = (id)=>{
        core.getProcessor(id).btn.classList.add("selected")
    }
    static unhighlightProcessor = (id)=>{
        core.getProcessor(id).btn.classList.remove("selected")
    }
    static updateBtns = () =>{
        if (this.curProcessor === false) return
        document.getElementById("play-pause").src = core.getProcessor(this.curProcessor).running?"resources/pause.svg":"resources/play.svg"
    }
    static toggleProcessor = () =>{
        if (this.curProcessor === false) return
        let state = !core.getProcessor(this.curProcessor).running
        core.getProcessor(this.curProcessor).running = state
        this.updateBtns()
    }
    static createLine = (index,text) =>{
        let container = document.createElement("div")
        container.className = "code-line"
        let linenumber = document.createElement("label")
        linenumber.className = "line-number"
        linenumber.innerText = index
        let instruction = document.createElement("label")
        instruction.className = "instruction"
        instruction.innerText = text
        container.appendChild(linenumber)
        container.appendChild(instruction)
        document.getElementById("code").appendChild(container)
    }
    static displayCode = () =>{
        document.getElementById("code").innerHTML = ""
        for (let i = 0; i <  core.getProcessor(this.curProcessor).instructions.length; i++) {
            this.createLine(i,core.getProcessor(this.curProcessor).instructions[i])
        }
    }
    static stepInstruction = () =>{
        core.getProcessor(this.curProcessor).tick()
    }
    static createVariable = (name,value) =>{
        let variable = document.createElement("label")
        variable.className = "variable-text"
        variable.innerHTML = `${name}:${value}`
        document.getElementById("debug").appendChild(variable)
    }
    static displayVariables = () =>{
        if (this.storageSelected){
            return
        }
        document.getElementById("debug").innerHTML = ""
        for (const variable in core.getProcessor(this.curProcessor).variables) {
            this.createVariable(variable,core.getProcessor(this.curProcessor).variables[variable])
        }
    }
    static displayStorageVariables = () =>{
        document.getElementById("debug").innerHTML = ""
        core["getMem"+this.storageType](this.storageSelected).values.forEach((value,index)=>{
            this.createVariable(index,value)
        })
    }
    static toggleEditMode = () =>{
        if (this.curProcessor === false) return
        if (this.editmode) {
            let instructions = document.getElementById("code-input").value.split("\n")
            core.getProcessor(this.curProcessor).instructions = instructions.filter((val)=>{
                if (val == "") return false
                return true
            })
            core.getProcessor(this.curProcessor).curInstrucion = 0
            document.getElementById("code-input").remove()
            this.displayCode()
            this.editmode = false
            return
        }
        this.editmode = true
        document.getElementById("code").innerHTML = ""
        let input = document.createElement("textarea")
        input.className = "code-input"
        input.id = "code-input"
        core.getProcessor(this.curProcessor).instructions.forEach(instruction => {
            input.value += instruction+"\n"
        });
        input.addEventListener("keydown",(e)=>{
            if (e.key !== "Escape") return
            editor.toggleEditMode()
        })
        document.getElementById("code").appendChild(input)
        document.querySelector("#code-input").focus()
    }
    static displayCurInstruction = (index) =>{
        var instructions_dirty = document.getElementById("code").children
        var instructions_clean = []
        for (var i = 0; i < instructions_dirty.length; i++) {
            instructions_clean.push(instructions_dirty[i])
        }
        for (let i = 0; i < instructions_clean.length; i++) {
            if (i==index){
                instructions_clean[i].classList.add("highlighten")
                instructions_clean[i].scrollIntoViewIfNeeded()
            }else{
                instructions_clean[i].classList.remove("highlighten")
            }
        }
    }
}