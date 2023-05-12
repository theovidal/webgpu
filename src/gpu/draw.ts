import getViewMatrix from "../render/camera";
import { BUFFER_SIZE, Scene, Shape } from '../types.d.ts';

function draw(scene: Scene, shapes : Array<Shape>) {
    const depthTexture = scene.device.createTexture({
        size: [scene.canvas.width, scene.canvas.height],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    })

    const matrix = getViewMatrix(scene.canvas.width / scene.canvas.height);

    const commandEncoder = scene.device.createCommandEncoder()
    const passEncoder = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: scene.context.getCurrentTexture().createView(),
        
            clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 1.0},
            loadOp: 'clear',
            storeOp: 'store'
        }],
        depthStencilAttachment: {
            view: depthTexture.createView(),
        
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        }
    })
    passEncoder.setPipeline(scene.pipeline)
    
    for (const shape of shapes) {
        const uniformValues = new Float32Array(BUFFER_SIZE / 4)
        uniformValues.set(matrix)
        uniformValues.set([shape.location.x, shape.location.y, shape.location.z, 1.0], 16)
        uniformValues.set([shape.location.roll, shape.location.pitch, shape.location.yaw], 20)
        uniformValues.set([shape.location.size], 23)
        
        scene.device.queue.writeBuffer(
            shape.uniformBuffer,
            0,
            uniformValues
        )
            
        passEncoder.setBindGroup(0, shape.uniformBindGroup)
        passEncoder.setVertexBuffer(0, shape.positionBuffer)
        passEncoder.setVertexBuffer(1, shape.colorBuffer)
        passEncoder.setVertexBuffer(2, shape.uvBuffer)
        
        passEncoder.draw(shape.positionBuffer.size / 16, 1, 0, 0)
    }

    passEncoder.end()
    scene.device.queue.submit([commandEncoder.finish()])
}

export default draw
