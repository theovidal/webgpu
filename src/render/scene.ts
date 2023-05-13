// import '@webgpu/types'

import TriangleShader from '../data/shaders/triangle'
import { Shape } from '../data/shapes/shape'
import { Camera } from './first_person'

export const BUFFER_SIZE = 4 * (16 + 4 + 4 + 4)

export class Scene {
    private canvas: HTMLCanvasElement
    private context: GPUCanvasContext
    device: GPUDevice
    pipeline: GPURenderPipeline
    bufferSize: number = BUFFER_SIZE
    private shapes: Array<Shape>
    camera : Camera = new Camera()

    constructor(canvas : HTMLCanvasElement) {
        document.addEventListener('camera', () => this.draw())
        this.canvas = canvas!
        this.context = canvas?.getContext('webgpu')! as GPUCanvasContext
        this.device = null as unknown as GPUDevice
        this.pipeline = null as unknown as GPURenderPipeline
        this.shapes = []
    }

    async initialize() {
        const adapter = await navigator.gpu?.requestAdapter() as GPUAdapter
        this.device = await adapter?.requestDevice() as GPUDevice
        this.context.configure({
            device: this.device,
            format: navigator.gpu?.getPreferredCanvasFormat()
        })

        this.pipeline = this.device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: this.device.createShaderModule({
                    label: '',
                    code: TriangleShader.vertex
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
                module: this.device.createShaderModule({
                    code: TriangleShader.fragment
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
    }

    addShape(shape: Shape) {
        shape.add(this)
        this.shapes.push(shape)
    }

    draw() {
        const depthTexture = this.device.createTexture({
            size: [this.canvas.width, this.canvas.height],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        })
    
        this.camera.updateViewMatrix()
    
        const commandEncoder = this.device.createCommandEncoder()
        const passEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
            
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
        passEncoder.setPipeline(this.pipeline)
        
        for (const shape of this.shapes) {
            shape.draw(this.camera, this.device, passEncoder, this.bufferSize)
        }
    
        passEncoder.end()
        this.device.queue.submit([commandEncoder.finish()])
    }
}
