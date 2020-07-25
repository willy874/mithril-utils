import classNames from 'classnames/bind'
import uuid from 'uuid'
import style from './styled/style.css'
const cx = classNames.bind(style)

const requests = []
/**
 * ajax 呼叫,loading動畫icon
 * @param {*} logout 401登出路徑
 */
export function AjaxLoader(logout) {
    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (value) {

        this.addEventListener("loadstart", function (e) {
            requests.push(uuid())
            const loading = document.querySelector(`.${cx('ajax_loader')}`)
            if (loading === null) {
                const backdrop = document.createElement('div')
                backdrop.classList.add(`${cx('ajax-loader-backdrop')}`)
                const wrapper = document.createElement('div')
                const icon = document.createElement('div')
                wrapper.classList.add(`${cx('ajax_loader')}`)
                icon.classList.add(`${cx('ajax_loader_icon')}`)
                wrapper.appendChild(icon)
                document.body.appendChild(wrapper)
                document.body.appendChild(backdrop)
            }
        }, false);
        /**
         * 使用alert時,會中斷script, 造成loadend失效 
         */
        this.addEventListener('loadend', (e) => {
            requests.pop()
            if (requests.length > 0) {
                return false
            }
            setTimeout(() => {
                const backdrop = document.querySelector(`.${cx('ajax-loader-backdrop')}`)
                const loading = document.querySelector(`.${cx('ajax_loader')}`)
                if (loading === null) {
                    return false
                }
                loading.classList.add(`${cx('exit')}`)
                loading.remove()
                backdrop.remove()
            }, 0)

            if (e.currentTarget.status === 401) {
                window.location.href = logout
            }
        }, false);
        this.realSend(value);
    };
}