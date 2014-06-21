/// <reference path="jquery.d.ts"/>
/// <reference path="backbone.d.ts"/>
/// <reference path="todolist.ts"/>
/// <reference path="todoview.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// Create our global collection of **Todos**.
var Todos = new TodoList();

// The Application
// ---------------
// Our overall **AppView** is the top-level piece of UI.
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView() {
        _super.call(this);
        // Delegated events for creating new items, and clearing completed ones.
        this.events = {
            "click span.todo-add-child": "addChild",
            "click span.todo-destroy": "removeTodo",
            "click span.todo-bag": "toggleBag",
            "keypress #new-todo": "createOnEnter",
            "keyup #new-todo": "showTooltip",
            "click .todo-clear a": "clearCompleted"
        };
        this.tooltipTimeout = null;

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        this.setElement($("#todoapp"), true);

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        _.bindAll(this, 'addOne', 'addAll', 'render');

        this.input = this.$("#new-todo");
        this.statsTemplate = _.template($('#stats-template').html());

        Todos.bind('add', this.addOne);
        Todos.bind('reset', this.addAll);
        Todos.bind('all', this.render);

        Todos.fetch();
    }
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    AppView.prototype.render = function () {
        var done = Todos.done().length;
        var remaining = Todos.remaining().length;

        this.$('#todo-stats').html(this.statsTemplate({
            total: Todos.length,
            done: done,
            remaining: remaining
        }));
    };

    AppView.prototype.addChild = function (e) {
        var parentLevel = parseInt($(e.currentTarget).attr('value'));
        var parentOrder = parseInt($(e.currentTarget).attr('order'));
        Todos.create(this.newAttributes(parentLevel + 1, parentOrder));

        _.each(Todos.item(parentOrder), function (todo) {
            return todo.addChild();
        });

        this.toggleTodoChildren(parentOrder, false); //show all children
    };

    AppView.prototype.removeTodo = function (e) {
        var _this = this;
        var order = parseInt($(e.currentTarget).attr('order'));
        _.each(Todos.item(order), function (todo) {
            return _this.clearTodo(todo);
        });
        //this.removeTodoAndChildren(order);
    };

    AppView.prototype.toggleBag = function (e) {
        var _this = this;
        var order = parseInt($(e.currentTarget).attr('order'));
        _.each(Todos.item(order), function (todo) {
            return _this.changeDoorStatus(todo);
        });
    };

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    AppView.prototype.addOne = function (todo) {
        var view = new TodoView({ model: todo });
        var parentOrder = todo.getParentOrder();
        if (parentOrder > 0) {
            this.$("#todo-list #" + parentOrder).after(view.render().el);
        } else {
            this.$("#todo-list").append(view.render().el);
        }
    };

    // Add all items in the **Todos** collection at once.
    AppView.prototype.addAll = function () {
        Todos.each(this.addOne);
    };

    // Generate the attributes for a new Todo item.
    AppView.prototype.newAttributes = function (level, parentOrder) {
        var order = Todos.nextOrder();

        var content;
        if (level >= 0 && order >= 0) {
            content = "ID:" + order + ", level:" + level + ".";
        } else {
            content = this.input.val();
        }
        return {
            content: content,
            order: order,
            parentOrder: parentOrder ? parentOrder : 0,
            done: false,
            level: level ? level : 0
        };
    };

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    AppView.prototype.createOnEnter = function (e) {
        if (e.keyCode != 13)
            return;
        Todos.create(this.newAttributes());
        this.input.val('');
    };

    // Clear all done todo items, destroying their models.
    AppView.prototype.clearCompleted = function () {
        _.each(Todos.done(), function (todo) {
            return todo.clear();
        });
        return false;
    };

    // Clear all todo items, destroying their models.
    AppView.prototype.removeTodoAndChildren = function (parentOrder) {
        var _this = this;
        _.each(Todos.childrensOf(parentOrder), function (todo) {
            return _this.clearTodo(todo);
        });
        return false;
    };

    AppView.prototype.clearTodo = function (todo) {
        var order = todo.getOrder();
        this.removeTodoAndChildren(order);
        todo.clear();

        var parentOrder = todo.getParentOrder();
        _.each(Todos.item(parentOrder), function (parentTodo) {
            return parentTodo.removeChild();
        });
        return false;
    };

    AppView.prototype.setTodoDone = function (order, isDone, onlyChildren) {
        var _this = this;
        console.log("setTodoDone order=" + order + " isDone=" + isDone);
        if (!onlyChildren)
            _.each(Todos.item(order), function (todo) {
                return todo.setStatus(isDone);
            });
        _.each(Todos.childrensOf(order), function (todo) {
            return _this.setTodoDone(todo.getOrder(), isDone);
        });
        return false;
    };

    AppView.prototype.toggleTodoChildren = function (order, isDone) {
        this.setTodoDone(order, isDone, true);
        return false;
    };

    AppView.prototype.changeDoorStatus = function (todo) {
        todo.toggleDoor();
        var order = todo.getOrder();
        var isDoorOpen = todo.isDoorOpen();
        _.each(Todos.childrensOf(order), function (childTodo) {
            return childTodo.setDoor(isDoorOpen);
        }); //change status of children doors
        this.toggleTodoChildren(order, !isDoorOpen);
    };

    // Lazily show the tooltip that tells you to press `enter` to save
    // a new todo item, after one second.
    AppView.prototype.showTooltip = function (e) {
        var tooltip = $(".ui-tooltip-top");
        var val = this.input.val();
        tooltip.fadeOut();
        if (this.tooltipTimeout)
            clearTimeout(this.tooltipTimeout);
        if (val == '' || val == this.input.attr('placeholder'))
            return;
        this.tooltipTimeout = _.delay(function () {
            return tooltip.show().fadeIn();
        }, 1000);
    };
    return AppView;
})(Backbone.View);

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function () {
    // Finally, we kick things off by creating the **App**.
    new AppView();
});
