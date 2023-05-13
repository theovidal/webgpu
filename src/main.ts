import { Cube } from './data/shapes/cube'
import { checkWebGPU } from './helper'
import { Camera } from './render/first_person'
import { Scene } from './render/scene'
import './style.css'
import utils from './utils'

let [result, hasGPU] = checkWebGPU()
document.getElementById('webgpu-check')!.innerHTML = result
if (!hasGPU) {
    document.getElementById('controls')!.remove()
    document.getElementById('right_overlay')!.remove()
    throw new Error(result)
}
const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement
const x = document.getElementById('x') as HTMLInputElement
const y = document.getElementById('y') as HTMLInputElement
const z = document.getElementById('z') as HTMLInputElement
const roll = document.getElementById('roll') as HTMLInputElement
const pitch = document.getElementById('pitch') as HTMLInputElement
const yaw = document.getElementById('yaw') as HTMLInputElement
const scale = document.getElementById('scale') as HTMLInputElement
const fov = document.getElementById('fov') as HTMLInputElement

const toggle = document.getElementById('toggle') as HTMLInputElement

window.onload = async () => {
    const scene = new Scene(canvas)
    await scene.initialize()
    const camera = new Camera()
    camera.ratio = canvas.width / canvas.height
    camera.position.x = -3
    scene.camera = camera

    window.addEventListener('resize', () => {
        camera.ratio = canvas.width / canvas.height
        scene.draw()
    })

    toggle.addEventListener('change', () => {
        roll.disabled = toggle.checked
        pitch.disabled = toggle.checked
        yaw.disabled = toggle.checked
        scale.disabled = toggle.checked
    })

    const firstCube = new Cube()
    scene.addShape(firstCube)

    for (let i = 1; i < 10; i++) {
        const cube = new Cube()
        cube.position.z = i
        scene.addShape(cube)
    }

    scene.draw()

    function updateCube() {
        firstCube.position.x = parseFloat(x.value)
        firstCube.position.y = parseFloat(y.value)
        firstCube.position.z = parseFloat(z.value)
        firstCube.rotation.x = utils.degreesToRadians(parseFloat(roll.value))
        firstCube.rotation.y = utils.degreesToRadians(parseFloat(pitch.value))
        firstCube.rotation.z = utils.degreesToRadians(parseFloat(yaw.value))
        firstCube.scale.x = parseFloat(scale.value)
        firstCube.scale.y = parseFloat(scale.value)
        firstCube.scale.z = parseFloat(scale.value)
        scene.draw()
    }

    function updateCamera() {
        camera.fov = utils.degreesToRadians(parseFloat(fov.value))
        scene.draw()
    }

    x.addEventListener('input', updateCube)
    y.addEventListener('input', updateCube)
    z.addEventListener('input', updateCube)
    roll.addEventListener('input', updateCube)
    pitch.addEventListener('input', updateCube)
    yaw.addEventListener('input', updateCube)
    scale.addEventListener('input', updateCube)
    fov.addEventListener('input', updateCamera)

    function frame() {
        if (toggle.checked) {
            const now = Date.now() / 10 % 360
            firstCube.rotation.x = utils.degreesToRadians(now)
            firstCube.rotation.y = utils.degreesToRadians(now)
            firstCube.rotation.z = utils.degreesToRadians(now)
            firstCube.resize(Math.sin(Date.now()/1000) + 2)
            scene.draw()
        }
        requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
}
