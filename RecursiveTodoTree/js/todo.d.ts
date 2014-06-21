/// <reference path="backbone.d.ts" />
declare class Todo extends Backbone.Model {
    public defaults(): {
        content: string;
        done: boolean;
        level: number;
        parentOrder: number;
        order: number;
        isOpen: boolean;
        childrenCount: number;
    };
    public initialize(): void;
    public isDone(): boolean;
    public getLevel(): number;
    public getOrder(): number;
    public getParentOrder(): number;
    public isDoorOpen(): number;
    public toggleDoor(): void;
    public setDoor(isDoorOpen: boolean): void;
    public addChild(): void;
    public removeChild(): void;
    public hide(): void;
    public show(): void;
    public setStatus(isDone: boolean): void;
    public clear(): void;
}
