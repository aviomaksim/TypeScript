/// <reference path="backbone.d.ts"/>
/// <reference path="todo.ts"/>

// Todo Item View
// --------------

// The DOM element for a todo item...
class TodoView extends Backbone.View {

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    template: (data: any) => string;

    // A TodoView model must be a Todo, redeclare with specific type
    model: Todo;
    input: JQuery;

    constructor(options?) {
        //... is a list tag.
        this.tagName = "li";

        // The DOM events specific to an item.
        this.events = {
            "dblclick .display": "edit",
           // "click span.todo-destroy": "clear",
            "keypress .todo-input": "updateOnEnter",
            "blur .todo-input": "close",
        };

        super(options);

        // Cache the template function for a single item.
        this.template = _.template($('#item-template').html());

        _.bindAll(this, 'render', 'close', 'remove');
        this.model.bind('change', this.render);
        this.model.bind('destroy', this.remove);
    }

    // Re-render the contents of the todo item.
    render() {
        this.$el.html(this.template(this.model.toJSON()));
        this.model.isDone() ? this.$el.addClass("itemHide") : this.$el.removeClass("itemHide");
        var left : number = this.model.getLevel() * 10;
        this.$el.css('margin-left', left + 'px');
        this.$el.attr("id", this.model.getOrder());
        this.input = this.$('.todo-input');
        return this;
    }
    
    // Switch this view into `"editing"` mode, displaying the input field.
    edit() {
        this.$el.addClass("editing");
        this.input.focus();
    }

    // Close the `"editing"` mode, saving changes to the todo.
    close() {
        this.model.save({ content: this.input.val() });
        this.$el.removeClass("editing");
    }
    
    setStatus(isDone: boolean) {
        this.model.setStatus(isDone);
    }

    toggleDoor() {
        this.model.toggleDoor();
    }

    addChild() {
        this.model.addChild();
    }

    removeChild() {
        this.model.removeChild();
    }


    // If you hit `enter`, we're through editing the item.
    updateOnEnter(e) {
        if (e.keyCode == 13) this.close();
    }

    // Remove the item, destroy the model.
    clear() {
        this.model.clear();
    }

}