
function Validation(options) {

    var getAllRules = {};

    function validator(inputElement, rule, message) {

        var getTestRules = getAllRules[rule.select];
        var errorMessage;
        for(var getRule of getTestRules) {  
            errorMessage = getRule(inputElement.value)
            if(errorMessage) break;
        }

        
        if(errorMessage) {
            message.innerText = errorMessage;
            inputElement.classList.add('active');
        } else {
            message.innerText = '';
            inputElement.classList.remove('active');
        }
        return !errorMessage;
    }

    var formElement = document.querySelector(option.form);
    if(formElement) {
        options.rules.forEach((rule) => {

            if(Array.isArray(getAllRules[rule.select])) {
                getAllRules[rule.select].push(rule.test)
            } else {
                getAllRules[rule.select] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.select);
            var message = inputElement.parentElement.querySelector(option.message);

            if(inputElement) {
                inputElement.onblur = function () {
                    validator(inputElement, rule, message);
                }

                inputElement.oninput = function () {
                    message.innerText = '';
                    inputElement.classList.remove('active');
                }
            }
        })
    };

    formElement.onsubmit = function (e) {
        e.preventDefault();
        var isAllValid = true;
        options.rules.forEach((rule) => { 
            var inputElement = formElement.querySelector(rule.select);
            var message = inputElement.parentElement.querySelector(options.message);
            var isValid = validator(inputElement, rule, message);
            if(!isValid) {
                isAllValid = false;
            }
        });

        if(isAllValid) {
            var enableInputs = formElement.querySelectorAll('input[name]');
            var finalResult = Array.from(enableInputs).reduce((result, currValue) => {
                result[currValue.name] = currValue.value;
                return result;
            }, {})
            options.onSubmit(finalResult);
        } else {
            
        }
    }
}

Validation.isRequired = function (selection) {
    return {
        select: selection,
        test: function (value) {
            return value ? undefined : 'You must enter this field!'
        }
    }
}


Validation.isEmail = function (selection) {
    return {
        select: selection,
        test: function (value) {
            var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(value) ? undefined : 'Email is not valid!'


        }
    }
}

Validation.isPassword = function (selection, min) {
    return {
        select: selection,
        test: function (value) {
            return value.length >= min ? undefined : 'Password must to hacve at least 6 numbers!'
        }
    }
}

Validation.isrepeatPassword = function (selection, getPassword) {
    return {
        select: selection,
        test: function (value) {
            return value === getPassword() ? undefined : 'Passwords do not match!'
        }
    }
}