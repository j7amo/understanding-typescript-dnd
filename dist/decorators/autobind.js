// let's create an AutoBind Decorator just to make sure that we won't lose 'this' binding when we work with DOM (say hello to eventListeners)
export function AutoBind(_, // '_' and '_2' give TS a hint that we don't use these arguments
_2, propDescriptor) {
    const originalMethod = propDescriptor.value;
    return {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this);
        },
    };
}
//# sourceMappingURL=autobind.js.map