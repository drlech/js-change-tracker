export default class ChangeTracker {
    constructor(initial = {}) {
        // Initial value. Separately from changes, because we want to allow
        // changing the initial value without it being undoable/redoable.
        this._head = initial || {};

        // All changes made to the object.
        this._changes = [];

        // Marks at which point in changes we are.
        this._pointer = -1;
    }

    /**
     * Add new change.
     * If some previously added changes have been undoed, they will be lost.
     *
     * @param {string} path Dot-delimeted path within the object where the change
     *                      should be added.
     * @param {*} value Value to add.
     */
    add(path, value) {
        // There are some changes after the pointer. In that case, drop them
        // and start adding changes from the current point.
        if (this._pointer < this._changes.length - 1) {
            this._changes.splice(this._pointer + 1);
        }

        this._changes.push({ path, value });
        this._pointer++;
    }

    /**
     * Undo one change.
     */
    undo() {
        if (this._pointer > -1) {
            this._pointer--;
        }
    }

    /**
     * Redo one change.
     */
    redo() {
        if (this._pointer < this._changes.length - 1) {
            this._pointer++;
        }
    }
}