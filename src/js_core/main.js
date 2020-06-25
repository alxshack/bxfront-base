// Генератор уникалных значений ID
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

// Отложенное выполнение
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Клонирование
function clone(o) {
    var no = {};
    for (var k in o) {
        no[k] = o[k];
    }
    return no
}

// GA ИД клиента
function getGAClientID() {

    if (typeof window.ga == "undefined") {

        var match = document.cookie.match('(?:^|;)\\s*_ga=([^;]*)');
        var raw = (match) ? decodeURIComponent(match[1]) : null;
        if (raw) {
            match = raw.match(/(\d+\.\d+)$/);
        } else {
            return '';
        }
        var gacid = (match) ? match[1] : null;
        if (gacid) {
            return gacid;
        } else {
            return '';
        }

    } else {

        if (typeof ga.getAll != "undefined") {
            var gacid = ga.getAll()[0].get('clientId');
            if (gacid) {
                return gacid;
            } else {
                return '';
            }
        }

    }

}

(function ($) {

    // Fix для правильного расчета высоты видимой области (vh) в Apple Safari
    function safariVhFix() {
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        const vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    $(window).resize(function () {
        safariVhFix();
    });

    // Magnific-popup initialization
    $('[data-popup-beige]').magnificPopup({
        type: 'inline',
        callbacks: {
            open: function () {
                $('body').addClass('no-scroll');
            },
            close: function () {
                $('body').removeClass('no-scroll');
            }
        }
    });

    // Выравниватель
    $('.js-equalize-scope').each(function () {
        var $context = $(this);
        var $elems = $('.js-equalize-scope__elem', $context);
        var equalizeTimeout;

        function equalize() {
            var maxHeight = 0;

            clearTimeout(equalizeTimeout);
            $elems.css('min-height', '');

            setTimeout(function () {
                $elems.each(function () {
                    maxHeight = Math.max(maxHeight, $(this).outerHeight());
                });


                $elems.each(function () {
                    $(this).css('min-height', maxHeight);
                });
            }, 100);
        }

        equalize();
        $(window).on('resize', equalize);
    });

    $.fn.startWaiting = function () {
        $elem = $(this);
        $elem.find('.form__submit').prop('disabled', true);
        var loaderDiv = document.createElement('div');
        loaderDiv.className = 'ui-loader';
        loaderDiv.style.backgroundImage = 'url("/local/templates/main/build/images/ui/preloader.gif")';
        $elem.css({position: 'relative'});
        $elem[0].appendChild(loaderDiv);
    };

    $.fn.endWaiting = function () {
        $elem = $(this);
        $elem.find('.form__submit').prop('disabled', false);
        $loaderDiv = $elem.find('.ui-loader');
        $loaderDiv.remove();
    };

    window.Geo = window.Geo || {};
    window.CallTracking = window.CallTracking || {
        ready: false
    };
    window.App = window.App || {};
    App.Widgets = App.Widgets || {};

    /**
     * Основной класс приложения
     * Все методы, начинающиеся с "init" запускаются автоматически при полной загрузке страницы
     */
    var Application = can.Control.extend({}, {
        init: function () {

            if (typeof getClientId === "function") {
                $.getJSON('/ajax/interface/checkcid', {
                    'cid': getClientId()
                }, function (iResponse) {
                    if (!iResponse.allowed)
                        window.location.replace('/blocked/');
                });
            }

            $.getJSON('/ajax/interface/geolocation', function (iResponse) {
                window.Geo = iResponse;
            });

            window.Lang = this.spotLang();

            /**
             * Прокрутка к якорю, при загрузке
             */
            var uri = new URI(window.location.href);
            var self = this;
            if (uri.hash()) {
                try {
                    $(document).ready(function () {
                        setTimeout(self.scrollIt(uri.hash()), 5000);
                    });
                } catch (e) {
                }
            }

            App.ZeroWebFormValues = App.ZeroWebFormValues || {
                service: Cookies.get('ZeroWebFormValues_service') ? Cookies.get('ZeroWebFormValues_service') : '',
                service_code: Cookies.get('ZeroWebFormValues_service_code') ? Cookies.get('ZeroWebFormValues_service_code') : '',
                options_electron: Cookies.get('ZeroWebFormValues_options_electron') ? Cookies.get('ZeroWebFormValues_options_electron') : '',
                options_courier: Cookies.get('ZeroWebFormValues_options_courier') ? Cookies.get('ZeroWebFormValues_options_courier') : '',
                sale: Cookies.get('ZeroWebFormValues_sale') ? Cookies.get('ZeroWebFormValues_sale') : '',
                sale_code: Cookies.get('ZeroWebFormValues_sale_code') ? Cookies.get('ZeroWebFormValues_sale_code') : '',
                summ: Cookies.get('ZeroWebFormValues_summ') ? Cookies.get('ZeroWebFormValues_summ') : '',
                inn: Cookies.get('ZeroWebFormValues_inn') ? Cookies.get('ZeroWebFormValues_inn') : '',
                name: Cookies.get('ZeroWebFormValues_name') ? Cookies.get('ZeroWebFormValues_name') : '',
                phone: Cookies.get('ZeroWebFormValues_phone') ? Cookies.get('ZeroWebFormValues_phone') : '',
                email: Cookies.get('ZeroWebFormValues_email') ? Cookies.get('ZeroWebFormValues_email') : '',
                address: Cookies.get('ZeroWebFormValues_address') ? Cookies.get('ZeroWebFormValues_address') : '',
                comment: Cookies.get('ZeroWebFormValues_comment') ? Cookies.get('ZeroWebFormValues_comment') : ''
            };

        },

        bootstrap: function () {
            var method;

            for (method in this) {
                if (method.length > 4 && method.substr(0, 4) === 'init') {
                    this[method]();
                }
            }

            can.route.ready();
        },

        /**
         * Навешивает контроллер на DOM элемент и возвращает его instance
         * @param selector
         * @param controllerName
         * @param settings
         * @returns {*}
         */
        installController: function (selector, controllerName, settings) {
            settings = settings || {};
            return this.element.find(selector)[controllerName](settings).control(controllerName);
        },

        /**
         * Инициализация кастомных компонент вроде селектов, чекбоксов и прочего
         */
        initCustomComponents: function () {
            this.runFancybox();
            this.runTooltipster();
            this.runiCheck();
            this.loadUIComponents();
            this.formFileInit();
            this.installController('.js-get-form-file', 'appWidgetFormGetFile');
            this.formFileClick();


            setTimeout(function () {
                window.application.installController('.js-zero-reporting-order', 'appWidgetZeroReportingOrder'); // Расчёт итоговой стоимости нулевой отчётности
            }, 3000);

            var self = this;
            $(document).ajaxComplete(function () {
                self.loadUIComponents();
                self.runFancybox();
                self.runiCheck();
                self.runPhoneChange();
                self.runTooltipster();
                self.runCheckForm();
            });
        },

        //blockedByCID
        //appendAfter

        loadUIComponents: function () {
            this.maskInput();
            this.formValidate();
            this.runiCheck();
            this.installController('.js-form-select', 'appWidgetFormSelect'); // Кастомный селект как элемент формы, cюда для того чтобы ajax загрузенной форме работал плагин select2
            this.installController('.js-custom-form-element', 'appWidgetCustomFormElement'); // кастомизированные чекбоксы и радиокнопки

        },
        validateOptionsDefault: {
            errorClass: 'errortext',
            errorElement: 'font',
            //wrapper: 'p',
            //errorContainer: 'p',
            //errorLabelContainer: '.form__errors',
            showErrors: function (errorMap, errorList) {
                var replaceErrorList = [];
                var field = [];
                var form = $(this.currentForm);

                if (form.find('input[data-error="true"]').is(':checked')) {
                    field['message'] = 'Извините, но это закрытое мероприятие только для генеральных директоров и собственников бизнеса';
                    field['element'] = form.find('input[data-error="true"]')[0];
                    field['method'] = 'required';
                    this.errorList.push(field);
                }

                if (form.find('input[type="email"]').length > 0 && form.find('input[type="email"]').val() != '') {
                    var reg = /.+@.+\..+/i;
                    var email = form.find('input[type="email"]').val();
                    if (reg.test(email) == false) {
                        field['message'] = 'Некорректный email';
                        field['element'] = form.find('input[type="email"]')[0];
                        field['method'] = 'required';
                        this.errorList.push(field);
                    }
                }

                if (typeof form.find('input[type="tel"]').val() !== 'undefined' && form.find('input[type="tel"]').val().replace(/\D/g, "").length >= 0) {
                    var phone = form.find('input[type="tel"]').val().replace(/\D/g, "");
                    if (phone.length < 11) {
                        field['message'] = 'Введите номер телефона';
                        field['element'] = form.find('input[type="tel"]')[0];
                        field['method'] = 'required';
                        this.errorList.push(field);
                    }
                }

                this.errorList.forEach(function (errObj) {
                    if ($(errObj.element)) {
                        var fieldName = $(errObj.element).data('fieldname');

                        if (!fieldName) {
                            fieldName = $(errObj.element).attr('name');
                        }

                        errObj.message = errObj.message.replace('#FIELD_NAME#', fieldName);

                        if (errObj.message.indexOf("<br/>") == -1 && errObj.message.indexOf("<br>") == -1) {
                            errObj.message = errObj.message + "<br/>";
                        }

                        replaceErrorList.push(errObj);
                    }
                });

                this.errorList = replaceErrorList;

                var eventName = $(this.currentForm).data('event_name_of_the_error'),
                    eventNameOfTheSubmit = $(this.currentForm).data('event_name_of_the_submit'),
                    isSubmitted = $(this.currentForm).attr('data-is-click-submit') == 'Y',
                    hasErrorsInFields = this.errorList.length > 0,
                    sendEvent = false;

                if (isSubmitted && !!eventName && hasErrorsInFields) {
                    sendEvent = true;
                } else if (isSubmitted && !!eventNameOfTheSubmit && !hasErrorsInFields) {
                    sendEvent = true;
                    eventName = eventNameOfTheSubmit;
                }

                if (sendEvent) {
                    $(this.currentForm).attr('data-is-click-submit', 'N');

                    if (typeof GTMpushEvent == 'function') {
                        GTMpushEvent(eventName);
                    }
                    if (typeof yaCounter26016240 == 'function') {
                        yaCounter26016240.reachGoal(eventName);
                    }
                }

                this.defaultShowErrors();

            },
            highlight: function (element, errorClass, validClass) {
                $(element).addClass('form__input--invalid');
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).removeClass('form__input--invalid');
            },
            errorPlacement: function ($error, $element) {
                var $errorsDiv = $element.parents('form').find('.form__errors');

                if ($errorsDiv.length < 1) {
                    $errorsDiv = $(document.createElement('div'));
                    $errorsDiv.addClass('form__errors');
                    $errorsDiv.prependTo($element.parents('form'));
                }

                var $errorsDivBlock = $errorsDiv.find('p');

                if ($errorsDivBlock.length < 1) {
                    $errorsDivBlock = $(document.createElement('p'));
                    $errorsDivBlock.prependTo($errorsDiv);
                }

                $error.appendTo($errorsDivBlock);
            }
        },

        validateOptionsNoMsg: {
            showErrors: function (errorMap, errorList) {

                this.defaultShowErrors();

            },
            highlight: function (element, errorClass, validClass) {
                $(element).addClass('form__input--invalid');
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).removeClass('form__input--invalid');
            },
            errorPlacement: function ($error, $element) {

            }
        },
        onClickSubmitButton: function (event) {
            $(this).closest('form').attr('data-is-click-submit', 'Y');

            var eventName = $(this).data('event_name_of_the_click');

            if (!!eventName) {
                if (typeof GTMpushEvent == 'function') {
                    GTMpushEvent(eventName);
                }
                if (typeof yaCounter26016240 == 'function') {
                    yaCounter26016240.reachGoal(eventName);
                }
            }
        },
        formValidate: function () {
            //this.element.find('form[data-validate="true"]').validate(this.validateOptionsDefault);

            let env = this;

            this.element.find('form[data-validate="true"]').each(function () {
                $(this).validate(env.validateOptionsDefault);
            });

            $(this.element.find('form[data-validate="true"]')).find('[type="submit"]').off('click').on('click', this.onClickSubmitButton);
            /*
            // @todo: Обеспечить кастомные расширения
            this.element.find('form[data-validate="true"]').each(function( index ) {
                if(!$(this).data('validate-nomsg'))
                    $(this).validate(this.validateOptionsDefault);
                else
                    $(this).validate(this.validateOptionsNoMsg);
            });*/

        },


        maskInput: function () {
            //this.element.find('input[type=tel]').not('.form__input--tel-resize-mask').mask("+9 (999) 999-99-99");

            this.element.find('input[type=tel]').focusin(function () {
                $(this).removeClass('form__input--invalid');
                var currentVal = $(this).val().replace(/\D/g, "");
                $(this).val('+' + currentVal);
                $(this).unmask();

            });

            this.element.find('input[type=tel]').focusout(function () {
                var currentVal = $(this).val().replace(/\D/g, "");

                if (currentVal.length > 0) {
                    $(this).val('+' + currentVal);
                } else {
                    $(this).val(currentVal);
                }

                if (currentVal.length === 11) {
                    $(this).mask("+9 (999) 999-99-99", {reverse: true});
                }

                if (currentVal.length === 12) {
                    $(this).mask("+99 (999) 999-99-99", {reverse: true});
                }

                if (currentVal.length >= 13) {
                    $(this).mask("+999 (999) 999-99-99", {reverse: true});
                }

            });

            this.element.find('input[type=tel]').keydown(function (event) {
                if (event.key.search(/^[\d\s\-\+]+$/) === -1 && event.key !== 'Backspace' && event.key !== 'F5') {
                    return false;
                }

                var currentVal = $(this).val().replace(/\D/g, "");

                if (event.key !== 'Backspace' && event.key !== 'F5' && currentVal.length >= 13) {
                    return false;
                }
            });

            this.element.find('input[type=number]').keydown(function (e) {
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                    return;
                }
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
            this.element.find('input.js-mask-inn').mask("9999999999?99");
        },

        scrollIt: function (to) {
            var $scrollToEl = $(to);
            if ($scrollToEl.length <=0 || $scrollToEl.is(":hidden")) {
                $scrollToEl = $('[data-scrollid='+to+']');
            }
            if ($scrollToEl.length) {
                $('html, body').animate({
                    scrollTop: $scrollToEl.offset().top - 60
                }, 750);
            }
        },

        spotLang: function () {

            var uri = new URI(window.location.href);
            var fs = uri.segment(0);
            var lang = 'ru';

            switch (fs) {
                case 'en':
                case 'pt':
                    lang = 'en';
                    break;
                case 'de':
                    lang = 'de';
                    break;
                case 'fr':
                    lang = 'fr';
                    break;
                default:
                    lang = 'ru';
            }

            return lang;

        },

        runFancybox: function () {

            $.fancybox.defaults = $.extend({}, $.fancybox.defaults, {
                padding: 0,
                fitToView: false
            });

            // Всплывающие модальные окна

            this.element.find('.js-modal').click(function () {
                var padding = ($(this).data('padding') == 'N') ? 0 : 15,
                    close = ($(this) == 'N') ? false : true,
                    href = $(this).attr('href');

                $.fancybox({
                    href: href,
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 937) ? 20 : 5,
                    padding: padding,
                    closeBtn: close,
                    helpers: {
                        overlay: {
                            css: {
                                'background': 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                });
            });

            // Всплывающие изображения
            this.element.find('.js-img-modal').fancybox({
                wrapCSS: 'img-modal-wrapper',
                margin: ($(window).width() > 937) ? 20 : 5,
                fitToView: true,
                padding: 15,
                helpers: {
                    overlay: {
                        css: {
                            'background': 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            });

            // Всплывающие изображения без ссылки

            this.element.find('.fancyfull--image').click(function () {

                var href = ($(this).find('div').attr('href')) ? $(this).find('div').attr('href') : $(this).find('img').attr('src');

                if ($(window).width() <= 768) {

                    var pswpElement = document.querySelectorAll('.pswp')[0];

                    var options = {
                        closeOnScroll: false,
                        closeOnVerticalDrag: false,
                        pinchToClose: false
                    };

                    var swipeImage = href;

                    var tmpImg = new Image();

                    tmpImg.src = href;
                    $(tmpImg).one('load', function () {
                        orgWidth = tmpImg.width;
                        orgHeight = tmpImg.height;

                        var swipeItems = [
                            {
                                src: swipeImage,
                                w: orgWidth,
                                h: orgHeight
                            }
                        ];

                        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, swipeItems, options);
                        gallery.init();

                        gallery.listen('close', function () {
                            setTimeout(
                                function () {
                                    $('#gallery').removeClass('pswp--open');
                                },
                                2000
                            );
                        });
                    });

                } else {
                    $.fancybox({
                        href: href,
                        type: "image",
                        closeBtn: false,
                        wrapCSS: 'img-fancyfull-wrapper',
                        margin: ($(window).width() > 937) ? 20 : 5,
                        fitToView: true,
                        padding: 15,
                        helpers: {
                            overlay: {
                                css: {
                                    'background': 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                        afterShow: function () {
                            $('img.fancybox-image').click(function () {
                                $.fancybox.close();
                            });
                        }
                    });
                }
            });

            /**
             * Всплывающие изображения отзывов с поддержкой нескольких изображений
             * Дополнительные изображения в свойстве data-img в формате JSON
             */
            this.element.find('.js-clients-modal').on('click', function (e) {
                e.preventDefault();
                var aImgs = new Array,
                    i = 0;
                aImgs[i] = {
                    href: $(this).attr('href')
                };
                i++;
                if ($(this).data('img').length) {
                    for (var z in $(this).data('img')) {
                        aImgs[i] = {
                            href: $(this).data('img')[z]
                        };
                        i++;
                    }

                    $.fancybox(aImgs, {
                        wrapCSS: 'img-modal-wrapper',
                        margin: ($(window).width() > 937) ? 20 : 5,
                        fitToView: true,
                        padding: 15,
                        helpers: {
                            overlay: {
                                css: {
                                    'background': 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    });
                }
            });

            this.element.find('.js-modal-close').on('click', function () {
                $.fancybox.close();
            });

            // Вызов другого всплывающего изображения. Правило в свойстве data-fake-to
            this.element.find('.js-img-modal-fake').on('click', function (e) {
                e.preventDefault();
                $($(this).data('fake-to')).click();
            });

        },

        runTooltipster: function () {
            this.element.find('.js-tooltip').tooltipster({
                side: ['top'],
                theme: "tooltipster-light",
                contentAsHTML: true,
                animation: "fade",
                offsetY: -20,
                interactive: true
            });

            this.element.find('.js-tooltip-bottom-yellow').tooltipster({
                side: ['bottom'],
                theme: "tooltipster-yellow-bg",
                contentAsHTML: true,
                animation: "fade",
                interactive: true,
                maxWidth: 680,
                functionPosition: function (instance, helper, position) {
                    if (window.innerWidth >= 980) {
                        position.coord.left = helper.geo.origin.offset.left;
                    }

                    return position;
                },
                trigger: "custom",
                triggerOpen: {
                    mouseenter: true,
                    tap: true
                },
                triggerClose: {
                    mouseleave: true,
                    tap: true
                }
            });

            this.element.find('.js-tooltip-bottom').tooltipster({
                side: ['bottom'],
                theme: "tooltipster-light tooltipster-light-border-radius",
                contentAsHTML: true,
                animation: "fade",
                interactive: true,
                maxWidth: 310,
                trigger: "custom",
                triggerOpen: {
                    mouseenter: true,
                    tap: true
                },
                triggerClose: {
                    mouseleave: true,
                    tap: true
                }
            });

            this.element.find('.js-tooltip-personal').tooltipster({
                theme: 'tooltipster-light',
                contentCloning: true,
                side: 'bottom'
            });

            if (window.innerWidth > 768) {
                this.element.find('u.tooltip').tooltipster({
                    side: ['top'],
                    theme: "tooltipster-light",
                    contentAsHTML: true,
                    animation: "fade",
                    offsetY: -20,
                    interactive: true
                });
            } else {
                this.element.find('u.tooltip').tooltipster({
                    side: ['top'],
                    theme: "tooltipster-light",
                    contentAsHTML: true,
                    animation: "fade",
                    offsetY: -20,
                    interactive: true,
                    trigger: 'click'
                });
            }

        },

        runiCheck: function () {
            this.element.find('.js-icheckbox').iCheck({
                checkboxClass: 'custom-checkbox',
                checkedCheckboxClass: 'custom-checkbox--checked',
                cursor: true
            });
        },

        formFileInit: function () {
            if (window.location.href.indexOf("/blog/") > -1) {
                $("a[href*='.doc'],a:not(.p-info)[href*='.pdf'],a[href*='.xls'],a[href*='.docx'],a[href*='.xlsx']").click(function (e) {
                    e.preventDefault();
                });
            }
        },

        formFileClick: function () {
            if (window.location.href.indexOf("/blog/") > -1) {
                $("a[href*='.doc'],a:not(.p-info)[href*='.pdf'],a[href*='.xls'],a[href*='.docx'],a[href*='.xlsx']").addClass('js-get-form-file');
                $("a[href*='.doc'],a:not(.p-info)[href*='.pdf'],a[href*='.xls'],a[href*='.docx'],a[href*='.xlsx']").attr('data-form', 'send_file');
                $("a[href*='.doc'],a:not(.p-info)[href*='.pdf'],a[href*='.xls'],a[href*='.docx'],a[href*='.xlsx']").attr('data-id', $('#blodId').val());
                $("a[href*='.doc'],a:not(.p-info)[href*='.pdf'],a[href*='.xls'],a[href*='.docx'],a[href*='.xlsx']").attr('data-file', $('#blodfileId').val());
            }
        },

        runCheckForm: function () {
            var formToCheck = $('form[name="SUBSCRIPTION_BLOG"]');
            if (formToCheck) {
                formToCheck.find('.js-icheckbox.rubrics').on('ifClicked', function () {
                    formToCheck.find('.js-icheckbox.rubrics').iCheck('uncheck');
                    $(this).iCheck('check');
                });
                formToCheck.find('.js-icheckbox.cities').on('ifClicked', function () {
                    formToCheck.find('.js-icheckbox.cities').iCheck('uncheck');
                    $(this).iCheck('check');
                });
            }
        },

        initCalltracking: function () {
            var self = this,
                $ringoSide = this.element.find('.js-c-ringo'),
                curState = $ringoSide.find('.js-ringo-substitution').html(),
                _fSelf = function () {
                    self.initCalltracking();
                };

            if (!curState || curState == 'false') {
                this.element.on('DOMSubtreeModified', '.js-c-ringo', _fSelf);
            } else {

                this.element.off('DOMSubtreeModified', '.js-c-ringo');

                window.CallTracking.number = window.CallTracking.number || {};
                var oPhone = $ringoSide.find('.js-ringo-substitution');

                window.CallTracking.number = {
                    unformatted: oPhone.data('ringo--unformatted'),
                    wcode: oPhone.data('ringo--wcode'),
                    ccode: oPhone.data('ringo--ccode'),
                    local: oPhone.data('ringo--local')
                }

                window.CallTracking.ready = true;

                this.runPhoneChange();

            }
        },

        runPhoneChange: function () {
            if (window.CallTracking.ready) {
                this.element.find('a.js-site-phone-a').attr('title', '+' + window.CallTracking.number.unformatted);
                this.element.find('a.js-site-phone-a').attr('href', 'tel:+' + window.CallTracking.number.unformatted);
                this.element.find('.js-site-phone-wcode').text(window.CallTracking.number.wcode);
                this.element.find('.js-site-phone-ccode').text(window.CallTracking.number.ccode);
                this.element.find('.js-site-phone-local').text(window.CallTracking.number.local);
            }
        },

        initWidgets: function () {
            //this.installController('.js-header-menu', 'appWidgetsSearchHeader');
            //this.installController('.js-header-footer', 'appWidgetsMenu', {myOption: true});
            this.installController('.js-push-event', 'appWidgetEventPush');
            this.installController('.js-tabs', 'appWidgetTabs'); // переключение вкладок
            this.installController('.js-oval-tabs', 'appWidgetOvalTabs'); // вкладки, которые могут содержать внутри себя дополнительные вкладки
            this.installController('.js-menu', 'appWidgetDropdownMenu'); // выпадающее меню не выходит за пределы основного контейнера; открытие мобильного меню по клику
            this.installController('.js-main-slider', 'appWidgetMainSlider'); // главный слайдер - эффект fadeIn/fadeOut, навигация в виде точек
            this.installController('.js-payment-input', 'appPaymentInput');
            this.installController('.js-clients-slider', 'appWidgetClientsSlider'); // слайдер логотипов клиентов - стандартный эффект owl, навигации нет
            this.installController('.js-images-carousel', 'appWidgetImagesCarousel'); // Карусель из 4 изображений на десктопах
            this.installController('.js-get-form', 'appWidgetFormGet'); // вызов формы
            this.installController('.js-get-event-form', 'appWidgetEventFormGet'); // вызов формы Мероприятия
            this.installController('.js-get-form-file', 'appWidgetFormGetFile'); // вызов формы
            this.installController('.js-content-slider', 'appWidgetContentSlider'); // слайдер отзывов - стандартный эффект owl, навигация prev/next
            this.installController('.js-sync-slider', 'appWidgetSyncSlider'); // слайдер отзывов - стандартный эффект owl, навигация prev/next
            this.installController('.js-employee-reviews-slider', 'appWidgetEmployeeReviewsSlider'); // слайдер отзывов сотрудников - без автоматической прокрутки, навигация prev/next
            this.installController('.js-slider', 'appWidgetSlider'); // слайдер мобильных приложений в подвале -эффект fadeIn/fadeOut, навигации нет
            this.installController('.js-dotted-nav-slider', 'appWidgetDottedNavSlider'); // слайдер-карусель с навигацией в виде точек
            this.installController('.js-dotted-nav-slider-no-auto', 'appWidgetDottedNavSliderNoAuto'); // слайдер-карусель с навигацией в виде точек без автопрокрутки
            this.installController('.js-languages-switch', 'appWidgetLanguagesSwitch'); // изменение фона главного слайдера при переключении языков
            this.installController('.js-show-info', 'appWidgetShowInfo'); // показ скрытой информации по клику на элемент
            this.installController('.js-equal-height-blocks', 'appWidgetEqualHeightBlocks'); // блоки одинаковой высоты
            this.installController('.js-scroll-to', 'appWidgetScrollTo'); // скролл к определенной части страницы по клику на элемент
            this.installController('.js-accordion', 'appWidgetAccordion'); // компонент "аккордеон"
            this.installController('.js-select', 'appWidgetCustomSelect'); // кастомизированный select
            this.installController('.js-cost-calculator', 'appWidgetCostCalculator'); // калькулятор стоимости бухгалтерских услуг
            this.installController('.js-off-canvas-mobile', 'appWidgetOffCanvasMobile'); // offcanvas меню для мобильных
            this.installController('.js-filter', 'appWidgetFilter'); // фильтрация элементов
            this.installController('.js-show-more', 'appWidgetShowMore'); // кнопка "Показать ещё"
            this.installController('.js-clients-filter', 'appWidgetClientsFilter'); // Блок вкладок с клиентами
            this.installController('.js-map', 'appWidgetMap'); // Инициализация yandex карты
            this.installController('.js-changeable-contacts', 'appWidgetChangeableContacts'); // изменяемые контакты по селекту
            this.installController('.js-print', 'appWidgetPrint'); // кастомная печать
            this.installController('.js-back-to-top', 'appWidgetBackToTop'); // кнопка "Наверх"
            this.installController('.js-news-archive', 'appWidgetNewsArchive'); // Фильтация новостей
            this.installController('.js-form', 'appWidgetFormDummy'); // ответ формы при успешной отправке (заглушка, отключить в дальнейшем)
            this.installController('.js-slider-form', 'appWidgetSliderForm'); // ответ формы при успешной отправке (заглушка, отключить в дальнейшем)
            this.installController('.js-form-ajax', 'appWidgetFormAjax'); // обработчик ajax форм
            this.installController('.js-form-default', 'appWidgetFormDefault'); // обработчик ajax форм без отправки в КИС
            this.installController('.js-event-form-ajax', 'appWidgetEventFormAjax'); // обработчик ajax форм для Мероприятий
            this.installController('.js-poll-form', 'appWidgetFormPoll'); // обработчик форм голосований
            this.installController('.js-banner-lazy', 'appWidgetBannerLazyLoad'); // Ленивая загрузка баннеров
            this.installController('.js-event-lazy', 'appWidgetEventLazyLoad'); // Ленивая загрузка Мероприятия
            this.installController('.js-blog-archive', 'appWidgetBlogArchive'); // Фильтация блога
            this.installController('.js-blog-tags', 'appWidgetBlogTags'); // Теги блога
            this.installController('.js-lazy-load', 'appWidgetLazyLoad'); // Теги блога
            this.installController('.js-tax-portfolio', 'appPaginationPortfolio'); // Постраничка для Портфолио налоговых проектов
            this.installController('.js-long-table', 'appWidgetLongTable'); // Таблица с прилипающей при скролле шапкой
            this.installController('.js-zero-reporting-test', 'appWidgetZeroReportingTest'); // Тест для определения нулевой отчётности
            this.installController('.js-zero-reporting-payment', 'appWidgetZeroReportingPayment'); // Онлайн оплата нулевой отчётности
            this.installController('.js-form-ajax-payment', 'appPaymentFormAjax');
            this.installController('.js-zero-type-form', 'appPaymentFormZeroType');
            this.installController('.js-zero-type-form-props-setter', 'appPaymentFormZeroPropsSet');
            this.installController('.js-zero-contact-form', 'appPaymentFormZeroContact');
            this.installController('.js-payment-input-zero-report', 'appPaymentZeroReportInput');
            this.installController('.js-events-archive', 'appWidgetEventsArchive'); // Фильтhация блога
            this.installController('.js-changes-control', 'appWidgetChanges'); // Фильтрация "Изменений в законодательстве"
            this.installController('.js-mobile-app-tabs', 'appWidgetMobileAppTabs'); // Вкладки мобильного приложения
            this.installController('.js-subscribe-popup', 'appSubscribePopup'); // Подписка во всплывающем окне
            this.installController('.js-test-collect-form', 'appWidgetFormTestCollect');
            this.installController('.js-lazyload', 'appWidgetNewLazyLoad');
            this.installController('.js-show-search-form', 'appWidgetShowSearchForm'); // Показать форму поиска в шапке
            this.installController('.js-flip-card', 'appWidgetFlipCard'); //Переворот картинок,
            this.installController('.js-subscribe-form', 'appWidgetFormSubscribe'); // обработчик форм подписки
            this.installController('.js-image-zoom-container', 'appImageZoom'); // zoom для изображений инструкции
            this.installController('.js-push-quiz-events', 'appWidgetQuizEvents'); // Сбор и отправка событий блока Квиз

            this.installController('.js-partners-carousel', 'appWidgetPartnersCarousel'); // Карусель "Наши партнеры"
            this.installController('.js-partners-carousel-nav', 'appWidgetPartnersCarouselNav'); // Карусель "Наши партнеры" с навигацией
            this.installController('.js-accounting-calc', 'appWidgetAccountingCalculator'); // Калькулятор стоимости услуг

            this.installController('.js-partners-carousel-mob', 'appWidgetPartnersCarouselMob'); // Карусель "Наши партнеры мобилка"
            this.installController('.js-burger-mobile', 'appWidgetBurgerMobile'); // Обработчик нового мобильного меню
            this.installController('p.accordion', 'appWidgetBlogAccordion'); // Обработчик нового мобильного меню

        }
    });

    $(function () {
        window.application = new Application('body');
        window.application.bootstrap();
    });

}(jQuery));
