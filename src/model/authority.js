import m from 'mithril'

let _role = []
export default class Authority {
    constructor(args) {
        args = (args) ? args : {}
        this.role = args.role || {}
    }

    static set role(value) {
        return _role = value
    }
}