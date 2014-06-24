/// <reference path="jquery.d.ts"/>
/// <reference path="backbone.d.ts"/>
/// <reference path="todolist.ts"/>
/// <reference path="todoview.ts"/>


// Create our global collection of **Todos**.
var Todos = new TodoList();

// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
class AppView extends Backbone.View {

    // Delegated events for creating new items, and clearing completed ones.
    events = {

        "keypress #new-todo": "createOnEnter",
        "keyup #new-todo": "showTooltip",
        "click .todo-clear a": "clearCompleted",

        "click span.todo-bag": "toggleBag"
    };

    input: JQuery;
    statsTemplate: (params: any) => string;

    constructor () {
        super();
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
    render() {
        var done = Todos.done().length;
        var remaining = Todos.remaining().length;

        this.$('#todo-stats').html(this.statsTemplate({
            total: Todos.length,
            done: done,
            remaining: remaining
        }));
    }

    
    // Add a single todo item to the list by creating a view for it, and
    addOne(todo) {
        var parentOrder = todo.getParentOrder();
        if (parentOrder > 0) {
            todo.addOne();//create child
        } else {//root element
            var view = new TodoView({ model: todo });
        }
    }

    // Add all items in the **Todos** collection at once.
    addAll() {
        Todos.each(this.addOne);
    }

    // Generate the attributes for a new Todo item.
    newAttributes(level?, parentOrder?) {
        var order = Todos.nextOrder();

        var content : string = this.input.val();
        return {
            content: content,
            order: order,
            parentOrder: parentOrder ? parentOrder : 0,
            done: false,
            level: level ? level : 0
        };
    }

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter(e) {
        if (e.keyCode != 13) return;
        Todos.create(this.newAttributes());
        this.input.val('');
    }

    // Clear all done todo items, destroying their models.
    clearCompleted() {
        _.each(Todos.done(), todo => todo.clear());
        return false;
    }
    
    setTodoDone(order, isDone: boolean, onlyChildren?: boolean) {
        _.each(Todos.item(order), todo => todo.setDoor(!isDone));

        if(!onlyChildren) _.each(Todos.item(order), todo => todo.setStatus(isDone));
        _.each(Todos.childrensOf(order), todo => this.setTodoDone(todo.getOrder(), isDone));
        return false;
    }

    toggleTodoChildren(order, isDone: boolean) {
        this.setTodoDone(order, isDone, true);
        return false;
    }
    
    changeDoorStatus(todo) {
        todo.toggleDoor();
        var order = todo.getOrder();
        var isDoorOpen = todo.isDoorOpen();
        this.toggleTodoChildren(order, !isDoorOpen);
    }

    toggleBag(e) {
        var order: number = parseInt($(e.currentTarget).attr('order'));
        _.each(Todos.item(order), todo => this.changeDoorStatus(todo));
    }
    
    tooltipTimeout: number = null;
    // Lazily show the tooltip that tells you to press `enter` to save
    // a new todo item, after one second.
    showTooltip(e) {
        var tooltip = $(".ui-tooltip-top");
        var val = this.input.val();
        tooltip.fadeOut();
        if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
        if (val == '' || val == this.input.attr('placeholder')) return;
        this.tooltipTimeout = _.delay(() => tooltip.show().fadeIn(), 1000);
    }

}

// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
    // Finally, we kick things off by creating the **App**.
    new AppView();
});