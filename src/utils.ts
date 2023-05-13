import { vec3 } from 'gl-matrix'
import { Camera } from './render/first_person'

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
    }
}
