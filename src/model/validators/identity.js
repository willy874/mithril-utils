import Validate from 'validate.js'

export const identityValidator = (value) => {
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
}

Validate.validators.identityROC = (value, options, key, attributes) => {
    const valid = identityValidator(value)
    return (valid) ? undefined : options.message
};