import ReadData from './read_data'
import Triangle from './triangle'

type Shader = (params : Object) => {
    vertex : string
    fragment : string
}

export {
    ReadData, Triangle
}
