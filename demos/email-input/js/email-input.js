(function() {

    function isElementOrTxt(element) {
        return element instanceof Element || element instanceof HTMLDocument || typeof element === 'string';
    }

    function isElement(element) {
        return element instanceof Element || element instanceof HTMLDocument || typeof element === 'string';
    }

    function addEventLister($elm, eventType, cb) {
        if ($elm.addEventListener) { // For all major browsers, except IE 8 and earlier
            $elm.addEventListener(eventType, cb);
        } else if ($elm.attachEvent) { // For IE 8 and earlier versions
            $elm.attachEvent("on" + eventType, cb);
        }
    }

    function isValidateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Create Dom elments
    function createElm(metedata) {

        // if it is an dom element alredy, return as it is
        if (!metedata || isElementOrTxt(metedata)) {
            return metedata;
        }

        var $elm = document.createElement(metedata.elmType);

        // Add attrs
        if (metedata.attrs) {
            for (var i in metedata.attrs) {
                $elm.setAttribute(i, metedata.attrs[i]);
            }
        }

        // add text
        if (metedata.text) $elm.innerText = metedata.text;

        // add inner elemts recursively 
        if (metedata.children) {
            for (var i in metedata.children) {
                var chaild = createElm(metedata.children[i]);
                chaild && $elm.append(chaild);
            }
        }

        //TODO : Event handlers

        return $elm;
    }

    function constructEmailInput($containerElm, $header, $footer) {

        // Check if valid container node/dom elemet
        if (!$containerElm || !isElement($containerElm)) {
            console.warn('EmailsInput : Valid Container Node should be passed');
        }

        // Input Element
        var $input = createElm({
            elmType: 'input',
            attrs: {
                placeholder: 'add new email...',
                class: 'email-input'
            }
        });

        // Email list wrapper
        var $emailList = createElm({
            elmType: 'ul',
            attrs: {
                class: 'email-input-list'
            }
        });

        var emailList = {};

        // Close icon component
        function closeEmailIcon(id) {
            var $close = createElm({
                elmType: 'a',
                attrs: {
                    class: 'email-close-icon',
                    href: 'javascript:void(0)',
                    title: 'remove',
                    "data-id": id
                },
                text: 'x'
            });
            addEventLister($close, 'click', function(e) {
                // Todo : Future usecase - 'Model - "are you sure you wanna remove this email id?", may be configurable - true or false'
                delete emailList[$close.getAttribute('data-id')];
                $close.parentNode.remove();
            });
            return $close;
        }

        // Email list item component
        function emailElm(email) {
            var $email = createElm({
                elmType: 'li',
                attrs: {
                    class: ('email ' + (email.isValid ? 'valid-email' : 'invalid-email'))
                },
                text: email.val,
                children: [
                    closeEmailIcon(email.id)
                ]
            });
            return $email;
        }

        function addEmailElmToEmailList(email) {
            $emailList.append(emailElm(email));
        }

        function addInputValueToListClearInput(val) {
            var inputVal = val || $input.value;
            if (!inputVal) return;
            var id = String(new Date().getTime());
            emailList[id] = {
                val: inputVal,
                id: id,
                isValid: isValidateEmail(inputVal) // need to add validation rule
            };
            addEmailElmToEmailList(emailList[id]);
            $input.value = '';
            $input.focus();
        }

        function getEmailListCount() {
            // TODO - for better performance, We can add Count attr to emailList and update while addition and deletion, so that we may just return Count instrad of calculating
            return Object.keys(emailList).length;
        }

        var $core = createElm({
            elmType: 'div',
            attrs: {
                class: 'email-core'
            },
            children: [
                $emailList,
                $input
            ]
        });

        // Event bindings - Add email list
        addEventLister($input, 'keydown', function(e) {
            // Enter, comma, semi-colon	
            if (['13', '188', '186'].indexOf(String(e.keyCode)) !== -1) {
                addInputValueToListClearInput();
                e.preventDefault();
            }
        })

        addEventLister($input, 'blur', function(e) {
            addInputValueToListClearInput();
        });

        addEventLister($input, 'paste', function(e) {
            var pastedTxt = (e.clipboardData || window.clipboardData).getData('text');
            if (pastedTxt) {
                var emailListPasted = pastedTxt.split(',');
                for (var i in emailListPasted) {
                    var emailVal = emailListPasted[i].trim();
                    emailVal && addInputValueToListClearInput(emailVal);
                }
            }
            e.preventDefault();
        });

        // Shift focus to input on click of email core
        addEventLister($core, 'click', function() {
            $input.focus();
        });


        $containerElm.append(
            createElm({
                elmType: 'div',
                attrs: {
                    class: 'email-input-wrapper'
                },
                children: [
                    $header,
                    $core,
                    $footer
                ]
            })
        );

        return {
            container: $containerElm,
            list: emailList,
            addEmail: addInputValueToListClearInput,
            getEmailListCount: getEmailListCount
        };

    }
    // Check if EmailsInput is not already avaible in window object before adding it
    if (!window.EmailsInput) {
        window.EmailsInput = function($cntElm, $header, $footer) {
            return constructEmailInput($cntElm, $header, $footer);
        }
    }
})();
