var PsPrintApp = {
    catalogId: null,
    storeId: null,
    customerId: null,
    taxFree: null,
    recaptchaSiteKey: null,
    trackingSiteId: null,
    siteEnvironment: null,
    trackingStores: null,
    enablePixeljsLogger: null,
    aspSessionId: null,
    models: {},
    viewModel: {},
    headerViewModel: {},
    exports: {},
    apiErrorCodes: {
        Unauthorized: 1,
        TokenExpired: 2,
        InvalidRequest: 10,
        NotFound: 11,
        UnexpectedException: 12,
        Duplicate: 20
    },
    workflowType: {
        Workflow1: 1,
        Workflow2: 2,
        Workflow3: 3
    },
    pickUpSites: {
        "5": {
            siteId: 5,
            addressTitle: "177 Mikron Road, Bethlehem, PA 18020",
            address: {
                Address1: "177 Mikron Road",
                Address2: "",
                City: "BETHLEHEM",
                State: "PA",
                Zip: "18020"
            },
            googleMaps: "//maps.googleapis.com/maps/api/staticmap?markers=size:mid|color:red|177 Mikron Road, Bethlehem, PA 18020, United States&zoom=15&size=286x200&sensor=false&key=AIzaSyCzsKYDgEBY1FybJGcMjuVuw0q4qfdS4pE"
        },
        "1": {
            siteId: 1,
            locationTitle: "San Francisco Bay Area Facility",
            addressTitle: "2861 Mandela Parkway, Oakland, CA 94608",
            address: {
                Address1: "2861 Mandela Parkway",
                Address2: "",
                City: "OAKLAND",
                State: "CA",
                Zip: "94608"
            },
            googleMaps: "//maps.googleapis.com/maps/api/staticmap?markers=size:mid|color:red|2861+Mandela+Parkway,+Oakland,+CA+94608&zoom=15&size=286x200&sensor=false&key=AIzaSyCzsKYDgEBY1FybJGcMjuVuw0q4qfdS4pE",
            locationMapUrl: "/sites/default/files/about_us/oakland-map.jpg"
        },
        "8": {
            siteId: 8,
            locationTitle: "Midwest Facility",
            addressTitle: "1600 East Touhy Avenue, Des Plaines, IL 60018",
            address: {
                Address1: "1600 East Touhy Avenue",
                Address2: "",
                City: "DES PLAINES",
                State: "IL",
                Zip: "60018"
            },
            googleMaps: "//maps.googleapis.com/maps/api/staticmap?markers=size:mid|color:red|1600 East Touhy Avenue, Des Plaines, IL 60018, United States&zoom=15&size=286x200&sensor=false&key=AIzaSyCzsKYDgEBY1FybJGcMjuVuw0q4qfdS4pE",
            locationMapUrl: "/sites/default/files/about_us/chicago-map.jpg"
        },
        "10": {
            siteId: 10,
            locationTitle: "East Coast Facility",
            addressTitle: "105 US Highway 46, Mountain Lakes, NJ 07046",
            address: {
                Address1: "105 US Highway 46",
                Address2: "",
                City: "MOUNTAIN LAKES",
                State: "NJ",
                Zip: "07046"
            },
            googleMaps: "//maps.googleapis.com/maps/api/staticmap?markers=size:mid|color:red|105 US Highway 46, Mountain Lakes, NJ 07046, United States&zoom=15&size=286x200&sensor=false&key=AIzaSyCzsKYDgEBY1FybJGcMjuVuw0q4qfdS4pE",
            locationMapUrl: "/sites/default/files/about_us/MtLake-map.jpg"
        }
    },
    unitOfMeasurenment: {
        inch: 1,
        foot: 2
    },
    addressType: {
        shipping: 0,
        billing: 1
    },
    webPageName: {
        ProductDetail: 'productdetail',
        ShoppingCart: 'shoppingcart',
        Checkout: 'checkout',
        Confirmation: 'confirmation',
        MailingList: 'mailinglist',
        Gallery: 'design-templates'
    },
    ShipMethods: {
        Pickup: 11,
        Ground: 12
    },
    SubscriptionSourceCode: {
        WebSiteRegistration: 0,
        WebSiteSignUp: 1,
        WebSiteMyAccount: 2,
        WebSiteFreeSampleKit: 3
    },
    apiEndPoints: {
        Log: {
            jsError: '/api/internal/log/error/js',
            jsInfo: '/api/internal/log/info/js',
            jsDebug: '/api/internal/log/debug/js'
        },
        Catalog: {
            getCatalogPriceAndProperties: '/api/internal/catalog/{id}/properties/',
            calculateWeight: '/api/internal/catalog/{id}/weight/',
            calculateWeightAndBasePrice: '/api/internal/catalog/{id}/weight-baseprice',
            getMailingCosts: '/api/internal/catalog/{id}/mailingcosts/',
            getProductDetailData: '/api/internal/catalog/product-detail/{token}'
        },
        Shoppingcart: {
            getCurrentCart: '/api/internal/shoppingcart/currentcart/',
            getCurrentCartItemsCount: '/api/internal/shoppingcart/items/count/',
            getCartItemMailingCosts: '/api/internal/shoppingcart/current/cartitem/{id}/mailingcosts/',
            duplicateCartItem: '/api/internal/shoppingcart/current/cartitem/copy/',
            updateCartItemAssets: '/api/internal/shoppingcart/current/cartitem/{id}/assets/',
            deleteCartItemAssets: '/api/internal/shoppingcart/current/cartitem/{id}/assets/',
            updateCartItemOptions: '/api/internal/shoppingcart/current/cartitem/{id}/options/',
            updateCartItemMailingOptions: '/api/internal/shoppingcart/current/cartitem/{id}/mailingoptions/',
            updateCartItemName: '/api/internal/shoppingcart/current/cartitem/{id}/name/',
            updateCartItemAddress: '/api/internal/shoppingcart/current/cartitem/{id}/address/',
            updateCartItem: '/api/internal/shoppingcart/current/cartitem/{id}',
            removeCartItem: '/api/internal/shoppingcart/current/cartitem/',
            updateCartAddress: '/api/internal/shoppingcart/current/shippingaddress/',
            applyCoupon: '/api/internal/shoppingcart/currentcart/coupon/',
            createEmailQuote: '/api/internal/shoppingcart/emailquote/',
            addToCart: '/api/internal/shoppingcart/current/cartitem/'
        },
        Shipping: {
            getShippingRatesAndTax: '/api/internal/shipping/shippingratesandtax'
        },
        Address: {
            getCities: '/api/internal/address/cities/',
            getCustomerAddresses: '/api/internal/address/customer/',
            setCustomerDefault: '/api/internal/address/customer/default/',
            addCustomerAddress: '/api/internal/address/customer/',
            editCustomerAddress: '/api/internal/address/customer/',
            deleteCustomerAddress: '/api/internal/address/customer/',
        },
        User: {
            loginCustomer: '/api/internal/user/customer/login',
            registerCustomer: '/api/internal/user/customer',
            logout: '/api/internal/user/logout',
            continueAsGuest: '/api/internal/user/continueasguest',
            forgotPassword: '/api/internal/user/forgotpassword',
            subscription: '/api/internal/user/subscription',
            upgradeGuestToCustomer: '/api/internal/user/guest/{id}/customer',
            getLoggedInUser: '/api/internal/user/loggedin/',
            loginDealer: '/api/internal/user/dealer/login'
        },
        MailingList: {
            getUsadataSessionToken: '/api/internal/mailinglist/usadatasessiontoken/'
        },
        Payment: {
            processCreditCard: 'https://payment.psprint.com/processCreditCard'
        },
        Content: {
            getSubjects: '/api/internal/content/feedback/subjects/',
            getSubSubjects: '/api/internal/content/feedback/subsubjects/'
        },
        Media: {
            getMediaDetails: '/api/internal/media/getmediadetails',
        },
        Design: {
            attachArtwork: '/api/internal/design/{pspid}/artwork/',
            setDesignEditMode: '/api/internal/design/{id}/editmode'
        },
        Job: {
            postJobNote: '/api/internal/job/{jobId}/note/',
            postOrderNote: '/api/internal/job/order/{orderId}/note/',
            postReplyNote: '/api/internal/job/note/{noteId}/reply/',
            updateProof: '/api/internal/job/{jobId}/proof/',
            updateAssets: '/api/internal/job/{jobId}/assets/'
        },
        Files: {
            thumbnail: 'http://files.psprint.com/thumbnail?imgType=small&mediaId=',
            getAssetByMedia: '//files.psprint.com/getAssetByMedia',
        }
    },
    logger: {
        logError: function (exception, jsFile, jsFunction, message) {
            var parameters = this.getLoggerParameters(exception, jsFile, jsFunction, message);

            $.ajax({
                type: 'POST',
                url: PsPrintApp.apiEndPoints.Log.jsError,
                data: parameters
            })
            .done(function (data) {
            });
        },
        logInfo: function (jsFile, jsFunction, message) {
            var parameters = this.getLoggerParameters(null, jsFile, jsFunction, message);

            $.ajax({
                type: 'POST',
                url: PsPrintApp.apiEndPoints.Log.jsInfo,
                data: parameters,
            })
            .done(function (data) {
            });
        },
        logDebug: function (jsFile, jsFunction, message) {
            var parameters = this.getLoggerParameters(null, jsFile, jsFunction, message);

            $.ajax({
                type: 'POST',
                url: PsPrintApp.apiEndPoints.Log.jsDebug,
                data: parameters,
            })
            .done(function (data) {
            });
        },
        getLoggerParameters: function (exception, jsFile, jsFunction, message) {
            var parameters, finalMessage, jsSource;

            if (message) {
                finalMessage = message + ' ---> ';
            }

            if (exception) {
                finalMessage = finalMessage + 'Exception: line ' + exception.lineNumber + ', message: ' + exception.message;
            }

            if (jsFile) {
                jsSource = jsFile + '::';
            }
            else {
                jsSource = 'inline::';
            }

            if (jsFunction) {
                jsSource += jsFunction;
            }
            else {
                jsSource += 'global';
            }

            parameters = {
                'webPageUrl': document.URL,
                'javaScriptSource': jsSource,
                'message': finalMessage
            };

            return parameters;
        }
    },
    utils: {
        getCookies: function (cookiesString) {
            /// <summary>Returns cookies as object.</summary>
            /// <param name="cookiesString" type="String" optional="true">Input string.</param>
            /// <returns type="Object">Cookies.</returns>

            var data = cookiesString || document.cookie,
                pairs = (data || '').split(';'),
                result = {},
                keyValue;

            for (var i in pairs) {
                if (pairs.hasOwnProperty(i)) {
                    keyValue = pairs[i].split('=');
                    result[keyValue[0].replace(/^\s+/, '')] = keyValue[1];
                }
            }

            return result;
        },
        updateViewModel: function (vm, data, customRules) {
            /// <summary>Updates view model with provided data.</summary>
            /// <param name="vm" type="Object">The view model.</param>
            /// <param name="data" type="Object">The data.</param>
            /// <param name="customRules" type="Object">The custom rules.</param>

            var dataKeys = PsPrintApp.utils.objectKeys(data);
            //var mapping = {}, vmSkipped = [], dataUsed = [];

            for (var vmKey in vm) {
                var dataKey = data.hasOwnProperty(vmKey)
                    ? vmKey
                    : ko.utils.arrayFirst(dataKeys, function (dataKey) {
                        return PsPrintApp.utils.toCamelCase(vmKey) == PsPrintApp.utils.toCamelCase(dataKey)
                    }) || ko.utils.arrayFirst(dataKeys, function (dataKey) {
                        return vmKey.toLowerCase() == dataKey.toLowerCase()
                    });

                if (dataKey) {
                    var property = vm[vmKey],
                        value = data[dataKey];
                    if (customRules && customRules.hasOwnProperty(vmKey)) {
                        customRules[vmKey](property, vmKey, value);
                    } else if (ko.isWritableObservable(property)) {
                        property(value);
                    } else if ((typeof property == "object") && (typeof property.update == "function")) {
                        property.update(value);
                    } else {
                        vm[vmKey] = value;
                    }

                    //    mapping[vmKey + ": " + dataKey] = value;
                    //    dataUsed.push(dataKey);
                    //} else {
                    //    vmSkipped.push(vmKey);
                }
            }

            //console.warn("updateViewModel",
            //    "dataSkipped", $(dataKeys).not(dataUsed).get(),
            //    //"vmSkipped", vmSkipped,
            //    //"mapped", mapping,
            //    "");
        },
        objectKeys: function (obj) {
            /// <summary>Returns the list of names of properties.</summary>
            /// <param name="obj">The object</param>
            /// <returns type="Array">The list of names of properties.</returns>
            var keys = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        },
        toCamelCase: function (str) {
            return str.replace(/([A-Z]|^)([A-Z]+)/g, function (m, p1, p2) { return p1 + p2.toLowerCase() });
        },
        escapeHtml: function (str) {
            /// <summary>Escapes HTML entities in string.</summary>
            /// <param name="str">String to escape.</param>
            /// <returns type="String">Escaped string.</returns>
            var entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
            };

            str = str || "";
            var escapedString = str.replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });

            return escapedString;
        }
    },
    calculation: {
        tax: function (taxRate, printingTotal, shippingTotal) {
            /// <summary>Calculates tax.</summary>
            /// <param name="taxRate" type="Number">The tax rate.</param>
            /// <param name="printingTotal" type="Number">The printing total cost.</param>
            /// <param name="shippingTotal" type="Number">The shipping total cost.</param>
            /// <returns type="Number">Tax</returns>

            var taxRateValue = parseFloat(ko.utils.unwrapObservable(taxRate)) || 0,
                printingTotalValue = parseFloat(ko.utils.unwrapObservable(printingTotal)) || 0,
                shippingTotalValue = parseFloat(ko.utils.unwrapObservable(shippingTotal)) || 0;

            var taxableCost = printingTotalValue + shippingTotalValue;

            var tax = PsPrintApp.taxFree
                ? 0
                : taxableCost * taxRateValue;

            return tax;
        }
    }
};
