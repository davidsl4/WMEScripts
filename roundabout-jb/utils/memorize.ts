export default function memorize(fn) {
    let cache = {};
    return function(...args) {
        let key = JSON.stringify(args);
        if (!(key in cache)) {
            cache[key] = fn.apply(this, args);
        }
        return cache[key];
    };
}