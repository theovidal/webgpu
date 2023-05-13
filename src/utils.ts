export default {
    degreesToRadians: function (degrees: number) {
        return degrees * Math.PI / 180
    },
    radiansToDegrees: function (radians: number) {
        return radians * 180 / Math.PI
    },
    colors: {
        red: [1.0, 0.0, 0.0, 1.0],
        blue: [0.0, 1.0, 0.0, 1.0],
        green: [0.0, 0.0, 1.0, 1.0],
        black: [0.0, 0.0, 0.0, 1.0],
        white: [1.0, 1.0, 1.0, 1.0],
    }
}
