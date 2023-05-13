import { createUniformBuffer } from "../../gpu/uniform"
import { Camera } from "../../render/first_person"
import { Scene } from "../../render/scene"

export type ShapeDefinition = {
    position : Float32Array,
    color : Float32Array,
    uv : Float32Array,
}

export class Shape {
    definition: ShapeDefinition = {
        position: new Float32Array([]),
        color: new Float32Array([]),
        uv: new Float32Array([])
    }
    private positionBuffer: GPUBuffer | null = null
    private colorBuffer: GPUBuffer | null = null
    private uvBuffer: GPUBuffer | null = null
    private uniformBuffer: GPUBuffer | null = null
    private uniformBindGroup: GPUBindGroup | null = null

    position: {
        x: number,
        y: number,
        z: number
    } = { x: 0, y: 0, z: 0 }
    rotation: {
        x: number,
        y: number,
        z: number
    } = { x: 0, y: 0, z: 0 }
    scale: {
        x: number,
        y: number,
        z: number
    } = { x: 1, y: 1, z: 1 }

    constructor() {}

    add(scene: Scene) {
        this.positionBuffer = scene.device.createBuffer({
            size: this.definition.position.byteLength * 4,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        })
        this.colorBuffer = scene.device.createBuffer({
            size: this.definition.color.byteLength * 4,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        })
        this.uvBuffer = scene.device.createBuffer({
            size: this.definition.uv.byteLength * 4,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        })
    
        new Float32Array(this.positionBuffer.getMappedRange()).set(this.definition.position)
        new Float32Array(this.colorBuffer.getMappedRange()).set(this.definition.color)
        new Float32Array(this.uvBuffer.getMappedRange()).set(this.definition.uv)
        this.positionBuffer.unmap()
        this.colorBuffer.unmap()
        this.uvBuffer.unmap()

        const { uniformBuffer, uniformBindGroup } = createUniformBuffer(scene.device, scene.pipeline, scene.bufferSize)
    
        this.uniformBuffer = uniformBuffer
        this.uniformBindGroup = uniformBindGroup 
    }

    resize(size : number) {
        this.scale.x = size
        this.scale.y = size
        this.scale.z = size
    }

    draw(camera : Camera, device: GPUDevice, passEncoder: GPURenderPassEncoder, bufferSize: number) {
        if (this.uniformBuffer == null) throw new Error("Shape was not added to any scene")
        const uniformValues = new Float32Array(bufferSize / 4)
        uniformValues.set(camera.matrix)
        uniformValues.set([this.position.x, this.position.y, this.position.z, 1.0], 16)
        uniformValues.set([this.rotation.x, this.rotation.y, this.rotation.z ], 20)
        uniformValues.set([this.scale.x, this.scale.y, this.scale.z], 24)
        
        device.queue.writeBuffer(
            this.uniformBuffer!,
            0,
            uniformValues
        )

        passEncoder.setBindGroup(0, this.uniformBindGroup!)
        passEncoder.setVertexBuffer(0, this.positionBuffer!)
        passEncoder.setVertexBuffer(1, this.colorBuffer!)
        passEncoder.setVertexBuffer(2, this.uvBuffer!)
        
        passEncoder.draw(this.positionBuffer!.size / 16, 1, 0, 0)
    }
}
