/// <reference path="backbone.d.ts"/>
/// <reference path="todo.ts"/>

// Todo Collection
// ---------------

// The collection of todos is backed by *localStorage* instead of a remote
// server.
class TodoList extends Backbone.Collection<Todo> {

    // Reference to this collection's model.
    model = Todo;

    // Save all of the todo items under the `"todos"` namespace.
    localStorage = new Store("todos-backbone");

    // Filter down the list of all todo items that are finished.
    done() {
        return this.filter(todo => todo.get('done'));
    }

    // Filter down the list to only todo items that are still not finished.
    remaining() {
        return this.without.apply(this, this.done());
    }

    // Filter down the list of all todo items that are children.
    childrensOf(parentOrder) {
        return this.filter(todo => todo.get('parentOrder') === parentOrder );
    }

    item(order) {
        return this.filter(todo => todo.get('order') === order);
    }

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder() {
        if (!this.length) return 1;
        return this.last().get('order') + 1;
    }

    // Todos are sorted by their original insertion order.
    comparator(todo: Todo) {
        return todo.get('order');
    }

}