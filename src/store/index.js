import stream from "mithril/stream"
import BaseState from './base'
import Tracer from "./tracer"


/**
 * 應用程式狀態管理
 * @param {*} app 主要應用程式
 * @param {*} tracing 操作歷史記錄
 */
function CreateStore(app, tracing) {
    const update = stream();
    const _app = new app();
    const states = stream.scan(
        (state, patch) => patch(state),
        _app.initial(),
        update
    );

    let tracer
    if (tracing) {
        tracer = new Tracer(states, update)
    }

    return {
        states,
        actions: _app.actions(update, states),
        tracer: tracer
    };
}

export {
    BaseState,
    CreateStore,
    Tracer
}