import { vec3 } from "gl-matrix";

export const UP       = vec3.create();
export const DOWN     = vec3.create();
export const FORWARD  = vec3.create();
export const BACKWARD = vec3.create();
export const LEFT     = vec3.create();
export const RIGHT    = vec3.create();

vec3.set(UP       ,  0,  1,  0 );
vec3.set(DOWN     ,  0, -1,  0 );
vec3.set(FORWARD  ,  0,  0, -1 );
vec3.set(BACKWARD ,  0,  0,  1 );
vec3.set(LEFT     , -1,  0,  0 );
vec3.set(RIGHT    ,  1,  0,  0 );
