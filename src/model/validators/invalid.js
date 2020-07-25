import Validate from 'validate.js'

/**
 * 客製化驗證規則
 */
Validate.validators.invalid = (value, options, key, attributes) => {
    return options.message
}