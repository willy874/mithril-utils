'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var classNames = _interopDefault(require('classnames/bind'));
var uuid = _interopDefault(require('uuid'));
var stream = _interopDefault(require('mithril/stream'));
var Validate = _interopDefault(require('validate.js'));
var moment = _interopDefault(require('moment'));

var style = {"ajax-loader-backdrop":"PIjFr","ajax_loader":"L2tl2","exit":"_2KXVR","ajax_loader_out":"_3YnIv","ajax_loader_icon":"_2bLd4","ajax_loader_in":"_1Ifa_"};

const cx = classNames.bind(style);

const requests = [];
/**
 * ajax 呼叫,loading動畫icon
 * @param {*} logout 401登出路徑
 */
function AjaxLoader(logout) {
    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (value) {

        this.addEventListener("loadstart", function (e) {
            requests.push(uuid());
            const loading = document.querySelector(`.${cx('ajax_loader')}`);
            if (loading === null) {
                const backdrop = document.createElement('div');
                backdrop.classList.add(`${cx('ajax-loader-backdrop')}`);
                const wrapper = document.createElement('div');
                const icon = document.createElement('div');
                wrapper.classList.add(`${cx('ajax_loader')}`);
                icon.classList.add(`${cx('ajax_loader_icon')}`);
                wrapper.appendChild(icon);
                document.body.appendChild(wrapper);
                document.body.appendChild(backdrop);
            }
        }, false);
        /**
         * 使用alert時,會中斷script, 造成loadend失效 
         */
        this.addEventListener('loadend', (e) => {
            requests.pop();
            if (requests.length > 0) {
                return false
            }
            setTimeout(() => {
                const backdrop = document.querySelector(`.${cx('ajax-loader-backdrop')}`);
                const loading = document.querySelector(`.${cx('ajax_loader')}`);
                if (loading === null) {
                    return false
                }
                loading.classList.add(`${cx('exit')}`);
                loading.remove();
                backdrop.remove();
            }, 0);

            if (e.currentTarget.status === 401) {
                window.location.href = logout;
            }
        }, false);
        this.realSend(value);
    };
}

const classMethods = [
    "constructor",
    "initial",
    "defaultActions",
    "actions"
];

/**
 * 基本狀態class,提供state class繼承使用
 */
class BaseState {
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
        this.states = states;
        let _actions = {};

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

const RECORD = "記錄中",
    UNDO = "復原",
    REDO = "取消復原";
let action = new WeakMap();
let records = new WeakMap();
let prevState = new WeakMap();
let fnUpdate = new WeakMap();

/**
 * undo redo managment
 */
class Tracer {
    constructor(states, update) {
        action.set(this, RECORD);
        records.set(this, []);
        fnUpdate.set(this, update);
        this.action = RECORD;
        this.historyIndex = -1;
        this._listen(states);
    }
    _listen(states) {

        states.map(state => {
            if (action.get(this) != RECORD) {
                return;
            }
            let _prevState = prevState.get(this);
            prevState.set(this, state);

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
            const update = fnUpdate.get(this);
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
            const update = fnUpdate.get(this);
            update(() => nextObj);
        }
        action.set(this, RECORD);
    }
}

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

    let tracer;
    if (tracing) {
        tracer = new Tracer(states, update);
    }

    return {
        states,
        actions: _app.actions(update, states),
        tracer: tracer
    };
}

const identityValidator = (value) => {
    const a = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'W', 'Z', 'I', 'O');
    const b = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
    const c = new Array(2);

    let d, e, f, g = 0,
        h = /^[a-z](1|2)\d{8}$/i;

    if (value.search(h) == -1) {
        return false;
    } else {
        d = value.charAt(0).toUpperCase();
        f = value.charAt(9);
    }
    for (let i = 0; i < 26; i++) {
        if (d == a[i]) //a==a
        {
            e = i + 10; //10
            c[0] = Math.floor(e / 10); //1
            c[1] = e - (c[0] * 10); //10-(1*10)
            break;
        }
    }
    for (let i = 0; i < b.length; i++) {
        if (i < 2) {
            g += c[i] * b[i];
        } else {
            g += parseInt(value.charAt(i - 1)) * b[i];
        }
    }
    if ((g % 10) == f) {
        return true;
    }
    if ((10 - (g % 10)) != f) {
        return false;
    }
    return true;
};

Validate.validators.identityROC = (value, options, key, attributes) => {
    const valid = identityValidator(value);
    return (valid) ? undefined : options.message
};

/**
 * 客製化驗證規則
 */
Validate.validators.invalid = (value, options, key, attributes) => {
    return options.message
};

Validate.extend(Validate.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: (value, options) => {
        return +moment.utc(value);
    },
    // Input is a unix timestamp
    format: (value, options) => {
        var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return moment.utc(value).format(format);
    }
});

/**
 * 基底Model
 */
class BaseModel {
    constructor(args) {
        this.errors = [];
        this.loading = false;
        this.data = [];
        this.pageIndex = 1;
        this.queryString = '';
        this.paging = {
            count: 0,
            no: 1,
            size: 0,
            total: 0
        };

    }

    identityValidator(value) {
        return identityValidator(value)
    }
    valid(field) {
        const rules = this.rules() || {};

        let error = Validate.single(this[field], rules[field]);
        this.errors = this.errors || [];
        this.errors[field] = error;
        return error ? error[0] : null
    }
    hasError(field) {
        return (this.errors && this.errors[field]) ? this.errors[field][0] : null
    }
    validate() {
        const data = this;
        const rules = this.rules() || {};

        this.errors = Validate(data, rules);
        return this.errors || false
    }

    /**
     * 設定model property 值
     * @param {objects} entity 
     */
    set(entity) {
        Object.keys(entity).map(key => {
            if (this.hasOwnProperty(key)) {
                this[key] = entity[key];
            }
        });
    }
    /**
     * 提供驗證規則
     */
    rules() {

    }
}

/**
 * 瀏覽器OS判斷
 */
function isMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

/**
 * 圖片placeholder
 * @param {*} options width, height
 */
function Holder(options) {
    options.fontSize = (options.fontSize) ? options.fontSize : 12;
    const svg = `<svg width="${options.width}" height="${options.height}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${options.width}" height="${options.height}" style="fill:#dedede;"/><text x="50%" y="50%" font-size="${options.fontSize}" text-anchor="middle" alignment-baseline="middle" font-family="monospace, sans-serif" fill="#535353">${options.width}x${options.height}</text></svg>`;
    const encodedData = window.btoa(svg);
    return `data:image/svg+xml;base64,${encodedData}`

}

exports.AjaxLoader = AjaxLoader;
exports.BaseModel = BaseModel;
exports.BaseState = BaseState;
exports.CreateStore = CreateStore;
exports.ImagePlaceHolder = Holder;
exports.Tracer = Tracer;
exports.isMobile = isMobile;
