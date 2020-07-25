import Validate from 'validate.js'
import {
    identityValidator
} from './validators'

/**
 * 基底Model
 */
export default class BaseModel {
    constructor(args) {
        this.errors = []
        this.loading = false
        this.data = []
        this.pageIndex = 1
        this.queryString = ''
        this.paging = {
            count: 0,
            no: 1,
            size: 0,
            total: 0
        }

    }

    identityValidator(value) {
        return identityValidator(value)
    }
    valid(field) {
        const rules = this.rules() || {}

        let error = Validate.single(this[field], rules[field])
        this.errors = this.errors || []
        this.errors[field] = error
        return error ? error[0] : null
    }
    hasError(field) {
        return (this.errors && this.errors[field]) ? this.errors[field][0] : null
    }
    validate() {
        const data = this
        const rules = this.rules() || {}

        this.errors = Validate(data, rules)
        return this.errors || false
    }

    /**
     * 設定model property 值
     * @param {objects} entity 
     */
    set(entity) {
        Object.keys(entity).map(key => {
            if (this.hasOwnProperty(key)) {
                this[key] = entity[key]
            }
        })
    }
    /**
     * 提供驗證規則
     */
    rules() {

    }
}