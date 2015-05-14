(function ($) {
    var pluginName = 'shippingWidget';

    function ShippingWidget($elem, options) {
        var widget = this,
            $document = $(document),
            $layout = $('<div><div data-bind="visible: isZipInputVisible" class="submit-wrapper clearfix">\
                    <label for="shipTo">Zip Code</label>\
                    <input type="text" maxlength="5" class="zip" placeholder="(Optional)"\
                        data-bind="textInput: zip, enterkey: setZip, numeric: { decimal: false, negative: false }"/>\
                    <input data-bind="click: setZip" type="button" value="Update">\
                </div>\
                <div class="select-wrapper clearfix" data-bind="visible: shipMethod">\
	                <label id="lbl-shipping-option" for="shipping-option">Shipping Option</label>\
                    <div data-bind="shippingSelect: methods, value: shipMethod"></div>\
                    <div data-bind="visible: showPickupMessage" class="note">\
                        *<b>Need it faster?</b>\
                        Pick it up for free at\
                        <a class="our-facility" href="javascript:void(0);" data-bind="click: showPickupLocation">our facility</a>.\
                    </div>\
                </div></div>'),
            ViewModel = function () {
                var vm = this,
                    isShippingMethodApplied = false;

                vm.methods = ko.observableArray();
                vm.shipMethod = ko.observable();
                vm.isZipInputVisible = ko.observable();
                vm.zip = ko.observable().extend({ zipCode: null });
                vm.lastSuccessZip = '';

                // Computed

                ko.computed(function () {
                    var selectedMethodId = vm.shipMethod(),
                        shipMethod = ko.utils.arrayFirst(vm.methods(), function (method) {
                            return method.Id == selectedMethodId;
                        });

                    if (shipMethod) {
                        $document.trigger('shipMethodChanged', [shipMethod, widget]);
                    }
                }).extend({ rateLimit: 0 });

                vm.showPickupMessage = ko.pureComputed(function () {
                    return options.showPickupMessage && vm.isPickupAvailable();
                });

                vm.isPickupAvailable = ko.pureComputed(function () {
                    var pickupMethod = ko.utils.arrayFirst(vm.methods(), function (method) {
                        return method.Id == PsPrintApp.ShipMethods.Pickup;
                    });

                    return (vm.shipMethod() != PsPrintApp.ShipMethods.Pickup) && pickupMethod;
                });

                // Public methods

                vm.setZip = function () {
                    if (vm.zip.hasError()) {
                        $document.trigger('error.shippingWidget', ['INCORRECT_ZIP_FORMAT', widget]);
                    } else {
                        widget.setZipTo(vm.zip());
                        vm.lastSuccessZip = vm.zip();
                    }
                };

                vm.updateMethods = function (methods) {
                    vm.methods(methods);

                    if (!isShippingMethodApplied) {
                        if (options.shippingMethodId) {
                            isShippingMethodApplied = true;
                            vm.shipMethod(options.shippingMethodId);
                        } else {
                            var groundMethod = ko.utils.arrayFirst(methods, function (method) {
                                return method.Id == PsPrintApp.ShipMethods.Ground;
                            });

                            if (groundMethod) {
                                isShippingMethodApplied = true;
                                vm.shipMethod(PsPrintApp.ShipMethods.Ground);
                            }
                        }
                    }
                };

                vm.showPickupLocation = function () {
                    if (vm.showPickupMessage()) {
                        $document.trigger('showPickupLocation', widget);
                    }
                };
            },
            getShippingAndTax = function () {
                if (widget.productOptions && vm.zip() && widget.options.weight) {
                    return $.getJSON(PsPrintApp.apiEndPoints.Shipping.getShippingRatesAndTax, {
                        catalogId: widget.options.catalogId,
                        zipTo: vm.zip(),
                        weight: widget.options.weight,
                        productOptions: widget.productOptions
                    })
                    .done(function (webApiResponse) {
                        if (webApiResponse.Error) {
                            $document.trigger('error.shippingWidget', ['INCORRECT_ZIP', widget]);
                            vm.zip.hasError(true);
                        } else {
                            vm.updateMethods(webApiResponse.Data.shippingRates);
                            $document.trigger('taxChanged', [webApiResponse.Data.taxRate, widget]);
                        }
                    });
                } else {
                    return $.Deferred().resolve();
                }
            },
            vm = new ViewModel();

        // Init

        $.extend(widget, {
            options: {
                catalogId: null,
                zipTo: null,
                shippingMethodId: null,
                isZipInputVisible: false,
                showPickupMessage: false
            },
            productOptions: {},
            applyOptions: function (opt) {
                $.extend(widget.options, $.isPlainObject(opt) ? opt : {});
                vm.zip(widget.options.zipTo);
                vm.lastSuccessZip = widget.options.zipTo;
                vm.isZipInputVisible(widget.options.isZipInputVisible);
                return widget;
            },
            setZipTo: function (zipTo) {
                zipTo = $.trim(zipTo);

                if (widget.options.zipTo != zipTo) {
                    vm.zip(zipTo);
                    widget.options.zipTo = zipTo;
                    return getShippingAndTax();
                }

                return $.Deferred().resolve();
            },
            setProductOptions: function (opt, weight) {
                $.extend(widget.productOptions, $.isPlainObject(opt) ? opt : {});

                if (weight) {
                    widget.options.weight = weight;
                }

                if (opt.catalogId) {
                    widget.options.catalogId = opt.catalogId;
                }

                return getShippingAndTax();
            },
            getZip: function () {
                return vm.zip.hasError() ? '' : vm.lastSuccessZip;
            },
            getShippingMethodId: function () {
                return vm.shipMethod();
            },
            setShippingMethodId: function (shippingMethodId) {
                vm.shipMethod(shippingMethodId);
            },
            getShippingMethod: function () {
                var shipMethodId = vm.shipMethod(),
                    shipMethod = ko.utils.arrayFirst(vm.methods(), function (method) {
                        return method.Id == shipMethodId;
                    });
                return shipMethod;
            },
            isPickupAvailable: function () {
                return vm.isPickupAvailable();
            },
            hasError: function () {
                return $.trim(vm.zip()) && vm.zip.hasError() && !!vm.lastSuccessZip;
            }
        });

        widget.applyOptions(options);
        $elem.append($layout);
        ko.applyBindings(vm, $layout[0]);
    }

    $.fn[pluginName] = function (options) {
        if (!this.length) {
            throw Error("Apply to some element");
        }

        var $this = this.eq(0),
            obj = $this.data('plugin_' + pluginName);

        if (obj instanceof ShippingWidget) {
            obj.applyOptions(options);
        } else {
            obj = new ShippingWidget($this, options);
            $this.data('plugin_' + pluginName, obj);
        }

        return obj;
    }
}(jQuery));
