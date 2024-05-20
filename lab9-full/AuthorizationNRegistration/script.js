document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('defaultOpen').addEventListener('click', function () {
        openTab('Login');
    });

    document.getElementById('defaultOpen').nextElementSibling.addEventListener('click', function () {
        openTab('Signup');
    });

    document.getElementById('loginForm').addEventListener('submit', loginUser);
    document.getElementById('signupForm').addEventListener('submit', registerUser);

    document.getElementById('togglePswLogin').addEventListener('click', function () {
        togglePasswordVisibility('psw_login');
    });

    document.getElementById('toggleNewPsw').addEventListener('click', function () {
        togglePasswordVisibility('new_psw');
    });

    document.getElementById('toggleConfirmPsw').addEventListener('click', function () {
        togglePasswordVisibility('confirm_psw');
    });

    let inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            resetInputValidationStyles(input);
        });
    });

    document.getElementById('defaultOpen').click();
});

function openTab(tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).className += " active";
}

function togglePasswordVisibility(inputId) {
    let x = document.getElementById(inputId);
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function registerUser(event) {
    event.preventDefault();

    let new_uname = document.getElementById('new_uname');
    let new_email = document.getElementById('email');
    let new_psw = document.getElementById('new_psw');
    let confirm_psw = document.getElementById('confirm_psw');
    let loader = document.getElementById('loader');
    let newUnameError = document.getElementById('newUnameError');
    let emailError = document.getElementById('emailError');
    let confirmPswError = document.getElementById('confirmPswError');

    resetValidationStyles();

    let isValid = true;

    //Перевірки
    if (localStorage.getItem(new_uname.value) !== null) {
        showError('Користувач з таким іменем вже існує.', newUnameError);
        new_uname.classList.add('invalid');
        isValid = false;
    } else {
        new_uname.classList.add('valid');
    }


    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let user = JSON.parse(localStorage.getItem(key));
        if (user.email === new_email.value) {
            showError('Користувач з таким email вже існує.', emailError);
            new_email.classList.add('invalid');
            isValid = false;
            break;
        }
    }

    if (isValid) {
        new_email.classList.add('valid');
    }

    if (new_uname.value.length < 3) {
        showError('Логін має містити не менше 3 символів.', newUnameError);
        new_uname.classList.add('invalid');
        isValid = false;
    } else {
        new_uname.classList.add('valid');
    }

    if (!validateEmail(new_email.value)) {
        showError('Невірний email.', emailError);
        new_email.classList.add('invalid');
        isValid = false;
    } else {
        new_email.classList.add('valid');
    }

    if (new_psw.value.length < 6) {
        showError('Пароль має містити не менше 6 символів.', confirmPswError);
        new_psw.classList.add('invalid');
        confirm_psw.classList.add('invalid');
        isValid = false;
    } else {
        new_psw.classList.add('valid');
    }

    if (new_psw.value !== confirm_psw.value) {
        showError('Паролі не співпадають.', confirmPswError);
        new_psw.classList.add('invalid');
        confirm_psw.classList.add('invalid');
        isValid = false;
    } else {
        confirm_psw.classList.add('valid');
    }

    if (!isValid) return false;

    //regLoader
    loader.style.display = 'block';
    setTimeout(function () {
        loader.style.display = 'none';
       alert('Реєстрація прошла успішно! ⭐');
        resetValidationStyles();
        document.getElementById('signupForm').reset();
        document.getElementsByClassName('tablinks')[0].click();
    }, 1500);

    localStorage.setItem(new_uname.value, JSON.stringify({email: new_email.value, password: new_psw.value}));
    return false;
}


function loginUser(event) {
    event.preventDefault();
    let uname_login = document.getElementById('uname_login');
    let psw_login = document.getElementById('psw_login');
    let unameError = document.getElementById('unameError');
    let loader = document.getElementById('loader');
    resetValidationStyles();

    let isValid = true;
    let storedData = JSON.parse(localStorage.getItem(uname_login.value));

    //Перевірки
    if (!storedData || psw_login.value !== storedData.password) {
        showError('Неправильне ім\'я користувача або пароль.', unameError);
        uname_login.classList.add('invalid');
        psw_login.classList.add('invalid');
        isValid = false;
    } else {
        uname_login.classList.add('valid');
        psw_login.classList.add('valid');
    }

    if (!isValid) return false;

    //logLoader
    loader.style.display = 'block';
    setTimeout(function () {
        loader.style.display = 'none';
        alert('Успішний вхід! ⭐');
        resetValidationStyles();
        window.location.href = '../Social Network Friend Search/index.html';
        document.getElementById('loginForm').reset();
    }, 1500);

    document.getElementById('loginForm').reset();
    return false;
}

function showError(message, element) {
    element.textContent = message;
}

function resetValidationStyles() {
    let inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
    });

    let errors = document.querySelectorAll('.error');
    errors.forEach(error => {
        error.textContent = '';
    });
}

function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function resetInputValidationStyles(input) {
    input.classList.remove('valid', 'invalid');
    let errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error')) {
        errorElement.textContent = '';
    }
}
