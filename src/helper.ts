function checkWebGPU() : [string, boolean] {
    let result = ''
    let hasGPU = true
    if (!navigator.gpu) {
        hasGPU = false
        result = `Your current browser does not support WebGPU! Make sure you are on a system 
        with WebGPU enabled. Currently, WebGPU is supported in  
        <a href="https://www.google.com/chrome">Chrome 113+</a>
        (On Linux and Android, enable the <a href="chrome://flags/#enable-unsafe-webgpu">chrome://flags/#enable-unsafe-webgpu</a> flag)
        and <a href="https://developer.apple.com/safari/resources/">Safari Technology Preview</a>. See the 
        <a href="https://github.com/gpuweb/gpuweb/wiki/Implementation-Status"> 
        Implementation Status</a> page for more details.   
        `
    } 

    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement
    if (canvas) {
        const div = document.getElementById('app') as HTMLDivElement
        if(div){
            canvas.width  = div.offsetWidth
            canvas.height = div.offsetHeight

            function windowResize() {
                canvas.width  = div.offsetWidth
                canvas.height = div.offsetHeight
            };
            window.addEventListener('resize', windowResize)
        }
    }

    return [result, hasGPU]
}

export { checkWebGPU }
