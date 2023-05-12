export type Scene = {
    device: GPUDevice,
    canvas: HTMLCanvasElement,
    context: GPUCanvasContext,
    pipeline: GPURenderPipeline,
}

export type ShapeLocation = {
    x: number,
    y: number,
    z: number,
    roll: number,
    pitch: number,
    yaw: number,
    size: number
}

export type Shape = {
    positionBuffer: GPUBuffer,
    colorBuffer: GPUBuffer,
    uvBuffer: GPUBuffer,
    uniformBuffer: GPUBuffer,
    uniformBindGroup: GPUBindGroup,

    location: ShapeLocation
}

export const BUFFER_SIZE = 4 * (16 + 4 + 4 + 4)
