/// <reference path="jquery.d.ts" />
/// <reference path="backbone.d.ts" />
/// <reference path="todolist.d.ts" />
/// <reference path="todoview.d.ts" />
declare var Todos: TodoList;
declare class AppView extends Backbone.View {
    public events: {
        "click span.todo-add-child": string;
        "click span.todo-destroy": string;
        "click span.todo-bag": string;
        "keypress #new-todo": string;
        "keyup #new-todo": string;
        "click .todo-clear a": string;
    };
    public input: JQuery;
    public statsTemplate: (params: any) => string;
    constructor();
    public render(): void;
    public addChild(e: any): void;
    public removeTodo(e: any): void;
    public toggleBag(e: any): void;
    public addOne(todo: any): void;
    public addAll(): void;
    public newAttributes(level?: any, parentOrder?: any): {
        content: string;
        order: any;
        parentOrder: any;
        done: boolean;
        level: any;
    };
    public createOnEnter(e: any): void;
    public clearCompleted(): boolean;
    public removeTodoAndChildren(parentOrder: any): boolean;
    public clearTodo(todo: any): boolean;
    public setTodoDone(order: any, isDone: boolean, onlyChildren?: boolean): boolean;
    public toggleTodoChildren(order: any, isDone: boolean): boolean;
    public changeDoorStatus(todo: any): void;
    public tooltipTimeout: number;
    public showTooltip(e: any): void;
}
