import { newCube, setShapeScale, setShapeCoods, setShapeRotation, render } from './base'
import { checkWebGPU } from './helper'
import './style.css'

document.getElementById('webgpu-check')!.innerHTML = checkWebGPU()
const x = document.getElementById('x') as HTMLInputElement
const y = document.getElementById('y') as HTMLInputElement
const z = document.getElementById('z') as HTMLInputElement
const roll = document.getElementById('roll') as HTMLInputElement
const pitch = document.getElementById('pitch') as HTMLInputElement
const yaw = document.getElementById('yaw') as HTMLInputElement
const scale = document.getElementById('scale') as HTMLInputElement

const toggle = document.getElementById('toggle') as HTMLInputElement

toggle.addEventListener('change', () => {
    roll.disabled = toggle.checked
    pitch.disabled = toggle.checked
    yaw.disabled = toggle.checked
})

for (let i = 0; i < 10; i++) {
    newCube()
    setShapeCoods(i, i, 0, 0)
}

render()

function degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180
}

function update() {
    setShapeCoods(0, parseFloat(x.value), parseFloat(y.value), parseFloat(z.value))
    setShapeRotation(0, degreesToRadians(parseFloat(roll.value)), degreesToRadians(parseFloat(pitch.value)), degreesToRadians(parseFloat(yaw.value)))
    setShapeScale(0, parseFloat(scale.value))
    render()
}

x.addEventListener('input', update)
y.addEventListener('input', update)
z.addEventListener('input', update)
roll.addEventListener('input', update)
pitch.addEventListener('input', update)
yaw.addEventListener('input', update)
scale.addEventListener('input', update)

function frame() {
    if (toggle.checked) {
        const now = Date.now() / 10 % 360
        setShapeRotation(0, degreesToRadians(now), degreesToRadians(now), degreesToRadians(now))
        render()
    }
    requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
