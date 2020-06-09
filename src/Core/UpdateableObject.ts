export class UpdateableObject {
    private _version: number = 0;

    public set needsUpdate(value: boolean) {
        if (value) {
            this._version++;
        }
    }

    public get version(): number {
        return this._version;
    }
}
