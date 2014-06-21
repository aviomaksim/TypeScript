/// <reference path="backbone.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// Todo Model
// ----------
// Our basic **Todo** model has `content`, `order`, and `done` attributes.
var Todo = (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        _super.apply(this, arguments);
    }
    // Default attributes for the todo.
    Todo.prototype.defaults = function () {
        return {
            content: "Root ",
            done: false,
            level: 0,
            parentOrder: 0,
            order: 0,
            isOpen: true,
            childrenCount: 0
        };
    };

    // Ensure that each todo created has `content`.
    Todo.prototype.initialize = function () {
        if (!this.get("content")) {
            this.set({ "content": this.defaults().content });
        }
        if (!this.get("level")) {
            this.set({ "level": this.defaults().level });
        }
        if (!this.get("parentOrder")) {
            this.set({ "parentOrder": this.defaults().parentOrder });
        }
        if (!this.get("childrenCount")) {
            this.set({ "childrenCount": this.defaults().childrenCount });
        }
    };

    Todo.prototype.isDone = function () {
        return this.get("done");
    };

    Todo.prototype.getLevel = function () {
        return this.get("level");
    };

    Todo.prototype.getOrder = function () {
        return this.get("order");
    };

    Todo.prototype.getParentOrder = function () {
        return this.get("parentOrder");
    };

    Todo.prototype.isDoorOpen = function () {
        return this.get("isOpen");
    };

    Todo.prototype.toggleDoor = function () {
        this.save({ isOpen: !this.get("isOpen") });
    };

    Todo.prototype.setDoor = function (isDoorOpen) {
        this.save({ isOpen: isDoorOpen });
    };

    Todo.prototype.addChild = function () {
        var count = this.get("childrenCount");
        count++;
        this.save({ childrenCount: count });
    };

    Todo.prototype.removeChild = function () {
        var count = this.get("childrenCount");
        count--;
        this.save({ childrenCount: count });
    };

    Todo.prototype.hide = function () {
        console.log("TODO:" + this.get("order") + " done");
        this.save({ done: true });
    };

    Todo.prototype.show = function () {
        console.log("TODO:" + this.get("order") + " not done");
        this.save({ done: false });
    };

    Todo.prototype.setStatus = function (isDone) {
        isDone ? this.hide() : this.show();
    };

    // Remove this Todo from *localStorage* and delete its view.
    Todo.prototype.clear = function () {
        this.destroy();
    };
    return Todo;
})(Backbone.Model);
