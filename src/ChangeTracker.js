import addToObject from './addToObject';

export default class ChangeTracker {
    constructor(initial = {}) {
        // Initial value. Separately from changes, because we want to allow
        // changing the initial value without it being undoable/redoable.
        this.head = initial || {};

        // All changes made to the object.
        this._changes = [];

        // Marks at which point in changes we are.
        this._pointer = -1;

        // List of paths that don't create new change, but stack
        // when added consecutively.
        this.stacking = [];
    }

    /**
     * Add new change.
     * If some previously added changes have been undoed, they will be lost.
     *
     * @param {string} path Dot-delimeted path within the object where the change should be added.
     * @param {*} value Value to add.
     */
    add(path, value) {
        // There are some changes after the pointer. In that case, drop them
        // and start adding changes from the current point.
        if (this._pointer < this._changes.length - 1) {
            this._changes.splice(this._pointer + 1);
        }

        // Handle stacking changes.
        if (
            this._pointer > -1 &&
            path === this._changes[this._pointer].path &&
            this.stacking.indexOf(path) >= 0
        ) {
            this._changes[this._pointer].value = value;

            return;
        }

        this._changes.push({ path, value });
        this._pointer++;
    }

    /**
     * Stack values under a given path.
     *
     * @param {string} path Make values under that path stacking.
     */
    stack(path) {
        if (this.stacking.indexOf(path) === -1) {
            this.stacking.push(path);
        }
    }

    /**
     * Stop stacking values under a given path.
     *
     * @param {string} path Stop stacking values under that path.
     */
    stopStacking(path) {
        const position = this.stacking.indexOf(path);
        if (position >= 0) {
            this.stacking.splice(position, 1);
        }
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

    /**
     * Retrieve the final version of the object, composed of all
     * the changes added along the way.
     */
    getFinal() {
        if (this._pointer < 0) {
            return this.head;
        }

        // We don't want to modify the initial value!
        const final = JSON.parse(JSON.stringify(this.head));

        for (let i = 0; i <= this._pointer; i++) {
            const change = this._changes[i];
            addToObject(final, change.path, change.value);
        }

        return final;
    }
}