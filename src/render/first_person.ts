import { vec3, mat4, quat } from 'gl-matrix'
import utils from '../utils'

type Keys = { [key: string]: (camera: Camera) => void }

const UP = vec3.fromValues(0, 1, 0)

// Multiply a quaternion with a vector
function applyQuatVec(q: quat, v: vec3) {
    const [x, y, z] = v
    const [qx, qy, qz, qw] = q

    const w = -qx * x - qy * y - qz * z
    const x2 = qw * x + qy * z - qz * y
    const y2 = qw * y + qz * x - qx * z
    const z2 = qw * z + qx * y - qy * x

    return quat.fromValues(x2, y2, z2, w)
}

// Multiply a quaternion with a quaternion
/*function applyQuatQuat(q1: quat, q2: quat) {
    const [x1, y1, z1, w1] = q1
    const [x2, y2, z2, w2] = q2

    const w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
    const x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2
    const y = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2
    const z = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2

    return quat.fromValues(x, y, z, w)
}*/

export const keymap: Keys = {
    '+': (camera: Camera) => camera.position.y += 0.1,
    '-': (camera: Camera) => camera.position.y -= 0.1,
    z: (camera: Camera) => camera.forward(),
    s: (camera: Camera) => camera.backward(),
    q: (camera: Camera) => camera.left(),
    d: (camera: Camera) => camera.right(),
    a: (camera: Camera) => camera.turnLeft(),
    e: (camera: Camera) => camera.turnRight(),
    r: (camera: Camera) => camera.turnUp(),
    f: (camera: Camera) => camera.turnDown()
}

export class Camera {
    position: {
        x: number
        y: number
        z: number
    } = { x: 0, y: 0, z: 0 }
    rotation: {
        horizontal: number,
        vertical: number
    } = { horizontal: 0, vertical: 0 }
    fov: number = 2 * Math.PI / 5
    ratio: number = 0
    near : number = 0.5
    far : number = 1000
    keys: Keys = {}

    matrix: Float32Array = new Float32Array()
    view: vec3 = vec3.fromValues(1, 0, 0)
    
    constructor() {
        document.addEventListener('keypress', (e : KeyboardEvent) => {
            e.preventDefault()
            if (this.keys[e.key] != undefined) {
                this.keys[e.key]?.(this)
                const event = new Event('camera')
                document.dispatchEvent(event)
            }  
        })

        this.keys = keymap
    }

    forward(step : number = 0.1) {
        const dir = vec3.fromValues(this.view[0], 0, this.view[2])
        vec3.normalize(dir, dir)
        vec3.scale(dir, dir, step)
        this.position.x += dir[0]
        this.position.z += dir[2]
    }

    backward(step : number = 0.1) {
        const dir = vec3.fromValues(this.view[0], 0, this.view[2])
        vec3.normalize(dir, dir)
        vec3.scale(dir, dir, step)
        this.position.x -= dir[0]
        this.position.z -= dir[2]
    }

    right(step : number = 0.1) {
         const right = vec3.cross(vec3.create(), [this.view[0], 0, this.view[2]], [0, 1, 0])
        vec3.normalize(right, right)
        vec3.scale(right, right, step)

        this.position.x += right[0]
        this.position.z += right[2]
    }

    left(step : number = 0.1) {
        const right = vec3.cross(vec3.create(), [this.view[0], 0, this.view[2]], [0, 1, 0])
        vec3.normalize(right, right)
        vec3.scale(right, right, step)

        this.position.x -= right[0]
        this.position.z -= right[2]
    }

    turnLeft(angle : number = 0.1) {
        this.rotation.horizontal = (this.rotation.horizontal + angle) % (2 * Math.PI)
        this.view = vec3.rotateY(this.view, this.view, [0, 0, 0], angle)
    }

    turnRight(angle : number = 0.1) {
        this.rotation.horizontal = (this.rotation.horizontal - angle) % (2 * Math.PI)
        this.view = vec3.rotateY(this.view, this.view, [0, 0, 0], -angle)
    }

    turnUp(angle : number = 0.1) {
        if (this.rotation.vertical + angle >= Math.PI / 2) return
        this.rotation.vertical += angle

        const axis = vec3.cross(vec3.create(), this.view, UP)
        vec3.normalize(axis, axis)
        const rotation = quat.setAxisAngle(quat.create(), axis, angle * 2)
        //const invRotation = quat.conjugate(quat.create(), rotation)

        const res = applyQuatVec(rotation, this.view)
        //const res = applyQuatQuat(rotation, applyQuatVec(invRotation, this.view))
        this.view = vec3.fromValues(res[0], res[1], res[2])
    }

    turnDown(angle : number = 0.1) {
        if (this.rotation.vertical - angle <= -Math.PI / 2) return
        this.rotation.vertical -= angle

        const axis = vec3.cross(vec3.create(), this.view, UP)
        vec3.normalize(axis, axis)
        const rotation = quat.setAxisAngle(quat.create(), axis, -angle * 2)
        //const invRotation = quat.invert(quat.create(), rotation)

        const res = applyQuatVec(rotation, this.view)
        //const res = applyQuatQuat(rotation, applyQuatVec(invRotation, this.view))
        this.view = vec3.fromValues(res[0], res[1], res[2])
    }

    // TODO: make calculation in shader
    updateViewMatrix() {
        document.getElementById('f3-x')!.innerText = this.position.x.toString()
        document.getElementById('f3-y')!.innerText = this.position.y.toString()
        document.getElementById('f3-z')!.innerText = this.position.z.toString()

        document.getElementById('f3-h')!.innerText = utils.radiansToDegrees(this.rotation.horizontal).toString()
        document.getElementById('f3-v')!.innerText = utils.radiansToDegrees(this.rotation.vertical).toString()

        const src = vec3.fromValues(this.position.x, this.position.y, this.position.z)
        const dest = vec3.add(vec3.create(), src, this.view)
    
        const axis = vec3.cross(vec3.create(), this.view, UP)
        vec3.normalize(axis, axis)

        const up = vec3.cross(vec3.create(), axis, this.view)
        vec3.normalize(up, up)
        
        const viewMatrix = mat4.lookAt(mat4.create(), src, dest, up)
        const projectionMatrix = mat4.perspective(mat4.create(), this.fov, this.ratio, this.near, this.far)

        this.matrix = mat4.multiply(mat4.create(), projectionMatrix, viewMatrix) as Float32Array
    }
}
