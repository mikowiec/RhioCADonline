import { UpdateableObject } from "../../../Core";

interface SyncedInstance<T> {
    instance: T;
    version: number;
}

export abstract class SyncedMap<
    OriginalType extends UpdateableObject,
    InternalType
> {
    protected map = new WeakMap<OriginalType, SyncedInstance<InternalType>>();

    public create(originalObject: OriginalType, ...extraArgs: any[]): InternalType {
        const instance = this.createInstance(originalObject, ...extraArgs);
        this.map.set(originalObject, { instance, version: undefined });
        return this.get(originalObject);
    }

    public get(originalObject: OriginalType): InternalType {
        const syncedInstance = this.map.get(originalObject);

        if (syncedInstance !== undefined) {
            this.sync(originalObject, syncedInstance);
            return syncedInstance.instance;
        }
    }

    public getOrCreate(originalObject: OriginalType, ...extraArgs: any[]): InternalType {
        return this.get(originalObject)
            || this.create(originalObject, ...extraArgs);
    }

    public destroy(key: OriginalType): boolean {
        const syncedInstance = this.map.get(key);

        if (syncedInstance !== undefined) {
            this.destroyInstance(syncedInstance.instance);
            return this.map.delete(key);
        }

        return false;
    }

    protected abstract createInstance(originalObject: OriginalType, ...extraArgs: any[]): InternalType;
    protected abstract updateInstance(originalObject: OriginalType, internalObject: InternalType): void;
    protected abstract destroyInstance(internalObject: InternalType): void;

    private sync(originalObject: OriginalType, syncedInstance: SyncedInstance<InternalType>) {
        if (originalObject.version !== syncedInstance.version) {
            this.updateInstance(originalObject, syncedInstance.instance);
            syncedInstance.version = originalObject.version;
        }
    }
}
