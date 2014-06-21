/// <reference path="backbone.d.ts"/>

// Todo Model
// ----------

// Our basic **Todo** model has `content`, `order`, and `done` attributes.
class Todo extends Backbone.Model {

    // Default attributes for the todo.
    defaults() {
        return {
            content: "Root ",
            done: false,
            level: 0,
            parentOrder: 0,
            order: 0,
            isOpen: true,
            childrenCount: 0
        }
    }

    // Ensure that each todo created has `content`.
    initialize() {
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
    }

    isDone(): boolean {
        return this.get("done");
    }

    getLevel() : number {
        return this.get("level");
    }

    getOrder(): number {
        return this.get("order");
    }

    getParentOrder(): number {
        return this.get("parentOrder");
    }

    isDoorOpen(): number {
        return this.get("isOpen");
    }

    toggleDoor() {
        this.save({ isOpen: !this.get("isOpen") });
    }

    setDoor(isDoorOpen: boolean) {
        this.save({ isOpen: isDoorOpen });
    }

    addChild() {
        var count: number = this.get("childrenCount");
        count++;
        this.save({ childrenCount: count });
    }

    removeChild() {
        var count: number = this.get("childrenCount");
        count--;
        this.save({ childrenCount: count });
    }

    hide() {
        this.save({ done: true });
    }

    show() {
        this.save({ done: false });
    }

    setStatus(isDone: boolean) {
        isDone ? this.hide() : this.show();
    }

   

    // Remove this Todo from *localStorage* and delete its view.
    clear() {
        this.destroy();
    }

}