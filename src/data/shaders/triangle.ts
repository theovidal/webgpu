export default {
    vertex: /* wgsl */`
    struct Uniforms {
        viewProjection : mat4x4<f32>,
        translation : vec4<f32>,
        rotation : vec3<f32>,
        scale : vec3<f32>,
    }
    @binding(0) @group(0) var<uniform> uniforms : Uniforms;

    struct VertexOutput {
        @builtin(position) Position : vec4<f32>,
        @location(0) Color : vec4<f32>,
        @location(1) UV : vec2<f32>
    }

    @vertex
    fn main(@location(0) position : vec4<f32>, @location(1) color : vec4<f32>, @location(2) uv : vec2<f32>) -> VertexOutput {
        var output : VertexOutput;
        var scale: mat4x4<f32> = mat4x4<f32>(
            vec4<f32>(uniforms.scale.x, 0.0, 0.0, 0.0),
            vec4<f32>(0.0, uniforms.scale.y, 0.0, 0.0),
            vec4<f32>(0.0, 0.0, uniforms.scale.z, 0.0),
            vec4<f32>(0.0, 0.0, 0.0, 1.0)
        );
        var xRotation: mat4x4<f32> = mat4x4<f32>(
            vec4<f32>(1.0, 0.0, 0.0, 0.0),
            vec4<f32>(0.0, cos(uniforms.rotation.x), sin(uniforms.rotation.x), 0.0),
            vec4<f32>(0.0, -sin(uniforms.rotation.x), cos(uniforms.rotation.x), 0.0),
            vec4<f32>(0.0, 0.0, 0.0, 1.0)
        );
        var yRotation: mat4x4<f32> = mat4x4<f32>(
            vec4<f32>(cos(uniforms.rotation.y), 0.0, -sin(uniforms.rotation.y), 0.0),
            vec4<f32>(0.0, 1.0, 0.0, 0.0),
            vec4<f32>(sin(uniforms.rotation.y), 0.0, cos(uniforms.rotation.y), 0.0),
            vec4<f32>(0.0, 0.0, 0.0, 1.0)
        );
        var zRotation: mat4x4<f32> = mat4x4<f32>(
            vec4<f32>(cos(uniforms.rotation.z), sin(uniforms.rotation.z), 0.0, 0.0),
            vec4<f32>(-sin(uniforms.rotation.z), cos(uniforms.rotation.z), 0.0, 0.0),
            vec4<f32>(0.0, 0.0, 1.0, 0.0),
            vec4<f32>(0.0, 0.0, 0.0, 1.0)
        );
        output.Position = uniforms.viewProjection * (xRotation * yRotation * zRotation * (scale * position) + uniforms.translation);
        output.Color = color;
        output.UV = uv;
        return output;
    }
    `,
    fragment: /* wgsl */`
    @fragment
    fn main(@location(0) Color : vec4<f32>) -> @location(0) vec4<f32> {
        return Color;
    }
    `
}
