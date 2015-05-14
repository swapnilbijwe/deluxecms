(function ($) {
    var pluginName = 'catalogOptions',
        cache = {},
        debounce = function (func, wait) {
            var timeout;

            // the debounced function
            return function() {
                var context = this,
				    args = arguments,
                    later = function () { // nulls out timer and calls original function
                        timeout = null;
                        func.apply(context, args);
                    };

                // restart the timer to call last function
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

    function CatalogOptions($el, options) {
        /// <summary>
        /// Widget used to show available catalog options.
        ///
        /// Events:
        ///     catalogOptionChanged - Raised when option changed.
        ///         Parameters: basePrice, discountPercent, discountPrice, totalPrice, unitPrice, quantity
        ///
        ///     weightCalculated - Raised when weight was recalculated.
        ///         Parameters: BoxWeight, Boxes, EnvelopeWeight, SquareInchWeight, Weight, ProductOptions
        ///
        ///     quantityChanged - Raised when quantity changed.
        ///         Parameters: quantity
        ///
        ///     catalogOptionInitialized: Raised when widget has been initialized.
        ///         Parameters: Current element, form object
        ///
        ///     sidechanged: Raised when side changed.
        ///         Parameters: side
        ///
        ///     sizechanged: Raised when size changed.
        ///         Parameters: size
        /// </summary>

        var self = this,
            $document = $(document),
            $form = $('<form>', { name: 'add_cart1' }),
            $catalogId = $('<input>', { type: 'hidden', id: 'catalog_id' }),
            TURNAROUND_OPTION_NAME = 'turnaround1235_recon',
            quantity,
            isMailingOptionAvailable,
            onChangeDebounced = debounce(onOptionChange, 600),
            priceAdjustment;

        // Public Methods

        function getCatalogId() {
            /// <summary>Gets the current catalog Id.</summary>
            /// <returns type="Number">The catalog Id.</returns>

            return +$catalogId.val() || +self.options.catalogId;
        }

        function getQuantity() {
            /// <summary>Gets the product quantity.</summary>
            /// <returns type="Number">The product quantity.</returns>

            return +$form.find('select.option[name^="quantity"]').val();
        }

        function getSize() {
            /// <summary>Gets the product size.</summary>
            /// <returns type="String">The product size (ex. 2x2).</returns>

            var size = $form.find('select.option[name$="size_shape"]:visible').val()
                    || $form.find('select.option[name*="size"]:visible').val(),
                width,
                height,
                match;

            if (size) {
                match = size.match(/^\s*(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)/);

                if (match) {
                    width = +match[1];
                    height = +match[3];
                }
            }

            if (!width || !height) {
                width = +$form.find('select.option[name$="width"]').val() || self.options.defaultWidth;
                height = +$form.find('select.option[name$="height"]').val() || self.options.defaultHeight;
            }

            if (width && height && self.options.unitMeasure == PsPrintApp.unitOfMeasurenment.foot) {
                width *= 12;
                height *= 12;
            }

            return width + 'x' + height;
        }

        function getSelectedOptions() {
            /// <summary>Gets the array with the selected option choices.</summary>
            /// <returns type="Array" elementType="Number">An array of IDs of the selected options.</returns>

            return getSelected()
                .map(function () {
                    return $(this).data('value');
                }).get();
        }

        function getSelectedValues() {
            /// <summary>Gets the array with the selected options.</summary>
            /// <returns type="Array" elementType="Object">
            /// An array of objects containing information about the selected option.
            /// </returns>

            return getSelected()
                .map(function () {
                    var $opt = $(this),
                        optId = $opt.data('option');

                    if (optId > 0) {
                        return {
                            CatalogOptionID: optId,
                            OptionChoiceID: $opt.data('value'),
                            OptionChoiceName: $opt.text() || $opt.val(),
                            OptionChoiceValue: $opt.val(),
                            OptionText: $opt.data('caption')
                        };
                    }
                }).get();
        }

        function getUpdatedTitles() {
            /// <summary>Gets the array objects containing title and catalog option id.</summary>

            return $form.find('label.title-updated')
                .map(function () {
                    var $label = $(this),
                        catalogOptionId = $label.parent().find(':selected, :checked').data('option');

                    return {
                        catalogOptionId: catalogOptionId,
                        caption: $label.text()
                    };
                }).get();
        }

        function selectOptions(options) {
            /// <summary>Sets the options according to the specified array of choices.</summary>
            /// <param name="options" type="Object">Array of the option choices.</param>

            if (!$.isArray(options)) {
                return;
            }

            $form.find('select option, input[type=radio]')
                .each(function () {
                    var $opt = $(this);
                    if ($.inArray($(this).data('value'), options) > -1) {
                        if ($opt.prop('tagName') == 'OPTION') {
                            $opt.prop('selected', 'selected');
                        } else {
                            $opt.prop('checked', 'checked');
                        }
                    }
                });

            updatePrice();
        }

        function getMailingOptionId() {
            /// <summary>Gets selected mailing option Id.</summary>
            /// <returns type="Number">Selected mailing option Id.</returns>

            return $form.find('select[id="mail"]').find('option:selected').data('value');
        }

        function disableSizeOption() {
            /// <summary>Disables size related options.</summary>

            $form.find('select.option[name*="size"]').prop('disabled', true);
            $form.find('select.option[name$="width"]').prop('disabled', true);
            $form.find('select.option[name$="height"]').prop('disabled', true);
        }

        function disableSideOption() {
            /// <summary>Disables side option.</summary>

            $form.find('select.option[name*="colors"]').prop('disabled', true);
        }

        function enableSizeOption() {
            /// <summary>Enables size related options.</summary>

            $form.find('select.option[name*="size"]').removeProp('disabled');
            $form.find('select.option[name$="width"]').removeProp('disabled');
            $form.find('select.option[name$="height"]').removeProp('disabled');
        }

        function enableSideOption() {
            /// <summary>Enables side option.</summary>

            $form.find('select.option[name*="colors"]').removeProp('disabled');
        }

        // Private methods

        function createHiddenFields(priceAdjustment) {
            /// <summary>Creates the hidden fields.</summary>
            /// <param name="priceAdjustment" type="Object">Object containing the catalog adjustment data.</param>
            /// <returns type="Array" elementType="Object">An array of hidden fields.</returns>

            return [ $catalogId ];
        }

        function createRadioOption(option) {
            /// <summary>Creates the radio button option.</summary>
            /// <param name="option" type="Object">Object containing the catalog option data.</param>
            /// <returns type="Object">jQuery object containing the radio buttons.</returns>

            var $wrapperDiv = $('<div>', { 'class': 'select-wrapper radio-wrapper clearfix' })
                    .append($('<label>', { text: option.caption })),
                $radioGroup = $('<div>', { 'class': 'radio-group' })
                    .append($.map(option.choices, function (choice, index) {
                        if ($.inArray(choice.optionChoiceID, self.options.removedChoices) > -1) {
                            return;
                        }

                        var $label = $('<label>', { 'for': option.Name + choice.name, text: choice.name }),
                            $input = $('<input>', {
                                    'class': 'option',
                                    type: 'radio',
                                    id: option.name + choice.name,
                                    name: option.name,
                                    value: choice.value,
                                    change: onChangeDebounced,
                                    checked: !index
                                })
                                .data({
                                    value: choice.optionChoiceID,
                                    option: option.catalogOptionID,
                                    caption: option.caption
                                });

                        return [$input, $label];
                    }));

            return $wrapperDiv.append($radioGroup);
        }

        function createSelectOption(option) {
            /// <summary>Creates the select option.</summary>
            /// <param name="option" type="Object">Object containing the catalog option data.</param>
            /// <returns type="Object">jQuery object containing the radio buttons.</returns>

            var $wrapperDiv = $('<div>', { 'class': 'select-wrapper clearfix' })
                    .append($('<label>', { 'for': option.name, text: option.caption })),
                $select = $('<select>', {
                        'class': 'option',
                        id: option.name,
                        name: option.name,
                        change: onChangeDebounced,
                        keyup: onChangeDebounced
                    })
                    .append($.map(option.choices, function (choice) {
                        if ($.inArray(choice.optionChoiceID, self.options.removedChoices) > -1) {
                            return;
                        }

                        var $option = $('<option>', { value: choice.value, text: choice.name })
                            .data({
                                value: choice.optionChoiceID,
                                option: option.catalogOptionID,
                                caption: option.caption
                            });

                        if ($.inArray(choice.optionChoiceID, self.options.disabledChoices) > -1) {
                            $option.prop('disabled', true).hide();
                        }

                        return $option;
                }));

            return $wrapperDiv.append($select.val($select.find('option')
                .filter(function () { return this.style.display != 'none'; }).val()));
        }

        function createOptions(options) {
            /// <summary>Creates the options.</summary>
            /// <param name="option" type="Object">Array containing the catalog options.</param>
            /// <returns type="Object">jQuery object containing catalog options.</returns>

            return $.map(options, function (option) {
                var isMailOption = /mail/.test(option.Name);
                isMailingOptionAvailable = isMailingOptionAvailable || isMailOption;

                if (!self.options.showMailing && isMailOption) {
                    return;
                }

                if ((/turnaround|flyerrush/i).test(option.Name)) {
                    option.Name = TURNAROUND_OPTION_NAME;
                }

                var $optionDiv = (option.choices.length == 2) && ($.inArray(option.choices[0].name.toLowerCase(), ['yes', 'no']) > -1)
                    ? createRadioOption(option)
                    : createSelectOption(option);

                if ($.inArray(option.catalogOptionID, self.options.disabledOptions) > -1) {
                    $optionDiv.hide();
                }

                return $optionDiv;
            });
        }

        function getCatalogPriceAndOptions() {
            /// <summary>Gets the catalog price and options.</summary>
            /// <returns type="Promise">Promise of async result call.</returns>

            return $.Deferred(function (dfd) {
                /// <param name="dfd" type="jQuery.Deferred"></param>

                if (self.options.catalogOptions && self.options.priceAdjustment) {
                    dfd.resolve({
                        catalogOptions: self.options.catalogOptions,
                        priceAdjustment: self.options.priceAdjustment
                    });
                } else {
                    var catalogId = self.getCatalogId();

                    if (cache[catalogId] && cache[catalogId]) {
                        setTimeout(function () {
                            dfd.resolve(cache[catalogId]);
                        }, 0);
                    } else if (catalogId) {
                        $.getJSON(PsPrintApp.apiEndPoints.Catalog.getCatalogPriceAndProperties.replace('{id}', catalogId))
                            .then(function (data) {
                                if (data.Error) {
                                    dfd.reject(data);
                                } else {
                                    cache[catalogId] = $.extend(cache[catalogId], data.Data);
                                    dfd.resolve(data.Data);
                                }
                            })
                            .fail(function () {
                                console.error('Could not get catalog price and options.', arguments);
                                dfd.reject(arguments);
                            });
                    }
                }
            }).promise();
        }

        function getJobWeightAndBasePrice() {
            /// <summary>Gets the calculated weight and base price.</summary>
            /// <returns type="Promise">Promise of async result call.</returns>

            return $.getJSON(PsPrintApp.apiEndPoints.Catalog.calculateWeightAndBasePrice.replace('{id}', self.getCatalogId()), {
                    selectedOptions: self.getSelectedOptions()
                })
                .fail(function () {
                    console.error('Weigth and base price calculation failed.', arguments);
                });
        }

        function getMailingPrices(options) {
            /// <summary>Gets the mailing prices.</summary>
            /// <param name="options" type="Object">Contains values of selected options.</param>

            $.getJSON(PsPrintApp.apiEndPoints.Catalog.getMailingCosts.replace('{id}', self.getCatalogId()), {
                binding: options.Binding,
                envelopeName: options.EnvelopeName,
                insidePaper: options.InsidePaper,
                pages: options.Pages,
                quantity: options.Quantity,
                scoring: options.Scoring,
                size: options.Size,
                paper: options.Paper,
                proof: options.Proof,
                turnaround: options.Turnaround
            })
            .done(function (prices) {
                prices = prices ? prices.Data : null;

                var $mailSelect,
                    mailPriceAndDate;

                if (prices) {
                    $mailSelect = $form.find('select.option[id="mail"]');

                    $mailSelect
                        .find('option')
                        .each(function (idx, el) {
                            var $option = $(el),
                                date,
                                price;

                            if (/std$/i.test(el.value)) {
                                date = prices.StandardMailDate;
                                price = prices.StandardTotalCost;
                            } else {
                                date = prices.FirstClassMailDate;
                                price = prices.FirstClassTotalCost;
                            }

                            if (price) {
                                $option.prop('disabled', false).show();
                            } else {
                                $option.prop('disabled', true).hide();
                            }

                            $option.data({ price: price, date: date });
                        });

                    if ($mailSelect.find('option:selected').prop('disabled')) {
                        $mailSelect
                           .val($mailSelect.find('option')
                               .filter(function () { return this.style.display != 'none'; }).val());
                    }

                    mailPriceAndDate = $mailSelect.find('option:selected').data();
                }

                $document.trigger('mailingPriceUpdated.catalogoptions', [mailPriceAndDate, prices, self]);
            });
        }

        function calculateFullPrice(basePrice) {
            /// <summary>Gets the object containing the price data.</summary>
            /// <returns type="Object">Object containing price information.</returns>

            var discountPercent,
                discountMaximum,
                discountAmount,
                totalPrice = basePrice,
                markupPercent,
                markupAmount

            if (priceAdjustment) {
                markupPercent = priceAdjustment.basePriceAdjustmentFactor;

                if (markupPercent) {
                    markupAmount = basePrice * markupPercent;

                    if (priceAdjustment.markup && /^\s*no\s*$/i.test(priceAdjustment.markup)) {
                        markupAmount = -markupAmount;
                    }

                    basePrice += markupAmount;
                }

                discountPercent = priceAdjustment.discountFactor;

                if (discountPercent) {
                    discountPercent = 100 - (discountPercent * 100);
                    discountMaximum = priceAdjustment.basePriceAdjustmentMaximum;
                    discountAmount = basePrice * discountPercent / 100;

                    if (discountMaximum && discountAmount > discountMaximum) {
                        discountAmount = discountMaximum;
                    }

                    discountAmount = Math.round(discountAmount * 100) / 100;
                    totalPrice = basePrice - discountAmount;
                }
            }

            var fullPrice = {
                basePrice: basePrice,
                discountPercent: discountPercent ? discountPercent + '%' : '',
                discountPrice: discountAmount,
                totalPrice: totalPrice,
                maximumDiscount: discountMaximum
            };

            return fullPrice;
        }

        function getSelected() {
            /// <summary>Gets selected elements.</summary>
            /// <returns type="Object">jQuery object.</returns>

            return $form.find('select:not("#mail") option:selected, input[type=radio]:checked');
        }

        function updatePrice() {
            /// <summary>
            /// Initiates price recalculation, raises 'catalogOptionChanged' event,
            /// gets the job weigth and rauses corresponding event.
            /// </summary>

            getJobWeightAndBasePrice()
                .done(function (data) {
                    var weighAndPrice = data.data,
                        price = calculateFullPrice(weighAndPrice.basePrice);

                    if (self.options.showMailing && isMailingOptionAvailable) {
                        getMailingPrices(weighAndPrice.weight.productOptions);
                    }

                    $document
                        .trigger('catalogOptionChanged', [price, self])
                        .trigger('sidechanged.catalogoptions', [weighAndPrice.weight.productOptions.sides, self])
                        .trigger('weightCalculated', [weighAndPrice.weight, self]);
                });
        }

        function init(catalogPriceAndOptions) {
            /// <summary>
            /// Initializes the widget.
            /// </summary>
            /// <param name="catalogPriceAndOptions" type="Object">Contains catalog price and options.</param>

            var optionDivs = createOptions(catalogPriceAndOptions.catalogOptions),
                hiddenFields = createHiddenFields(catalogPriceAndOptions.priceAdjustment);

            priceAdjustment = catalogPriceAndOptions.priceAdjustment;

            if (self.options.formContainerId) {
                $form = $('#' + self.options.formContainerId).wrap($form).parent().append(hiddenFields);

                if ($.isArray(self.options.optionPlaceholders)) {
                    optionDivs = $.grep(optionDivs, function ($optionDiv) {
                        var $elemToMove;

                        $.each(self.options.optionPlaceholders, function () {
                            $elemToMove = $optionDiv.find("select[name*='" + this.optionName + "']").closest('div');

                            if ($elemToMove.length) {
                                $('#' + this.containerId).replaceWith($elemToMove);
                                return false;
                            }
                        });

                        return !$elemToMove.length;
                    });
                }

                $el.append(optionDivs);
            } else {
                $el.empty().append($form.empty().append(hiddenFields, optionDivs));
            }

            if (self.options.mailingOptionId) {
                $form.find('select.option[id="mail"]').val(self.options.mailingOptionId);
            }

            if (self.options.selectedOptions) {
                self.selectOptions(self.options.selectedOptions);
            } else {
                updatePrice();
            }

            $document.trigger('catalogOptionInitialized', [self, $el, $form]);

            // Attach events to add ability to edit option titles if this is turned on

            if (self.options.enableTitleEdit) {
                $form.on('click', '.select-wrapper > label', function () {
                    var $this = $(this),
                        val = $this.text(),
                        $labelInput = $('<input />', {
                            'class': 'label-input',
                            value: val
                        }).data('orig-val', val);

                    $this.replaceWith($labelInput);
                    $labelInput.focus();
                })
                .on('blur', '.select-wrapper > .label-input', function () {
                    var $this = $(this),
                        title = $.trim($this.val());

                    $this.replaceWith($('<label />', {
                        text: title || $this.data('orig-val'),
                        'class': 'title-updated'
                    }));
                });
            }
        }

        // Event handlers

        function onOptionChange(e) {
            if (/mail/.test(this.name)) {
                $document.trigger('mailingPriceUpdated.catalogoptions', [$(this).find('option:selected').data()]);
            } else {
                if ((/quantity/).test(this.name)) {
                    //quantity = this.value;
                    $document.trigger('quantityChanged', [this.value, self]);
                } else if ((/size|width|height/i).test(this.name)) {
                    $document.trigger('sizechanged.catalogoptions', [self.getSize(), self]);
                }

                updatePrice();
            }
        }

        // Init

        $.extend(self, {
            options: {
                catalogId: null,
                catalogOptions: null,
                priceAdjustment: null,
                priceCalculationJS: null,
                formContainerId: null,
                optionPlaceholders: [],
                selectedOptions: [],
                disabledOptions: [],
                disabledChoices: [],
                removedChoices: [],
                showMailing: false,
                defaultWidth: null,
                defaultHeight: null,
                unitMeasure: null,
                enableTitleEdit: false
            },
            applyOptions: function (opt) {
                $.extend(self.options, $.isPlainObject(opt) ? opt : {});
                getCatalogPriceAndOptions().done(init);
                return self;
            },
            getQuantity: getQuantity,
            getSize: getSize,
            getCatalogId: getCatalogId,
            getSelectedOptions: getSelectedOptions,
            getSelectedValues: getSelectedValues,
            getUpdatedTitles: getUpdatedTitles,
            selectOptions: selectOptions,
            getMailingOptionId: getMailingOptionId,
            disableSizeOption: disableSizeOption,
            disableSideOption: disableSideOption,
            enableSizeOption: enableSizeOption,
            enableSideOption: enableSideOption
        });

        self.applyOptions(options);
    }

    $.fn[pluginName] = function (options) {
        if (!this.length) {
            throw Error('Apply to some element.');
        }

        var $this = this.eq(0),
            obj = $this.data('plugin_' + pluginName);

        if (obj instanceof CatalogOptions) {
            obj.applyOptions(options);
        } else {
            obj = new CatalogOptions($this, options);
            $this.data('plugin_' + pluginName, obj);
        }

        return obj;
    }
} (jQuery));
