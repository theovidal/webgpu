import { Scene } from '../types'

function createUniformBuffer(scene: Scene, size: number) : { uniformBuffer: GPUBuffer, uniformBindGroup: GPUBindGroup } {
    const uniformBuffer = scene.device.createBuffer({
        size: size,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })

    const uniformBindGroup = scene.device.createBindGroup({
        layout: scene.pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer,
                },
            }
        ]
    })

    return { uniformBuffer, uniformBindGroup }
}

export default createUniformBuffer
