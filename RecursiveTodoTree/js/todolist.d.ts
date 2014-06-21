/// <reference path="backbone.d.ts" />
/// <reference path="todo.d.ts" />
declare class TodoList extends Backbone.Collection<Todo> {
    public model: typeof Todo;
    public localStorage: any;
    public done(): Todo[];
    public remaining(): any;
    public childrensOf(parentOrder: any): Todo[];
    public item(order: any): Todo[];
    public nextOrder(): any;
    public comparator(todo: Todo): any;
}
