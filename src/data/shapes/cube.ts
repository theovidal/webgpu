import utils from '../../utils'
import { ShapeDefinition } from './shape'

const cube : ShapeDefinition = {
    position: new Float32Array([
        -0.5, -0.5, -0.5, 1.0,
        -0.5, 0.5, -0.5, 1.0,
        0.5, -0.5, -0.5, 1.0,
        0.5, 0.5, -0.5, 1.0,
        0.5, -0.5, -0.5, 1.0,
        -0.5, 0.5, -0.5, 1.0,

        -0.5, -0.5, 0.5, 1.0,
        0.5, -0.5, 0.5, 1.0,
        -0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        -0.5, 0.5, 0.5, 1.0,
        0.5, -0.5, 0.5, 1.0,

        -0.5, 0.5, -0.5, 1.0,
        -0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, -0.5, 1.0,
        0.5, 0.5, -0.5, 1.0,
        -0.5, 0.5, 0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,

        -0.5, -0.5, -0.5, 1.0,
        0.5, -0.5, -0.5, 1.0,
        -0.5, -0.5, 0.5, 1.0,
        -0.5, -0.5, 0.5, 1.0,
        0.5, -0.5, -0.5, 1.0,
        0.5, -0.5, 0.5, 1.0,

        -0.5, -0.5, -0.5, 1.0,
        -0.5, -0.5, 0.5, 1.0,
        -0.5, 0.5, -0.5, 1.0,
        -0.5, 0.5, -0.5, 1.0,
        -0.5, -0.5, 0.5, 1.0,
        -0.5, 0.5, 0.5, 1.0,

        0.5, -0.5, 0.5, 1.0,
        0.5, -0.5, -0.5, 1.0,
        0.5, 0.5, -0.5, 1.0,
        0.5, 0.5, -0.5, 1.0,
        0.5, 0.5, 0.5, 1.0,
        0.5, -0.5, 0.5, 1.0,
    ]),
    color: new Float32Array([
        // 1st face
        ...utils.colors.white,
        ...utils.colors.blue,
        ...utils.colors.red,
        ...utils.colors.green,
        ...utils.colors.red,
        ...utils.colors.blue,

        // 2nd face
        ...utils.colors.white,
        ...utils.colors.red,
        ...utils.colors.blue,
        ...utils.colors.green,
        ...utils.colors.blue,
        ...utils.colors.red,

        // 3rd face
        ...utils.colors.blue,
        ...utils.colors.blue,
        ...utils.colors.green,
        ...utils.colors.green,
        ...utils.colors.blue,
        ...utils.colors.green,

        // 4th face
        ...utils.colors.white,
        ...utils.colors.red,
        ...utils.colors.white,
        ...utils.colors.white,
        ...utils.colors.red,
        ...utils.colors.red,

        // 5th face
        ...utils.colors.white,
        ...utils.colors.white,
        ...utils.colors.blue,
        ...utils.colors.blue,
        ...utils.colors.white,
        ...utils.colors.blue,

        // 6th face
        ...utils.colors.red,
        ...utils.colors.red,
        ...utils.colors.green,
        ...utils.colors.green,
        ...utils.colors.green,
        ...utils.colors.red
    ]),
    uv: new Float32Array([
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,

        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,

        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
    
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,

        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,

        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0
    ])
}

export default cube
