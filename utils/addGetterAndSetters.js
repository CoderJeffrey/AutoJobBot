// utils/addGettersSetters.js
function addGettersSetters(targetClass, properties) {
    properties.forEach(property => {
        Object.defineProperty(targetClass.prototype, property, {
            get() {
                return this[`_${property}`];
            },
            set(value) {
                this[`_${property}`] = value;
            },
            enumerable: true,
            configurable: true
        });
    });
}

module.exports = addGettersSetters;
