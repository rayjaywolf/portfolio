import * as THREE from 'three';
import { extend } from '@react-three/fiber';

export class MeshImageMaterial extends THREE.MeshBasicMaterial {
    constructor(parameters: any = {}) {
        super(parameters);
        (this as any).setValues(parameters);
    }
    onBeforeCompile = (shader: any) => {
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <color_fragment>',
            /* glsl */ `#include <color_fragment>
                if (!gl_FrontFacing) {
                    vec3 blackCol = vec3(0.0);
                    diffuseColor.rgb = mix(diffuseColor.rgb, blackCol, 0.7);
                }
            `
        );
    };
}

extend({ MeshImageMaterial }); 