export function createUniformBuffer(device: GPUDevice, pipeline: GPURenderPipeline, size: number) : { uniformBuffer: GPUBuffer, uniformBindGroup: GPUBindGroup } {
    const uniformBuffer = device.createBuffer({
        size: size,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })

    const uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
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
