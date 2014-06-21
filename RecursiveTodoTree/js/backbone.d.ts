/// <reference path="jquery.d.ts"/>

declare module Backbone {
    export class Model {
        constructor(attr?, opts?);
        get(name: string): any;
        set(name: string, val: any): void;
        set(obj: any): void;
        save(attr?, opts?): void;
        destroy(): void;
        bind(ev: string, f: Function, ctx?: any): void;
        toJSON(): any;
    }
    export class Collection<T> {
        constructor(models?, opts?);
        bind(ev: string, f: Function, ctx?: any): void;
        length: number;
        create(attrs, opts?): any;
        each(f: (elem: T) => void): void;
        fetch(opts?: any): void;
        last(): T;
        last(n: number): T[];
        filter(f: (elem: T) => boolean): T[];
        without(...values: T[]): T[];
    }
    export class View {
        constructor(options?);
        $(selector: string): JQuery;
        el: HTMLElement;
        $el: JQuery;
        model: Model;
        remove(): void;
        delegateEvents: any;
        make(tagName: string, attrs?, opts?): View;
        setElement(element: HTMLElement, delegate?: boolean): void;
        setElement(element: JQuery, delegate?: boolean): void;
        tagName: string;
        events: any;

        static extend: any;
    }
}