class fs{
    static loaded = false
    static load = () =>{
        if (!localStorage.getItem("settings") || !localStorage.getItem("devices")) {
            this.save()
            this.loaded = true
            return
        }
        let settings = JSON.parse(localStorage.getItem("settings"))
        let devices = JSON.parse(localStorage.getItem("devices"))
        devices.forEach(device => {
            switch (device.type){
                case "processor":
                    core.createProcessor("",device.id)
                    core.getProcessor(device.id).instructions = device.instructions
                    core.getProcessor(device.id).speed = device.speed
                    core.getProcessor(device.id).running = device.running
                    break
                case "display":
                    core.createDisplay(device.id,device.size)
                    break
                default:
                    console.warn("Trying to load unknown device ",device)
                    break
            }
        });
        editor.selectProcessor(settings.curProcessor)
        core.tick_speed = settings.tick_speed
        this.loaded = true
    }
    static save = () =>{
        if (!this.loaded){
            return
        }
        let settings = {
            "tick_speed":core.tick_speed,
            "curProcessor":editor.curProcessor
        }
        let devices = []
        core.processors.forEach(processor=>{
            devices.push({
                "type":"processor",
                "id":processor.id,
                "instructions":processor.instructions,
                "speed":processor.speed,
                "running":processor.running
            })
        })
        core.displays.forEach(display=>{
            devices.push({
                "type":"display",
                "id":display.id,
                "size":display.displaysize,
            })
        })
        localStorage.setItem("settings",JSON.stringify(settings))
        localStorage.setItem("devices",JSON.stringify(devices))
    }
}