const classMethods = [
    "constructor",
    "initial",
    "defaultActions",
    "actions"
];

/**
 * 基本狀態class,提供state class繼承使用
 */
export default class BaseState {
    constructor() {
        if (this.initial === undefined) {
            throw new TypeError("必須覆寫初始值initial");
        }
    }
    actions(update, states) {
        return this._decorate(update, states);
    }
    _decorate(update, states) {
        this.update = update;
        this.states = states
        let _actions = {}

        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            if (this._checkMethod(this, name)) {
                _actions[name] = this[name].bind(this);
            }
        }

        return Object.assign({}, _actions);
    }

    _checkMethod(obj, name) {
        let method = obj[name];
        // 略過不加入action的方法
        if (!(method instanceof Function) || classMethods.includes(name) || /_\w+/g.test(name)) {
            return false;
        }
        return true
    }

}