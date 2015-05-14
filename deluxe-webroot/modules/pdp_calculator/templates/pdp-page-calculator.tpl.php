<?php
    // drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/jquery-1.js');
     //drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/jquery-1.11.1.js');
    drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/jquery-ui.js');
     drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/jquery.numeric.js');
     drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/PsPrintApp.js');
     drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/knockout-3.2.0.js');
     drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/knockout-custom.js');
     drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/options-widget-server-side.js');
     drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/shipping-widget-server-side.js');
     drupal_add_js(drupal_get_path('module', 'pdp_calculator') . '/js/product-detail-static.js');
     drupal_add_css(drupal_get_path('module', 'pdp_calculator') . '/css/Site.css');
?>
<link href="https://files.psprint.com/stylesheets/uiwidget.css" type="text/css" rel="stylesheet" />

<script src="https://files.psprint.com/javascripts/uiWidgetManagerNextGen.js"></script>
 <div class="main">
        <div class="promo-wrapper has-bg">
            <div class="page-width">
                <div class="table-wrapper clearfix">
                    <div class="table-item" id="calc">
                        <div class="table-tool">
                            <div class="table-caption">
                                <div class="table-cell options">Product Options</div>
                                <div class="table-cell options">Design &amp; Proofing</div>
                                <div class="table-cell options">Production &amp; Shipping</div>
                            </div>
                            <div class="table-body">
                                <div class="table-cell options">
                                    <div id="options-container"></div>
                                </div>
                                <div class="table-cell options">
                                    <div class="radio-wrapper clearfix">
                                        <label>Upload Design (Optional)</label>
                                    </div>

                                    <div id="file-upload-container" class="upload-wrapper"
                                         data-bind="css: isFileUploadUnavailable() ? 'upload-unavailable' : ''"></div>

                                    <div id="proofing"></div>
                                </div>
                                <div class="table-cell options">
                                    <div id="turnaround"></div>

                                    <div class="select-wrapper radio-wrapper clearfix" data-bind="visible: isMailOptionAvailable">
                                        <label>Delivery Method</label>
                                        <div class="radio-group">
                                            <input id="ship-delivery" name="ship-delivery" type="radio" value="ship" data-bind="checked: deliveryMethod">
                                            <label for="ship-delivery">Ship</label>
                                            <input id="mail-delivery" name="ship-delivery" type="radio" value="mail" data-bind="checked: deliveryMethod">
                                            <label for="mail-delivery">Mail</label>
                                        </div>
                                    </div>

                                    <div class="clearfix" data-bind="stopBinding: true, visible: isShipDeliveryMethod" id="shipping-container"></div>

                                    <div data-bind="hidden: isShipDeliveryMethod">
                                        <div id="mailing"></div>
                                    </div>

                                    <div class="arrival-date" data-bind="visible: arrivalDate() && isShipDeliveryMethod()">
                                        Estimated Arrival Date: <span data-bind="text: arrivalDate"></span>
                                    </div>
                                    <div class="arrival-date" data-bind="visible: mailDate() && !isShipDeliveryMethod()">
                                        Estimated Mail Date: <span data-bind="text: mailDate"></span>
                                    </div>
                                    <div class="text note" data-bind="visible: weightThresholdExceded">Due to the large size of your order, other shipping options may be more economical. Please contact a customer support representative at 800.511.2009 for further options</div>
                                    <div class="text note" data-bind="visible: showPickup"><b>Need it faster?</b> You can pick up your order for free. <a data-bind="click: setPickup" href="javascript:void(0);">Click here</a> to update your shipping option.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-item">
                        <div class="table-tool">
                            <div class="table-caption">
                                <div class="table-cell summary">Job Summary</div>
                            </div>
                            <div class="table-body">
                                <div class="table-cell summary">
                                    <div class="cost clearfix">
                                        <div class="item">Printing Cost:</div>
                                        <div class="value"><span data-bind="currency: baseCost"></span></div>
                                    </div>
                                    <div class="off clearfix" data-bind="visible: discount">
                                        <div class="item">
                                            <span data-bind="text: discountPercent"></span>
                                            Off<span class="discount-maximum" data-bind="visible: maximumDiscount">
                                                (up to $<span data-bind="text: maximumDiscount"></span>)
                                            </span>:
                                        </div>
                                        <div class="value">- <span data-bind="currency: discount"></span></div>
                                    </div>
                                    <div class="mailing clearfix" data-bind="visible: !isShipDeliveryMethod() && mailingCost()">
                                        <div class="item">Mailing Service:</div>
                                        <div class="value"><span data-bind="currency: mailingCost"></span></div>
                                    </div>
                                    <div class="shipping clearfix" data-bind="visible: isShipDeliveryMethod">
                                        <div class="item">Shipping:</div>
                                        <div class="value"><span data-bind="currency: shipCost"></span></div>
                                    </div>
                                    <div class="tax clearfix" data-bind="visible: tax">
                                        <div class="item">Tax:</div>
                                        <div class="value"><span data-bind="currency: tax"></span></div>
                                    </div>
                                    <div class="total clearfix">
                                        <div class="item">Job Total:</div>
                                        <div class="value"><span data-bind="currency: total"></span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="table-body">
                                <div class="table-cell summary">
                                    <input id="addtocart-button" class="add-to-cart" type="submit" value="Add to Cart"
                                           data-bind="click: addToCart, disable: isLoading" />
                                    <a class="email-quote" href="javascript:void(0);" id="email-quote">Email Quote</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<script>
    //     (function () {
    //         var optionsWidget,
    //             shippingWidget,
    //             fileUploadWidget,
    //             catalogAdjustmentId,
    //             ProductDetailViewModel = function () {
    //                 var vm = this;

    //                 vm.baseCost = ko.observable(0);
    //                 vm.discountPercent = ko.observable(0);
    //                 vm.discount = ko.observable(0);
    //                 vm.mailingCost = ko.observable(0);
    //                 vm.shipCost = ko.observable(0);
    //                 vm.taxRate = ko.observable(0);
    //                 vm.maximumDiscount = ko.observable(0);

    //                 vm.deliveryMethod = ko.observable('ship');

    //                 vm.isMailOptionAvailable = ko.observable();
    //                 vm.isMailOptionAvailable.subscribe(function (newValue) {
    //                     if (!newValue) {
    //                         vm.deliveryMethod('ship');
    //                     }
    //                 });

    //                 vm.catalogId = ko.observable();
    //                 vm.mailingOptionId = ko.observable();
    //                 vm.zip = ko.observable();
    //                 vm.shippingMethodId = ko.observable();
    //                 vm.selectedOptionIds = ko.observableArray();
    //                 vm.assets = ko.observableArray();
    //                 vm.shoppingCartItemId = ko.observable();
    //                 vm.showPickup = ko.observable();

    //                 vm.weightThresholdExceded = ko.observable();
    //                 vm.arrivalDate = ko.observable();
    //                 vm.mailDate = ko.observable();

    //                 vm.messageDialogTitle = ko.observable();
    //                 vm.messageDialogContent = ko.observable();

    //                 vm.productName = ko.observable();

    //                 // Flags

    //                 vm.isLoading = ko.observable();
    //                 vm.isFileUploading = ko.observable();
    //                 vm.isFileUploadUnavailable = ko.observable(true);
    //                 vm.isMessageDialogVisible = ko.observable();
    //                 vm.isPickupAvailable = ko.observable();

    //                 vm.messageDialogOptions = {
    //                     width: 455,
    //                     open: function (e) {
    //                         $(e.target).parent().find('.ui-dialog-titlebar-close').text('Close');
    //                     },
    //                     position: {
    //                         at: 'center bottom',
    //                         collision: 'none none'
    //                     }
    //                 };

    //                 // Computed

    //                 vm.tax = ko.pureComputed(function () {
    //                     return PsPrintApp.calculation.tax(
    //                         vm.taxRate,
    //                         vm.baseCost() - vm.discount(),
    //                         vm.isShipDeliveryMethod() ? vm.shipCost : 0);
    //                 });

    //                 vm.total = ko.pureComputed(function () {
    //                     var mailCost = 0,
    //                         shipCost = 0;

    //                     if (vm.isShipDeliveryMethod()) {
    //                         shipCost = vm.shipCost();
    //                     } else {
    //                         mailCost = vm.mailingCost();
    //                     }

    //                     return ((vm.baseCost() + shipCost + mailCost) - vm.discount()) + vm.tax();
    //                 });

    //                 vm.isShipDeliveryMethod = ko.pureComputed(function () {
    //                     return vm.deliveryMethod() == 'ship';
    //                 })

    //                 // Public methods

    //                 vm.addToCart = function () {
    //                     /// <summary>
    //                     /// Adds new cart item to the shopping cart.
    //                     /// </summary>

    //                     if (!vm.isLoading()) {
    //                         if (shippingWidget.hasError()) {
    //                             vm.showErrorMessage({
    //                                 arrowCss: 'left',
    //                                 of: '.zip',
    //                                 my: 'left-130 top+15',
    //                                 title: 'Invalid Zip Code',
    //                                 text: ''//PsPrintApp.viewModel.InvalidZipCodeMessage
    //                             });
    //                             return;
    //                         }

    //                         vm.isLoading(true);

    //                         addOrUpdateCartItem()
    //                             .always(function () {
    //                                 vm.isLoading(false);
    //                             });
    //                     }
    //                 }

    //                 vm.setPickup = function () {
    //                     /// <summary>
    //                     /// Sets pickup method.
    //                     /// </summary>

    //                     shippingWidget.setShippingMethodId(PsPrintApp.ShipMethods.Pickup);
    //                 }

    //                 vm.showErrorMessage = function (options) {
    //                     /// <summary>
    //                     /// Shows error message dialog.
    //                     /// </summary>
    //                     /// <param name="options" type="Object">Params for error message dialog.</param>

    //                     vm.messageDialogOptions.arrowCss = options.arrowCss;
    //                     vm.messageDialogOptions.position.of = options.of;
    //                     vm.messageDialogOptions.position.my = options.my;
    //                     vm.messageDialogTitle(options.title);
    //                     vm.messageDialogContent(options.text);
    //                     vm.isMessageDialogVisible(true);
    //                 }
    //             },
    //             vm = new ProductDetailViewModel(),
    //             token = window.location.search.substring(1).split('=')[1] || '502c657b-9db7-40c8-9457-eccb2617de5e';

    //         if (!token) {
    //             throw 'Token is not provided!';
    //         }

    //         // Helper methods

    //         function addOrUpdateCartItem(isFileUpload) {
    //             if (vm.shoppingCartItemId()) {
    //                 // update cart item
    //                 var shipping = vm.isShipDeliveryMethod() ? {
    //                         shippingAddress: { zip: shippingWidget.getZip() },
    //                         shippingMethodId: shippingWidget.getShippingMethodId(),
    //                         isBlindShipping: undefined
    //                     } : undefined,
    //                     options = {
    //                         chosenOptionIds: optionsWidget.getSelectedOptions(),
    //                         printingCost: vm.baseCost(),
    //                         promotionDiscount: vm.discount(),
    //                         catalogId: optionsWidget.getCatalogId()
    //                     };

    //                 return $.ajax({
    //                     cache: false,
    //                     url: PsPrintApp.apiEndPoints.Shoppingcart.updateCartItem.replace('{id}', vm.shoppingCartItemId()),
    //                     type: 'PUT',
    //                     data: {
    //                         assets: {
    //                             assets: vm.assets(),
    //                             empty: false    // this is enforce to send 'assets' object, when assets is an empty array
    //                         },
    //                         options: options,
    //                         shipping: shipping,
    //                         mailingOptionId: vm.isShipDeliveryMethod() ? null : optionsWidget.getMailingOptionId(),
    //                         isDraft: true
    //                     }
    //                 })
    //                 .done(function (webApiResponse) {
    //                     if (!webApiResponse.Error && !vm.shoppingCartItemId()) {
    //                         vm.shoppingCartItemId(webApiResponse.Data.shoppingCartItemId);
    //                         alert('Successfully updated the cart.');
    //                     }
    //                 });
    //             } else {
    //                 // add to cart
    //                 var addToCartRequest = {
    //                     shoppingCartItemId: vm.shoppingCartItemId(),
    //                     catalogId: optionsWidget.getCatalogId(),
    //                     printingCost: vm.baseCost(),
    //                     promotionDiscount: vm.discount(),
    //                     maximumDiscount: vm.maximumDiscount(),
    //                     selectedOptionIds: optionsWidget.getSelectedOptions(),
    //                     mailingOptionId: vm.isShipDeliveryMethod() ? null : optionsWidget.getMailingOptionId(),
    //                     assets: vm.assets(),
    //                     zip: vm.isShipDeliveryMethod() ? shippingWidget.getZip() : null,
    //                     shippingMethodId: vm.isShipDeliveryMethod() ? shippingWidget.getShippingMethodId() : null,
    //                     catalogAdjustmentId: catalogAdjustmentId,
    //                     //isDraft: true,
    //                     isFileUpload: isFileUpload
    //                 };

    //                 return $.post(PsPrintApp.apiEndPoints.Shoppingcart.addToCart, addToCartRequest)
    //                     .done(function (webApiResponse) {
    //                         if (!webApiResponse.Error && !vm.shoppingCartItemId()) {
    //                             vm.shoppingCartItemId(webApiResponse.Data.shoppingCartItemId);
    //                             alert('Successfully added to cart.');
    //                         }
    //                     });
    //             }
    //         }

    //         function attachDocumentEvents(viewModel) {
    //             /// <summary>
    //             /// Attaches document events.
    //             /// </summary>
    //             /// <param name="viewModel" type="Object">Data for widgets initialization.</param>

    //             $(document).on({
    //                 shipMethodChanged: function (e, method, shippingWidget) {
    //                     vm.shipCost(method.TotalCharges || 0);
    //                     vm.arrivalDate(method.EstimatedArrivalDate);
    //                     vm.showPickup(vm.isShipDeliveryMethod()
    //                         && shippingWidget.isPickupAvailable()
    //                         && method.Id != PsPrintApp.ShipMethods.Pickup);
    //                     vm.isPickupAvailable(shippingWidget.isPickupAvailable());
    //                     vm.zip(shippingWidget.getZip());
    //                 },
    //                 catalogOptionChanged: function (e, product, optionsWidget) {
    //                     vm.baseCost(product.basePrice || 0);
    //                     vm.discount(product.discountPrice || 0);
    //                     vm.discountPercent(product.discountPercent);
    //                     vm.maximumDiscount(product.maximumDiscount || 0);
    //                 },
    //                 weightCalculated: function (e, weightData, optionsWidget) {
    //                     vm.weightThresholdExceded(viewModel.freightWeightThreshold
    //                         && weightData.weight > viewModel.freightWeightThreshold);

    //                     shippingWidget.setProductOptions(weightData.productOptions, weightData.weight);
    //                 },
    //                 taxChanged: function (e, taxRate) {
    //                     vm.taxRate(taxRate || 0);
    //                 },
    //                 'sizechanged.catalogoptions': function (e, size) {
    //                     if (fileUploadWidget) {
    //                         fileUploadWidget.setProductSize(size);
    //                     }
    //                 },
    //                 'sidechanged.catalogoptions': function (e, side) {
    //                     if (fileUploadWidget) {
    //                         fileUploadWidget.setNmberOfSides(side);
    //                     }
    //                 },
    //                 'catalogOptionInitialized': function (e, optionsWidget) {
    //                     if (fileUploadWidget) {
    //                         fileUploadWidget.setProductSize(optionsWidget.getSize());
    //                     }
    //                 },
    //                 'mailingPriceUpdated.catalogoptions': function (e, mailPriceAndDate, prices) {
    //                     if (mailPriceAndDate) {
    //                         vm.mailDate(mailPriceAndDate.date);
    //                         vm.mailingCost(mailPriceAndDate.price);
    //                     }

    //                     vm.isMailOptionAvailable(mailPriceAndDate && mailPriceAndDate.price !== undefined);
    //                 },
    //                 'error.shippingWidget': function (e, errorMsg) {
    //                     vm.showErrorMessage({
    //                         arrowCss: 'left',
    //                         of: '.zip',
    //                         my: 'left-130 top+15',
    //                         title: 'Invalid Zip Code',
    //                         text: '' //errorMsg == 'INCORRECT_ZIP' ? viewModel.InvalidZipCodeMessage : viewModel.InvalidZipCodeFormatMessage
    //                     });
    //                 }
    //             })
    //            .on('mousedown', '.real-button[type="file"]', function (e) { // Fix file uploading for IE
    //                if (e.which == 1) {
    //                    $(this).trigger('click');
    //                }
    //            })
    //            .ajaxStart(function () {
    //                vm.isLoading(true);
    //            })
    //            .ajaxStop(function () {
    //                vm.isLoading(false);
    //            });
    //         }

    //         function initializeWidgets(viewModel) {
    //             /// <summary>
    //             /// Initializes widgets.
    //             /// </summary>
    //             /// <param name="viewModel" type="Object">Data for widgets initialization.</param>

    //             var cookies = PsPrintApp.utils.getCookies(),
    //                 visitorId = (cookies['_ph_ps_visitor_id'] || '').split('.').shift(),
    //                 trackerSessionId = (cookies['_ph_ps_session_id'] || '').split('.').shift();

    //             if (typeof $.fn.uiwFileUpload !== 'undefined') {
    //                 vm.isFileUploadUnavailable(false);

    //                 fileUploadWidget = $('#file-upload-container').uiwFileUpload({
    //                     sessionId: '',
    //                     customerId: PsPrintApp.customerId,
    //                     visitorId: visitorId,
    //                     trackerSessionId: trackerSessionId,
    //                     storeId: PsPrintApp.storeId,
    //                     isCroppable: viewModel.isCroppAvailable
    //                 })[0];

    //                 $(fileUploadWidget).on({
    //                     onUploadStart: function (e) {
    //                         optionsWidget.disableSizeOption();
    //                         optionsWidget.disableSideOption();
    //                         vm.isFileUploading(true);

    //                         window.onbeforeunload = function () {
    //                             return ''; //viewModel.fileUploadInterruptionMessage;
    //                         };
    //                     },
    //                     onDAssetGenerated: function (e) {
    //                         optionsWidget.enableSizeOption();
    //                         optionsWidget.enableSideOption();

    //                         vm.isFileUploading(false);
    //                         vm.assets(ko.utils.arrayMap(fileUploadWidget.getAssets(), function (asset) {
    //                             return { AssetId: asset.assetId, Position: asset.position }
    //                         }));

    //                         addOrUpdateCartItem(true);
    //                     },
    //                     onDeleteStarted: function (e, assetId) {
    //                         vm.assets.remove(function (a) {
    //                             return a.AssetId == assetId;
    //                         });

    //                         addOrUpdateCartItem();
    //                     },
    //                     onUploadComplete: function (e, errorCode, desc) {
    //                         window.onbeforeunload = null;
    //                     },
    //                     onError: function (e, errorCode, errorMessage) {
    //                         optionsWidget.enableSizeOption();
    //                         optionsWidget.enableSideOption();

    //                         vm.showErrorMessage({
    //                             of: '#file-upload-container',
    //                             my: 'center top-70',
    //                             title: 'Error',
    //                             text: errorCode == 'M001' ? '' : errorMessage
    //                         });
    //                         vm.isFileUploading(false);

    //                         window.onbeforeunload = null;
    //                     },
    //                     onWarning: function (e, errorCode, errorMessage) {
    //                         optionsWidget.enableSizeOption();
    //                         optionsWidget.enableSideOption();

    //                         vm.showErrorMessage({
    //                             of: '#file-upload-container',
    //                             my: 'center top-70',
    //                             title: 'Attention',
    //                             text: errorMessage
    //                         });
    //                         vm.isFileUploading(false);
    //                     }
    //                 });
    //             }

    //             optionsWidget = $('#options-container').catalogOptions({
    //                 catalogId: viewModel.catalogId,
    //                 catalogOptions: viewModel.catalogOptions,
    //                 priceAdjustment: viewModel.priceAdjustment,
    //                 formContainerId: 'calc',
    //                 optionPlaceholders: [
    //                     { optionName: 'turnaround', containerId: 'turnaround' },
    //                     { optionName: 'proof', containerId: 'proofing' },
    //                     { optionName: 'mail', containerId: 'mailing' }
    //                 ],
    //                 selectedOptions: viewModel.defaultChoices,
    //                 disabledOptions: viewModel.disabledOptions,
    //                 disabledChoices: viewModel.disabledChoices,
    //                 removedChoices: viewModel.removedChoices,
    //                 defaultSide: viewModel.defaultSide,
    //                 defaultWidth: viewModel.defaultWidth,
    //                 defaultHeight: viewModel.defaultHeight,
    //                 unitMeasure: viewModel.unitMeasure,
    //                 showMailing: true
    //             });

    //             shippingWidget = $('#shipping-container').shippingWidget({
    //                 catalogId: viewModel.catalogId,
    //                 isZipInputVisible: true
    //             });
    //         }

    //         // Widgets initialization & KO view model binding

    //         $.getJSON(PsPrintApp.apiEndPoints.Catalog.getProductDetailData.replace('token', token))
    //             .done(function (data) {
    //                 var viewModel = data.data;

    //                 attachDocumentEvents(viewModel);
    //                 initializeWidgets(viewModel);

    //                 catalogAdjustmentId = viewModel.catalogAdjustmentID;

    //                 vm.productName(viewModel.jobName);
    //             });

    //         ko.applyBindings(vm);
    //     }());
    // </script>
