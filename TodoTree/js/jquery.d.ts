
interface JQuery {
    fadeIn(): JQuery;
    fadeOut(): JQuery;
    focus(): JQuery;
    html(): string;
    html(val: string): JQuery;
    show(): JQuery;
    addClass(className: string): JQuery;
    removeClass(className: string): JQuery;
    append(el: HTMLElement): JQuery;
    val(): string;
    val(value: string): JQuery;

    attr(attributeName: string): string;
    attr(attributeName: string, func: (index: any, attr: any) => any): JQuery;
    attr(attributeName: string, value: any): JQuery;
    attr(map: { [key: string]: any; }): JQuery;

    hasClass(className: string): boolean;

    css(e: any, propertyName: string, value?: any): any;
    css(e: any, propertyName: any, value?: any): any;

    after(func: (index: any) => any): JQuery;
    after(...content: any[]): JQuery;
    before(func: (index: any) => any): JQuery;
    before(...content: any[]): JQuery;
}
declare var $: {
    (el: HTMLElement): JQuery;
    (selector: string): JQuery;
    (readyCallback: () => void): JQuery;
};
declare var _: {
    each<T, U>(arr: T[], f: (elem: T) => U): U[];
    delay(f: Function, wait: number, ...arguments: any[]): number;
    template(template: string): (model: any) => string;
    bindAll(object: any, ...methodNames: string[]): void;
};
declare var Store: any;