import ObjectId from 'bson-objectid';
import { MountingBox } from './mounting-box.model';
import { Pipe } from './pipe.model';
import { ThermoController } from './thermocontroller.model';

export class Project {
    private _id: ObjectId;
    private created: string;
    private mb: MountingBox[];
    private pipes: Pipe[];
    private room: ObjectId;
    private tc: ThermoController[];

    constructor(_id: ObjectId = new ObjectId(), created: string = new Date().toISOString(),
    mb: MountingBox[] = [], pipes = [], room: ObjectId, tc: ThermoController[] = []) {
        this._id = _id;
        this.created = created;
        this.mb = mb;
        this.pipes = pipes;
        this.room = room;
        this.tc = tc;
    }
}