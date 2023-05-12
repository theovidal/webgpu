import { vec3, mat4 } from 'gl-matrix'
import { render } from '../base'

let x = 5, y = 0, z = 0
let pitch = 0, yaw = 0

const keys = {
    ' ': () => toggle?.toggleAttribute('checked'),
    z: () => z += 0.1,
    q: () => y -= 0.1,
    s: () => z -= 0.1,
    d: () => y += 0.1,
    a: () => yaw += 0.05,
    e: () => yaw -= 0.05,
    w: () => pitch += 0.05,
    x: () => pitch -= 0.05,
    r: () => x += 0.1,
    f: () => x -= 0.1
}

document.addEventListener('keypress', (e) => {
    keys[e.key]?.()
    render()
})

function getViewMatrix(ratio: number) {
    document.getElementById('f3-x')!.innerText = x.toString()
    document.getElementById('f3-y')!.innerText = y.toString()
    document.getElementById('f3-z')!.innerText = z.toString()

    const projectionMatrix = mat4.create()
    mat4.perspective(projectionMatrix, 2 * Math.PI / 5, ratio, 1, 1000)
    
    const src = vec3.fromValues(x, y, z)
    const dest = vec3.create()
    vec3.add(dest, src, [-1, 0, 0])
    vec3.rotateZ(dest, dest, src, yaw)
    vec3.rotateY(dest, dest, src, pitch)

    const forward = vec3.create()
    vec3.subtract(forward, dest, src)
    vec3.normalize(forward, forward)

    const tempUp = vec3.fromValues(1, 0, 0)
    const right = vec3.create()
    vec3.cross(right, forward, tempUp)
    vec3.normalize(right, right)
    
    const up = vec3.create()
    vec3.cross(up, forward, right)
    vec3.normalize(up, up)
    
    const viewMatrix = mat4.create()
    mat4.lookAt(viewMatrix, src, dest, up)
    
    const result = mat4.create()
    mat4.multiply(result, projectionMatrix, viewMatrix)
    return result as Float32Array
}

export default getViewMatrix
