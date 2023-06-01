import ObjectId from 'bson-objectid';
import { MountingBox } from './mounting-box.model';
import { Pipe } from './pipe.model';
import { ThermoController } from './thermocontroller.model';
import { Combo } from './combo.model';
import { Layout } from './layout.model';

export class Project {
    public box: MountingBox;
    public combo: Combo;
    public controller: ThermoController;
    public created: string;
    public id: string;
    public image: string = '';
    public layout: Layout;
    public mb: MountingBox[];
    public pipes: Pipe[];
    public room: string;
    public boxesTotal: number = 0;
    public controllersTotal: number = 0;
    public pipesTotal: number = 0;
    public total: number = 0;

    constructor(box: MountingBox = new MountingBox(), combo: Combo = new Combo(), controller: ThermoController = new ThermoController(), created: string = new Date().toISOString(), id: string = new ObjectId().toHexString(),
    image: string = '', layout: Layout = new Layout(), mb: MountingBox[] = [], pipes: Pipe[] = [], room: string = '', tc: ThermoController[] = [], total: number = 0) {
        this.box = box;
        this.combo = combo;
        this.controller = controller;
        this.created = created;
        this.id = id;
        this.image = image;
        this.layout = layout;
        this.mb = mb;
        this.pipes = pipes;
        this.room = room;
        this.total = total;
    }

    public calculate(): void {
        this.boxesTotal = this.box.price * this.combo.pipes.length;
        this.pipesTotal = this.combo.pipes.reduce((acc: number, pipe: Pipe) => {
          return acc + pipe.price;
        }, 0);
        this.controllersTotal = this.controller.price * this.combo.pipes.length;
        this.total = this.boxesTotal + this.pipesTotal + this.controllersTotal;
      }
}