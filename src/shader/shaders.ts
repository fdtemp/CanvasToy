module CanvasToy {
export var basic_frag = "#version 100\n\n#ifdef USE_COLOR\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_TEXTURE\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\nvec4 textureColor;\n#endif\n\n#ifdef OPEN_LIGHT\nvarying vec3 vNormal;\n#endif\n\nvoid main() {\n#ifdef USE_COLOR\n    gl_FragColor = vColor;\n#endif\n\n#ifdef USE_TEXTURE\n    gl_FragColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n\n}\n"
export var basic_vert = "#version 100\n\nattribute vec3 position;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec4 cameraPosition;\n\n#ifdef USE_COLOR\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_TEXTURE\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif\n\n#ifdef OPEN_LIGHT\nattribute vec3 aNormal;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n#ifdef USE_COLOR\n    vColor = aColor;\n#endif\n\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n\n}\n"
export var brdf_perfrag_frag = "#version 100\n\n#ifdef USE_COLOR // color declaration\nvec3 colorFactor;\n#endif // color declaration \n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\nvec3 textureColor;\n#endif // texture declaration\n\n#ifdef OPEN_LIGHT // light declaration\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec4 position;\n    bool directional;\n};\nuniform vec3 ambient;\nuniform vec4 eyePosition;\nvarying vec3 vPosition;\nuniform int lightsNum;\nLight light[8];\nvarying vec3 vNormal;\n#endif // light declaration\n\nvoid main() {\n#ifdef USE_COLOR\n\n#endif\n\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n#ifdef OPEN_LIGHT\n    vec3 totalLighting = ambient;\n    for (int index = 0; index < lightsNum; index++) {\n            vec3 lightDir = normalize(vPosition - light[index].position).xyz;\n            vec3 lambortian = max(dot(normalize(vNormal), lightDir), 0.0);\n            vec3 reflectDir = reflect(lightDir, vNormal);\n            vec3 viewDir = normalize(eyePosition-vPosition);\n            vec3 specularAngle = max(dot(reflectDir, viewDir), 0.0);\n            vec3 specularColor = light[index].specular * pow(specular, light.idensity);\n            vec3 diffuseColor = diffuseColorFactor * light[index].diffuse;\n            totalLighting = totalLighting + vec4(diffuseColor + specularColor, 1.0) * textureColor;\n        }\n        gl_FragColor = vec4(totalLighting, 1.0);\n#endif\n}\n"
export var brdf_perfrag_vert = "#version 100\n\nattribute vec3 position;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec4 eyePosition;\n\n#ifdef USE_COLOR\nattribute vec3 aColor;\nvarying vec3 vColor;\n#endif\n\n#ifdef USE_TEXTURE\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif\n\n#ifdef OPEN_LIGHT\nattribute vec3 aNormal;\nvarying vec3 vPosition;\n    #ifdef SMOOTH_SHADING\n    varying vec3 vNormal;\n    #endif\n#endif\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    #ifdef SMOOTH_SHADING\n    vNormal = aNormal;\n    vPosition = gl_Position;\n    #endif\n#endif\n\n#ifdef USE_COLOR\n    vColor = aColor;\n#endif\n\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n"
}