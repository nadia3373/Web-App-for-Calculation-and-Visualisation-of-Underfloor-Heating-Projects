import ObjectId from 'bson-objectid';
import { MountingBox } from './mounting-box.model';
import { Pipe } from './pipe.model';
import { ThermoController } from './thermocontroller.model';
import { Combo } from './combo.model';
import { Layout } from './layout.model';

export class Project {
    private combo: Combo;
    private created: string;
    private id: string;
    private image: string;
    private layout: Layout;
    private mb: MountingBox[];
    private pipes: Pipe[];
    private room: string;
    private tc: ThermoController[];
    private total: number;

    constructor(combo: Combo = new Combo(), created: string = new Date().toISOString(), id: string = new ObjectId().toHexString(),
    image: string = '', layout: Layout = new Layout(), mb: MountingBox[] = [], pipes: Pipe[] = [], room: string = '', tc: ThermoController[] = [], total: number = 0) {
        this.combo = combo;
        this.created = created;
        this.id = id;
        this.image = image;
        this.layout = layout;
        this.mb = mb;
        this.pipes = pipes;
        this.room = room;
        this.tc = tc;
        this.total = total;
    }

    public get projectCombo(): Combo {
        return this.combo;
    }
    
    public get projectCreated(): string {
        return this.created;
    }
    
    public get projectId(): string {
        return this.id;
    }
    
    public get projectImage(): string {
        return this.image;
    }

    public get projectLayout(): Layout {
        return this.layout;
    }

    public get projectMb(): MountingBox[] {
        return this.mb;
    }
    
    public get projectPipes(): Pipe[] {
        return this.pipes;
    }

    public get projectRoom(): string {
        return this.room;
    }

    public get projectTc(): ThermoController[] {
        return this.tc;
    }

    public get projectTotal(): number {
        return this.total;
    }

    public set projectCombo(combo: Combo) {
        this.combo = combo;
    }
    
    public set projectCreated(c: string) {
        this.created = c;
    }
    
    public set projectId(i: string) {
        this.id = i;
    }

    public set projectImage(i: string) {
        this.image = i;
    }

    public set projectLayout(l: Layout) {
        this.layout = l;
    }

    public set projectMb(m: MountingBox[]) {
        this.mb = m;
    }
    
    public set projectPipes(p: Pipe[]) {
        this.pipes = p;
    }

    public set projectRoom(r: string) {
        this.room = r;
    }

    public set projectTc(t: ThermoController[]) {
        this.tc = t;
    }

    public set projectTotal(total: number) {
        this.total = total;
    }
}