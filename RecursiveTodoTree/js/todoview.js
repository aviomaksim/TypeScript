/// <reference path="backbone.d.ts"/>
/// <reference path="todo.ts"/>
/// <reference path="todos.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// Todo Item View
// --------------
// The DOM element for a todo item...
var TodoView = (function (_super) {
    __extends(TodoView, _super);
    function TodoView(options) {
        //... is a list tag.
        this.tagName = "div";

        // The DOM events specific to an item.
        this.events = {
            //"dblclick .todo-content": "edit",
            "click span.todo-edit": "edit",
            "keypress .todo-input": "updateOnEnter",
            "blur .todo-input": "close",
            "click span.todo-add-child": "addTodo",
            "click span.todo-destroy": "removeTodo"
        };

        _super.call(this, options);

        this.isInit = false;

        // Cache the template function for a single item.
        this.template = _.template($('#item-template').html());

        _.bindAll(this, 'render', 'close', 'remove');
        this.model.bind('change', this.render);
        this.model.bind('destroy', this.remove);

        var parentOrder = this.model.getParentOrder();
        if (parentOrder > 0) {
            $("#todo-list " + ".childrenof" + parentOrder).append(this.render().el);
        } else {
            $("#todo-list").append(this.render().el);
        }
    }
    // Re-render the contents of the todo item.
    TodoView.prototype.render = function () {
        var order = this.model.getOrder();
        console.log('render ' + order + ' ' + this.model.getContent());

        if (!this.isInit) {
            this.$el.html(this.template(this.model.toJSON()));
            this.isInit = true;
        } else {
            var bag = this.$('.todo-bag' + order);
            !this.model.isDoorOpen() ? bag.addClass("close") : bag.removeClass("close");
            this.model.getChildrenCount() > 0 ? bag.removeClass("hide") : bag.addClass("hide");

            var holderEl = this.$('.todo' + order);
            this.model.isDone() ? holderEl.addClass("done") : holderEl.removeClass("done");

            var contentEl = this.$('.todo-content' + order);
            contentEl.html(this.model.getContent());
        }
        this.$el.addClass("li");
        this.model.isDone() ? this.$el.addClass("itemHide") : this.$el.removeClass("itemHide");
        var left = 20;
        this.$el.css('margin-left', left + 'px');
        this.$el.attr("id", order);
        this.input = this.$('.todo-input' + order);
        return this;
    };

    // Switch this view into `"editing"` mode, displaying the input field.
    TodoView.prototype.edit = function (e) {
        if (!this.isMyEvent(e))
            return;
        var order = this.model.getOrder();
        var holderEl = this.$('.todo' + order);
        holderEl.addClass("editing");

        //this.$el.addClass("editing");
        this.input.focus();
    };

    // Close the `"editing"` mode, saving changes to the todo.
    TodoView.prototype.close = function (e) {
        if (!this.isMyEvent(e))
            return;
        this.model.save({ content: this.input.val() });
        var order = this.model.getOrder();
        var holderEl = this.$('.todo' + order);
        holderEl.removeClass("editing");
        //this.$el.removeClass("editing");
    };

    TodoView.prototype.setStatus = function (isDone) {
        this.model.setStatus(isDone);
    };

    TodoView.prototype.toggleDoor = function () {
        this.model.toggleDoor();
    };

    TodoView.prototype.addChild = function () {
        this.model.addChild();
    };

    TodoView.prototype.removeChild = function () {
        this.model.removeChild();
    };

    // If you hit `enter`, we're through editing the item.
    TodoView.prototype.updateOnEnter = function (e) {
        if (!this.isMyEvent(e))
            return;
        if (e.keyCode == 13)
            this.close(e);
    };

    // Remove the item, destroy the model.
    TodoView.prototype.clear = function () {
        this.model.clear();
    };

    TodoView.prototype.isMyEvent = function (e) {
        var elOrder = parseInt($(e.currentTarget).attr('order'));
        var myOrder = this.model.getOrder();
        if (elOrder === myOrder)
            return true;
        return false;
    };

    //---------------
    TodoView.prototype.addTodo = function (e) {
        var myOrder = this.model.getOrder();
        if (this.isMyEvent(e)) {
            this.addChild();
            var parentLevel = this.model.getLevel() + 1;
            Todos.create(this.newAttributes(parentLevel + 1, myOrder));
        }
        //this.toggleTodoChildren(parentOrder, false);//show all children
    };

    TodoView.prototype.removeTodo = function (e) {
        if (this.isMyEvent(e)) {
            this.clearTodo(this.model);
        }
    };

    // Clear all todo items, destroying their models.
    TodoView.prototype.removeTodoAndChildren = function (parentOrder) {
        var _this = this;
        _.each(Todos.childrensOf(parentOrder), function (todo) {
            return _this.clearTodo(todo);
        });
        return false;
    };

    TodoView.prototype.clearTodo = function (todo) {
        var order = todo.getOrder();
        this.removeTodoAndChildren(order);
        todo.clear();

        var parentOrder = todo.getParentOrder();
        _.each(Todos.item(parentOrder), function (parentTodo) {
            return parentTodo.removeChild();
        });
        return false;
    };

    // Generate the attributes for a new Todo item.
    TodoView.prototype.newAttributes = function (level, parentOrder) {
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
    return TodoView;
})(Backbone.View);
