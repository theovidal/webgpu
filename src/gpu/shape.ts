import { ShapeDefinition } from '../data/shapes/shape'
import { BUFFER_SIZE, Scene, ShapeLocation } from '../types.d.ts'
import createUniformBuffer from './uniform'

function newShape(scene: Scene, shape: ShapeDefinition, location: ShapeLocation) {
    const positionBuffer = scene.device.createBuffer({
        size: shape.position.byteLength * 4,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    })
    const colorBuffer = scene.device.createBuffer({
        size: shape.color.byteLength * 4,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    })
    const uvBuffer = scene.device.createBuffer({
        size: shape.uv.byteLength * 4,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    })

    new Float32Array(positionBuffer.getMappedRange()).set(shape.position)
    new Float32Array(colorBuffer.getMappedRange()).set(shape.color)
    new Float32Array(uvBuffer.getMappedRange()).set(shape.uv)
    positionBuffer.unmap()
    colorBuffer.unmap()
    uvBuffer.unmap()

    const { uniformBuffer, uniformBindGroup } = createUniformBuffer(scene, BUFFER_SIZE)

    return {
        positionBuffer,
        colorBuffer,
        uvBuffer,
        uniformBuffer,
        uniformBindGroup,

        location
    }
}

export default newShape
