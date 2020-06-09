type UniformMatrixData = Float32Array | ArrayLike<number>;
export type UniformData = number | Int32Array | Uint32Array | Float32Array | ArrayLike<number>;

type UniformSetter = (
    location: WebGLUniformLocation,
    data: UniformData,
    srcOffset?: number,
    srcLength?: number) => void;
type UniformSetterMapping = Map<number, UniformSetter>;
type WebGLUniformMatrixSetter = (
    location: WebGLUniformLocation,
    transpose: boolean,
    data: ArrayLike<number> | Float32Array,
    srcOffset?: number,
    srcLength?: number
) => void;

const cachedMappings = new Map<WebGL2RenderingContext, UniformSetterMapping>();
export function uniformSetterMappings(gl: WebGL2RenderingContext): UniformSetterMapping {
    if (!cachedMappings.has(gl)) {
        const mappings = generateNewMappings(gl);
        cachedMappings.set(gl, mappings);
    }

    return cachedMappings.get(gl);
}

function generateNewMappings(gl: WebGL2RenderingContext): UniformSetterMapping {
    const mappings: UniformSetterMapping = new Map<number, UniformSetter>();

    mappings.set(gl.BOOL, singleSetter(gl, gl.uniform1i, gl.uniform1iv));
    mappings.set(gl.BOOL_VEC2, arraySetter(gl, gl.uniform2iv));
    mappings.set(gl.BOOL_VEC3, arraySetter(gl, gl.uniform3iv));
    mappings.set(gl.BOOL_VEC4, arraySetter(gl, gl.uniform4iv));

    mappings.set(gl.INT, singleSetter(gl, gl.uniform1i, gl.uniform1iv));
    mappings.set(gl.INT_VEC2, arraySetter(gl, gl.uniform2iv));
    mappings.set(gl.INT_VEC3, arraySetter(gl, gl.uniform3iv));
    mappings.set(gl.INT_VEC4, arraySetter(gl, gl.uniform4iv));

    mappings.set(gl.UNSIGNED_INT, singleSetter(gl, gl.uniform1ui, gl.uniform1uiv));
    mappings.set(gl.UNSIGNED_INT_VEC2, arraySetter(gl, gl.uniform2uiv));
    mappings.set(gl.UNSIGNED_INT_VEC3, arraySetter(gl, gl.uniform3uiv));
    mappings.set(gl.UNSIGNED_INT_VEC4, arraySetter(gl, gl.uniform4uiv));

    mappings.set(gl.FLOAT, singleSetter(gl, gl.uniform1f, gl.uniform1fv));
    mappings.set(gl.FLOAT_VEC2, arraySetter(gl, gl.uniform2fv));
    mappings.set(gl.FLOAT_VEC3, arraySetter(gl, gl.uniform3fv));
    mappings.set(gl.FLOAT_VEC4, arraySetter(gl, gl.uniform4fv));

    mappings.set(gl.FLOAT_MAT2, matrixSetter(gl, gl.uniformMatrix2fv));
    mappings.set(gl.FLOAT_MAT2x3, matrixSetter(gl, gl.uniformMatrix2x3fv));
    mappings.set(gl.FLOAT_MAT2x4, matrixSetter(gl, gl.uniformMatrix2x4fv));

    mappings.set(gl.FLOAT_MAT3x2, matrixSetter(gl, gl.uniformMatrix3x2fv));
    mappings.set(gl.FLOAT_MAT3, matrixSetter(gl, gl.uniformMatrix3fv));
    mappings.set(gl.FLOAT_MAT3x4, matrixSetter(gl, gl.uniformMatrix3x4fv));

    mappings.set(gl.FLOAT_MAT4x2, matrixSetter(gl, gl.uniformMatrix4x2fv));
    mappings.set(gl.FLOAT_MAT4x3, matrixSetter(gl, gl.uniformMatrix4x3fv));
    mappings.set(gl.FLOAT_MAT4, matrixSetter(gl, gl.uniformMatrix4fv));

    mappings.set(gl.SAMPLER_2D, singleSetter(gl, gl.uniform1i, gl.uniform1iv));

    return mappings;
}

function arraySetter(
    context: WebGL2RenderingContext,
    setter: UniformSetter
) {
    return setter.bind(context);
}

function matrixSetter(
    context: WebGL2RenderingContext,
    fn: WebGLUniformMatrixSetter
): UniformSetter {
    const boundFn = fn.bind(context);

    return (loc: WebGLUniformLocation,
            data: UniformMatrixData,
            srcOffset?: number,
            srcLength?: number) =>
        boundFn(loc, false, data, srcOffset, srcLength);
}

function singleSetter<T extends UniformData>(
    context: WebGL2RenderingContext,
    singleInputFn: UniformSetter,
    multiInputFn: UniformSetter
) {
    const boundSingleInput = singleInputFn.bind(context);
    const boundMultiInput = multiInputFn.bind(context);

    return (location: WebGLUniformLocation, data: T) => {
        return isNaN(data as any)
            ? boundMultiInput(location, data)
            : boundSingleInput(location, data);
    };
}
