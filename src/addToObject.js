export default function addToObject(object, path, value) {
    const fragments = path.split('.');
    let pointer = object;

    for (let i = 0; i < fragments.length - 1; i++) {
        const fragment = fragments[i];

        if (typeof pointer[fragment] === 'undefined') {
            pointer[fragment] = {};
        }

        const isValidIndex = !!fragment.match(/\d+/);
        if (Array.isArray(pointer)) {
            if (!isValidIndex) {
                throw new Error('Array can only be accessed via numeric index.');
            }

            if (parseInt(fragment) > pointer.length) {
                throw new Error('Index out of range.');
            }
        }

        pointer = pointer[fragment];
    }

    const lastFragment = fragments[fragments.length - 1];
    pointer[lastFragment] = value;
}