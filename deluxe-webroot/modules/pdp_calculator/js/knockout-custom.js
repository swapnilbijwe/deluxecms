; (function () {
    // ko custom bindings

    // The binding causes the associated DOM element to display the HTML specified by parameter.
    // Parameter could be string HTML, jquery object (fragment).
    ko.bindingHandlers.jqHtml = {
        update: function (element, valueAccessor) {
            var html = ko.utils.unwrapObservable(valueAccessor());
            if (html) {
                $(element).html(html);
            } else {
                $(element).empty();
            }
        }
    };
    // The visible binding causes the associated DOM element to become hidden or visible according to the value you pass to the binding.
    ko.bindingHandlers.hidden = {
        update: function (element, valueAccessor) {
            ko.bindingHandlers.visible.update(element, function () {
                return !ko.utils.unwrapObservable(valueAccessor());
            });
        }
    };
    // The visible binding causes the associated DOM element to become "isLoading" hidden or visible according to the value you pass to the binding.
    ko.bindingHandlers.loading = {
        update: function (element, valueAccessor) {
            var isLoading = ko.utils.unwrapObservable(valueAccessor());
            if (isLoading) {
                $(element).isLoading();
            } else {
                $(element).isLoading("hide");
            }
        }
    };
    // The enterkey binding adds an event handler so that your chosen JavaScript function will be invoked when the associated DOM element is "Enter" key pressed.
    ko.bindingHandlers.enterkey = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var allBindings = allBindingsAccessor();
            $(element).keypress(function (event) {
                var keyCode = (event.which ? event.which : event.keyCode);
                if (keyCode === 13) {
                    allBindings.enterkey.call(viewModel, viewModel, event);
                    return false;
                }
                return true;
            });
        }
    };
    // Format currency.
    ko.bindingHandlers.currency = {
        includeSymbol: true,
        symbol: ko.observable('$'),
        update: function(element, valueAccessor, allBindingsAccessor) {
            return ko.bindingHandlers.text.update(element, function() {
                var value = +(ko.utils.unwrapObservable(valueAccessor()) || 0),
                    options = allBindingsAccessor(),
                    includeSymbol = options.includeSymbol == undefined
                        ? ko.bindingHandlers.currency.includeSymbol
                        : options.includeSymbol,
                    symbol = includeSymbol
                                ? (ko.utils.unwrapObservable(options.symbol
                                    ? options.symbol
                                    : ko.bindingHandlers.currency.symbol))
                                : '';
                return symbol + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            });
        }
    };
    // Binding allows KO know that we will take care of managing the bindings of our children.
    ko.bindingHandlers.stopBinding = {
        init: function () {
            return { controlsDescendantBindings: true };
        }
    };
    // Binding for jQuery UI Dialogs
    ko.bindingHandlers.dialog = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var options = $.extend({
                autoOpen: false,
                closeText: 'close',
                dialogClass: 'dialog-wrapper',
                modal: true,
                width: 'auto'
            }, ko.utils.unwrapObservable(valueAccessor()) || {});

            // do in a setTimeout, so the applyBindings doesn't bind twice from element being copied and moved to bottom
            // UI Dialog specific
            setTimeout(function () {
                var allBindings = allBindingsAccessor(),
                shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible);

                $(element)
                    .dialog(options)
                    .on('dialogclose', function () {
                        allBindings.dialogVisible(false);
                    })
                    .dialog(shouldBeOpen ? 'open' : 'close');

                if (ko.isObservable(allBindings.element)) {
                    allBindings.element(element);
                }
            }, 0);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).dialog('destroy');
            });
        },
        update: function(element, valueAccessor, allBindingsAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {},
                shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible),
                $el = $(element);

            // don't call open/close before initilization
            if ($el.data('uiDialog') || $el.data('dialog')) {
                $el
                    .dialog(options)
                    .dialog(shouldBeOpen ? 'open' : 'close')
                    .find('.arrow')
                    .removeClass()
                    .addClass('arrow arrow-top ' + (options.arrowCss || 'middle'));

                $(window)
                    .off('resize')
                    .on('resize', function () {
                        $el.dialog('option', 'position', options.position || $el.dialog('option', 'position'));
                    });
            }
        }
    };
    // Dialog position relative to click link.
    ko.bindingHandlers.dialogClick = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var originalFunction = valueAccessor(),
                newValueAccesssor = function() {
                    return function (viewModel, e) {
                        /// <param name="viewModel" type="Object">The view model.</param>
                        /// <param name="e" type="jQuery.Event">The event.</param>

                        var options = allBindingsAccessor(),
                            dialogElement;

                        if (typeof options.dialogElement == 'string' || options.dialogElement instanceof String) {
                            dialogElement = document.getElementById(options.dialogElement);
                        } else {
                            dialogElement = ko.utils.unwrapObservable(options.dialogElement);
                        }

                        if (dialogElement) {
                            $(dialogElement).dialog({
                                position: $.extend({
                                    of: e.target,
                                    collision: 'none none'
                                }, $.isPlainObject(options.position) ? options.position : {})
                            });
                        }

                        originalFunction.apply(viewModel, arguments);
                    }
                }

            ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, viewModel, bindingContext);
        }
    };
    // Toggles (or negates) a boolean observable
    ko.bindingHandlers.toggle = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            ko.applyBindingsToNode(element, {
                click: function () {
                    value(!value());
                }
            });
        }
    };
    // address list dialog
    ko.bindingHandlers.addressBook = {
        init: function (element, valueAccessor) {
            /// <summary>
            /// Initializes address book widget.
            /// </summary>
            /// <param name="element" type="HTMLElement" domElement="true">The DOM element.</param>
            /// <param name="valueAccessor" type="function"></param>

            var options = valueAccessor();
            $(element).addressListDialog(options);
        }
    };
    // binding for shipping dropdown
    ko.bindingHandlers.shippingSelect = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var shipMethods = ko.utils.unwrapObservable(valueAccessor()),
                $valueDiv = $('<div>', { 'class': 'value' }).append($('<span>'), $('<span>'), $('<span>')),
                $arrowDiv = $('<div>', { 'class': 'arrow' }),
                $optionsDiv = $('<div>', { 'class': 'options' });

            $(element)
                .addClass('pseudo-select')
                .append($valueDiv, $arrowDiv, $optionsDiv)
                .on('click', '.value, .arrow', function () {
                    $(this).parent('.pseudo-select').toggleClass('open');
                })
                .on('click', '.pseudo-option', function () {
                    var $this = $(this);
                    $this.parents('.pseudo-select').removeClass('open');
                    allBindingsAccessor().value($this.data('id'));
                });

            $(document).on('click', function (e) {
                if (!$(e.target).closest('.pseudo-select').length) {
                    $('.pseudo-select').removeClass('open');
                }
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var shipMethods = ko.utils.unwrapObservable(valueAccessor()),
                allBindings = allBindingsAccessor(),
                selectedMethodId,
                shipMethod,
                $el = $(element);

            if (shipMethods && shipMethods.length) {
                selectedMethodId = ko.utils.unwrapObservable(allBindings.value);
                shipMethod = ko.utils.arrayFirst(shipMethods, function (method) {
                    return method.Id == selectedMethodId;
                });

                if (!shipMethod) {
                    shipMethod = shipMethods[0];
                    allBindings.value(shipMethods[0].Id);
                }

                $el.find('.value')
                    .children('span:eq(0)').text(shipMethod.EstimatedArrivalDateShort)
                    .end()
                    .children('span:eq(1)').text(shipMethod.DisplayName)
                    .end()
                    .children('span:eq(2)').text(shipMethod.TotalCharges ? '$' + shipMethod.TotalCharges.toFixed(2) : 'Free');

                $el.find('.options')
                    .empty()
                    .append(
                        $.map(shipMethods, function (method) {
                            return $('<label>', { 'class': 'pseudo-option' })
                                .data('id', method.Id)
                                .append(
                                    $('<span>', { text: method.EstimatedArrivalDateShort }),
                                    $('<span>', { text: method.DisplayName }),
                                    $('<span>', { text: method.TotalCharges ? '$' + method.TotalCharges.toFixed(2) : 'Free' })
                                );
                        })
                    );
            }
        }
    }
    // binding for numeric
    ko.bindingHandlers.numeric = {
        init: function (element, valueAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor());
            $(element).numeric(options);
        }
    };
    // binding for pagination
    ko.bindingHandlers.pagination = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor());
            var allBindings = allBindingsAccessor();

            if (ko.isObservable(options.totalRecords)) {
                options.totalRecords.subscribe(function (newTotalRecords) {
                    $(element).paginationWidget().setTotalRecords(newTotalRecords);
                });
                options.totalRecords = ko.unwrap(options.totalRecords) || 0;
            }
            $(element).paginationWidget(options);
        }
    };

    // ko extenders

    ko.extenders.required = function (target, overrideMessage) {
        /// <summary>
        /// Validates observable is not blank.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="overrideMessage" type="String" optional="true">The error message.</param>
        /// <returns type="ko.observable">The extended observable.</returns>

        var errorId = 1,
            message = overrideMessage || "This field is required";

        return _applyValidation(target, errorId, message, "", function (newValue) {
            var normalizedVal = (typeof newValue == "undefined" || newValue === null ? "" : "" + newValue).replace(/\s/g, "");
            return normalizedVal.length == 0;
        });
    };
    ko.extenders.minLength = function (target, option) {
        /// <signature>
        /// <summary>
        /// Validates observable has minimum length.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="option" type="Number">The minimum number characters.</param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>
        /// <signature>
        /// <summary>
        /// Validates observable has minimum length.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="option" type="Object">
        /// <field name="minLength" type="Number">The minimum number characters.</field>
        /// <field name="message" type="String">The error message.</field>
        /// </param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>

        var errorId = 2,
            message = (typeof option === 'object' ? option.message : "") || "Please enter at least {0} characters.",
            minLength = typeof option === 'object' ? option.minLength : option;

        return _applyValidation(target, errorId, message, minLength, function (newValue) {
            var normalizedVal = (typeof newValue == "undefined" || newValue === null ? "" : "" + newValue).replace(/\s/g, "");
            return normalizedVal.length < minLength;
        });
    };
    ko.extenders.maxLength = function (target, option) {
        /// <signature>
        /// <summary>
        /// Validates observable has maximum length.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="option" type="Number">The maximum number characters.</param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>
        /// <signature>
        /// <summary>
        /// Validates observable has minimum length.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="option" type="Object">
        /// <field name="maxLength" type="Number">The maximum number characters.</field>
        /// <field name="message" type="String">The error message.</field>
        /// </param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>

        var errorId = 3,
            message = (typeof option === 'object' ? option.message : "") || "Please enter no more than {0} characters.",
            minLength = typeof option === 'object' ? option.maxLength : option;

        return _applyValidation(target, errorId, message, minLength, function (newValue) {
            var normalizedVal = (typeof newValue == "undefined" || newValue === null ? "" : "" + newValue).replace(/\s/g, "");
            return normalizedVal.length > minLength;
        });
    };
    ko.extenders.pattern = function (target, option) {
        /// <signature>
        /// <summary>
        /// Validates observable is in proper format.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="option" type="RegExp">The pattern.</param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>
        /// <signature>
        /// <summary>
        /// Validates observable has minimum length.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="option" type="Object">
        /// <field name="pattern" type="RegExp">The pattern.</field>
        /// <field name="message" type="String">The error message.</field>
        /// </param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>

        var errorId = 4,
            message = (typeof option === 'object' ? option.message : "") || "Please enter no more than {0} characters.",
            pattern = typeof option === 'object' ? option.pattern : option;

        return _applyValidation(target, errorId, message, minLength, function (newValue) {
            return !(newValue || "").toString().match(pattern);
        });
    };
    ko.extenders.zipCode = function (target, overrideMessage) {
        /// <summary>
        /// Validates observable has a valid zip code.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="overrideMessage" type="String" optional="true">The error message.</param>
        /// <returns type="ko.observable">The extended observable.</returns>

        var errorId = 5,
            message = overrideMessage || "Zip code is not correct.";

        return _applyValidation(target, errorId, message, "", function (newValue) {
            return !(newValue || "").toString().match(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
        });
    };
    ko.extenders.phoneNumber = function (target, option) {
        /// <signature>
        /// <summary>
        /// Validates observable has a valid phone number.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="option" type="Number">The length.</param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>
        /// <signature>
        /// <summary>
        /// Validates observable has a valid phone number.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="option" type="Object">
        /// <field name="length" type="Number">The length.</field>
        /// <field name="message" type="String">The error message.</field>
        /// </param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>

        var errorId = 6,
            message = (typeof option === 'object' ? option.message : "") || "Phone number is not correct.",
            length = typeof option === 'object' ? option.length : (option || 10);

        return _applyValidation(target, errorId, message, "", function (newValue) {
            return (newValue || "").toString().replace(/[^\d]/g, "").length != length;
        });
    };
    ko.extenders.email = function (target, options) {
        /// <signature>
        /// <summary>
        /// Validates email or multiple addresses which can be separeted with comma, semicolon or space characters.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="options" type="String" optional="true">The error message.</param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>
        /// <signature>
        /// <summary>
        /// Validates email or multiple addresses which can be separeted with comma, semicolon or space characters.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable.</param>
        /// <param name="options" type="Object">
        /// <field name="isMultiple" type="Boolean" optional="true" default="false">A value indicating whether validate multiple email addresses.</field>
        /// <field name="message" type="String" optional="true">The error message.</field>
        /// </param>
        /// <returns type="ko.observable">The extended observable.</returns>
        /// </signature>

        var errorId = 7,
            message = (typeof options === 'object' ? options.message : options) || "Email is not correct.",
            pattern = (typeof options === 'object' && options.isMultiple)
                ? /^(\s*[a-zA-Z0-9_\.-]*[a-zA-Z0-9_]@[a-zA-Z0-9_\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z](\s*[,; ]\s*)?)+$/
                : /^\s*[a-zA-Z0-9_\.-]*[a-zA-Z0-9_]@[a-zA-Z0-9_\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/;

        return _applyValidation(target, errorId, message, "", function (newValue) {
            return !(newValue || "").toString().match(pattern);
        });
    };

    function _applyValidation(target, errorId, messageTemplate, option, rule) {
        /// <summary>
        /// Extend observable with validation.
        /// </summary>
        /// <param name="target" type="ko.observable">The observable</param>
        /// <param name="errorId" type="Number" integer="true">The error identifier.</param>
        /// <param name="messageTemplate" type="String">The error message template.</param>
        /// <param name="option" type="Object" mayBeNull="true">The rule option</param>
        /// <param name="rule" type="Function">Validates observable value and returns "true" on error.</param>
        /// <returns type="ko.observable">The extended observable.</returns>

        if (!ko.isObservable(target.hasError)) {
            target.hasError = ko.observable(false);
        }
        if (!ko.isObservable(target.errors)) {
            target.errors = ko.observableArray();
        }
        if (!ko.isObservable(target.showError)) {
            target.showError = ko.observable(false);
        }
        if (!ko.isObservable(target.validationMessage)) {
            target.validationMessage = ko.observable();
        }

        //initial validation
        _doValidation(target(), target, errorId, messageTemplate, option, rule);

        //validate whenever the value changes
        target.subscribe(function (newValue) {
            _doValidation(newValue, target, errorId, messageTemplate, option, rule);
            if (target.errors.indexOf(errorId) == -1) {
                target.showError(false);
            }
        });

        //return the original observable
        return target;
    }

    function _doValidation(newValue, target, errorId, messageTemplate, option, rule) {
        /// <summary>
        /// Validates observable.
        /// </summary>
        /// <param name="newValue">The value of observable.</param>
        /// <param name="target" type="ko.observable">The observable</param>
        /// <param name="errorId" type="Number" integer="true">The error identifier.</param>
        /// <param name="messageTemplate" type="String">The error message template.</param>
        /// <param name="option" type="Object" mayBeNull="true">The rule option</param>
        /// <param name="rule" type="Function">Validates observable value and returns "true" on error.</param>

        var hasError = rule(newValue);

        target.hasError(hasError);
        if (!ko.utils.arrayFirst(target.errors(), function (i) { return i < errorId; })) {
            target.validationMessage(hasError ? formatMessage(messageTemplate, option) : "");
        }

        //console.log("_doValidation", "value:", target(), "hasError:", target.hasError(), "messageTemplate", messageTemplate, "showError:", target.showError());

        if (hasError && (target.errors.indexOf(errorId) == -1)) {
            target.errors.push(errorId);
        } else if (!hasError) {
            target.errors.remove(errorId);
        }
        //hasError && console.log(target.validationMessage(), target.errors());
    }

    // Private functions

    function formatMessage(message, params) {
        /// <summary>
        /// Populates placeholders
        /// </summary>
        /// <param name="message" type="String">The template.</param>
        /// <param name="params" type="Array|ko.observable|String">The parameters.</param>
        /// <returns type="String">The result string.</returns>

        if ((typeof params === 'object') && params.typeAttr) {
            params = params.value;
        }
        var replacements = ko.utils.unwrapObservable(params) || [];
        if (!(params.isArray || Object.prototype.toString.call(params) === '[object Array]')) {
            replacements = [replacements];
        }
        return message.replace(/{(\d+)}/gi, function (match, index) {
            if (typeof replacements[index] !== 'undefined') {
                return replacements[index];
            }
            return match;
        });
    }

    ko.utils.validate = function (data, showError) {
        /// <signature>
        /// <summary>
        /// Returns a value inditacing all fields are valid.
        /// </summary>
        /// <param name="data" type="Array">The array to validate.</param>
        /// <param name="showError" type="Boolean" optional="true">A value indicating whether to show validation errors.</param>
        /// <returns type="Boolean">Returns a value inditacing whether all fields are valid.</returns>
        /// </signature>
        /// <signature>
        /// <summary>
        /// Returns a value inditacing all fields are valid.
        /// </summary>
        /// <param name="data" type="Object">The object to validate.</param>
        /// <param name="showError" type="Boolean" optional="true">A value indicating whether to show validation errors.</param>
        /// <returns type="Boolean">Returns a value inditacing whether all fields are valid.</returns>
        /// </signature>

        var fields = [],
            result = true;

        if (typeof data === 'object') {
            for (var propertyName in data) {
                if (data.hasOwnProperty(propertyName)) {
                    fields.push(data[propertyName])
                }
            }
        } else {
            fields = data;
        }

        ko.utils.arrayForEach(fields, function (field) {
            /// <param name="field" type="ko.observable"></param>
            if (ko.isObservable(field) && ko.isObservable(field.showError)) {
                //console.warn("validate", "value:", field(), "hasError:", field.hasError(), "Message", field.validationMessage(), "showError:", field.showError(), showError);
                result = result && !field.hasError();
                if (showError && field.hasError()) {
                    field.showError(true);
                }
            }
        });

        return result;
    }

    ko.dirtyFlag = function (root, isInitiallyDirty) {
        var result = function () { },
            _initialState = ko.observable(ko.toJSON(root)),
            _isInitiallyDirty = ko.observable(isInitiallyDirty);

        result.isDirty = ko.computed(function () {
            return _isInitiallyDirty() || _initialState() !== ko.toJSON(root);
        });

        result.reset = function () {
            _initialState(ko.toJSON(root));
            _isInitiallyDirty(false);
        };

        return result;
    };
})();