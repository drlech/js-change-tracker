/**
 * Add a value to the plain object, at any level (not necessarily the top).
 * If the path doesn't exist in the object, entire path will be created.
 * If the path exists, the existing value will be replaced.
 *
 * The function is also able to replace array values. The requirement is that
 * part of the path where there's array needs to be numeric, and given index
 * needs to exist in the array.
 *
 * This function modifies the object.
 *
 * @param {object} object Object to insert value into.
 * @param {string} path Dot-delimeted path to insert the value to.
 * @param {*} value Value to insert.
 */
export default function addToObject(object, path, value) {
    const fragments = path.split('.');
    let pointer = object;

    // Processing all except the last part of the path, because the final
    // element at the end of the path will likely be a primitive value,
    // so if we assign it to pointer, we'll just make a copy of it instead
    // of remembering the reference.
    for (let i = 0; i < fragments.length - 1; i++) {
        const fragment = fragments[i];

        // Property specified in path doesn't exist.
        // Insert a plain object, because we'll potentially want to
        // add more properties to it.
        if (typeof pointer[fragment] === 'undefined') {
            pointer[fragment] = {};
        }

        // To access array the path fragment must be numeric,
        // and given index must exist within the array.
        const isValidIndex = !!fragment.match(/\d+/);
        if (Array.isArray(pointer)) {
            if (!isValidIndex) {
                throw new Error('Array can only be accessed via numeric index.');
            }

            if (parseInt(fragment) > pointer.length) {
                throw new Error('Index out of range.');
            }
        }

        // Go one level deeper.
        pointer = pointer[fragment];
    }

    const lastFragment = fragments[fragments.length - 1];
    pointer[lastFragment] = value;
}