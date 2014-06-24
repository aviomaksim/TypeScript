/// <reference path="backbone.d.ts"/>
/// <reference path="todo.ts"/>
/// <reference path="todos.ts"/>

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

    isInit: boolean;
    
    constructor(options?) {
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

        super(options);

        this.isInit = false;

        // Cache the template function for a single item.
        this.template = _.template($('#item-template').html());

        _.bindAll(this, 'render', 'close', 'remove');
        this.model.bind('change', this.render);
        this.model.bind('destroy', this.remove);


        var parentOrder:number = this.model.getParentOrder();
        if (parentOrder > 0) {
            $("#todo-list " + ".childrenof" + parentOrder).append(this.render().el);
        } else {
            $("#todo-list").append(this.render().el);
        }

    }


    // Re-render the contents of the todo item.
    render() {
        var order: number = this.model.getOrder();
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
        var left : number = 20;
        this.$el.css('margin-left', left + 'px');
        this.$el.attr("id", order);
        this.input = this.$('.todo-input' + order);
        return this;
    }
    
    // Switch this view into `"editing"` mode, displaying the input field.
    edit(e) {
        if (!this.isMyEvent(e)) return;
        var order: number = this.model.getOrder();
        var holderEl = this.$('.todo' + order);
        holderEl.addClass("editing");
        //this.$el.addClass("editing");
        this.input.focus();
    }

    // Close the `"editing"` mode, saving changes to the todo.
    close(e) {
        if (!this.isMyEvent(e)) return;
        this.model.save({ content: this.input.val() });
        var order: number = this.model.getOrder();
        var holderEl = this.$('.todo' + order);
        holderEl.removeClass("editing");
        //this.$el.removeClass("editing");
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
        if (!this.isMyEvent(e)) return;
        if (e.keyCode == 13) this.close(e);
    }

    // Remove the item, destroy the model.
    clear() {
        this.model.clear();
    }

    isMyEvent(e) {
        var elOrder: number = parseInt($(e.currentTarget).attr('order'));
        var myOrder: number = this.model.getOrder();
        if (elOrder === myOrder) return true;
        return false;
    }
    
    //---------------
    addTodo(e) {
        var myOrder: number = this.model.getOrder();
        if (this.isMyEvent(e)) {//check, that it is not a child event
            this.addChild();
            var parentLevel: number = this.model.getLevel() + 1;
            Todos.create(this.newAttributes(parentLevel + 1, myOrder));
        }

        //this.toggleTodoChildren(parentOrder, false);//show all children
    }

    removeTodo(e) {
        if (this.isMyEvent(e)) { //check, that it is not a child event
            this.clearTodo(this.model);
        }
    }
    

    // Clear all todo items, destroying their models.
    removeTodoAndChildren(parentOrder) {
        _.each(Todos.childrensOf(parentOrder), todo => this.clearTodo(todo));
        return false;
    }

    clearTodo(todo) {
        var order = todo.getOrder();
        this.removeTodoAndChildren(order);
        todo.clear();

        var parentOrder = todo.getParentOrder();
        _.each(Todos.item(parentOrder), parentTodo => parentTodo.removeChild());
        return false;
    }

    // Generate the attributes for a new Todo item.
    newAttributes(level?, parentOrder?) {
        var order = Todos.nextOrder();

        var content: string;
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
    }

}