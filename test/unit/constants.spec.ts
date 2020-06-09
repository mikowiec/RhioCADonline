import { ComponentType, DrawMode, CullingSide } from "../../src/Constants";
import { expect } from "chai";

describe("CONSTANTS", () => {
    interface WebGLEnums {
        [enumName: string]: GLenum;
    }
    let gl: WebGLEnums;

    beforeEach(() => {
        const canvas = new HTMLCanvasElement();
        gl = (canvas.getContext("webgl") as unknown as WebGLEnums);
    });

    describe("#ComponentType", () => {
        test("BYTE", ComponentType.BYTE);
        test("SHORT", ComponentType.SHORT);
        test("INT", ComponentType.INT);
        test("FLOAT", ComponentType.FLOAT);
        test("UNSIGNED_BYTE", ComponentType.UNSIGNED_BYTE);
        test("UNSIGNED_SHORT", ComponentType.UNSIGNED_SHORT);
        test("UNSIGNED_INT", ComponentType.UNSIGNED_INT);
    });

    describe("#DrawMode", () => {
        test("POINTS", DrawMode.POINTS);
        test("LINES", DrawMode.LINES);
        test("LINE_LOOP", DrawMode.LINE_LOOP);
        test("LINE_STRIP", DrawMode.LINE_STRIP);
        test("TRIANGLES", DrawMode.TRIANGLES);
        test("TRIANGLE_STRIP", DrawMode.TRIANGLE_STRIP);
        test("TRIANGLE_FAN", DrawMode.TRIANGLE_FAN);
    });

    describe("#CullingSide", () => {
        test("FRONT", CullingSide.FRONT);
        test("BACK", CullingSide.BACK);
        test("FRONT_AND_BACK", CullingSide.DOUBLE);
    });

    function test(glParam: string, engineParam: GLenum) {
        it(glParam, () => {
            const glParamValue = gl[glParam] as GLenum;
            expect(glParamValue).not.to.equal(undefined);
            expect(glParamValue).to.equal(engineParam);
        });
    }
});
