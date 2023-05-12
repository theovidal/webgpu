// import '@webgpu/types'

import { Triangle as TriangleShader } from './data/shaders'
import newShape from './gpu/shape'
import { Scene, Shape } from './types'

import Cube from './data/shapes/cube'
import draw from './gpu/draw'

const adapter = await navigator.gpu?.requestAdapter() as GPUAdapter
const device = await adapter?.requestDevice() as GPUDevice

const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement
const context = canvas?.getContext('webgpu')! as GPUCanvasContext
context.configure({
    device,
    format: navigator.gpu?.getPreferredCanvasFormat()
})

const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
        module: device.createShaderModule({
            label: '',
            code: TriangleShader().vertex
        }),
        entryPoint: 'main',
        buffers: [
            { // Position
                arrayStride: 4 * 4,
                attributes: [{
                        shaderLocation: 0,
                        format: 'float32x4',
                        offset: 0
                }]
            },
            { // Color
                arrayStride: 4 * 4,
                attributes: [{
                        shaderLocation: 1,
                        format: 'float32x4',
                        offset: 0
                }]
            },
            { // UV
                arrayStride: 4 * 2,
                attributes: [{
                        shaderLocation: 2,
                        format: 'float32x2',
                        offset: 0
                }]
            }
        ]
    },
    fragment: {
        module: device.createShaderModule({
            code: TriangleShader().fragment
        }),
        entryPoint: 'main',
        targets: [{
            format: navigator.gpu?.getPreferredCanvasFormat()
        }]
    },
    primitive: {
        topology: 'triangle-list',
        cullMode: 'back'
    },
    depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
    },
})

let scene: Scene = {
    device,
    canvas,
    context,
    pipeline
}

let shapes: Array<Shape> = []

function newCube() {
    shapes.push(newShape(scene, Cube, {
        x: 0,
        y: 0,
        z: 0,
        roll: 0,
        pitch: 0,
        yaw: 0,
        size: 1
    }))

    return shapes.length - 1
}

function setShapeCoods(index: number, x: number, y: number, z: number) {
    shapes[index].location.x = x
    shapes[index].location.y = y
    shapes[index].location.z = z
}

function setShapeRotation(index: number, roll: number, pitch: number, yaw: number) {
    shapes[index].location.roll = roll
    shapes[index].location.pitch = pitch
    shapes[index].location.yaw = yaw
} 

function setShapeScale(index: number, size: number) {
    shapes[index].location.size = size
}

function render() {
    draw(scene, shapes)
}

export { newCube, setShapeCoods, setShapeRotation, setShapeScale, render }
