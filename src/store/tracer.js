const RECORD = "記錄中",
    UNDO = "復原",
    REDO = "取消復原";
let action = new WeakMap()
let records = new WeakMap()
let prevState = new WeakMap()
let fnUpdate = new WeakMap()

/**
 * undo redo managment
 */
export default class Tracer {
    constructor(states, update) {
        action.set(this, RECORD);
        records.set(this, []);
        fnUpdate.set(this, update)
        this.action = RECORD
        this.historyIndex = -1;
        this._listen(states);
    }
    _listen(states) {

        states.map(state => {
            if (action.get(this) != RECORD) {
                return;
            }
            let _prevState = prevState.get(this)
            prevState.set(this, state)

            if (state === _prevState) {
                return
            }

            const _records = records.get(this);
            _records.push(state);
            records.set(this, _records);
            this.historyIndex = _records.length - 1;
            return state;
        });
    }
    get stepBack() {
        return this.historyIndex > 0;
    }
    get stepForward() {
        const _records = records.get(this);
        return this.historyIndex < _records.length - 1;
    }
    undo() {
        if (this.historyIndex == 0) {
            return;
        }
        action.set(this, UNDO);
        this.historyIndex--;
        const _records = records.get(this);
        const prevObj = _records[this.historyIndex];
        if (prevObj) {
            const update = fnUpdate.get(this)
            update(() => prevObj);
        }
        action.set(this, RECORD);
    }
    redo() {
        const _records = records.get(this);
        if (this.historyIndex >= _records.length - 1) {
            return;
        }
        action.set(this, REDO);
        this.historyIndex++;
        const nextObj = _records[this.historyIndex];
        if (nextObj) {
            const update = fnUpdate.get(this)
            update(() => nextObj);
        }
        action.set(this, RECORD);
    }
}