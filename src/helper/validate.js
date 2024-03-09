export async function validateRegisterForm(values) {
    const errors = {}
    nameVerify(errors, values)
    emailVerify(errors, values)
    passwordVerify(errors, values)

    return errors
}

export async function validateLoginForm(values) {
    const errors = {}
    emailVerify(errors, values)
    passwordVerify(errors, values)

    return errors
}

export async function validateAddProjectForm(values) {
    const errors = {}
    nameVerify(errors, values)
    budgetVerify(errors, values)
    dateVerify(errors, values)

    return errors
}

/** ************************ Verify Function ************************* */

function nameVerify(errors, values) {
    if (!values.name?.trim()) {
        errors.name = 'Name is Required...!'
    }

    return errors;
}

function emailVerify(errors, values) {
    if (!values.email?.trim()) {
        errors.email = 'Email is Required...!'
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) || values.email.trim().includes(" ")) {
        errors.email = "Invalid Email address...!"
    }
    
    
    return errors;
}

function passwordVerify(errors, values) {
    if (!values.password?.trim()) {
        errors.password = 'Password is Required...!'
    }
    else if (values.password.includes(" ")) {
        errors.password = "Password should not containe space"
    }
    else if (values.password.length < 6) {
        errors.password = "Password length must be atleast 6 "
    }
    
    return errors;
}

function budgetVerify(errors, values) {
    if (!values.budget?.trim()) {
        errors.budget = 'Budget is Required...!'
    }

    return errors;
}

function dateVerify(errors, values) {
    if (!values.start) {
        errors.start = 'Date is Required...!'
    }

    return errors;
}

function phoneVerify(errors, values) {
    let pattern = "(?:\\+88|88)?(01[3-9]\\d{8}$)"
    if (!values.phone?.trim()) {
        errors.phone = 'Phone Number is Required...!'
    }
    else if (!values.phone.match(pattern)) {
        errors.phone = "Invalid Phone Number"
    }

    return errors;
}
