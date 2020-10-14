declare module "*.txt" {
    const value: string;
    export default value;
}

declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}