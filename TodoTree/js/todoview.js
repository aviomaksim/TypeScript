/// <reference path="backbone.d.ts"/>
/// <reference path="todo.ts"/>
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
        this.tagName = "li";

        // The DOM events specific to an item.
        this.events = {
            "dblclick .display": "edit",
            // "click span.todo-destroy": "clear",
            "keypress .todo-input": "updateOnEnter",
            "blur .todo-input": "close"
        };

        _super.call(this, options);

        // Cache the template function for a single item.
        this.template = _.template($('#item-template').html());

        _.bindAll(this, 'render', 'close', 'remove');
        this.model.bind('change', this.render);
        this.model.bind('destroy', this.remove);
    }
    // Re-render the contents of the todo item.
    TodoView.prototype.render = function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.model.isDone() ? this.$el.addClass("itemHide") : this.$el.removeClass("itemHide");
        var left = this.model.getLevel() * 10;
        this.$el.css('margin-left', left + 'px');
        this.$el.attr("id", this.model.getOrder());
        this.input = this.$('.todo-input');
        return this;
    };

    // Switch this view into `"editing"` mode, displaying the input field.
    TodoView.prototype.edit = function () {
        this.$el.addClass("editing");
        this.input.focus();
    };

    // Close the `"editing"` mode, saving changes to the todo.
    TodoView.prototype.close = function () {
        this.model.save({ content: this.input.val() });
        this.$el.removeClass("editing");
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
        if (e.keyCode == 13)
            this.close();
    };

    // Remove the item, destroy the model.
    TodoView.prototype.clear = function () {
        this.model.clear();
    };
    return TodoView;
})(Backbone.View);
