import { vec3 } from 'gl-matrix'
import { Camera } from './render/camera'

export default {
    degreesToRadians: function (degrees: number) {
        return degrees * Math.PI / 180
    },
    colors: {
        red: [1.0, 0.0, 0.0, 1.0],
        blue: [0.0, 1.0, 0.0, 1.0],
        green: [0.0, 0.0, 1.0, 1.0],
        black: [0.0, 0.0, 0.0, 1.0],
        white: [1.0, 1.0, 1.0, 1.0],
    },
    defaultCameraKeys: {
        '+': (camera: Camera) => camera.position.y += 0.1,
        '-': (camera: Camera) => camera.position.y -= 0.1,
        z: (camera: Camera) => camera.forward(),
        s: (camera: Camera) => camera.backward(),
        q: (camera: Camera) => camera.left(),
        d: (camera: Camera) => camera.right(),
        a: (camera: Camera) => camera.viewLeft(),
        e: (camera: Camera) => camera.viewRight(),
        r: (camera: Camera) => camera.viewUp(),
        f: (camera: Camera) => camera.viewDown()
    }
}
