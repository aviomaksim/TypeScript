/// <reference path="backbone.d.ts"/>
/// <reference path="todo.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// Todo Collection
// ---------------
// The collection of todos is backed by *localStorage* instead of a remote
// server.
var TodoList = (function (_super) {
    __extends(TodoList, _super);
    function TodoList() {
        _super.apply(this, arguments);
        // Reference to this collection's model.
        this.model = Todo;
        // Save all of the todo items under the `"todos"` namespace.
        this.localStorage = new Store("todos-backbone-recursive");
    }
    // Filter down the list of all todo items that are finished.
    TodoList.prototype.done = function () {
        return this.filter(function (todo) {
            return todo.get('done');
        });
    };

    // Filter down the list to only todo items that are still not finished.
    TodoList.prototype.remaining = function () {
        return this.without.apply(this, this.done());
    };

    // Filter down the list of all todo items that are children.
    TodoList.prototype.childrensOf = function (parentOrder) {
        return this.filter(function (todo) {
            return todo.get('parentOrder') === parentOrder;
        });
    };

    TodoList.prototype.item = function (order) {
        return this.filter(function (todo) {
            return todo.get('order') === order;
        });
    };

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    TodoList.prototype.nextOrder = function () {
        if (!this.length)
            return 1;
        return this.last().get('order') + 1;
    };

    // Todos are sorted by their original insertion order.
    TodoList.prototype.comparator = function (todo) {
        return todo.get('order');
    };
    return TodoList;
})(Backbone.Collection);
