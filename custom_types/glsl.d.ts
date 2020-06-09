// Allow direct import of glsl files in typescript
declare module "*.glsl" {
    const content: string;
    export default content;
}
