/// <reference path="backbone.d.ts" />
/// <reference path="todo.d.ts" />
declare class TodoView extends Backbone.View {
    public template: (data: any) => string;
    public model: Todo;
    public input: JQuery;
    constructor(options?: any);
    public render(): TodoView;
    public edit(): void;
    public close(): void;
    public setStatus(isDone: boolean): void;
    public toggleDoor(): void;
    public addChild(): void;
    public removeChild(): void;
    public updateOnEnter(e: any): void;
    public clear(): void;
}
