import { ReadData } from "../data/shaders"

async function readFromGPU() {
    const module = device.createShaderModule({
        code: ReadData().vertex
    })

    const layout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {
                    type: 'storage'
                }
            }
        ]
    })

    const pipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [layout]
        }),
        compute: {
            module,
            entryPoint: "main"
        }
    })

    const output = device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    })
    const stagingBuffer = device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    })
    const bindGroup = device.createBindGroup({
        layout,
        entries: [{
            binding: 0,
            resource: {
                buffer: output
            }
        }]
    })

    const commandEncoder = device.createCommandEncoder()
    const passEncoder = commandEncoder.beginComputePass()
    passEncoder.setPipeline(pipeline)
    passEncoder.setBindGroup(0, bindGroup)
    passEncoder.dispatchWorkgroups(Math.ceil(BUFFER_SIZE / 64))
    passEncoder.end()
    commandEncoder.copyBufferToBuffer(
        output,
        0, // Source offset
        stagingBuffer,
        0, // Destination offset
        BUFFER_SIZE
    )
    const commands = commandEncoder.finish()
    device.queue.submit([commands])

    await stagingBuffer.mapAsync(GPUMapMode.READ, 0, BUFFER_SIZE)
    const copyArrayBuffer = stagingBuffer.getMappedRange(0, BUFFER_SIZE)
    const data = copyArrayBuffer.slice()
    stagingBuffer.unmap()
    console.log(new Float32Array(data))
}