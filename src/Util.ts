namespace CanvasToy {

    export enum ShaderType {
        VertexShader,
        FragmentShader
    }

    export function mixin(toObject: Object, fromObject: Object) {
        for (let property in fromObject) {
            if (toObject[property] instanceof Object) {
                mixin(toObject[property], fromObject[property]);
            } else {
                toObject[property] = fromObject[property];
            }
        }
    }

    export function initWebwebglContext(canvas): WebGLRenderingContext {
        try {
            gl = canvas.getContext("experimental-webgl");
        } catch (e) {
            gl = canvas.getContext("webgl");
        }
        if (!gl) {
            alert("Cannot init webgl, current browser may not support it.");
        }
        return gl;
    }

    export function getDomScriptText(script: HTMLScriptElement): string {

        if (!script) {
            return null;
        }

        let theSource = "";
        let currentChild = script.firstChild;

        while (currentChild) {
            if (currentChild.nodeType === 3) {
                theSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        // Send the source to the shader object

    }

    function createSeparatedShader(gl: WebGLRenderingContext, source: string, type: ShaderType): WebGLShader {

        let shader: WebGLShader;

        let typeInfo;

        if (type === ShaderType.FragmentShader) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            typeInfo = "fragment shader";
        } else if (type === ShaderType.VertexShader) {
            shader = gl.createShader(gl.VERTEX_SHADER);
            typeInfo = "vertex shader";
        }
        gl.shaderSource(shader, source);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("error: " + typeInfo + "\n" + gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    function linkShader(
        gl: WebGLRenderingContext,
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader
    ): WebGLProgram {
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("error: link shader program failed.\n" + gl.getProgramInfoLog(shaderProgram));
        }
        return shaderProgram;
    };

    export function createEntileShader(
        gl: WebGLRenderingContext, vertexShaderSource: string,
        fragmentShaderSource: string
    ): WebGLProgram {
        let vertShader = createSeparatedShader(gl, vertexShaderSource, ShaderType.VertexShader);
        let fragShader = createSeparatedShader(gl, fragmentShaderSource, ShaderType.FragmentShader);
        return linkShader(gl, vertShader, fragShader);
    }
}
