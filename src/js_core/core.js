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
}

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

/*
function ringoInit(regionCode) {
    (function (d, s, u, e, p) {
        window.ringostatConfig = {};
        window.ringostatConfig['numbers'] = {};
        window.ringostatConfig['numbers'][regionCode] = {
            class: 'ringo-'+regionCode,
            mask:'<t>'
        };
        p=d.getElementsByTagName(s)[0],e=d.createElement(s),e.async=1,e.src=u,p.parentNode.insertBefore(e,p);
    })(document, 'script', 'https://ringostat.com/numbers/v3/ringostat.min.js');
}
*/

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
    /*
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
     */

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
            // this.installController('.js-push-event', 'appWidgetEventPush');
            // this.installController('.js-tabs', 'appWidgetTabs'); // переключение вкладок
            // this.installController('.js-oval-tabs', 'appWidgetOvalTabs'); // вкладки, которые могут содержать внутри себя дополнительные вкладки
            // this.installController('.js-menu', 'appWidgetDropdownMenu'); // выпадающее меню не выходит за пределы основного контейнера; открытие мобильного меню по клику
            // this.installController('.js-main-slider', 'appWidgetMainSlider'); // главный слайдер - эффект fadeIn/fadeOut, навигация в виде точек
            // this.installController('.js-payment-input', 'appPaymentInput');
            // this.installController('.js-clients-slider', 'appWidgetClientsSlider'); // слайдер логотипов клиентов - стандартный эффект owl, навигации нет
            // this.installController('.js-images-carousel', 'appWidgetImagesCarousel'); // Карусель из 4 изображений на десктопах
            // this.installController('.js-get-form', 'appWidgetFormGet'); // вызов формы
            // this.installController('.js-get-event-form', 'appWidgetEventFormGet'); // вызов формы Мероприятия
            // this.installController('.js-get-form-file', 'appWidgetFormGetFile'); // вызов формы
            // this.installController('.js-content-slider', 'appWidgetContentSlider'); // слайдер отзывов - стандартный эффект owl, навигация prev/next
            // this.installController('.js-sync-slider', 'appWidgetSyncSlider'); // слайдер отзывов - стандартный эффект owl, навигация prev/next
            // this.installController('.js-employee-reviews-slider', 'appWidgetEmployeeReviewsSlider'); // слайдер отзывов сотрудников - без автоматической прокрутки, навигация prev/next
            // this.installController('.js-slider', 'appWidgetSlider'); // слайдер мобильных приложений в подвале -эффект fadeIn/fadeOut, навигации нет
            // this.installController('.js-dotted-nav-slider', 'appWidgetDottedNavSlider'); // слайдер-карусель с навигацией в виде точек
            // this.installController('.js-dotted-nav-slider-no-auto', 'appWidgetDottedNavSliderNoAuto'); // слайдер-карусель с навигацией в виде точек без автопрокрутки
            // this.installController('.js-languages-switch', 'appWidgetLanguagesSwitch'); // изменение фона главного слайдера при переключении языков
            // this.installController('.js-show-info', 'appWidgetShowInfo'); // показ скрытой информации по клику на элемент
            // this.installController('.js-equal-height-blocks', 'appWidgetEqualHeightBlocks'); // блоки одинаковой высоты
            // this.installController('.js-scroll-to', 'appWidgetScrollTo'); // скролл к определенной части страницы по клику на элемент
            // this.installController('.js-accordion', 'appWidgetAccordion'); // компонент "аккордеон"
            // this.installController('.js-select', 'appWidgetCustomSelect'); // кастомизированный select
            // this.installController('.js-cost-calculator', 'appWidgetCostCalculator'); // калькулятор стоимости бухгалтерских услуг
            // this.installController('.js-off-canvas-mobile', 'appWidgetOffCanvasMobile'); // offcanvas меню для мобильных
            // this.installController('.js-filter', 'appWidgetFilter'); // фильтрация элементов
            // this.installController('.js-show-more', 'appWidgetShowMore'); // кнопка "Показать ещё"
            // this.installController('.js-clients-filter', 'appWidgetClientsFilter'); // Блок вкладок с клиентами
            // this.installController('.js-map', 'appWidgetMap'); // Инициализация yandex карты
            // this.installController('.js-changeable-contacts', 'appWidgetChangeableContacts'); // изменяемые контакты по селекту
            // this.installController('.js-print', 'appWidgetPrint'); // кастомная печать
            // this.installController('.js-back-to-top', 'appWidgetBackToTop'); // кнопка "Наверх"
            // this.installController('.js-news-archive', 'appWidgetNewsArchive'); // Фильтация новостей
            // this.installController('.js-form', 'appWidgetFormDummy'); // ответ формы при успешной отправке (заглушка, отключить в дальнейшем)
            // this.installController('.js-slider-form', 'appWidgetSliderForm'); // ответ формы при успешной отправке (заглушка, отключить в дальнейшем)
            // this.installController('.js-form-ajax', 'appWidgetFormAjax'); // обработчик ajax форм
            // this.installController('.js-form-default', 'appWidgetFormDefault'); // обработчик ajax форм без отправки в КИС
            // this.installController('.js-event-form-ajax', 'appWidgetEventFormAjax'); // обработчик ajax форм для Мероприятий
            // this.installController('.js-poll-form', 'appWidgetFormPoll'); // обработчик форм голосований
            // this.installController('.js-banner-lazy', 'appWidgetBannerLazyLoad'); // Ленивая загрузка баннеров
            // this.installController('.js-event-lazy', 'appWidgetEventLazyLoad'); // Ленивая загрузка Мероприятия
            // this.installController('.js-blog-archive', 'appWidgetBlogArchive'); // Фильтация блога
            // this.installController('.js-blog-tags', 'appWidgetBlogTags'); // Теги блога
            // this.installController('.js-lazy-load', 'appWidgetLazyLoad'); // Теги блога
            // this.installController('.js-tax-portfolio', 'appPaginationPortfolio'); // Постраничка для Портфолио налоговых проектов
            // this.installController('.js-long-table', 'appWidgetLongTable'); // Таблица с прилипающей при скролле шапкой
            // this.installController('.js-zero-reporting-test', 'appWidgetZeroReportingTest'); // Тест для определения нулевой отчётности
            // this.installController('.js-zero-reporting-payment', 'appWidgetZeroReportingPayment'); // Онлайн оплата нулевой отчётности
            // this.installController('.js-form-ajax-payment', 'appPaymentFormAjax');
            // this.installController('.js-zero-type-form', 'appPaymentFormZeroType');
            // this.installController('.js-zero-type-form-props-setter', 'appPaymentFormZeroPropsSet');
            // this.installController('.js-zero-contact-form', 'appPaymentFormZeroContact');
            // this.installController('.js-payment-input-zero-report', 'appPaymentZeroReportInput');
            // this.installController('.js-events-archive', 'appWidgetEventsArchive'); // Фильтhация блога
            // this.installController('.js-changes-control', 'appWidgetChanges'); // Фильтрация "Изменений в законодательстве"
            // this.installController('.js-mobile-app-tabs', 'appWidgetMobileAppTabs'); // Вкладки мобильного приложения
            // this.installController('.js-subscribe-popup', 'appSubscribePopup'); // Подписка во всплывающем окне
            // this.installController('.js-test-collect-form', 'appWidgetFormTestCollect');
            // this.installController('.js-lazyload', 'appWidgetNewLazyLoad');
            // this.installController('.js-show-search-form', 'appWidgetShowSearchForm'); // Показать форму поиска в шапке
            // this.installController('.js-flip-card', 'appWidgetFlipCard'); //Переворот картинок,
            // this.installController('.js-subscribe-form', 'appWidgetFormSubscribe'); // обработчик форм подписки
            // this.installController('.js-image-zoom-container', 'appImageZoom'); // zoom для изображений инструкции
            // this.installController('.js-push-quiz-events', 'appWidgetQuizEvents'); // Сбор и отправка событий блока Квиз
            //
            // this.installController('.js-partners-carousel', 'appWidgetPartnersCarousel'); // Карусель "Наши партнеры"
            // this.installController('.js-partners-carousel-nav', 'appWidgetPartnersCarouselNav'); // Карусель "Наши партнеры" с навигацией
            // this.installController('.js-accounting-calc', 'appWidgetAccountingCalculator'); // Калькулятор стоимости услуг
            //
            // this.installController('.js-partners-carousel-mob', 'appWidgetPartnersCarouselMob'); // Карусель "Наши партнеры мобилка"
            // this.installController('.js-burger-mobile', 'appWidgetBurgerMobile'); // Обработчик нового мобильного меню
            // this.installController('p.accordion', 'appWidgetBlogAccordion'); // Обработчик нового мобильного меню
            this.installController('.js-logos-slider', 'appWidgetLogosSlider');
            this.installController('.js-show-content', 'appWidgetShowContent');
            this.installController('.js-main-nav', 'appWidgetMainNav');
            this.installController('.js-tabs', 'appWidgetTabList');
            this.installController('.js-fancy-modal-tabs', 'appWidgetFancyTabs');
        }
    });

    $(function () {
        window.application = new Application('body');
        window.application.bootstrap();
    });

}(jQuery));

function GTMpushEvent(event, eventCategory = '', eventLabel = '') {

    if (typeof dataLayer == "undefined") {
        console.log('dataLayer is undefined');
        return;
    }

    dataLayer.push({'event': event, 'eventCategory': eventCategory, 'eventLabel': eventLabel});

    console.info('GTMpushEvent: ' + event + ', GTMpushCategory: ' + eventCategory + ', GTMpushLabel: ' + eventLabel);
}

function GTMpushEventLoadForm(form_name, eventCategory = '') {

    if (typeof dataLayer == "undefined") {
        console.log('dataLayer is undefined');
        return;
    }

    if (form_name == 'CONTACT_US_FORM') {
        dataLayer.push({'event': 'MainFormLoad'});
        dataLayer.push({'event': 'Form_Main_Open', 'eventCategory': 'Form_Main'});
    }

    if (form_name == 'Form_Main_Foreign') {
        dataLayer.push({'event': 'MainFormLoad'});
        dataLayer.push({'event': 'Form_Main_Foreign_Open', 'eventCategory': 'Form_Main_Foreign'});
    }

    if (form_name == 'FORM_UPRAVLENKA') {
        dataLayer.push({'event': 'Form_Upravlenka_Access_Open', 'eventCategory': 'Form_Upravlenka_Access'});
    }

    if (form_name == 'CONTACT_US_ACCOUNTING_MOBILE_FORM') {
        dataLayer.push({'event': 'Form_BS_outsourcing_Mobile_Open', 'eventCategory': 'Form_BS_outsourcing_mobile'});
    }

    if (form_name == 'CONTACT_US_OUTSOURCING_FORM') {
        dataLayer.push({'event': 'MainFormLoad'});
    }

    if (form_name == 'CALLBACK_FORM') {
        dataLayer.push({'event': '1CWACallbackFormLoad'});
        dataLayer.push({'event': 'Form_Callback_Long_Open', 'eventCategory': 'Form_Callback_Long'});
    }

    if (form_name == 'CALLBACK_FORM_SHORT') {
        dataLayer.push({'event': '1CWACallbackFormLoad'});
        dataLayer.push({'event': 'Form_Callback_Short_Open', 'eventCategory': 'Form_Callback_Short'});
    }

    if (form_name == 'CALLBACK_FORM_BASA') {
        dataLayer.push({'event': 'Form_Proverim_Bazu_Open', 'eventCategory': 'Form_Proverim_Bazu'});
    }

    if (form_name == 'SEND_VCARD_FORM') {
        dataLayer.push({'event': 'FormBusinesscardEmailLoad'});
        dataLayer.push({'event': 'Form_Visitka_Open', 'eventCategory': 'Form_Visitka'});
    }

    if (form_name == 'BREAKFAST_INVITE_FORM') {
        dataLayer.push({'event': 'getInvitation'});
    }

    if (form_name == 'BUSINESS_CLUB_UNICREDIT_FORM') {
        dataLayer.push({'event': 'getInvitation'});
    }

    if (form_name == 'Club_DIRECTOR') {
        dataLayer.push({'event': 'getInvitation'});
    }

    if (form_name == 'ZERO_CONTACT_FORM') {
        dataLayer.push({'event': 'NullFormLoad'});
        dataLayer.push({'event': 'Form_Nulevka_Open', 'eventCategory': 'Form_Nulevka'});
    }

    if (form_name == 'PAYMENT_FORM') {
        dataLayer.push({'event': 'NullFormBuyLoad'});
        dataLayer.push({'event': 'Form_Pay_By_Card_Open', 'eventCategory': 'Form_Pay_By_Card'});
    }

    if (form_name == 'POPUP_SUBSCRIPTION') {
        dataLayer.push({'event': 'InfoSubscriptionPopupLoad'});
        dataLayer.push({'event': 'Form_Blog_Subscription_Open', 'eventCategory': 'Form_Blog_Subscription'});
    }

    if (form_name == 'POPUP_SIMPLY_SUBSCRIPTION') {
        dataLayer.push({'event': 'Form_Send_File_Open', 'eventCategory': 'Form_Send_File'});
    }

    if (form_name == 'finance_callback') {
        dataLayer.push({'event': 'Form_FRM_Open', 'eventCategory': 'Form_FRM'});
    }

    if (form_name == 'FORM_PAYROLL') {
        dataLayer.push({'event': 'Payroll_Quiz_Demo_Form_Open', 'eventCategory': 'Payroll_Quiz'});
    }

    console.info('GTMpushEventLoadForm: ' + form_name);
}

function GTMpushEventSendForm(form_name, eventCategory = '') {

    if (typeof dataLayer == "undefined") {
        console.log('dataLayer is undefined');
        return;
    }

    if (form_name == 'FORM_UPRAVLENKA') {
        dataLayer.push({'event': 'Form_Upravlenka_Access_Sent', 'eventCategory': 'Form_Upravlenka_Access'});
    }
    if (form_name == 'Form_Upravlenka_Mobile') {
        dataLayer.push({'event': 'Form_Upravlenka_Mobile_Sent', 'eventCategory': 'Form_Upravlenka_Mobile'});
    }

    if (form_name == 'FORM_PAYROLL') {
        dataLayer.push({'event': 'Payroll_Quiz_Demo_Form_Sent', 'eventCategory': 'Payroll_Quiz'});
    }

    if (form_name == 'CALLBACK_FORM_BASA') {
        dataLayer.push({'event': 'Form_Proverim_Bazu_Sent', 'eventCategory': 'Form_Proverim_Bazu'});
    }

    if (form_name == 'CONTACT_US_FORM') {
        dataLayer.push({'event': 'MainFormSent'});
        dataLayer.push({'event': 'Form_Main_Sent', 'eventCategory': 'Form_Main'});
        if (window.location.pathname == '/outsourcing/') {
            dataLayer.push({'event': 'Accountig1_Quiz_Main_Form_Sent', 'eventCategory': 'Accountig1_Quiz'});
        }
        if (window.location.pathname == '/payroll/') {
            dataLayer.push({'event': 'Payroll_Quiz_Main_Form_Sent', 'eventCategory': 'Payroll_Quiz'});
        }
    }

    if (form_name == 'Form_Main_Foreign') {
        dataLayer.push({'event': 'MainFormSent'});
        dataLayer.push({'event': 'Form_Main_Foreign_Sent', 'eventCategory': 'Form_Main_Foreign'});
    }

    if (form_name == 'CONTACT_US_ACCOUNTING_CALC_FORM') {
        dataLayer.push({
            'event': 'Form_Accounting_Calculator_Extended_Sent',
            'eventCategory': eventCategory,
            'eventLabel': 'Form_Accounting_Calculator_Extended'
        });
    }

    if (form_name == 'CONTACT_US_ACCOUNTING_MOBILE_FORM') {
        dataLayer.push({'event': 'Form_BS_outsourcing_Mobile_Sent', 'eventCategory': 'Form_BS_outsourcing_mobile'});
    }

    if (form_name == 'CONTACT_US_OUTSOURCING_FORM') {
        dataLayer.push({'event': 'MainFormSent'});
    }

    if (form_name == 'CALLBACK_FORM') {
        dataLayer.push({'event': '1CWACallbackFormSent'});
        dataLayer.push({'event': 'Form_Callback_Long_Sent', 'eventCategory': 'Form_Callback_Long'});
    }

    if (form_name == 'CALLBACK_FORM_SHORT') {
        dataLayer.push({'event': '1CWACallbackFormSent'});
        dataLayer.push({'event': 'Form_Callback_Short_Sent', 'eventCategory': 'Form_Callback_Short'});
    }

    if (form_name == 'SEND_VCARD_FORM') {
        dataLayer.push({'event': 'FormBusinesscardEmailSent'});
        dataLayer.push({'event': 'Form_Visitka_Sent', 'eventCategory': 'Form_Visitka'});
    }

    if (form_name == 'BREAKFAST_INVITE_FORM') {
        dataLayer.push({'event': 'businessBbreakfast'});
    }

    if (form_name == 'BUSINESS_CLUB_UNICREDIT_FORM') {
        dataLayer.push({'event': 'businessBbreakfast'});
    }

    if (form_name == 'Club_DIRECTOR') {
        dataLayer.push({'event': 'businessBreakfast'});
    }

    if (form_name == 'ZERO_CONTACT_FORM') {
        dataLayer.push({'event': 'NullFormSent'});
        dataLayer.push({'event': 'Form_Nulevka_Sent', 'eventCategory': 'Form_Nulevka'});
    }

    if (form_name == 'finance_callback') {
        dataLayer.push({'event': 'Form_FRM_Sent', 'eventCategory': 'Form_FRM'});
    }

    if (form_name == 'Payroll_Quiz_Calculator') {
        dataLayer.push({'event': 'Payroll_Quiz_Calculator_Sent', 'eventCategory': eventCategory});
    }

    if (form_name == 'Payroll_Quiz_Recount_Form') {
        dataLayer.push({'event': 'Payroll_Quiz_Recount_Form_Sent', 'eventCategory': eventCategory});
    }

    if (form_name == 'PAYMENT_FORM') {
        dataLayer.push({'event': 'NullFormBuySent'});
        dataLayer.push({'event': 'Form_Pay_By_Card_Sent', 'eventCategory': 'Form_Pay_By_Card'});
    }

    if (form_name == 'POPUP_SUBSCRIPTION') {
        dataLayer.push({'event': 'InfoSubscriptionPopupSent'});
        dataLayer.push({'event': 'Form_Blog_Subscription_Sent', 'eventCategory': 'Form_Blog_Subscription'});
    }

    if (form_name == 'PARTNER_SPECIAL') {
        dataLayer.push({'event': 'PartnerSpecialSent'});
    }

    if (form_name == 'POPUP_SIMPLY_SUBSCRIPTION') {
        dataLayer.push({'event': 'Form_Send_File_Sent', 'eventCategory': 'Form_Send_File'});
    }

    console.info('GTMpushEventSendForm: ' + form_name + ', GTMpushCategory: ' + eventCategory);

}

function GTMpushEventTouchForm(form_name, eventCategory = '', field_name = '') {

    if (typeof dataLayer == "undefined") {
        console.log('dataLayer is undefined');
        return;
    }

    if (form_name == 'CONTACT_US_ACCOUNTING_CALC_FORM') {
        eventCategory = 'Form_Accounting_Calculator_Extended';
    }

    if (form_name == 'CALLBACK_FORM_BASA') {
        eventCategory = 'Form_Proverim_Bazu';
    }

    if (form_name == 'finance_callback') {
        eventCategory = 'Form_FRM';
    }

    if (form_name == 'FORM_UPRAVLENKA') {
        eventCategory = 'Form_Upravlenka_Access';
    }

    if (form_name == 'Form_Upravlenka_Mobile') {
        eventCategory = 'Form_Upravlenka_Mobile';
    }

    if (form_name == 'CONTACT_US_FORM') {
        dataLayer.push({'event': 'MainFormBeginFilling'});
        eventCategory = 'Form_Main';
    }

    if (form_name == 'Form_Main_Foreign') {
        dataLayer.push({'event': 'MainFormBeginFilling'});
        eventCategory = 'Form_Main_Foreign';
    }

    if (form_name == 'CONTACT_US_OUTSOURCING_FORM') {
        dataLayer.push({'event': 'MainFormBeginFilling'});
    }

    if (form_name == 'CONTACT_US_ACCOUNTING_MOBILE_FORM') {
        eventCategory = 'Form_BS_outsourcing_mobile';
    }

    if (form_name == 'CALLBACK_FORM') {
        dataLayer.push({'event': '1CWACallbackBeginFilling'});
        eventCategory = 'Form_Callback_Long';
    }

    if (form_name == 'CALLBACK_FORM_SHORT') {
        dataLayer.push({'event': '1CWACallbackBeginFilling'});
        eventCategory = 'Form_Callback_Short';
    }

    if (form_name == 'SEND_VCARD_FORM') {
        eventCategory = 'Form_Visitka';
        dataLayer.push({'event': 'FormBusinesscardEmailBeginFilling'});
    }

    if (form_name == 'BREAKFAST_INVITE_FORM') {
        dataLayer.push({'event': 'BuisnessBreakfastBeginFilling'});
    }

    if (form_name == 'ZERO_CONTACT_FORM') {
        eventCategory = 'Form_Nulevka';
        dataLayer.push({'event': 'NullFormBeginFilling'});
    }

    if (form_name == 'PAYMENT_FORM') {
        eventCategory = 'Form_Pay_By_Card';
        dataLayer.push({'event': 'NullFormBuyBeginFilling'});
    }

    if (form_name == 'POPUP_SUBSCRIPTION') {
        eventCategory = 'Form_Blog_Subscription';
        dataLayer.push({'event': 'InfoSubscriptionPopupBeginFilling'});

        if (field_name == 'popup_subs_rubric_2') {
            dataLayer.push({'event': eventCategory + '_Position_Owner', 'eventCategory': eventCategory});
        }
        if (field_name == 'popup_subs_rubric_3') {
            dataLayer.push({'event': eventCategory + '_Position_Foreign', 'eventCategory': eventCategory});
        }
        if (field_name == 'popup_subs_rubric_4') {
            dataLayer.push({'event': eventCategory + '_Position_Main_Accountant', 'eventCategory': eventCategory});
        }
        if (field_name == 'popup_subs_rubric_5') {
            dataLayer.push({'event': eventCategory + '_Position_Financial_Director', 'eventCategory': eventCategory});
        }
        if (field_name == 'popup_subs_rubric_6') {
            dataLayer.push({'event': eventCategory + '_Position_HR_Director', 'eventCategory': eventCategory});
        }
        if (field_name == 'popup_subs_rubric_7') {
            dataLayer.push({'event': eventCategory + '_Position_Other', 'eventCategory': eventCategory});
        }
        if (field_name == 'popup_subs_rubric_moscow') {
            dataLayer.push({'event': eventCategory + '_City_Moscow', 'eventCategory': eventCategory});
        }
        if (field_name == 'popup_subs_rubric_spb') {
            dataLayer.push({'event': eventCategory + '_City_Spb', 'eventCategory': eventCategory});
        }
        if (field_name == 'popup_subs_rubric_other') {
            dataLayer.push({'event': eventCategory + '_City_Other', 'eventCategory': eventCategory});
        }

    }

    if (form_name == 'PARTNER_SPECIAL') {
        dataLayer.push({'event': 'PartnerSpecialBeginFilling'});
    }

    if (form_name == 'POPUP_SIMPLY_SUBSCRIPTION') {
        eventCategory = 'Form_Send_File';
    }

    if (form_name == 'Payroll_Quiz_Calculator') {
        eventCategory = 'Payroll_Quiz_Calculator';
    }

    if (form_name == 'Payroll_Quiz_Recount_Form') {
        eventCategory = 'Payroll_Quiz_Recount_Form';
    }

    if (form_name == 'FORM_PAYROLL') {
        eventCategory = 'Payroll_Quiz_Demo_Form';
    }

    if (field_name == 'FORM_PHONE') {
        dataLayer.push({'event': eventCategory + '_Filled_Phone', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_EMAIL') {
        dataLayer.push({'event': eventCategory + '_Filled_Email', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_NAME') {
        dataLayer.push({'event': eventCategory + '_Filled_Name', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_COMMENT') {
        dataLayer.push({'event': eventCategory + '_Filled_Comment', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_TEL') {
        dataLayer.push({'event': eventCategory + '_Click_Phone', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_PAY') {
        dataLayer.push({'event': eventCategory + '_Click_Card', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_INN') {
        dataLayer.push({'event': eventCategory + '_Filled_INN', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_TIME') {
        dataLayer.push({'event': eventCategory + '_Filled_Calling_Time', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_WHATSAPP') {
        dataLayer.push({'event': eventCategory + '_Filled_Whatsapp', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_FACEBOOK') {
        dataLayer.push({'event': eventCategory + '_Filled_Facebook', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_SKYPE') {
        dataLayer.push({'event': eventCategory + '_Filled_Skype', 'eventCategory': eventCategory});
    }
    if (field_name == 'FORM_CONCRETELY_INTERESTED') {
        dataLayer.push({'event': eventCategory + '_Filled_Interested', 'eventCategory': eventCategory});
    }
    if (field_name.indexOf("FORM_INTERESTED_") !== -1) {
        index = field_name.replace("FORM_INTERESTED_","");
        dataLayer.push({'event': eventCategory + '_Choosed_Interested'+index, 'eventCategory': eventCategory});
    }

    console.info('GTMpushEventTouchForm: ' + form_name);

}

function GTMpushEventErrorForm(form_name, eventCategory = '', eventLabel = '') {

    if (typeof dataLayer == "undefined") {
        console.log('dataLayer is undefined');
        return;
    }

    if (form_name == 'CONTACT_US_ACCOUNTING_CALC_FORM') {
        event = 'Form_Accounting_Calculator_Extended_Error';
        eventLabel = 'Form_Accounting_Calculator_Extended';
    } else if (form_name == 'FORM_UPRAVLENKA') {
        event = 'Form_Upravlenka_Access_Error';
        eventCategory = 'Form_Upravlenka_Access';
    } else if (form_name == 'Form_Upravlenka_Mobile') {
        event = 'Form_Upravlenka_Mobile_Error';
        eventCategory = 'Form_Upravlenka_Mobile';
    } else if (form_name == 'CALLBACK_FORM') {
        event = 'Form_Callback_Long_Error';
        eventCategory = 'Form_Callback_Long';
    } else if (form_name == 'CONTACT_US_FORM') {
        event = 'Form_Main_Error';
        eventCategory = 'Form_Main';
    } else if (form_name == 'Form_Main_Foreign') {
        event = 'Form_Main_Foreign_Error';
        eventCategory = 'Form_Main_Foreign';
    } else if (form_name == 'SEND_VCARD_FORM') {
        event = 'Form_Visitka_Error';
        eventCategory = 'Form_Visitka';
    } else if (form_name == 'ZERO_CONTACT_FORM') {
        event = 'Form_Nulevka_Error';
        eventCategory = 'Form_Nulevka';
    } else if (form_name == 'PAYMENT_FORM') {
        event = 'Form_Pay_By_Card_Error';
        eventCategory = 'Form_Pay_By_Card';
    } else if (form_name == 'POPUP_SIMPLY_SUBSCRIPTION') {
        event = 'Form_Send_File_Error';
        eventCategory = 'Form_Send_File';
    } else if (form_name == 'CALLBACK_FORM_BASA') {
        event = 'Form_Proverim_Bazu_Error';
        eventCategory = 'Form_Proverim_Bazu';
    } else if (form_name == 'finance_callback') {
        event = 'Form_FRM_Error';
        eventCategory = 'Form_FRM';
    } else if (form_name == 'CONTACT_US_ACCOUNTING_MOBILE_FORM') {
        event = 'Form_BS_outsourcing_mobile_Error';
        eventCategory = 'Form_BS_outsourcing_mobile';
    } else if (form_name == 'CALLBACK_FORM_SHORT') {
        event = 'Form_Callback_Short_Error';
        eventCategory = 'Form_Callback_Short';
    } else if (form_name == 'POPUP_SUBSCRIPTION') {
        event = 'Form_Blog_Subscription_Error';
        eventCategory = 'Form_Blog_Subscription';
    } else if (form_name == 'FORM_PAYROLL') {
        event = 'Payroll_Quiz_Demo_Form_Error';
        eventCategory = 'Payroll_Quiz';
    } else if (form_name == 'Payroll_Quiz_Recount_Form') {
        event = 'Payroll_Quiz_Recount_Form_Error';
        eventCategory = 'Payroll_Quiz';
    } else if (form_name == 'Payroll_Quiz_Calculator') {
        event = 'Payroll_Quiz_Calculator_Error';
        eventCategory = 'Payroll_Quiz';
    } else {
        event = 'Error';
        eventLabel = form_name;
    }

    dataLayer.push({'event': event, 'eventCategory': eventCategory, 'eventLabel': eventLabel});

    console.info('GTMpushEventErrorForm: ' + form_name + ', GTMpushCategory: ' + eventCategory + ', GTMpushLabel: ' + eventLabel);
}
document.addEventListener('DOMContentLoaded', function() {
    var side = 'right';
    if (window.innerWidth <= 480){
        side = 'bottom';
    }

    $(document).find('.js-tooltip-accounting-new').tooltipster({
        side: [side],
        theme: "tooltipster-light-new",
        contentAsHTML: true,
        animation: "fade",
        interactive: true,
        maxWidth: 750,
        functionPosition: function(instance, helper, position){
            let container = $('.js-tooltipster-accounting-new-container');

            if (typeof container.offset !== "undefined" && side === 'right') {
                if((container.offset().top - $(window).scrollTop()) > -100) {
                    position.coord.top = (container.offset().top - $(window).scrollTop() + 158);
                }

                //позиционирование при клике
                if (window.innerWidth <= 600){
                    position.coord.left -= 100;
                }
                position.size.width = window.innerWidth - position.coord.left - 20;

            }

            return position;
        },
        trigger:"custom",
        triggerOpen: {
            click: true,
            tap: true
        },
        triggerClose: {
            click: true,
            tap: true
        }
    });
});

$(function(){
    $('.js-events').on('click tap', '.js-event-get-offer-in-account', function(){

        if (typeof GTMpushEvent == 'function') {
            GTMpushEvent('Start_quiz');
        }

        if(typeof yaCounter26016240 == 'function'){
            yaCounter26016240.reachGoal('Start_quiz');
        }

        return true;
    });

    $('.js-events').on('click tap', '.js-event-show-tooltip', function(){

        if (typeof GTMpushEvent == 'function') {
            GTMpushEvent('Start_quiz_need_arguments');
        }

        if(typeof yaCounter26016240 == 'function'){
            yaCounter26016240.reachGoal('Start_quiz_need_arguments');
        }

        return true;
    });
});
$(document).ready(function () {

    $('[data-popup-beige]').magnificPopup({
        type: 'inline'
    });

    $(document).on('click', '.item-accordion .item-accordion__heading', function() {
        $('.item-accordion__heading.open').removeClass('open');
        $(this).addClass('open');

        $('.item-accordion__heading:not(.open)').next('.item-accordion__body').addClass('block-hidden');
        $('.item-accordion__heading:not(.open)').find('h3').removeClass('item-accordion__title-mobile');
        $('.item-accordion__heading:not(.open)').find('.arrow').removeClass('arrow--rotate');

        $('.item-accordion__heading.open').next('.item-accordion__body').toggleClass('block-hidden');
        $('.item-accordion__heading.open').find('h3').toggleClass('item-accordion__title-mobile');
        $('.item-accordion__heading.open').find('.arrow').toggleClass('arrow--rotate');
    });

    $('[data-tooltip_1]').hover(function(){
        $('.tooltip-one-content').fadeToggle(200);
    });

    $('[data-tooltip_2]').hover(function(){
        $('.tooltip-two-content').fadeToggle(200);
    });

    $('[data-tooltip_3]').hover(function(){
        $('.tooltip-three-content').fadeToggle(200);
    });

    $(document).on('click', '.tab', function(e) {
        var elem = $(this);
        var index = elem.index();

        elem.closest('.cabinet-features__content-tabs').find('.tab').removeClass('tab-active');
        elem.addClass('tab-active');
        //elem.closest('.cabinet-features__inner').find('.cabinet-features__content').removeClass('active-content').eq(index).addClass('active-content');
        elem.closest('.cabinet-features__inner').find('.cabinet-features__content').slideUp(1000).eq(index).slideDown(1000);
    });

    var swiperTabs = undefined;

    function swiperTabsInit() {
        var screenWidth = $(window).width();

        if (screenWidth < 768 && swiperTabs == undefined) {
            $('.cabinet-features__content-tabs').each(function (i) {
                swiperTabs = new Swiper($('.cabinet-features__content-tabs .swiper-container')[i], {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    freeMode: true,
                    // pagination: {
                    //   el: '.swiper-pagination',
                    //   clickable: true,
                    // },
                    navigation: {
                        nextEl: $('.tabs-btn-next')[i],
                        prevEl: $('.tabs-btn-prev')[i],
                    },
                });
            });
            console.log('initialized');
        } else if (screenWidth > 767 && swiperTabs != undefined) {
            swiperTabs.destroy();
            swiperTabs = undefined;
            // $('.product-previews__content .swiper-wrapper').removeAttr('style');
            // $('.product-previews__content .swiper-slide').removeAttr('style');
            console.log('destroyed');
        };
    };

    // swiperTabsInit();

    $(window).resize(function () {
        swiperTabsInit();
    });

    $('.reviews .swiper-container').each(function (i) {
        var swiperReviews = new Swiper($('.reviews .swiper-container')[i], {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoHeight: true,
            loop: true,
            pagination: {
                el: $('.reviews-pagination')[i],
                clickable: true,
            },
            navigation: {
                nextEl: $('.reviews-btn-next')[i],
                prevEl: $('.reviews-btn-prev')[i],
            },
        });
    });

    $('.selection__button').click(function (e) {
        e.preventDefault();

        $(this).closest('.selection__buttons').children().removeClass('selected');
        $(this).addClass('selected');

    });

    $(document).on('click', '.tabs .tabs__btn', function(e) {
        e.preventDefault();
        var el = $(this);
        var index = el.index();
        el.closest('.tabs').find('.tabs__btn').removeClass('selected');
        el.addClass('selected');
        el.closest('.tabs').find('.tabs__content').removeClass('active').eq(index).addClass('active');
    });

    $('.why-we__tab-content .swiper-container').each(function (i) {
        var swiperPeronalCard = new Swiper($('.why-we__tab-content .swiper-container')[i], {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoHeight: true,
            loop: true,
            navigation: {
                nextEl: $('.swiper-buttonCard-next')[i],
                prevEl: $('.swiper-buttonCard-prev')[i],
            },
        });
    });


    $('.why-we__tab').click('button:not(.active-tab)', function () {
        $(this).addClass('active-tab').siblings().removeClass('active-tab').closest('.why-we__inner').find('.why-we__tab-content').removeClass('content-active').eq($(this).index()).addClass('content-active');
    });

    $(document).on('mouseenter mouseleave', '[data-feature-item]', function () {
        let el = $(this);
        let featureItem = $('[data-feature-item]');

        el.toggleClass('features-hover').find('.arrow-green').toggleClass('arrow-green--show');
        featureItem.not($(this)).each(function () {
            featureItem.toggleClass('features-box-item-off');
        });
        el.removeClass('features-box-item-off');
    });

    $(document).on('mouseenter mouseleave', '#feature-item-1', function (e) {
        $('.data-row-img-1 div:eq(0), .data-row-img-1 div:eq(1)').toggleClass('feature-item-img-active');
        $('.data-row-img-2 div:eq(2)').toggleClass('feature-item-img-active');
        if (e.type === 'mouseenter') {
            setIndustryGtmEvents();
        }
        $('.data-row-img-1 div:eq(2), .data-row-img-1 div:eq(3)').toggleClass('feature-item-img-off');
        $('.data-row-img-2 div:eq(0), .data-row-img-2 div:eq(1), .data-row-img-2 div:eq(3)').toggleClass('feature-item-img-off');
    });

    $(document).on('mouseenter mouseleave', '#feature-item-2', function (e) {
        $('.data-row-img-1 div:eq(1)').toggleClass('feature-item-img-active');
        if (e.type === 'mouseenter') {
            setIndustryGtmEvents();
        }
        $('.data-row-img-1 div:eq(0), .data-row-img-1 div:eq(2), .data-row-img-1 div:eq(3)').toggleClass('feature-item-img-off');
        $('.data-row-img-2 div:eq(0), .data-row-img-2 div:eq(1), .data-row-img-2 div:eq(2), .data-row-img-2 div:eq(3)').toggleClass('feature-item-img-off');
    });

    $(document).on('mouseenter mouseleave', '#feature-item-3', function (e) {
        $('.data-row-img-1 div:eq(0), .data-row-img-1 div:eq(1), .data-row-img-1 div:eq(2), .data-row-img-1 div:eq(3)').toggleClass('feature-item-img-active');
        $('.data-row-img-2 div:eq(1), .data-row-img-2 div:eq(2), .data-row-img-2 div:eq(3)').toggleClass('feature-item-img-active');
        if (e.type === 'mouseenter') {
            setIndustryGtmEvents();
        }
        $('.data-row-img-2 div:eq(0)').toggleClass('feature-item-img-off');
    });

    $(document).on('mouseenter mouseleave', '#feature-item-4', function (e) {
        $('.data-row-img-1 div:eq(2), .data-row-img-1 div:eq(3)').toggleClass('feature-item-img-active');
        $('.data-row-img-2 div:eq(3)').toggleClass('feature-item-img-active');
        if (e.type === 'mouseenter') {
            setIndustryGtmEvents();
        }
        $('.data-row-img-1 div:eq(0), .data-row-img-1 div:eq(1)').toggleClass('feature-item-img-off');
        $('.data-row-img-2 div:eq(0), .data-row-img-2 div:eq(1), .data-row-img-2 div:eq(2)').toggleClass('feature-item-img-off');
    });

    $(document).on('mouseenter mouseleave', '#feature-item-5', function (e) {
        $('.data-row-img-1 div:eq(0), .data-row-img-1 div:eq(1), .data-row-img-1 div:eq(2), .data-row-img-1 div:eq(3)').toggleClass('feature-item-img-active');
        $('.data-row-img-2 div:eq(0), .data-row-img-2 div:eq(1), .data-row-img-2 div:eq(2), .data-row-img-2 div:eq(3)').toggleClass('feature-item-img-active');
        if (e.type === 'mouseenter') {
            setIndustryGtmEvents();
        }
    });

    $(document).on('mouseenter mouseleave', '#feature-item-6', function (e) {
        $('.data-row-img-1 div:eq(0), .data-row-img-1 div:eq(1), .data-row-img-1 div:eq(2), .data-row-img-1 div:eq(3)').toggleClass('feature-item-img-active');
        $('.data-row-img-2 div:eq(0), .data-row-img-2 div:eq(1), .data-row-img-2 div:eq(2), .data-row-img-2 div:eq(3)').toggleClass('feature-item-img-active');
        if (e.type === 'mouseenter') {
            setIndustryGtmEvents();
        }
    });

    $('[data-check-question]').on('change', function () {

        let checked = false;
        //let button = $('.question-footer__btn');

        $('[data-check-question]').each(function () {
            if ($(this).prop('checked')) {
                checked = true;
                return false;
            }
        });
        if (checked) {
            showSpecialBlock();
        } else {
            defaultBlocks();
        }
    });

    // Порядок и отображение блоков по дефолту
    function defaultBlocks() {
        $(`[data-section=1],
                [data-section=4],
                [data-section=9],
                [data-section=10],
                [data-section=11],
                [data-section=14],
                [data-section=15],
                [data-section=18],
                [data-section=20],
                [data-section=21],
                [data-section=22],
                [data-section=23]`).show();

        $(`[data-section=2],
                [data-section=3],
                [data-section=5],
                [data-section=5-1],
                [data-section=6],
                [data-section=7],
                [data-section=11-1],
                [data-section=17],
                [data-section=19],
                [data-section=21-1],
                [data-section=21-2],
                [data-section=22-1]`).hide();
    }

    defaultBlocks();

    function showSpecialBlock() {
        //let button = $('.question-footer__btn');
        let check = ':checked';

        /*button.click(function (e) {*/

        //e.preventDefault();

        defaultBlocks();

        if ($('#accountant-quit').is(check)) {
            $('[data-section=2]').show();
            // } else {
            //     $('[data-section=2]').hide();
        }

        if ($('#accounting-fails').is(check)) {
            $('[data-section=5]').show();
            $('[data-section=5-1]').show();
            // } else {
            //     $('[data-section=5]').hide();
            //     $('[data-section=5-1]').hide();
        }

        if ($('#сost-reduction').is(check)) {
            $('[data-section=3]').show();
            // } else {
            //     $('[data-section=3]').hide();
        }

        if ($('#no-staff').is(check)) {
            $('[data-section=6]').show();
            // } else {
            //     $('[data-section=6]').hide();
        }

        if ($('#independent-accounting').is(check)) {
            $('[data-section=7]').show();
            // } else {
            //     $('[data-section=7]').hide();
        }

        if ($('#choose-contractor').is(check)) {
            $('[data-section=4]').hide();
            $('[data-section=9]').hide();
            $('[data-section=11]').hide();
            $('[data-section=11-1]').show();
            $('[data-section=14]').hide();
            $('[data-section=20]').hide();
            $('[data-section=21]').hide();

            $('[data-content-tabs]').removeClass('active');
            $('[data-tabs-btn]').removeClass('selected');
            $('[data-content-tabs=3]').addClass('active');
            $('[data-tabs-btn=3]').addClass('selected');
            // } else {
            //     $('[data-section=4]').show();
            //     $('[data-section=9]').show();
            //     $('[data-section=11]').show();
            //     $('[data-section=11-1]').hide();
            //     $('[data-section=14]').show();
            //     $('[data-section=18]').hide();
            //     $('[data-section=20]').show();
            //     $('[data-section=21]').show();

            //     $('[data-content-tabs=1]').addClass('active');
            //     $('[data-tabs-btn=1]').addClass('selected');
            //     $('[data-content-tabs=3]').removeClass('active');
            //     $('[data-tabs-btn=3]').removeClass('selected');
        }

        if ($('#accountant-quit').is(check) && $('#no-staff').is(check)) {
            $(`[data-section=2],
                    [data-section=6]`).show();
        }

        if ($('#сost-reduction').is(check) && $('#accounting-fails').is(check)) {
            $(`[data-section=3],
                    [data-section=5],
                    [data-section=6]`).show();
        }

        if ($('#choose-contractor').is(check) && $('#accounting-fails').is(check)) {
            $(`[data-section=3],
                    [data-section=5],
                    [data-section=6]`).show();
            $('[data-section=9]').hide();
        }

        /*$('html, body').animate({
                scrollTop: parseInt($("#advantages1").offset().top)
            }, 2000);*/

        /*});*/
    }

    //showSpecialBlock();

    // Показ секции с тестом при выборе таба "Штатная бухгалтерия"
    $('.why-we__tab').click(function() {
        var $regAccTab = $('[data-regular-accounting]');

        if ($regAccTab.hasClass('content-active')) {
            $('[data-section=17]').show();
        }
    });

    $(document).on('scroll', function () {
        var postion = $('[data-block-mob-feedback]').offset().top -= 750;
        var height = $('[data-block-mob-feedback]').height();
        var scroll = $(document).scrollTop();
        var topMargin = 9999;

        if (scroll > postion && scroll < (postion + height + topMargin)) {
            $('.fixed-btn-mobile').hide();
        } else {
            $('.fixed-btn-mobile').show();
        }
    });


    // Overflow body fix on iOs
    $('.js-get-form.fixed-btn-mobile').on('click', function () {
        $('body').addClass('no-scroll');

        $('.fancybox-overlay').on('click', function (e) {
            if (e.target.className === 'fancybox-overlay fancybox-overlay-fixed') {
                $('body').removeClass('no-scroll');
            };
        })
    });

    $(document).on('click', '.fancybox-item.fancybox-close', function () {
        $('body').removeClass('no-scroll');
    });
});
$(document).ready(function () {

    $(function () {
        $('.useful-features__tabs').on('click', 'button.useful-features__tab:not(.active)', function () {
            $(this).addClass('active').siblings().removeClass('active').closest('.useful-features__content').find('.useful-features__body').removeClass('active').eq($(this).index()).addClass('active');
        });
    });

    $(function () {
        $('.useful-features__body-btn--left').click(function () {
            $('[data-window-1]').removeClass('active');
            $('[data-window-2]').addClass('active');
        });

        $('.useful-features__body-btn--right').click(function () {
            $('[data-window-2]').removeClass('active');
            $('[data-window-1]').addClass('active');
        });
    });

    $(function() {
        $('.useful-features__body-btn').click(function(){
            $(this).addClass('active');
            $('.useful-features__body-btn').not(this).removeClass('active');
        });
    });

    $(function () {
        $('.useful-features-mobile__head').click(function () {
            var el = $(this);
            var top = el.offset().top;

            $(this).toggleClass('active');
            $(this).next().toggleClass('active');
            $('.useful-features-mobile__head').not(this).removeClass('active');
            $('.useful-features-mobile__head').not(this).parent().find('.useful-features-mobile__body').removeClass('active');

            setTimeout(function() {
                var top = el.offset().top - 50;
                $('html, body').animate({scrollTop: top + 'px'}, 500);
            }, 100);
        });
    });

});
(function ($) {
    App.Payment = App.Payment || {};
    App.Payment.FormAjax = can.Control.extend(
        {
            pluginName: 'appPaymentFormAjax',
            defaults: {
                gateway: '/ajax/forms/payment/'
            }
        },
        {
            init: function () {
                this.form = this.element.find('form');
                this.formName = this.form.attr('name');
                this.gateway = this.form.attr('action');
                this.gtmCategory = this.form.attr('gtmcategory');

                this.formFio = this.form.find('input[data-fieldtype="FORM_NAME"]');
                this.formInn = this.form.find('input[data-fieldtype="FORM_INN"]');
                this.formPhone = this.form.find('input[data-fieldtype="FORM_PHONE"]');
                this.formEmail = this.form.find('input[data-fieldtype="FORM_EMAIL"]');

                if (typeof GTMpushEventLoadForm == "function"){
                    GTMpushEventLoadForm(this.formName);
                }

                if(this.form.data('validate') && !this.form.data('validate-nomsg')) {
                    this.form.validate(window.application.validateOptionsDefault);
                } else {
                    this.form.validate(window.application.validateOptionsNoMsg);
                }

                this.form.find('input[data-fieldtype="FORM_IP"]').val(Geo.ip);

                this.formTouchEvent();

                this.on(this.form, 'submit', 'submitForm');

                if (this.formFio) {
                    this.on(this.formFio, 'change', 'changeName');
                    this.onceNameSend = true;
                }
                if (this.formInn) {
                    this.on(this.formInn, 'change', 'changeInn');
                    this.onceInnSend = true;
                }
                if (this.formPhone) {
                    this.on(this.formPhone, 'change', 'changePhone');
                    this.oncePhoneSend = true;
                }
                if (this.formEmail) {
                    this.on(this.formEmail, 'change', 'changeEmail');
                    this.onceEmailSend = true;
                }
            },

            changeName: function (el, ev) {
                if (this.form.data('validate') && this.onceNameSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_NAME');
                    this.onceNameSend = false;
                }
            },
            changeInn: function (el, ev) {
                if (this.form.data('validate') && this.onceInnSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_INN');
                    this.onceInnSend = false;
                }
            },
            changePhone: function (el, ev) {
                if (this.form.data('validate') && this.oncePhoneSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_PHONE');
                    this.oncePhoneSend = false;
                }
            },
            changeEmail: function (el, ev) {
                if (this.form.data('validate') && this.onceEmailSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_EMAIL');
                    this.onceEmailSend = false;
                }
            },

            formTouchEvent: function () {

                var self = this, formInputs = this.form.find(':input');

                self.formTouch = false;

                formInputs.on('focus', sendTouchEvent);
                formInputs.on('change', sendTouchEvent);

                function sendTouchEvent () {
                    if (!self.formTouch) {
                        self.formTouch = true;
                        formInputs.off('focus', sendTouchEvent);
                        formInputs.off('change', sendTouchEvent);
                        if (typeof GTMpushEventTouchForm == 'function') {
                            GTMpushEventTouchForm(self.formName);
                        }
                    }
                }
            },

            submitForm: function(el, ev) {
                ev.preventDefault();

                if(this.form.data('validate') && !this.form.valid()) {
                    if (typeof GTMpushEventErrorForm == "function"){
                        GTMpushEventErrorForm(this.formName, this.gtmCategory);
                    }
                    return false;
                }

                this.form.startWaiting();

                $.post(this.gateway, this.form.serialize(), function(){}, 'json')
                    .done(this.proxy('doneSubmit'))
                    .fail(this.proxy('failSubmit'));

            },

            doneSubmit: function (res){

                if (typeof GTMpushEventSendForm == "function"){
                    GTMpushEventSendForm(this.formName, this.gtmCategory);
                }

                $.fancybox({
                    wrapCSS : 'modal-wrapper',
                    margin : ($(window).width() > 937) ? 20 : 5,
                    padding : 15,
                    helpers : {
                        overlay : {
                            css : {
                                'background' : 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    'content' : $(res.html)
                });
            },

            failSubmit: function (res){
                if (typeof GTMpushEventErrorForm == "function"){
                    GTMpushEventErrorForm(this.formName, this.gtmCategory);
                }
                this.element.html($(res.responseText).html());
                //this.form = this.element.find('form');
                //this.gateway = this.form.attr('action');
                //this.on(this.form, 'submit', 'submitForm');
            }
        }
    );
}(jQuery));
(function ($) {
    App.Payment = App.Payment || {};
    App.Payment.Input = can.Control.extend(
        {
            pluginName: 'appPaymentInput',
            defaults: {
                gateway: '/ajax/forms/payment/'
            }
        },
        {
            init: function () {
                //this.element.validate(window.application.validateOptionsDefault);
                this.on(this.element, 'submit', 'submitForm');
            },

            submitForm: function(el, ev) {
                ev.preventDefault();

                if(this.element.data('validate') && !this.element.valid()) {
                    return false;
                }

                this.element.startWaiting();

                var postData = { action: 'getForm', summ: this.element.find('#payment-sum').val(), service: this.element.find('#payment-service').val() };

                $.post(this.options.gateway, postData, function(){})
                    .done(this.proxy('doneSubmit'))
                    .fail(this.proxy('failSubmit'));

            },

            failSubmit: function (res){
                this.element.endWaiting();
                console.error(res);
            },

            doneSubmit: function (res){
                this.element.endWaiting();
                $.fancybox({
                    wrapCSS : 'modal-wrapper',
                    margin : ($(window).width() > 937) ? 20 : 5,
                    padding : 15,
                    helpers : {
                        overlay : {
                            css : {
                                'background' : 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    beforeShow : function() {
                        window.application.installController('.js-form-ajax-payment', 'appPaymentFormAjax');
                    },
                    'content' : $(res)
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Payment = App.Payment || {};
    App.Payment.ZeroReportInput = can.Control.extend(
        {
            pluginName: 'appPaymentZeroReportInput',
            defaults: {
                gateway: '/ajax/forms/payment/'
            }
        },
        {
            init: function () {
                //this.element.validate(window.application.validateOptionsDefault);
                this.on(this.element, 'submit', 'submitForm');
            },

            submitForm: function(el, ev) {
                ev.preventDefault();

                if(this.element.data('validate') && !this.element.valid()) {
                    return false;
                }

                this.element.startWaiting();

                var postData = App.ZeroWebFormValues;

                $.post(this.options.gateway, postData, function(){})
                    .done(this.proxy('doneSubmit'))
                    .fail(this.proxy('failSubmit'));

            },

            failSubmit: function (res){
                this.element.endWaiting();
                console.error(res);
            },

            doneSubmit: function (res){
                this.element.endWaiting();
                $.fancybox({
                    wrapCSS : 'modal-wrapper',
                    margin : ($(window).width() > 937) ? 20 : 5,
                    padding : 15,
                    helpers : {
                        overlay : {
                            css : {
                                'background' : 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    beforeShow : function() {
                        window.application.installController('.js-form-ajax-payment', 'appPaymentFormAjax');
                    },
                    'content' : $(res)
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Payment = App.Payment || {};
    App.Payment.Input = can.Control.extend(
        {
            pluginName: 'appPaymentFormZeroType',
            defaults: {
                gateway: '/ajax/forms/contact_us_zero_order/'
            }
        },
        {
            init: function () {
                this.on(this.element, 'submit', 'submitForm');
            },

            submitForm: function(el, ev) {
                ev.preventDefault();

                this.element.startWaiting();

                console.log(App.ZeroWebFormValues);

                /* var postData = { action: 'getForm', sum: this.element.find('#payment-sum').val(), service: this.element.find('#payment-service').val() };

				$.post(this.options.gateway, postData, function(){})
					.done(this.proxy('doneSubmit'))
					.fail(this.proxy('failSubmit'));
					*/

            },

            failSubmit: function (res){
                this.element.endWaiting();
                console.error(res);
            },

            doneSubmit: function (res){
                this.element.endWaiting();
                $.fancybox({
                    wrapCSS : 'modal-wrapper',
                    margin : ($(window).width() > 937) ? 20 : 5,
                    padding : 15,
                    helpers : {
                        overlay : {
                            css : {
                                'background' : 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    beforeShow : function() {
                        window.application.installController('.js-form-ajax-payment', 'appPaymentFormAjax');
                    },
                    'content' : $(res)
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Payment = App.Payment || {};
    App.Payment.PropsSet = can.Control.extend(
        {
            pluginName: 'appPaymentFormZeroPropsSet'
        },
        {
            init: function () {

                this.actionMethod = this.element.data('prop-act');

                this.arProps = this.element.data('prop') ? this.element.data('prop').split('|') : false;
                this.arVals = this.element.data('val') ? this.element.data('val').split('|') : false;

                if (this.arProps && this.arVals) {

                    switch (this.actionMethod) {
                        case 'click':
                            this.on(this.element, 'click', 'setByClick');
                            break;
                        case 'change':
                            break;
                    }

                }

            },


            setByClick: function (el, ev) {

                var self = this;

                this.arProps.forEach(function (prop,i) {
                    if(typeof self.arVals[i] !== "undefined") {
                        App.ZeroWebFormValues[prop] = self.arVals[i];
                        Cookies.set('ZeroWebFormValues_'+prop,self.arVals[i]);
                    }
                });

            }

        }
    );
}(jQuery));
$(document).ready(function() {
    $('.fancyfull').each(function() {
        $('<div class="fancyfull--image"></div>').insertBefore($(this)).append($(this).remove());
    });


    if($('.js-finance-slider') !== undefined) {
        financeOwl = $('.js-finance-slider').owlCarousel({
            items      : 1,
            loop       : true,
            nav        : true,
            dots       : true,
            dotsSpeed  : 800,
            autoplay   : true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            autoHeight : false
        });

        financeOwl.on('changed.owl.carousel', function(e) {
            financeOwl.trigger('stop.owl.autoplay');
            financeOwl.trigger('play.owl.autoplay');
            $('.js-finance-slider').find('img.lzy_img').each(function() {
                $(this).attr('src', $(this).data('src'));
                $(this).removeClass('lzy_img');
            });
        });

        financeOwl.on('initialized.owl.carousel', function(e) {
            $('.js-finance-slider').find('img.lzy_img').each(function() {
                $(this).attr('src', $(this).data('src'));
                $(this).removeClass('lzy_img');
            });
        });
    }

    if($('.js-accordion__item') !== undefined) {
        if (window.location.hash == '#big-business') {
            $('.js-accordion__item').each(function() {
                $(this).removeClass('open');
            });

            $('.js-accordion__description').each(function() {
                $(this).removeClass('open');
                $(this).hide();
            });

            $('.js-accordion__item[data-hash="big-business"]').each(function() {
                $(this).addClass('open');
            });

            $('.js-accordion__description[data-hash="big-business"]').each(function() {
                $(this).addClass('open');
                $(this).show();
            });
        }
    }

    $(document).on('click', '.js-finance--block-version_open_mobile', function() {
        var el = $(this).parent('div'),
            curHeight = el.height(),
            autoHeight = el.css('height', 'auto').height();
        if(el.hasClass('open')) {
            el.height(curHeight).animate({height : 74}, 1000);
            el.removeClass('open');
        } else {
            el.height(curHeight).animate({height : autoHeight}, 1000, function() { el.height('auto'); });
            el.addClass('open');
        }
    });

    $(document).on('click', '.js-img-accounting-modal', function() {
        if($(window).width() <= 768) {
            var pswpElement = document.querySelectorAll('.pswp')[0];

            var options = {
                closeOnScroll       : false,
                closeOnVerticalDrag : false,
                pinchToClose        : false
            };

            var swipeImage = $(this).attr('href');

            var tmpImg = new Image();

            tmpImg.src = $(this).attr('href');
            $(tmpImg).one('load', function() {
                orgWidth = tmpImg.width;
                orgHeight = tmpImg.height;

                var swipeItems = [
                    {
                        src : swipeImage,
                        w   : orgWidth,
                        h   : orgHeight
                    }
                ];

                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, swipeItems, options);
                gallery.init();
            });
        }
    });

    $(document).on('click', 'a[href$="#big-business"]', function() {
        if(window.location.pathname == '/finance-outsourcing/') {
            window.location.hash = '#big-business';
            document.location.reload();
        }

        /*$('.js-accordion__item').each(function() {
      $(this).removeClass('open');
    });

    $('.js-accordion__description').each(function() {
      $(this).removeClass('open');
      $(this).hide();
    });

    $('.js-accordion__item[data-hash="big-business"]').each(function() {
      $(this).addClass('open');
    });

    $('.js-accordion__description[data-hash="big-business"]').each(function() {
      $(this).addClass('open');
      $(this).show();
    });*/
    });
});

function financeNumAnimate() {
    var curTimeItem = 0;

    $('.finance--block-bank_time_title').each(function(index, element) {
        var time = 0;

        if(!$(element).hasClass('finance--block-bank_time_title_final')) {
            var timeoutList = [
                100,
                25,
                100
            ];

            var timerId1 = setInterval(function() {
                if (index == curTimeItem) {
                    $(element).text(time + ' мин');

                    if (index == 1 && time >= 40) {
                        $(element).addClass('finance--block-bank_time_title_final');
                        curTimeItem++;
                        clearInterval(timerId1);
                    } else if (time >= 10 && index != 1) {
                        $(element).addClass('finance--block-bank_time_title_final');
                        curTimeItem++;
                        clearInterval(timerId1);
                    }
                    time++;
                }
            }, timeoutList[index]);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    $(document).find('.js-quiz-help').tooltipster({
        side: ['bottom'],
        theme: "tooltipster-light-new",
        contentAsHTML: true,
        animation: "fade",
        interactive: true,
        maxWidth: 750
    });

    $(document).find('.js-quiz-help-mob').tooltipster({
        side: ['bottom'],
        theme: "tooltipster-light-new",
        contentAsHTML: true,
        animation: "fade",
        interactive: true,
        maxWidth: 400,
        trigger:"custom",
        triggerOpen: {
            click: true,
            tap: true
        },
        triggerClose: {
            click: true,
            tap: true
        }
    });

    $(document).find('.js-quiz-ask').tooltipster({
        side: ['left'],
        theme: "tooltipster-light-new",
        contentAsHTML: true,
        animation: "fade",
        interactive: true,
        maxWidth: 300,
        functionPosition: function(instance, helper, position){
            let container = $('.js-quiz-ask');

            if (typeof container.offset !== "undefined") {
                position.coord.top = position.coord.top + 70;

                if (window.innerWidth <= 600){
                    position.coord.left -= 100;
                }
                position.size.width = window.innerWidth - position.coord.left - 20;

            }

            return position;
        },
        trigger:"custom",
        triggerOpen: {
            click: true,
            tap: true
        },
        triggerClose: {
            click: true,
            tap: true
        }
    });

    $(document).on('click', '.js-quiz-step-button', function() {
        let step = $(this).data('step');

        if(!!step) {
            localStorage.setItem('quiz_step', step);

            $('.quiz-container').hide();
            $('.quiz-cnt-step-' + step).show();

            let destination = $('.quiz-cnt-step-' + step).offset().top - 80;

            $('html').animate({ scrollTop: destination }, 600);
        }
    });

    $(document).on('click', '.js-quiz-event-send', function() {
        let event = $(this).data('event');

        if(!!event && typeof GTMpushEvent == 'function') {
            GTMpushEvent(event);
        }
    });

    $(document).on('change', 'input[type="checkbox"], input[type="radio"]', function() {
        if($(this).prop('checked')) {
            if($(this).hasClass('js-quiz-check-event-send')) {
                let event = $(this).data('event');

                if(!!event && typeof GTMpushEvent == 'function') {
                    GTMpushEvent(event);
                }
            }

            $(this).parent('.quiz-radio-list').find('.quiz-radio-sublist').each(function() {
                $(this).hide();
            })

            if(!!$(this).data('sublist')) {
                $($(this).data('sublist')).show();
            }
        } else {
            $($(this).data('sublist')).hide();
        }

        if($(this).hasClass('js-quiz-btn')) {
            if($(".js-quiz-btn:checked").length > 0) {
                $('.quiz-btn-container').removeClass('inactive');
                $('.quiz-btn-submit').attr('disabled', false);
            } else {
                $('.quiz-btn-container').addClass('inactive');
                $('.quiz-btn-submit').attr('disabled', true);
            }
        }
    });

    $('.quiz-radio-list').find('input').each(function() {
        if(!!$(this).data('sublist')) {
            if($(this).prop('checked')) {
                $($(this).data('sublist')).show();
            } else {
                $($(this).data('sublist')).hide();
            }
        }
    });

    $('.quiz-check-list').find('input').each(function() {
        if(!!$(this).data('sublist')) {
            if($(this).prop('checked')) {
                $($(this).data('sublist')).show();
            } else {
                $($(this).data('sublist')).hide();
            }
        }
    });

    $(document).on('scroll', function() {
        if($(window).width() < '600') {
            var quizCntHeight = $('#js_quiz_cnt').height();

            if($('.quiz-button').hasClass('quiz-button-fixed')) {
                quizCntHeight += 96;
            }

            if(($('#js_quiz_cnt').offset().top - $(window).scrollTop()) <= 0 && ($('#js_quiz_cnt').offset().top + quizCntHeight - $(window).scrollTop()) > 750) {
                $('.quiz-button').addClass('quiz-button-fixed');
            } else {
                $('.quiz-button').removeClass('quiz-button-fixed');
            }
        }
    });

    $(document).on('click tap', '.quiz-check, .quiz-radio', function(e) {
        if($(e.target).hasClass('js-quiz-help')) {
            return false;
        }
    });

    if(!Modernizr.touch) {
        $('.quiz-check').addClass('quiz-check-no-touch')
    }
});
(function ($) {
    App.Subscribe = App.Subscribe || {};
    App.Subscribe.Popup = can.Control.extend(
        {
            pluginName: 'appSubscribePopup',
            defaults: {
                gateway: '/ajax/forms/subscribe/'
            }
        },
        {
            init: function () {

                var self = this;

                if(!Cookies.get('WA1C_USER_ADMIN') && !Cookies.get('WA1C_SUBSCR_EMAIL') && !Cookies.get('SubscribePopupShown')) {

                    setTimeout(
                        function () {
                            self.showForm();
                        },
                        90000
                    );

                }

            },

            showForm: function () {

                $.fancybox.open(
                    {'href' : this.options.gateway},
                    {
                        type : 'ajax',
                        wrapCSS : 'modal-wrapper',
                        margin : ($(window).width() > 937) ? 20 : 5,
                        padding : 15,
                        helpers : {
                            overlay : {
                                css : {
                                    'background' : 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                        beforeShow : function() {
                            window.application.installController('.js-form-ajax', 'appWidgetFormAjax');
                            var cExp = 1/24;
                            Cookies.set('SubscribePopupShown', 1, { expires: cExp });
                        },
                        afterShow : function () {
                            window.application.installController('form[name="POPUP_SUBSCRIPTION"]', 'appWidgetCheckSubscribeForm');
                        }
                    }
                );

            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.Accordion = can.Control.extend(
        {
            pluginName: 'appWidgetAccordion',
            defaults: {}
        },
        {
            init: function () {
                this.btn = this.element.find('.js-accordion__item');
                this.hiddenInfo = this.element.find('.js-accordion__description');

                this.element.find('.js-accordion__description').filter('.open').attr('style', 'display: block;');

                this.on(this.btn, 'click touchstart', 'showHideDescription');
            },

            'showHideDescription': function(el, ev) {
                ev.preventDefault();

                if(this.element.hasClass('js-accordion--each-item-can-open')) {
                    if(el.hasClass('open')) {
                        el.toggleClass('open');
                        el.next(this.hiddenInfo).slideUp().removeClass('open');
                    } else {
                        el.toggleClass('open');
                        el.next(this.hiddenInfo).slideDown().addClass('open');
                    }
                }

                if(!this.element.hasClass('js-accordion--each-item-can-open')) {
                    if(el.hasClass('open')) {
                        el.next(this.hiddenInfo).slideUp(400, function() {
                            el.removeClass('open');
                            el.next(this.hiddenInfo).removeClass('open');
                        });
                    } else {
                        this.btn.removeClass('open');
                        el.addClass('open');

                        if (!el.next().hasClass('open')) {
                            this.element.find(this.hiddenInfo).slideUp(400, function() {$(this).removeClass('open')});
                            el.next(this.hiddenInfo).slideDown().addClass('open');
                        }
                    }
                }
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.CostCalculator = can.Control.extend(
        {
            pluginName: 'appWidgetAccountingCalculator',
            defaults: {}
        },
        {
            init: function () {
                this.slider = this.element.find('.slider');
                this.sliderElem = this.element.find('.slider__elem');
                this.sliderResult = this.element.find('.slider__header-value');

                this.sliderProfit = this.element.find('.slider-profit .slider__elem');
                this.sliderEmployeers = this.element.find('.slider-employeers .slider__elem');

                this.sliderProfitResult = this.element.find('.slider-profit .slider__header-value');
                this.sliderEmployeersResult = this.element.find('.slider-employeers .slider__header-value');

                this.taxSystem = this.element.find('.selected[data-tax]');

                this.timeout = this.element.data('timeout');

                this.gtmCategory = this.element.data('gtmcategory') ? this.element.data('gtmcategory') : 'homepage';

                this.page = this.element.data('page') ? this.element.data('page') : false;

                this.clearPush = true;

                this.on(this.element, 'mouseleave', 'setPush');

                this.events = [];

                this.prices = [
                    "5 000 ₽ ‒ 7 000 ₽",
                    "22 000 ₽ ‒ 42 000 ₽",
                    "45 000 ₽ ‒ 80 000 ₽",
                    "80 000 ₽ ‒ 128 000 ₽",
                    "67 000 ₽ ‒ 115 000 ₽",
                    "150 000 ₽ ‒ 220 000 ₽", // 5
                    "220 000 ₽ ‒ 350 000 ₽",
                    "350 000 ₽ ‒ 500 000 ₽",
                    "от 500 000 ₽",
                    "‒",
                    "от 20 000 ₽", // 10
                    "30 000 ₽ ‒ 55 000 ₽",
                    "65 000 ₽ ‒ 100 000 ₽",
                    "90 000 ₽ ‒ 150 000 ₽",
                    "108 000 ₽ ‒ 156 000 ₽",
                    "179 000 ₽ ‒ 227 000 ₽", // 15
                    "291 000 ₽ ‒ 339 000 ₽",
                    "163 000 ₽ ‒ 233 000 ₽",
                    "191 000 ₽ ‒ 261 000 ₽",
                    "262 000 ₽ ‒ 332 000 ₽",
                    "374 000 ₽ ‒ 444 000 ₽", // 20
                    "233 000 ₽ ‒ 363 000 ₽",
                    "261 000 ₽ ‒ 391 000 ₽",
                    "332 000 ₽ ‒ 462 000 ₽",
                    "444 000 ₽ ‒ 574 000 ₽",
                    "363 000 ₽ ‒ 513 000 ₽", // 25
                    "391 000 ₽ ‒ 541 000 ₽",
                    "462 000 ₽ ‒ 612 000 ₽",
                    "574 000 ₽ ‒ 724 000 ₽",
                    "103 000 ₽ ‒ 163 000 ₽",
                    "131 000 ₽ ‒ 191 000 ₽", // 30
                    "202 000 ₽ ‒ 262 000 ₽",
                    "314 000 ₽ ‒ 374 000 ₽",
                    "от 513 000 ₽",
                    "от 541 000 ₽",
                    "от 612 000 ₽", // 35
                    "от 724 000 ₽",
                ];

                this.sliderProfitElem = this.element.find('.slider-profit .slider__elem');
                this.sliderEmplElem = this.element.find('.slider-employeers .slider__elem');
                this.finalPriceElem = this.element.find('.callback__header-value');

                //this.button = this.element.find('[data-calc-result]');

                this.selectionTaxButton = this.element.find('.selection__button');

                this.onceProfit = true;
                this.onceEmployeers = true;

                var self = this;

                this.sliderProfit.slider({
                    animate: "slow",
                    range: "min",
                    value: 15,
                    min: 0,
                    max: 150,
                    slide: function (event, ui) {
                        self.calcProfitResult(ui.value);
                        self.submitForm(true);
                        //self.button.removeAttr('disabled');
                        //self.button.addClass('animated');
                        if (self.onceProfit) {
                            self.pushMomentEvents(['Income'], self.gtmCategory);
                            self.onceProfit = false;
                        }
                    }
                });

                this.sliderEmployeers.slider({
                    animate: "slow",
                    range: "min",
                    value: 5,
                    min: 0,
                    max: 150,
                    slide: function (event, ui) {
                        self.calcEmplResult(ui.value);
                        self.submitForm(true);
                        //self.button.removeAttr('disabled');
                        //self.button.addClass('animated');
                        if (self.onceEmployeers) {
                            self.pushMomentEvents(['Employee'], self.gtmCategory);
                            self.onceEmployeers = false;
                        }
                    }
                });

                /*this.on(this.button, 'mouseover', () => {
                    this.button.removeClass('animated');
                });*/

                //this.on(this.button, 'click', 'submitForm');

                this.on(this.selectionTaxButton, 'click', 'selectTax');

                this.submitForm(false);
            },
            calcProfitResult: function (sliderValue) {

                this.sliderResult = this.element.find('.slider-profit .slider__header-value');

                switch (true) {
                    case sliderValue < 10:
                        this.printResult('до 10 млн');

                        break;
                    case sliderValue >= 10 && sliderValue <= 29:
                        this.printResult('до 30 млн');

                        break;
                    case sliderValue >= 30 && sliderValue <= 49:
                        this.printResult('до 80 млн');

                        break;
                    case sliderValue >= 50 && sliderValue <= 70:
                        this.printResult('до 120 млн');

                        break;
                    case sliderValue >= 71 && sliderValue <= 93:
                        this.printResult('до 400 млн');

                        break;
                    case sliderValue >= 94 && sliderValue <= 115:
                        this.printResult('до 800 млн');

                        break;
                    case sliderValue >= 116 && sliderValue <= 138:
                        this.printResult('до 2 млрд');

                        break;
                    case sliderValue >= 139:
                        this.printResult('более 2 млрд');

                        break;
                    default:
                        this.printResult('индивидуально');
                        break;
                }
            },
            calcEmplResult: function (sliderValue) {

                this.sliderResult = this.element.find('.slider-employeers .slider__header-value');

                switch (true) {
                    case sliderValue < 10:
                        this.printResult('до 30 чел');

                        break;
                    case sliderValue >= 10 && sliderValue <= 74:
                        this.printResult('до 100 чел');

                        break;
                    case sliderValue >= 75 && sliderValue <= 139:
                        this.printResult('до 500 чел');

                        break;
                    case sliderValue >= 140:
                        this.printResult('более 500 чел');

                        break;
                    default:
                        this.printResult('индивидуально');
                        break;
                }
            },
            printResult: function (text) {
                this.sliderResult.html(text);
            },
            submitForm: function (ev) {

                taxSystem = this.element.find('.selected[data-tax]').data('tax');
                uiValue = this.sliderProfitElem.slider("value");
                uiValue2 = this.sliderEmplElem.slider("value");

                this.compare(uiValue, uiValue2, taxSystem);
                //console.log(this.page);


                if (ev) {

                    /*if (typeof GTMpushEvent == 'function') {
                            GTMpushEvent('Form_Accounting_Calculator_Extended_Click_Show_Result', this.gtmCategory, 'Form_Accounting_Calculator_Extended');
                    }*/
                    //this.button.attr('disabled', true); // После ручного расчета деактивирем кнопку
                    //this.button.removeClass('animated');
                    if (this.page == 'accounting') {
                        // Изменение страницы в зависимости от выбранных значений в калькуляторе для страницы accounting
                        if (uiValue <= 115) {
                            $('[data-section=11]').show();
                            $('[data-section=11-1]').hide();
                            $('[data-section=14]').show();

                            $('[data-content-tabs]').removeClass('active');
                            $('[data-tabs-btn]').removeClass('selected');

                            $('[data-section=18]').hide();
                            $('[data-section=21]').show();
                            $('[data-section=21-2]').hide();
                            $('[data-section=19]').hide();

                            $('[data-section=17]').show();
                            $('[data-section=18]').show();
                            $('[data-section=21]').hide();
                            $('[data-section=21-1]').show();
                            $('[data-section=22]').hide();
                            $('[data-section=22-1]').show();

                            $('[data-btn-innovations=3]').addClass('selected');
                            $('[data-content-innovations=3]').addClass('active');

                            $('[data-btn-innovations=1]').removeClass('selected');
                            $('[data-btn-innovations=2]').removeClass('selected');
                            $('[data-content-innovations=1]').removeClass('active');
                            $('[data-content-innovations=2]').removeClass('active');

                            $('[data-content-tabs=2]').addClass('active');
                            $('[data-tabs-btn=2]').addClass('selected');

                            $('[data-content-tabs=1], [data-content-tabs=3]').removeClass('active');
                            $('[data-tabs-btn=1], [data-tabs-btn=3]').removeClass('selected');


                            if (uiValue2 >= 75) {
                                $('[data-section=19]').hide();
                                $('[data-section=17]').hide();
                                $('[data-section=18]').hide();
                                $('[data-section=20]').hide();
                                $('[data-section=22-1]').hide();
                                $('[data-section=21-1]').hide();

                                $('[data-section=21]').show();
                                $('[data-section=22]').show();

                                $('[data-content-tabs]').removeClass('active');
                                $('[data-tabs-btn]').removeClass('selected');

                                $('[data-section=11]').hide();
                                $('[data-section=11-1]').show();
                                $('[data-section=14]').hide();

                                $('[data-content-tabs=3]').addClass('active');
                                $('[data-tabs-btn=3]').addClass('selected');
                                $('[data-section=18]').show();
                                $('[data-section=21]').hide();
                                $('[data-section=21-2]').show();
                            }


                        } else if (uiValue >= 116) {

                            $('[data-section=19]').hide();
                            $('[data-section=17]').hide();
                            $('[data-section=18]').hide();
                            $('[data-section=20]').hide();
                            $('[data-section=22-1]').hide();
                            $('[data-section=21-1]').hide();

                            $('[data-section=21]').show();
                            $('[data-section=22]').show();

                            $('[data-content-tabs]').removeClass('active');
                            $('[data-tabs-btn]').removeClass('selected');

                            $('[data-section=11]').hide();
                            $('[data-section=11-1]').show();
                            $('[data-section=14]').hide();

                            $('[data-content-tabs=3]').addClass('active');
                            $('[data-tabs-btn=3]').addClass('selected');
                            $('[data-section=18]').show();
                            $('[data-section=21]').hide();
                            $('[data-section=21-2]').show();

                            $('[data-btn-innovations=1]').addClass('selected');
                            $('[data-content-innovations=1]').addClass('active');

                            $('[data-btn-innovations=3]').removeClass('selected');
                            $('[data-btn-innovations=2]').removeClass('selected');
                            $('[data-content-innovations=3]').removeClass('active');
                            $('[data-content-innovations=2]').removeClass('active');

                            if (uiValue2 >= 75) {
                                $('[data-section=19]').show();
                            }
                        }

                        if (uiValue2 >= 75) {

                            $('[data-section=17]').hide();
                            $('[data-section=18]').hide();
                            $('[data-section=19]').show();
                            $('[data-section=22-1]').hide();
                            $('[data-section=21-1]').hide();

                            $('[data-section=21]').show();
                            $('[data-section=22]').show();

                            $('[data-content-tabs]').removeClass('active');
                            $('[data-tabs-btn]').removeClass('selected');

                            $('[data-section=11]').hide();
                            $('[data-section=11-1]').show();
                            $('[data-section=14]').hide();

                            $('[data-content-tabs=3]').addClass('active');
                            $('[data-tabs-btn=3]').addClass('selected');

                            $('[data-section=18]').show();
                            $('[data-section=21]').hide();
                            $('[data-section=21-2]').show();
                        } else {

                            $('[data-content-tabs]').removeClass('active');
                            $('[data-tabs-btn]').removeClass('selected');
                            $('[data-content-tabs=3]').addClass('active');
                            $('[data-tabs-btn=3]').addClass('selected');
                        }

                        if (taxSystem == 'simplified') {
                            $('[data-section=11]').show();
                            $('[data-section=11-1]').hide();
                            $('[data-section=14]').show();

                            $('[data-content-tabs]').removeClass('active');
                            $('[data-tabs-btn]').removeClass('selected');

                            $('[data-section=18]').hide();
                            $('[data-section=21]').show();
                            $('[data-section=21-2]').hide();
                            $('[data-section=19]').hide();

                            $('[data-section=17]').show();
                            $('[data-section=18]').show();
                            $('[data-section=21]').hide();
                            $('[data-section=21-1]').show();
                            $('[data-section=22]').hide();
                            $('[data-section=22-1]').show();

                            $('[data-content-tabs=2]').addClass('active');
                            $('[data-tabs-btn=2]').addClass('selected');

                            $('[data-btn-innovations=3]').addClass('selected');
                            $('[data-btn-innovations=1], [data-btn-innovations=2]').removeClass('selected');

                            $('[data-content-innovations=3]').addClass('active');
                            $('[data-content-innovations=2], [data-content-innovations=1]').removeClass('active');

                        }

                        if (taxSystem == 'main' && uiValue <= 115) {
                            $('[data-section=21-1]').show();
                            $('[data-section=21-2]').hide();
                        } else if (taxSystem == 'main' && uiValue >= 116) {
                            $('[data-section=21-1]').hide();
                            $('[data-section=21-2]').show();
                        }
                    }

                    //GTM
                    this.events = [];

                    //console.log(this.timeout);
                    //console.log(taxSystem);
                    //console.log(uiValue);
                    //console.log(uiValue2);

                    switch (taxSystem) {
                        case 'simplified':
                            gtmSnoEvent = 'set_sno_uproshenka';
                            break;
                        case 'main':
                            gtmSnoEvent = 'set_sno_basic';
                            break;
                        case 'other':
                            gtmSnoEvent = 'set_sno_other';
                            break;
                        default:
                            gtmSnoEvent = 'set_sno_other';
                    }

                    switch (true) {
                        case uiValue <= 10:
                            gtmIncomeEvent = 'set_income_10';
                            break;
                        case uiValue > 10 && uiValue <= 30:
                            gtmIncomeEvent = 'set_income_30';
                            break;
                        case uiValue > 30 && uiValue <= 50:
                            gtmIncomeEvent = 'set_income_80';
                            break;
                        case uiValue > 50 && uiValue <= 70:
                            gtmIncomeEvent = 'set_income_120';
                            break;
                        case uiValue > 70 && uiValue <= 93:
                            gtmIncomeEvent = 'set_income_400';
                            break;
                        case uiValue > 93 && uiValue <= 115:
                            gtmIncomeEvent = 'set_income_800';
                            break;
                        case uiValue > 115 && uiValue <= 138:
                            gtmIncomeEvent = 'set_income_2000';
                            break;
                        case uiValue > 138:
                            gtmIncomeEvent = 'set_income_over_2000';
                            break;
                        default:
                            gtmIncomeEvent = 'set_income_20';
                    }

                    switch (true) {
                        case uiValue2 <= 30:
                            gtmEmployeeEvent = 'set_employee_30';
                            break;
                        case uiValue2 > 30 && uiValue2 <= 74:
                            gtmEmployeeEvent = 'set_employee_100';
                            break;
                        case uiValue2 > 74 && uiValue2 <= 139:
                            gtmEmployeeEvent = 'set_employee_500';
                            break;
                        case uiValue2 > 139:
                            gtmEmployeeEvent = 'set_employee_over_500';
                            break;
                        default:
                            gtmEmployeeEvent = 'set_employee_30';
                    }

                    this.events.push(gtmSnoEvent);
                    this.events.push(gtmIncomeEvent);
                    this.events.push(gtmEmployeeEvent);

                }

            },
            compare: function (uiValue, uiValue2, taxSystem) {

                switch (true) {

                    // Выручка до 10 млн
                    case uiValue < 10 && (taxSystem == 'other' || taxSystem == 'simplified'):
                        this.finalPriceElem.html(this.prices[0]);

                        break;

                    case uiValue < 10 && (taxSystem == 'main'):
                        this.finalPriceElem.html(this.prices[10]);

                        break;

                    // Выручка до 30 млн
                    case uiValue >= 10 && uiValue <= 29 && (taxSystem == 'other' || taxSystem == 'simplified'):
                        this.finalPriceElem.html(this.prices[1]);

                        break;

                    case uiValue >= 10 && uiValue <= 29 && (taxSystem == 'main'):
                        this.finalPriceElem.html(this.prices[11]);

                        break;

                    // Выручка до 80 млн
                    case uiValue >= 30 && uiValue <= 49 && (taxSystem == 'other' || taxSystem == 'simplified'):
                        this.finalPriceElem.html(this.prices[2]);

                        break;

                    case uiValue >= 30 && uiValue <= 49 && (taxSystem == 'main'):
                        this.finalPriceElem.html(this.prices[12]);

                        break;

                    // Выручка до 120 млн
                    case uiValue >= 50 && uiValue <= 70 && (taxSystem == 'other' || taxSystem == 'simplified') && uiValue2 < 10:
                        this.finalPriceElem.html(this.prices[3]);

                        break;

                    case uiValue >= 50 && uiValue <= 70 && (taxSystem == 'other' || taxSystem == 'simplified') && uiValue2 >= 10 && uiValue2 <= 74:
                        this.finalPriceElem.html(this.prices[14]);

                        break;

                    case uiValue >= 50 && uiValue <= 70 && (taxSystem == 'other' || taxSystem == 'simplified') && uiValue2 >= 75 && uiValue2 <= 139:
                        this.finalPriceElem.html(this.prices[15]);

                        break;

                    case uiValue >= 50 && uiValue <= 70 && (taxSystem == 'other' || taxSystem == 'simplified') && uiValue2 >= 140:
                        this.finalPriceElem.html(this.prices[16]);

                        break;

                    case uiValue >= 50 && uiValue <= 70 && (taxSystem == 'main') && uiValue2 < 10:
                        this.finalPriceElem.html(this.prices[29]);

                        break;

                    case uiValue >= 50 && uiValue <= 70 && (taxSystem == 'main') && uiValue2 >= 10 && uiValue2 <= 74:
                        this.finalPriceElem.html(this.prices[30]);

                        break;

                    case uiValue >= 50 && uiValue <= 70 && (taxSystem == 'main') && uiValue2 >= 75 && uiValue2 <= 139:
                        this.finalPriceElem.html(this.prices[31]);

                        break;

                    case uiValue >= 50 && uiValue <= 70 && (taxSystem == 'main') && uiValue2 >= 140:
                        this.finalPriceElem.html(this.prices[32]);

                        break;

                    // Выручка до 400 млн
                    case uiValue >= 71 && uiValue <= 93 && uiValue2 < 10:
                        this.finalPriceElem.html(this.prices[17]);

                        break;

                    case uiValue >= 71 && uiValue <= 93 && uiValue2 >= 10 && uiValue2 <= 74:
                        this.finalPriceElem.html(this.prices[18]);

                        break;

                    case uiValue >= 71 && uiValue <= 93 && uiValue2 >= 75 && uiValue2 <= 139:
                        this.finalPriceElem.html(this.prices[19]);

                        break;

                    case uiValue >= 71 && uiValue <= 93 && uiValue2 >= 140:
                        this.finalPriceElem.html(this.prices[20]);

                        break;

                    // Выручка до 800 млн
                    case uiValue >= 94 && uiValue <= 115 && uiValue2 < 10:
                        this.finalPriceElem.html(this.prices[21]);

                        break;

                    case uiValue >= 94 && uiValue <= 115 && uiValue2 >= 10 && uiValue2 <= 74:
                        this.finalPriceElem.html(this.prices[22]);

                        break;

                    case uiValue >= 94 && uiValue <= 115 && uiValue2 >= 75 && uiValue2 <= 139:
                        this.finalPriceElem.html(this.prices[23]);

                        break;

                    case uiValue >= 94 && uiValue <= 115 && uiValue2 >= 140:
                        this.finalPriceElem.html(this.prices[24]);

                        break;

                    // Выручка до 2 млрд
                    case uiValue >= 116 && uiValue <= 138 && uiValue2 < 10:
                        this.finalPriceElem.html(this.prices[25]);

                        break;

                    case uiValue >= 116 && uiValue <= 138 && uiValue2 >= 10 && uiValue2 <= 74:
                        this.finalPriceElem.html(this.prices[26]);

                        break;

                    case uiValue >= 116 && uiValue <= 138 && uiValue2 >= 75 && uiValue2 <= 139:
                        this.finalPriceElem.html(this.prices[27]);

                        break;

                    case uiValue >= 116 && uiValue <= 138 && uiValue2 >= 140:
                        this.finalPriceElem.html(this.prices[28]);

                        break;

                    // Выручка более 2 млрд
                    case uiValue >= 139 && uiValue2 < 10:
                        this.finalPriceElem.html(this.prices[33]);

                        break;

                    case uiValue >= 139 && uiValue2 >= 10 && uiValue2 <= 74:
                        this.finalPriceElem.html(this.prices[34]);

                        break;

                    case uiValue >= 139 && uiValue2 >= 75 && uiValue2 <= 139:
                        this.finalPriceElem.html(this.prices[35]);

                        break;

                    case uiValue >= 139 && uiValue2 >= 140:
                        this.finalPriceElem.html(this.prices[36]);

                        break;

                    default:
                        this.finalPriceElem.html(this.prices[9]);
                        break;
                }
            },
            pushEvents: function (events, gtmCategory) {

                if (typeof GTMpushEvent == 'function') {
                    events.forEach(function (value) {
                        GTMpushEvent(value, gtmCategory, 'Form_Accounting_Calculator_Extended');
                    });
                }
            },
            pushMomentEvents: function (events, gtmCategory) {
                if (typeof GTMpushEvent == 'function') {
                    events.forEach(function (value) {
                        GTMpushEvent('Form_Accounting_Calculator_Extended_Choosed_' + value, gtmCategory);
                    });
                }
            },
            selectTax: function (el, ev) {
                ev.preventDefault();

                if (this.element.find('.selected[data-tax]').data('tax') != $(el).data('tax')) {
                    //this.button.removeAttr('disabled');
                    //this.button.addClass('animated');
                    el.closest('.selection__buttons').children().removeClass('selected');
                    el.addClass('selected');
                    var events = false;
                    if ($(el).data('tax') == 'main') {
                        events = ['Osnovnaya'];
                    }
                    if ($(el).data('tax') == 'simplified') {
                        events = ['Uproschenka'];
                    }
                    if ($(el).data('tax') == 'other') {
                        events = ['Drugoe'];
                    }
                    if (events) {
                        this.pushMomentEvents(events, this.gtmCategory);
                    }
                    this.submitForm(true);
                }
            },
            setPush: function() {
                if (this.events.length > 0) {
                    if (this.timeout) {
                        setTimeout(this.pushEvents, this.timeout * 1000, this.events, this.gtmCategory);
                    } else {
                        this.pushEvents(this.events, this.gtmCategory);
                    }
                    this.events = [];
                }
            }
        }
    );
}(jQuery));

(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.BackToTop = can.Control.extend(
        {
            pluginName: 'appWidgetBackToTop',
            defaults: {}
        },
        {
            init: function () {
                this.offset = 1000;

                this.on(this.element, 'click', 'scrollToTop');
            },

            'scrollToTop': function(el, ev) {
                ev.preventDefault();

                $('html, body').animate({
                    scrollTop: 0
                }, 1800);

                if (typeof GTMpushEvent == "function" && window.matchMedia("(max-width: 768px)").matches) {
                    GTMpushEvent('MobileButtonClick', 'MobileButton');
                }
            },

            '{window} scroll': function() {
                if($(window).scrollTop() > this.offset) {
                    this.element.removeClass('hide');
                } else {
                    this.element.addClass('hide');
                }
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Banner = App.Widgets.Banner || {};
    App.Widgets.Banner.LazyLoad = can.Control.extend(
        {
            pluginName: 'appWidgetBannerLazyLoad',
            defaults: {
                gateway: '/ajax/banners/'
            }
        },
        {

            init: function () {
                this.bannerID = this.element.data('banner');
                this.requestParams = window
                    .location
                    .search
                    .replace('?','')
                    .split('&')
                    .reduce(
                        function(p,e){
                            var a = e.split('=');
                            p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                            return p;
                        },
                        {}
                    );
                if(this.bannerID){
                    try {
                        $.get(this.options.gateway, {id: this.bannerID, clear_cache: this.requestParams['clear_cache']}, this.proxy('insertBanner'));
                    } catch (e) {
                        console.error('ERROR: appWidgetBannerLazyLoad unable to load banner ID '+this.bannerID);
                    }
                }
            },

            insertBanner: function (data, status, xhr){

                this.element.html(data);

            }

        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.BlogAccordion = can.Control.extend(
        {
            pluginName: 'appWidgetBlogAccordion',
            defaults: {}
        },
        {
            init: function () {
                this.btn = this.element;
                this.on(this.btn, 'click touchstart', 'showHideDescription');
            },
            'showHideDescription': function(el, ev) {
                ev.preventDefault();
                if(el.hasClass('open')) {
                    el.toggleClass('open');
                    el.next().slideUp().removeClass('open');
                } else {
                    el.toggleClass('open');
                    el.next().slideDown().addClass('open');
                }
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.BlogArchive = can.Control.extend(
        {
            pluginName: 'appWidgetBlogArchive',
            defaults: {}
        },
        {
            init: function () {
                this.filterItem = this.element.find('.js-blog-filter-item');
                this.tags = $('.js-blog-tags');

                this.blogField = $('.js-blog-field');
                this.blogFieldUl = $('.js-blog-field > .js-blog-ul');
                this.blogFieldPager = $('.js-blog-field > .js-pagination--blog');
                this.on(this.filterItem, 'click', 'filterArchiveOnClick');

            },

            'filterArchiveOnClick': function(el, em) {
                if (el.hasClass('current')) {
                    el.find('.current-close').remove();
                } else {
                    el.prepend('<span class="current-close">close</span>');
                }
                el.toggleClass('current');

                this.updateBlogArchive();
            },

            'updateBlogArchive': function() {
                var i=0, aDate=[], o=this, aTag=[];

                this.element.find('.js-blog-filter-item.current').each(function () {
                    aDate[i] = $(this).data('month')+"-"+$(this).data('year');
                    i++;
                });

                i=0;
                this.tags.find('.js-blog-tag-item.current').each(function () {
                    var sTag;
                    sTag = $(this).data('tag');

                    aTag[i] = sTag;
                    i++;
                });

                $.get("",{'DATE[]':aDate,'tags':aTag, 'isAjax':true}
                ).done(function(result){

                    o.blogField.empty();
                    o.blogField.append(result);

                }).error(function(){
                    console.log('ERROR ADDING BLOG');
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.BlogTags = can.Control.extend(
        {
            pluginName: 'appWidgetBlogTags',
            defaults: {}
        },
        {
            init: function () {
                this.filterItem = this.element.find('.js-blog-tag-item');
                this.archive =$('.js-blog-archive');

                this.blogField = $('.js-blog-field');
                this.blogFieldUl = $('.js-blog-field > .js-blog-ul');
                this.blogFieldPager = $('.js-blog-field > .js-pagination--blog');
                this.on(this.filterItem, 'click', 'filterTagOnClick');

            },

            'filterTagOnClick': function(el, em) {
                em.preventDefault();
                el.toggleClass('active');

                this.updateBlog();
            },

            'updateBlog': function() {
                var i=0, aDate=[], o=this, aTag = [];

                this.archive.find('.js-blog-filter-item.current').each(function () {
                    aDate[i] = $(this).data('month')+"-"+$(this).data('year');
                    i++;
                });

                i=0;
                this.element.find('.js-blog-tag-item.active').each(function () {

                    var sTag;
                    sTag = $(this).data('tag');

                    aTag[i] = sTag;
                    i++;
                });

                $.get("",{'DATE[]':aDate,'tags':aTag,'AJAX':'Y'}
                ).done(function(result){

                    o.blogField.empty();
                    o.blogField.append(result);

                }).error(function(){
                    console.log('ERROR ADDING BLOG');
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.BurgerMobile = can.Control.extend(
        {
            pluginName: 'appWidgetBurgerMobile',
            defaults: {}
        },
        {
            init: function () {
                this.burgerBtn = this.element.find('.burger__btn');
                this.burgerNav = this.element.find('.burger__wrapper');
                this.burgerClose = this.element.find('.burger__close');
                this.burgerNavSlide = this.element.find('.burger__nav-slide');
                this.burgerNavLink = this.element.find('.burger__nav-link');


                this.on(this.burgerBtn, 'click', 'openNav');
                this.on(this.burgerClose, 'click', 'closeNav');
                this.on(this.burgerNavSlide, 'click', 'slideNavItem');
                this.on(this.burgerNavLink, 'click', 'slideNavItem');
            },
            'openNav': function(el, ev) {
                ev.preventDefault();
                this.burgerNav.addClass('active');
                $('body').addClass('overflow-is-hidden');
            },
            'closeNav': function(el, ev) {
                ev.preventDefault();
                this.burgerNav.removeClass('active');
                $('body').removeClass('overflow-is-hidden');
            },
            'slideNavItem': function(el, ev) {
                if ($(el).attr('href') == '#') {
                    ev.preventDefault();
                    $(el).closest('.burger__nav-item').toggleClass('open');
                    $(el).next('.burger__subnav').slideToggle();
                    $(el).next().next('.burger__subnav').slideToggle();
                }
            },
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.CostCalculator = can.Control.extend(
        {
            pluginName: 'appWidgetCostCalculator',
            defaults: {}
        },
        {
            init: function () {
                this.rangeSlider = this.element.find('.js-cost-calculator__range');
                this.result = this.element.find('.js-cost-calculator__result');
                this.form = this.element.find('.form--calculator-send');

                this.formEmail = this.form.find('input[data-fieldtype="FORM_EMAIL"]');
                this.button = $('.js-send-rusult');
                this.whatInPrice = this.element.find('.js-modal');
                this.sendBlock = this.element.find('.js-calculator-form');
                this.priceInput = this.element.find('input[name="PRICE"]');

                var self = this;

                this.rangeSlider.slider({
                    range: 'min',
                    min: 0,
                    max: 165,
                    step: 1,
                    value: 10,
                    slide: function (event, ui) {
                        self.calculateCost(ui.value);

                    },
                });

                this.button.on("click", this.submitForm);
                this.whatInPrice.on("click", this.sendWhatEvent);
                if (this.formEmail) {
                    this.on(this.formEmail, 'change', 'changeEmail');
                    this.onceEmailSend = true;
                }
            },
            changeEmail: function (el, ev) {
                if ($(this.form).data('validate') && this.onceEmailSend) {
                    if (typeof GTMpushEvent == "function") {
                        GTMpushEvent('Form_Accounting_Calculator_Filled_Email', 'Form_Accounting_Calculator');
                        this.onceEmailSend = false;
                    }
                }
            },
            sendWhatEvent: function() {
                if (typeof GTMpushEvent == "function"){
                    GTMpushEvent('Form_Accounting_Calculator_Click_What_Affects', 'Form_Accounting_Calculator');
                }
            },

            printResult: function (text, largeTextFlag) {
                var resultBlock = this.result;
                if(largeTextFlag) {
                    if(!resultBlock.hasClass('cost-calculator__result-small')) {
                        resultBlock.addClass('cost-calculator__result-small');
                    }
                }
                else {
                    if(resultBlock.hasClass('cost-calculator__result-small')) {
                        resultBlock.removeClass('cost-calculator__result-small');
                    }
                }
                this.priceInput.val(text);
                resultBlock.text(text);
            },

            submitForm: function(e) {
                e.preventDefault();

                $(this.form).validate(window.application.validateOptionsDefault);

                if($(this.form).data('validate') && !$(this.form).valid()) {
                    return false;
                }

                $(this.form).startWaiting();

                $.post(
                    '/ajax/interface/calculator/',
                    $(this.form).serialize(),
                    function(data){

                        if(data.success) {
                            $('.form--calculator-send').endWaiting();

                            if (typeof GTMpushEvent == "function"){
                                GTMpushEvent('Form_Accounting_Calculator_Sent', 'Form_Accounting_Calculator');
                            }

                            $.fancybox({
                                wrapCSS : 'modal-wrapper',
                                margin : ($(window).width() > 937) ? 20 : 5,
                                padding : 15,
                                helpers : {
                                    overlay : {
                                        css : {
                                            'background' : 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                },
                                'content' : $(data.html)
                            });

                        }
                        else {
                            if (typeof GTMpushEvent == "function"){
                                GTMpushEvent('Form_Accounting_Calculator_Error', 'Form_Accounting_Calculator');
                            }
                            $.fancybox({
                                wrapCSS : 'modal-wrapper',
                                margin : ($(window).width() > 937) ? 20 : 5,
                                padding : 15,
                                helpers : {
                                    overlay : {
                                        css : {
                                            'background' : 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                },
                                'content' : $('<div class="modal modal--visible"><div class="modal__title">Сервис временно не доступен</div><p>Повторите попытку позже</p></div>')
                            });
                        }
                    },
                    'json'
                );
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ChangeableContacts = can.Control.extend(
        {
            pluginName: 'appWidgetChangeableContacts',
            defaults: {}
        },
        {
            init: function () {
                var waMap;

                // координаты по дефолту: Санкт-Петербург
                var defaultMapCoordinates = '59.971244564100715,30.312669999999944';

                // инициализация карты с дефолтными координатами
                this.initMap(defaultMapCoordinates);


                // поиск select
                this.selectCity = this.element.find('.js-select');
                // поиск поля адреса
                this.addressValue = this.element.find('.js-changeable-contacts-address');
                // поиск поля телефонный код города
                this.codeValue = this.element.find('.js-changeable-contacts-phone .js-site-phone-ccode');
                // поиск поля телефона
                this.phoneValue = this.element.find('.js-changeable-contacts-phone .js-site-phone-local');
                // поиск поля ссылка телефона
                this.telValue = this.element.find('.js-changeable-contacts-phone .js-site-phone-a');
                this.selectElement = this.element.find('.js-changeable-contacts-phone .js-site-phone-a').parent().parent().parent();
                this.parentElement = this.element.find('.contact-list--custom-margin');
                // блок как добраться
                this.howToGet = this.element.find('.js-changeable-contacts-how-to-get');

                // событие изменения значения select
                this.on(this.selectCity, 'change', 'selectCityChange');

                var uri = new URI(window.location.href);
                uri.fragmentPrefix('!');
                if (uri.fragment(true)) {
                    var hFragment = uri.fragment(true);
                    if ('code' in hFragment) {
                        this.selectCity.val(hFragment['code']).trigger('change');;
                        $('html, body').animate({
                            scrollTop: $('#spb').offset().top - 60
                        }, 1500);
                    }
                }

                var curPlugin = this;

                $(document).on('click', '.js-contact-header-link', function() {
                    var uri = new URI($(this).attr('href'));

                    uri.fragmentPrefix('!');
                    if (uri.fragment(true)) {
                        var hFragment = uri.fragment(true);
                        if ('code' in hFragment) {
                            curPlugin.selectCity.val(hFragment['code']).trigger('change');
                            $('html, body').animate({
                                scrollTop: $('#spb').offset().top - 60
                            }, 1500);
                        }
                    }
                });
            },

            selectCityChange: function (event, proto) {

                // получение параметров из select->option
                var select = proto.target;

                // contactsParams.city - город
                // contactsParams.address - адрес
                // contactsParams.code - код города
                // contactsParams.pcode - телефонный код города
                // contactsParams.phone - телефон без кода города форматированный
                // contactsParams.coordinates - координаты для карты
                var contactsParams = $(select).find(':selected').data('param'),
                    phone = contactsParams.phone.split(',');
                // смена адреса
                var coordinates = contactsParams.coordinates.split(','),
                    coordinatesReverse = coordinates[1] + ',' + coordinates[0];
                var address = '<a target="_blank" href="https://yandex.ru/maps/?z=16&ll='+coordinatesReverse+'&l=map&rtext=~'+contactsParams.coordinates+'&origin=jsapi_2_1_72&from=api-maps">'
                    + contactsParams.address +
                    '</a>';
                this.addressValue.html(address);

                // смена телефона
                if(phone.length >= 1 && contactsParams.pcode != ''){
                    if(phone.length == 1) {
                        var formatPhone = phone[0].replace('-', '').replace('-', '');
                        this.codeValue.html(contactsParams.pcode);
                        this.phoneValue.html(phone[0]);
                        this.telValue[0].setAttribute('href', 'tel:+7' + contactsParams.pcode + formatPhone);
                        this.telValue[0].setAttribute('title', '+7' + contactsParams.pcode + formatPhone);
                        this.telValue.parent().parent().parent().removeClass('none');
                        $('.js-changeable-contacts-phone-two').parent().remove();
                    } else {
                        var formatPhone = phone[0].replace('-', '').replace('-', '');
                        this.codeValue.html(contactsParams.pcode);
                        this.phoneValue.html(phone[0]);
                        this.telValue[0].setAttribute('href', 'tel:+7' + contactsParams.pcode + formatPhone);
                        this.telValue[0].setAttribute('title', '+7' + contactsParams.pcode + formatPhone);
                        this.telValue.parent().parent().parent().removeClass('none');
                        formatPhone = phone[1].replace('-', '').replace('-', '');
                        var clon = document.createElement('div');
                        clon.className = 'contact-list__row';
                        clon.innerHTML = '<div class="contact-list__column"></div><div class="contact-list__column contact-list__column--phone js-changeable-contacts-phone-two"><span class="js-site-phone"><a href="tel:+7' + contactsParams.code + formatPhone + '" title="+7' + contactsParams.code + formatPhone  +'" class="no-underline black-link js-site-phone-a"><nobr><span class="js-site-phone-wcode">+7</span> (<span class="js-site-phone-ccode">'+ contactsParams.pcode +'</span>) <strong><span class="js-site-phone-local">'+ phone[1] + '</span></strong></nobr></a></span></div>';
                        this.parentElement[0].insertBefore(clon, this.selectElement[0].nextSibling);
                    }
                } else {
                    this.telValue.parent().parent().parent().addClass('none');
                }

                // отображение блока "Как добраться". Если "Санкт-Петербург", то отображаем, в ином случае - скрываем
                contactsParams.code == 'sankt-peterburg' ? this.howToGet.removeClass('none') : this.howToGet.addClass('none');

                // очищаем карту
                this.destroyMap();

                // активизируем карту с новыми параметрами
                this.initMap(contactsParams.coordinates);
            },

            initMap: function (mapCoordinates) {
                ymaps.ready(function () {
                    waMap = new ymaps.Map('changeable-map', {
                        center: mapCoordinates.split(','),
                        zoom: 16,
                        controls: ['zoomControl']
                    });

                    waMap.behaviors.disable('drag');

                    var parkingControl = {
                        balloonShadow: false,
                        iconLayout: 'default#image',
                        iconImageHref: '/local/templates/main/build/images/wa-map-mark.png',
                        iconImageSize: [49, 45],
                        zIndex: 98
                    };

                    waPlacemark = new ymaps.Placemark(mapCoordinates.split(','), {}, parkingControl);

                    waMap.geoObjects.add(waPlacemark);

                    function setCenter () {
                        waMap.setCenter(mapCoordinates.split(','));
                    }

                    window.addEventListener('resize', function () {
                        waMap.setCenter(mapCoordinates.split(','));
                    });

                    $('.js-changeable-contacts-address').on('click', function () {
                        waMap.panTo([mapCoordinates.split(',')]);
                    });
                });
            },

            destroyMap: function () {
                ymaps.ready(function () {
                    waMap.destroy();
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.Changes = can.Control.extend(
        {
            pluginName: 'appWidgetChanges',
            defaults: {}
        },
        {
            init: function () {
                this.LPRItem = this.element.find('.js-lpr');
                this.businessItem = this.element.find('.js-business-type');
                this.taxItem = this.element.find('.js-tax-type');
                this.changeItem = this.element.find('.js-change-type');

                this.contentField = $('.js-changes-content');
                this.on(this.LPRItem, 'click', 'filterChangesOnClick');
                this.on(this.businessItem, 'click', 'filterChangesOnClick');
                this.on(this.taxItem, 'click', 'filterChangesOnClick');
                this.on(this.changeItem, 'click', 'filterChangesOnClick');

            },

            'filterChangesOnClick': function (el, em) {


                if (el.hasClass('js-lpr')) {
                    if (el.hasClass('active')) {
                        $('.js-lpr').removeClass('active');
                    } else {
                        $('.js-lpr').removeClass('active');
                        el.addClass('active')
                    }
                } else if (el.hasClass('js-business-type')) {
                    el.toggleClass('active')
                } else if (el.hasClass('js-tax-type')) {
                    el.toggleClass('active')
                } else if (el.hasClass('js-change-type')) {
                    el.toggleClass('active')
                }

                this.updateContent();
            },

            'updateContent': function () {
                var i = 0, aLPR = [], o = this, aBusiness = [], aTax = [], aChange = [];

                this.element.find('.js-lpr.active').each(function () {
                    aLPR[i] = $(this).data('code');
                    i++;
                });

                i = 0;
                this.element.find('.js-business-type.active').each(function () {
                    aBusiness[i] = $(this).data('code');
                    i++;
                });

                i = 0;
                this.element.find('.js-tax-type.active').each(function () {
                    aTax[i] = $(this).data('code');
                    i++;
                });

                i = 0;
                this.element.find('.js-change-type.active').each(function () {
                    aChange[i] = $(this).data('code');
                    i++;
                });


                $.get("", {'LPR[]': aLPR, 'business_type[]': aBusiness, 'tax_type[]': aTax, 'change_type[]': aChange}
                ).done(function (result) {

                    o.contentField.empty();
                    o.contentField.append(result);

                    window.application.installController('.js-accordion', 'appWidgetAccordion');

                }).error(function () {
                    console.log('ERROR ADDING CONTENT');
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.CheckSubscribeForm = can.Control.extend(
        {
            pluginName: 'appWidgetCheckSubscribeForm',
            defaults: {

            }
        },
        {
            init: function () {
                $('form[name="POPUP_SUBSCRIPTION"]').find('.js-icheckbox.rubrics').on('ifClicked', function() {
                    $('form[name="POPUP_SUBSCRIPTION"]').find('.js-icheckbox.rubrics').iCheck('uncheck');
                    $(this).iCheck('check');
                });
                $('form[name="POPUP_SUBSCRIPTION"]').find('.js-icheckbox.cities').on('ifClicked', function() {
                    $('form[name="POPUP_SUBSCRIPTION"]').find('.js-icheckbox.cities').iCheck('uncheck');
                    $(this).iCheck('check');
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ClientsFilter = can.Control.extend(
        {
            pluginName: 'appWidgetClientsFilter',
            defaults: {}
        },
        {
            init: function () {
                this.filterBtn = this.element.find('.js-clients-filter__btn');
                this.filterBtnsList = this.element.find('.js-clients-filter__btns-list');
                this.filterItem = this.element.find('.js-clients-filter__item');
                this.selectMenu = this.element.find('.js-clients-filter__select-menu');
                this.showMoreBtn = this.element.find('.js-clients-filter__show-more-btn');
                this.foreignClients = this.element.find('.js-clients-filter__foreign');
                this.filterByCountryList = this.element.find('.js-clients-filter__by-country-list');
                this.filterByCountryBtn = this.element.find('.js-clients-filter__by-country-btn');
                this.filterByCountryBtnAll = this.element.find('.js-clients-filter__by-country-btn[data-id="foreign-clients"]');

                var filterBtnIsClicked = false;

                if(!this.element.hasClass('js-clients-filter--no-slice')) {
                    this.filterItem.slice(0, 12).removeClass('hide');
                } else if(this.element.hasClass('js-clients-filter--no-slice') && $(window).width() < 1003) {
                    this.filterItem.slice(0, 12).removeClass('hide');
                } else {
                    this.filterItem.removeClass('hide');
                }

                this.on(this.filterBtn, 'click', 'switchTabOnClick');
                this.on(this.filterByCountryBtn, 'click', 'filterByCountry');
                this.on(this.selectMenu, 'click', 'showTabsListOnClick');
                this.on(this.showMoreBtn, 'click', 'showMoreItems');
            },

            'switchTabOnClick': function(el, ev) {
                var filterId = el.attr('data-id');

                // Переключение активного состояния табов
                this.filterBtn.removeClass('active');
                el.addClass('active');

                // Изменение цвета декоративной линии в соответствии с цветом текущей вкладки
                var targetColor = el.data('color');
                var targetIdArray = [];

                $('.js-clients-filter__btn').each(function() {
                    var attrs = $(this).data('color');
                    targetIdArray.push(attrs);
                });

                for (var i = 0; i < targetIdArray.length; i++) {
                    var targetIdArrayItem = targetIdArray[i];

                    el.parent().removeClass('horizontal-tabs__list--' + targetIdArrayItem).addClass('horizontal-tabs__list--' + targetColor);
                }

                // Фильтрация клиентов
                this.filterItem.addClass('hide');
                var filtered = this.element.find('[data-filter~="' + filterId + '"]');

                if(!this.element.hasClass('js-clients-filter--no-slice')) {
                    filtered.slice(0, 12).removeClass('hide');
                } else if(this.element.hasClass('js-clients-filter--no-slice') && $(window).width() < 1003) {
                    filtered.slice(0, 12).removeClass('hide');
                } else {
                    filtered.removeClass('hide');
                }

                // Клик по вкладке "Иностранные клиенты"
                this.foreignClients.removeClass('horizontal-tabs__2-3-col');
                this.filterByCountryList.addClass('hide');

                if(el.hasClass('js-clients-filter__btn--foreign') && !this.foreignClients.hasClass('horizontal-tabs__2-3-col')) {
                    this.foreignClients.addClass('horizontal-tabs__2-3-col');
                    this.filterByCountryList.removeClass('hide');
                }

                // Обновление состояния фильтра по странам после перехода к другим табам
                this.filterByCountryBtn.removeClass('active');
                this.filterByCountryBtnAll.addClass('active');

                // Работа селекта, в который трансформируются вкладки на мобильных
                this.activeTabText = el.text();
                this.selectMenu.text(this.activeTabText);
                this.showTabsListOnClick();

                return filtered;
            },

            'showTabsListOnClick': function(el, ev) {
                if($(window).width() < 1003) {
                    this.filterBtnsList.slideToggle('fast');
                }
            },

            'filterByCountry': function(el, ev) {
                this.filterByCountryBtn.removeClass('active');
                el.addClass('active');

                this.filterItem.addClass('hide');
                var filterId = el.attr('data-id');
                var filtered = this.element.find('[data-filter~="' + filterId + '"]');

                if(!this.element.hasClass('js-clients-filter--no-slice')) {
                    filtered.slice(0, 12).removeClass('hide');
                } else if(this.element.hasClass('js-clients-filter--no-slice') && $(window).width() < 1003) {
                    filtered.slice(0, 12).removeClass('hide');
                } else {
                    filtered.removeClass('hide');
                }
            },

            'showMoreItems': function() {
                countryId = this.filterByCountryBtn.filter('.active').data('id');
                this.hiddenItems = this.element.find('.js-clients-filter__item').filter('[data-filter~="' + countryId + '"]').filter(':hidden');
                this.hiddenItems.slice(0, 12).removeClass('hide');
            }
        }
    );
}(jQuery));

(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.CustomFormElement = can.Control.extend(
        {
            pluginName: 'appWidgetCustomFormElement',
            defaults: {}
        },
        {
            init: function () {
                this.checkbox = this.element.find('.js-custom-form-element__checkbox');
                this.radio = this.element.find('.js-custom-form-element__radio');

                this.checkbox.iCheck({
                    checkboxClass: 'custom-checkbox',
                    checkedCheckboxClass: 'custom-checkbox--checked',
                    cursor: true
                });

                this.radio.iCheck({
                    radioClass: 'custom-radio',
                    checkedRadioClass: 'custom-radio--checked',
                    cursor: true,
                });

                this.radio.on('ifChecked', function () {
                    if (this.getAttribute('data-error') == 'true') {
                        if ($('.form__errors p').length == 0) {
                            $('.form__errors').append('<p></p>');
                        }
                        if ($('#form_radio_FORM_STATUS-error').length == 0) {
                            $('.form__errors p').append('<font id="form_radio_FORM_STATUS-error" class="errortext">Извините, но это закрытое мероприятие только для генеральных директоров и собственников бизнеса<br></font>');
                        }
                    }
                    else {
                        $('#form_radio_FORM_STATUS-error').detach();
                    }

                    var otherInput = $('.other-input');
                    if (this.getAttribute('data-parent') == 'true') {
                        otherInput.show();
                    }
                    else {
                        if (otherInput.length > 0) {
                            otherInput.hide();
                        }
                    }
                });

                $('.js-custom-form-element__checkbox').filter('[data-parent="true"]').on('ifChecked', function () {
                    var otherInput = $('.other-theme-input');
                    otherInput.show();
                });

                $('.js-custom-form-element__checkbox').filter('[data-parent="true"]').on('ifUnchecked', function () {
                    var otherInput = $('.other-theme-input');
                    otherInput.hide();
                });

            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.CustomSelect = can.Control.extend(
        {
            pluginName: 'appWidgetCustomSelect',
            defaults: {}
        },
        {
            init: function () {
                this.select = this.element.select2({
                    width: 'off',
                    minimumResultsForSearch: -1,
                    dropdownAutoWidth: false
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.DropdownMenu = can.Control.extend(
        {
            pluginName: 'appWidgetDropdownMenu',
            defaults: {}
        },
        {
            init: function () {
                this.menuToggleBtn = this.element.find('.js-menu__toggle-btn');
                this.menuItem = this.element.find('.js-menu__item');
                this.menuList = this.element.find('.js-menu__list');
                var self = this.element;

                this.menuItem.on('mouseenter mouseleave', function(e) {
                    this.menuContainer = self.find('.js-menu__container');
                    this.menuContainerWidth = this.menuContainer.outerWidth();
                    this.menuContainerOffsetLeft = this.menuContainer.offset().left;

                    this.dropdown = $(this).find('.js-menu__dropdown');
                    this.dropdownWidth = this.dropdown.outerWidth();
                    this.dropdownOffsetLeft = this.dropdown.offset().left;

                    var isVisible = (this.dropdownOffsetLeft + this.dropdownWidth <= this.menuContainerWidth + this.menuContainerOffsetLeft);

                    if (!isVisible) {
                        $(this).find('.js-menu__dropdown').addClass('main-nav__dropdown--right');
                    } else {
                        $(this).find('.js-menu__dropdown').removeClass('main-nav__dropdown--right');
                    }
                });

                this.menuToggleBtn.on('click', function() {
                    $(this).toggleClass('main-nav__menu-btn--active');
                    $('.js-menu__list').toggleClass('main-nav__list--open');
                    self.toggleClass('main-nav--open');
                    $('body').toggleClass('overflow-is-hidden');
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.EqualHeightBlocks = can.Control.extend(
        {
            pluginName: 'appWidgetEqualHeightBlocks',
            defaults: {}
        },
        {
            init: function () {
                this.items = this.element.find('.js-equal-height-blocks__item');
                this.images = this.element.find('img');

                this.setHeight();
                this.on(window, 'resize', 'setHeight');
                this.on(this.images, 'load', 'setHeight');
            },

            'setHeight': function() {
                var maxHeight = 0;
                this.items.css('height', 'auto');

                this.items.each(function(index) {
                    var itemHeight = parseInt($(this).outerHeight());

                    if (itemHeight > maxHeight) {
                        maxHeight = itemHeight;
                    }
                });

                this.items.css('height', maxHeight);
            }
        }
    );
}(jQuery));


(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.EventsArchive = can.Control.extend(
        {
            pluginName: 'appWidgetEventsArchive',
            defaults: {}
        },
        {
            init: function () {
                this.filterItem = this.element.find('.js-events-filter-item');

                this.entityField = $('.js-event-list');
                this.entityFieldPager = $('.js-event-list > .js-pagination--events');
                this.on(this.filterItem, 'click', 'filterArchiveOnClick');

            },

            'filterArchiveOnClick': function(el, em) {
                if (el.hasClass('current')) {
                    el.find('.current-close').remove();
                } else {
                    el.prepend('<span class="current-close">close</span>');
                }
                el.toggleClass('current');

                this.updateEvents();
            },

            'updateEvents': function() {
                var i=0, aDate=[], o=this, aTag=[];

                this.element.find('.js-events-filter-item.current').each(function () {
                    aDate[i] = $(this).data('month')+"-"+$(this).data('year');
                    i++;
                });

                $.get("",{'DATE[]':aDate}
                ).done(function(result){

                    o.entityField.empty();
                    o.entityField.append(result);

                }).error(function(){
                    console.log('ERROR ADDING EVENTS');
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Event = App.Widgets.Event || {};
    App.Widgets.Event.LazyLoad = can.Control.extend(
        {
            pluginName: 'appWidgetEventLazyLoad',
            defaults: {
                gateway: '/ajax/events.insert/'
            }
        },
        {

            init: function () {
                this.pid = this.element.data('pid');
                this.requestParams = window
                    .location
                    .search
                    .replace('?', '')
                    .split('&')
                    .reduce(
                        function (p, e) {
                            var a = e.split('=');
                            p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                            return p;
                        },
                        {}
                    );
                if (this.pid || this.pid === 0) {
                    try {
                        $.get(this.options.gateway, {
                            id: this.pid,
                            clear_cache: this.requestParams['clear_cache']
                        }, this.proxy('insertEvent'));
                    } catch (e) {
                        console.error('ERROR: appWidgetEventLazyLoad unable to load banner ID ' + this.PID);
                    }
                }
            },

            insertEvent: function (data, status, xhr) {
                this.element.html(data);
                this.initEvents();
            },

            initEvents: function () {

                window.application.installController(this.element.find('.js-get-event-form'), 'appWidgetEventFormGet');

                var video = this.element.find('.video'),
                    place = this.element.find('.event__props-place'),
                    _this = this;

                video.on('click', function () {
                    var url = $(this).attr('data-video-src');
                    url = url.replace(new RegExp("watch\\?v=", "i"), 'v/');
                    url += '?fs=1&autoplay=1&rel=0';

                    $.fancybox({
                        //'wrapCSS': 'modal-wrapper',

                        'padding': 0,
                        'href': url,
                        'type': 'swf',
                        'swf': {
                            'wmode': 'transparent',
                            'allowfullscreen': 'true'
                        }
                    });
                });

                place.on('click', function () {
                    var id = $(this).data('id'),
                        lat = $(this).data('lat'),
                        long = $(this).data('long');

                    $.fancybox.open({
                        wrapCSS: 'modal-wrapper',
                        margin: ($(window).width() > 937) ? 20 : 5,
                        padding: 15,
                        helpers: {
                            overlay: {
                                css: {
                                    'background': 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                        href: "/local/components/wiseadvice/events/templates/.default/map.php",
                        type: "ajax",
                        ajax: {
                            type: "POST",
                            data: {
                                id: id
                            }
                        },
                        afterShow: function () {
                            var uri = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
                            $.getScript(uri, function () {
                                _this.mapReady(lat, long);
                            });
                        }
                    });
                });
            },

            mapReady: function (lat, long) {
                var _this = this;
                ymaps.ready(setTimeout(function () {
                    _this.initMap(lat, long)
                }, 1000));
            },

            initMap: function (lat, long) {

                var mapCenter = [lat, long];

                console.log(mapCenter);

                var mapControl = {
                    balloonShadow: false,
                    iconLayout: 'default#image',
                    iconImageHref: '/local/templates/main/build/images/wa-map-mark.png',
                    iconImageSize: [49, 45],
                    zIndex: 98
                };

                var waMap = new ymaps.Map("js-map", {
                    center: mapCenter,
                    zoom: 13,
                    controls: []
                });

                waMap.behaviors.disable(['scrollZoom', 'drag']);

                var waPlacemark = new ymaps.Placemark(mapCenter, {}, mapControl);

                waMap.geoObjects.add(waPlacemark);

                window.addEventListener('resize', function () {
                    waMap.setCenter(mapCenter);
                });

            }

        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.Filter = can.Control.extend(
        {
            pluginName: 'appWidgetFilter',
            defaults: {}
        },
        {
            init: function () {
                this.filterBtn = this.element.find('.js-filter__btn');
                this.filterItem = this.element.find('.js-filter__item');
                this.on(this.filterBtn, 'click', 'filterOnClick');

            },

            'filterOnClick': function(el, em) {
                var filterId = el.attr('data-id');

                this.filterItem.hide();
                this.element.find('[data-filter~="' + filterId + '"]').show();
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.FlipCard = can.Control.extend(
        {
            pluginName: 'appWidgetFlipCard',
            defaults: {}
        },
        {
            init: function () {
                this.flipCardFront = this.element.find('.js-flip-card__front');
                this.flipCardBack = this.element.find('.js-flip-card__back');

                this.on(this.element, 'mouseenter', 'flipOnMouseenter');
                this.on(this.element, 'mouseleave', 'flipBackOnMouseleave');
                this.on(this.element, 'click', 'flipOnClick');
            },

            'flipOnClick': function() {
                if(window.USER_IS_TOUCHING) {
                    if(this.element.hasClass('flip--hovered')) {
                        this.element.removeClass('flip--hovered');
                    }

                    this.element.toggleClass('flip--clicked');
                }
            },

            'flipOnMouseenter': function() {
                if(!window.USER_IS_TOUCHING) {
                    if(this.element.hasClass('flip--clicked')) {
                        this.element.removeClass('flip--clicked');
                    }

                    this.element.addClass('flip--hovered');
                }
            },

            'flipBackOnMouseleave': function() {
                if(!window.USER_IS_TOUCHING) {
                    if(this.element.hasClass('flip--clicked')) {
                        this.element.removeClass('flip--clicked');
                    }

                    this.element.removeClass('flip--hovered');
                }
            }
        }
    );
}(jQuery));



(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.FormSelect = can.Control.extend(
        {
            pluginName: 'appWidgetFormSelect',
            defaults: {}
        },
        {
            init: function () {
                this.select = this.element.select2({
                    minimumResultsForSearch: Infinity,
                    theme: "form-select"
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Plugins = App.Plugins || {};
    App.Plugins.HRTest = can.Control.extend(
        {
            pluginName: 'appPluginHRTest',
            defaults: {}
        },
        {
            init: function () {

                this.gateway = this.element.data('gateway');
                this.body = this.element.find('.js-plugin-body');
                this.baseAnswerClass = 'test-questions__answer';

            },

            reloadBody: function (data) {
                this.body.startWaiting();
                $.post(this.gateway, data, this.proxy('_replaceBodyContent'));
            },

            _replaceBodyContent: function (response) {

                var self = this;

                self.body.html(response);

                self.radioBtn = self.element.find('.js-answer');

                var currentQuestionNum = self.element.find('.js-question').data('num');

                self.radioBtn.iCheck({
                    radioClass: 'custom-radio',
                    checkedRadioClass: 'custom-radio--checked',
                    cursor: true
                });

                self.body.endWaiting();

                self.radioBtn.on('ifChanged', function (event) {
                    $.post(self.gateway, {
                        action: 'getcomment',
                        q: currentQuestionNum,
                        a: $(event.currentTarget).data('num')
                    }, self.proxy(function (answer) {
                        self._getAnswerComment(answer, $(event.currentTarget));
                    }), 'json');
                    self.element.find('.js-button-1').attr('disabled', false);
                });
            },

            _getAnswerComment: function (answer, btn) {
                var $label = btn.parent().parent();

                $label.addClass(this.baseAnswerClass + '--' + answer.type + ' is-selected');
                $label.parent().find('.js-comment').html(answer.text).addClass('is-shown');

            },

            '.js-button-1 click': function (el, ev) {
                ev.preventDefault();
                var data = $.extend(el.data('param'), {
                    q: $('.js-question').attr('data-num'),
                    a: $('.js-answer:checked').attr('data-num')
                });
                this.reloadBody(data);
            },

            '.js-button-2 click': function (el, ev) {
                ev.preventDefault();

                var email = this.element.find('.js-usermail').val();

                if (this._validMail(email)) {
                    this.reloadBody({'action': 'email', 'email': email});
                } else {
                    this.element.find('.js-usermail').addClass('form__input--invalid');
                }
            },

            _validMail: function (email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.LanguagesSwitch = can.Control.extend(
        {
            pluginName: 'appWidgetLanguagesSwitch',
            defaults: {}
        },
        {
            init: function () {
                var urls = $('.js-languages-switch__btn'); // закешировал 4 флажки в меню
                urls.each(function () {
                    // если нету класса "from-cacheurl", делаем ajax запрос на сущ страницы
                    if(!$(this).hasClass('from-cacheurl')){
                        currentUrl = $(this).attr('href') + window.location.pathname.substring(1);
                        $.get(currentUrl).done(function(data){
                            switch(this.url.substring(0,4)){
                                case '/en/':
                                    urls.filter('[href="/en/"]').attr('href',this.url);
                                    break;
                                case '/de/':
                                    urls.filter('[href="/de/"]').attr('href',this.url);
                                    break;
                                case '/fr/':
                                    urls.filter('[href="/fr/"]').attr('href',this.url);
                                    break;
                                default:
                                    urls.filter('[href="/"]').attr('href',this.url);
                                    break;
                            }
                        });
                    }
                });
            }
        }
    );
}(jQuery));

(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.LazyLoad = can.Control.extend(
        {
            pluginName: 'appWidgetLazyLoad',
            defaults: {
                gateway: '/ajax/content/'
            }
        },
        {
            init: function () {
                this.includePath = this.element.data('ajax--url');
                this.gateway = this.element.data('gateway') ? this.options.gateway+this.element.data('gateway')+'/' : this.options.gateway;
                if(this.includePath){
                    try {
                        $.post(this.gateway, {path: this.includePath}, this.proxy('insertContent'));
                    } catch (e) {
                        console.error('ERROR: appWidgetLazyLoad unable to load path '+this.includePath);
                    }
                }
            },

            insertContent: function (data, status, xhr){

                this.element.html(data);
                var $arAccordion = this.element.find('.js-accordion');
                window.application.installController($arAccordion, 'appWidgetAccordion');

            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.NewLazyLoad = can.Control.extend(
        {
            pluginName: 'appWidgetNewLazyLoad'
        },
        {
            init: function (element, options) {
                this.requestKey = this.element.data('lazyload-key');
                this.gateway = this.prepareUri();
                this.control = this.element.data('controller').split(',');
                this.controllers = {};

                if(this.element.data('controller') != '') {
                    this.control = this.element.data('controller').split(',');
                    this.controllers = this.getController(this.control);
                }
                var self = this;
                if (this.requestKey) {
                    try {
                        var pathname = window.location.pathname;
                        var data = {};
                        // если мы в перечисленных разделах, то получаем сссылку на детальный просмотр
                        if(['/company/blog/', '/client/club/'].indexOf(pathname) > -1){
                            data = { url: this.element.prev().attr('href') }
                        }
                        $.get(this.gateway, data, function (data) {
                            self.element.removeData().unbind();
                            self.element.replaceWith(data);

                            if(Object.keys(self.controllers).length > 0) {
                                for(selector in self.controllers) {
                                    window.application.installController(selector, self.controllers[selector]);
                                }
                            }

                            if(window.location.hash != '') {
                                if($('.js-lazyload').length == 0) {
                                    var aTag = $(window.location.hash);

                                    if (aTag.length) {
                                        $('html, body').animate({
                                            scrollTop: aTag.offset().top - 60
                                        }, 750);
                                    }
                                }
                            }
                        });
                    } catch (e) {
                        console.error('ERROR: LazyLoad не отвчает по пути ' + this.gateway);
                    }
                }
            },

            insertContent: function (data, status, xhr) {
                // this.undelegateEvents();
                this.element.removeData().unbind();
                this.element.replaceWith(data);

            },

            prepareUri: function () {

                var gateway = new URI();

                gateway.setSearch('LAZY', 'Y').setSearch('KEY', this.requestKey).toString();
                return gateway;

            },

            // Метод для связки селектора и контроллера
            getController: function (controllers) {

                var arControllers = {
                    "appWidgetTabs": "#company-team .js-tabs",
                    'appWidgetShowInfo': '#company-team .js-show-info',
                    "appWidgetContentSlider" : '.owl-carousel.js-content-slider',
                    'appWidgetFormGet' : '#zverskie .js-get-form',
                    'appWidgetEventPush' : '#zverskie .js-push-event'
                };

                var result = {};

                for(var i = 0; i < controllers.length; i++) {
                    result[arControllers[controllers[i]]] = controllers[i];
                }

                return result;

            }

        }
    );
}(jQuery));

(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.LongTable = can.Control.extend(
        {
            pluginName: 'appWidgetLongTable',
            defaults: {}
        },
        {
            init: function () {
                this.table = this.element.find('.js-long-table__table');
                this.openBtnContainer = this.element.find('.js-long-table__open-btn-wrap');
                this.openBtn = this.element.find('.js-long-table__open-btn');
                this.tableContainer = this.element.find('.js-long-table__container');
                this.tableHeight = 1950;

                this.on(this.openBtn, 'click', 'openTable');
            },

            openTable: function(el, ev) {
                var self = this;

                if(this.element.hasClass('js-long-table--accounting')) {

                    this.tableHeight = this.table.outerHeight();

                    this.tableContainer.animate({
                        height: this.tableHeight
                    }, 500, function() {
                        self.openBtnContainer.fadeOut(300);
                    });

                } else {

                    if(this.element.hasClass('js-long-table--insurance-funds')) {

                        this.tableHeight = this.table.outerHeight()+127;

                        this.tableContainer.animate({
                            height: this.tableHeight
                        }, 500, function() {
                            self.openBtnContainer.fadeOut(300);
                        });

                    } else {

                        if(this.element.hasClass('js-long-table--employees-tax')) {

                            this.tableHeight = this.table.outerHeight()+162;

                            this.tableContainer.animate({
                                height: this.tableHeight
                            }, 500, function() {
                                self.openBtnContainer.fadeOut(300);
                            });

                        } else {

                            this.tableContainer.animate({
                                height: this.tableHeight
                            }, 500, function () {
                                self.openBtnContainer.fadeOut(300);
                                self.table.stickyTableHeaders({fixedOffset: 46});
                            });

                        }

                    }
                }
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.Map = can.Control.extend(
        {
            pluginName: 'appWidgetMap',
            defaults: {}
        },
        {
            init: function () {
                ymaps.ready(this.initMap);
            },

            initMap: function () {
                var mapCenterMoscow = [55.718324068999664,37.79198949999998];
                var mapCenterSkolkovo = [55.69208956902164,37.34761950000001];

                var mapControl = {
                    balloonShadow: false,
                    iconLayout: 'default#image',
                    iconImageHref: '/local/templates/main/build/images/wa-map-mark.png',
                    iconImageSize: [49, 45],
                    zIndex: 98
                };

                if($('#moscowMap').length) {
                    var waMapMoscow = new ymaps.Map("moscowMap", {
                        center: mapCenterMoscow,
                        zoom: 16,
                        controls: ['zoomControl']
                    });

                    waMapMoscow.behaviors.disable('drag');

                    var waPlacemarkMoscow = new ymaps.Placemark(mapCenterMoscow, {}, mapControl);

                    waMapMoscow.geoObjects.add(waPlacemarkMoscow);

                    window.addEventListener('resize', function() {
                        waMapMoscow.setCenter(mapCenterMoscow);
                    });

                    $('.js-map-address').on('click', function() {
                        waMapMoscow.panTo(mapCenterMoscow);
                    });
                }

                if($('#skolkovo-map').length) {
                    var waMapSkolkovo = new ymaps.Map("skolkovo-map", {
                        center: mapCenterSkolkovo,
                        zoom: 16,
                        controls: ['zoomControl']
                    });

                    waMapSkolkovo.behaviors.disable('drag');

                    var waPlacemarkSkolkovo = new ymaps.Placemark(mapCenterSkolkovo, {}, mapControl);

                    waMapSkolkovo.geoObjects.add(waPlacemarkSkolkovo);

                    window.addEventListener('resize', function() {
                        waMapSkolkovo.setCenter(mapCenterSkolkovo);
                    });

                    $('.js-map-address-skolkovo').on('click', function() {
                        waMapSkolkovo.panTo(mapCenterSkolkovo);
                    });
                }
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.NewsArchive = can.Control.extend(
        {
            pluginName: 'appWidgetNewsArchive',
            defaults: {}
        },
        {
            init: function () {
                this.filterItem = this.element.find('.js-news-filter-item');

                this.newsField = $('.js-news-field');
                this.newsFieldUl = $('.js-news-field > ul');
                this.newsFieldPager = $('.js-news-field > .pagination--news');
                this.on(this.filterItem, 'click', 'filterArchiveOnClick');

            },

            'filterArchiveOnClick': function(el, em) {
                if (el.hasClass('current')) {
                    el.find('.current-close').remove();
                } else {
                    el.prepend('<span class="current-close">close</span>');
                }
                el.toggleClass('current');

                this.updateNews();
            },

            'updateNews': function() {
                var i=0, aDate=[], o=this;

                this.element.find('.js-news-filter-item.current').each(function () {
                    aDate[i] = $(this).data('month')+"-"+$(this).data('year');
                    i++;
                });
                $.get("",{'DATE[]':aDate}
                ).done(function(result){

                    o.newsField.empty();
                    o.newsField.append(result);

                }).error(function(){
                    console.log('ERROR ADDING NEWS');
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.OffCanvasMobile = can.Control.extend(
        {
            pluginName: 'appWidgetOffCanvasMobile',
            defaults: {}
        },
        {
            init: function () {
                this.trigger = this.element.find('.js-off-canvas-mobile-trigger');
                this.menu = this.element.find('.js-off-canvas-mobile-menu');
                this.overlay = this.element.find('.js-off-canvas-mobile-overlay');

                this.on(this.trigger, 'click', 'showOffCanvasMobile');
                this.on(this.overlay, 'click', 'hideOffCanvasMobile');
            },

            'showOffCanvasMobile': function(el, ev) {
                ev.preventDefault();

                $('body').addClass('off-canvas-overflow');
                this.menu.addClass('active');
                this.overlay.addClass('active');
            },

            'hideOffCanvasMobile': function(el, ev) {
                $('body').removeClass('off-canvas-overflow');
                this.menu.removeClass('active');
                this.overlay.removeClass('active');
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Print = App.Widgets.Print || {};
    App.Widgets.Print.Print = can.Control.extend(
        {
            pluginName: 'appWidgetPrint',
            defaults: {}
        },
        {
            init: function () {
            },
            // .js-print - определение модуля для печати
            // .js-print-btn - кнопка печати
            // data-print="printElement" - data-атрибут для задания элемента, который нужно распечатать (.js-class)
            // .no-print - класс для скрытия элемента при печати
            // data-printlogo="true" для печати логотипа компании в заголовке
            '.js-print-btn click': function (el, ev) {
                ev.preventDefault();

                var printNodeClassName = '.' + el.data('print');
                var $printElementClone = $(printNodeClassName).clone(true);
                $printElementClone.find('.content-banner').addClass('no-print');

                if (el.data('printlogo')) {
                    $printElementClone.prepend('<div style="text-align: center;"><img src="/local/templates/main/build/images/logo.png"></div>');
                }

                $printElementClone.printThis({
                    removeScripts: true,
                    printDelay: 450
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.QuizEvents = can.Control.extend(
        {
            pluginName: 'appWidgetQuizEvents',
            defaults: {}
        },
        {
            init: function () {
                this.submitBtn = this.element.find('.question__label');
                this.gtmCategory = this.element.data('gtmcategory');
                this.on(this.submitBtn, 'click', 'submitBtnOnClick');
                this.send = [];
            },
            submitBtnOnClick: function (e) {
                if (this.send.indexOf(e.find('[data-check-question]').data('push')) != -1) {

                } else {
                    this.pushEvent(e, this.gtmCategory);
                }
            },
            pushEvent: function (element, gtmCategory) {
                this.send.push(element.find('[data-check-question]').data('push'));
                console.log(gtmCategory + '_Choosed_' + element.find('[data-check-question]').data('push'));
                if (typeof GTMpushEvent == 'function') {
                    GTMpushEvent(gtmCategory + '_Choosed_' + element.find('[data-check-question]').data('push'), gtmCategory);
                }
            }
        }
    );
}(jQuery));



(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ScrollTo = can.Control.extend(
        {
            pluginName: 'appWidgetScrollTo',
            defaults: {}
        },
        {
            init: function () {
                this.on(this.element, 'click', 'scrollTo');
            },

            'scrollTo': function(el, ev) {
                ev.preventDefault();

                this.targetId = el.attr('href').substring(1);
                this.targetObject = $('#' + this.targetId);

                $('html, body').animate({
                    scrollTop: this.targetObject.offset().top - 60
                }, 1500);

                if(this.element.hasClass('js-scroll-to--secret-info-tab')) {
                    $('.js-tabs__tab[data-id=secret-info]').click();
                } else if(this.element.hasClass('js-scroll-to--company-chief-accountants-tab')) {
                    $('.js-tabs__tab[data-id=company-chief-accountants]').click();
                }
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ShowInfo = can.Control.extend(
        {
            pluginName: 'appWidgetShowInfo',
            defaults: {}
        },
        {
            init: function () {
                this.btn = this.element.find('.js-show-info__btn');
                this.hiddenInfo = this.element.find('.js-show-info__info');

                this.on(this.btn, 'click', 'showHiddenInfo');
            },

            scrollTo: function() {
                var self = this;
                $('html, body').animate({
                    scrollTop: $('[data-target=' + self.dataTarget + ']').offset().top - 60
                }, 1500);
            },

            'showHiddenInfo': function(el, ev) {
                ev.preventDefault();

                var needScroll = false;

                if(!el.hasClass('open') && el.data('scroll-to'))
                    needScroll = true;


                el.toggleClass('open');
                el.next(this.hiddenInfo).slideToggle();

                if(this.element.hasClass('js-show-info--no-animation')) {
                    el.next(this.hiddenInfo).toggle();
                }

                // Если скрытую информацию и кнопку-триггер невозможно разместить в общем контейнере
                // Или скрытая информация расположена не после кнопки-триггера
                if(this.element.filter('[data-attribute]') && !this.element.hasClass('js-show-info--no-animation')) {
                    this.dataTarget = el.attr('data-attribute');
                    $('[data-target=' + this.dataTarget + ']').slideToggle();
                } else if(this.element.filter('[data-attribute]') && this.element.hasClass('js-show-info--no-animation')) {
                    this.dataTarget = el.attr('data-attribute');
                    $('[data-target=' + this.dataTarget + ']').toggle();
                }

                if(needScroll) {
                    this.scrollTo();
                }
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ShowMore = can.Control.extend(
        {
            pluginName: 'appWidgetShowMore',
            defaults: {}
        },
        {
            init: function () {
                this.items = this.element.find('.js-show-more__item');
                this.showMoreBtn = this.element.find('.js-show-more__btn');

                this.items.slice(0, 3).removeClass('hide');

                this.on(this.showMoreBtn, 'click', 'showMoreOnClick');
            },

            'showMoreOnClick': function() {
                this.hiddenItems = this.element.find('.js-show-more__item.hide');
                this.hiddenItems.slice(0, 3).removeClass('hide');
            }
        }
    );
}(jQuery));



(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ShowSearchForm = can.Control.extend(
        {
            pluginName: 'appWidgetShowSearchForm',
            defaults: {}
        },
        {
            init: function () {
                this.hiddenOnClick = this.element.find('.js-show-search-form__hidden');
                this.shownOnClick = this.element.find('.js-show-search-form__shown');
                this.showFormBtn = this.element.find('.js-show-search-form__btn');

                this.on(this.showFormBtn, 'click', 'showFormOnClick');
            },

            'showFormOnClick': function() {
                this.hiddenOnClick.addClass('none');
                this.shownOnClick.removeClass('none');
            },

            'hideFormOnClick': function() {
                this.hiddenOnClick.removeClass('none');
                this.shownOnClick.addClass('none');
            },

            '{document} keyup': function(el, ev) {
                if (ev.keyCode == 27) {
                    this.hideFormOnClick();
                }
            },

            '{document} click': function(el, ev) {
                if(!this.shownOnClick.hasClass('none')) {
                    if($(ev.target).closest('.js-show-search-form__shown').length || $(ev.target).hasClass('js-show-search-form__btn'))
                        return;

                    this.hideFormOnClick();
                    ev.stopPropagation();
                }
            }
        }
    );
}(jQuery));



(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.PaginationPortfolio = can.Control.extend(
        {
            pluginName: 'appPaginationPortfolio',
            defaults: {}
        },
        {
            init: function () {
                this.portfolioField = this.element.find('.js-portfolio-item');
                this.paginationBlock = $('.js-pagination--portfolio');
                this.paginationCurrentItem = $('.js-pagination--portfolio > div.pagination__item');
                this.preparePaginator();

            },

            'preparePaginator': function() {
                this.paginationItem = $('.js-pagination--portfolio a.pagination__item');
                this.on(this.paginationItem, 'click', 'paginatePortfolio');
            },

            'paginatePortfolio': function (el, em) {
                em.preventDefault();
                this.updateItem(el.attr('href'));
            },

            'updateItem': function (src) {
                this.element.startWaiting();
                $.get(src, this.proxy('showResult'));
            },

            'showResult': function (data) {
                this.portfolioField.empty();
                this.portfolioField.append(data);
                this.paginationItem.off();
                this.preparePaginator();
                this.element.endWaiting();
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ImageZoom = can.Control.extend(
        {
            pluginName: 'appImageZoom',
            defaults: {}
        },
        {
            init: function () {
                var zoomImages = {
                    step1 : [
                        {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step1_1.png'
                        }, {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step1_2.png'
                        }
                    ],
                    step2 : [
                        {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step2_1.png'
                        }, {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step2_2.png'
                        }, {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step2_3.png'
                        }
                    ],
                    step3 : [
                        {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step3_1.png'
                        }, {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step3_2.png'
                        }, {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step3_3.png'
                        }
                    ],
                    step4 : [
                        {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step4_1.png'
                        }, {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step4_2.png'
                        }, {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step4_3.png'
                        }, {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step4_4.png'
                        }, {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step4_5.png'
                        }
                    ],
                    step5 : [
                        {
                            img : '/local/templates/main/images/instrukcia_alfa_bank/step5_1.png'
                        }
                    ]
                };

                var zoomCurStep = 'step1',
                    zoomWrapper = $('#image-gallery-' + zoomCurStep),
                    zoomTotal = zoomImages[zoomCurStep].length,
                    zoomCurImageIdx = 1;

                $(".fancybox").fancybox({
                    arrows: false
                });

                $(document).on('click mouseenter touchstart', '.js-zoom-slide-select', function() {
                    if(zoomCurImageIdx != $(this).data('slidenum')) {
                        zoomCurImageIdx = $(this).data('slidenum');

                        $(zoomWrapper).find('.fancybox').attr('href', zoomImages[zoomCurStep][zoomCurImageIdx - 1].img);
                        $(zoomWrapper).find('.fancybox img').attr('src', zoomImages[zoomCurStep][zoomCurImageIdx - 1].img);
                    }
                });

                $(document).on('click touchstart', '.js-slider-zoom-lens', function(e) {
                    $(this).parent('.slider-zoom-img').find('.fancybox').click();
                });

                $(document).on('click', '.js-zoom_tab', function() {
                    if($(this).data('step') != '' && $(this).data('step') != zoomCurStep) {
                        zoomCurStep = $(this).data('step');
                        zoomWrapper = $('#image-gallery-' + zoomCurStep);
                        zoomTotal = zoomImages[zoomCurStep].length;
                        zoomCurImageIdx = 1;

                        $(zoomWrapper).find('.fancybox').attr('href', zoomImages[zoomCurStep][0].img);
                        $(zoomWrapper).find('.fancybox img').attr('src', zoomImages[zoomCurStep][0].img);
                    }
                });
            }
        }
    );
}(jQuery));

/*
    ImageViewer v 1.1.3
    Author: Sudhanshu Yadav
    Copyright (c) 2015-2016 to Sudhanshu Yadav - ignitersworld.com , released under the MIT license.
    Demo on: http://ignitersworld.com/lab/imageViewer.html
*/

/*** picture view plugin ****/
(function ($, window, document, undefined) {
    "use strict";

    //an empty function
    var noop = function () {};

    var $body = $('body'),
        $window = $(window),
        $document = $(document);


    //constants
    var ZOOM_CONSTANT = 15; //increase or decrease value for zoom on mouse wheel
    var MOUSE_WHEEL_COUNT = 5; //A mouse delta after which it should stop preventing default behaviour of mouse wheel

    //ease out method
    /*
      t : current time,
      b : intial value,
      c : changed value,
      d : duration
  */
    function easeOutQuart(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    };


    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel

    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());

    //function to check if image is loaded
    function imageLoaded(img) {
        return img.complete && (typeof img.naturalWidth === 'undefined' || img.naturalWidth !== 0);
    }

    var imageViewHtml = '<div class="iv-loader"></div> <div class="iv-snap-view">' + '<div class="iv-snap-image-wrap">' + '<div class="iv-snap-handle"></div>' + '</div>' + '<div class="iv-zoom-slider"><div class="iv-zoom-handle"></div></div></div>' + '<div class="iv-image-view" ><div class="iv-image-wrap" ></div></div>';

    //add a full screen view
    $(function () {
        if(!$body.length) $body = $('body');
        $body.append('<div id="iv-container">' + imageViewHtml + '<div class="iv-close"></div><div>');
    });

    function Slider(container, options) {
        this.container = container;
        this.onStart = options.onStart || noop;
        this.onMove = options.onMove || noop;
        this.onEnd = options.onEnd || noop;
        this.sliderId = options.sliderId || 'slider' + Math.ceil(Math.random() * 1000000);
    }

    Slider.prototype.init = function () {
        var self = this,
            container = this.container,
            eventSuffix = '.' + this.sliderId;

        //assign event on snap image wrap
        this.container.on('touchstart' + eventSuffix + ' mousedown' + eventSuffix, function (estart) {
            estart.preventDefault();
            var touchMove = (estart.type == "touchstart" ? "touchmove" : "mousemove") + eventSuffix,
                touchEnd = (estart.type == "touchstart" ? "touchend" : "mouseup") + eventSuffix,
                eOrginal = estart.originalEvent,
                sx = eOrginal.clientX || eOrginal.touches[0].clientX,
                sy = eOrginal.clientY || eOrginal.touches[0].clientY;

            var start = self.onStart(estart, {
                x: sx,
                y: sy
            });

            if (start === false) return;

            var moveListener = function (emove) {
                emove.preventDefault();

                eOrginal = emove.originalEvent;

                //get the cordinates
                var mx = eOrginal.clientX || eOrginal.touches[0].clientX,
                    my = eOrginal.clientY || eOrginal.touches[0].clientY;

                self.onMove(emove, {
                    dx: mx - sx,
                    dy: my - sy,
                    mx: mx,
                    my: my
                });

            };

            var endListener = function () {
                $document.off(touchMove, moveListener);
                $document.off(touchEnd, endListener);
                self.onEnd();
            };

            $document.on(touchMove, moveListener);
            $document.on(touchEnd, endListener);
        });

        return this;
    }


    function ImageViewer(container, options) {
        var self = this;

        if (container.is('#iv-container')) {
            self._fullPage = true;
        }

        self.container = container;
        options = self.options = $.extend({}, ImageViewer.defaults, options);

        self.zoomValue = 100;

        if (!container.find('.snap-view').length) {
            container.prepend(imageViewHtml);
        }

        container.addClass('iv-container');

        if (container.css('position') == 'static') container.css('position', 'relative');

        self.snapView = container.find('.iv-snap-view');
        self.snapImageWrap = container.find('.iv-snap-image-wrap');
        self.imageWrap = container.find('.iv-image-wrap');
        self.snapHandle = container.find('.iv-snap-handle');
        self.zoomHandle = container.find('.iv-zoom-handle');
        self._viewerId = 'iv' + Math.floor(Math.random() * 1000000);
    }


    ImageViewer.prototype = {
        constructor: ImageViewer,
        _init: function () {
            var viewer = this,
                options = viewer.options,
                zooming = false, // tell weather we are zooming trough touch
                container = this.container;

            var eventSuffix = '.' + viewer._viewerId;

            //cache dom refrence
            var snapHandle = this.snapHandle;
            var snapImgWrap = this.snapImageWrap;
            var imageWrap = this.imageWrap;

            var snapSlider = new Slider(snapImgWrap, {
                sliderId: viewer._viewerId,
                onStart: function () {

                    if (!viewer.loaded) return false;

                    var handleStyle = snapHandle[0].style;

                    this.curHandleTop = parseFloat(handleStyle.top);
                    this.curHandleLeft = parseFloat(handleStyle.left);
                    this.handleWidth = parseFloat(handleStyle.width);
                    this.handleHeight = parseFloat(handleStyle.height);
                    this.width = snapImgWrap.width();
                    this.height = snapImgWrap.height();

                    //stop momentum on image
                    clearInterval(imageSlider.slideMomentumCheck);
                    cancelAnimationFrame(imageSlider.sliderMomentumFrame);
                },
                onMove: function (e, position) {
                    var xPerc = this.curHandleLeft + position.dx * 100 / this.width,
                        yPerc = this.curHandleTop + position.dy * 100 / this.height;

                    xPerc = Math.max(0, xPerc);
                    xPerc = Math.min(100 - this.handleWidth, xPerc);

                    yPerc = Math.max(0, yPerc);
                    yPerc = Math.min(100 - this.handleHeight, yPerc);


                    var containerDim = viewer.containerDim,
                        imgWidth = viewer.imageDim.w * (viewer.zoomValue / 100),
                        imgHeight = viewer.imageDim.h * (viewer.zoomValue / 100),
                        imgLeft = imgWidth < containerDim.w ? (containerDim.w - imgWidth) / 2 : -imgWidth * xPerc / 100,
                        imgTop = imgHeight < containerDim.h ? (containerDim.h - imgHeight) / 2 : -imgHeight * yPerc / 100;

                    snapHandle.css({
                        top: yPerc + '%',
                        left: xPerc + '%'
                    })

                    viewer.currentImg.css({
                        left: imgLeft,
                        top: imgTop
                    })
                }
            }).init();


            /*Add slide interaction to image*/
            var imageSlider = viewer._imageSlider = new Slider(imageWrap, {
                sliderId: viewer._viewerId,
                onStart: function (e, position) {
                    if (!viewer.loaded) return false;
                    if (zooming) return;
                    var self = this;
                    snapSlider.onStart();
                    self.imgWidth = viewer.imageDim.w * viewer.zoomValue / 100;
                    self.imgHeight = viewer.imageDim.h * viewer.zoomValue / 100;

                    self.positions = [position, position];

                    self.startPosition = position;

                    //clear all animation frame and interval
                    viewer._clearFrames();

                    self.slideMomentumCheck = setInterval(function () {
                        if (!self.currentPos) return;
                        self.positions.shift();
                        self.positions.push({
                            x: self.currentPos.mx,
                            y: self.currentPos.my
                        })
                    }, 50);
                },
                onMove: function (e, position) {
                    if (zooming) return;
                    this.currentPos = position;

                    snapSlider.onMove(e, {
                        dx: -position.dx * snapSlider.width / this.imgWidth,
                        dy: -position.dy * snapSlider.height / this.imgHeight
                    });
                },
                onEnd: function () {
                    if (zooming) return;
                    var self = this;

                    var xDiff = this.positions[1].x - this.positions[0].x,
                        yDiff = this.positions[1].y - this.positions[0].y;

                    function momentum() {
                        if (step <= 60) {
                            self.sliderMomentumFrame = requestAnimationFrame(momentum);
                        }

                        positionX = positionX + easeOutQuart(step, xDiff / 3, -xDiff / 3, 60);
                        positionY = positionY + easeOutQuart(step, yDiff / 3, -yDiff / 3, 60)


                        snapSlider.onMove(null, {
                            dx: -((positionX) * snapSlider.width / self.imgWidth),
                            dy: -((positionY) * snapSlider.height / self.imgHeight)
                        });
                        step++;
                    }

                    if (Math.abs(xDiff) > 30 || Math.abs(yDiff) > 30) {
                        var step = 1,
                            positionX = self.currentPos.dx,
                            positionY = self.currentPos.dy;

                        momentum();
                    }
                }
            }).init();


            /*Add zoom interation in mouse wheel*/
            var changedDelta = 0;
            imageWrap.on("mousewheel" + eventSuffix + " DOMMouseScroll" + eventSuffix, function (e) {
                if(!options.zoomOnMouseWheel) return;

                if (!viewer.loaded) return;


                //clear all animation frame and interval
                viewer._clearFrames();

                // cross-browser wheel delta
                var delta = Math.max(-1, Math.min(1, (e.originalEvent.wheelDelta || -e.originalEvent.detail))),
                    zoomValue = viewer.zoomValue * (100 + delta * ZOOM_CONSTANT) / 100;

                if(!(zoomValue >= 100 && zoomValue <= options.maxZoom)){
                    changedDelta += Math.abs(delta);
                }
                else{
                    changedDelta = 0;
                }

                if(changedDelta > MOUSE_WHEEL_COUNT) return;

                e.preventDefault();

                var contOffset = container.offset(),
                    x = (e.pageX || e.originalEvent.pageX) - contOffset.left,
                    y = (e.pageY || e.originalEvent.pageY) - contOffset.top;



                viewer.zoom(zoomValue, {
                    x: x,
                    y: y
                });

                //show the snap viewer
                showSnapView();
            });


            //apply pinch and zoom feature
            imageWrap.on('touchstart' + eventSuffix, function (estart) {
                if (!viewer.loaded) return;
                var touch0 = estart.originalEvent.touches[0],
                    touch1 = estart.originalEvent.touches[1];

                if (!(touch0 && touch1)) {
                    return;
                }


                zooming = true;

                var contOffset = container.offset();

                var startdist = Math.sqrt(Math.pow(touch1.pageX - touch0.pageX, 2) + Math.pow(touch1.pageY - touch0.pageY, 2)),
                    startZoom = viewer.zoomValue,
                    center = {
                        x: ((touch1.pageX + touch0.pageX) / 2) - contOffset.left,
                        y: ((touch1.pageY + touch0.pageY) / 2) - contOffset.top
                    }

                var moveListener = function (emove) {
                    emove.preventDefault();

                    var touch0 = emove.originalEvent.touches[0],
                        touch1 = emove.originalEvent.touches[1],
                        newDist = Math.sqrt(Math.pow(touch1.pageX - touch0.pageX, 2) + Math.pow(touch1.pageY - touch0.pageY, 2)),
                        zoomValue = startZoom + (newDist - startdist) / 2;

                    viewer.zoom(zoomValue, center);
                };

                var endListener = function () {
                    $document.off('touchmove', moveListener);
                    $document.off('touchend', endListener);
                    zooming = false;
                };

                $document.on('touchmove', moveListener);
                $document.on('touchend', endListener);

            });


            //handle double tap for zoom in and zoom out
            var touchtime = 0,
                point,
                curPoint;

            imageWrap.on('mousedown' + eventSuffix + ' touchstart' + eventSuffix, function (e) {
                point = {
                    x: 0,
                    y: 0
                };

                if(typeof e.pageX !== "undefined") {
                    point.x = e.pageX;
                    point.y = e.pageY;
                } else {
                    point.x = e.originalEvent.touches[0].pageX;
                    point.y = e.originalEvent.touches[0].pageY;
                }
            });

            imageWrap.on('mouseup' + eventSuffix + ' touchend' + eventSuffix, function (e) {
                curPoint = {
                    x: 0,
                    y: 0
                };

                if(typeof e.pageX !== "undefined") {
                    curPoint.x = e.pageX;
                    curPoint.y = e.pageY;
                } else {
                    curPoint.x = e.originalEvent.changedTouches[0].pageX;
                    curPoint.y = e.originalEvent.changedTouches[0].pageY;
                }

                if (Math.abs(curPoint.x - point.x) < 50 && Math.abs(curPoint.y - point.y) < 50) {
                    if(viewer.zoomValue == options.maxZoom) {
                        viewer.zoom(100);
                    } else {
                        for(var i = 2; i <= (options.maxZoom / 100); i++) {
                            if((viewer.zoomValue / 100) < i) {
                                viewer.zoom((i * 100));
                                break;
                            }
                        }
                    }
                }
            });

            /*imageWrap.on('click' + eventSuffix, function (e) {
          if (touchtime == 0) {
              touchtime = Date.now();
              point = {
                  x: e.pageX,
                  y: e.pageY
              };
          } else {
              if ((Date.now() - touchtime) < 500 && Math.abs(e.pageX - point.x) < 50 && Math.abs(e.pageY - point.y) < 50) {
                  if (viewer.zoomValue == options.zoomValue) {
                      viewer.zoom(200)
                  } else {
                      viewer.resetZoom()
                  }
                  touchtime = 0;
              } else {
                  touchtime = 0;
              }
          }
      });*/

            //zoom in zoom out using zoom handle
            var slider = viewer.snapView.find('.iv-zoom-slider');
            var zoomSlider = new Slider(slider, {
                sliderId: viewer._viewerId,
                onStart: function (eStart) {

                    if (!viewer.loaded) return false;

                    this.leftOffset = slider.offset().left;
                    this.handleWidth = viewer.zoomHandle.width();
                    this.onMove(eStart);

                },
                onMove: function (e, position) {
                    var newLeft = (e.pageX || e.originalEvent.touches[0].pageX) - this.leftOffset - this.handleWidth / 2;

                    newLeft = Math.max(0, newLeft);
                    newLeft = Math.min(viewer._zoomSliderLength, newLeft);

                    var zoomValue = 100 + (options.maxZoom - 100) * newLeft / viewer._zoomSliderLength;

                    viewer.zoom(zoomValue);
                }
            }).init();


            //display snapView on interaction
            var snapViewTimeout, snapViewVisible;

            function showSnapView(noTimeout) {
                if(!options.snapView) return;

                if (snapViewVisible || viewer.zoomValue <= 100 || !viewer.loaded) return;
                clearTimeout(snapViewTimeout);
                snapViewVisible = true;
                viewer.snapView.css('opacity', 1);
                if (!noTimeout) {
                    snapViewTimeout = setTimeout(function () {
                        viewer.snapView.css('opacity', 0);
                        snapViewVisible = false;
                    }, 4000);
                }
            }

            imageWrap.on('touchmove' + eventSuffix + ' mousemove' + eventSuffix, function () {
                showSnapView();
            });

            var snapEventsCallback = {};
            snapEventsCallback['mouseenter' + eventSuffix + ' touchstart' + eventSuffix] = function () {
                snapViewVisible = false;
                showSnapView(true);
            };

            snapEventsCallback['mouseleave' + eventSuffix + ' touchend' + eventSuffix] = function () {
                snapViewVisible = false;
                showSnapView();
            };

            viewer.snapView.on(snapEventsCallback);


            //calculate elments size on window resize
            if (options.refreshOnResize) $window.on('resize' + eventSuffix, function () {
                viewer.refresh()
            });

            if (viewer._fullPage) {
                //prevent scrolling the backside if container if fixed positioned
                container.on('touchmove' + eventSuffix + ' mousewheel' + eventSuffix + ' DOMMouseScroll' + eventSuffix, function (e) {
                    e.preventDefault();
                });

                //assign event on close button
                container.find('.iv-close').on('click' + eventSuffix, function () {
                    viewer.hide();
                });
            }
        },

        //method to zoom images
        zoom: function (perc, point) {
            perc = Math.round(Math.max(100, perc));
            perc = Math.min(this.options.maxZoom, perc);

            point = point || {
                x: this.containerDim.w / 2,
                y: this.containerDim.h / 2
            };

            var self = this,
                maxZoom = this.options.maxZoom,
                curPerc = this.zoomValue,
                curImg = this.currentImg,
                containerDim = this.containerDim,
                curLeft = parseFloat(curImg.css('left')),
                curTop = parseFloat(curImg.css('top'));

            self._clearFrames();

            var step = 0;

            //calculate base top,left,bottom,right
            var containerDim = self.containerDim,
                imageDim = self.imageDim;
            var baseLeft = (containerDim.w - imageDim.w) / 2,
                baseTop = (containerDim.h - imageDim.h) / 2,
                baseRight = containerDim.w - baseLeft,
                baseBottom = containerDim.h - baseTop;

            function zoom() {
                step++;

                if (step < 20) {
                    self._zoomFrame = requestAnimationFrame(zoom);
                }

                var tickZoom = easeOutQuart(step, curPerc, perc - curPerc, 20);


                var ratio = tickZoom / curPerc,
                    imgWidth = self.imageDim.w * tickZoom / 100,
                    imgHeight = self.imageDim.h * tickZoom / 100,
                    newLeft = -((point.x - curLeft) * ratio - point.x),
                    newTop = -((point.y - curTop) * ratio - point.y);

                //fix for left and top
                newLeft = Math.min(newLeft, baseLeft);
                newTop = Math.min(newTop, baseTop);

                //fix for right and bottom
                if((newLeft + imgWidth) < baseRight){
                    newLeft = baseRight - imgWidth; //newLeft - (newLeft + imgWidth - baseRight)
                }

                if((newTop + imgHeight) < baseBottom){
                    newTop =  baseBottom - imgHeight; //newTop + (newTop + imgHeight - baseBottom)
                }


                curImg.css({
                    height: imgHeight + 'px',
                    width: imgWidth + 'px',
                    left: newLeft + 'px',
                    top: newTop + 'px'
                });

                self.zoomValue = tickZoom;

                self._resizeHandle(imgWidth, imgHeight, newLeft, newTop);

                //update zoom handle position
                self.zoomHandle.css('left', ((tickZoom - 100) * self._zoomSliderLength) / (maxZoom - 100) + 'px');
            }

            zoom();
        },
        _clearFrames: function () {
            clearInterval(this._imageSlider.slideMomentumCheck);
            cancelAnimationFrame(this._imageSlider.sliderMomentumFrame);
            cancelAnimationFrame(this._zoomFrame)
        },
        resetZoom: function () {
            this.zoom(this.options.zoomValue);
        },
        //calculate dimensions of image, container and reset the image
        _calculateDimensions: function () {
            //calculate content width of image and snap image
            var self = this,
                curImg = self.currentImg,
                container = self.container,
                snapView = self.snapView,
                imageWidth = curImg.width(),
                imageHeight = curImg.height(),
                contWidth = container.width(),
                contHeight = container.height(),
                snapViewWidth = snapView.innerWidth(),
                snapViewHeight = snapView.innerHeight();

            //set the container dimension
            self.containerDim = {
                w: contWidth,
                h: contHeight
            }

            //set the image dimension
            var imgWidth, imgHeight, ratio = imageWidth / imageHeight;

            imgWidth = (imageWidth > imageHeight && contHeight >= contWidth) || ratio * contHeight > contWidth ? contWidth : ratio * contHeight;

            imgHeight = imgWidth / ratio;

            self.imageDim = {
                w: imgWidth,
                h: imgHeight
            }

            //reset image position and zoom
            curImg.css({
                width: imgWidth + 'px',
                height: imgHeight + 'px',
                left: (contWidth - imgWidth) / 2 + 'px',
                top: (contHeight - imgHeight) / 2 + 'px',
                'max-width': 'none',
                'max-height': 'none'
            });

            //set the snap Image dimension
            var snapWidth = imgWidth > imgHeight ? snapViewWidth : imgWidth * snapViewHeight / imgHeight,
                snapHeight = imgHeight > imgWidth ? snapViewHeight : imgHeight * snapViewWidth / imgWidth;

            self.snapImageDim = {
                w: snapWidth,
                h: snapHeight
            }

            self.snapImg.css({
                width: snapWidth,
                height: snapHeight
            });

            //calculate zoom slider area
            self._zoomSliderLength = snapViewWidth - self.zoomHandle.outerWidth();

        },
        refresh: function () {
            if (!this.loaded) return;
            this._calculateDimensions();
            this.resetZoom();
        },
        _resizeHandle: function (imgWidth, imgHeight, imgLeft, imgTop) {
            var curImg = this.currentImg,
                imageWidth = imgWidth || this.imageDim.w * this.zoomValue / 100,
                imageHeight = imgHeight || this.imageDim.h * this.zoomValue / 100,
                left = Math.max(-(imgLeft || parseFloat(curImg.css('left'))) * 100 / imageWidth, 0),
                top = Math.max(-(imgTop || parseFloat(curImg.css('top'))) * 100 / imageHeight, 0),
                handleWidth = Math.min(this.containerDim.w * 100 / imageWidth, 100),
                handleHeight = Math.min(this.containerDim.h * 100 / imageHeight, 100);


            this.snapHandle.css({
                top: top + '%',
                left: left + '%',
                width: handleWidth + '%',
                height: handleHeight + '%'
            });
        },
        show: function (image, hiResImg) {
            if (this._fullPage) {
                this.container.show();
                if (image) this.load(image, hiResImg);
            }
        },
        hide: function () {
            if (this._fullPage) {
                this.container.hide();
            }
        },
        options: function (key, value) {
            if (!value) return this.options[key];

            this.options[key] = value;
        },
        destroy: function (key, value) {
            var eventSuffix = '.' + this._viewerId;
            if (this._fullPage) {
                container.off(eventSuffix);
                container.find('[class^="iv"]').off(eventSuffix);
            } else {
                this.container.remove('[class^="iv"]');
            }
            $window.off(eventSuffix);
            return null;
        },
        load: function (image, hiResImg) {
            var self = this,
                container = this.container;

            container.find('.iv-snap-image,.iv-large-image').remove();
            var snapImageWrap = this.container.find('.iv-snap-image-wrap');
            snapImageWrap.prepend('<img class="iv-snap-image" src="' + image + '" />');
            this.imageWrap.prepend('<img class="iv-large-image" src="' + image + '" />');

            if (hiResImg) {
                this.imageWrap.append('<img class="iv-large-image" src="' + hiResImg + '" />')
            }

            var currentImg = this.currentImg = this.container.find('.iv-large-image');
            this.snapImg = this.container.find('.iv-snap-image');
            self.loaded = false;

            //show loader
            container.find('.iv-loader').show();
            currentImg.hide();
            self.snapImg.hide();

            //refresh the view
            function refreshView() {
                self.loaded = true;
                self.zoomValue = 100;

                //reset zoom of images
                currentImg.show();
                self.snapImg.show();
                self.refresh();
                self.resetZoom();

                //hide loader
                container.find('.iv-loader').hide();
            }

            if (imageLoaded(currentImg[0])) {
                refreshView();
            } else {
                $(currentImg[0]).on('load', refreshView);
            }

        }
    }

    ImageViewer.defaults = {
        zoomValue: 100,
        snapView: true,
        maxZoom: 500,
        refreshOnResize: true,
        zoomOnMouseWheel : true
    }

    window.ImageViewer = function (container, options) {
        var imgElm, imgSrc, hiResImg;
        if (!(container && (typeof container == "string" || container instanceof Element || container[0] instanceof Element))) {
            options = container;
            container = $('#iv-container');
        }

        container = $(container);

        if (container.is('img')) {
            imgElm = container;
            imgSrc = imgElm[0].src;
            hiResImg = imgElm.attr('high-res-src') || imgElm.attr('data-high-res-src');
            container = imgElm.wrap('<div class="iv-container" style="display:inline-block; overflow:hidden"></div>').parent();
            imgElm.css({
                opacity: 0,
                position: 'relative',
                zIndex: -1
            });
        } else {
            imgSrc = container.attr('src') || container.attr('data-src');
            hiResImg = container.attr('high-res-src') || container.attr('data-high-res-src');
        }


        var viewer = new ImageViewer(container, options);
        viewer._init();

        if (imgSrc) viewer.load(imgSrc, hiResImg);

        return viewer;
    };


    $.fn.ImageViewer = function (options) {
        return this.each(function () {
            var $this = $(this);
            var viewer = window.ImageViewer($this, options);
            $this.data('ImageViewer', viewer);
        });
    }

}((window.jQuery), window, document));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Ajax = can.Control.extend(
        {
            pluginName: 'appWidgetEventFormAjax',
            defaults: {
                ZATOgateway: '/ajax/interface/zato/'
            }
        },
        {
            init: function () {
                this.form = this.element.find('form');
                this.formName = this.form.attr('name');
                this.gateway = this.form.attr('action');
                this.KISDirection = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                this.KISComment = this.form.find('input[data-fieldtype="KIS_COMMENT"]').val();
                this.KISType = this.form.find('input[data-fieldtype="TYPE"]').val();
                this.KISCode = this.form.find('input[data-fieldtype="CODE"]').val();

                if (typeof GTMpushEventLoadForm == "function") {
                    GTMpushEventLoadForm(this.formName);
                }

                if (this.form.data('validate') && !this.form.data('validate-nomsg')) {
                    this.form.validate(window.application.validateOptionsDefault);
                } else {
                    this.form.validate(window.application.validateOptionsNoMsg);
                }

                this.form.find('input[data-fieldtype="FORM_REGION"]').val(Geo.region);

                var clientID = '';
                if (typeof waTrack == "undefined") {
                    clientID = getGAClientID();
                } else {
                    clientID = waTrack.clientID;
                }
                this.form.find('input[data-fieldtype="FORM_CID"]').val(clientID);

                this.form.find('input[data-fieldtype="FORM_URL"]').val(window.location.toString());

                this.formTouchEvent();

                this.on(this.form, 'submit', 'submitForm');
            },
            getNotRusLang: function () {
                var langs = ['en', 'de', 'fr'];
                var pathArray = window.location.pathname.split('/');
                if (langs.indexOf(pathArray[1]) !== -1) {
                    return true;
                }
                return false;
            },
            formTouchEvent: function () {

                var self = this, formInputs = this.form.find(':input');

                self.formTouch = false;

                formInputs.on('focus', sendTouchEvent);
                formInputs.on('change', sendTouchEvent);

                function sendTouchEvent() {

                    if (!self.formTouch) {
                        self.formTouch = true;
                        formInputs.off('focus', sendTouchEvent);
                        formInputs.off('change', sendTouchEvent);
                        if (typeof GTMpushEventTouchForm == 'function') {
                            GTMpushEventTouchForm(self.formName);
                        }
                    }
                }
            },

            exportFieldsZATO: function () {

                if (typeof SubmitSender2Mail2CT == "undefined") {
                    //console.error('waTrack is undefined');
                } else {

                    if (this.KISDirection && this.KISDirection.length) {
                        var ZATOTypeForm = {};

                        // @todo: Почему отключил регион здесь? ZATO принимает регион?

                        ZATOTypeForm.name = this.form.find('input[data-fieldtype="NAME"]').val();
                        ZATOTypeForm.phone = this.form.find('input[data-fieldtype="PHONE"]').val();
                        ZATOTypeForm.direction = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                        //ZATOTypeForm.name = this.form.find('input[data-fieldtype="FORM_REGION"]').val();
                        ZATOTypeForm.clientId = this.form.find('input[data-fieldtype="FORM_CID"]').val();
                        ZATOTypeForm.inUrl = this.form.find('input[data-fieldtype="FORM_URL"]').val();
                        ZATOTypeForm.email = this.form.find('input[data-fieldtype="EMAIL"]').val();

                        ZATOTypeForm.autocall = (this.getNotRusLang() || ZATOTypeForm.phone.length <= 0) ? false : true;

                        ZATOTypeForm.comment = '';
                        if (this.KISComment)
                            ZATOTypeForm.comment += this.KISComment;
                        if (this.form.find('*[data-fieldtype="FORM_COMMENT"]').val())
                            ZATOTypeForm.comment += ' ' + this.form.find('*[data-fieldtype="FORM_COMMENT"]').val();

                        if (this.form.find('input[data-fieldtype="COMPANY"]').val())
                            ZATOTypeForm.comment += ' Название компании:' + this.form.find('input[data-fieldtype="COMPANY"]').val();


                        if (this.form.find('input[data-fieldtype="STATUS"]:checked').attr('data-name'))
                            ZATOTypeForm.comment += ' Статус:' + this.form.find('input[data-fieldtype="STATUS"]:checked').attr('data-name');


                        /*if (this.form.find('input[data-fieldtype="FORM_OTHER"]').val() && this.form.find('input[name="form_radio_FORM_STATUS"]:checked').attr('data-name') == 'Другое')
                            ZATOTypeForm.comment += ' - ' + this.form.find('input[data-fieldtype="FORM_OTHER"]').val();*/

                        /*var themes = [];
                        $('input[data-fieldtype="FORM_THEME"]:checked').each(function () {
                            themes.push($(this).closest('.form__field').find('label').text());
                        });

                        if (themes.length)
                            ZATOTypeForm.comment += ' Темы: [' + themes.join(', ') + ']';

                        if (this.form.find('input[data-fieldtype="FORM_THEME_OTHER"]').val() && this.form.find('input[data-name="Предложить свою тему"]:checked'))
                            ZATOTypeForm.comment += ' - ' + this.form.find('input[data-fieldtype="FORM_THEME_OTHER"]').val();*/


                        //var ZATODataObj = waTrack.ZATOData(ZATOTypeForm);
                        var ZATODataObj = SubmitSender2Mail2CT(ZATOTypeForm);
                        //console.log(ZATODataObj);
                        var Context = {ZATO: ZATODataObj};

                        var xhr;
                        if (xhr && xhr.readyState != 4) {
                            xhr.abort();
                        }
                        xhr = $.post(this.options.ZATOgateway, Context);
                    }

                }

            },

            submitForm: function (el, ev) {
                ev.preventDefault();

                if (this.form.data('validate') && !this.form.valid()) {
                    return false;
                }

                this.form.startWaiting();

                var xhr;
                if (xhr && xhr.readyState != 4) {
                    xhr.abort();
                }
                xhr = $.ajax({
                    type: "POST",
                    url: this.gateway,
                    data: this.form.serialize(),
                    success: this.proxy('doneSubmit'),
                    error: this.proxy('failSubmit'),
                    dataType: 'json'
                });

                console.log(this.form.serialize());
            },
            doneSubmit: function (res) {
                this.exportFieldsZATO();
                this.form[0].reset();
                this.form.endWaiting();

                if (typeof GTMpushEventSendForm == "function") {
                    if (this.KISType == 'table' || this.KISType == 'breakfast') {
                        this.eventName = 'formSeminarSent';
                    } else if (this.KISType == 'webinar') {
                        this.eventName = 'formWebinarSent';
                    } else if (this.KISType == 'recording') {
                        this.eventName = 'formWebinarRecSent';
                    } else {
                        this.eventName = this.formName;
                    }

                    GTMpushEventSendForm(this.eventName);
                }
                this.on(this.form, 'submit', 'submitForm');

                res = jQuery.parseJSON(JSON.stringify(res));
                this.element.html(res.html);
                $.fancybox.update();

                //перерисовываем fancybox еще раз, чтобы убрать скролл после появления плашки fb
                setTimeout(function(){
                    $.fancybox.update();
                }, 1500);
            },
            failSubmit: function (res) {
                console.log(res);
                //this.exportFieldsZATO();
                //GTMpushEventSendForm(this.formName);
                //this.element.html($(res.responseText).html());
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Ajax = can.Control.extend(
        {
            pluginName: 'appWidgetFormAjax',
            defaults: {
                ZATOgateway: '/ajax/interface/zato/',
                demoAccessGateway: '/ajax/interface/demoaccess/'
            }
        },
        {
            init: function () {
                this.form = this.element.find('form');
                this.formName = this.form.attr('name');
                this.gtmCategory = this.form.attr('gtmcategory');
                this.gateway = this.form.attr('action');
                this.KISDirection = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                this.KISIdentity = this.form.attr('data-kis-identity');
                this.customPosition = this.form.attr('data-custom-position');
                this.KISComment = this.form.find('input[data-fieldtype="KIS_COMMENT"]').val();
                this.KISType = 0;
                this.formFio = this.form.find('input[data-fieldtype="FORM_NAME"]');
                this.formComment = this.form.find('*[data-fieldtype="FORM_COMMENT"]');
                this.formPhone = this.form.find('input[data-fieldtype="FORM_PHONE"]');
                this.formEmail = this.form.find('input[data-fieldtype="FORM_EMAIL"]');
                this.formWhatsapp = this.form.find('input[data-fieldtype="FORM_WHATSAPP"]');
                this.formFacebook = this.form.find('input[data-fieldtype="FORM_FACEBOOK"]');
                this.formSkype = this.form.find('input[data-fieldtype="FORM_SKYPE"]');
                if (this.formName == 'POPUP_SUBSCRIPTION') {
                    this.formlabel = this.form.find('label.form__label--checkbox-inline');
                }
                this.formInterestCheckbox = this.form.find('label.form__field--checkboxes');
                this.formInterest = this.form.find('*[data-fieldtype="FORM_CONCRETELY_INTERESTED"]');
                this.phoneBut = this.form.find('.js-site-phone').find('a');
                this.timeSelect = this.form.find('select[name="form_dropdown_FORM_TIME_TO_CALL"]');
                this.getDemoaccess = this.form.attr('data-get-demoaccess');

                var kisTypeField = this.form.find('input[data-fieldtype="KIS_TYPE"]');
                if (kisTypeField.length > 0 && kisTypeField.val()) {
                    this.KISType = kisTypeField.val();
                }

                if (typeof GTMpushEventLoadForm == "function") {
                    GTMpushEventLoadForm(this.formName, this.gtmCategory);
                }

                if (this.form.data('validate') && !this.form.data('validate-nomsg')) {
                    //console.log(window.application.validateOptionsDefault);
                    this.form.validate(window.application.validateOptionsDefault);
                } else {
                    this.form.validate(window.application.validateOptionsNoMsg);
                }

                this.form.find('input[data-fieldtype="FORM_REGION"]').val(Geo.region);

                var clientID = '';
                if (typeof waTrack == "undefined") {
                    clientID = getGAClientID();
                } else {
                    clientID = waTrack.clientID;
                }
                this.form.find('input[data-fieldtype="FORM_CID"]').val(clientID);

                this.form.find('input[data-fieldtype="FORM_URL"]').val(window.location.toString());

                this.formTouchEvent();

                this.on(this.form, 'submit', 'submitForm');

                if (this.formFio) {
                    this.on(this.formFio, 'change', 'changeName');
                    this.onceNameSend = true;
                }
                if (this.formComment) {
                    this.on(this.formComment, 'change', 'changeComment');
                    this.onceCommentSend = true;
                }
                if (this.formPhone) {
                    this.on(this.formPhone, 'change', 'changePhone');
                    this.oncePhoneSend = true;
                }
                if (this.formEmail) {
                    this.on(this.formEmail, 'change', 'changeEmail');
                    this.onceEmailSend = true;
                }
                if (this.formWhatsapp) {
                    this.on(this.formWhatsapp, 'change', 'changeWhatsapp');
                    this.onceWhatsappSend = true;
                }
                if (this.formFacebook) {
                    this.on(this.formFacebook, 'change', 'changeFacebook');
                    this.onceFacebookSend = true;
                }
                if (this.formSkype) {
                    this.on(this.formSkype, 'change', 'changeSkype');
                    this.onceSkypeSend = true;
                }
                if (this.phoneBut) {
                    this.on(this.phoneBut, 'click', 'clickTel');
                    this.onceTelSend = true;
                }
                if (this.timeSelect) {
                    this.on(this.timeSelect, 'change', 'changeTimeSelect');
                    this.onceSelectSend = true;
                }
                if (this.formInterest) {
                    this.on(this.formInterest, 'change', 'changeInterest');
                    this.onceInterestSend = true;
                }
                if (this.formInterestCheckbox) {
                    self = this;
                    this.formInterestCheckbox.each(function (index) {
                        self.on($(this), 'click', 'changeInterestCheckbox');
                    });
                }
                if (this.formlabel) {
                    this.checkboxOnce = [];
                    self = this;
                    this.formlabel.each(function (index) {
                        self.checkboxOnce.push($(this).attr('for'));
                        self.on($(this), 'click', 'changeCheckBox');
                    });
                }
            },
            changeCheckBox: function (el, ev) {
                var fieldName = $(el).attr('for'),
                    curr = this.inArray(fieldName, this.checkboxOnce);

                if (this.form.data('validate') && curr != -1) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, fieldName);
                    delete this.checkboxOnce[curr];
                }
            },
            inArray: function (what, where) {
                var $true = -1;
                where.forEach(function (item, i) {
                    if (what === item) {
                        $true = i;
                    }
                });
                return $true;
            },
            changeTimeSelect: function (el, ev) {
                if (this.form.data('validate') && this.onceSelectSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_TIME');
                    this.onceSelectSend = false;
                }
            },
            clickTel: function (el, ev) {
                if (this.form.data('validate') && this.onceTelSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_TEL');
                    this.onceTelSend = false;
                }
            },
            changeName: function (el, ev) {
                if (this.form.data('validate') && this.onceNameSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_NAME');
                    this.onceNameSend = false;
                }
            },
            changeComment: function (el, ev) {
                if (this.form.data('validate') && this.onceCommentSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_COMMENT');
                    this.onceCommentSend = false;
                }
            },
            changePhone: function (el, ev) {
                if (this.form.data('validate') && this.oncePhoneSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_PHONE');
                    this.oncePhoneSend = false;
                }
            },
            changeEmail: function (el, ev) {
                if (this.form.data('validate') && this.onceEmailSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_EMAIL');
                    this.onceEmailSend = false;
                }
            },
            changeWhatsapp: function (el, ev) {
                if (this.form.data('validate') && this.onceWhatsappSend) {
                    GTMpushEventTouchForm(this.formWhatsapp, this.gtmCategory, 'FORM_WHATSAPP');
                    this.onceWhatsappSend = false;
                }
            },
            changeFacebook: function (el, ev) {
                if (this.form.data('validate') && this.onceFacebookSend) {
                    GTMpushEventTouchForm(this.formFacebook, this.gtmCategory, 'FORM_FACEBOOK');
                    this.onceFacebookSend = false;
                }
            },
            changeSkype: function (el, ev) {
                if (this.form.data('validate') && this.onceSkypeSend) {
                    GTMpushEventTouchForm(this.formSkype, this.gtmCategory, 'FORM_SKYPE');
                    this.onceSkypeSend = false;
                }
            },
            changeInterest: function (el, ev) {
                if (this.form.data('validate') && this.onceInterestSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_CONCRETELY_INTERESTED');
                    this.onceInterestSend = false;
                }
            },
            changeInterestCheckbox : function (el, ev) {
                if (this.form.data('validate')) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_INTERESTED_'+ ($(el).index()+1));
                }
            },
            formTouchEvent: function () {
                var self = this, formInputs = this.form.find(':input');

                self.formTouch = false;

                formInputs.on('focus', sendTouchEvent);
                formInputs.on('change', sendTouchEvent);

                function sendTouchEvent() {
                    if (!self.formTouch) {
                        self.formTouch = true;
                        formInputs.off('focus', sendTouchEvent);
                        formInputs.off('change', sendTouchEvent);
                        if (typeof GTMpushEventTouchForm == 'function') {
                            GTMpushEventTouchForm(self.formName);
                        }
                    }
                }
            },
            getNotRusLang: function () {
                var langs = ['en', 'de', 'fr'];
                var pathArray = window.location.pathname.split('/');
                if (langs.indexOf(pathArray[1]) !== -1) {
                    return true;
                }
                return false;
            },
            exportFieldsZATO: function () {

                if (typeof SubmitSender2Mail2CT == "undefined") {
                    console.error('waTrack is undefined');
                } else {

                    if (this.KISDirection && this.KISDirection.length) {
                        var ZATOTypeForm = {};

                        // @todo: Почему отключил регион здесь? ZATO принимает регион?

                        ZATOTypeForm.name = this.form.find('input[data-fieldtype="FORM_NAME"]').val();
                        ZATOTypeForm.phone = this.form.find('input[data-fieldtype="FORM_PHONE"]').val();
                        ZATOTypeForm.direction = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                        //ZATOTypeForm.name = this.form.find('input[data-fieldtype="FORM_REGION"]').val();
                        ZATOTypeForm.clientId = this.form.find('input[data-fieldtype="FORM_CID"]').val();
                        ZATOTypeForm.inUrl = this.form.find('input[data-fieldtype="FORM_URL"]').val();
                        ZATOTypeForm.email = this.form.find('input[data-fieldtype="FORM_EMAIL"]').val();
                        ZATOTypeForm.type = this.KISType;
                        ZATOTypeForm.formIdentity = this.KISIdentity;
                        ZATOTypeForm.autocall = (this.getNotRusLang() || ZATOTypeForm.phone.length <= 0) ? false : true;

                        // Комментарии для формы подписки в блоге
                        var whoAreYou = this.form.find('[data-checkboxes="FORM_WHO"] input[type="checkbox"]:checked').data('val');

                        if (!!whoAreYou) {
                            ZATOTypeForm.position = whoAreYou;
                        } else {
                            ZATOTypeForm.position = this.customPosition;
                        }

                        var demoaccesData = {};

                        if (this.getDemoaccess == 'true') {
                            var demoFields = {};
                            // логика определения логина для демо-доступа. если нет имени, или имя = Аноним, используем емыло
                            if ((ZATOTypeForm.name == '') || (ZATOTypeForm.name == 'Аноним')) {
                                demoFields.username = ZATOTypeForm.email;
                            } else {
                                demoFields.username = ZATOTypeForm.name;
                            }
                            demoFields.CID = ZATOTypeForm.clientId;
                            demoFields.Name = ZATOTypeForm.email;
                            demoFields.Email = ZATOTypeForm.email;
                            demoFields.Company = 'FRM';
                            demoFields.phoneNumber = ZATOTypeForm.phone;
                            demoFields.Position = ZATOTypeForm.position;

                            demoaccesData = this.getDemoaccessData(demoFields);
                        }

                        if(demoaccesData) {
                            ZATOTypeForm.access_demo = demoaccesData;
                        }

                        if (this.formName == 'FORM_UPRAVLENKA') {
                            ZATOTypeForm.callback = false;
                            ZATOTypeForm.autocall = false;
                        }

                        ZATOTypeForm.comment = '';

                        // отдельный формат данных для блога
                        if (this.form.data('open-from') === 'blog') {
                            var title = this.form.data('title');
                            if (typeof title === 'string' && title.length > 0) {
                                ZATOTypeForm.comment += 'Тип услуги: ' + title + "\n";
                            }

                            var commentValue = this.form.find('*[data-fieldtype="FORM_COMMENT"]').val();
                            if (commentValue.length) {
                                ZATOTypeForm.comment += 'Комментарий: ' + commentValue;
                            }
                        } else {
                            if (this.form.find('input[data-fieldtype="FORM_WHATSAPP"]').val()) {
                                ZATOTypeForm.comment += 'WhatsApp: ' + this.form.find('input[data-fieldtype="FORM_WHATSAPP"]').val() + ' ';
                            }

                            if (this.form.find('input[data-fieldtype="FORM_FACEBOOK"]').val()) {
                                ZATOTypeForm.comment += 'Facebook: ' + this.form.find('input[data-fieldtype="FORM_FACEBOOK"]').val() + ' ';
                            }

                            if (this.form.find('input[data-fieldtype="FORM_SKYPE"]').val()) {
                                ZATOTypeForm.comment += 'Skype:  ' + this.form.find('input[data-fieldtype="FORM_SKYPE"]').val() + ' ';
                            }

                            if (this.KISComment)
                                ZATOTypeForm.comment += this.KISComment;
                            if (this.form.find('*[data-fieldtype="FORM_COMMENT"]').val())
                                ZATOTypeForm.comment += ' ' + this.form.find('*[data-fieldtype="FORM_COMMENT"]').val();

                            if (this.form.find('input[data-fieldtype="FORM_CORP"]').val())
                                ZATOTypeForm.comment += ' Название компании:' + this.form.find('input[data-fieldtype="FORM_CORP"]').val();

                            if (this.form.find('input[data-fieldtype="FORM_STATE_QTY"]').val())
                                ZATOTypeForm.comment += ' Штат (чел):' + this.form.find('input[data-fieldtype="FORM_STATE_QTY"]').val();

                            if (this.form.find('input[name="form_radio_FORM_STATUS"]:checked').attr('data-name'))
                                ZATOTypeForm.comment += ' Статус:' + this.form.find('input[name="form_radio_FORM_STATUS"]:checked').attr('data-name');

                            if (this.form.find('input[data-fieldtype="FORM_OTHER"]').val() && this.form.find('input[name="form_radio_FORM_STATUS"]:checked').attr('data-name') == 'Другое')
                                ZATOTypeForm.comment += ' - ' + this.form.find('input[data-fieldtype="FORM_OTHER"]').val();

                            var themes = [];
                            $('input[data-fieldtype="FORM_THEME"]:checked').each(function () {
                                themes.push($(this).closest('.form__field').find('label').text());
                            });

                            if (themes.length)
                                ZATOTypeForm.comment += ' Темы: [' + themes.join(', ') + ']';

                            if (this.form.find('input[data-fieldtype="FORM_THEME_OTHER"]').val() && this.form.find('input[data-name="Предложить свою тему"]:checked'))
                                ZATOTypeForm.comment += ' - ' + this.form.find('input[data-fieldtype="FORM_THEME_OTHER"]').val();

                            var city = this.form.find('[data-checkboxes="FORM_CITY"] input[type="checkbox"]:checked').data('name');

                            if (!!city && city !== 'Другое') {
                                ZATOTypeForm.city = city;
                            }
                        }

                        //var ZATODataObj = waTrack.ZATOData(ZATOTypeForm);
                        var ZATODataObj = SubmitSender2Mail2CT(ZATOTypeForm);
                        //console.log(ZATODataObj);
                        var Context = {ZATO: ZATODataObj};

                        $.post(this.options.ZATOgateway, Context);
                    }

                }

            },

            submitForm: function (el, ev) {
                ev.preventDefault();

                if (this.form.data('validate') && !this.form.valid()) {
                    if (typeof GTMpushEventErrorForm == "function") {
                        GTMpushEventErrorForm(this.formName, this.gtmCategory);
                    }
                    return false;
                }

                this.form.startWaiting();

                $.post(this.gateway, this.form.serialize(), function () {
                }, 'json')
                    .done(this.proxy('doneSubmit'))
                    .fail(this.proxy('failSubmit'));

            },

            doneSubmit: function (res) {
                this.exportFieldsZATO();
                this.form[0].reset();
                this.form.endWaiting();

                if (typeof GTMpushEventSendForm == "function") {
                    GTMpushEventSendForm(this.formName, this.gtmCategory);
                }

                $.fancybox({
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 937) ? 20 : 5,
                    padding: 15,
                    helpers: {
                        overlay: {
                            css: {
                                'background': 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    'content': $(res.html)
                });
            },

            failSubmit: function (res) {
                //this.exportFieldsZATO();
                if (typeof GTMpushEventErrorForm == "function") {
                    GTMpushEventErrorForm(this.formName, this.gtmCategory);
                }
                this.element.html($(res.responseText).html());
                //this.form = this.element.find('form');
                //this.gateway = this.form.attr('action');
                //this.on(this.form, 'submit', 'submitForm');
            },

            getDemoaccessData: function (fields) {
                var response = null;
                $.ajax({
                    'async': false,
                    'url': this.options.demoAccessGateway,
                    'data': fields,
                    'dataType': 'json'
                })
                    .done(function(data){
                        if (data.ResultState == 'error') {
                            response = 'error';
                        } else {
                            response = '_' + data.Login + '&P=' + data.Password;
                        }
                    });
                return response;
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Default = can.Control.extend(
        {
            pluginName: 'appWidgetFormDefault',
        },
        {
            init: function () {
                this.form = this.element.find('form');
                this.formName = this.form.attr('name');
                this.gateway = this.form.attr('action');
                this.gtmCategory = this.form.attr('gtmcategory');
                this.formFio = this.form.find('input[data-fieldtype="FORM_NAME"]');
                this.formComment = this.form.find('*[data-fieldtype="FORM_COMMENT"]');
                this.formPhone = this.form.find('input[data-fieldtype="FORM_PHONE"]');
                this.formEmail = this.form.find('input[data-fieldtype="FORM_EMAIL"]');
                this.phoneBut = this.form.find('.js-site-phone').find('a');

                if (this.form.data('validate') && !this.form.data('validate-nomsg')) {
                    //console.log(window.application.validateOptionsDefault);
                    this.form.validate(window.application.validateOptionsDefault);
                } else {
                    this.form.validate(window.application.validateOptionsNoMsg);
                }

                this.form.find('input[data-fieldtype="FORM_REGION"]').val(Geo.region);

                var clientID = '';
                if (typeof waTrack == "undefined") {
                    clientID = getGAClientID();
                } else {
                    clientID = waTrack.clientID;
                }
                this.form.find('input[data-fieldtype="FORM_CID"]').val(clientID);

                this.form.find('input[data-fieldtype="FORM_URL"]').val(window.location.toString());

                //this.formTouchEvent();

                this.on(this.form, 'submit', 'submitForm');

                if (this.formFio) {
                    this.on(this.formFio, 'change', 'changeName');
                    this.onceNameSend = true;
                }
                if (this.formComment) {
                    this.on(this.formComment, 'change', 'changeComment');
                    this.onceCommentSend = true;
                }
                if (this.formPhone) {
                    this.on(this.formPhone, 'change', 'changePhone');
                    this.oncePhoneSend = true;
                }
                if (this.formEmail) {
                    this.on(this.formEmail, 'change', 'changeEmail');
                    this.onceEmailSend = true;
                }
                if (this.phoneBut) {
                    this.on(this.phoneBut, 'click', 'clickTel');
                    this.onceTelSend = true;
                }
            },
            clickTel: function (el, ev) {
                if (this.onceTelSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_TEL');
                    this.onceTelSend = false;
                }
            },
            changeName: function (el, ev) {
                if (this.form.data('validate') && this.onceNameSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_NAME');
                    this.onceNameSend = false;
                }
            },
            changeComment: function (el, ev) {
                if (this.form.data('validate') && this.onceCommentSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_COMMENT');
                    this.onceCommentSend = false;
                }
            },
            changePhone: function (el, ev) {
                if (this.form.data('validate') && this.oncePhoneSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_PHONE');
                    this.oncePhoneSend = false;
                }
            },
            changeEmail: function (el, ev) {
                if (this.form.data('validate') && this.onceEmailSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_EMAIL');
                    this.onceEmailSend = false;
                }
            },

            formTouchEvent: function () {

                var self = this, formInputs = this.form.find(':input');

                self.formTouch = false;

                formInputs.on('focus', sendTouchEvent);
                formInputs.on('change', sendTouchEvent);

                function sendTouchEvent() {

                    if (!self.formTouch) {
                        self.formTouch = true;
                        formInputs.off('focus', sendTouchEvent);
                        formInputs.off('change', sendTouchEvent);
                        if (typeof GTMpushEventTouchForm == 'function') {
                            GTMpushEventTouchForm(self.formName);
                        }
                    }
                }
            },
            getNotRusLang: function () {
                var langs = ['en', 'de', 'fr'];
                var pathArray = window.location.pathname.split('/');
                if (langs.indexOf(pathArray[1]) !== -1) {
                    return true;
                }
                return false;
            },
            submitForm: function (el, ev) {
                ev.preventDefault();

                if (this.form.data('validate') && !this.form.valid()) {
                    if (typeof GTMpushEventErrorForm == "function") {
                        GTMpushEventErrorForm(this.formName, this.gtmCategory);
                    }
                    return false;
                }

                this.form.startWaiting();

                $.post(this.gateway, this.form.serialize(), function () {
                }, 'json')
                    .done(this.proxy('doneSubmit'))
                    .fail(this.proxy('failSubmit'));

            },

            doneSubmit: function (res) {
                this.form[0].reset();
                this.form.endWaiting();

                if (typeof GTMpushEventSendForm == "function") {
                    GTMpushEventSendForm(this.formName, this.gtmCategory);
                }

                if (typeof fbq == "function") {
                    fbq('track', 'Lead');
                }

                $.fancybox({
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 937) ? 20 : 5,
                    padding: 15,
                    helpers: {
                        overlay: {
                            css: {
                                'background': 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    'content': $(res.html)
                });
            },

            failSubmit: function (res) {
                this.element.html($(res.responseText).html());
                if (typeof GTMpushEventErrorForm == "function") {
                    GTMpushEventErrorForm(this.formName, this.gtmCategory);
                }
                //this.form = this.element.find('form');
                //this.gateway = this.form.attr('action');
                //this.on(this.form, 'submit', 'submitForm');
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Dummy = can.Control.extend(
        {
            pluginName: 'appWidgetFormDummy',
            defaults: {}
        },
        {
            init: function () {
                this.phoneCallOrderBtn = this.element.find('.js-form__phone-call-order-btn');
                this.callOrderBtn = this.element.find('.js-form__call-order-btn');
                this.contactsOrderBtn = this.element.find('.js-form__contacts-order-btn');
                this.testResultOrderBtn = this.element.find('.js-form__test-results-order-btn');
                this.userSurveyBtn = this.element.find('.js-form__user-survey-btn');
                this.emailField = this.element.find('.js-form__email');

                var self = this;

                this.on(this.element, 'submit', 'successMessage');

                this.emailField.on('change', function(el, ev) {
                    var emailFieldValue = $(this).val();

                    self.contactsOrderBtn.fancybox({
                        content: '<div class="modal modal--visible"><div class="modal__title">Спасибо</div><p>Наши контакты отправлены на почту <b>' + emailFieldValue + '</b></p></div>',
                        wrapCSS: 'modal-wrapper',
                        margin: ($(window).width() > 768) ? 20 : 5,
                        padding: 15,
                        helpers: {
                            overlay : {
                                css : {
                                    'background' : 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    });
                });

                this.phoneCallOrderBtn.fancybox({
                    content: '<div class="modal modal--visible"><div class="modal__title">Заявка отправлена</div><p>Спасибо! Наш специалист свяжется с Вами в ближайшее время.</p></div>',
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 768) ? 20 : 5,
                    padding: 15,
                    helpers : {
                        overlay : {
                            css : {
                                'background' : 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                });

                this.userSurveyBtn.fancybox({
                    content: '<div class="modal modal--visible"><div class="modal__title">Ваш голос учтен</div><p>Спасибо за ваше участие в опросе</p></div>',
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 768) ? 20 : 5,
                    padding: 15,
                    helpers : {
                        overlay : {
                            css : {
                                'background' : 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                });

                this.testResultOrderBtn.fancybox({
                    content: '<div class="modal modal--small modal--visible"><div class="modal__title">Спасибо</div><p>Ссылка отправлена на Вашу почту</p></div>',
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 768) ? 20 : 5,
                    padding: 15,
                    helpers : {
                        overlay : {
                            css : {
                                'background' : 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                });

                this.callOrderBtn.fancybox({
                    content: '<div class="modal modal--small modal--has-bg modal--visible"><div class="modal__title">Спасибо.</div><p>Мы свяжемся с вами в выбранное время.</p></div>',
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 768) ? 20 : 5,
                    padding: 0,
                    helpers : {
                        overlay : {
                            css : {
                                'background' : 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                });
            },

            successMessage: function(el, ev) {
                ev.preventDefault();
            }
        }
    );
}(jQuery));
(function ($) {
    // @todo: Буду использовать?
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Track = can.Control.extend(
        {
            pluginName: 'appWidgetFormTrack',
            defaults: {}
        },
        {
            init: function () {

                this.inputs = this.element.find('[data-fieldtype]');

                this.element.find('input[data-fieldtype="FORM_REGION"]').val(Geo.region);

                var clientID = '';
                if (typeof waTrack == "undefined") {
                    clientID = getGAClientID();
                } else {
                    clientID = waTrack.clientID;
                }
                this.element.find('input[data-fieldtype="FORM_CID"]').val(clientID);

                this.element.find('input[data-fieldtype="FORM_URL"]').val(window.location.toString());

                this.on(this.element, 'submit', 'saveValues');

            },

            saveValues: function(el, ev) {
                console.log(this.inputs);
            }

        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Get = can.Control.extend(
        {
            pluginName: 'appWidgetEventFormGet',
            defaults: {
                formGatewayStartPath: '/ajax/forms/event_invite/'
            }
        },
        {
            init: function () {

                var self = this;

                this.eventId = this.element.data('event-id') ? this.element.data('event-id') : '';
                this.eventType = this.element.data('event-type') ? this.element.data('event-type') : '';
                this.eventCode = this.element.data('event-code') ? this.element.data('event-code') : '';

                this.on(this.element, 'click', 'showForm');
            },
            showForm: function (el, ev) {

                var ajaxGateway = this.options.formGatewayStartPath + '?event_id=' + this.eventId + '&event_type=' + this.eventType + '&code=' + this.eventCode;

                $.fancybox.open(
                    {
                        'href': ajaxGateway
                    },
                    {
                        type: 'ajax',
                        autoSize: true,
                        wrapCSS: 'modal-wrapper',
                        margin: ($(window).width() > 937) ? 20 : 5,
                        padding: 0,
                        helpers: {
                            overlay: {
                                css: {
                                    'background': 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                        beforeShow: function () {
                            window.application.installController('.js-event-form-ajax', 'appWidgetEventFormAjax');
                        },
                        afterShow: function () {
                            $.fancybox.update();
                        }
                    }
                );

            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Get = can.Control.extend(
        {
            pluginName: 'appWidgetFormGetFile',
            defaults: {
                formGatewayStartPath: '/ajax/forms/'
            }
        },
        {
            init: function () {
                var self = this;
                str = this.element.attr('href');
                this.fileName = str.split('/').pop() ? '&fileName=' + str.split('/').pop() : '';
                this.formName = this.element.data('form');
                this.formLang = this.element.data('form-lang') ? this.element.data('form-lang') : window.Lang ? window.Lang : 'ru';
                this.paramsId = this.element.data('id') ? '&id=' + this.element.data('id') : '';
                this.paramsCity = this.element.data('city') ? this.element.data('city') : '';

                if (typeof URL === "function") {
                    var url = new URL(window.location.href);
                    var showPopUp = url.searchParams.get("show_callback");
                } else {
                    var showPopUp = this.getParams("show_callback");
                }

                if (showPopUp == 'Y' && (this.formName == "form_for_callback" || this.formName == "business_raiffeisen")) {
                    self.showForm();
                }

                if (this.formName) {
                    this.on(this.element, 'click', 'showForm');
                } else {
                    console.error('data-form is not set for element:', this.element);
                }
            },
            getParams: function (param) {
                param = param.replace(/([\[\]])/g, "\\\$1");
                var regex = new RegExp("[\\?&]" + param + "=([^&#]*)"),
                    results = regex.exec(window.location.href);
                return results ? results[1] : "";
            },
            showForm: function (el, ev) {

                var ajaxGateway = this.options.formGatewayStartPath + this.formName + '/?LANG=' + this.formLang + this.paramsId + this.fileName;

                $.fancybox.open(
                    {
                        'href': ajaxGateway
                    },
                    {
                        type: 'ajax',
                        wrapCSS: 'modal-wrapper',
                        margin: ($(window).width() > 937) ? 20 : 5,
                        padding: 15,
                        helpers: {
                            overlay: {
                                css: {
                                    'background': 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                        beforeShow: function () {
                            window.application.installController('.js-form-ajax', 'appWidgetFormAjax');
                            window.application.installController('.js-zero-contact-form', 'appPaymentFormZeroContact');
                        },
                    }
                );

            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Get = can.Control.extend(
        {
            pluginName: 'appWidgetFormGet',
            defaults: {
                formGatewayStartPath: '/ajax/forms/'
            }
        },
        {
            init: function () {

                var self = this;

                this.formName = this.element.data('form');
                this.formTitle = this.element.data('form-title');
                this.formKisIdentity = this.element.data('kis-identity');

                this.serviceCode = this.element.data('service-code');

                if (this.serviceCode) {
                    this.serviceCode = '&service=' + this.serviceCode;
                } else {
                    this.serviceCode = '';
                }

                if (this.formTitle) {
                    this.formTitle = '&name=' + this.formTitle;
                } else {
                    this.formTitle = '';
                }

                this.formClose = (this.element.data('close') == 'N') ? false : true;
                this.formPadding = (this.element.data('padding') == 'N') ? 0 : 15;

                this.formOpenFrom = this.element.data('form-open-from');
                if (this.formOpenFrom) {
                    this.formOpenFrom = '&openFrom=' + this.formOpenFrom
                } else {
                    this.formOpenFrom = '';
                }

                this.formLang = this.element.data('form-lang') ? this.element.data('form-lang') : window.Lang ? window.Lang : 'ru';
                this.paramsId = this.element.data('id') ? '&id=' + this.element.data('id') : '';
                this.paramsCity = this.element.data('city') ? this.element.data('city') : '';
                this.formKisIdentity = this.element.data('kis-identity') ? '&kis-identity=' + this.element.data('kis-identity') : '';
                this.getDemoAccess = this.element.data('get-demoaccess') ? '&get-demoaccess=' + this.element.data('get-demoaccess') : '';

                if (typeof URL === "function") {
                    var url = new URL(window.location.href);
                    var showPopUp = url.searchParams.get("show_callback");
                } else {
                    var showPopUp = this.getParams("show_callback");
                }

                if (showPopUp == 'Y' && (this.formName == "form_for_callback" || this.formName == "business_raiffeisen")) {
                    self.showForm();
                }

                if (this.formName) {
                    this.on(this.element, 'click', 'showForm');
                } else {
                    console.error('data-form is not set for element:', this.element);
                }
            },
            getParams: function (param) {
                param = param.replace(/([\[\]])/g, "\\\$1");
                var regex = new RegExp("[\\?&]" + param + "=([^&#]*)"),
                    results = regex.exec(window.location.href);
                return results ? results[1] : "";
            },
            showForm: function (el, ev) {
                ev.preventDefault();
                var ajaxGateway = this.options.formGatewayStartPath +
                    this.formName +
                    '/?LANG=' +
                    this.formLang +
                    this.paramsId +
                    this.formTitle +
                    this.formOpenFrom +
                    this.serviceCode +
                    this.formKisIdentity +
                    this.getDemoAccess;

                var formName = this.formName;
                var paramsCity = this.paramsCity;
                var formPadding = this.formPadding;
                var formClose = this.formClose;

                $.fancybox.open(
                    {
                        'href': ajaxGateway
                    },
                    {
                        type: 'ajax',
                        wrapCSS: 'modal-wrapper',
                        margin: ($(window).width() > 937) ? 20 : 5,
                        padding: formPadding,
                        closeBtn: formClose,
                        helpers: {
                            overlay: {
                                css: {
                                    'background': 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                        beforeShow: function () {
                            window.application.installController('.js-form-ajax', 'appWidgetFormAjax');
                            window.application.installController('.js-form-default', 'appWidgetFormDefault');
                            window.application.installController('.js-zero-contact-form', 'appPaymentFormZeroContact');
                        },
                        afterShow: function () {
                            if (formName == "contact_us" || formName == "contact_hans") {
                                var $arAccordion = $('form[name="CONTACT_US_FORM"]').find('.js-accordion');
                                if ($arAccordion.length <= 0) {
                                    $arAccordion = $('form[name="Form_Main_Foreign"]').find('.js-accordion');
                                }
                                window.application.installController($arAccordion, 'appWidgetAccordion');
                            }

                            if (formName == "contact_us" && paramsCity == "spb") {
                                var modal = $('.modal--visible');
                                modal.find('a.js-site-phone-a').attr('title', '+' + '7 (812) 309-71-93');
                                modal.find('a.js-site-phone-a').attr('href', 'tel:+' + '+78123097193');
                                modal.find('.js-site-phone-ccode').text('812');
                                modal.find('.js-site-phone-local').text('309-71-93');
                            }

                            if (formName == 'subscribe') {
                                window.application.installController('form[name="POPUP_SUBSCRIPTION"]', 'appWidgetCheckSubscribeForm');
                            }
                        }
                    }
                );

            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Poll = can.Control.extend(
        {
            pluginName: 'appWidgetFormPoll',
            defaults: {}
        },
        {
            init: function () {
                this.gateway = this.element.attr('action');
                this.on(this.element, 'submit', 'submitForm');
            },

            submitForm: function(el, ev) {
                ev.preventDefault();
                this.element.startWaiting();
                $.post(this.gateway, this.element.serialize(), this.proxy('showResult'));
            },

            showResult: function (data){

                if (typeof GTMpushEvent == "function"){
                    GTMpushEvent('FormYouDontCallSent');
                    GTMpushEvent('SuccessSend');
                }

                $.fancybox({
                    wrapCSS : 'modal-wrapper',
                    margin : ($(window).width() > 937) ? 20 : 5,
                    padding : 15,
                    helpers : {
                        overlay : {
                            css : {
                                'background' : 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    'content' : data
                });
                this.element.endWaiting();
            }

        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Subscribe = can.Control.extend(
        {
            pluginName: 'appWidgetSliderForm',
            defaults: {
                ZATOgateway: '/ajax/interface/zato/'
            }
        },
        {
            init: function () {
                this.form = this.element;
                this.formName = this.form.attr('name');
                this.gateway = this.element.attr('action');
                this.gtmCategory = this.form.attr('gtmcategory');
                this.on(this.element, 'submit', 'submitForm');
                this.KISDirection = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                this.KISComment = this.form.find('input[data-fieldtype="KIS_COMMENT"]').val();
                this.formFio = this.form.find('input[data-fieldtype="FORM_NAME"]');
                this.formPhone = this.form.find('input[data-fieldtype="FORM_PHONE"]');
                if (this.formFio) {
                    this.on(this.formFio, 'change', 'changeName');
                    this.onceNameSend = true;
                }
                if (this.formPhone) {
                    this.on(this.formPhone, 'change', 'changePhone');
                    this.oncePhoneSend = true;
                }
            },

            changePhone: function (el, ev) {
                if (this.element.data('validate') && this.oncePhoneSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_PHONE');
                    this.oncePhoneSend = false;
                }
            },
            changeName: function (el, ev) {
                if (this.element.data('validate')  && this.onceNameSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_NAME');
                    this.onceNameSend = false;
                }
            },
            submitForm: function (el, ev) {
                ev.preventDefault();
                if (this.element.data('validate') && !this.element.valid()) {
                    if (typeof GTMpushEventErrorForm == "function") {
                        GTMpushEventErrorForm(this.formName, this.gtmCategory);
                    }
                    return false;
                }
                this.element.startWaiting();
                $.post(this.gateway, this.element.serialize(), this.proxy('showResult'));
            },

            showResult: function (data) {

                this.exportFieldsZATO();

                if (typeof GTMpushEventSendForm == "function") {
                    GTMpushEventSendForm(this.formName, this.gtmCategory);
                }

                var msgContent = '<div class="modal modal--visible"><div class="modal__title">Заявка отправлена</div><p>Спасибо! Наш специалист свяжется с Вами в ближайшее время.</p></div>';

                var urlArray = window.location.pathname.split('/');

                if (urlArray[1] === 'en') {
                    msgContent = '<div class="modal modal--visible"><div class="modal__title">Thank you!</div><p>We will contact you at the chosen time!</p></div>';
                }

                $.fancybox({
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 937) ? 20 : 5,
                    padding: 15,
                    helpers: {
                        overlay: {
                            css: {
                                'background': 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    'content': msgContent
                });
                this.element.endWaiting();
            },
            getNotRusLang: function () {
                var langs = ['en', 'de', 'fr'];
                var pathArray = window.location.pathname.split('/');
                if (langs.indexOf(pathArray[1]) !== -1) {
                    return true;
                }
                return false;
            },
            exportFieldsZATO: function () {

                if (typeof SubmitSender2Mail2CT == "undefined") {
                    console.error('waTrack is undefined');
                } else {

                    if (this.KISDirection && this.KISDirection.length) {
                        var ZATOTypeForm = {};

                        ZATOTypeForm.name = this.form.find('input[data-fieldtype="FORM_NAME"]').val();
                        ZATOTypeForm.phone = this.form.find('input[data-fieldtype="FORM_PHONE"]').val();
                        ZATOTypeForm.direction = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                        ZATOTypeForm.inUrl = this.form.find('input[data-fieldtype="FORM_URL"]').val();
                        ZATOTypeForm.formIdentity = this.form.attr('data-kis-identity');

                        ZATOTypeForm.autocall = (this.getNotRusLang() || ZATOTypeForm.phone.length <= 0) ? false : true;

                        ZATOTypeForm.comment = '';
                        if (this.KISComment)
                            ZATOTypeForm.comment += this.KISComment;
                        if (this.form.find('*[data-fieldtype="FORM_COMMENT"]').val())
                            ZATOTypeForm.comment += ' ' + this.form.find('*[data-fieldtype="FORM_COMMENT"]').val();

                        var ZATODataObj = SubmitSender2Mail2CT(ZATOTypeForm);
                        var Context = {ZATO: ZATODataObj};

                        $.post(this.options.ZATOgateway, Context);
                    }

                }

            }

        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Subscribe = can.Control.extend(
        {
            pluginName: 'appWidgetFormSubscribe',
            defaults: {
                ZATOgateway: '/ajax/interface/zato/'
            }
        },
        {
            init: function () {
                this.form = this.element;
                this.KISDirection = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                this.KISComment = this.form.find('input[data-fieldtype="KIS_COMMENT"]').val();
                this.KISType = this.form.find('input[data-fieldtype="KIS_TYPE"]').val();

                this.form.find('input[data-fieldtype="FORM_REGION"]').val(Geo.region);

                var clientID = '';
                if (typeof waTrack == "undefined") {
                    clientID = getGAClientID();
                } else {
                    clientID = waTrack.clientID;
                }
                this.form.find('input[data-fieldtype="FORM_CID"]').val(clientID);

                this.form.find('input[data-fieldtype="FORM_URL"]').val(window.location.toString());


                $('form[name="SUBSCRIPTION_BLOG"]').find('.js-icheckbox.rubrics').on('ifClicked', function () {
                    $('form[name="SUBSCRIPTION_BLOG"]').find('.js-icheckbox.rubrics').iCheck('uncheck');
                    $(this).iCheck('check');
                });
                $('form[name="SUBSCRIPTION_BLOG"]').find('.js-icheckbox.cities').on('ifClicked', function () {
                    $('form[name="SUBSCRIPTION_BLOG"]').find('.js-icheckbox.cities').iCheck('uncheck');
                    $(this).iCheck('check');
                });
                this.gateway = this.element.attr('action');
                this.on(this.element, 'submit', 'submitForm');
            },

            submitForm: function (el, ev) {
                ev.preventDefault();
                if (this.element.data('validate') && !this.element.valid()) {
                    return false;
                }
                this.element.startWaiting();
                $.post(this.gateway, this.element.serialize(), this.proxy('showResult'));
            },

            showResult: function (data) {
                if ($(data).find('input[name="subscribe_error"]').length == 0) {
                    this.exportFieldsZATO();

                    if (typeof GTMpushEvent == "function") {
                        GTMpushEvent('InfoSubscriptionSent');
                    }
                }

                $.fancybox({
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 937) ? 20 : 5,
                    padding: 15,
                    helpers: {
                        overlay: {
                            css: {
                                'background': 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    'content': data
                });
                this.element.endWaiting();
            },
            exportFieldsZATO: function () {
                if (typeof SubmitSender2Mail2CT == "undefined") {
                    console.error('waTrack is undefined');
                } else {
                    if (this.KISDirection && this.KISDirection.length) {
                        var ZATOTypeForm = {};

                        ZATOTypeForm.name = '';
                        ZATOTypeForm.phone = '';
                        ZATOTypeForm.direction = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                        ZATOTypeForm.clientId = this.form.find('input[data-fieldtype="FORM_CID"]').val();
                        ZATOTypeForm.inUrl = this.form.find('input[data-fieldtype="FORM_URL"]').val();
                        ZATOTypeForm.email = this.form.find('input[data-fieldtype="FORM_EMAIL"]').val();
                        ZATOTypeForm.type = this.KISType;

                        var whoAreYou = this.form.find('[data-checkboxes="FORM_WHO"] input[type="checkbox"]:checked').data('val');

                        if (!!whoAreYou) {
                            ZATOTypeForm.position = whoAreYou;
                        }

                        var city = this.form.find('[data-checkboxes="FORM_CITY"] input[type="checkbox"]:checked').data('name');

                        if (!!city && city !== 'Другое') {
                            ZATOTypeForm.city = city;
                        }

                        ZATOTypeForm.comment = '';

                        if (this.KISComment) {
                            ZATOTypeForm.comment += this.KISComment;
                        }

                        //var ZATODataObj = waTrack.ZATOData(ZATOTypeForm);
                        var ZATODataObj = SubmitSender2Mail2CT(ZATOTypeForm);
                        //console.log(ZATODataObj);
                        var Context = {ZATO: ZATODataObj};

                        $.post(this.options.ZATOgateway, Context);
                    }
                }

            }

        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Form = App.Widgets.Form || {};
    App.Widgets.Form.Ajax = can.Control.extend(
        {
            pluginName: 'appWidgetFormTestCollect',
            defaults: {
                ZATOgateway: '/ajax/interface/zato/',
                ZATOgatewayAction: '/ajax/interface/zato/action/'
            }
        },
        {
            init: function () {
                this.form = this.element.find('form');
                this.formName = this.form.attr('name');
                this.gateway = this.form.attr('action');
                this.KISDirection = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                this.KISComment = this.form.find('input[data-fieldtype="KIS_COMMENT"]').val();
                this.KISType = this.form.find('input[data-fieldtype="KIS_TYPE"]').val();

                this.KISAction = {
                    type: this.form.find('input[data-fieldtype="FORM_KIS_ACTION"]').val(),
                    email: this.form.find('input[data-fieldtype="CHIEF_EMAIL"]').val(),
                    details: {
                        accounting_type: this.form.find('input[data-fieldtype="ACCOUNTING_TYPE"]').val()
                    }
                };
                this.KISActionContext = {};

                this.form.find('input[data-fieldtype="FORM_REGION"]').val(Geo.region);

                var clientID = '';
                if (typeof waTrack == 'undefined') {
                    clientID = getGAClientID();
                } else {
                    clientID = waTrack.clientID;
                }
                this.form.find('input[data-fieldtype="FORM_CID"]').val(clientID);

                this.form.find('input[data-fieldtype="FORM_URL"]').val(window.location.toString());

                this.on(this.form, 'submit', 'submitForm');
            },

            submitForm: function (el, ev) {
                ev.preventDefault();

                if (this.form.data('validate') && !this.form.valid()) {
                    return false;
                }

                this.form.startWaiting();

                $.post(this.gateway, this.form.serialize(), function () {}, 'json')
                    .done(this.proxy('doneSubmit'))
                    .fail(this.proxy('failSubmit'));

            },

            doneSubmit: function (res) {
                this.exportFieldsZATO();
                this.prepareZATOAction();

                this.form.endWaiting();

                if (res.success == true) {
                    if (!$.isEmptyObject(this.KISActionContext))
                        $.post(this.options.ZATOgatewayAction, this.KISActionContext);
                    this.form.remove();
                }

                $.fancybox({
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 937) ? 20 : 5,
                    padding: 15,
                    helpers: {
                        overlay: {
                            css: {
                                'background': 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    'content': $(res.html)
                });
            },

            failSubmit: function (res) {
                this.exportFieldsZATO();
                this.element.html($(res.responseText).html());
                this.form = this.element.find('form');
                this.gateway = this.form.attr('action');
                this.on(this.form, 'submit', 'submitForm');
            },
            exportFieldsZATO: function () {

                if (typeof SubmitSender2Mail2CT == 'undefined') {
                    console.error('waTrack is undefined');
                } else {

                    if (this.KISDirection && this.KISDirection.length) {
                        var ZATOTypeForm = {};

                        ZATOTypeForm.name = '';
                        ZATOTypeForm.position = '';
                        ZATOTypeForm.phone = '';
                        ZATOTypeForm.direction = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                        ZATOTypeForm.clientId = this.form.find('input[data-fieldtype="FORM_CID"]').val();
                        ZATOTypeForm.inUrl = this.form.find('input[data-fieldtype="FORM_URL"]').val();
                        ZATOTypeForm.email = this.form.find('input[data-fieldtype="FORM_EMAIL"]').val();
                        ZATOTypeForm.type = this.KISType;

                        ZATOTypeForm.comment = '';

                        if (this.KISComment) {
                            ZATOTypeForm.comment += this.KISComment;
                        }

                        var whoAreYou = this.form.find('[data-checkboxes="FORM_WHO"] input[type="radio"]:checked').data('name');
                        if (!!whoAreYou) {
                            ZATOTypeForm.comment += ' Кто вы: ' + whoAreYou;
                            ZATOTypeForm.position = this.form.find('[data-checkboxes="FORM_WHO"] input[type="radio"]:checked').val();
                        }

                        //var ZATODataObj = waTrack.ZATOData(ZATOTypeForm);
                        var ZATODataObj = SubmitSender2Mail2CT(ZATOTypeForm);
                        // console.log(ZATODataObj);
                        var Context = {ZATO: ZATODataObj};

                        $.post(this.options.ZATOgateway, Context);
                    }
                }
            },
            prepareZATOAction: function () {
                if (typeof SubmitAction2Mail2CT == 'undefined') {
                    console.error('waTrack is incorrect');
                } else {
                    if (this.KISAction.type && this.KISAction.type.length) {

                        this.KISAction.comment = '';
                        var sendTestTo = this.form.find('input[data-fieldtype="FORM_EMAIL"]').val();
                        if (!!sendTestTo) {
                            if (this.KISAction.type === '1cwa_test_send') {
                                this.KISAction.comment += 'Отправил тест для : ';
                            } else if (this.KISAction.type === '1cwa_test_completed') {
                                this.KISAction.comment += 'Пройден тест : ';
                            }
                            this.KISAction.comment += sendTestTo;
                        }

                        var KISActionObj = SubmitAction2Mail2CT(this.KISAction);
                        this.KISActionContext = {Action: KISActionObj};
                    }
                }

            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ClientsSlider = can.Control.extend(
        {
            pluginName: 'appWidgetClientsSlider',
            defaults: {}
        },
        {
            init: function () {
                this.element.owlCarousel({
                    autoplay: true,
                    autoplayHoverPause: true,
                    autoplayTimeout: 2000,
                    autoplaySpeed: 700,
                    loop: true,
                    nav: false,
                    responsive:{
                        0:{
                            items: 1
                        },
                        200:{
                            items: 2
                        },
                        450:{
                            items: 3
                        },
                        600:{
                            items: 4
                        },
                        1000:{
                            items: 5
                        }
                    }
                });
                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ContentSlider = can.Control.extend(
        {
            pluginName: 'appWidgetContentSlider',
            defaults: {}
        },
        {
            init: function () {
                this.scrollYTop = $(window).scrollTop();
                this.windowHeight = $(window).height();
                this.scrollYBottom = this.scrollYTop + this.windowHeight;
                this.elementOffsetTop = this.element.parent().offset().top;

                this.element.owlCarousel({
                    items: 1,
                    autoplay: true,
                    autoplayHoverPause: true,
                    autoplayTimeout: 10000,
                    autoplaySpeed: 850,
                    navSpeed: 850,
                    loop: true,
                    nav: true,
                    navText: '',
                    autoHeight: true
                });

                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });

                this.elementHeight = this.element.parent().outerHeight();
                this.elementOffsetBottom = this.elementOffsetTop + this.elementHeight;

                var self = this;

                $(window).on('scroll', function() {
                    this.scrollYTop = $(window).scrollTop();
                    this.scrollYBottom = this.scrollYTop + self.windowHeight;

                    if(this.scrollYBottom > self.elementOffsetTop && this.scrollYTop < self.elementOffsetBottom) {
                        self.element.trigger('play.owl.autoplay',[10000, 850]);
                    } else {
                        self.element.trigger('stop.owl.autoplay',[10000, 850]);
                    }
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.DottedNavSlider = can.Control.extend(
        {
            pluginName: 'appWidgetDottedNavSliderNoAuto',
            defaults: {}
        },
        {
            init: function () {
                this.element.owlCarousel({
                    items: 1,
                    loop: true,
                    dotsEach: true,
                    dotsSpeed: 800,
                    autoplay: false,
                    autoHeight: true
                });

                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.DottedNavSlider = can.Control.extend(
        {
            pluginName: 'appWidgetDottedNavSlider',
            defaults: {}
        },
        {
            init: function () {
                this.element.owlCarousel({
                    items: 1,
                    loop: true,
                    dotsEach: true,
                    dotsSpeed: 800,
                    autoplay: true,
                    autoplayTimeout: 6000,
                    autoplaySpeed: 800,
                    autoplayHoverPause: true
                });

                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.EmployeeReviewsSlider = can.Control.extend(
        {
            pluginName: 'appWidgetEmployeeReviewsSlider',
            defaults: {}
        },
        {
            init: function () {
                this.element.owlCarousel({
                    items: 1,
                    navSpeed: 850,
                    loop: true,
                    nav: true,
                    navText: '',
                    autoHeight : true
                });

                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ImagesCarousel = can.Control.extend(
        {
            pluginName: 'appWidgetImagesCarousel',
            defaults: {}
        },
        {
            init: function () {
                this.element.owlCarousel({
                    autoplay: true,
                    autoplayTimeout: 2000,
                    autoplaySpeed: 700,
                    loop: true,
                    nav: true,
                    responsive: {
                        0: {
                            items: 1,
                            nav: false,
                        },
                        200: {
                            items: 2,
                            nav: false,
                        },
                        605: {
                            items: 3,
                            nav: false,
                        },
                        800: {
                            items: 4,
                        },
                        980: {
                            items: 4,
                        }
                    }
                });
                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.MainSlider = can.Control.extend(
        {
            pluginName: 'appWidgetMainSlider',
            defaults: {}
        },
        {
            isMouseLeave: true,

            init: function () {

                var $owl = this.element;

                $owl.owlCarousel({
                    items: 1,
                    loop: true,
                    dotsEach: true,
                    nav: false,
                    animateOut: 'fadeOut',
                    autoplay: false,
                    // все, что закомменчено - не отрабатывает, т.к. переключение слайдов запилено вЛоб см. ниже
                    // autoplay: true,
                    // autoplayTimeout: 3000,
                    // autoplayHoverPause: true,
                    // stopOnHover:true,
                    autoHeight : true,
                    mouseDrag: false
                });

                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });

                // логика блокировки прокрутки слайдера при hover
                var self = this;
                $owl.on('mouseleave',function(){
                    self.isMouseLeave = true;
                });

                $owl.on('mouseenter',function(){
                    self.isMouseLeave = false;
                });

                this.slideNext();

            },

            slideNext: function () {

                var $owl = this.element,
                    self = this;

                setTimeout(function() {
                    if (self.isMouseLeave) { $owl.trigger('next.owl.carousel'); }
                    self.slideNext(true);
                }, 4500);

            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.PartnersCarouselMob = can.Control.extend(
        {
            pluginName: 'appWidgetPartnersCarouselMob',
            defaults: {}
        },
        {
            init: function () {
                this.element.owlCarousel({
                    loop: true,
                    nav: false,
                    dots: true,
                    responsive: {
                        0: {
                            items: 2,
                            nav: false,
                            margin: 5
                        },
                        480: {
                            items: 3,
                            nav: false,
                            margin: 5
                        }
                    }
                });
                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.PartnersCarouselNav = can.Control.extend(
        {
            pluginName: 'appWidgetPartnersCarouselNav',
            defaults: {}
        },
        {
            init: function () {
                this.element.owlCarousel({
                    autoplay: true,
                    autoplayTimeout: 2000,
                    autoplaySpeed: 700,
                    loop: true,
                    nav: true,
                    dots: false,
                    responsive: {
                        0: {
                            // items: 1,
                            nav: false,
                            margin: 10,
                            dots: true,
                            autoWidth: true
                        },
                        425: {
                            // items: 2,
                            nav: false,
                            margin: 10,
                            dots: true,
                            autoWidth: true
                        },
                        480: {
                            // items: 3,
                            nav: false,
                            margin: 10,
                            dots: true,
                            autoWidth: true
                        },
                        768: {
                            items: 4,
                            margin: 10
                        },
                        980: {
                            items: 6,
                            margin: 30
                        }
                    }
                });

                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.PartnersCarousel = can.Control.extend(
        {
            pluginName: 'appWidgetPartnersCarousel',
            defaults: {}
        },
        {
            init: function () {
                this.element.owlCarousel({
                    autoplay: true,
                    autoplayTimeout: 2000,
                    autoplaySpeed: 700,
                    loop: true,
                    nav: false,
                    dots: false,
                    responsive: {
                        0: {
                            items: 1,
                            nav: false,
                            margin: 10
                        },
                        425: {
                            items: 2,
                            nav: false,
                            margin: 10
                        },
                        480: {
                            items: 3,
                            nav: false,
                            margin: 10
                        },
                        768: {
                            items: 4,
                            margin: 10
                        },
                        980: {
                            items: 6,
                            margin: 20
                        }
                    }
                });
                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.Slider = can.Control.extend(
        {
            pluginName: 'appWidgetSlider',
            defaults: {}
        },
        {
            init: function () {
                this.element.owlCarousel({
                    items: 1,
                    loop: true,
                    animateOut: 'fadeOut',
                    autoplay: true,
                    autoplayTimeout: 3000
                });
                this.element.find('img.lzy_img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.SyncSlider = can.Control.extend(
        {
            pluginName: 'appWidgetSyncSlider',
            defaults: {}
        },
        {
            slidesPerPage: 5,
            syncedSecondary: false,

            init: function () {
                var self = this,
                    big = this.element.find('.js-sync-slider-big'),
                    preview = this.element.find('.js-sync-slider-preview');

                this.element.find('img.lzy_img').each(function () {
                    $(this).attr('src', $(this).data('src'));
                });

                big.owlCarousel({
                    items: 1,
                    loop: true,
                    dots: false,
                    nav: true,
                    animateOut: 'fadeOut',
                    autoplay: true,
                    autoplayHoverPause: true,
                    autoplayTimeout: 5000,
                    autoHeight: true,
                    mouseDrag: true,
                    responsiveRefreshRate: 200,
                    responsive: {
                        0: {
                            nav: false,
                        },
                        800: {
                            nav: true,
                        }
                    }
                }).on('changed.owl.carousel', syncPositionBig);

                preview.on('initialized.owl.carousel', function () {
                    preview.find(".owl-item").eq(0).addClass("current");
                })
                    .owlCarousel({
                        margin: 30,
                        items: self.slidesPerPage,
                        dots: false,
                        nav: false,
                        smartSpeed: 200,
                        slideSpeed: 500,
                        slideBy: self.slidesPerPage,
                        responsiveRefreshRate: 100,
                        responsive: {
                            0: {
                                items: 1,
                            },
                            200: {
                                items: 2,
                            },
                            605: {
                                items: 3,
                            },
                            800: {
                                items: 4,
                            },
                            980: {
                                items: 4,
                            }
                        }
                    }).on('changed.owl.carousel', syncPositionPreview);

                preview.on("click", ".owl-item", function (e) {
                    e.preventDefault();
                    var number = $(this).index();
                    big.data('owl.carousel').to(number, 300, true);
                });

                preview.mouseover(function () {
                    big.trigger('stop.owl.autoplay');
                }).mouseout(function () {
                    big.trigger('play.owl.autoplay', [5000]);
                });


                function syncPositionBig(el) {
                    var count = el.item.count - 1,
                        current = Math.round(el.item.index - (el.item.count / 2) - .5),
                        onscreen = preview.find('.owl-item.active').length - 1;

                    if (current < 0) {
                        current = count;
                    }
                    if (current > count) {
                        current = 0;
                    }

                    preview
                        .find(".owl-item")
                        .removeClass("current")
                        .eq(current)
                        .addClass("current");

                    preview.data('owl.carousel').to(current - onscreen, 100, true);
                };

                function syncPositionPreview(el) {
                    if (self.syncedSecondary) {
                        var number = el.item.index;
                        big.data('owl.carousel').to(number, 100, true);
                    }
                };
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.MobileAppTabs = can.Control.extend(
        {
            pluginName: 'appWidgetMobileAppTabs',
            defaults: {}
        },
        {
            init: function () {
                this.elementHeight = this.element.outerHeight();
                this.tab = this.element.find('.js-mobile-app-tabs__tab');
                this.tabContainer = this.element.find('.js-mobile-app-tabs__container');
                this.tabContainerHeight = this.tabContainer.outerHeight();
                this.tabContent = this.element.find('.js-mobile-app-tabs__content');
                this.pushPoint = this.tabContainer.offset().top;
                this.stopPoint = (this.pushPoint + this.elementHeight) - this.tabContainerHeight;
                this.scrollYTop = $(window).scrollTop();

                this.on(this.tab, 'mouseover', 'switchTabOnHover');
            },

            switchTabOnHover: function(el, ev) {
                this.tab.removeClass('active');
                el.addClass('active');

                var targetId = el.data('id');
                this.tabContent.removeClass('active');
                $('#' + targetId).addClass('active');
            },

            '{window} scroll': function(event) {
                this.scrollYTop = $(window).scrollTop();

                if(this.scrollYTop > this.pushPoint && this.scrollYTop < this.stopPoint) {
                    this.tabContainer.addClass('sticky');
                    this.tabContainer.removeClass('not-sticky');
                } else if(this.scrollYTop > this.stopPoint) {
                    this.tabContainer.removeClass('sticky');
                    this.tabContainer.addClass('not-sticky')
                } else {
                    this.tabContainer.removeClass('sticky');
                    this.tabContainer.removeClass('not-sticky');
                }
            },

            '{window} resize': function() {
                this.elementHeight = this.element.outerHeight();
                this.stopPoint = (this.pushPoint + this.elementHeight) - this.tabContainerHeight;

                if(this.scrollYTop > this.pushPoint && this.scrollYTop < this.stopPoint) {
                    this.tabContainer.addClass('sticky');
                    this.tabContainer.removeClass('not-sticky');
                } else if(this.scrollYTop > this.stopPoint) {
                    this.tabContainer.removeClass('sticky');
                    this.tabContainer.addClass('not-sticky')
                } else {
                    this.tabContainer.removeClass('sticky');
                    this.tabContainer.removeClass('not-sticky');
                }
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.OvalTabs = can.Control.extend(
        {
            pluginName: 'appWidgetOvalTabs',
            defaults: {}
        },
        {
            init: function () {
                this.tabContentIdIdArray = [];

                this.tab = this.element.find('.js-oval-tabs__tab');
                this.tabContent = this.element.find('.js-oval-tabs__content');
                this.scrollTo = false;

                var self = this;

                this.on(this.tab, 'click', 'switchTabOnClick');

                // Открытие заданного хешем в url таба при переходе на страницу
                this.tab.each(function() {
                    this.tabContentId = $(this).data('id');
                    self.tabContentIdIdArray.push(this.tabContentId);
                });

                var uri = new URI(window.location.href);
                uri.fragmentPrefix("!");
                if(uri.fragment(true)) {
                    var hFragment = uri.fragment(true);
                    if ('oval-tabs' in hFragment) {
                        this.lochash = hFragment['oval-tabs'];
                    }
                    if ('scroll-to' in hFragment) {
                        this.scrollTo = hFragment['scroll-to'];
                    }
                }


                /*
			    if(window.location.hash) {
					this.lochash = window.location.hash.substring(1);
				}
				*/

                this.tabContentIdIdArray.forEach(function(item) {
                    if(self.lochash === item) {
                        self.element.find('[data-id=' + item + ']').click();
                    }
                });

                if(self.scrollTo) {
                    $('html, body').animate({
                        scrollTop: $('#' + self.scrollTo).offset().top - 60
                    }, 1500);
                }
            },

            switchTabOnClick: function(el, ev) {
                this.tab.removeClass('active');
                el.addClass('active');

                var targetId = el.data('id');
                this.tabContent.removeClass('active');
                $('#' + targetId).addClass('active');
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.Tabs = can.Control.extend(
        {
            pluginName: 'appWidgetTabs',
            defaults: {}
        },
        {
            init: function () {
                this.tabContentIdIdArray = [];

                this.tab = this.element.find('.js-tabs__tab');
                this.tabContent = this.element.find('.js-tabs__content');
                this.pieTab = this.element.find('.js-tabs__pie-tab');

                var self = this;

                this.on(this.tab, 'click', 'switchTabOnClick');
                this.on(this.pieTab, 'click', 'switchPieTabOnClick');

                if(this.element.hasClass('js-tabs--transformer')) {
                    this.selectMenu = this.element.find('.js-tabs__select-menu');
                    this.tabsList = this.element.find('.js-tabs__list');

                    this.on(this.selectMenu, 'click', 'showTabsOnClick');
                }

                // Автоматическое переключение табов при наличии соответствующего класса
                if(this.element.hasClass('js-tabs--autoswitch')) {

                    var intAutoSwitch = setInterval(
                        () => {
                            this.tabsAutoSwitch(this.element);
                        }, 2000);

                    intAutoSwitch;

                    this.on(this.tab, 'click', () => {
                        clearInterval(intAutoSwitch);
                    });

                    this.on(this.tabContent, 'mouseover', () => {
                        clearInterval(intAutoSwitch);
                    });
                }

                // Открытие заданного хешем в url таба при переходе на страницу
                this.tab.each(function() {
                    this.tabContentId = $(this).data('id');
                    self.tabContentIdIdArray.push(this.tabContentId);
                });

                if(window.location.hash) {
                    this.lochash = window.location.hash.substring(1);
                }

                this.tabContentIdIdArray.forEach(function(item) {
                    itemArr = item.split(' ');
                    itemArr.forEach(function(i) {
                        if (self.lochash === i) {
                            self.element.find('[data-id~=' + i + ']').click();
                        }
                    });
                });
            },

            switchTabOnClick: function(el, ev) {
                this.tab.removeClass('active');
                el.addClass('active');

                var targetId = el.data('id').split(' ')[0];
                this.tabContent.removeClass('active');

                $('#' + targetId).addClass('active');

                if(this.element.hasClass('js-tabs--horizontal')) {
                    var targetColor = el.data('color');
                    var targetIdArray = [];

                    $('.js-tabs--horizontal .js-tabs__tab').each(function() {
                        var attrs = $(this).data('color');
                        targetIdArray.push(attrs);
                    });

                    for (var i = 0; i < targetIdArray.length; i++) {
                        var targetIdArrayItem = targetIdArray[i];

                        el.parent().removeClass('horizontal-tabs__list--' + targetIdArrayItem).addClass('horizontal-tabs__list--' + targetColor);
                    }
                }

                if(this.element.hasClass('js-tabs--pie-tabs')) {
                    var targetPie = el.data('pie');
                    var targetIdArray = [];

                    $('.js-tabs--pie-tabs .js-tabs__tab').each(function() {
                        var attrs = $(this).data('pie');
                        targetIdArray.push(attrs);
                    });

                    for (var i = 0; i < targetIdArray.length; i++) {
                        var targetIdArrayItem = targetIdArray[i];

                        el.parent().removeClass('pie-tabs__list--' + targetIdArrayItem).addClass('pie-tabs__list--' + targetPie);
                    }
                }

                if(this.element.hasClass('js-tabs--transformer') ) {
                    this.activeTabText = el.text();
                    this.selectMenu.text(this.activeTabText);

                    this.showTabsOnClick();
                }
            },

            'switchPieTabOnClick': function(el, ev) {
                this.pieTab.removeClass('active');
                el.addClass('active');

                var targetId = el.data('id').split(' ')[0];
                this.tabContent.removeClass('active');

                $('#' + targetId).addClass('active');

                $(this.tab).filter('[data-id~="' + targetId +'"]').click();
            },

            'showTabsOnClick': function(el, ev) {
                if($(window).width() < 783 && this.element.hasClass('js-tabs--vertical')) {
                    this.tabsList.slideToggle('fast');
                } else if($(window).width() < 983 && this.element.hasClass('js-tabs--vertical-large')) {
                    this.tabsList.slideToggle('fast');
                } else if($(window).width() < 1003 && this.element.hasClass('js-tabs--horizontal')) {
                    this.tabsList.slideToggle('fast');
                }
            },

            // Метод для автоматического переключения табов
            'tabsAutoSwitch': function(el) {
                var activeTab = this.tab.filter('.active');
                var activeContent = this.tabContent.filter('.active');

                activeTab.removeClass('active');
                activeTab.next().addClass('active');

                if (activeTab.is(':last-child')) {
                    this.tab.eq(0).addClass('active');
                }

                activeTab = this.tab.filter('.active');

                var targetId = activeTab.data('id').split(' ')[0];
                activeContent.removeClass('active');
                $('#' + targetId).addClass('active');
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ZeroReportingOrder = can.Control.extend(
        {
            pluginName: 'appPaymentFormZeroContact',
            defaults: {
                ZATOgateway: '/ajax/interface/zato/'
            }
        },
        {
            init: function () {
                this.form = this.element.find('form');
                this.formName = this.form.attr('name');
                this.gateway = this.form.attr('action');
                this.gtmCategory = this.form.attr('gtmcategory');
                this.formFio = this.form.find('input[data-fieldtype="FORM_NAME"]');
                this.formComment = this.form.find('*[data-fieldtype="FORM_COMMENT"]');
                this.formPhone = this.form.find('input[data-fieldtype="FORM_PHONE"]');
                this.formEmail = this.form.find('input[data-fieldtype="FORM_EMAIL"]');
                this.phoneBut = this.form.find('.js-site-phone-a');
                this.payBut = this.form.find('.js-zcf2pay');

                this.KISDirection = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                this.KISComment = this.form.find('input[data-fieldtype="KIS_COMMENT"]').val();

                if (typeof GTMpushEventLoadForm == "function") {
                    GTMpushEventLoadForm(this.formName);
                }

                if (this.form.data('validate') && !this.form.data('validate-nomsg')) {
                    this.form.validate(window.application.validateOptionsDefault);
                } else {
                    this.form.validate(window.application.validateOptionsNoMsg);
                }

                this.form.find('input[data-fieldtype="FORM_IP"]').val(Geo.ip);
                this.form.find('input[data-fieldtype="FORM_SERVICE"]').val(App.ZeroWebFormValues.service);
                this.form.find('input[data-fieldtype="FORM_REGION"]').val(Geo.region);

                var clientID = '';
                if (typeof waTrack == "undefined") {
                    clientID = getGAClientID();
                } else {
                    clientID = waTrack.clientID;
                }
                this.form.find('input[data-fieldtype="FORM_CID"]').val(clientID);

                this.formTouchEvent();

                this.on(this.form, 'submit', 'submitForm');

                if (this.formFio) {
                    this.on(this.formFio, 'change', 'changeName');
                    this.onceNameSend = true;
                }
                if (this.formComment) {
                    this.on(this.formComment, 'change', 'changeComment');
                    this.onceCommentSend = true;
                }
                if (this.formPhone) {
                    this.on(this.formPhone, 'change', 'changePhone');
                    this.oncePhoneSend = true;
                }
                if (this.formEmail) {
                    this.on(this.formEmail, 'change', 'changeEmail');
                    this.onceEmailSend = true;
                }
                if (this.phoneBut) {
                    this.on(this.phoneBut, 'click', 'clickTel');
                    this.onceTelSend = true;
                }
                if (this.payBut) {
                    this.oncePaySend = true;
                }

            },
            clickTel: function (el, ev) {
                if (this.onceTelSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_TEL');
                    this.onceTelSend = false;
                }
            },
            changeName: function (el, ev) {
                if (this.form.data('validate') && this.onceNameSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_NAME');
                    this.onceNameSend = false;
                }
            },
            changeComment: function (el, ev) {
                if (this.form.data('validate') && this.onceCommentSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_COMMENT');
                    this.onceCommentSend = false;
                }
            },
            changePhone: function (el, ev) {
                if (this.form.data('validate') && this.oncePhoneSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_PHONE');
                    this.oncePhoneSend = false;
                }
            },
            changeEmail: function (el, ev) {
                if (this.form.data('validate') && this.onceEmailSend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_EMAIL');
                    this.onceEmailSend = false;
                }
            },
            formTouchEvent: function () {

                var self = this, formInputs = this.form.find(':input');

                self.formTouch = false;

                formInputs.on('focus', sendTouchEvent);
                formInputs.on('change', sendTouchEvent);

                function sendTouchEvent() {
                    if (!self.formTouch) {
                        self.formTouch = true;
                        formInputs.off('focus', sendTouchEvent);
                        formInputs.off('change', sendTouchEvent);
                        if (typeof GTMpushEventTouchForm == 'function') {
                            GTMpushEventTouchForm(self.formName);
                        }
                    }
                }
            },

            submitForm: function (el, ev) {
                ev.preventDefault();

                if (this.form.data('validate') && !this.form.valid()) {
                    if (typeof GTMpushEventErrorForm == "function") {
                        GTMpushEventErrorForm(this.formName, this.gtmCategory);
                    }
                    return false;
                }

                this.form.startWaiting();

                $.post(this.gateway, this.form.serialize(), function () {
                }, 'json')
                    .done(this.proxy('doneSubmit'))
                    .fail(this.proxy('failSubmit'));

            },

            doneSubmit: function (res) {
                this.exportFieldsZATO();

                if (typeof GTMpushEventSendForm == "function") {
                    GTMpushEventSendForm(this.formName, this.gtmCategory);
                }

                $.fancybox({
                    wrapCSS: 'modal-wrapper',
                    margin: ($(window).width() > 937) ? 20 : 5,
                    padding: 15,
                    helpers: {
                        overlay: {
                            css: {
                                'background': 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    'content': $(res.html)
                });
            },

            failSubmit: function (res) {
                if (typeof GTMpushEventErrorForm == "function") {
                    GTMpushEventErrorForm(this.formName, this.gtmCategory);
                }
                this.element.html($(res.responseText).html());
                this.form = this.element.find('form');
                this.gateway = this.form.attr('action');
                this.on(this.form, 'submit', 'submitForm');
            },


            /* @todo: exportFieldsZATO дублируется, сделать внешний js-метод */
            exportFieldsZATO: function () {

                if (typeof SubmitSender2Mail2CT == "undefined") {
                    console.error('waTrack is undefined');
                } else {

                    if (this.KISDirection.length) {
                        var ZATOTypeForm = {};

                        // @todo: Почему отключил регион здесь? ZATO принимает регион?

                        ZATOTypeForm.name = this.form.find('input[data-fieldtype="FORM_NAME"]').val();
                        ZATOTypeForm.phone = this.form.find('input[data-fieldtype="FORM_PHONE"]').val();
                        ZATOTypeForm.direction = this.form.find('input[data-fieldtype="FORM_DIRECTION"]').val();
                        //ZATOTypeForm.name = this.form.find('input[data-fieldtype="FORM_REGION"]').val();
                        ZATOTypeForm.clientId = this.form.find('input[data-fieldtype="FORM_CID"]').val();
                        ZATOTypeForm.inUrl = this.form.find('input[data-fieldtype="FORM_URL"]').val();
                        ZATOTypeForm.email = this.form.find('input[data-fieldtype="FORM_EMAIL"]').val();

                        ZATOTypeForm.comment = '';
                        if (this.KISComment)
                            ZATOTypeForm.comment += this.KISComment;
                        if (this.form.find('*[data-fieldtype="FORM_COMMENT"]').val())
                            ZATOTypeForm.comment += ' ' + this.form.find('*[data-fieldtype="FORM_COMMENT"]').val();

                        //var ZATODataObj = waTrack.ZATOData(ZATOTypeForm);
                        var ZATODataObj = SubmitSender2Mail2CT(ZATOTypeForm);
                        //console.log(ZATODataObj);
                        var Context = {ZATO: ZATODataObj};

                        $.post(this.options.ZATOgateway, Context);
                    }

                }

            },

            '.js-zcf2pay click': function (el, ev) {

                Cookies.set('ZeroWebFormValues_name', this.form.find('input[data-fieldtype="FORM_NAME"]').val());
                Cookies.set('ZeroWebFormValues_phone', this.form.find('input[data-fieldtype="FORM_PHONE"]').val());
                Cookies.set('ZeroWebFormValues_email', this.form.find('input[data-fieldtype="FORM_EMAIL"]').val());
                Cookies.set('ZeroWebFormValues_inn', this.form.find('input[data-fieldtype="FORM_INN"]').val());
                Cookies.set('ZeroWebFormValues_service', this.form.find('input[data-fieldtype="FORM_SERVICE"]').val());
                Cookies.set('ZeroWebFormValues_comment', this.form.find('*[data-fieldtype="FORM_COMMENT"]').val());

                if (this.oncePaySend) {
                    GTMpushEventTouchForm(this.formName, this.gtmCategory, 'FORM_PAY');
                    this.oncePaySend = false;
                }

                if (this.form.data('validate') && !this.form.valid()) {
                    ev.preventDefault();
                    return false;
                }

                return;

            }

        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ZeroReportingOrder = can.Control.extend(
        {
            pluginName: 'appWidgetZeroReportingOrder',
            defaults: {}
        },
        {
            init: function () {
                this.option = this.element.find('.js-zero-reporting-order__option');
                this.optionPrice = this.element.find('.js-zero-reporting-order__option-price');
                this.totalPrice = this.element.find('.js-zero-reporting-order__total-price');

                var self = this;

                this.option.on('ifChecked', function() {
                    var newTotalPrice = +self.totalPrice.text();
                    var checkedPrice = +$(this).parent().siblings(self.optionPrice).find('span').text();
                    var resultPrice = newTotalPrice + checkedPrice;

                    self.totalPrice.text(resultPrice);

                    var prop = $(this).data('prop');
                    var val = $(this).data('val');
                    App.ZeroWebFormValues[prop] = val;
                    Cookies.set('ZeroWebFormValues_'+prop,val);

                    App.ZeroWebFormValues.summ = resultPrice;
                    Cookies.set('ZeroWebFormValues_summ',resultPrice);
                });

                this.option.on('ifUnchecked', function() {
                    var newTotalPrice = +self.totalPrice.text();
                    var uncheckedPrice = +$(this).parent().siblings(self.optionPrice).find('span').text();
                    var resultPrice = newTotalPrice - uncheckedPrice;

                    self.totalPrice.text(resultPrice);

                    var prop = $(this).data('prop');
                    App.ZeroWebFormValues[prop] = '';
                    Cookies.set('ZeroWebFormValues_'+prop,'');

                    App.ZeroWebFormValues.summ = resultPrice;
                    Cookies.set('ZeroWebFormValues_summ',resultPrice);
                });
            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ZeroReportingPayment = can.Control.extend(
        {
            pluginName: 'appWidgetZeroReportingPayment',
            defaults: {}
        },
        {
            init: function () {
                this.option = this.element.find('.js-zero-reporting-payment__option');
                this.extraOptions = this.element.find('.js-zero-reporting-payment__extra-options');
                this.pricingPlan = this.element.find('.js-zero-reporting-payment__pricing-plan');
                this.discount = this.element.find('.js-zero-reporting-payment__discount');
                this.noDiscounts = this.element.find('.js-zero-reporting-payment__discount--zero');
                this.optionPrice = this.element.find('.js-zero-reporting-payment__option-price');
                this.totalPrice = this.element.find('.js-zero-reporting-payment__total-price');
                this.totalPriceNum = +this.totalPrice.val();

                var self = this;

                // Выбор услуги - "Пакет" или "Комфорт"
                this.pricingPlan.on('ifChecked', function() {
                    self.totalPriceNum = +$(this).parent().siblings(self.optionPrice).find('span').text();
                    self.totalPrice.val(self.totalPriceNum);
                    App.ZeroWebFormValues.summ = self.totalPriceNum;
                    Cookies.set('ZeroWebFormValues_summ',self.totalPriceNum);


                    self.discount.each(function(i, el) {
                        $(this).iCheck('uncheck');
                        //self.noDiscounts.iCheck('check');
                        if (App.ZeroWebFormValues.sale_code) {
                            self.element.find('#'+App.ZeroWebFormValues.sale_code).iCheck('check');
                        } else {
                            self.noDiscounts.iCheck('check');
                        }
                    });


                    self.option.each(function(i, el) {
                        $(this).iCheck('uncheck');
                    });

                    if($(this).hasClass('js-zero-reporting-payment__pricing-plan--comfort')) {
                        self.extraOptions.removeClass('hide');

                        App.ZeroWebFormValues.service = 'Пакет "Комфорт"';
                        App.ZeroWebFormValues.service_code = 2;
                        Cookies.set('ZeroWebFormValues_service','Пакет "Комфорт"');
                        Cookies.set('ZeroWebFormValues_service_code',2);
                    } else {
                        self.extraOptions.addClass('hide');

                        App.ZeroWebFormValues.service = 'Пакет "Эконом"';
                        App.ZeroWebFormValues.service_code = 1;
                        Cookies.set('ZeroWebFormValues_service','Пакет "Эконом"');
                        Cookies.set('ZeroWebFormValues_service_code',1);

                        App.ZeroWebFormValues.options_electron = '';
                        Cookies.set('ZeroWebFormValues_options_electron','');

                        App.ZeroWebFormValues.options_courier = '';
                        Cookies.set('ZeroWebFormValues_options_courier','');
                    }
                });

                // Выбор вида скидки
                this.discount.on('ifChecked', function() {
                    var checkedDiscount = $(this).parent().siblings(self.optionPrice).find('span').text() / 100;
                    var resultPrice = self.totalPriceNum - self.totalPriceNum * checkedDiscount;

                    self.option.parent().each(function(i, el) {
                        if($(this).hasClass('custom-checkbox--checked')) {
                            var optionPrice = +$(this).siblings(self.optionPrice).find('span').text();
                            resultPrice = resultPrice + optionPrice;
                        }
                    });

                    self.totalPrice.val(resultPrice);
                    App.ZeroWebFormValues.summ = resultPrice;
                    Cookies.set('ZeroWebFormValues_summ',resultPrice);


                    if ($(this).attr('id') && $(this).attr('id') !== 'no-discounts') {
                        App.ZeroWebFormValues.sale = $(this).val();
                        App.ZeroWebFormValues.sale_code = $(this).attr('id');
                        Cookies.set('ZeroWebFormValues_sale',$(this).val());
                        Cookies.set('ZeroWebFormValues_sale_code',$(this).attr('id'));
                    } else {
                        App.ZeroWebFormValues.sale = '';
                        App.ZeroWebFormValues.sale_code = '';
                        Cookies.set('ZeroWebFormValues_sale','');
                        Cookies.set('ZeroWebFormValues_sale_code','');
                    }


                });

                // Выбор дополнительных опций к пакету "Комфорт"
                this.option.on('ifChecked', function() {
                    var newTotalPrice = +self.totalPrice.val();
                    var checkedPrice = +$(this).parent().siblings(self.optionPrice).find('span').text();
                    var resultPrice = newTotalPrice + checkedPrice;

                    self.totalPrice.val(resultPrice);
                    App.ZeroWebFormValues.summ = resultPrice;
                    Cookies.set('ZeroWebFormValues_summ',resultPrice);

                    var optName = $(this).data('opt-name');

                    App.ZeroWebFormValues[optName] = 'Y';
                    Cookies.set('ZeroWebFormValues_'+optName,'Y');
                });

                this.option.on('ifUnchecked', function() {
                    var newTotalPrice = +self.totalPrice.val();
                    var uncheckedPrice = +$(this).parent().siblings(self.optionPrice).find('span').text();
                    var resultPrice = newTotalPrice - uncheckedPrice;

                    self.totalPrice.val(resultPrice);
                    App.ZeroWebFormValues.summ = resultPrice;
                    Cookies.set('ZeroWebFormValues_summ',resultPrice);

                    var optName = $(this).data('opt-name');

                    App.ZeroWebFormValues[optName] = '';
                    Cookies.set('ZeroWebFormValues_'+optName,'');
                });

                this.setStartVals();
            },

            setStartVals: function() {

                if (App.ZeroWebFormValues.service_code && App.ZeroWebFormValues.service_code == 2) {
                    this.element.find('.js-zero-reporting-payment__pricing-plan--comfort').iCheck('check');

                    if (App.ZeroWebFormValues.options_electron && App.ZeroWebFormValues.options_electron == 'Y') {
                        this.element.find('#zero-reporting-sending').iCheck('check');
                    }

                    if (App.ZeroWebFormValues.options_courier && App.ZeroWebFormValues.options_courier == 'Y') {
                        this.element.find('#zero-reporting-courier').iCheck('check');
                    }

                }


                if (App.ZeroWebFormValues.sale_code) {
                    this.element.find('#'+App.ZeroWebFormValues.sale_code).iCheck('check');
                }


            }
        }
    );
}(jQuery));
(function ($) {
    App.Widgets.Widgets = App.Widgets.Widgets || {};
    App.Widgets.Widgets.ZeroReportingTest = can.Control.extend(
        {
            pluginName: 'appWidgetZeroReportingTest',
            defaults: {}
        },
        {
            init: function () {

                var self = this;

                this.$questions = this.element.find('.test-questions li');
                this.$answers = this.element.find('.js-zero-reporting-test__answer');
                this.$btn = this.element.find('.js-zero-reporting-test__btn');

                this.$answers.on('ifChecked', function () {

                    var emptyAnswer = false;
                    var testResult = false;

                    self.$questions.each(function () {
                        if (!$(this).find('input:radio').is(':checked'))
                            emptyAnswer = true;
                        else {
                            if ($(this).find('input:radio:checked').val() == 'true')
                                testResult = true;
                        }

                    });

                    if (!emptyAnswer) {
                        self.$btn.removeClass('disabled');
                        if (testResult)
                            self.$btn.attr('href', '#no-zero-reporting');
                        else
                            self.$btn.attr('href', '#zero-reporting');
                    }
                });
            }
        }
    );
}(jQuery));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJndG1fdHJpZ2dlcnMuanMiLCJhY2NvdW50L3Rvb2x0aXAuanMiLCJhY2NvdW50aW5nL3NjcmlwdC5qcyIsImVkby9zY3JpcHQuanMiLCJwYXltZW50L2Zvcm0tYWpheC1wYXltZW50LmpzIiwicGF5bWVudC9wYXltZW50LWlucHV0LmpzIiwicGF5bWVudC96ZXJvLXJlcG9ydC1wYXltZW50LWlucHV0LmpzIiwicGF5bWVudC96ZXJvLXR5cGUtY2hvaWNlci5qcyIsInBheW1lbnQvemVyby10eXBlLXByb3BzLmpzIiwiZmluYW5jZS9zY3JpcHQuanMiLCJ2YWxpZGF0b3IvbWVzc2FnZXMuanMiLCJxdWl6L3NjcmlwdC5qcyIsInN1YnNjcmliZS9zdWJzY3JpYmUtcG9wdXAuanMiLCJ3aWRnZXRzL2FjY29yZGlvbi5qcyIsIndpZGdldHMvYWNjb3VudGluZy1jYWxjdWxhdG9yLmpzIiwid2lkZ2V0cy9iYWNrLXRvLXRvcC5qcyIsIndpZGdldHMvYmFubmVyLWxhenkuanMiLCJ3aWRnZXRzL2Jsb2ctYWNjb3JkaW9uLmpzIiwid2lkZ2V0cy9ibG9nLWFyY2hpdmUuanMiLCJ3aWRnZXRzL2Jsb2ctdGFncy5qcyIsIndpZGdldHMvYnVyZ2VyLW1vYmlsZS5qcyIsIndpZGdldHMvY2FsY3VsYXRvci5qcyIsIndpZGdldHMvY2hhbmdlYWJsZS1jb250YWN0cy5qcyIsIndpZGdldHMvY2hhbmdlcy1jb250cm9sLmpzIiwid2lkZ2V0cy9jaGVja1N1YnNjcmliZUZvcm0uanMiLCJ3aWRnZXRzL2NsaWVudHMtZmlsdGVyLmpzIiwid2lkZ2V0cy9jdXN0b20tZm9ybS1lbGVtZW50LmpzIiwid2lkZ2V0cy9jdXN0b20tc2VsZWN0LmpzIiwid2lkZ2V0cy9kcm9wZG93bi1tZW51LmpzIiwid2lkZ2V0cy9lcXVhbC1oZWlnaHQtYmxvY2tzLmpzIiwid2lkZ2V0cy9ldmVudC1wdXNoLmpzIiwid2lkZ2V0cy9ldmVudHMtYXJjaGl2ZS5qcyIsIndpZGdldHMvZXZlbnRzLWxhenkuanMiLCJ3aWRnZXRzL2ZpbHRlci5qcyIsIndpZGdldHMvZmxpcC1jYXJkLmpzIiwid2lkZ2V0cy9mb3JtLXNlbGVjdC5qcyIsIndpZGdldHMvaHItdGVzdC5qcyIsIndpZGdldHMvbGFuZ3VhZ2VzLXN3aXRjaC5qcyIsIndpZGdldHMvbGF6eS1sb2FkLmpzIiwid2lkZ2V0cy9sYXp5bG9hZC5qcyIsIndpZGdldHMvbG9uZy10YWJsZS5qcyIsIndpZGdldHMvbWFwLmpzIiwid2lkZ2V0cy9uZXdzLWFyY2hpdmUuanMiLCJ3aWRnZXRzL29mZi1jYW52YXMtbW9iaWxlLmpzIiwid2lkZ2V0cy9wcmludC5qcyIsIndpZGdldHMvcXVpei1ldmVudHMuanMiLCJ3aWRnZXRzL3Njcm9sbC10by5qcyIsIndpZGdldHMvc2hvdy1pbmZvLmpzIiwid2lkZ2V0cy9zaG93LW1vcmUuanMiLCJ3aWRnZXRzL3Nob3ctc2VhcmNoLWZvcm0uanMiLCJ3aWRnZXRzL3RheC1wb3J0Zm9saW8uanMiLCJ3aWRnZXRzL3pvb20uanMiLCJ3aWRnZXRzL2Zvcm1zL2V2ZW50LWZvcm0tYWpheC5qcyIsIndpZGdldHMvZm9ybXMvZm9ybS1hamF4LmpzIiwid2lkZ2V0cy9mb3Jtcy9mb3JtLWRlZmF1bHQuanMiLCJ3aWRnZXRzL2Zvcm1zL2Zvcm0tZHVtbXkuanMiLCJ3aWRnZXRzL2Zvcm1zL2Zvcm0tdHJhY2suanMiLCJ3aWRnZXRzL2Zvcm1zL2dldC1ldmVudC1mb3JtLmpzIiwid2lkZ2V0cy9mb3Jtcy9nZXQtZm9ybS1maWxlLmpzIiwid2lkZ2V0cy9mb3Jtcy9nZXQtZm9ybS5qcyIsIndpZGdldHMvZm9ybXMvcG9sbC1mb3JtLmpzIiwid2lkZ2V0cy9mb3Jtcy9zbGlkZXItZm9ybS5qcyIsIndpZGdldHMvZm9ybXMvc3Vic2NyaWJlLWZvcm0uanMiLCJ3aWRnZXRzL2Zvcm1zL3Rlc3QtY29sbGVjdC1mb3JtLmpzIiwid2lkZ2V0cy9zbGlkZXJzL2NsaWVudHMtc2xpZGVyLmpzIiwid2lkZ2V0cy9zbGlkZXJzL2NvbnRlbnQtc2xpZGVyLmpzIiwid2lkZ2V0cy9zbGlkZXJzL2RvdHRlZC1uYXYtY2Fyb3VzZWwtbm8tYXV0by5qcyIsIndpZGdldHMvc2xpZGVycy9kb3R0ZWQtbmF2LWNhcm91c2VsLmpzIiwid2lkZ2V0cy9zbGlkZXJzL2VtcGxveWVlLXJldmlld3Mtc2xpZGVyLmpzIiwid2lkZ2V0cy9zbGlkZXJzL2ltYWdlcy1jYXJvdXNlbC5qcyIsIndpZGdldHMvc2xpZGVycy9tYWluLXNsaWRlci5qcyIsIndpZGdldHMvc2xpZGVycy9wYXJ0bmVycy1jYXJvdXNlbC1tb2IuanMiLCJ3aWRnZXRzL3NsaWRlcnMvcGFydG5lcnMtY2Fyb3VzZWwtbmF2LmpzIiwid2lkZ2V0cy9zbGlkZXJzL3BhcnRuZXJzLWNhcm91c2VsLmpzIiwid2lkZ2V0cy9zbGlkZXJzL3NsaWRlci5qcyIsIndpZGdldHMvc2xpZGVycy9zeW5jLXNsaWRlci5qcyIsIndpZGdldHMvdGFicy9tb2JpbGUtYXBwLXRhYnMuanMiLCJ3aWRnZXRzL3RhYnMvb3ZhbC10YWJzLmpzIiwid2lkZ2V0cy90YWJzL3RhYnMuanMiLCJ3aWRnZXRzL3plcm8tcmVwb3J0aW5nL3plcm8tY29udGFjdC1mb3JtLmpzIiwid2lkZ2V0cy96ZXJvLXJlcG9ydGluZy96ZXJvLXJlcG9ydGluZy1vcmRlci5qcyIsIndpZGdldHMvemVyby1yZXBvcnRpbmcvemVyby1yZXBvcnRpbmctcGF5bWVudC5qcyIsIndpZGdldHMvemVyby1yZXBvcnRpbmcvemVyby1yZXBvcnRpbmctdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6N0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcmFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDak9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9xQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDQk9C10L3QtdGA0LDRgtC+0YAg0YPQvdC40LrQsNC70L3Ri9GFINC30L3QsNGH0LXQvdC40LkgSURcclxuZnVuY3Rpb24gZ3VpZCgpIHtcclxuICAgIGZ1bmN0aW9uIHM0KCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKVxyXG4gICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbn1cclxuXHJcbi8vINCe0YLQu9C+0LbQtdC90L3QvtC1INCy0YvQv9C+0LvQvdC10L3QuNC1XHJcbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xyXG4gICAgdmFyIHRpbWVvdXQ7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcyxcclxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XHJcbiAgICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuLy8g0JrQu9C+0L3QuNGA0L7QstCw0L3QuNC1XHJcbmZ1bmN0aW9uIGNsb25lKG8pIHtcclxuICAgIHZhciBubyA9IHt9O1xyXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XHJcbiAgICAgICAgbm9ba10gPSBvW2tdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vXHJcbn1cclxuXHJcbi8vIEdBINCY0JQg0LrQu9C40LXQvdGC0LBcclxuZnVuY3Rpb24gZ2V0R0FDbGllbnRJRCgpIHtcclxuXHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5nYSA9PSBcInVuZGVmaW5lZFwiKSB7XHJcblxyXG4gICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgnKD86Xnw7KVxcXFxzKl9nYT0oW147XSopJyk7XHJcbiAgICAgICAgdmFyIHJhdyA9IChtYXRjaCkgPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbMV0pIDogbnVsbDtcclxuICAgICAgICBpZiAocmF3KSB7XHJcbiAgICAgICAgICAgIG1hdGNoID0gcmF3Lm1hdGNoKC8oXFxkK1xcLlxcZCspJC8pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdhY2lkID0gKG1hdGNoKSA/IG1hdGNoWzFdIDogbnVsbDtcclxuICAgICAgICBpZiAoZ2FjaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdhY2lkO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBnYS5nZXRBbGwgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICB2YXIgZ2FjaWQgPSBnYS5nZXRBbGwoKVswXS5nZXQoJ2NsaWVudElkJyk7XHJcbiAgICAgICAgICAgIGlmIChnYWNpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdhY2lkO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8qXHJcbmZ1bmN0aW9uIHJpbmdvSW5pdChyZWdpb25Db2RlKSB7XHJcbiAgICAoZnVuY3Rpb24gKGQsIHMsIHUsIGUsIHApIHtcclxuICAgICAgICB3aW5kb3cucmluZ29zdGF0Q29uZmlnID0ge307XHJcbiAgICAgICAgd2luZG93LnJpbmdvc3RhdENvbmZpZ1snbnVtYmVycyddID0ge307XHJcbiAgICAgICAgd2luZG93LnJpbmdvc3RhdENvbmZpZ1snbnVtYmVycyddW3JlZ2lvbkNvZGVdID0ge1xyXG4gICAgICAgICAgICBjbGFzczogJ3JpbmdvLScrcmVnaW9uQ29kZSxcclxuICAgICAgICAgICAgbWFzazonPHQ+J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcD1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLGU9ZC5jcmVhdGVFbGVtZW50KHMpLGUuYXN5bmM9MSxlLnNyYz11LHAucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZSxwKTtcclxuICAgIH0pKGRvY3VtZW50LCAnc2NyaXB0JywgJ2h0dHBzOi8vcmluZ29zdGF0LmNvbS9udW1iZXJzL3YzL3Jpbmdvc3RhdC5taW4uanMnKTtcclxufVxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gICAgLy8gRml4INC00LvRjyDQv9GA0LDQstC40LvRjNC90L7Qs9C+INGA0LDRgdGH0LXRgtCwINCy0YvRgdC+0YLRiyDQstC40LTQuNC80L7QuSDQvtCx0LvQsNGB0YLQuCAodmgpINCyIEFwcGxlIFNhZmFyaVxyXG4gICAgZnVuY3Rpb24gc2FmYXJpVmhGaXgoKSB7XHJcbiAgICAgICAgLy8gRmlyc3Qgd2UgZ2V0IHRoZSB2aWV3cG9ydCBoZWlnaHQgYW5kIHdlIG11bHRpcGxlIGl0IGJ5IDElIHRvIGdldCBhIHZhbHVlIGZvciBhIHZoIHVuaXRcclxuICAgICAgICBjb25zdCB2aCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuMDE7XHJcbiAgICAgICAgLy8gVGhlbiB3ZSBzZXQgdGhlIHZhbHVlIGluIHRoZSAtLXZoIGN1c3RvbSBwcm9wZXJ0eSB0byB0aGUgcm9vdCBvZiB0aGUgZG9jdW1lbnRcclxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tdmgnLCBgJHt2aH1weGApO1xyXG4gICAgfTtcclxuXHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzYWZhcmlWaEZpeCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gTWFnbmlmaWMtcG9wdXAgaW5pdGlhbGl6YXRpb25cclxuICAgICQoJ1tkYXRhLXBvcHVwLWJlaWdlXScpLm1hZ25pZmljUG9wdXAoe1xyXG4gICAgICAgIHR5cGU6ICdpbmxpbmUnLFxyXG4gICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ25vLXNjcm9sbCcpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCduby1zY3JvbGwnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCS0YvRgNCw0LLQvdC40LLQsNGC0LXQu9GMXHJcbiAgICAkKCcuanMtZXF1YWxpemUtc2NvcGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJGNvbnRleHQgPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciAkZWxlbXMgPSAkKCcuanMtZXF1YWxpemUtc2NvcGVfX2VsZW0nLCAkY29udGV4dCk7XHJcbiAgICAgICAgdmFyIGVxdWFsaXplVGltZW91dDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZXF1YWxpemUoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXhIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGVxdWFsaXplVGltZW91dCk7XHJcbiAgICAgICAgICAgICRlbGVtcy5jc3MoJ21pbi1oZWlnaHQnLCAnJyk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRlbGVtcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXhIZWlnaHQgPSBNYXRoLm1heChtYXhIZWlnaHQsICQodGhpcykub3V0ZXJIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgJGVsZW1zLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdtaW4taGVpZ2h0JywgbWF4SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXF1YWxpemUoKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGVxdWFsaXplKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQuZm4uc3RhcnRXYWl0aW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRlbGVtID0gJCh0aGlzKTtcclxuICAgICAgICAkZWxlbS5maW5kKCcuZm9ybV9fc3VibWl0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgICB2YXIgbG9hZGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbG9hZGVyRGl2LmNsYXNzTmFtZSA9ICd1aS1sb2FkZXInO1xyXG4gICAgICAgIGxvYWRlckRpdi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiL2xvY2FsL3RlbXBsYXRlcy9tYWluL2J1aWxkL2ltYWdlcy91aS9wcmVsb2FkZXIuZ2lmXCIpJztcclxuICAgICAgICAkZWxlbS5jc3Moe3Bvc2l0aW9uOiAncmVsYXRpdmUnfSk7XHJcbiAgICAgICAgJGVsZW1bMF0uYXBwZW5kQ2hpbGQobG9hZGVyRGl2KTtcclxuICAgIH07XHJcblxyXG4gICAgJC5mbi5lbmRXYWl0aW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRlbGVtID0gJCh0aGlzKTtcclxuICAgICAgICAkZWxlbS5maW5kKCcuZm9ybV9fc3VibWl0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgJGxvYWRlckRpdiA9ICRlbGVtLmZpbmQoJy51aS1sb2FkZXInKTtcclxuICAgICAgICAkbG9hZGVyRGl2LnJlbW92ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3cuR2VvID0gd2luZG93LkdlbyB8fCB7fTtcclxuICAgIHdpbmRvdy5DYWxsVHJhY2tpbmcgPSB3aW5kb3cuQ2FsbFRyYWNraW5nIHx8IHtcclxuICAgICAgICByZWFkeTogZmFsc2VcclxuICAgIH07XHJcbiAgICB3aW5kb3cuQXBwID0gd2luZG93LkFwcCB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzID0gQXBwLldpZGdldHMgfHwge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGB0L3QvtCy0L3QvtC5INC60LvQsNGB0YEg0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgICAqINCS0YHQtSDQvNC10YLQvtC00YssINC90LDRh9C40L3QsNGO0YnQuNC10YHRjyDRgSBcImluaXRcIiDQt9Cw0L/Rg9GB0LrQsNGO0YLRgdGPINCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutC4INC/0YDQuCDQv9C+0LvQvdC+0Lkg0LfQsNCz0YDRg9C30LrQtSDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgKi9cclxuICAgIHZhciBBcHBsaWNhdGlvbiA9IGNhbi5Db250cm9sLmV4dGVuZCh7fSwge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZ2V0Q2xpZW50SWQgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKCcvYWpheC9pbnRlcmZhY2UvY2hlY2tjaWQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2NpZCc6IGdldENsaWVudElkKClcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChpUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlSZXNwb25zZS5hbGxvd2VkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgnL2Jsb2NrZWQvJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5nZXRKU09OKCcvYWpheC9pbnRlcmZhY2UvZ2VvbG9jYXRpb24nLCBmdW5jdGlvbiAoaVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuR2VvID0gaVJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5MYW5nID0gdGhpcy5zcG90TGFuZygpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqINCf0YDQvtC60YDRg9GC0LrQsCDQuiDRj9C60L7RgNGOLCDQv9GA0Lgg0LfQsNCz0YDRg9C30LrQtVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIHVyaSA9IG5ldyBVUkkod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh1cmkuaGFzaCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChzZWxmLnNjcm9sbEl0KHVyaS5oYXNoKCkpLCA1MDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgQXBwLlplcm9XZWJGb3JtVmFsdWVzID0gQXBwLlplcm9XZWJGb3JtVmFsdWVzIHx8IHtcclxuICAgICAgICAgICAgICAgIHNlcnZpY2U6IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zZXJ2aWNlJykgPyBDb29raWVzLmdldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc2VydmljZScpIDogJycsXHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlX2NvZGU6IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zZXJ2aWNlX2NvZGUnKSA/IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zZXJ2aWNlX2NvZGUnKSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uc19lbGVjdHJvbjogQ29va2llcy5nZXQoJ1plcm9XZWJGb3JtVmFsdWVzX29wdGlvbnNfZWxlY3Ryb24nKSA/IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19vcHRpb25zX2VsZWN0cm9uJykgOiAnJyxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNfY291cmllcjogQ29va2llcy5nZXQoJ1plcm9XZWJGb3JtVmFsdWVzX29wdGlvbnNfY291cmllcicpID8gQ29va2llcy5nZXQoJ1plcm9XZWJGb3JtVmFsdWVzX29wdGlvbnNfY291cmllcicpIDogJycsXHJcbiAgICAgICAgICAgICAgICBzYWxlOiBDb29raWVzLmdldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc2FsZScpID8gQ29va2llcy5nZXQoJ1plcm9XZWJGb3JtVmFsdWVzX3NhbGUnKSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgc2FsZV9jb2RlOiBDb29raWVzLmdldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc2FsZV9jb2RlJykgPyBDb29raWVzLmdldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc2FsZV9jb2RlJykgOiAnJyxcclxuICAgICAgICAgICAgICAgIHN1bW06IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zdW1tJykgPyBDb29raWVzLmdldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc3VtbScpIDogJycsXHJcbiAgICAgICAgICAgICAgICBpbm46IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19pbm4nKSA/IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19pbm4nKSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogQ29va2llcy5nZXQoJ1plcm9XZWJGb3JtVmFsdWVzX25hbWUnKSA/IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19uYW1lJykgOiAnJyxcclxuICAgICAgICAgICAgICAgIHBob25lOiBDb29raWVzLmdldCgnWmVyb1dlYkZvcm1WYWx1ZXNfcGhvbmUnKSA/IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19waG9uZScpIDogJycsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogQ29va2llcy5nZXQoJ1plcm9XZWJGb3JtVmFsdWVzX2VtYWlsJykgPyBDb29raWVzLmdldCgnWmVyb1dlYkZvcm1WYWx1ZXNfZW1haWwnKSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgYWRkcmVzczogQ29va2llcy5nZXQoJ1plcm9XZWJGb3JtVmFsdWVzX2FkZHJlc3MnKSA/IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19hZGRyZXNzJykgOiAnJyxcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6IENvb2tpZXMuZ2V0KCdaZXJvV2ViRm9ybVZhbHVlc19jb21tZW50JykgPyBDb29raWVzLmdldCgnWmVyb1dlYkZvcm1WYWx1ZXNfY29tbWVudCcpIDogJydcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYm9vdHN0cmFwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2Q7XHJcblxyXG4gICAgICAgICAgICBmb3IgKG1ldGhvZCBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kLmxlbmd0aCA+IDQgJiYgbWV0aG9kLnN1YnN0cigwLCA0KSA9PT0gJ2luaXQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1ttZXRob2RdKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhbi5yb3V0ZS5yZWFkeSgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCd0LDQstC10YjQuNCy0LDQtdGCINC60L7QvdGC0YDQvtC70LvQtdGAINC90LAgRE9NINGN0LvQtdC80LXQvdGCINC4INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC10LPQviBpbnN0YW5jZVxyXG4gICAgICAgICAqIEBwYXJhbSBzZWxlY3RvclxyXG4gICAgICAgICAqIEBwYXJhbSBjb250cm9sbGVyTmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSBzZXR0aW5nc1xyXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGluc3RhbGxDb250cm9sbGVyOiBmdW5jdGlvbiAoc2VsZWN0b3IsIGNvbnRyb2xsZXJOYW1lLCBzZXR0aW5ncykge1xyXG4gICAgICAgICAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmZpbmQoc2VsZWN0b3IpW2NvbnRyb2xsZXJOYW1lXShzZXR0aW5ncykuY29udHJvbChjb250cm9sbGVyTmFtZSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LrQsNGB0YLQvtC80L3Ri9GFINC60L7QvNC/0L7QvdC10L3RgiDQstGA0L7QtNC1INGB0LXQu9C10LrRgtC+0LIsINGH0LXQutCx0L7QutGB0L7QsiDQuCDQv9GA0L7Rh9C10LPQvlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGluaXRDdXN0b21Db21wb25lbnRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucnVuRmFuY3lib3goKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5Ub29sdGlwc3RlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnJ1bmlDaGVjaygpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRVSUNvbXBvbmVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtRmlsZUluaXQoKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWdldC1mb3JtLWZpbGUnLCAnYXBwV2lkZ2V0Rm9ybUdldEZpbGUnKTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtRmlsZUNsaWNrKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYXBwbGljYXRpb24uaW5zdGFsbENvbnRyb2xsZXIoJy5qcy16ZXJvLXJlcG9ydGluZy1vcmRlcicsICdhcHBXaWRnZXRaZXJvUmVwb3J0aW5nT3JkZXInKTsgLy8g0KDQsNGB0YfRkdGCINC40YLQvtCz0L7QstC+0Lkg0YHRgtC+0LjQvNC+0YHRgtC4INC90YPQu9C10LLQvtC5INC+0YLRh9GR0YLQvdC+0YHRgtC4XHJcbiAgICAgICAgICAgIH0sIDMwMDApO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5hamF4Q29tcGxldGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5sb2FkVUlDb21wb25lbnRzKCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJ1bkZhbmN5Ym94KCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJ1bmlDaGVjaygpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5ydW5QaG9uZUNoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5ydW5Ub29sdGlwc3RlcigpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5ydW5DaGVja0Zvcm0oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9ibG9ja2VkQnlDSURcclxuICAgICAgICAvL2FwcGVuZEFmdGVyXHJcblxyXG4gICAgICAgIGxvYWRVSUNvbXBvbmVudHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXNrSW5wdXQoKTtcclxuICAgICAgICAgICAgdGhpcy5mb3JtVmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5pQ2hlY2soKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWZvcm0tc2VsZWN0JywgJ2FwcFdpZGdldEZvcm1TZWxlY3QnKTsgLy8g0JrQsNGB0YLQvtC80L3Ri9C5INGB0LXQu9C10LrRgiDQutCw0Log0Y3Qu9C10LzQtdC90YIg0YTQvtGA0LzRiywgY9GO0LTQsCDQtNC70Y8g0YLQvtCz0L4g0YfRgtC+0LHRiyBhamF4INC30LDQs9GA0YPQt9C10L3QvdC+0Lkg0YTQvtGA0LzQtSDRgNCw0LHQvtGC0LDQuyDQv9C70LDQs9C40L0gc2VsZWN0MlxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtY3VzdG9tLWZvcm0tZWxlbWVudCcsICdhcHBXaWRnZXRDdXN0b21Gb3JtRWxlbWVudCcpOyAvLyDQutCw0YHRgtC+0LzQuNC30LjRgNC+0LLQsNC90L3Ri9C1INGH0LXQutCx0L7QutGB0Ysg0Lgg0YDQsNC00LjQvtC60L3QvtC/0LrQuFxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIHZhbGlkYXRlT3B0aW9uc0RlZmF1bHQ6IHtcclxuICAgICAgICAgICAgZXJyb3JDbGFzczogJ2Vycm9ydGV4dCcsXHJcbiAgICAgICAgICAgIGVycm9yRWxlbWVudDogJ2ZvbnQnLFxyXG4gICAgICAgICAgICAvL3dyYXBwZXI6ICdwJyxcclxuICAgICAgICAgICAgLy9lcnJvckNvbnRhaW5lcjogJ3AnLFxyXG4gICAgICAgICAgICAvL2Vycm9yTGFiZWxDb250YWluZXI6ICcuZm9ybV9fZXJyb3JzJyxcclxuICAgICAgICAgICAgc2hvd0Vycm9yczogZnVuY3Rpb24gKGVycm9yTWFwLCBlcnJvckxpc3QpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXBsYWNlRXJyb3JMaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBbXTtcclxuICAgICAgICAgICAgICAgIHZhciBmb3JtID0gJCh0aGlzLmN1cnJlbnRGb3JtKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZm9ybS5maW5kKCdpbnB1dFtkYXRhLWVycm9yPVwidHJ1ZVwiXScpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGRbJ21lc3NhZ2UnXSA9ICfQmNC30LLQuNC90LjRgtC1LCDQvdC+INGN0YLQviDQt9Cw0LrRgNGL0YLQvtC1INC80LXRgNC+0L/RgNC40Y/RgtC40LUg0YLQvtC70YzQutC+INC00LvRjyDQs9C10L3QtdGA0LDQu9GM0L3Ri9GFINC00LjRgNC10LrRgtC+0YDQvtCyINC4INGB0L7QsdGB0YLQstC10L3QvdC40LrQvtCyINCx0LjQt9C90LXRgdCwJztcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZFsnZWxlbWVudCddID0gZm9ybS5maW5kKCdpbnB1dFtkYXRhLWVycm9yPVwidHJ1ZVwiXScpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkWydtZXRob2QnXSA9ICdyZXF1aXJlZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvckxpc3QucHVzaChmaWVsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZvcm0uZmluZCgnaW5wdXRbdHlwZT1cImVtYWlsXCJdJykubGVuZ3RoID4gMCAmJiBmb3JtLmZpbmQoJ2lucHV0W3R5cGU9XCJlbWFpbFwiXScpLnZhbCgpICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IC8uK0AuK1xcLi4rL2k7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVtYWlsID0gZm9ybS5maW5kKCdpbnB1dFt0eXBlPVwiZW1haWxcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVnLnRlc3QoZW1haWwpID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkWydtZXNzYWdlJ10gPSAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5IGVtYWlsJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRbJ2VsZW1lbnQnXSA9IGZvcm0uZmluZCgnaW5wdXRbdHlwZT1cImVtYWlsXCJdJylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkWydtZXRob2QnXSA9ICdyZXF1aXJlZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JMaXN0LnB1c2goZmllbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZvcm0uZmluZCgnaW5wdXRbdHlwZT1cInRlbFwiXScpLnZhbCgpICE9PSAndW5kZWZpbmVkJyAmJiBmb3JtLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZWxcIl0nKS52YWwoKS5yZXBsYWNlKC9cXEQvZywgXCJcIikubGVuZ3RoID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGhvbmUgPSBmb3JtLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZWxcIl0nKS52YWwoKS5yZXBsYWNlKC9cXEQvZywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBob25lLmxlbmd0aCA8IDExKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkWydtZXNzYWdlJ10gPSAn0JLQstC10LTQuNGC0LUg0L3QvtC80LXRgCDRgtC10LvQtdGE0L7QvdCwJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRbJ2VsZW1lbnQnXSA9IGZvcm0uZmluZCgnaW5wdXRbdHlwZT1cInRlbFwiXScpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFsnbWV0aG9kJ10gPSAncmVxdWlyZWQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTGlzdC5wdXNoKGZpZWxkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvckxpc3QuZm9yRWFjaChmdW5jdGlvbiAoZXJyT2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoZXJyT2JqLmVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZE5hbWUgPSAkKGVyck9iai5lbGVtZW50KS5kYXRhKCdmaWVsZG5hbWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmllbGROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZE5hbWUgPSAkKGVyck9iai5lbGVtZW50KS5hdHRyKCduYW1lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyck9iai5tZXNzYWdlID0gZXJyT2JqLm1lc3NhZ2UucmVwbGFjZSgnI0ZJRUxEX05BTUUjJywgZmllbGROYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJPYmoubWVzc2FnZS5pbmRleE9mKFwiPGJyLz5cIikgPT0gLTEgJiYgZXJyT2JqLm1lc3NhZ2UuaW5kZXhPZihcIjxicj5cIikgPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyck9iai5tZXNzYWdlID0gZXJyT2JqLm1lc3NhZ2UgKyBcIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VFcnJvckxpc3QucHVzaChlcnJPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JMaXN0ID0gcmVwbGFjZUVycm9yTGlzdDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJCh0aGlzLmN1cnJlbnRGb3JtKS5kYXRhKCdldmVudF9uYW1lX29mX3RoZV9lcnJvcicpLFxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZU9mVGhlU3VibWl0ID0gJCh0aGlzLmN1cnJlbnRGb3JtKS5kYXRhKCdldmVudF9uYW1lX29mX3RoZV9zdWJtaXQnKSxcclxuICAgICAgICAgICAgICAgICAgICBpc1N1Ym1pdHRlZCA9ICQodGhpcy5jdXJyZW50Rm9ybSkuYXR0cignZGF0YS1pcy1jbGljay1zdWJtaXQnKSA9PSAnWScsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3JzSW5GaWVsZHMgPSB0aGlzLmVycm9yTGlzdC5sZW5ndGggPiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbmRFdmVudCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc1N1Ym1pdHRlZCAmJiAhIWV2ZW50TmFtZSAmJiBoYXNFcnJvcnNJbkZpZWxkcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbmRFdmVudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzU3VibWl0dGVkICYmICEhZXZlbnROYW1lT2ZUaGVTdWJtaXQgJiYgIWhhc0Vycm9yc0luRmllbGRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VuZEV2ZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBldmVudE5hbWVPZlRoZVN1Ym1pdDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VuZEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmN1cnJlbnRGb3JtKS5hdHRyKCdkYXRhLWlzLWNsaWNrLXN1Ym1pdCcsICdOJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50KGV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeWFDb3VudGVyMjYwMTYyNDAgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB5YUNvdW50ZXIyNjAxNjI0MC5yZWFjaEdvYWwoZXZlbnROYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2hvd0Vycm9ycygpO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiBmdW5jdGlvbiAoZWxlbWVudCwgZXJyb3JDbGFzcywgdmFsaWRDbGFzcykge1xyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5hZGRDbGFzcygnZm9ybV9faW5wdXQtLWludmFsaWQnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdW5oaWdobGlnaHQ6IGZ1bmN0aW9uIChlbGVtZW50LCBlcnJvckNsYXNzLCB2YWxpZENsYXNzKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0taW52YWxpZCcpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24gKCRlcnJvciwgJGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkZXJyb3JzRGl2ID0gJGVsZW1lbnQucGFyZW50cygnZm9ybScpLmZpbmQoJy5mb3JtX19lcnJvcnMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJGVycm9yc0Rpdi5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVycm9yc0RpdiA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xyXG4gICAgICAgICAgICAgICAgICAgICRlcnJvcnNEaXYuYWRkQ2xhc3MoJ2Zvcm1fX2Vycm9ycycpO1xyXG4gICAgICAgICAgICAgICAgICAgICRlcnJvcnNEaXYucHJlcGVuZFRvKCRlbGVtZW50LnBhcmVudHMoJ2Zvcm0nKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRlcnJvcnNEaXZCbG9jayA9ICRlcnJvcnNEaXYuZmluZCgncCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkZXJyb3JzRGl2QmxvY2subGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRlcnJvcnNEaXZCbG9jayA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAkZXJyb3JzRGl2QmxvY2sucHJlcGVuZFRvKCRlcnJvcnNEaXYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRlcnJvci5hcHBlbmRUbygkZXJyb3JzRGl2QmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdmFsaWRhdGVPcHRpb25zTm9Nc2c6IHtcclxuICAgICAgICAgICAgc2hvd0Vycm9yczogZnVuY3Rpb24gKGVycm9yTWFwLCBlcnJvckxpc3QpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaG93RXJyb3JzKCk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChlbGVtZW50LCBlcnJvckNsYXNzLCB2YWxpZENsYXNzKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFkZENsYXNzKCdmb3JtX19pbnB1dC0taW52YWxpZCcpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1bmhpZ2hsaWdodDogZnVuY3Rpb24gKGVsZW1lbnQsIGVycm9yQ2xhc3MsIHZhbGlkQ2xhc3MpIHtcclxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2lucHV0LS1pbnZhbGlkJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAoJGVycm9yLCAkZWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25DbGlja1N1Ym1pdEJ1dHRvbjogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnZm9ybScpLmF0dHIoJ2RhdGEtaXMtY2xpY2stc3VibWl0JywgJ1knKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSAkKHRoaXMpLmRhdGEoJ2V2ZW50X25hbWVfb2ZfdGhlX2NsaWNrJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoISFldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBHVE1wdXNoRXZlbnQoZXZlbnROYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeWFDb3VudGVyMjYwMTYyNDAgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHlhQ291bnRlcjI2MDE2MjQwLnJlYWNoR29hbChldmVudE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtVmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy90aGlzLmVsZW1lbnQuZmluZCgnZm9ybVtkYXRhLXZhbGlkYXRlPVwidHJ1ZVwiXScpLnZhbGlkYXRlKHRoaXMudmFsaWRhdGVPcHRpb25zRGVmYXVsdCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZW52ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdmb3JtW2RhdGEtdmFsaWRhdGU9XCJ0cnVlXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnZhbGlkYXRlKGVudi52YWxpZGF0ZU9wdGlvbnNEZWZhdWx0KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuZWxlbWVudC5maW5kKCdmb3JtW2RhdGEtdmFsaWRhdGU9XCJ0cnVlXCJdJykpLmZpbmQoJ1t0eXBlPVwic3VibWl0XCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIHRoaXMub25DbGlja1N1Ym1pdEJ1dHRvbik7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIC8vIEB0b2RvOiDQntCx0LXRgdC/0LXRh9C40YLRjCDQutCw0YHRgtC+0LzQvdGL0LUg0YDQsNGB0YjQuNGA0LXQvdC40Y9cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ2Zvcm1bZGF0YS12YWxpZGF0ZT1cInRydWVcIl0nKS5lYWNoKGZ1bmN0aW9uKCBpbmRleCApIHtcclxuICAgICAgICAgICAgICAgIGlmKCEkKHRoaXMpLmRhdGEoJ3ZhbGlkYXRlLW5vbXNnJykpXHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS52YWxpZGF0ZSh0aGlzLnZhbGlkYXRlT3B0aW9uc0RlZmF1bHQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykudmFsaWRhdGUodGhpcy52YWxpZGF0ZU9wdGlvbnNOb01zZyk7XHJcbiAgICAgICAgICAgIH0pOyovXHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICBtYXNrSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy90aGlzLmVsZW1lbnQuZmluZCgnaW5wdXRbdHlwZT10ZWxdJykubm90KCcuZm9ybV9faW5wdXQtLXRlbC1yZXNpemUtbWFzaycpLm1hc2soXCIrOSAoOTk5KSA5OTktOTktOTlcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXRbdHlwZT10ZWxdJykuZm9jdXNpbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmb3JtX19pbnB1dC0taW52YWxpZCcpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRWYWwgPSAkKHRoaXMpLnZhbCgpLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykudmFsKCcrJyArIGN1cnJlbnRWYWwpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS51bm1hc2soKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ2lucHV0W3R5cGU9dGVsXScpLmZvY3Vzb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VmFsID0gJCh0aGlzKS52YWwoKS5yZXBsYWNlKC9cXEQvZywgXCJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRWYWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykudmFsKCcrJyArIGN1cnJlbnRWYWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnZhbChjdXJyZW50VmFsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFZhbC5sZW5ndGggPT09IDExKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5tYXNrKFwiKzkgKDk5OSkgOTk5LTk5LTk5XCIsIHtyZXZlcnNlOiB0cnVlfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRWYWwubGVuZ3RoID09PSAxMikge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykubWFzayhcIis5OSAoOTk5KSA5OTktOTktOTlcIiwge3JldmVyc2U6IHRydWV9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFZhbC5sZW5ndGggPj0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm1hc2soXCIrOTk5ICg5OTkpIDk5OS05OS05OVwiLCB7cmV2ZXJzZTogdHJ1ZX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXRbdHlwZT10ZWxdJykua2V5ZG93bihmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkuc2VhcmNoKC9eW1xcZFxcc1xcLVxcK10rJC8pID09PSAtMSAmJiBldmVudC5rZXkgIT09ICdCYWNrc3BhY2UnICYmIGV2ZW50LmtleSAhPT0gJ0Y1Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFZhbCA9ICQodGhpcykudmFsKCkucmVwbGFjZSgvXFxEL2csIFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkgIT09ICdCYWNrc3BhY2UnICYmIGV2ZW50LmtleSAhPT0gJ0Y1JyAmJiBjdXJyZW50VmFsLmxlbmd0aCA+PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXRbdHlwZT1udW1iZXJdJykua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShlLmtleUNvZGUsIFs0NiwgOCwgOSwgMjcsIDEzLCAxMTAsIDE5MF0pICE9PSAtMSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIChlLmtleUNvZGUgPT09IDY1ICYmIChlLmN0cmxLZXkgPT09IHRydWUgfHwgZS5tZXRhS2V5ID09PSB0cnVlKSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAoZS5rZXlDb2RlID49IDM1ICYmIGUua2V5Q29kZSA8PSA0MCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKGUuc2hpZnRLZXkgfHwgKGUua2V5Q29kZSA8IDQ4IHx8IGUua2V5Q29kZSA+IDU3KSkgJiYgKGUua2V5Q29kZSA8IDk2IHx8IGUua2V5Q29kZSA+IDEwNSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXQuanMtbWFzay1pbm4nKS5tYXNrKFwiOTk5OTk5OTk5OT85OVwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzY3JvbGxJdDogZnVuY3Rpb24gKHRvKSB7XHJcbiAgICAgICAgICAgIHZhciAkc2Nyb2xsVG9FbCA9ICQodG8pO1xyXG4gICAgICAgICAgICBpZiAoJHNjcm9sbFRvRWwubGVuZ3RoIDw9MCB8fCAkc2Nyb2xsVG9FbC5pcyhcIjpoaWRkZW5cIikpIHtcclxuICAgICAgICAgICAgICAgICRzY3JvbGxUb0VsID0gJCgnW2RhdGEtc2Nyb2xsaWQ9Jyt0bysnXScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkc2Nyb2xsVG9FbC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICRzY3JvbGxUb0VsLm9mZnNldCgpLnRvcCAtIDYwXHJcbiAgICAgICAgICAgICAgICB9LCA3NTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3BvdExhbmc6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmkgPSBuZXcgVVJJKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgdmFyIGZzID0gdXJpLnNlZ21lbnQoMCk7XHJcbiAgICAgICAgICAgIHZhciBsYW5nID0gJ3J1JztcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoZnMpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2VuJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3B0JzpcclxuICAgICAgICAgICAgICAgICAgICBsYW5nID0gJ2VuJztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2RlJzpcclxuICAgICAgICAgICAgICAgICAgICBsYW5nID0gJ2RlJztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2ZyJzpcclxuICAgICAgICAgICAgICAgICAgICBsYW5nID0gJ2ZyJztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgbGFuZyA9ICdydSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBsYW5nO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBydW5GYW5jeWJveDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgJC5mYW5jeWJveC5kZWZhdWx0cyA9ICQuZXh0ZW5kKHt9LCAkLmZhbmN5Ym94LmRlZmF1bHRzLCB7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgZml0VG9WaWV3OiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YHQv9C70YvQstCw0Y7RidC40LUg0LzQvtC00LDQu9GM0L3Ri9C1INC+0LrQvdCwXHJcblxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLW1vZGFsJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZGRpbmcgPSAoJCh0aGlzKS5kYXRhKCdwYWRkaW5nJykgPT0gJ04nKSA/IDAgOiAxNSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZSA9ICgkKHRoaXMpID09ICdOJykgPyBmYWxzZSA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3goe1xyXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGhyZWYsXHJcbiAgICAgICAgICAgICAgICAgICAgd3JhcENTUzogJ21vZGFsLXdyYXBwZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogKCQod2luZG93KS53aWR0aCgpID4gOTM3KSA/IDIwIDogNSxcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBwYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQnRuOiBjbG9zZSxcclxuICAgICAgICAgICAgICAgICAgICBoZWxwZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kJzogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YHQv9C70YvQstCw0Y7RidC40LUg0LjQt9C+0LHRgNCw0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWltZy1tb2RhbCcpLmZhbmN5Ym94KHtcclxuICAgICAgICAgICAgICAgIHdyYXBDU1M6ICdpbWctbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgICBtYXJnaW46ICgkKHdpbmRvdykud2lkdGgoKSA+IDkzNykgPyAyMCA6IDUsXHJcbiAgICAgICAgICAgICAgICBmaXRUb1ZpZXc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAxNSxcclxuICAgICAgICAgICAgICAgIGhlbHBlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vINCS0YHQv9C70YvQstCw0Y7RidC40LUg0LjQt9C+0LHRgNCw0LbQtdC90LjRjyDQsdC10Lcg0YHRgdGL0LvQutC4XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmZhbmN5ZnVsbC0taW1hZ2UnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGhyZWYgPSAoJCh0aGlzKS5maW5kKCdkaXYnKS5hdHRyKCdocmVmJykpID8gJCh0aGlzKS5maW5kKCdkaXYnKS5hdHRyKCdocmVmJykgOiAkKHRoaXMpLmZpbmQoJ2ltZycpLmF0dHIoJ3NyYycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8PSA3NjgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBzd3BFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBzd3AnKVswXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlT25TY3JvbGw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZU9uVmVydGljYWxEcmFnOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGluY2hUb0Nsb3NlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzd2lwZUltYWdlID0gaHJlZjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRtcEltZyA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0bXBJbWcuc3JjID0gaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICAkKHRtcEltZykub25lKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmdXaWR0aCA9IHRtcEltZy53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3JnSGVpZ2h0ID0gdG1wSW1nLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzd2lwZUl0ZW1zID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogc3dpcGVJbWFnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3OiBvcmdXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoOiBvcmdIZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnYWxsZXJ5ID0gbmV3IFBob3RvU3dpcGUocHN3cEVsZW1lbnQsIFBob3RvU3dpcGVVSV9EZWZhdWx0LCBzd2lwZUl0ZW1zLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FsbGVyeS5pbml0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYWxsZXJ5Lmxpc3RlbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2dhbGxlcnknKS5yZW1vdmVDbGFzcygncHN3cC0tb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMjAwMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmZhbmN5Ym94KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogaHJlZixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUJ0bjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyYXBDU1M6ICdpbWctZmFuY3lmdWxsLXdyYXBwZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICgkKHdpbmRvdykud2lkdGgoKSA+IDkzNykgPyAyMCA6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpdFRvVmlldzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlbHBlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJTaG93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdpbWcuZmFuY3lib3gtaW1hZ2UnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5mYW5jeWJveC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog0JLRgdC/0LvRi9Cy0LDRjtGJ0LjQtSDQuNC30L7QsdGA0LDQttC10L3QuNGPINC+0YLQt9GL0LLQvtCyINGBINC/0L7QtNC00LXRgNC20LrQvtC5INC90LXRgdC60L7Qu9GM0LrQuNGFINC40LfQvtCx0YDQsNC20LXQvdC40LlcclxuICAgICAgICAgICAgICog0JTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSDQuNC30L7QsdGA0LDQttC10L3QuNGPINCyINGB0LLQvtC50YHRgtCy0LUgZGF0YS1pbWcg0LIg0YTQvtGA0LzQsNGC0LUgSlNPTlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1jbGllbnRzLW1vZGFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHZhciBhSW1ncyA9IG5ldyBBcnJheSxcclxuICAgICAgICAgICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgICAgIGFJbWdzW2ldID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6ICQodGhpcykuYXR0cignaHJlZicpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgnaW1nJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeiBpbiAkKHRoaXMpLmRhdGEoJ2ltZycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFJbWdzW2ldID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogJCh0aGlzKS5kYXRhKCdpbWcnKVt6XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkLmZhbmN5Ym94KGFJbWdzLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyYXBDU1M6ICdpbWctbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogKCQod2luZG93KS53aWR0aCgpID4gOTM3KSA/IDIwIDogNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZml0VG9WaWV3OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVscGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1tb2RhbC1jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guY2xvc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyDQktGL0LfQvtCyINC00YDRg9Cz0L7Qs9C+INCy0YHQv9C70YvQstCw0Y7RidC10LPQviDQuNC30L7QsdGA0LDQttC10L3QuNGPLiDQn9GA0LDQstC40LvQviDQsiDRgdCy0L7QudGB0YLQstC1IGRhdGEtZmFrZS10b1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWltZy1tb2RhbC1mYWtlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICQoJCh0aGlzKS5kYXRhKCdmYWtlLXRvJykpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBydW5Ub29sdGlwc3RlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXRvb2x0aXAnKS50b29sdGlwc3Rlcih7XHJcbiAgICAgICAgICAgICAgICBzaWRlOiBbJ3RvcCddLFxyXG4gICAgICAgICAgICAgICAgdGhlbWU6IFwidG9vbHRpcHN0ZXItbGlnaHRcIixcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRBc0hUTUw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IFwiZmFkZVwiLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0WTogLTIwLFxyXG4gICAgICAgICAgICAgICAgaW50ZXJhY3RpdmU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXRvb2x0aXAtYm90dG9tLXllbGxvdycpLnRvb2x0aXBzdGVyKHtcclxuICAgICAgICAgICAgICAgIHNpZGU6IFsnYm90dG9tJ10sXHJcbiAgICAgICAgICAgICAgICB0aGVtZTogXCJ0b29sdGlwc3Rlci15ZWxsb3ctYmdcIixcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRBc0hUTUw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IFwiZmFkZVwiLFxyXG4gICAgICAgICAgICAgICAgaW50ZXJhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogNjgwLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25Qb3NpdGlvbjogZnVuY3Rpb24gKGluc3RhbmNlLCBoZWxwZXIsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDk4MCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5jb29yZC5sZWZ0ID0gaGVscGVyLmdlby5vcmlnaW4ub2Zmc2V0LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogXCJjdXN0b21cIixcclxuICAgICAgICAgICAgICAgIHRyaWdnZXJPcGVuOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW91c2VlbnRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0YXA6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyQ2xvc2U6IHtcclxuICAgICAgICAgICAgICAgICAgICBtb3VzZWxlYXZlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcuanMtdG9vbHRpcC1ib3R0b20nKS50b29sdGlwc3Rlcih7XHJcbiAgICAgICAgICAgICAgICBzaWRlOiBbJ2JvdHRvbSddLFxyXG4gICAgICAgICAgICAgICAgdGhlbWU6IFwidG9vbHRpcHN0ZXItbGlnaHQgdG9vbHRpcHN0ZXItbGlnaHQtYm9yZGVyLXJhZGl1c1wiLFxyXG4gICAgICAgICAgICAgICAgY29udGVudEFzSFRNTDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJmYWRlXCIsXHJcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiAzMTAsXHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiBcImN1c3RvbVwiLFxyXG4gICAgICAgICAgICAgICAgdHJpZ2dlck9wZW46IHtcclxuICAgICAgICAgICAgICAgICAgICBtb3VzZWVudGVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRyaWdnZXJDbG9zZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vdXNlbGVhdmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFwOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5qcy10b29sdGlwLXBlcnNvbmFsJykudG9vbHRpcHN0ZXIoe1xyXG4gICAgICAgICAgICAgICAgdGhlbWU6ICd0b29sdGlwc3Rlci1saWdodCcsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50Q2xvbmluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNpZGU6ICdib3R0b20nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gNzY4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgndS50b29sdGlwJykudG9vbHRpcHN0ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNpZGU6IFsndG9wJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhlbWU6IFwidG9vbHRpcHN0ZXItbGlnaHRcIixcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50QXNIVE1MOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJmYWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0WTogLTIwLFxyXG4gICAgICAgICAgICAgICAgICAgIGludGVyYWN0aXZlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCd1LnRvb2x0aXAnKS50b29sdGlwc3Rlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgc2lkZTogWyd0b3AnXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGVtZTogXCJ0b29sdGlwc3Rlci1saWdodFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRBc0hUTUw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcImZhZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXRZOiAtMjAsXHJcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2NsaWNrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcnVuaUNoZWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcuanMtaWNoZWNrYm94JykuaUNoZWNrKHtcclxuICAgICAgICAgICAgICAgIGNoZWNrYm94Q2xhc3M6ICdjdXN0b20tY2hlY2tib3gnLFxyXG4gICAgICAgICAgICAgICAgY2hlY2tlZENoZWNrYm94Q2xhc3M6ICdjdXN0b20tY2hlY2tib3gtLWNoZWNrZWQnLFxyXG4gICAgICAgICAgICAgICAgY3Vyc29yOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGZvcm1GaWxlSW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi9ibG9nL1wiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiYVtocmVmKj0nLmRvYyddLGE6bm90KC5wLWluZm8pW2hyZWYqPScucGRmJ10sYVtocmVmKj0nLnhscyddLGFbaHJlZio9Jy5kb2N4J10sYVtocmVmKj0nLnhsc3gnXVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZm9ybUZpbGVDbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi9ibG9nL1wiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiYVtocmVmKj0nLmRvYyddLGE6bm90KC5wLWluZm8pW2hyZWYqPScucGRmJ10sYVtocmVmKj0nLnhscyddLGFbaHJlZio9Jy5kb2N4J10sYVtocmVmKj0nLnhsc3gnXVwiKS5hZGRDbGFzcygnanMtZ2V0LWZvcm0tZmlsZScpO1xyXG4gICAgICAgICAgICAgICAgJChcImFbaHJlZio9Jy5kb2MnXSxhOm5vdCgucC1pbmZvKVtocmVmKj0nLnBkZiddLGFbaHJlZio9Jy54bHMnXSxhW2hyZWYqPScuZG9jeCddLGFbaHJlZio9Jy54bHN4J11cIikuYXR0cignZGF0YS1mb3JtJywgJ3NlbmRfZmlsZScpO1xyXG4gICAgICAgICAgICAgICAgJChcImFbaHJlZio9Jy5kb2MnXSxhOm5vdCgucC1pbmZvKVtocmVmKj0nLnBkZiddLGFbaHJlZio9Jy54bHMnXSxhW2hyZWYqPScuZG9jeCddLGFbaHJlZio9Jy54bHN4J11cIikuYXR0cignZGF0YS1pZCcsICQoJyNibG9kSWQnKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiYVtocmVmKj0nLmRvYyddLGE6bm90KC5wLWluZm8pW2hyZWYqPScucGRmJ10sYVtocmVmKj0nLnhscyddLGFbaHJlZio9Jy5kb2N4J10sYVtocmVmKj0nLnhsc3gnXVwiKS5hdHRyKCdkYXRhLWZpbGUnLCAkKCcjYmxvZGZpbGVJZCcpLnZhbCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJ1bkNoZWNrRm9ybTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgZm9ybVRvQ2hlY2sgPSAkKCdmb3JtW25hbWU9XCJTVUJTQ1JJUFRJT05fQkxPR1wiXScpO1xyXG4gICAgICAgICAgICBpZiAoZm9ybVRvQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIGZvcm1Ub0NoZWNrLmZpbmQoJy5qcy1pY2hlY2tib3gucnVicmljcycpLm9uKCdpZkNsaWNrZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybVRvQ2hlY2suZmluZCgnLmpzLWljaGVja2JveC5ydWJyaWNzJykuaUNoZWNrKCd1bmNoZWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soJ2NoZWNrJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGZvcm1Ub0NoZWNrLmZpbmQoJy5qcy1pY2hlY2tib3guY2l0aWVzJykub24oJ2lmQ2xpY2tlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3JtVG9DaGVjay5maW5kKCcuanMtaWNoZWNrYm94LmNpdGllcycpLmlDaGVjaygndW5jaGVjaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuaUNoZWNrKCdjaGVjaycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0Q2FsbHRyYWNraW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICAgICAgICAgICRyaW5nb1NpZGUgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWMtcmluZ28nKSxcclxuICAgICAgICAgICAgICAgIGN1clN0YXRlID0gJHJpbmdvU2lkZS5maW5kKCcuanMtcmluZ28tc3Vic3RpdHV0aW9uJykuaHRtbCgpLFxyXG4gICAgICAgICAgICAgICAgX2ZTZWxmID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5pdENhbGx0cmFja2luZygpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY3VyU3RhdGUgfHwgY3VyU3RhdGUgPT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm9uKCdET01TdWJ0cmVlTW9kaWZpZWQnLCAnLmpzLWMtcmluZ28nLCBfZlNlbGYpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5vZmYoJ0RPTVN1YnRyZWVNb2RpZmllZCcsICcuanMtYy1yaW5nbycpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5DYWxsVHJhY2tpbmcubnVtYmVyID0gd2luZG93LkNhbGxUcmFja2luZy5udW1iZXIgfHwge307XHJcbiAgICAgICAgICAgICAgICB2YXIgb1Bob25lID0gJHJpbmdvU2lkZS5maW5kKCcuanMtcmluZ28tc3Vic3RpdHV0aW9uJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LkNhbGxUcmFja2luZy5udW1iZXIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5mb3JtYXR0ZWQ6IG9QaG9uZS5kYXRhKCdyaW5nby0tdW5mb3JtYXR0ZWQnKSxcclxuICAgICAgICAgICAgICAgICAgICB3Y29kZTogb1Bob25lLmRhdGEoJ3JpbmdvLS13Y29kZScpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNjb2RlOiBvUGhvbmUuZGF0YSgncmluZ28tLWNjb2RlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWw6IG9QaG9uZS5kYXRhKCdyaW5nby0tbG9jYWwnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5DYWxsVHJhY2tpbmcucmVhZHkgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucnVuUGhvbmVDaGFuZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBydW5QaG9uZUNoYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LkNhbGxUcmFja2luZy5yZWFkeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ2EuanMtc2l0ZS1waG9uZS1hJykuYXR0cigndGl0bGUnLCAnKycgKyB3aW5kb3cuQ2FsbFRyYWNraW5nLm51bWJlci51bmZvcm1hdHRlZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnYS5qcy1zaXRlLXBob25lLWEnKS5hdHRyKCdocmVmJywgJ3RlbDorJyArIHdpbmRvdy5DYWxsVHJhY2tpbmcubnVtYmVyLnVuZm9ybWF0dGVkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcuanMtc2l0ZS1waG9uZS13Y29kZScpLnRleHQod2luZG93LkNhbGxUcmFja2luZy5udW1iZXIud2NvZGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1zaXRlLXBob25lLWNjb2RlJykudGV4dCh3aW5kb3cuQ2FsbFRyYWNraW5nLm51bWJlci5jY29kZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXNpdGUtcGhvbmUtbG9jYWwnKS50ZXh0KHdpbmRvdy5DYWxsVHJhY2tpbmcubnVtYmVyLmxvY2FsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRXaWRnZXRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWhlYWRlci1tZW51JywgJ2FwcFdpZGdldHNTZWFyY2hIZWFkZXInKTtcclxuICAgICAgICAgICAgLy90aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtaGVhZGVyLWZvb3RlcicsICdhcHBXaWRnZXRzTWVudScsIHtteU9wdGlvbjogdHJ1ZX0pO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtcHVzaC1ldmVudCcsICdhcHBXaWRnZXRFdmVudFB1c2gnKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLXRhYnMnLCAnYXBwV2lkZ2V0VGFicycpOyAvLyDQv9C10YDQtdC60LvRjtGH0LXQvdC40LUg0LLQutC70LDQtNC+0LpcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLW92YWwtdGFicycsICdhcHBXaWRnZXRPdmFsVGFicycpOyAvLyDQstC60LvQsNC00LrQuCwg0LrQvtGC0L7RgNGL0LUg0LzQvtCz0YPRgiDRgdC+0LTQtdGA0LbQsNGC0Ywg0LLQvdGD0YLRgNC4INGB0LXQsdGPINC00L7Qv9C+0LvQvdC40YLQtdC70YzQvdGL0LUg0LLQutC70LDQtNC60LhcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLW1lbnUnLCAnYXBwV2lkZ2V0RHJvcGRvd25NZW51Jyk7IC8vINCy0YvQv9Cw0LTQsNGO0YnQtdC1INC80LXQvdGOINC90LUg0LLRi9GF0L7QtNC40YIg0LfQsCDQv9GA0LXQtNC10LvRiyDQvtGB0L3QvtCy0L3QvtCz0L4g0LrQvtC90YLQtdC50L3QtdGA0LA7INC+0YLQutGA0YvRgtC40LUg0LzQvtCx0LjQu9GM0L3QvtCz0L4g0LzQtdC90Y4g0L/QviDQutC70LjQutGDXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1tYWluLXNsaWRlcicsICdhcHBXaWRnZXRNYWluU2xpZGVyJyk7IC8vINCz0LvQsNCy0L3Ri9C5INGB0LvQsNC50LTQtdGAIC0g0Y3RhNGE0LXQutGCIGZhZGVJbi9mYWRlT3V0LCDQvdCw0LLQuNCz0LDRhtC40Y8g0LIg0LLQuNC00LUg0YLQvtGH0LXQulxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtcGF5bWVudC1pbnB1dCcsICdhcHBQYXltZW50SW5wdXQnKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWNsaWVudHMtc2xpZGVyJywgJ2FwcFdpZGdldENsaWVudHNTbGlkZXInKTsgLy8g0YHQu9Cw0LnQtNC10YAg0LvQvtCz0L7RgtC40L/QvtCyINC60LvQuNC10L3RgtC+0LIgLSDRgdGC0LDQvdC00LDRgNGC0L3Ri9C5INGN0YTRhNC10LrRgiBvd2wsINC90LDQstC40LPQsNGG0LjQuCDQvdC10YJcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWltYWdlcy1jYXJvdXNlbCcsICdhcHBXaWRnZXRJbWFnZXNDYXJvdXNlbCcpOyAvLyDQmtCw0YDRg9GB0LXQu9GMINC40LcgNCDQuNC30L7QsdGA0LDQttC10L3QuNC5INC90LAg0LTQtdGB0LrRgtC+0L/QsNGFXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1nZXQtZm9ybScsICdhcHBXaWRnZXRGb3JtR2V0Jyk7IC8vINCy0YvQt9C+0LIg0YTQvtGA0LzRi1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtZ2V0LWV2ZW50LWZvcm0nLCAnYXBwV2lkZ2V0RXZlbnRGb3JtR2V0Jyk7IC8vINCy0YvQt9C+0LIg0YTQvtGA0LzRiyDQnNC10YDQvtC/0YDQuNGP0YLQuNGPXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1nZXQtZm9ybS1maWxlJywgJ2FwcFdpZGdldEZvcm1HZXRGaWxlJyk7IC8vINCy0YvQt9C+0LIg0YTQvtGA0LzRi1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtY29udGVudC1zbGlkZXInLCAnYXBwV2lkZ2V0Q29udGVudFNsaWRlcicpOyAvLyDRgdC70LDQudC00LXRgCDQvtGC0LfRi9Cy0L7QsiAtINGB0YLQsNC90LTQsNGA0YLQvdGL0Lkg0Y3RhNGE0LXQutGCIG93bCwg0L3QsNCy0LjQs9Cw0YbQuNGPIHByZXYvbmV4dFxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtc3luYy1zbGlkZXInLCAnYXBwV2lkZ2V0U3luY1NsaWRlcicpOyAvLyDRgdC70LDQudC00LXRgCDQvtGC0LfRi9Cy0L7QsiAtINGB0YLQsNC90LTQsNGA0YLQvdGL0Lkg0Y3RhNGE0LXQutGCIG93bCwg0L3QsNCy0LjQs9Cw0YbQuNGPIHByZXYvbmV4dFxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtZW1wbG95ZWUtcmV2aWV3cy1zbGlkZXInLCAnYXBwV2lkZ2V0RW1wbG95ZWVSZXZpZXdzU2xpZGVyJyk7IC8vINGB0LvQsNC50LTQtdGAINC+0YLQt9GL0LLQvtCyINGB0L7RgtGA0YPQtNC90LjQutC+0LIgLSDQsdC10Lcg0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60L7QuSDQv9GA0L7QutGA0YPRgtC60LgsINC90LDQstC40LPQsNGG0LjRjyBwcmV2L25leHRcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLXNsaWRlcicsICdhcHBXaWRnZXRTbGlkZXInKTsgLy8g0YHQu9Cw0LnQtNC10YAg0LzQvtCx0LjQu9GM0L3Ri9GFINC/0YDQuNC70L7QttC10L3QuNC5INCyINC/0L7QtNCy0LDQu9C1IC3RjdGE0YTQtdC60YIgZmFkZUluL2ZhZGVPdXQsINC90LDQstC40LPQsNGG0LjQuCDQvdC10YJcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWRvdHRlZC1uYXYtc2xpZGVyJywgJ2FwcFdpZGdldERvdHRlZE5hdlNsaWRlcicpOyAvLyDRgdC70LDQudC00LXRgC3QutCw0YDRg9GB0LXQu9GMINGBINC90LDQstC40LPQsNGG0LjQtdC5INCyINCy0LjQtNC1INGC0L7Rh9C10LpcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWRvdHRlZC1uYXYtc2xpZGVyLW5vLWF1dG8nLCAnYXBwV2lkZ2V0RG90dGVkTmF2U2xpZGVyTm9BdXRvJyk7IC8vINGB0LvQsNC50LTQtdGALdC60LDRgNGD0YHQtdC70Ywg0YEg0L3QsNCy0LjQs9Cw0YbQuNC10Lkg0LIg0LLQuNC00LUg0YLQvtGH0LXQuiDQsdC10Lcg0LDQstGC0L7Qv9GA0L7QutGA0YPRgtC60LhcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWxhbmd1YWdlcy1zd2l0Y2gnLCAnYXBwV2lkZ2V0TGFuZ3VhZ2VzU3dpdGNoJyk7IC8vINC40LfQvNC10L3QtdC90LjQtSDRhNC+0L3QsCDQs9C70LDQstC90L7Qs9C+INGB0LvQsNC50LTQtdGA0LAg0L/RgNC4INC/0LXRgNC10LrQu9GO0YfQtdC90LjQuCDRj9C30YvQutC+0LJcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLXNob3ctaW5mbycsICdhcHBXaWRnZXRTaG93SW5mbycpOyAvLyDQv9C+0LrQsNC3INGB0LrRgNGL0YLQvtC5INC40L3RhNC+0YDQvNCw0YbQuNC4INC/0L4g0LrQu9C40LrRgyDQvdCwINGN0LvQtdC80LXQvdGCXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1lcXVhbC1oZWlnaHQtYmxvY2tzJywgJ2FwcFdpZGdldEVxdWFsSGVpZ2h0QmxvY2tzJyk7IC8vINCx0LvQvtC60Lgg0L7QtNC40L3QsNC60L7QstC+0Lkg0LLRi9GB0L7RgtGLXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1zY3JvbGwtdG8nLCAnYXBwV2lkZ2V0U2Nyb2xsVG8nKTsgLy8g0YHQutGA0L7Qu9C7INC6INC+0L/RgNC10LTQtdC70LXQvdC90L7QuSDRh9Cw0YHRgtC4INGB0YLRgNCw0L3QuNGG0Ysg0L/QviDQutC70LjQutGDINC90LAg0Y3Qu9C10LzQtdC90YJcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWFjY29yZGlvbicsICdhcHBXaWRnZXRBY2NvcmRpb24nKTsgLy8g0LrQvtC80L/QvtC90LXQvdGCIFwi0LDQutC60L7RgNC00LXQvtC9XCJcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLXNlbGVjdCcsICdhcHBXaWRnZXRDdXN0b21TZWxlY3QnKTsgLy8g0LrQsNGB0YLQvtC80LjQt9C40YDQvtCy0LDQvdC90YvQuSBzZWxlY3RcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWNvc3QtY2FsY3VsYXRvcicsICdhcHBXaWRnZXRDb3N0Q2FsY3VsYXRvcicpOyAvLyDQutCw0LvRjNC60YPQu9GP0YLQvtGAINGB0YLQvtC40LzQvtGB0YLQuCDQsdGD0YXQs9Cw0LvRgtC10YDRgdC60LjRhSDRg9GB0LvRg9CzXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1vZmYtY2FudmFzLW1vYmlsZScsICdhcHBXaWRnZXRPZmZDYW52YXNNb2JpbGUnKTsgLy8gb2ZmY2FudmFzINC80LXQvdGOINC00LvRjyDQvNC+0LHQuNC70YzQvdGL0YVcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWZpbHRlcicsICdhcHBXaWRnZXRGaWx0ZXInKTsgLy8g0YTQuNC70YzRgtGA0LDRhtC40Y8g0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1zaG93LW1vcmUnLCAnYXBwV2lkZ2V0U2hvd01vcmUnKTsgLy8g0LrQvdC+0L/QutCwIFwi0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0ZFcIlxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtY2xpZW50cy1maWx0ZXInLCAnYXBwV2lkZ2V0Q2xpZW50c0ZpbHRlcicpOyAvLyDQkdC70L7QuiDQstC60LvQsNC00L7QuiDRgSDQutC70LjQtdC90YLQsNC80LhcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLW1hcCcsICdhcHBXaWRnZXRNYXAnKTsgLy8g0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8geWFuZGV4INC60LDRgNGC0YtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWNoYW5nZWFibGUtY29udGFjdHMnLCAnYXBwV2lkZ2V0Q2hhbmdlYWJsZUNvbnRhY3RzJyk7IC8vINC40LfQvNC10L3Rj9C10LzRi9C1INC60L7QvdGC0LDQutGC0Ysg0L/QviDRgdC10LvQtdC60YLRg1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtcHJpbnQnLCAnYXBwV2lkZ2V0UHJpbnQnKTsgLy8g0LrQsNGB0YLQvtC80L3QsNGPINC/0LXRh9Cw0YLRjFxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtYmFjay10by10b3AnLCAnYXBwV2lkZ2V0QmFja1RvVG9wJyk7IC8vINC60L3QvtC/0LrQsCBcItCd0LDQstC10YDRhVwiXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1uZXdzLWFyY2hpdmUnLCAnYXBwV2lkZ2V0TmV3c0FyY2hpdmUnKTsgLy8g0KTQuNC70YzRgtCw0YbQuNGPINC90L7QstC+0YHRgtC10LlcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWZvcm0nLCAnYXBwV2lkZ2V0Rm9ybUR1bW15Jyk7IC8vINC+0YLQstC10YIg0YTQvtGA0LzRiyDQv9GA0Lgg0YPRgdC/0LXRiNC90L7QuSDQvtGC0L/RgNCw0LLQutC1ICjQt9Cw0LPQu9GD0YjQutCwLCDQvtGC0LrQu9GO0YfQuNGC0Ywg0LIg0LTQsNC70YzQvdC10LnRiNC10LwpXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1zbGlkZXItZm9ybScsICdhcHBXaWRnZXRTbGlkZXJGb3JtJyk7IC8vINC+0YLQstC10YIg0YTQvtGA0LzRiyDQv9GA0Lgg0YPRgdC/0LXRiNC90L7QuSDQvtGC0L/RgNCw0LLQutC1ICjQt9Cw0LPQu9GD0YjQutCwLCDQvtGC0LrQu9GO0YfQuNGC0Ywg0LIg0LTQsNC70YzQvdC10LnRiNC10LwpXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1mb3JtLWFqYXgnLCAnYXBwV2lkZ2V0Rm9ybUFqYXgnKTsgLy8g0L7QsdGA0LDQsdC+0YLRh9C40LogYWpheCDRhNC+0YDQvFxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtZm9ybS1kZWZhdWx0JywgJ2FwcFdpZGdldEZvcm1EZWZhdWx0Jyk7IC8vINC+0LHRgNCw0LHQvtGC0YfQuNC6IGFqYXgg0YTQvtGA0Lwg0LHQtdC3INC+0YLQv9GA0LDQstC60Lgg0LIg0JrQmNChXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1ldmVudC1mb3JtLWFqYXgnLCAnYXBwV2lkZ2V0RXZlbnRGb3JtQWpheCcpOyAvLyDQvtCx0YDQsNCx0L7RgtGH0LjQuiBhamF4INGE0L7RgNC8INC00LvRjyDQnNC10YDQvtC/0YDQuNGP0YLQuNC5XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1wb2xsLWZvcm0nLCAnYXBwV2lkZ2V0Rm9ybVBvbGwnKTsgLy8g0L7QsdGA0LDQsdC+0YLRh9C40Log0YTQvtGA0Lwg0LPQvtC70L7RgdC+0LLQsNC90LjQuVxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtYmFubmVyLWxhenknLCAnYXBwV2lkZ2V0QmFubmVyTGF6eUxvYWQnKTsgLy8g0JvQtdC90LjQstCw0Y8g0LfQsNCz0YDRg9C30LrQsCDQsdCw0L3QvdC10YDQvtCyXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1ldmVudC1sYXp5JywgJ2FwcFdpZGdldEV2ZW50TGF6eUxvYWQnKTsgLy8g0JvQtdC90LjQstCw0Y8g0LfQsNCz0YDRg9C30LrQsCDQnNC10YDQvtC/0YDQuNGP0YLQuNGPXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1ibG9nLWFyY2hpdmUnLCAnYXBwV2lkZ2V0QmxvZ0FyY2hpdmUnKTsgLy8g0KTQuNC70YzRgtCw0YbQuNGPINCx0LvQvtCz0LBcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWJsb2ctdGFncycsICdhcHBXaWRnZXRCbG9nVGFncycpOyAvLyDQotC10LPQuCDQsdC70L7Qs9CwXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1sYXp5LWxvYWQnLCAnYXBwV2lkZ2V0TGF6eUxvYWQnKTsgLy8g0KLQtdCz0Lgg0LHQu9C+0LPQsFxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtdGF4LXBvcnRmb2xpbycsICdhcHBQYWdpbmF0aW9uUG9ydGZvbGlvJyk7IC8vINCf0L7RgdGC0YDQsNC90LjRh9C60LAg0LTQu9GPINCf0L7RgNGC0YTQvtC70LjQviDQvdCw0LvQvtCz0L7QstGL0YUg0L/RgNC+0LXQutGC0L7QslxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtbG9uZy10YWJsZScsICdhcHBXaWRnZXRMb25nVGFibGUnKTsgLy8g0KLQsNCx0LvQuNGG0LAg0YEg0L/RgNC40LvQuNC/0LDRjtGJ0LXQuSDQv9GA0Lgg0YHQutGA0L7Qu9C70LUg0YjQsNC/0LrQvtC5XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy16ZXJvLXJlcG9ydGluZy10ZXN0JywgJ2FwcFdpZGdldFplcm9SZXBvcnRpbmdUZXN0Jyk7IC8vINCi0LXRgdGCINC00LvRjyDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC90YPQu9C10LLQvtC5INC+0YLRh9GR0YLQvdC+0YHRgtC4XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy16ZXJvLXJlcG9ydGluZy1wYXltZW50JywgJ2FwcFdpZGdldFplcm9SZXBvcnRpbmdQYXltZW50Jyk7IC8vINCe0L3Qu9Cw0LnQvSDQvtC/0LvQsNGC0LAg0L3Rg9C70LXQstC+0Lkg0L7RgtGH0ZHRgtC90L7RgdGC0LhcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWZvcm0tYWpheC1wYXltZW50JywgJ2FwcFBheW1lbnRGb3JtQWpheCcpO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtemVyby10eXBlLWZvcm0nLCAnYXBwUGF5bWVudEZvcm1aZXJvVHlwZScpO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtemVyby10eXBlLWZvcm0tcHJvcHMtc2V0dGVyJywgJ2FwcFBheW1lbnRGb3JtWmVyb1Byb3BzU2V0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy16ZXJvLWNvbnRhY3QtZm9ybScsICdhcHBQYXltZW50Rm9ybVplcm9Db250YWN0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1wYXltZW50LWlucHV0LXplcm8tcmVwb3J0JywgJ2FwcFBheW1lbnRaZXJvUmVwb3J0SW5wdXQnKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWV2ZW50cy1hcmNoaXZlJywgJ2FwcFdpZGdldEV2ZW50c0FyY2hpdmUnKTsgLy8g0KTQuNC70YzRgmjQsNGG0LjRjyDQsdC70L7Qs9CwXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1jaGFuZ2VzLWNvbnRyb2wnLCAnYXBwV2lkZ2V0Q2hhbmdlcycpOyAvLyDQpNC40LvRjNGC0YDQsNGG0LjRjyBcItCY0LfQvNC10L3QtdC90LjQuSDQsiDQt9Cw0LrQvtC90L7QtNCw0YLQtdC70YzRgdGC0LLQtVwiXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1tb2JpbGUtYXBwLXRhYnMnLCAnYXBwV2lkZ2V0TW9iaWxlQXBwVGFicycpOyAvLyDQktC60LvQsNC00LrQuCDQvNC+0LHQuNC70YzQvdC+0LPQviDQv9GA0LjQu9C+0LbQtdC90LjRj1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtc3Vic2NyaWJlLXBvcHVwJywgJ2FwcFN1YnNjcmliZVBvcHVwJyk7IC8vINCf0L7QtNC/0LjRgdC60LAg0LLQviDQstGB0L/Qu9GL0LLQsNGO0YnQtdC8INC+0LrQvdC1XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy10ZXN0LWNvbGxlY3QtZm9ybScsICdhcHBXaWRnZXRGb3JtVGVzdENvbGxlY3QnKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWxhenlsb2FkJywgJ2FwcFdpZGdldE5ld0xhenlMb2FkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1zaG93LXNlYXJjaC1mb3JtJywgJ2FwcFdpZGdldFNob3dTZWFyY2hGb3JtJyk7IC8vINCf0L7QutCw0LfQsNGC0Ywg0YTQvtGA0LzRgyDQv9C+0LjRgdC60LAg0LIg0YjQsNC/0LrQtVxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtZmxpcC1jYXJkJywgJ2FwcFdpZGdldEZsaXBDYXJkJyk7IC8v0J/QtdGA0LXQstC+0YDQvtGCINC60LDRgNGC0LjQvdC+0LosXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1zdWJzY3JpYmUtZm9ybScsICdhcHBXaWRnZXRGb3JtU3Vic2NyaWJlJyk7IC8vINC+0LHRgNCw0LHQvtGC0YfQuNC6INGE0L7RgNC8INC/0L7QtNC/0LjRgdC60LhcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWltYWdlLXpvb20tY29udGFpbmVyJywgJ2FwcEltYWdlWm9vbScpOyAvLyB6b29tINC00LvRjyDQuNC30L7QsdGA0LDQttC10L3QuNC5INC40L3RgdGC0YDRg9C60YbQuNC4XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1wdXNoLXF1aXotZXZlbnRzJywgJ2FwcFdpZGdldFF1aXpFdmVudHMnKTsgLy8g0KHQsdC+0YAg0Lgg0L7RgtC/0YDQsNCy0LrQsCDRgdC+0LHRi9GC0LjQuSDQsdC70L7QutCwINCa0LLQuNC3XHJcblxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCcuanMtcGFydG5lcnMtY2Fyb3VzZWwnLCAnYXBwV2lkZ2V0UGFydG5lcnNDYXJvdXNlbCcpOyAvLyDQmtCw0YDRg9GB0LXQu9GMIFwi0J3QsNGI0Lgg0L/QsNGA0YLQvdC10YDRi1wiXHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1wYXJ0bmVycy1jYXJvdXNlbC1uYXYnLCAnYXBwV2lkZ2V0UGFydG5lcnNDYXJvdXNlbE5hdicpOyAvLyDQmtCw0YDRg9GB0LXQu9GMIFwi0J3QsNGI0Lgg0L/QsNGA0YLQvdC10YDRi1wiINGBINC90LDQstC40LPQsNGG0LjQtdC5XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1hY2NvdW50aW5nLWNhbGMnLCAnYXBwV2lkZ2V0QWNjb3VudGluZ0NhbGN1bGF0b3InKTsgLy8g0JrQsNC70YzQutGD0LvRj9GC0L7RgCDRgdGC0L7QuNC80L7RgdGC0Lgg0YPRgdC70YPQs1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLXBhcnRuZXJzLWNhcm91c2VsLW1vYicsICdhcHBXaWRnZXRQYXJ0bmVyc0Nhcm91c2VsTW9iJyk7IC8vINCa0LDRgNGD0YHQtdC70YwgXCLQndCw0YjQuCDQv9Cw0YDRgtC90LXRgNGLINC80L7QsdC40LvQutCwXCJcclxuICAgICAgICAgICAgdGhpcy5pbnN0YWxsQ29udHJvbGxlcignLmpzLWJ1cmdlci1tb2JpbGUnLCAnYXBwV2lkZ2V0QnVyZ2VyTW9iaWxlJyk7IC8vINCe0LHRgNCw0LHQvtGC0YfQuNC6INC90L7QstC+0LPQviDQvNC+0LHQuNC70YzQvdC+0LPQviDQvNC10L3RjlxyXG4gICAgICAgICAgICB0aGlzLmluc3RhbGxDb250cm9sbGVyKCdwLmFjY29yZGlvbicsICdhcHBXaWRnZXRCbG9nQWNjb3JkaW9uJyk7IC8vINCe0LHRgNCw0LHQvtGC0YfQuNC6INC90L7QstC+0LPQviDQvNC+0LHQuNC70YzQvdC+0LPQviDQvNC10L3RjlxyXG5cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuYXBwbGljYXRpb24gPSBuZXcgQXBwbGljYXRpb24oJ2JvZHknKTtcclxuICAgICAgICB3aW5kb3cuYXBwbGljYXRpb24uYm9vdHN0cmFwKCk7XHJcbiAgICB9KTtcclxuXHJcbn0oalF1ZXJ5KSk7XHJcbiIsImZ1bmN0aW9uIEdUTXB1c2hFdmVudChldmVudCwgZXZlbnRDYXRlZ29yeSA9ICcnLCBldmVudExhYmVsID0gJycpIHtcclxuXHJcbiAgICBpZiAodHlwZW9mIGRhdGFMYXllciA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2RhdGFMYXllciBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGV2ZW50LCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnksICdldmVudExhYmVsJzogZXZlbnRMYWJlbH0pO1xyXG5cclxuICAgIGNvbnNvbGUuaW5mbygnR1RNcHVzaEV2ZW50OiAnICsgZXZlbnQgKyAnLCBHVE1wdXNoQ2F0ZWdvcnk6ICcgKyBldmVudENhdGVnb3J5ICsgJywgR1RNcHVzaExhYmVsOiAnICsgZXZlbnRMYWJlbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEdUTXB1c2hFdmVudExvYWRGb3JtKGZvcm1fbmFtZSwgZXZlbnRDYXRlZ29yeSA9ICcnKSB7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBkYXRhTGF5ZXIgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdkYXRhTGF5ZXIgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0NPTlRBQ1RfVVNfRk9STScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ01haW5Gb3JtTG9hZCd9KTtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0Zvcm1fTWFpbl9PcGVuJywgJ2V2ZW50Q2F0ZWdvcnknOiAnRm9ybV9NYWluJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0Zvcm1fTWFpbl9Gb3JlaWduJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnTWFpbkZvcm1Mb2FkJ30pO1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9NYWluX0ZvcmVpZ25fT3BlbicsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fTWFpbl9Gb3JlaWduJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0ZPUk1fVVBSQVZMRU5LQScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0Zvcm1fVXByYXZsZW5rYV9BY2Nlc3NfT3BlbicsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fVXByYXZsZW5rYV9BY2Nlc3MnfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnQ09OVEFDVF9VU19BQ0NPVU5USU5HX01PQklMRV9GT1JNJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9CU19vdXRzb3VyY2luZ19Nb2JpbGVfT3BlbicsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fQlNfb3V0c291cmNpbmdfbW9iaWxlJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0NPTlRBQ1RfVVNfT1VUU09VUkNJTkdfRk9STScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ01haW5Gb3JtTG9hZCd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdDQUxMQkFDS19GT1JNJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnMUNXQUNhbGxiYWNrRm9ybUxvYWQnfSk7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX0NhbGxiYWNrX0xvbmdfT3BlbicsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fQ2FsbGJhY2tfTG9uZyd9KTtcclxuICAgIH1cclxuXHJcblx0aWYgKGZvcm1fbmFtZSA9PSAnQ0FMTEJBQ0tfRk9STV9TSE9SVCcpIHtcclxuXHRcdGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnMUNXQUNhbGxiYWNrRm9ybUxvYWQnfSk7XHJcblx0XHRkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0Zvcm1fQ2FsbGJhY2tfU2hvcnRfT3BlbicsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fQ2FsbGJhY2tfU2hvcnQnfSk7XHJcblx0fVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0NBTExCQUNLX0ZPUk1fQkFTQScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0Zvcm1fUHJvdmVyaW1fQmF6dV9PcGVuJywgJ2V2ZW50Q2F0ZWdvcnknOiAnRm9ybV9Qcm92ZXJpbV9CYXp1J30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ1NFTkRfVkNBUkRfRk9STScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0Zvcm1CdXNpbmVzc2NhcmRFbWFpbExvYWQnfSk7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX1Zpc2l0a2FfT3BlbicsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fVmlzaXRrYSd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdCUkVBS0ZBU1RfSU5WSVRFX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdnZXRJbnZpdGF0aW9uJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0JVU0lORVNTX0NMVUJfVU5JQ1JFRElUX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdnZXRJbnZpdGF0aW9uJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0NsdWJfRElSRUNUT1InKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdnZXRJbnZpdGF0aW9uJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ1pFUk9fQ09OVEFDVF9GT1JNJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnTnVsbEZvcm1Mb2FkJ30pO1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9OdWxldmthX09wZW4nLCAnZXZlbnRDYXRlZ29yeSc6ICdGb3JtX051bGV2a2EnfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnUEFZTUVOVF9GT1JNJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnTnVsbEZvcm1CdXlMb2FkJ30pO1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9QYXlfQnlfQ2FyZF9PcGVuJywgJ2V2ZW50Q2F0ZWdvcnknOiAnRm9ybV9QYXlfQnlfQ2FyZCd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdQT1BVUF9TVUJTQ1JJUFRJT04nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdJbmZvU3Vic2NyaXB0aW9uUG9wdXBMb2FkJ30pO1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9CbG9nX1N1YnNjcmlwdGlvbl9PcGVuJywgJ2V2ZW50Q2F0ZWdvcnknOiAnRm9ybV9CbG9nX1N1YnNjcmlwdGlvbid9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdQT1BVUF9TSU1QTFlfU1VCU0NSSVBUSU9OJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9TZW5kX0ZpbGVfT3BlbicsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fU2VuZF9GaWxlJ30pO1xyXG4gICAgfVxyXG5cclxuXHRpZiAoZm9ybV9uYW1lID09ICdmaW5hbmNlX2NhbGxiYWNrJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9GUk1fT3BlbicsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fRlJNJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0ZPUk1fUEFZUk9MTCcpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ1BheXJvbGxfUXVpel9EZW1vX0Zvcm1fT3BlbicsICdldmVudENhdGVnb3J5JzogJ1BheXJvbGxfUXVpeid9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmluZm8oJ0dUTXB1c2hFdmVudExvYWRGb3JtOiAnICsgZm9ybV9uYW1lKTtcclxufVxyXG5cclxuZnVuY3Rpb24gR1RNcHVzaEV2ZW50U2VuZEZvcm0oZm9ybV9uYW1lLCBldmVudENhdGVnb3J5ID0gJycpIHtcclxuXHJcbiAgICBpZiAodHlwZW9mIGRhdGFMYXllciA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2RhdGFMYXllciBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnRk9STV9VUFJBVkxFTktBJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9VcHJhdmxlbmthX0FjY2Vzc19TZW50JywgJ2V2ZW50Q2F0ZWdvcnknOiAnRm9ybV9VcHJhdmxlbmthX0FjY2Vzcyd9KTtcclxuICAgIH1cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0Zvcm1fVXByYXZsZW5rYV9Nb2JpbGUnKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX1VwcmF2bGVua2FfTW9iaWxlX1NlbnQnLCAnZXZlbnRDYXRlZ29yeSc6ICdGb3JtX1VwcmF2bGVua2FfTW9iaWxlJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0ZPUk1fUEFZUk9MTCcpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ1BheXJvbGxfUXVpel9EZW1vX0Zvcm1fU2VudCcsICdldmVudENhdGVnb3J5JzogJ1BheXJvbGxfUXVpeid9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdDQUxMQkFDS19GT1JNX0JBU0EnKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX1Byb3ZlcmltX0JhenVfU2VudCcsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fUHJvdmVyaW1fQmF6dSd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdDT05UQUNUX1VTX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdNYWluRm9ybVNlbnQnfSk7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX01haW5fU2VudCcsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fTWFpbid9KTtcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09ICcvb3V0c291cmNpbmcvJykge1xyXG4gICAgICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0FjY291bnRpZzFfUXVpel9NYWluX0Zvcm1fU2VudCcsICdldmVudENhdGVnb3J5JzogJ0FjY291bnRpZzFfUXVpeid9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PSAnL3BheXJvbGwvJykge1xyXG4gICAgICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ1BheXJvbGxfUXVpel9NYWluX0Zvcm1fU2VudCcsICdldmVudENhdGVnb3J5JzogJ1BheXJvbGxfUXVpeid9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnRm9ybV9NYWluX0ZvcmVpZ24nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdNYWluRm9ybVNlbnQnfSk7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX01haW5fRm9yZWlnbl9TZW50JywgJ2V2ZW50Q2F0ZWdvcnknOiAnRm9ybV9NYWluX0ZvcmVpZ24nfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnQ09OVEFDVF9VU19BQ0NPVU5USU5HX0NBTENfRk9STScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7XHJcbiAgICAgICAgICAgICdldmVudCc6ICdGb3JtX0FjY291bnRpbmdfQ2FsY3VsYXRvcl9FeHRlbmRlZF9TZW50JyxcclxuICAgICAgICAgICAgJ2V2ZW50Q2F0ZWdvcnknOiBldmVudENhdGVnb3J5LFxyXG4gICAgICAgICAgICAnZXZlbnRMYWJlbCc6ICdGb3JtX0FjY291bnRpbmdfQ2FsY3VsYXRvcl9FeHRlbmRlZCdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdDT05UQUNUX1VTX0FDQ09VTlRJTkdfTU9CSUxFX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX0JTX291dHNvdXJjaW5nX01vYmlsZV9TZW50JywgJ2V2ZW50Q2F0ZWdvcnknOiAnRm9ybV9CU19vdXRzb3VyY2luZ19tb2JpbGUnfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnQ09OVEFDVF9VU19PVVRTT1VSQ0lOR19GT1JNJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnTWFpbkZvcm1TZW50J30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0NBTExCQUNLX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICcxQ1dBQ2FsbGJhY2tGb3JtU2VudCd9KTtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0Zvcm1fQ2FsbGJhY2tfTG9uZ19TZW50JywgJ2V2ZW50Q2F0ZWdvcnknOiAnRm9ybV9DYWxsYmFja19Mb25nJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0NBTExCQUNLX0ZPUk1fU0hPUlQnKSB7XHJcblx0XHRkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJzFDV0FDYWxsYmFja0Zvcm1TZW50J30pO1xyXG5cdFx0ZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX0NhbGxiYWNrX1Nob3J0X1NlbnQnLCAnZXZlbnRDYXRlZ29yeSc6ICdGb3JtX0NhbGxiYWNrX1Nob3J0J30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ1NFTkRfVkNBUkRfRk9STScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0Zvcm1CdXNpbmVzc2NhcmRFbWFpbFNlbnQnfSk7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX1Zpc2l0a2FfU2VudCcsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fVmlzaXRrYSd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdCUkVBS0ZBU1RfSU5WSVRFX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdidXNpbmVzc0JicmVha2Zhc3QnfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnQlVTSU5FU1NfQ0xVQl9VTklDUkVESVRfRk9STScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ2J1c2luZXNzQmJyZWFrZmFzdCd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdDbHViX0RJUkVDVE9SJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnYnVzaW5lc3NCcmVha2Zhc3QnfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnWkVST19DT05UQUNUX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdOdWxsRm9ybVNlbnQnfSk7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX051bGV2a2FfU2VudCcsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fTnVsZXZrYSd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdmaW5hbmNlX2NhbGxiYWNrJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9GUk1fU2VudCcsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fRlJNJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ1BheXJvbGxfUXVpel9DYWxjdWxhdG9yJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnUGF5cm9sbF9RdWl6X0NhbGN1bGF0b3JfU2VudCcsICdldmVudENhdGVnb3J5JzogZXZlbnRDYXRlZ29yeX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ1BheXJvbGxfUXVpel9SZWNvdW50X0Zvcm0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdQYXlyb2xsX1F1aXpfUmVjb3VudF9Gb3JtX1NlbnQnLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdQQVlNRU5UX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdOdWxsRm9ybUJ1eVNlbnQnfSk7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX1BheV9CeV9DYXJkX1NlbnQnLCAnZXZlbnRDYXRlZ29yeSc6ICdGb3JtX1BheV9CeV9DYXJkJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ1BPUFVQX1NVQlNDUklQVElPTicpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0luZm9TdWJzY3JpcHRpb25Qb3B1cFNlbnQnfSk7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtX0Jsb2dfU3Vic2NyaXB0aW9uX1NlbnQnLCAnZXZlbnRDYXRlZ29yeSc6ICdGb3JtX0Jsb2dfU3Vic2NyaXB0aW9uJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ1BBUlRORVJfU1BFQ0lBTCcpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ1BhcnRuZXJTcGVjaWFsU2VudCd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdQT1BVUF9TSU1QTFlfU1VCU0NSSVBUSU9OJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnRm9ybV9TZW5kX0ZpbGVfU2VudCcsICdldmVudENhdGVnb3J5JzogJ0Zvcm1fU2VuZF9GaWxlJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUuaW5mbygnR1RNcHVzaEV2ZW50U2VuZEZvcm06ICcgKyBmb3JtX25hbWUgKyAnLCBHVE1wdXNoQ2F0ZWdvcnk6ICcgKyBldmVudENhdGVnb3J5KTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIEdUTXB1c2hFdmVudFRvdWNoRm9ybShmb3JtX25hbWUsIGV2ZW50Q2F0ZWdvcnkgPSAnJywgZmllbGRfbmFtZSA9ICcnKSB7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBkYXRhTGF5ZXIgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdkYXRhTGF5ZXIgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0NPTlRBQ1RfVVNfQUNDT1VOVElOR19DQUxDX0ZPUk0nKSB7XHJcbiAgICAgICAgZXZlbnRDYXRlZ29yeSA9ICdGb3JtX0FjY291bnRpbmdfQ2FsY3VsYXRvcl9FeHRlbmRlZCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnQ0FMTEJBQ0tfRk9STV9CQVNBJykge1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnkgPSAnRm9ybV9Qcm92ZXJpbV9CYXp1JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdmaW5hbmNlX2NhbGxiYWNrJykge1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnkgPSAnRm9ybV9GUk0nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0ZPUk1fVVBSQVZMRU5LQScpIHtcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fVXByYXZsZW5rYV9BY2Nlc3MnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ0Zvcm1fVXByYXZsZW5rYV9Nb2JpbGUnKSB7XHJcbiAgICAgICAgZXZlbnRDYXRlZ29yeSA9ICdGb3JtX1VwcmF2bGVua2FfTW9iaWxlJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdDT05UQUNUX1VTX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdNYWluRm9ybUJlZ2luRmlsbGluZyd9KTtcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fTWFpbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnRm9ybV9NYWluX0ZvcmVpZ24nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdNYWluRm9ybUJlZ2luRmlsbGluZyd9KTtcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fTWFpbl9Gb3JlaWduJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdDT05UQUNUX1VTX09VVFNPVVJDSU5HX0ZPUk0nKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdNYWluRm9ybUJlZ2luRmlsbGluZyd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdDT05UQUNUX1VTX0FDQ09VTlRJTkdfTU9CSUxFX0ZPUk0nKSB7XHJcbiAgICAgICAgZXZlbnRDYXRlZ29yeSA9ICdGb3JtX0JTX291dHNvdXJjaW5nX21vYmlsZSc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnQ0FMTEJBQ0tfRk9STScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJzFDV0FDYWxsYmFja0JlZ2luRmlsbGluZyd9KTtcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fQ2FsbGJhY2tfTG9uZyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnQ0FMTEJBQ0tfRk9STV9TSE9SVCcpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJzFDV0FDYWxsYmFja0JlZ2luRmlsbGluZyd9KTtcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fQ2FsbGJhY2tfU2hvcnQnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmb3JtX25hbWUgPT0gJ1NFTkRfVkNBUkRfRk9STScpIHtcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fVmlzaXRrYSc7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdGb3JtQnVzaW5lc3NjYXJkRW1haWxCZWdpbkZpbGxpbmcnfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnQlJFQUtGQVNUX0lOVklURV9GT1JNJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnQnVpc25lc3NCcmVha2Zhc3RCZWdpbkZpbGxpbmcnfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnWkVST19DT05UQUNUX0ZPUk0nKSB7XHJcbiAgICAgICAgZXZlbnRDYXRlZ29yeSA9ICdGb3JtX051bGV2a2EnO1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnTnVsbEZvcm1CZWdpbkZpbGxpbmcnfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnUEFZTUVOVF9GT1JNJykge1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnkgPSAnRm9ybV9QYXlfQnlfQ2FyZCc7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6ICdOdWxsRm9ybUJ1eUJlZ2luRmlsbGluZyd9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdQT1BVUF9TVUJTQ1JJUFRJT04nKSB7XHJcbiAgICAgICAgZXZlbnRDYXRlZ29yeSA9ICdGb3JtX0Jsb2dfU3Vic2NyaXB0aW9uJztcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogJ0luZm9TdWJzY3JpcHRpb25Qb3B1cEJlZ2luRmlsbGluZyd9KTtcclxuXHJcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT0gJ3BvcHVwX3N1YnNfcnVicmljXzInKSB7XHJcbiAgICAgICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiBldmVudENhdGVnb3J5ICsgJ19Qb3NpdGlvbl9Pd25lcicsICdldmVudENhdGVnb3J5JzogZXZlbnRDYXRlZ29yeX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZmllbGRfbmFtZSA9PSAncG9wdXBfc3Vic19ydWJyaWNfMycpIHtcclxuICAgICAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGV2ZW50Q2F0ZWdvcnkgKyAnX1Bvc2l0aW9uX0ZvcmVpZ24nLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT0gJ3BvcHVwX3N1YnNfcnVicmljXzQnKSB7XHJcbiAgICAgICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiBldmVudENhdGVnb3J5ICsgJ19Qb3NpdGlvbl9NYWluX0FjY291bnRhbnQnLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT0gJ3BvcHVwX3N1YnNfcnVicmljXzUnKSB7XHJcbiAgICAgICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiBldmVudENhdGVnb3J5ICsgJ19Qb3NpdGlvbl9GaW5hbmNpYWxfRGlyZWN0b3InLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT0gJ3BvcHVwX3N1YnNfcnVicmljXzYnKSB7XHJcbiAgICAgICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiBldmVudENhdGVnb3J5ICsgJ19Qb3NpdGlvbl9IUl9EaXJlY3RvcicsICdldmVudENhdGVnb3J5JzogZXZlbnRDYXRlZ29yeX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZmllbGRfbmFtZSA9PSAncG9wdXBfc3Vic19ydWJyaWNfNycpIHtcclxuICAgICAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGV2ZW50Q2F0ZWdvcnkgKyAnX1Bvc2l0aW9uX090aGVyJywgJ2V2ZW50Q2F0ZWdvcnknOiBldmVudENhdGVnb3J5fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmaWVsZF9uYW1lID09ICdwb3B1cF9zdWJzX3J1YnJpY19tb3Njb3cnKSB7XHJcbiAgICAgICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiBldmVudENhdGVnb3J5ICsgJ19DaXR5X01vc2NvdycsICdldmVudENhdGVnb3J5JzogZXZlbnRDYXRlZ29yeX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZmllbGRfbmFtZSA9PSAncG9wdXBfc3Vic19ydWJyaWNfc3BiJykge1xyXG4gICAgICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogZXZlbnRDYXRlZ29yeSArICdfQ2l0eV9TcGInLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT0gJ3BvcHVwX3N1YnNfcnVicmljX290aGVyJykge1xyXG4gICAgICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogZXZlbnRDYXRlZ29yeSArICdfQ2l0eV9PdGhlcicsICdldmVudENhdGVnb3J5JzogZXZlbnRDYXRlZ29yeX0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnUEFSVE5FUl9TUEVDSUFMJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiAnUGFydG5lclNwZWNpYWxCZWdpbkZpbGxpbmcnfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnUE9QVVBfU0lNUExZX1NVQlNDUklQVElPTicpIHtcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fU2VuZF9GaWxlJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdQYXlyb2xsX1F1aXpfQ2FsY3VsYXRvcicpIHtcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ1BheXJvbGxfUXVpel9DYWxjdWxhdG9yJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZm9ybV9uYW1lID09ICdQYXlyb2xsX1F1aXpfUmVjb3VudF9Gb3JtJykge1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnkgPSAnUGF5cm9sbF9RdWl6X1JlY291bnRfRm9ybSc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnRk9STV9QQVlST0xMJykge1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnkgPSAnUGF5cm9sbF9RdWl6X0RlbW9fRm9ybSc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZpZWxkX25hbWUgPT0gJ0ZPUk1fUEhPTkUnKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGV2ZW50Q2F0ZWdvcnkgKyAnX0ZpbGxlZF9QaG9uZScsICdldmVudENhdGVnb3J5JzogZXZlbnRDYXRlZ29yeX0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGZpZWxkX25hbWUgPT0gJ0ZPUk1fRU1BSUwnKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGV2ZW50Q2F0ZWdvcnkgKyAnX0ZpbGxlZF9FbWFpbCcsICdldmVudENhdGVnb3J5JzogZXZlbnRDYXRlZ29yeX0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGZpZWxkX25hbWUgPT0gJ0ZPUk1fTkFNRScpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogZXZlbnRDYXRlZ29yeSArICdfRmlsbGVkX05hbWUnLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgIH1cclxuICAgIGlmIChmaWVsZF9uYW1lID09ICdGT1JNX0NPTU1FTlQnKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGV2ZW50Q2F0ZWdvcnkgKyAnX0ZpbGxlZF9Db21tZW50JywgJ2V2ZW50Q2F0ZWdvcnknOiBldmVudENhdGVnb3J5fSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZmllbGRfbmFtZSA9PSAnRk9STV9URUwnKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGV2ZW50Q2F0ZWdvcnkgKyAnX0NsaWNrX1Bob25lJywgJ2V2ZW50Q2F0ZWdvcnknOiBldmVudENhdGVnb3J5fSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZmllbGRfbmFtZSA9PSAnRk9STV9QQVknKSB7XHJcbiAgICAgICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGV2ZW50Q2F0ZWdvcnkgKyAnX0NsaWNrX0NhcmQnLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgIH1cclxuICAgIGlmIChmaWVsZF9uYW1lID09ICdGT1JNX0lOTicpIHtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogZXZlbnRDYXRlZ29yeSArICdfRmlsbGVkX0lOTicsICdldmVudENhdGVnb3J5JzogZXZlbnRDYXRlZ29yeX0pO1xyXG4gICAgfVxyXG5cdGlmIChmaWVsZF9uYW1lID09ICdGT1JNX1RJTUUnKSB7XHJcblx0XHRkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogZXZlbnRDYXRlZ29yeSArICdfRmlsbGVkX0NhbGxpbmdfVGltZScsICdldmVudENhdGVnb3J5JzogZXZlbnRDYXRlZ29yeX0pO1xyXG5cdH1cclxuICAgIGlmIChmaWVsZF9uYW1lID09ICdGT1JNX1dIQVRTQVBQJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiBldmVudENhdGVnb3J5ICsgJ19GaWxsZWRfV2hhdHNhcHAnLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgIH1cclxuICAgIGlmIChmaWVsZF9uYW1lID09ICdGT1JNX0ZBQ0VCT09LJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiBldmVudENhdGVnb3J5ICsgJ19GaWxsZWRfRmFjZWJvb2snLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgIH1cclxuICAgIGlmIChmaWVsZF9uYW1lID09ICdGT1JNX1NLWVBFJykge1xyXG4gICAgICAgIGRhdGFMYXllci5wdXNoKHsnZXZlbnQnOiBldmVudENhdGVnb3J5ICsgJ19GaWxsZWRfU2t5cGUnLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuICAgIH1cclxuXHRpZiAoZmllbGRfbmFtZSA9PSAnRk9STV9DT05DUkVURUxZX0lOVEVSRVNURUQnKSB7XHJcblx0XHRkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogZXZlbnRDYXRlZ29yeSArICdfRmlsbGVkX0ludGVyZXN0ZWQnLCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnl9KTtcclxuXHR9XHJcbiAgICBpZiAoZmllbGRfbmFtZS5pbmRleE9mKFwiRk9STV9JTlRFUkVTVEVEX1wiKSAhPT0gLTEpIHtcclxuICAgICAgICBpbmRleCA9IGZpZWxkX25hbWUucmVwbGFjZShcIkZPUk1fSU5URVJFU1RFRF9cIixcIlwiKTtcclxuICAgICAgICBkYXRhTGF5ZXIucHVzaCh7J2V2ZW50JzogZXZlbnRDYXRlZ29yeSArICdfQ2hvb3NlZF9JbnRlcmVzdGVkJytpbmRleCwgJ2V2ZW50Q2F0ZWdvcnknOiBldmVudENhdGVnb3J5fSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5pbmZvKCdHVE1wdXNoRXZlbnRUb3VjaEZvcm06ICcgKyBmb3JtX25hbWUpO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gR1RNcHVzaEV2ZW50RXJyb3JGb3JtKGZvcm1fbmFtZSwgZXZlbnRDYXRlZ29yeSA9ICcnLCBldmVudExhYmVsID0gJycpIHtcclxuXHJcbiAgICBpZiAodHlwZW9mIGRhdGFMYXllciA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2RhdGFMYXllciBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZvcm1fbmFtZSA9PSAnQ09OVEFDVF9VU19BQ0NPVU5USU5HX0NBTENfRk9STScpIHtcclxuICAgICAgICBldmVudCA9ICdGb3JtX0FjY291bnRpbmdfQ2FsY3VsYXRvcl9FeHRlbmRlZF9FcnJvcic7XHJcbiAgICAgICAgZXZlbnRMYWJlbCA9ICdGb3JtX0FjY291bnRpbmdfQ2FsY3VsYXRvcl9FeHRlbmRlZCc7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnRk9STV9VUFJBVkxFTktBJykge1xyXG4gICAgICAgIGV2ZW50ID0gJ0Zvcm1fVXByYXZsZW5rYV9BY2Nlc3NfRXJyb3InO1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnkgPSAnRm9ybV9VcHJhdmxlbmthX0FjY2Vzcyc7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnRm9ybV9VcHJhdmxlbmthX01vYmlsZScpIHtcclxuICAgICAgICBldmVudCA9ICdGb3JtX1VwcmF2bGVua2FfTW9iaWxlX0Vycm9yJztcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fVXByYXZsZW5rYV9Nb2JpbGUnO1xyXG4gICAgfSBlbHNlIGlmIChmb3JtX25hbWUgPT0gJ0NBTExCQUNLX0ZPUk0nKSB7XHJcbiAgICAgICAgZXZlbnQgPSAnRm9ybV9DYWxsYmFja19Mb25nX0Vycm9yJztcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fQ2FsbGJhY2tfTG9uZyc7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnQ09OVEFDVF9VU19GT1JNJykge1xyXG4gICAgICAgIGV2ZW50ID0gJ0Zvcm1fTWFpbl9FcnJvcic7XHJcbiAgICAgICAgZXZlbnRDYXRlZ29yeSA9ICdGb3JtX01haW4nO1xyXG4gICAgfSBlbHNlIGlmIChmb3JtX25hbWUgPT0gJ0Zvcm1fTWFpbl9Gb3JlaWduJykge1xyXG4gICAgICAgIGV2ZW50ID0gJ0Zvcm1fTWFpbl9Gb3JlaWduX0Vycm9yJztcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fTWFpbl9Gb3JlaWduJztcclxuICAgIH0gZWxzZSBpZiAoZm9ybV9uYW1lID09ICdTRU5EX1ZDQVJEX0ZPUk0nKSB7XHJcbiAgICAgICAgZXZlbnQgPSAnRm9ybV9WaXNpdGthX0Vycm9yJztcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fVmlzaXRrYSc7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnWkVST19DT05UQUNUX0ZPUk0nKSB7XHJcbiAgICAgICAgZXZlbnQgPSAnRm9ybV9OdWxldmthX0Vycm9yJztcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fTnVsZXZrYSc7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnUEFZTUVOVF9GT1JNJykge1xyXG4gICAgICAgIGV2ZW50ID0gJ0Zvcm1fUGF5X0J5X0NhcmRfRXJyb3InO1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnkgPSAnRm9ybV9QYXlfQnlfQ2FyZCc7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnUE9QVVBfU0lNUExZX1NVQlNDUklQVElPTicpIHtcclxuICAgICAgICBldmVudCA9ICdGb3JtX1NlbmRfRmlsZV9FcnJvcic7XHJcbiAgICAgICAgZXZlbnRDYXRlZ29yeSA9ICdGb3JtX1NlbmRfRmlsZSc7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnQ0FMTEJBQ0tfRk9STV9CQVNBJykge1xyXG4gICAgICAgIGV2ZW50ID0gJ0Zvcm1fUHJvdmVyaW1fQmF6dV9FcnJvcic7XHJcbiAgICAgICAgZXZlbnRDYXRlZ29yeSA9ICdGb3JtX1Byb3ZlcmltX0JhenUnO1xyXG4gICAgfSBlbHNlIGlmIChmb3JtX25hbWUgPT0gJ2ZpbmFuY2VfY2FsbGJhY2snKSB7XHJcbiAgICAgICAgZXZlbnQgPSAnRm9ybV9GUk1fRXJyb3InO1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnkgPSAnRm9ybV9GUk0nO1xyXG4gICAgfSBlbHNlIGlmIChmb3JtX25hbWUgPT0gJ0NPTlRBQ1RfVVNfQUNDT1VOVElOR19NT0JJTEVfRk9STScpIHtcclxuICAgICAgICBldmVudCA9ICdGb3JtX0JTX291dHNvdXJjaW5nX21vYmlsZV9FcnJvcic7XHJcbiAgICAgICAgZXZlbnRDYXRlZ29yeSA9ICdGb3JtX0JTX291dHNvdXJjaW5nX21vYmlsZSc7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnQ0FMTEJBQ0tfRk9STV9TSE9SVCcpIHtcclxuICAgICAgICBldmVudCA9ICdGb3JtX0NhbGxiYWNrX1Nob3J0X0Vycm9yJztcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fQ2FsbGJhY2tfU2hvcnQnO1xyXG4gICAgfSBlbHNlIGlmIChmb3JtX25hbWUgPT0gJ1BPUFVQX1NVQlNDUklQVElPTicpIHtcclxuICAgICAgICBldmVudCA9ICdGb3JtX0Jsb2dfU3Vic2NyaXB0aW9uX0Vycm9yJztcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ0Zvcm1fQmxvZ19TdWJzY3JpcHRpb24nO1xyXG4gICAgfSBlbHNlIGlmIChmb3JtX25hbWUgPT0gJ0ZPUk1fUEFZUk9MTCcpIHtcclxuICAgICAgICBldmVudCA9ICdQYXlyb2xsX1F1aXpfRGVtb19Gb3JtX0Vycm9yJztcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ1BheXJvbGxfUXVpeic7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnUGF5cm9sbF9RdWl6X1JlY291bnRfRm9ybScpIHtcclxuICAgICAgICBldmVudCA9ICdQYXlyb2xsX1F1aXpfUmVjb3VudF9Gb3JtX0Vycm9yJztcclxuICAgICAgICBldmVudENhdGVnb3J5ID0gJ1BheXJvbGxfUXVpeic7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1fbmFtZSA9PSAnUGF5cm9sbF9RdWl6X0NhbGN1bGF0b3InKSB7XHJcbiAgICAgICAgZXZlbnQgPSAnUGF5cm9sbF9RdWl6X0NhbGN1bGF0b3JfRXJyb3InO1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnkgPSAnUGF5cm9sbF9RdWl6JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnQgPSAnRXJyb3InO1xyXG4gICAgICAgIGV2ZW50TGFiZWwgPSBmb3JtX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YUxheWVyLnB1c2goeydldmVudCc6IGV2ZW50LCAnZXZlbnRDYXRlZ29yeSc6IGV2ZW50Q2F0ZWdvcnksICdldmVudExhYmVsJzogZXZlbnRMYWJlbH0pO1xyXG5cclxuICAgIGNvbnNvbGUuaW5mbygnR1RNcHVzaEV2ZW50RXJyb3JGb3JtOiAnICsgZm9ybV9uYW1lICsgJywgR1RNcHVzaENhdGVnb3J5OiAnICsgZXZlbnRDYXRlZ29yeSArICcsIEdUTXB1c2hMYWJlbDogJyArIGV2ZW50TGFiZWwpO1xyXG59IiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gIHZhciBzaWRlID0gJ3JpZ2h0JztcclxuICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gNDgwKXtcclxuICAgICAgc2lkZSA9ICdib3R0b20nO1xyXG4gIH1cclxuXHJcbiAgJChkb2N1bWVudCkuZmluZCgnLmpzLXRvb2x0aXAtYWNjb3VudGluZy1uZXcnKS50b29sdGlwc3Rlcih7XHJcbiAgICBzaWRlOiBbc2lkZV0sXHJcbiAgICB0aGVtZTogXCJ0b29sdGlwc3Rlci1saWdodC1uZXdcIixcclxuICAgIGNvbnRlbnRBc0hUTUw6IHRydWUsXHJcbiAgICBhbmltYXRpb246IFwiZmFkZVwiLFxyXG4gICAgaW50ZXJhY3RpdmU6IHRydWUsXHJcbiAgICBtYXhXaWR0aDogNzUwLFxyXG4gICAgZnVuY3Rpb25Qb3NpdGlvbjogZnVuY3Rpb24oaW5zdGFuY2UsIGhlbHBlciwgcG9zaXRpb24pe1xyXG4gICAgICBsZXQgY29udGFpbmVyID0gJCgnLmpzLXRvb2x0aXBzdGVyLWFjY291bnRpbmctbmV3LWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBjb250YWluZXIub2Zmc2V0ICE9PSBcInVuZGVmaW5lZFwiICYmIHNpZGUgPT09ICdyaWdodCcpIHtcclxuICAgICAgICBpZigoY29udGFpbmVyLm9mZnNldCgpLnRvcCAtICQod2luZG93KS5zY3JvbGxUb3AoKSkgPiAtMTAwKSB7XHJcbiAgICAgICAgICBwb3NpdGlvbi5jb29yZC50b3AgPSAoY29udGFpbmVyLm9mZnNldCgpLnRvcCAtICQod2luZG93KS5zY3JvbGxUb3AoKSArIDE1OCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL9C/0L7Qt9C40YbQuNC+0L3QuNGA0L7QstCw0L3QuNC1INC/0YDQuCDQutC70LjQutC1XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IDYwMCl7XHJcbiAgICAgICAgICBwb3NpdGlvbi5jb29yZC5sZWZ0IC09IDEwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9zaXRpb24uc2l6ZS53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gcG9zaXRpb24uY29vcmQubGVmdCAtIDIwO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gICAgfSxcclxuICAgIHRyaWdnZXI6XCJjdXN0b21cIixcclxuICAgIHRyaWdnZXJPcGVuOiB7XHJcbiAgICAgIGNsaWNrOiB0cnVlLFxyXG4gICAgICB0YXA6IHRydWVcclxuICAgIH0sXHJcbiAgICB0cmlnZ2VyQ2xvc2U6IHtcclxuICAgICAgY2xpY2s6IHRydWUsXHJcbiAgICAgIHRhcDogdHJ1ZVxyXG4gICAgfVxyXG4gIH0pO1xyXG59KTtcclxuXHJcbiQoZnVuY3Rpb24oKXtcclxuICAkKCcuanMtZXZlbnRzJykub24oJ2NsaWNrIHRhcCcsICcuanMtZXZlbnQtZ2V0LW9mZmVyLWluLWFjY291bnQnLCBmdW5jdGlvbigpe1xyXG5cclxuICAgIGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgR1RNcHVzaEV2ZW50KCdTdGFydF9xdWl6Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYodHlwZW9mIHlhQ291bnRlcjI2MDE2MjQwID09ICdmdW5jdGlvbicpe1xyXG4gICAgICB5YUNvdW50ZXIyNjAxNjI0MC5yZWFjaEdvYWwoJ1N0YXJ0X3F1aXonKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9KTtcclxuXHJcbiAgJCgnLmpzLWV2ZW50cycpLm9uKCdjbGljayB0YXAnLCAnLmpzLWV2ZW50LXNob3ctdG9vbHRpcCcsIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnQgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBHVE1wdXNoRXZlbnQoJ1N0YXJ0X3F1aXpfbmVlZF9hcmd1bWVudHMnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0eXBlb2YgeWFDb3VudGVyMjYwMTYyNDAgPT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgIHlhQ291bnRlcjI2MDE2MjQwLnJlYWNoR29hbCgnU3RhcnRfcXVpel9uZWVkX2FyZ3VtZW50cycpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0pO1xyXG59KTsiLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyDQo9C00LDQu9C40Lwg0LrRg9C60YMg0YHQvtC00LXRgNC20LDRidGD0Y4g0YHQvtCx0YvRgtC40Y8gR1RNINC00LvRjyDQsdC70L7QutCwIEluZHVzdHJ5XHJcbiAgICBpZiAoZ2V0Q29va2llKCdndG1JbmR1c3RyeUV2ZW50cycpKSB7XHJcbiAgICAgICAgc2V0Q29va2llKCdndG1JbmR1c3RyeUV2ZW50cycsICcnLCAtODY0MDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCY0L3RgtC10YDQstCw0Lsg0L3QsCDQvtGC0L/RgNCw0LLQutGDINGB0L7QsdGL0YLQuNC5IEdUTSDQtNC70Y8g0LHQu9C+0LrQsCBJbmR1c3RyeSA2MCDRgdC10LpcclxuICAgIGxldCBndG1JbmR1c3RyeUludGVydmFsID0gc2V0SW50ZXJ2YWwocHVzaEluZHVzdHJ5RXZlbnRzLCA2MDAwMCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LvRg9GH0LXQvdC40LUgR1RNINGB0L7QsdGL0YLQuNC5INC/0L4g0LHQu9C+0LrRgyBJbmR1c3RyeVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXRJbmR1c3RyeUd0bUV2ZW50cygpIHtcclxuICAgICAgICB2YXIgZ3RtSW5kdXN0cnlFdmVudHMgPSBbXTtcclxuICAgICAgICAkKCcuZGF0YS1yb3ctaW1nLTEgZGl2LmZlYXR1cmUtaXRlbS1pbWctYWN0aXZlLCAuZGF0YS1yb3ctaW1nLTIgZGl2LmZlYXR1cmUtaXRlbS1pbWctYWN0aXZlJykuZWFjaChmdW5jdGlvbihpbmRleCwgdmFsdWUpIHtcclxuICAgICAgICAgICAgZ3RtSW5kdXN0cnlFdmVudHMucHVzaCgnc2V0X2luZHVzdHJ5XycgKyAkKHRoaXMpLmRhdGEoJ2V2ZW50JykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChndG1JbmR1c3RyeUV2ZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHNldENvb2tpZSgnZ3RtSW5kdXN0cnlFdmVudHMnLCBndG1JbmR1c3RyeUV2ZW50cywgMjQqNjAqNjApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhnZXRDb29raWUoJ2d0bUluZHVzdHJ5RXZlbnRzJykuc3BsaXQoJywnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC/0YDQsNCy0LvRj9C10LwgR1RNINGB0L7QsdGL0YLQuNGPINC/0L4g0LHQu9C+0LrRgyBJbmR1c3RyeVxyXG4gICAgICogQHBhcmFtIGV2ZW50c1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwdXNoSW5kdXN0cnlFdmVudHMoKSB7XHJcbiAgICAgICAgaWYgKGdldENvb2tpZSgnZ3RtSW5kdXN0cnlFdmVudHMnKSkge1xyXG4gICAgICAgICAgICB2YXIgZXZlbnRzID0gZ2V0Q29va2llKCdndG1JbmR1c3RyeUV2ZW50cycpLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudCh2YWx1ZSwgJ0JTX291dHNvdXJjaW5nJywgJ0luZHVzdHJ5Jyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vINCj0LTQsNC70LjQvCDQmNC90YLQtdGA0LLQsNC7INC/0L7RgdC70LUg0L/QtdGA0LLQvtC5INC+0YLQv9GA0LDQstC60LhcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoZ3RtSW5kdXN0cnlJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJCgnW2RhdGEtcG9wdXAtYmVpZ2VdJykubWFnbmlmaWNQb3B1cCh7XHJcbiAgICAgICAgdHlwZTogJ2lubGluZSdcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuaXRlbS1hY2NvcmRpb24gLml0ZW0tYWNjb3JkaW9uX19oZWFkaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLml0ZW0tYWNjb3JkaW9uX19oZWFkaW5nLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAgICAgJCgnLml0ZW0tYWNjb3JkaW9uX19oZWFkaW5nOm5vdCgub3BlbiknKS5uZXh0KCcuaXRlbS1hY2NvcmRpb25fX2JvZHknKS5hZGRDbGFzcygnYmxvY2staGlkZGVuJyk7XHJcbiAgICAgICAgJCgnLml0ZW0tYWNjb3JkaW9uX19oZWFkaW5nOm5vdCgub3BlbiknKS5maW5kKCdoMycpLnJlbW92ZUNsYXNzKCdpdGVtLWFjY29yZGlvbl9fdGl0bGUtbW9iaWxlJyk7XHJcbiAgICAgICAgJCgnLml0ZW0tYWNjb3JkaW9uX19oZWFkaW5nOm5vdCgub3BlbiknKS5maW5kKCcuYXJyb3cnKS5yZW1vdmVDbGFzcygnYXJyb3ctLXJvdGF0ZScpO1xyXG5cclxuICAgICAgICAkKCcuaXRlbS1hY2NvcmRpb25fX2hlYWRpbmcub3BlbicpLm5leHQoJy5pdGVtLWFjY29yZGlvbl9fYm9keScpLnRvZ2dsZUNsYXNzKCdibG9jay1oaWRkZW4nKTtcclxuICAgICAgICAkKCcuaXRlbS1hY2NvcmRpb25fX2hlYWRpbmcub3BlbicpLmZpbmQoJ2gzJykudG9nZ2xlQ2xhc3MoJ2l0ZW0tYWNjb3JkaW9uX190aXRsZS1tb2JpbGUnKTtcclxuICAgICAgICAkKCcuaXRlbS1hY2NvcmRpb25fX2hlYWRpbmcub3BlbicpLmZpbmQoJy5hcnJvdycpLnRvZ2dsZUNsYXNzKCdhcnJvdy0tcm90YXRlJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCdbZGF0YS10b29sdGlwXzFdJykuaG92ZXIoZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCcudG9vbHRpcC1vbmUtY29udGVudCcpLmZhZGVUb2dnbGUoMjAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ1tkYXRhLXRvb2x0aXBfMl0nKS5ob3ZlcihmdW5jdGlvbigpe1xyXG4gICAgICAgICQoJy50b29sdGlwLXR3by1jb250ZW50JykuZmFkZVRvZ2dsZSgyMDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnW2RhdGEtdG9vbHRpcF8zXScpLmhvdmVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJCgnLnRvb2x0aXAtdGhyZWUtY29udGVudCcpLmZhZGVUb2dnbGUoMjAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcudGFiJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciBlbGVtID0gJCh0aGlzKTtcclxuICAgICAgICB2YXIgaW5kZXggPSBlbGVtLmluZGV4KCk7XHJcblxyXG4gICAgICAgIGVsZW0uY2xvc2VzdCgnLmNhYmluZXQtZmVhdHVyZXNfX2NvbnRlbnQtdGFicycpLmZpbmQoJy50YWInKS5yZW1vdmVDbGFzcygndGFiLWFjdGl2ZScpO1xyXG4gICAgICAgIGVsZW0uYWRkQ2xhc3MoJ3RhYi1hY3RpdmUnKTtcclxuICAgICAgICAvL2VsZW0uY2xvc2VzdCgnLmNhYmluZXQtZmVhdHVyZXNfX2lubmVyJykuZmluZCgnLmNhYmluZXQtZmVhdHVyZXNfX2NvbnRlbnQnKS5yZW1vdmVDbGFzcygnYWN0aXZlLWNvbnRlbnQnKS5lcShpbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZS1jb250ZW50Jyk7XHJcbiAgICAgICAgZWxlbS5jbG9zZXN0KCcuY2FiaW5ldC1mZWF0dXJlc19faW5uZXInKS5maW5kKCcuY2FiaW5ldC1mZWF0dXJlc19fY29udGVudCcpLnNsaWRlVXAoMTAwMCkuZXEoaW5kZXgpLnNsaWRlRG93bigxMDAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBzd2lwZXJUYWJzID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGZ1bmN0aW9uIHN3aXBlclRhYnNJbml0KCkge1xyXG4gICAgICAgIHZhciBzY3JlZW5XaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG5cclxuICAgICAgICBpZiAoc2NyZWVuV2lkdGggPCA3NjggJiYgc3dpcGVyVGFicyA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgJCgnLmNhYmluZXQtZmVhdHVyZXNfX2NvbnRlbnQtdGFicycpLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgIHN3aXBlclRhYnMgPSBuZXcgU3dpcGVyKCQoJy5jYWJpbmV0LWZlYXR1cmVzX19jb250ZW50LXRhYnMgLnN3aXBlci1jb250YWluZXInKVtpXSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDMwLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyZWVNb2RlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHBhZ2luYXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgIGVsOiAnLnN3aXBlci1wYWdpbmF0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEVsOiAkKCcudGFicy1idG4tbmV4dCcpW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2RWw6ICQoJy50YWJzLWJ0bi1wcmV2JylbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2luaXRpYWxpemVkJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzY3JlZW5XaWR0aCA+IDc2NyAmJiBzd2lwZXJUYWJzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzd2lwZXJUYWJzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgc3dpcGVyVGFicyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgLy8gJCgnLnByb2R1Y3QtcHJldmlld3NfX2NvbnRlbnQgLnN3aXBlci13cmFwcGVyJykucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgLy8gJCgnLnByb2R1Y3QtcHJldmlld3NfX2NvbnRlbnQgLnN3aXBlci1zbGlkZScpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXN0cm95ZWQnKTtcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBzd2lwZXJUYWJzSW5pdCgpO1xyXG5cclxuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHN3aXBlclRhYnNJbml0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcucmV2aWV3cyAuc3dpcGVyLWNvbnRhaW5lcicpLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICB2YXIgc3dpcGVyUmV2aWV3cyA9IG5ldyBTd2lwZXIoJCgnLnJldmlld3MgLnN3aXBlci1jb250YWluZXInKVtpXSwge1xyXG4gICAgICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMzAsXHJcbiAgICAgICAgICAgIGF1dG9IZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICAgICAgICAgIGVsOiAkKCcucmV2aWV3cy1wYWdpbmF0aW9uJylbaV0sXHJcbiAgICAgICAgICAgICAgICBjbGlja2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5leHRFbDogJCgnLnJldmlld3MtYnRuLW5leHQnKVtpXSxcclxuICAgICAgICAgICAgICAgIHByZXZFbDogJCgnLnJldmlld3MtYnRuLXByZXYnKVtpXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJy5zZWxlY3Rpb25fX2J1dHRvbicpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5zZWxlY3Rpb25fX2J1dHRvbnMnKS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy50YWJzIC50YWJzX19idG4nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBlbCA9ICQodGhpcyk7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gZWwuaW5kZXgoKTtcclxuICAgICAgICBlbC5jbG9zZXN0KCcudGFicycpLmZpbmQoJy50YWJzX19idG4nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICBlbC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICBlbC5jbG9zZXN0KCcudGFicycpLmZpbmQoJy50YWJzX19jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLmVxKGluZGV4KS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcud2h5LXdlX190YWItY29udGVudCAuc3dpcGVyLWNvbnRhaW5lcicpLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICB2YXIgc3dpcGVyUGVyb25hbENhcmQgPSBuZXcgU3dpcGVyKCQoJy53aHktd2VfX3RhYi1jb250ZW50IC5zd2lwZXItY29udGFpbmVyJylbaV0sIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAxLFxyXG4gICAgICAgICAgICBzcGFjZUJldHdlZW46IDMwLFxyXG4gICAgICAgICAgICBhdXRvSGVpZ2h0OiB0cnVlLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0RWw6ICQoJy5zd2lwZXItYnV0dG9uQ2FyZC1uZXh0JylbaV0sXHJcbiAgICAgICAgICAgICAgICBwcmV2RWw6ICQoJy5zd2lwZXItYnV0dG9uQ2FyZC1wcmV2JylbaV0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJCgnLndoeS13ZV9fdGFiJykuY2xpY2soJ2J1dHRvbjpub3QoLmFjdGl2ZS10YWIpJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZS10YWInKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUtdGFiJykuY2xvc2VzdCgnLndoeS13ZV9faW5uZXInKS5maW5kKCcud2h5LXdlX190YWItY29udGVudCcpLnJlbW92ZUNsYXNzKCdjb250ZW50LWFjdGl2ZScpLmVxKCQodGhpcykuaW5kZXgoKSkuYWRkQ2xhc3MoJ2NvbnRlbnQtYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignbW91c2VlbnRlciBtb3VzZWxlYXZlJywgJ1tkYXRhLWZlYXR1cmUtaXRlbV0nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGVsID0gJCh0aGlzKTtcclxuICAgICAgICBsZXQgZmVhdHVyZUl0ZW0gPSAkKCdbZGF0YS1mZWF0dXJlLWl0ZW1dJyk7XHJcblxyXG4gICAgICAgIGVsLnRvZ2dsZUNsYXNzKCdmZWF0dXJlcy1ob3ZlcicpLmZpbmQoJy5hcnJvdy1ncmVlbicpLnRvZ2dsZUNsYXNzKCdhcnJvdy1ncmVlbi0tc2hvdycpO1xyXG4gICAgICAgIGZlYXR1cmVJdGVtLm5vdCgkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZmVhdHVyZUl0ZW0udG9nZ2xlQ2xhc3MoJ2ZlYXR1cmVzLWJveC1pdGVtLW9mZicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGVsLnJlbW92ZUNsYXNzKCdmZWF0dXJlcy1ib3gtaXRlbS1vZmYnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnLCAnI2ZlYXR1cmUtaXRlbS0xJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAkKCcuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDApLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDEpJykudG9nZ2xlQ2xhc3MoJ2ZlYXR1cmUtaXRlbS1pbWctYWN0aXZlJyk7XHJcbiAgICAgICAgJCgnLmRhdGEtcm93LWltZy0yIGRpdjplcSgyKScpLnRvZ2dsZUNsYXNzKCdmZWF0dXJlLWl0ZW0taW1nLWFjdGl2ZScpO1xyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZWVudGVyJykge1xyXG4gICAgICAgICAgICBzZXRJbmR1c3RyeUd0bUV2ZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKCcuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDIpLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDMpJykudG9nZ2xlQ2xhc3MoJ2ZlYXR1cmUtaXRlbS1pbWctb2ZmJyk7XHJcbiAgICAgICAgJCgnLmRhdGEtcm93LWltZy0yIGRpdjplcSgwKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgxKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgzKScpLnRvZ2dsZUNsYXNzKCdmZWF0dXJlLWl0ZW0taW1nLW9mZicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ21vdXNlZW50ZXIgbW91c2VsZWF2ZScsICcjZmVhdHVyZS1pdGVtLTInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICQoJy5kYXRhLXJvdy1pbWctMSBkaXY6ZXEoMSknKS50b2dnbGVDbGFzcygnZmVhdHVyZS1pdGVtLWltZy1hY3RpdmUnKTtcclxuICAgICAgICBpZiAoZS50eXBlID09PSAnbW91c2VlbnRlcicpIHtcclxuICAgICAgICAgICAgc2V0SW5kdXN0cnlHdG1FdmVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnLmRhdGEtcm93LWltZy0xIGRpdjplcSgwKSwgLmRhdGEtcm93LWltZy0xIGRpdjplcSgyKSwgLmRhdGEtcm93LWltZy0xIGRpdjplcSgzKScpLnRvZ2dsZUNsYXNzKCdmZWF0dXJlLWl0ZW0taW1nLW9mZicpO1xyXG4gICAgICAgICQoJy5kYXRhLXJvdy1pbWctMiBkaXY6ZXEoMCksIC5kYXRhLXJvdy1pbWctMiBkaXY6ZXEoMSksIC5kYXRhLXJvdy1pbWctMiBkaXY6ZXEoMiksIC5kYXRhLXJvdy1pbWctMiBkaXY6ZXEoMyknKS50b2dnbGVDbGFzcygnZmVhdHVyZS1pdGVtLWltZy1vZmYnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnLCAnI2ZlYXR1cmUtaXRlbS0zJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAkKCcuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDApLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDEpLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDIpLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDMpJykudG9nZ2xlQ2xhc3MoJ2ZlYXR1cmUtaXRlbS1pbWctYWN0aXZlJyk7XHJcbiAgICAgICAgJCgnLmRhdGEtcm93LWltZy0yIGRpdjplcSgxKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgyKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgzKScpLnRvZ2dsZUNsYXNzKCdmZWF0dXJlLWl0ZW0taW1nLWFjdGl2ZScpO1xyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZWVudGVyJykge1xyXG4gICAgICAgICAgICBzZXRJbmR1c3RyeUd0bUV2ZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKCcuZGF0YS1yb3ctaW1nLTIgZGl2OmVxKDApJykudG9nZ2xlQ2xhc3MoJ2ZlYXR1cmUtaXRlbS1pbWctb2ZmJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignbW91c2VlbnRlciBtb3VzZWxlYXZlJywgJyNmZWF0dXJlLWl0ZW0tNCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgJCgnLmRhdGEtcm93LWltZy0xIGRpdjplcSgyKSwgLmRhdGEtcm93LWltZy0xIGRpdjplcSgzKScpLnRvZ2dsZUNsYXNzKCdmZWF0dXJlLWl0ZW0taW1nLWFjdGl2ZScpO1xyXG4gICAgICAgICQoJy5kYXRhLXJvdy1pbWctMiBkaXY6ZXEoMyknKS50b2dnbGVDbGFzcygnZmVhdHVyZS1pdGVtLWltZy1hY3RpdmUnKTtcclxuICAgICAgICBpZiAoZS50eXBlID09PSAnbW91c2VlbnRlcicpIHtcclxuICAgICAgICAgICAgc2V0SW5kdXN0cnlHdG1FdmVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnLmRhdGEtcm93LWltZy0xIGRpdjplcSgwKSwgLmRhdGEtcm93LWltZy0xIGRpdjplcSgxKScpLnRvZ2dsZUNsYXNzKCdmZWF0dXJlLWl0ZW0taW1nLW9mZicpO1xyXG4gICAgICAgICQoJy5kYXRhLXJvdy1pbWctMiBkaXY6ZXEoMCksIC5kYXRhLXJvdy1pbWctMiBkaXY6ZXEoMSksIC5kYXRhLXJvdy1pbWctMiBkaXY6ZXEoMiknKS50b2dnbGVDbGFzcygnZmVhdHVyZS1pdGVtLWltZy1vZmYnKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnLCAnI2ZlYXR1cmUtaXRlbS01JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAkKCcuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDApLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDEpLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDIpLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDMpJykudG9nZ2xlQ2xhc3MoJ2ZlYXR1cmUtaXRlbS1pbWctYWN0aXZlJyk7XHJcbiAgICAgICAgJCgnLmRhdGEtcm93LWltZy0yIGRpdjplcSgwKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgxKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgyKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgzKScpLnRvZ2dsZUNsYXNzKCdmZWF0dXJlLWl0ZW0taW1nLWFjdGl2ZScpO1xyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZWVudGVyJykge1xyXG4gICAgICAgICAgICBzZXRJbmR1c3RyeUd0bUV2ZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnLCAnI2ZlYXR1cmUtaXRlbS02JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAkKCcuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDApLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDEpLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDIpLCAuZGF0YS1yb3ctaW1nLTEgZGl2OmVxKDMpJykudG9nZ2xlQ2xhc3MoJ2ZlYXR1cmUtaXRlbS1pbWctYWN0aXZlJyk7XHJcbiAgICAgICAgJCgnLmRhdGEtcm93LWltZy0yIGRpdjplcSgwKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgxKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgyKSwgLmRhdGEtcm93LWltZy0yIGRpdjplcSgzKScpLnRvZ2dsZUNsYXNzKCdmZWF0dXJlLWl0ZW0taW1nLWFjdGl2ZScpO1xyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdtb3VzZWVudGVyJykge1xyXG4gICAgICAgICAgICBzZXRJbmR1c3RyeUd0bUV2ZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoJ1tkYXRhLWNoZWNrLXF1ZXN0aW9uXScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIGxldCBjaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgLy9sZXQgYnV0dG9uID0gJCgnLnF1ZXN0aW9uLWZvb3Rlcl9fYnRuJyk7XHJcblxyXG4gICAgICAgICQoJ1tkYXRhLWNoZWNrLXF1ZXN0aW9uXScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5wcm9wKCdjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGNoZWNrZWQpIHtcclxuICAgICAgICAgICAgc2hvd1NwZWNpYWxCbG9jaygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRlZmF1bHRCbG9ja3MoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQn9C+0YDRj9C00L7QuiDQuCDQvtGC0L7QsdGA0LDQttC10L3QuNC1INCx0LvQvtC60L7QsiDQv9C+INC00LXRhNC+0LvRgtGDXHJcbiAgICBmdW5jdGlvbiBkZWZhdWx0QmxvY2tzKCkge1xyXG4gICAgICAgICQoYFtkYXRhLXNlY3Rpb249MV0sXHJcbiAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTRdLFxyXG4gICAgICAgICAgICAgICAgW2RhdGEtc2VjdGlvbj05XSxcclxuICAgICAgICAgICAgICAgIFtkYXRhLXNlY3Rpb249MTBdLFxyXG4gICAgICAgICAgICAgICAgW2RhdGEtc2VjdGlvbj0xMV0sXHJcbiAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTE0XSxcclxuICAgICAgICAgICAgICAgIFtkYXRhLXNlY3Rpb249MTVdLFxyXG4gICAgICAgICAgICAgICAgW2RhdGEtc2VjdGlvbj0xOF0sXHJcbiAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTIwXSxcclxuICAgICAgICAgICAgICAgIFtkYXRhLXNlY3Rpb249MjFdLFxyXG4gICAgICAgICAgICAgICAgW2RhdGEtc2VjdGlvbj0yMl0sXHJcbiAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTIzXWApLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgICQoYFtkYXRhLXNlY3Rpb249Ml0sXHJcbiAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTNdLFxyXG4gICAgICAgICAgICAgICAgW2RhdGEtc2VjdGlvbj01XSxcclxuICAgICAgICAgICAgICAgIFtkYXRhLXNlY3Rpb249NS0xXSxcclxuICAgICAgICAgICAgICAgIFtkYXRhLXNlY3Rpb249Nl0sXHJcbiAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTddLFxyXG4gICAgICAgICAgICAgICAgW2RhdGEtc2VjdGlvbj0xMS0xXSxcclxuICAgICAgICAgICAgICAgIFtkYXRhLXNlY3Rpb249MTddLFxyXG4gICAgICAgICAgICAgICAgW2RhdGEtc2VjdGlvbj0xOV0sXHJcbiAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTIxLTFdLFxyXG4gICAgICAgICAgICAgICAgW2RhdGEtc2VjdGlvbj0yMS0yXSxcclxuICAgICAgICAgICAgICAgIFtkYXRhLXNlY3Rpb249MjItMV1gKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVmYXVsdEJsb2NrcygpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dTcGVjaWFsQmxvY2soKSB7XHJcbiAgICAgICAgLy9sZXQgYnV0dG9uID0gJCgnLnF1ZXN0aW9uLWZvb3Rlcl9fYnRuJyk7XHJcbiAgICAgICAgbGV0IGNoZWNrID0gJzpjaGVja2VkJztcclxuXHJcbiAgICAgICAgLypidXR0b24uY2xpY2soZnVuY3Rpb24gKGUpIHsqL1xyXG5cclxuICAgICAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0QmxvY2tzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICgkKCcjYWNjb3VudGFudC1xdWl0JykuaXMoY2hlY2spKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTJdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgJCgnW2RhdGEtc2VjdGlvbj0yXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQoJyNhY2NvdW50aW5nLWZhaWxzJykuaXMoY2hlY2spKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTVdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj01LTFdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgJCgnW2RhdGEtc2VjdGlvbj01XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgLy8gICAgICQoJ1tkYXRhLXNlY3Rpb249NS0xXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQoJyPRgW9zdC1yZWR1Y3Rpb24nKS5pcyhjaGVjaykpIHtcclxuICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249M10nKS5zaG93KCk7XHJcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICAgICAkKCdbZGF0YS1zZWN0aW9uPTNdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJCgnI25vLXN0YWZmJykuaXMoY2hlY2spKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTZdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgJCgnW2RhdGEtc2VjdGlvbj02XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQoJyNpbmRlcGVuZGVudC1hY2NvdW50aW5nJykuaXMoY2hlY2spKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTddJykuc2hvdygpO1xyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgJCgnW2RhdGEtc2VjdGlvbj03XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQoJyNjaG9vc2UtY29udHJhY3RvcicpLmlzKGNoZWNrKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj00XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249OV0nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTExXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTEtMV0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTE0XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjBdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMV0nKS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC10YWJzXScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQoJ1tkYXRhLXRhYnMtYnRuXScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC10YWJzPTNdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnW2RhdGEtdGFicy1idG49M10nKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gICAgICQoJ1tkYXRhLXNlY3Rpb249NF0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgIC8vICAgICAkKCdbZGF0YS1zZWN0aW9uPTldJykuc2hvdygpO1xyXG4gICAgICAgICAgICAvLyAgICAgJCgnW2RhdGEtc2VjdGlvbj0xMV0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgIC8vICAgICAkKCdbZGF0YS1zZWN0aW9uPTExLTFdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAvLyAgICAgJCgnW2RhdGEtc2VjdGlvbj0xNF0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgIC8vICAgICAkKCdbZGF0YS1zZWN0aW9uPTE4XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgLy8gICAgICQoJ1tkYXRhLXNlY3Rpb249MjBdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAvLyAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMV0nKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAvLyAgICAgJCgnW2RhdGEtY29udGVudC10YWJzPTFdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAvLyAgICAgJCgnW2RhdGEtdGFicy1idG49MV0nKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgLy8gICAgICQoJ1tkYXRhLWNvbnRlbnQtdGFicz0zXScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgLy8gICAgICQoJ1tkYXRhLXRhYnMtYnRuPTNdJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgkKCcjYWNjb3VudGFudC1xdWl0JykuaXMoY2hlY2spICYmICQoJyNuby1zdGFmZicpLmlzKGNoZWNrKSkge1xyXG4gICAgICAgICAgICAgICAgJChgW2RhdGEtc2VjdGlvbj0yXSxcclxuICAgICAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTZdYCkuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJCgnI9GBb3N0LXJlZHVjdGlvbicpLmlzKGNoZWNrKSAmJiAkKCcjYWNjb3VudGluZy1mYWlscycpLmlzKGNoZWNrKSkge1xyXG4gICAgICAgICAgICAgICAgJChgW2RhdGEtc2VjdGlvbj0zXSxcclxuICAgICAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTVdLFxyXG4gICAgICAgICAgICAgICAgICAgIFtkYXRhLXNlY3Rpb249Nl1gKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgkKCcjY2hvb3NlLWNvbnRyYWN0b3InKS5pcyhjaGVjaykgJiYgJCgnI2FjY291bnRpbmctZmFpbHMnKS5pcyhjaGVjaykpIHtcclxuICAgICAgICAgICAgICAgICQoYFtkYXRhLXNlY3Rpb249M10sXHJcbiAgICAgICAgICAgICAgICAgICAgW2RhdGEtc2VjdGlvbj01XSxcclxuICAgICAgICAgICAgICAgICAgICBbZGF0YS1zZWN0aW9uPTZdYCkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj05XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyokKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHBhcnNlSW50KCQoXCIjYWR2YW50YWdlczFcIikub2Zmc2V0KCkudG9wKVxyXG4gICAgICAgICAgICB9LCAyMDAwKTsqL1xyXG5cclxuICAgICAgICAvKn0pOyovXHJcbiAgICB9XHJcblxyXG4gICAgLy9zaG93U3BlY2lhbEJsb2NrKCk7XHJcblxyXG4gICAgLy8g0J/QvtC60LDQtyDRgdC10LrRhtC40Lgg0YEg0YLQtdGB0YLQvtC8INC/0YDQuCDQstGL0LHQvtGA0LUg0YLQsNCx0LAgXCLQqNGC0LDRgtC90LDRjyDQsdGD0YXQs9Cw0LvRgtC10YDQuNGPXCJcclxuICAgICQoJy53aHktd2VfX3RhYicpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciAkcmVnQWNjVGFiID0gJCgnW2RhdGEtcmVndWxhci1hY2NvdW50aW5nXScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICgkcmVnQWNjVGFiLmhhc0NsYXNzKCdjb250ZW50LWFjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTddJykuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBvc3Rpb24gPSAkKCdbZGF0YS1ibG9jay1tb2ItZmVlZGJhY2tdJykub2Zmc2V0KCkudG9wIC09IDc1MDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gJCgnW2RhdGEtYmxvY2stbW9iLWZlZWRiYWNrXScpLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBzY3JvbGwgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcclxuICAgICAgICB2YXIgdG9wTWFyZ2luID0gOTk5OTtcclxuXHJcbiAgICAgICAgaWYgKHNjcm9sbCA+IHBvc3Rpb24gJiYgc2Nyb2xsIDwgKHBvc3Rpb24gKyBoZWlnaHQgKyB0b3BNYXJnaW4pKSB7XHJcbiAgICAgICAgICAgICQoJy5maXhlZC1idG4tbW9iaWxlJykuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5maXhlZC1idG4tbW9iaWxlJykuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBPdmVyZmxvdyBib2R5IGZpeCBvbiBpT3NcclxuICAgICQoJy5qcy1nZXQtZm9ybS5maXhlZC1idG4tbW9iaWxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblxyXG4gICAgICAgICQoJy5mYW5jeWJveC1vdmVybGF5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2ZhbmN5Ym94LW92ZXJsYXkgZmFuY3lib3gtb3ZlcmxheS1maXhlZCcpIHtcclxuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuZmFuY3lib3gtaXRlbS5mYW5jeWJveC1jbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1xyXG4gICAgfSk7XHJcbn0pOyIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcudXNlZnVsLWZlYXR1cmVzX190YWJzJykub24oJ2NsaWNrJywgJ2J1dHRvbi51c2VmdWwtZmVhdHVyZXNfX3RhYjpub3QoLmFjdGl2ZSknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLmNsb3Nlc3QoJy51c2VmdWwtZmVhdHVyZXNfX2NvbnRlbnQnKS5maW5kKCcudXNlZnVsLWZlYXR1cmVzX19ib2R5JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLmVxKCQodGhpcykuaW5kZXgoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLnVzZWZ1bC1mZWF0dXJlc19fYm9keS1idG4tLWxlZnQnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJ1tkYXRhLXdpbmRvdy0xXScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnW2RhdGEtd2luZG93LTJdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcudXNlZnVsLWZlYXR1cmVzX19ib2R5LWJ0bi0tcmlnaHQnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJ1tkYXRhLXdpbmRvdy0yXScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnW2RhdGEtd2luZG93LTFdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcudXNlZnVsLWZlYXR1cmVzX19ib2R5LWJ0bicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcudXNlZnVsLWZlYXR1cmVzX19ib2R5LWJ0bicpLm5vdCh0aGlzKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcudXNlZnVsLWZlYXR1cmVzLW1vYmlsZV9faGVhZCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIHRvcCA9IGVsLm9mZnNldCgpLnRvcDtcclxuXHJcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLm5leHQoKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy51c2VmdWwtZmVhdHVyZXMtbW9iaWxlX19oZWFkJykubm90KHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnLnVzZWZ1bC1mZWF0dXJlcy1tb2JpbGVfX2hlYWQnKS5ub3QodGhpcykucGFyZW50KCkuZmluZCgnLnVzZWZ1bC1mZWF0dXJlcy1tb2JpbGVfX2JvZHknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcCA9IGVsLm9mZnNldCgpLnRvcCAtIDUwO1xyXG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogdG9wICsgJ3B4J30sIDUwMCk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5QYXltZW50ID0gQXBwLlBheW1lbnQgfHwge307XHJcblx0QXBwLlBheW1lbnQuRm9ybUFqYXggPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBQYXltZW50Rm9ybUFqYXgnLFxyXG5cdFx0XHRkZWZhdWx0czoge1xyXG5cdFx0XHRcdGdhdGV3YXk6ICcvYWpheC9mb3Jtcy9wYXltZW50LydcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuZm9ybSA9IHRoaXMuZWxlbWVudC5maW5kKCdmb3JtJyk7XHJcblx0XHRcdFx0dGhpcy5mb3JtTmFtZSA9IHRoaXMuZm9ybS5hdHRyKCduYW1lJyk7XHJcblx0XHRcdFx0dGhpcy5nYXRld2F5ID0gdGhpcy5mb3JtLmF0dHIoJ2FjdGlvbicpO1xyXG5cdFx0XHRcdHRoaXMuZ3RtQ2F0ZWdvcnkgPSB0aGlzLmZvcm0uYXR0cignZ3RtY2F0ZWdvcnknKTtcclxuXHJcblx0XHRcdFx0dGhpcy5mb3JtRmlvID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9OQU1FXCJdJyk7XHJcblx0XHRcdFx0dGhpcy5mb3JtSW5uID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9JTk5cIl0nKTtcclxuXHRcdFx0XHR0aGlzLmZvcm1QaG9uZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fUEhPTkVcIl0nKTtcclxuXHRcdFx0XHR0aGlzLmZvcm1FbWFpbCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRU1BSUxcIl0nKTtcclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRMb2FkRm9ybSA9PSBcImZ1bmN0aW9uXCIpe1xyXG5cdFx0XHRcdFx0R1RNcHVzaEV2ZW50TG9hZEZvcm0odGhpcy5mb3JtTmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZih0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiAhdGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlLW5vbXNnJykpIHtcclxuXHRcdFx0XHRcdHRoaXMuZm9ybS52YWxpZGF0ZSh3aW5kb3cuYXBwbGljYXRpb24udmFsaWRhdGVPcHRpb25zRGVmYXVsdCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuZm9ybS52YWxpZGF0ZSh3aW5kb3cuYXBwbGljYXRpb24udmFsaWRhdGVPcHRpb25zTm9Nc2cpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9JUFwiXScpLnZhbChHZW8uaXApO1xyXG5cclxuXHRcdFx0XHR0aGlzLmZvcm1Ub3VjaEV2ZW50KCk7XHJcblxyXG5cdFx0XHRcdHRoaXMub24odGhpcy5mb3JtLCAnc3VibWl0JywgJ3N1Ym1pdEZvcm0nKTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuZm9ybUZpbykge1xyXG5cdFx0XHRcdFx0dGhpcy5vbih0aGlzLmZvcm1GaW8sICdjaGFuZ2UnLCAnY2hhbmdlTmFtZScpO1xyXG5cdFx0XHRcdFx0dGhpcy5vbmNlTmFtZVNlbmQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5mb3JtSW5uKSB7XHJcblx0XHRcdFx0XHR0aGlzLm9uKHRoaXMuZm9ybUlubiwgJ2NoYW5nZScsICdjaGFuZ2VJbm4nKTtcclxuXHRcdFx0XHRcdHRoaXMub25jZUlublNlbmQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5mb3JtUGhvbmUpIHtcclxuXHRcdFx0XHRcdHRoaXMub24odGhpcy5mb3JtUGhvbmUsICdjaGFuZ2UnLCAnY2hhbmdlUGhvbmUnKTtcclxuXHRcdFx0XHRcdHRoaXMub25jZVBob25lU2VuZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLmZvcm1FbWFpbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5vbih0aGlzLmZvcm1FbWFpbCwgJ2NoYW5nZScsICdjaGFuZ2VFbWFpbCcpO1xyXG5cdFx0XHRcdFx0dGhpcy5vbmNlRW1haWxTZW5kID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRjaGFuZ2VOYW1lOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZU5hbWVTZW5kKSB7XHJcblx0XHRcdFx0XHRHVE1wdXNoRXZlbnRUb3VjaEZvcm0odGhpcy5mb3JtTmFtZSwgdGhpcy5ndG1DYXRlZ29yeSwgJ0ZPUk1fTkFNRScpO1xyXG5cdFx0XHRcdFx0dGhpcy5vbmNlTmFtZVNlbmQgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGNoYW5nZUlubjogZnVuY3Rpb24gKGVsLCBldikge1xyXG5cdFx0XHRcdGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiB0aGlzLm9uY2VJbm5TZW5kKSB7XHJcblx0XHRcdFx0XHRHVE1wdXNoRXZlbnRUb3VjaEZvcm0odGhpcy5mb3JtTmFtZSwgdGhpcy5ndG1DYXRlZ29yeSwgJ0ZPUk1fSU5OJyk7XHJcblx0XHRcdFx0XHR0aGlzLm9uY2VJbm5TZW5kID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjaGFuZ2VQaG9uZTogZnVuY3Rpb24gKGVsLCBldikge1xyXG5cdFx0XHRcdGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiB0aGlzLm9uY2VQaG9uZVNlbmQpIHtcclxuXHRcdFx0XHRcdEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9QSE9ORScpO1xyXG5cdFx0XHRcdFx0dGhpcy5vbmNlUGhvbmVTZW5kID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjaGFuZ2VFbWFpbDogZnVuY3Rpb24gKGVsLCBldikge1xyXG5cdFx0XHRcdGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiB0aGlzLm9uY2VFbWFpbFNlbmQpIHtcclxuXHRcdFx0XHRcdEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9FTUFJTCcpO1xyXG5cdFx0XHRcdFx0dGhpcy5vbmNlRW1haWxTZW5kID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Zm9ybVRvdWNoRXZlbnQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzLCBmb3JtSW5wdXRzID0gdGhpcy5mb3JtLmZpbmQoJzppbnB1dCcpO1xyXG5cclxuXHRcdFx0XHRzZWxmLmZvcm1Ub3VjaCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRmb3JtSW5wdXRzLm9uKCdmb2N1cycsIHNlbmRUb3VjaEV2ZW50KTtcclxuXHRcdFx0XHRmb3JtSW5wdXRzLm9uKCdjaGFuZ2UnLCBzZW5kVG91Y2hFdmVudCk7XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIHNlbmRUb3VjaEV2ZW50ICgpIHtcclxuXHRcdFx0XHRcdGlmICghc2VsZi5mb3JtVG91Y2gpIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5mb3JtVG91Y2ggPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRmb3JtSW5wdXRzLm9mZignZm9jdXMnLCBzZW5kVG91Y2hFdmVudCk7XHJcblx0XHRcdFx0XHRcdGZvcm1JbnB1dHMub2ZmKCdjaGFuZ2UnLCBzZW5kVG91Y2hFdmVudCk7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50VG91Y2hGb3JtID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0XHRHVE1wdXNoRXZlbnRUb3VjaEZvcm0oc2VsZi5mb3JtTmFtZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzdWJtaXRGb3JtOiBmdW5jdGlvbihlbCwgZXYpIHtcclxuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRpZih0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiAhdGhpcy5mb3JtLnZhbGlkKCkpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50RXJyb3JGb3JtID09IFwiZnVuY3Rpb25cIil7XHJcblx0XHRcdFx0XHRcdEdUTXB1c2hFdmVudEVycm9yRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuZm9ybS5zdGFydFdhaXRpbmcoKTtcclxuXHJcblx0XHRcdFx0JC5wb3N0KHRoaXMuZ2F0ZXdheSwgdGhpcy5mb3JtLnNlcmlhbGl6ZSgpLCBmdW5jdGlvbigpe30sICdqc29uJylcclxuXHRcdFx0XHRcdC5kb25lKHRoaXMucHJveHkoJ2RvbmVTdWJtaXQnKSlcclxuXHRcdFx0XHRcdC5mYWlsKHRoaXMucHJveHkoJ2ZhaWxTdWJtaXQnKSk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuXHRcdFx0ZG9uZVN1Ym1pdDogZnVuY3Rpb24gKHJlcyl7XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50U2VuZEZvcm0gPT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0XHRcdEdUTXB1c2hFdmVudFNlbmRGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnkpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JC5mYW5jeWJveCh7XHJcblx0XHRcdFx0XHR3cmFwQ1NTIDogJ21vZGFsLXdyYXBwZXInLFxyXG5cdFx0XHRcdFx0bWFyZ2luIDogKCQod2luZG93KS53aWR0aCgpID4gOTM3KSA/IDIwIDogNSxcclxuXHRcdFx0XHRcdHBhZGRpbmcgOiAxNSxcclxuXHRcdFx0XHRcdGhlbHBlcnMgOiB7XHJcblx0XHRcdFx0XHRcdG92ZXJsYXkgOiB7XHJcblx0XHRcdFx0XHRcdFx0Y3NzIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0J2JhY2tncm91bmQnIDogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnY29udGVudCcgOiAkKHJlcy5odG1sKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0ZmFpbFN1Ym1pdDogZnVuY3Rpb24gKHJlcyl7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRFcnJvckZvcm0gPT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0XHRcdEdUTXB1c2hFdmVudEVycm9yRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50Lmh0bWwoJChyZXMucmVzcG9uc2VUZXh0KS5odG1sKCkpO1xyXG5cdFx0XHRcdC8vdGhpcy5mb3JtID0gdGhpcy5lbGVtZW50LmZpbmQoJ2Zvcm0nKTtcclxuXHRcdFx0XHQvL3RoaXMuZ2F0ZXdheSA9IHRoaXMuZm9ybS5hdHRyKCdhY3Rpb24nKTtcclxuXHRcdFx0XHQvL3RoaXMub24odGhpcy5mb3JtLCAnc3VibWl0JywgJ3N1Ym1pdEZvcm0nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLlBheW1lbnQgPSBBcHAuUGF5bWVudCB8fCB7fTtcclxuXHRBcHAuUGF5bWVudC5JbnB1dCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFBheW1lbnRJbnB1dCcsXHJcblx0XHRcdGRlZmF1bHRzOiB7XHJcblx0XHRcdFx0Z2F0ZXdheTogJy9hamF4L2Zvcm1zL3BheW1lbnQvJ1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Ly90aGlzLmVsZW1lbnQudmFsaWRhdGUod2luZG93LmFwcGxpY2F0aW9uLnZhbGlkYXRlT3B0aW9uc0RlZmF1bHQpO1xyXG5cdFx0XHRcdHRoaXMub24odGhpcy5lbGVtZW50LCAnc3VibWl0JywgJ3N1Ym1pdEZvcm0nKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHN1Ym1pdEZvcm06IGZ1bmN0aW9uKGVsLCBldikge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdGlmKHRoaXMuZWxlbWVudC5kYXRhKCd2YWxpZGF0ZScpICYmICF0aGlzLmVsZW1lbnQudmFsaWQoKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LnN0YXJ0V2FpdGluZygpO1xyXG5cclxuXHRcdFx0XHR2YXIgcG9zdERhdGEgPSB7IGFjdGlvbjogJ2dldEZvcm0nLCBzdW1tOiB0aGlzLmVsZW1lbnQuZmluZCgnI3BheW1lbnQtc3VtJykudmFsKCksIHNlcnZpY2U6IHRoaXMuZWxlbWVudC5maW5kKCcjcGF5bWVudC1zZXJ2aWNlJykudmFsKCkgfTtcclxuXHJcblx0XHRcdFx0JC5wb3N0KHRoaXMub3B0aW9ucy5nYXRld2F5LCBwb3N0RGF0YSwgZnVuY3Rpb24oKXt9KVxyXG5cdFx0XHRcdFx0LmRvbmUodGhpcy5wcm94eSgnZG9uZVN1Ym1pdCcpKVxyXG5cdFx0XHRcdFx0LmZhaWwodGhpcy5wcm94eSgnZmFpbFN1Ym1pdCcpKTtcclxuXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRmYWlsU3VibWl0OiBmdW5jdGlvbiAocmVzKXtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZW5kV2FpdGluZygpO1xyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGRvbmVTdWJtaXQ6IGZ1bmN0aW9uIChyZXMpe1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5lbmRXYWl0aW5nKCk7XHJcblx0XHRcdFx0JC5mYW5jeWJveCh7XHJcblx0XHRcdFx0XHR3cmFwQ1NTIDogJ21vZGFsLXdyYXBwZXInLFxyXG5cdFx0XHRcdFx0bWFyZ2luIDogKCQod2luZG93KS53aWR0aCgpID4gOTM3KSA/IDIwIDogNSxcclxuXHRcdFx0XHRcdHBhZGRpbmcgOiAxNSxcclxuXHRcdFx0XHRcdGhlbHBlcnMgOiB7XHJcblx0XHRcdFx0XHRcdG92ZXJsYXkgOiB7XHJcblx0XHRcdFx0XHRcdFx0Y3NzIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0J2JhY2tncm91bmQnIDogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRiZWZvcmVTaG93IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5hcHBsaWNhdGlvbi5pbnN0YWxsQ29udHJvbGxlcignLmpzLWZvcm0tYWpheC1wYXltZW50JywgJ2FwcFBheW1lbnRGb3JtQWpheCcpO1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdjb250ZW50JyA6ICQocmVzKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuUGF5bWVudCA9IEFwcC5QYXltZW50IHx8IHt9O1xyXG5cdEFwcC5QYXltZW50Llplcm9SZXBvcnRJbnB1dCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFBheW1lbnRaZXJvUmVwb3J0SW5wdXQnLFxyXG5cdFx0XHRkZWZhdWx0czoge1xyXG5cdFx0XHRcdGdhdGV3YXk6ICcvYWpheC9mb3Jtcy9wYXltZW50LydcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdC8vdGhpcy5lbGVtZW50LnZhbGlkYXRlKHdpbmRvdy5hcHBsaWNhdGlvbi52YWxpZGF0ZU9wdGlvbnNEZWZhdWx0KTtcclxuXHRcdFx0XHR0aGlzLm9uKHRoaXMuZWxlbWVudCwgJ3N1Ym1pdCcsICdzdWJtaXRGb3JtJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzdWJtaXRGb3JtOiBmdW5jdGlvbihlbCwgZXYpIHtcclxuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRpZih0aGlzLmVsZW1lbnQuZGF0YSgndmFsaWRhdGUnKSAmJiAhdGhpcy5lbGVtZW50LnZhbGlkKCkpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5zdGFydFdhaXRpbmcoKTtcclxuXHJcblx0XHRcdFx0dmFyIHBvc3REYXRhID0gQXBwLlplcm9XZWJGb3JtVmFsdWVzO1xyXG5cclxuXHRcdFx0XHQkLnBvc3QodGhpcy5vcHRpb25zLmdhdGV3YXksIHBvc3REYXRhLCBmdW5jdGlvbigpe30pXHJcblx0XHRcdFx0XHQuZG9uZSh0aGlzLnByb3h5KCdkb25lU3VibWl0JykpXHJcblx0XHRcdFx0XHQuZmFpbCh0aGlzLnByb3h5KCdmYWlsU3VibWl0JykpO1xyXG5cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGZhaWxTdWJtaXQ6IGZ1bmN0aW9uIChyZXMpe1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5lbmRXYWl0aW5nKCk7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXMpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0ZG9uZVN1Ym1pdDogZnVuY3Rpb24gKHJlcyl7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmVuZFdhaXRpbmcoKTtcclxuXHRcdFx0XHQkLmZhbmN5Ym94KHtcclxuXHRcdFx0XHRcdHdyYXBDU1MgOiAnbW9kYWwtd3JhcHBlcicsXHJcblx0XHRcdFx0XHRtYXJnaW4gOiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5MzcpID8gMjAgOiA1LFxyXG5cdFx0XHRcdFx0cGFkZGluZyA6IDE1LFxyXG5cdFx0XHRcdFx0aGVscGVycyA6IHtcclxuXHRcdFx0XHRcdFx0b3ZlcmxheSA6IHtcclxuXHRcdFx0XHRcdFx0XHRjc3MgOiB7XHJcblx0XHRcdFx0XHRcdFx0XHQnYmFja2dyb3VuZCcgOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGJlZm9yZVNob3cgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0d2luZG93LmFwcGxpY2F0aW9uLmluc3RhbGxDb250cm9sbGVyKCcuanMtZm9ybS1hamF4LXBheW1lbnQnLCAnYXBwUGF5bWVudEZvcm1BamF4Jyk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2NvbnRlbnQnIDogJChyZXMpXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5QYXltZW50ID0gQXBwLlBheW1lbnQgfHwge307XHJcblx0QXBwLlBheW1lbnQuSW5wdXQgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBQYXltZW50Rm9ybVplcm9UeXBlJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHtcclxuXHRcdFx0XHRnYXRld2F5OiAnL2FqYXgvZm9ybXMvY29udGFjdF91c196ZXJvX29yZGVyLydcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMub24odGhpcy5lbGVtZW50LCAnc3VibWl0JywgJ3N1Ym1pdEZvcm0nKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHN1Ym1pdEZvcm06IGZ1bmN0aW9uKGVsLCBldikge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5zdGFydFdhaXRpbmcoKTtcclxuXHJcblx0XHRcdFx0Y29uc29sZS5sb2coQXBwLlplcm9XZWJGb3JtVmFsdWVzKTtcclxuXHJcblx0XHRcdFx0LyogdmFyIHBvc3REYXRhID0geyBhY3Rpb246ICdnZXRGb3JtJywgc3VtOiB0aGlzLmVsZW1lbnQuZmluZCgnI3BheW1lbnQtc3VtJykudmFsKCksIHNlcnZpY2U6IHRoaXMuZWxlbWVudC5maW5kKCcjcGF5bWVudC1zZXJ2aWNlJykudmFsKCkgfTtcclxuXHJcblx0XHRcdFx0JC5wb3N0KHRoaXMub3B0aW9ucy5nYXRld2F5LCBwb3N0RGF0YSwgZnVuY3Rpb24oKXt9KVxyXG5cdFx0XHRcdFx0LmRvbmUodGhpcy5wcm94eSgnZG9uZVN1Ym1pdCcpKVxyXG5cdFx0XHRcdFx0LmZhaWwodGhpcy5wcm94eSgnZmFpbFN1Ym1pdCcpKTtcclxuXHRcdFx0XHRcdCovXHJcblxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0ZmFpbFN1Ym1pdDogZnVuY3Rpb24gKHJlcyl7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmVuZFdhaXRpbmcoKTtcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yKHJlcyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRkb25lU3VibWl0OiBmdW5jdGlvbiAocmVzKXtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZW5kV2FpdGluZygpO1xyXG5cdFx0XHRcdCQuZmFuY3lib3goe1xyXG5cdFx0XHRcdFx0d3JhcENTUyA6ICdtb2RhbC13cmFwcGVyJyxcclxuXHRcdFx0XHRcdG1hcmdpbiA6ICgkKHdpbmRvdykud2lkdGgoKSA+IDkzNykgPyAyMCA6IDUsXHJcblx0XHRcdFx0XHRwYWRkaW5nIDogMTUsXHJcblx0XHRcdFx0XHRoZWxwZXJzIDoge1xyXG5cdFx0XHRcdFx0XHRvdmVybGF5IDoge1xyXG5cdFx0XHRcdFx0XHRcdGNzcyA6IHtcclxuXHRcdFx0XHRcdFx0XHRcdCdiYWNrZ3JvdW5kJyA6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0YmVmb3JlU2hvdyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cuYXBwbGljYXRpb24uaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1mb3JtLWFqYXgtcGF5bWVudCcsICdhcHBQYXltZW50Rm9ybUFqYXgnKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnY29udGVudCcgOiAkKHJlcylcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLlBheW1lbnQgPSBBcHAuUGF5bWVudCB8fCB7fTtcclxuXHRBcHAuUGF5bWVudC5Qcm9wc1NldCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFBheW1lbnRGb3JtWmVyb1Byb3BzU2V0J1xyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHR0aGlzLmFjdGlvbk1ldGhvZCA9IHRoaXMuZWxlbWVudC5kYXRhKCdwcm9wLWFjdCcpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmFyUHJvcHMgPSB0aGlzLmVsZW1lbnQuZGF0YSgncHJvcCcpID8gdGhpcy5lbGVtZW50LmRhdGEoJ3Byb3AnKS5zcGxpdCgnfCcpIDogZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5hclZhbHMgPSB0aGlzLmVsZW1lbnQuZGF0YSgndmFsJykgPyB0aGlzLmVsZW1lbnQuZGF0YSgndmFsJykuc3BsaXQoJ3wnKSA6IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5hclByb3BzICYmIHRoaXMuYXJWYWxzKSB7XHJcblxyXG5cdFx0XHRcdFx0c3dpdGNoICh0aGlzLmFjdGlvbk1ldGhvZCkge1xyXG5cdFx0XHRcdFx0XHRjYXNlICdjbGljayc6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5vbih0aGlzLmVsZW1lbnQsICdjbGljaycsICdzZXRCeUNsaWNrJyk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ2NoYW5nZSc6XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0sXHJcblxyXG5cclxuXHRcdFx0c2V0QnlDbGljazogZnVuY3Rpb24gKGVsLCBldikge1xyXG5cclxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRcdHRoaXMuYXJQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wLGkpIHtcclxuXHRcdFx0XHRcdGlmKHR5cGVvZiBzZWxmLmFyVmFsc1tpXSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXNbcHJvcF0gPSBzZWxmLmFyVmFsc1tpXTtcclxuXHRcdFx0XHRcdFx0Q29va2llcy5zZXQoJ1plcm9XZWJGb3JtVmFsdWVzXycrcHJvcCxzZWxmLmFyVmFsc1tpXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgJCgnLmZhbmN5ZnVsbCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAkKCc8ZGl2IGNsYXNzPVwiZmFuY3lmdWxsLS1pbWFnZVwiPjwvZGl2PicpLmluc2VydEJlZm9yZSgkKHRoaXMpKS5hcHBlbmQoJCh0aGlzKS5yZW1vdmUoKSk7XHJcbiAgfSk7XHJcblxyXG5cclxuICBpZigkKCcuanMtZmluYW5jZS1zbGlkZXInKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBmaW5hbmNlT3dsID0gJCgnLmpzLWZpbmFuY2Utc2xpZGVyJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICBpdGVtcyAgICAgIDogMSxcclxuICAgICAgbG9vcCAgICAgICA6IHRydWUsXHJcbiAgICAgIG5hdiAgICAgICAgOiB0cnVlLFxyXG4gICAgICBkb3RzICAgICAgIDogdHJ1ZSxcclxuICAgICAgZG90c1NwZWVkICA6IDgwMCxcclxuICAgICAgYXV0b3BsYXkgICA6IHRydWUsXHJcbiAgICAgIGF1dG9wbGF5VGltZW91dDogNTAwMCxcclxuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlOiB0cnVlLFxyXG4gICAgICBhdXRvSGVpZ2h0IDogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuICAgIGZpbmFuY2VPd2wub24oJ2NoYW5nZWQub3dsLmNhcm91c2VsJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBmaW5hbmNlT3dsLnRyaWdnZXIoJ3N0b3Aub3dsLmF1dG9wbGF5Jyk7XHJcbiAgICAgIGZpbmFuY2VPd2wudHJpZ2dlcigncGxheS5vd2wuYXV0b3BsYXknKTtcclxuICAgICAgJCgnLmpzLWZpbmFuY2Utc2xpZGVyJykuZmluZCgnaW1nLmx6eV9pbWcnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgJCh0aGlzKS5hdHRyKCdzcmMnLCAkKHRoaXMpLmRhdGEoJ3NyYycpKTtcclxuICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2x6eV9pbWcnKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmaW5hbmNlT3dsLm9uKCdpbml0aWFsaXplZC5vd2wuY2Fyb3VzZWwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgJCgnLmpzLWZpbmFuY2Utc2xpZGVyJykuZmluZCgnaW1nLmx6eV9pbWcnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsICQodGhpcykuZGF0YSgnc3JjJykpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdsenlfaW1nJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlmKCQoJy5qcy1hY2NvcmRpb25fX2l0ZW0nKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggPT0gJyNiaWctYnVzaW5lc3MnKSB7XHJcbiAgICAgICQoJy5qcy1hY2NvcmRpb25fX2l0ZW0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkKCcuanMtYWNjb3JkaW9uX19kZXNjcmlwdGlvbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICQodGhpcykuaGlkZSgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQoJy5qcy1hY2NvcmRpb25fX2l0ZW1bZGF0YS1oYXNoPVwiYmlnLWJ1c2luZXNzXCJdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJCgnLmpzLWFjY29yZGlvbl9fZGVzY3JpcHRpb25bZGF0YS1oYXNoPVwiYmlnLWJ1c2luZXNzXCJdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgJCh0aGlzKS5zaG93KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1maW5hbmNlLS1ibG9jay12ZXJzaW9uX29wZW5fbW9iaWxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZWwgPSAkKHRoaXMpLnBhcmVudCgnZGl2JyksXHJcbiAgICAgICAgY3VySGVpZ2h0ID0gZWwuaGVpZ2h0KCksXHJcbiAgICAgICAgYXV0b0hlaWdodCA9IGVsLmNzcygnaGVpZ2h0JywgJ2F1dG8nKS5oZWlnaHQoKTtcclxuICAgIGlmKGVsLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgZWwuaGVpZ2h0KGN1ckhlaWdodCkuYW5pbWF0ZSh7aGVpZ2h0IDogNzR9LCAxMDAwKTtcclxuICAgICAgZWwucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsLmhlaWdodChjdXJIZWlnaHQpLmFuaW1hdGUoe2hlaWdodCA6IGF1dG9IZWlnaHR9LCAxMDAwLCBmdW5jdGlvbigpIHsgZWwuaGVpZ2h0KCdhdXRvJyk7IH0pO1xyXG4gICAgICBlbC5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBpZigkKCcuZmluYW5jZS0tYmxvY2stYmFua190aW1lX3RpdGxlJykgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgdmFyIGZpbmFuY2VOdW1BbmltYXRlU3RhcnQgPSBmYWxzZTtcclxuXHJcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoZmluYW5jZUNoZWNrUG9zaXRpb24oKSAmJiAhZmluYW5jZU51bUFuaW1hdGVTdGFydCkge1xyXG4gICAgICAgIGZpbmFuY2VOdW1BbmltYXRlU3RhcnQgPSB0cnVlO1xyXG4gICAgICAgIGZpbmFuY2VOdW1BbmltYXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChmaW5hbmNlQ2hlY2tQb3NpdGlvbigpKSB7XHJcbiAgICAgIGZpbmFuY2VOdW1BbmltYXRlU3RhcnQgPSB0cnVlO1xyXG4gICAgICBmaW5hbmNlTnVtQW5pbWF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1pbWctYWNjb3VudGluZy1tb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYoJCh3aW5kb3cpLndpZHRoKCkgPD0gNzY4KSB7XHJcbiAgICAgIHZhciBwc3dwRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wc3dwJylbMF07XHJcblxyXG4gICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICBjbG9zZU9uU2Nyb2xsICAgICAgIDogZmFsc2UsXHJcbiAgICAgICAgY2xvc2VPblZlcnRpY2FsRHJhZyA6IGZhbHNlLFxyXG4gICAgICAgIHBpbmNoVG9DbG9zZSAgICAgICAgOiBmYWxzZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIHN3aXBlSW1hZ2UgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHJcbiAgICAgIHZhciB0bXBJbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgIHRtcEltZy5zcmMgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgJCh0bXBJbWcpLm9uZSgnbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG9yZ1dpZHRoID0gdG1wSW1nLndpZHRoO1xyXG4gICAgICAgIG9yZ0hlaWdodCA9IHRtcEltZy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHZhciBzd2lwZUl0ZW1zID0gW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmMgOiBzd2lwZUltYWdlLFxyXG4gICAgICAgICAgICB3ICAgOiBvcmdXaWR0aCxcclxuICAgICAgICAgICAgaCAgIDogb3JnSGVpZ2h0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdmFyIGdhbGxlcnkgPSBuZXcgUGhvdG9Td2lwZShwc3dwRWxlbWVudCwgUGhvdG9Td2lwZVVJX0RlZmF1bHQsIHN3aXBlSXRlbXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIGdhbGxlcnkuaW5pdCgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ2FbaHJlZiQ9XCIjYmlnLWJ1c2luZXNzXCJdJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZih3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT0gJy9maW5hbmNlLW91dHNvdXJjaW5nLycpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnI2JpZy1idXNpbmVzcyc7XHJcbiAgICAgIGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qJCgnLmpzLWFjY29yZGlvbl9faXRlbScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJy5qcy1hY2NvcmRpb25fX2Rlc2NyaXB0aW9uJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAkKHRoaXMpLmhpZGUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJy5qcy1hY2NvcmRpb25fX2l0ZW1bZGF0YS1oYXNoPVwiYmlnLWJ1c2luZXNzXCJdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnLmpzLWFjY29yZGlvbl9fZGVzY3JpcHRpb25bZGF0YS1oYXNoPVwiYmlnLWJ1c2luZXNzXCJdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgICAkKHRoaXMpLnNob3coKTtcclxuICAgIH0pOyovXHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZmluYW5jZU51bUFuaW1hdGUoKSB7XHJcbiAgdmFyIGN1clRpbWVJdGVtID0gMDtcclxuXHJcbiAgJCgnLmZpbmFuY2UtLWJsb2NrLWJhbmtfdGltZV90aXRsZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgIHZhciB0aW1lID0gMDtcclxuXHJcbiAgICBpZighJChlbGVtZW50KS5oYXNDbGFzcygnZmluYW5jZS0tYmxvY2stYmFua190aW1lX3RpdGxlX2ZpbmFsJykpIHtcclxuICAgICAgdmFyIHRpbWVvdXRMaXN0ID0gW1xyXG4gICAgICAgIDEwMCxcclxuICAgICAgICAyNSxcclxuICAgICAgICAxMDBcclxuICAgICAgXTtcclxuXHJcbiAgICAgIHZhciB0aW1lcklkMSA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PSBjdXJUaW1lSXRlbSkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS50ZXh0KHRpbWUgKyAnINC80LjQvScpO1xyXG5cclxuICAgICAgICAgIGlmIChpbmRleCA9PSAxICYmIHRpbWUgPj0gNDApIHtcclxuICAgICAgICAgICAgJChlbGVtZW50KS5hZGRDbGFzcygnZmluYW5jZS0tYmxvY2stYmFua190aW1lX3RpdGxlX2ZpbmFsJyk7XHJcbiAgICAgICAgICAgIGN1clRpbWVJdGVtKys7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXJJZDEpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aW1lID49IDEwICYmIGluZGV4ICE9IDEpIHtcclxuICAgICAgICAgICAgJChlbGVtZW50KS5hZGRDbGFzcygnZmluYW5jZS0tYmxvY2stYmFua190aW1lX3RpdGxlX2ZpbmFsJyk7XHJcbiAgICAgICAgICAgIGN1clRpbWVJdGVtKys7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXJJZDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGltZSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgdGltZW91dExpc3RbaW5kZXhdKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluYW5jZUNoZWNrUG9zaXRpb24oKXtcclxuICAvLyDQutC+0L7RgNC00LjQvdCw0YLRiyDQtNC40LLQsFxyXG4gIHZhciBkaXZfcG9zaXRpb24gPSAkKCcuZmluYW5jZS0tYmxvY2stYmFua190aW1lX2NvbnRhaW5lcicpLm9mZnNldCgpO1xyXG4gIC8vINC+0YLRgdGC0YPQvyDRgdCy0LXRgNGF0YNcclxuICB2YXIgZGl2X3RvcCA9IGRpdl9wb3NpdGlvbi50b3A7XHJcbiAgLy8g0L7RgtGB0YLRg9C/INGB0LvQtdCy0LBcclxuICB2YXIgZGl2X2xlZnQgPSBkaXZfcG9zaXRpb24ubGVmdDtcclxuICAvLyDRiNC40YDQuNC90LBcclxuICB2YXIgZGl2X3dpZHRoID0gJCgnLmZpbmFuY2UtLWJsb2NrLWJhbmtfdGltZV9jb250YWluZXInKS53aWR0aCgpO1xyXG4gIC8vINCy0YvRgdC+0YLQsFxyXG4gIHZhciBkaXZfaGVpZ2h0ID0gJCgnLmZpbmFuY2UtLWJsb2NrLWJhbmtfdGltZV9jb250YWluZXInKS5oZWlnaHQoKTtcclxuXHJcbiAgLy8g0L/RgNC+0YHQutGA0L7Qu9C70LXQvdC+INGB0LLQtdGA0YXRg1xyXG4gIHZhciB0b3Bfc2Nyb2xsID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgLy8g0L/RgNC+0YHQutGA0L7Qu9C70LXQvdC+INGB0LvQtdCy0LBcclxuICB2YXIgbGVmdF9zY3JvbGwgPSAkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCk7XHJcbiAgLy8g0YjQuNGA0LjQvdCwINCy0LjQtNC40LzQvtC5INGB0YLRgNCw0L3QuNGG0YtcclxuICB2YXIgc2NyZWVuX3dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgLy8g0LLRi9GB0L7RgtCwINCy0LjQtNC40LzQvtC5INGB0YLRgNCw0L3QuNGG0YtcclxuICB2YXIgc2NyZWVuX2hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgLy8g0LrQvtC+0YDQtNC40L3QsNGC0Ysg0YPQs9C70L7QsiDQstC40LTQuNC80L7QuSDQvtCx0LvQsNGB0YLQuFxyXG4gIHZhciBzZWVfeDEgPSBsZWZ0X3Njcm9sbDtcclxuICB2YXIgc2VlX3gyID0gc2NyZWVuX3dpZHRoICsgbGVmdF9zY3JvbGw7XHJcbiAgdmFyIHNlZV95MSA9IHRvcF9zY3JvbGw7XHJcbiAgdmFyIHNlZV95MiA9IHNjcmVlbl9oZWlnaHQgKyB0b3Bfc2Nyb2xsO1xyXG5cclxuICAvLyDQutC+0L7RgNC00LjQvdCw0YLRiyDRg9Cz0LvQvtCyINC40YHQutC+0LzQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsFxyXG4gIHZhciBkaXZfeDEgPSBkaXZfbGVmdDtcclxuICB2YXIgZGl2X3gyID0gZGl2X2xlZnQgKyBkaXZfaGVpZ2h0O1xyXG4gIHZhciBkaXZfeTEgPSBkaXZfdG9wO1xyXG4gIHZhciBkaXZfeTIgPSBkaXZfdG9wICsgZGl2X3dpZHRoO1xyXG5cclxuICBpZigkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG4gICAgc2VlX3kxID0gc2VlX3kyIC0gMTAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzZWVfeTEgKz0gNDAwO1xyXG4gIH1cclxuXHJcbiAgLy8g0L/RgNC+0LLQtdGA0LrQsCAtINCy0LjQtNC10L0g0LTQuNCyINC/0L7Qu9C90L7RgdGC0YzRjiDQuNC70Lgg0L3QtdGCXHJcbiAgaWYoIGRpdl94MSA+PSBzZWVfeDEgLyomJiBkaXZfeDIgPD0gc2VlX3gyKi8gJiYgZGl2X3kxIDw9IHNlZV95MSAvKiYmIGRpdl95MiA8PSBzZWVfeTIqLyApe1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuIiwiKGZ1bmN0aW9uICgkKSB7XHJcblxyXG5cdHZhciB1cmkgPSBuZXcgVVJJKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuXHJcblx0Ly8g0L3QsCDQvtGB0L3QvtCy0LUg0Y/Qt9GL0LrQsCDQv9C+0LTRgdGC0LDQstC70Y/QtdC8INC90YPQttC90YvQuSDQv9C10YDQtdCy0L7QtCDQtNC70Y8galF1ZXJ5INCy0LDQu9C40LTQsNGC0L7RgNGDXHJcblx0c3dpdGNoICh1cmkuc2VnbWVudCgwKSkge1xyXG5cdFx0Y2FzZSAnZW4nOlxyXG5cdFx0XHRtc2dSZXF1aXJlZCA9ICdPYmxpZ2F0b3J5IGZpZWxkIFwiI0ZJRUxEX05BTUUjXCIgbm90IGZpbGxlZCBpbi4nO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ2RlJzpcclxuXHRcdFx0bXNnUmVxdWlyZWQgPSAnUGZsaWNodGZlbGQgXCIjRklFTERfTkFNRSNcIiB3dXJkZSBuaWNodCBhdXNnZWbDvGxsdC4nO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ2ZyJzpcclxuXHRcdFx0bXNnUmVxdWlyZWQgPSAnTGUgY2hhbXAgb2JsaWdhdG9pcmUgXCIjRklFTERfTkFNRSNcIiBu4oCZZXN0IHBhcyByZW5zZWlnbsOpLic7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0bXNnUmVxdWlyZWQgPSAn0J3QtSDQt9Cw0L/QvtC70L3QtdC90L4g0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1IFwiI0ZJRUxEX05BTUUjXCIuJztcclxuXHR9XHJcblxyXG5cdCQuZXh0ZW5kKCQudmFsaWRhdG9yLm1lc3NhZ2VzLCB7XHJcblx0XHRyZXF1aXJlZDogbXNnUmVxdWlyZWQsXHJcblx0XHRlbWFpbDogJ9CS0LLQtdC00LXQvSDQvdC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0LDQtNGA0LXRgSBlbWFpbC4nLFxyXG5cdFx0bnVtYmVyOiAn0JLQstC10LTQuNGC0LUg0YfQuNGB0LvQvi4nLFxyXG4gICAgbGFuZzogdXJpLnNlZ21lbnQoMClcclxuXHR9KTtcclxufShqUXVlcnkpKTtcclxuIiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICQoZG9jdW1lbnQpLmZpbmQoJy5qcy1xdWl6LWhlbHAnKS50b29sdGlwc3Rlcih7XHJcbiAgICBzaWRlOiBbJ2JvdHRvbSddLFxyXG4gICAgdGhlbWU6IFwidG9vbHRpcHN0ZXItbGlnaHQtbmV3XCIsXHJcbiAgICBjb250ZW50QXNIVE1MOiB0cnVlLFxyXG4gICAgYW5pbWF0aW9uOiBcImZhZGVcIixcclxuICAgIGludGVyYWN0aXZlOiB0cnVlLFxyXG4gICAgbWF4V2lkdGg6IDc1MFxyXG4gIH0pO1xyXG5cclxuICAkKGRvY3VtZW50KS5maW5kKCcuanMtcXVpei1oZWxwLW1vYicpLnRvb2x0aXBzdGVyKHtcclxuICAgIHNpZGU6IFsnYm90dG9tJ10sXHJcbiAgICB0aGVtZTogXCJ0b29sdGlwc3Rlci1saWdodC1uZXdcIixcclxuICAgIGNvbnRlbnRBc0hUTUw6IHRydWUsXHJcbiAgICBhbmltYXRpb246IFwiZmFkZVwiLFxyXG4gICAgaW50ZXJhY3RpdmU6IHRydWUsXHJcbiAgICBtYXhXaWR0aDogNDAwLFxyXG4gICAgdHJpZ2dlcjpcImN1c3RvbVwiLFxyXG4gICAgdHJpZ2dlck9wZW46IHtcclxuICAgICAgY2xpY2s6IHRydWUsXHJcbiAgICAgIHRhcDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIHRyaWdnZXJDbG9zZToge1xyXG4gICAgICBjbGljazogdHJ1ZSxcclxuICAgICAgdGFwOiB0cnVlXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoZG9jdW1lbnQpLmZpbmQoJy5qcy1xdWl6LWFzaycpLnRvb2x0aXBzdGVyKHtcclxuICAgIHNpZGU6IFsnbGVmdCddLFxyXG4gICAgdGhlbWU6IFwidG9vbHRpcHN0ZXItbGlnaHQtbmV3XCIsXHJcbiAgICBjb250ZW50QXNIVE1MOiB0cnVlLFxyXG4gICAgYW5pbWF0aW9uOiBcImZhZGVcIixcclxuICAgIGludGVyYWN0aXZlOiB0cnVlLFxyXG4gICAgbWF4V2lkdGg6IDMwMCxcclxuICAgIGZ1bmN0aW9uUG9zaXRpb246IGZ1bmN0aW9uKGluc3RhbmNlLCBoZWxwZXIsIHBvc2l0aW9uKXtcclxuICAgICAgbGV0IGNvbnRhaW5lciA9ICQoJy5qcy1xdWl6LWFzaycpO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBjb250YWluZXIub2Zmc2V0ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgcG9zaXRpb24uY29vcmQudG9wID0gcG9zaXRpb24uY29vcmQudG9wICsgNzA7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSA2MDApe1xyXG4gICAgICAgICAgcG9zaXRpb24uY29vcmQubGVmdCAtPSAxMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvc2l0aW9uLnNpemUud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHBvc2l0aW9uLmNvb3JkLmxlZnQgLSAyMDtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwb3NpdGlvbjtcclxuICAgIH0sXHJcbiAgICB0cmlnZ2VyOlwiY3VzdG9tXCIsXHJcbiAgICB0cmlnZ2VyT3Blbjoge1xyXG4gICAgICBjbGljazogdHJ1ZSxcclxuICAgICAgdGFwOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgdHJpZ2dlckNsb3NlOiB7XHJcbiAgICAgIGNsaWNrOiB0cnVlLFxyXG4gICAgICB0YXA6IHRydWVcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1xdWl6LXN0ZXAtYnV0dG9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgc3RlcCA9ICQodGhpcykuZGF0YSgnc3RlcCcpO1xyXG5cclxuICAgIGlmKCEhc3RlcCkge1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncXVpel9zdGVwJywgc3RlcCk7XHJcblxyXG4gICAgICAkKCcucXVpei1jb250YWluZXInKS5oaWRlKCk7XHJcbiAgICAgICQoJy5xdWl6LWNudC1zdGVwLScgKyBzdGVwKS5zaG93KCk7XHJcblxyXG4gICAgICBsZXQgZGVzdGluYXRpb24gPSAkKCcucXVpei1jbnQtc3RlcC0nICsgc3RlcCkub2Zmc2V0KCkudG9wIC0gODA7XHJcblxyXG4gICAgICAkKCdodG1sJykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogZGVzdGluYXRpb24gfSwgNjAwKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1xdWl6LWV2ZW50LXNlbmQnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBldmVudCA9ICQodGhpcykuZGF0YSgnZXZlbnQnKTtcclxuXHJcbiAgICBpZighIWV2ZW50ICYmIHR5cGVvZiBHVE1wdXNoRXZlbnQgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBHVE1wdXNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXSwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZigkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSkge1xyXG4gICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdqcy1xdWl6LWNoZWNrLWV2ZW50LXNlbmQnKSkge1xyXG4gICAgICAgIGxldCBldmVudCA9ICQodGhpcykuZGF0YSgnZXZlbnQnKTtcclxuXHJcbiAgICAgICAgaWYoISFldmVudCAmJiB0eXBlb2YgR1RNcHVzaEV2ZW50ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgIEdUTXB1c2hFdmVudChldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkKHRoaXMpLnBhcmVudCgnLnF1aXotcmFkaW8tbGlzdCcpLmZpbmQoJy5xdWl6LXJhZGlvLXN1Ymxpc3QnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykuaGlkZSgpO1xyXG4gICAgICB9KVxyXG5cclxuICAgICAgaWYoISEkKHRoaXMpLmRhdGEoJ3N1Ymxpc3QnKSkge1xyXG4gICAgICAgICQoJCh0aGlzKS5kYXRhKCdzdWJsaXN0JykpLnNob3coKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgkKHRoaXMpLmRhdGEoJ3N1Ymxpc3QnKSkuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoJ2pzLXF1aXotYnRuJykpIHtcclxuICAgICAgaWYoJChcIi5qcy1xdWl6LWJ0bjpjaGVja2VkXCIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKCcucXVpei1idG4tY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2luYWN0aXZlJyk7XHJcbiAgICAgICAgJCgnLnF1aXotYnRuLXN1Ym1pdCcpLmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQoJy5xdWl6LWJ0bi1jb250YWluZXInKS5hZGRDbGFzcygnaW5hY3RpdmUnKTtcclxuICAgICAgICAkKCcucXVpei1idG4tc3VibWl0JykuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKCcucXVpei1yYWRpby1saXN0JykuZmluZCgnaW5wdXQnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYoISEkKHRoaXMpLmRhdGEoJ3N1Ymxpc3QnKSkge1xyXG4gICAgICBpZigkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSkge1xyXG4gICAgICAgICQoJCh0aGlzKS5kYXRhKCdzdWJsaXN0JykpLnNob3coKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKCQodGhpcykuZGF0YSgnc3VibGlzdCcpKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnLnF1aXotY2hlY2stbGlzdCcpLmZpbmQoJ2lucHV0JykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIGlmKCEhJCh0aGlzKS5kYXRhKCdzdWJsaXN0JykpIHtcclxuICAgICAgaWYoJCh0aGlzKS5wcm9wKCdjaGVja2VkJykpIHtcclxuICAgICAgICAkKCQodGhpcykuZGF0YSgnc3VibGlzdCcpKS5zaG93KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCgkKHRoaXMpLmRhdGEoJ3N1Ymxpc3QnKSkuaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgIGlmKCQod2luZG93KS53aWR0aCgpIDwgJzYwMCcpIHtcclxuICAgICAgdmFyIHF1aXpDbnRIZWlnaHQgPSAkKCcjanNfcXVpel9jbnQnKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgIGlmKCQoJy5xdWl6LWJ1dHRvbicpLmhhc0NsYXNzKCdxdWl6LWJ1dHRvbi1maXhlZCcpKSB7XHJcbiAgICAgICAgcXVpekNudEhlaWdodCArPSA5NjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoKCQoJyNqc19xdWl6X2NudCcpLm9mZnNldCgpLnRvcCAtICQod2luZG93KS5zY3JvbGxUb3AoKSkgPD0gMCAmJiAoJCgnI2pzX3F1aXpfY250Jykub2Zmc2V0KCkudG9wICsgcXVpekNudEhlaWdodCAtICQod2luZG93KS5zY3JvbGxUb3AoKSkgPiA3NTApIHtcclxuICAgICAgICAkKCcucXVpei1idXR0b24nKS5hZGRDbGFzcygncXVpei1idXR0b24tZml4ZWQnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKCcucXVpei1idXR0b24nKS5yZW1vdmVDbGFzcygncXVpei1idXR0b24tZml4ZWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKGRvY3VtZW50KS5vbignY2xpY2sgdGFwJywgJy5xdWl6LWNoZWNrLCAucXVpei1yYWRpbycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdqcy1xdWl6LWhlbHAnKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGlmKCFNb2Rlcm5penIudG91Y2gpIHtcclxuICAgICQoJy5xdWl6LWNoZWNrJykuYWRkQ2xhc3MoJ3F1aXotY2hlY2stbm8tdG91Y2gnKVxyXG4gIH1cclxufSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLlN1YnNjcmliZSA9IEFwcC5TdWJzY3JpYmUgfHwge307XHJcblx0QXBwLlN1YnNjcmliZS5Qb3B1cCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFN1YnNjcmliZVBvcHVwJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHtcclxuXHRcdFx0XHRnYXRld2F5OiAnL2FqYXgvZm9ybXMvc3Vic2NyaWJlLydcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRcdGlmKCFDb29raWVzLmdldCgnV0ExQ19VU0VSX0FETUlOJykgJiYgIUNvb2tpZXMuZ2V0KCdXQTFDX1NVQlNDUl9FTUFJTCcpICYmICFDb29raWVzLmdldCgnU3Vic2NyaWJlUG9wdXBTaG93bicpKSB7XHJcblxyXG5cdFx0XHRcdFx0c2V0VGltZW91dChcclxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRcdHNlbGYuc2hvd0Zvcm0oKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuICAgICAgICAgICAgOTAwMDBcclxuXHRcdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzaG93Rm9ybTogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQkLmZhbmN5Ym94Lm9wZW4oXHJcblx0XHRcdFx0XHR7J2hyZWYnIDogdGhpcy5vcHRpb25zLmdhdGV3YXl9LFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR0eXBlIDogJ2FqYXgnLFxyXG5cdFx0XHRcdFx0XHR3cmFwQ1NTIDogJ21vZGFsLXdyYXBwZXInLFxyXG5cdFx0XHRcdFx0XHRtYXJnaW4gOiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5MzcpID8gMjAgOiA1LFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nIDogMTUsXHJcblx0XHRcdFx0XHRcdGhlbHBlcnMgOiB7XHJcblx0XHRcdFx0XHRcdFx0b3ZlcmxheSA6IHtcclxuXHRcdFx0XHRcdFx0XHRcdGNzcyA6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0J2JhY2tncm91bmQnIDogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdGJlZm9yZVNob3cgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHR3aW5kb3cuYXBwbGljYXRpb24uaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1mb3JtLWFqYXgnLCAnYXBwV2lkZ2V0Rm9ybUFqYXgnKTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgY0V4cCA9IDEvMjQ7XHJcblx0XHRcdFx0XHRcdFx0Q29va2llcy5zZXQoJ1N1YnNjcmliZVBvcHVwU2hvd24nLCAxLCB7IGV4cGlyZXM6IGNFeHAgfSk7XHJcblx0XHRcdFx0XHRcdH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyU2hvdyA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0XHR3aW5kb3cuYXBwbGljYXRpb24uaW5zdGFsbENvbnRyb2xsZXIoJ2Zvcm1bbmFtZT1cIlBPUFVQX1NVQlNDUklQVElPTlwiXScsICdhcHBXaWRnZXRDaGVja1N1YnNjcmliZUZvcm0nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLkFjY29yZGlvbiA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldEFjY29yZGlvbicsXHJcblx0XHRcdGRlZmF1bHRzOiB7fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQgICAgdGhpcy5idG4gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWFjY29yZGlvbl9faXRlbScpO1xyXG5cdFx0XHQgICAgdGhpcy5oaWRkZW5JbmZvID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1hY2NvcmRpb25fX2Rlc2NyaXB0aW9uJyk7XHJcblxyXG5cdFx0XHQgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1hY2NvcmRpb25fX2Rlc2NyaXB0aW9uJykuZmlsdGVyKCcub3BlbicpLmF0dHIoJ3N0eWxlJywgJ2Rpc3BsYXk6IGJsb2NrOycpO1xyXG5cclxuICAgICAgICAgIHRoaXMub24odGhpcy5idG4sICdjbGljayB0b3VjaHN0YXJ0JywgJ3Nob3dIaWRlRGVzY3JpcHRpb24nKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdCdzaG93SGlkZURlc2NyaXB0aW9uJzogZnVuY3Rpb24oZWwsIGV2KSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0aWYodGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdqcy1hY2NvcmRpb24tLWVhY2gtaXRlbS1jYW4tb3BlbicpKSB7XHJcblx0XHRcdFx0XHRpZihlbC5oYXNDbGFzcygnb3BlbicpKSB7XHJcblx0XHRcdFx0XHRcdGVsLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdGVsLm5leHQodGhpcy5oaWRkZW5JbmZvKS5zbGlkZVVwKCkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGVsLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHRcdGVsLm5leHQodGhpcy5oaWRkZW5JbmZvKS5zbGlkZURvd24oKS5hZGRDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoIXRoaXMuZWxlbWVudC5oYXNDbGFzcygnanMtYWNjb3JkaW9uLS1lYWNoLWl0ZW0tY2FuLW9wZW4nKSkge1xyXG5cdFx0XHRcdFx0aWYoZWwuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG4gICAgICAgICAgICBlbC5uZXh0KHRoaXMuaGlkZGVuSW5mbykuc2xpZGVVcCg0MDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcdGVsLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgZWwubmV4dCh0aGlzLmhpZGRlbkluZm8pLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5idG4ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdFx0ZWwuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICghZWwubmV4dCgpLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCh0aGlzLmhpZGRlbkluZm8pLnNsaWRlVXAoNDAwLCBmdW5jdGlvbigpIHskKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyl9KTtcclxuXHRcdFx0XHRcdFx0XHRlbC5uZXh0KHRoaXMuaGlkZGVuSW5mbykuc2xpZGVEb3duKCkuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMuQ29zdENhbGN1bGF0b3IgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0QWNjb3VudGluZ0NhbGN1bGF0b3InLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge31cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXIgPSB0aGlzLmVsZW1lbnQuZmluZCgnLnNsaWRlcicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJFbGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJy5zbGlkZXJfX2VsZW0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyUmVzdWx0ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5zbGlkZXJfX2hlYWRlci12YWx1ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyUHJvZml0ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5zbGlkZXItcHJvZml0IC5zbGlkZXJfX2VsZW0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyRW1wbG95ZWVycyA9IHRoaXMuZWxlbWVudC5maW5kKCcuc2xpZGVyLWVtcGxveWVlcnMgLnNsaWRlcl9fZWxlbScpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyUHJvZml0UmVzdWx0ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5zbGlkZXItcHJvZml0IC5zbGlkZXJfX2hlYWRlci12YWx1ZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJFbXBsb3llZXJzUmVzdWx0ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5zbGlkZXItZW1wbG95ZWVycyAuc2xpZGVyX19oZWFkZXItdmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRheFN5c3RlbSA9IHRoaXMuZWxlbWVudC5maW5kKCcuc2VsZWN0ZWRbZGF0YS10YXhdJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gdGhpcy5lbGVtZW50LmRhdGEoJ3RpbWVvdXQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmd0bUNhdGVnb3J5ID0gdGhpcy5lbGVtZW50LmRhdGEoJ2d0bWNhdGVnb3J5JykgPyB0aGlzLmVsZW1lbnQuZGF0YSgnZ3RtY2F0ZWdvcnknKSA6ICdob21lcGFnZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5lbGVtZW50LmRhdGEoJ3BhZ2UnKSA/IHRoaXMuZWxlbWVudC5kYXRhKCdwYWdlJykgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUHVzaCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmVsZW1lbnQsICdtb3VzZWxlYXZlJywgJ3NldFB1c2gnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucHJpY2VzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIFwiNSAwMDAg4oK9IOKAkiA3IDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjIyIDAwMCDigr0g4oCSIDQyIDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjQ1IDAwMCDigr0g4oCSIDgwIDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjgwIDAwMCDigr0g4oCSIDEyOCAwMDAg4oK9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCI2NyAwMDAg4oK9IOKAkiAxMTUgMDAwIOKCvVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiMTUwIDAwMCDigr0g4oCSIDIyMCAwMDAg4oK9XCIsIC8vIDVcclxuICAgICAgICAgICAgICAgICAgICBcIjIyMCAwMDAg4oK9IOKAkiAzNTAgMDAwIOKCvVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiMzUwIDAwMCDigr0g4oCSIDUwMCAwMDAg4oK9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCLQvtGCIDUwMCAwMDAg4oK9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCLigJJcIixcclxuICAgICAgICAgICAgICAgICAgICBcItC+0YIgMjAgMDAwIOKCvVwiLCAvLyAxMFxyXG4gICAgICAgICAgICAgICAgICAgIFwiMzAgMDAwIOKCvSDigJIgNTUgMDAwIOKCvVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiNjUgMDAwIOKCvSDigJIgMTAwIDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjkwIDAwMCDigr0g4oCSIDE1MCAwMDAg4oK9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIxMDggMDAwIOKCvSDigJIgMTU2IDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjE3OSAwMDAg4oK9IOKAkiAyMjcgMDAwIOKCvVwiLCAvLyAxNVxyXG4gICAgICAgICAgICAgICAgICAgIFwiMjkxIDAwMCDigr0g4oCSIDMzOSAwMDAg4oK9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIxNjMgMDAwIOKCvSDigJIgMjMzIDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjE5MSAwMDAg4oK9IOKAkiAyNjEgMDAwIOKCvVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiMjYyIDAwMCDigr0g4oCSIDMzMiAwMDAg4oK9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIzNzQgMDAwIOKCvSDigJIgNDQ0IDAwMCDigr1cIiwgLy8gMjBcclxuICAgICAgICAgICAgICAgICAgICBcIjIzMyAwMDAg4oK9IOKAkiAzNjMgMDAwIOKCvVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiMjYxIDAwMCDigr0g4oCSIDM5MSAwMDAg4oK9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIzMzIgMDAwIOKCvSDigJIgNDYyIDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjQ0NCAwMDAg4oK9IOKAkiA1NzQgMDAwIOKCvVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiMzYzIDAwMCDigr0g4oCSIDUxMyAwMDAg4oK9XCIsIC8vIDI1XHJcbiAgICAgICAgICAgICAgICAgICAgXCIzOTEgMDAwIOKCvSDigJIgNTQxIDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjQ2MiAwMDAg4oK9IOKAkiA2MTIgMDAwIOKCvVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiNTc0IDAwMCDigr0g4oCSIDcyNCAwMDAg4oK9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIxMDMgMDAwIOKCvSDigJIgMTYzIDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIjEzMSAwMDAg4oK9IOKAkiAxOTEgMDAwIOKCvVwiLCAvLyAzMFxyXG4gICAgICAgICAgICAgICAgICAgIFwiMjAyIDAwMCDigr0g4oCSIDI2MiAwMDAg4oK9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIzMTQgMDAwIOKCvSDigJIgMzc0IDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcItC+0YIgNTEzIDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcItC+0YIgNTQxIDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgICAgICBcItC+0YIgNjEyIDAwMCDigr1cIiwgLy8gMzVcclxuICAgICAgICAgICAgICAgICAgICBcItC+0YIgNzI0IDAwMCDigr1cIixcclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJQcm9maXRFbGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJy5zbGlkZXItcHJvZml0IC5zbGlkZXJfX2VsZW0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyRW1wbEVsZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnLnNsaWRlci1lbXBsb3llZXJzIC5zbGlkZXJfX2VsZW0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmluYWxQcmljZUVsZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmNhbGxiYWNrX19oZWFkZXItdmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RoaXMuYnV0dG9uID0gdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWNhbGMtcmVzdWx0XScpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uVGF4QnV0dG9uID0gdGhpcy5lbGVtZW50LmZpbmQoJy5zZWxlY3Rpb25fX2J1dHRvbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub25jZVByb2ZpdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uY2VFbXBsb3llZXJzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJQcm9maXQuc2xpZGVyKHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlOiBcInNsb3dcIixcclxuICAgICAgICAgICAgICAgICAgICByYW5nZTogXCJtaW5cIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG1heDogMTUwLFxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2FsY1Byb2ZpdFJlc3VsdCh1aS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc3VibWl0Rm9ybSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLmJ1dHRvbi5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuYnV0dG9uLmFkZENsYXNzKCdhbmltYXRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vbmNlUHJvZml0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnB1c2hNb21lbnRFdmVudHMoWydJbmNvbWUnXSwgc2VsZi5ndG1DYXRlZ29yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9uY2VQcm9maXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyRW1wbG95ZWVycy5zbGlkZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IFwic2xvd1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiBcIm1pblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA1LFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgICAgICBtYXg6IDE1MCxcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZTogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNhbGNFbXBsUmVzdWx0KHVpLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zdWJtaXRGb3JtKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuYnV0dG9uLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2VsZi5idXR0b24uYWRkQ2xhc3MoJ2FuaW1hdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm9uY2VFbXBsb3llZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnB1c2hNb21lbnRFdmVudHMoWydFbXBsb3llZSddLCBzZWxmLmd0bUNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub25jZUVtcGxveWVlcnMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qdGhpcy5vbih0aGlzLmJ1dHRvbiwgJ21vdXNlb3ZlcicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pOyovXHJcblxyXG4gICAgICAgICAgICAgICAgLy90aGlzLm9uKHRoaXMuYnV0dG9uLCAnY2xpY2snLCAnc3VibWl0Rm9ybScpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5zZWxlY3Rpb25UYXhCdXR0b24sICdjbGljaycsICdzZWxlY3RUYXgnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1Ym1pdEZvcm0oZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYWxjUHJvZml0UmVzdWx0OiBmdW5jdGlvbiAoc2xpZGVyVmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlclJlc3VsdCA9IHRoaXMuZWxlbWVudC5maW5kKCcuc2xpZGVyLXByb2ZpdCAuc2xpZGVyX19oZWFkZXItdmFsdWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHNsaWRlclZhbHVlIDwgMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRSZXN1bHQoJ9C00L4gMTAg0LzQu9C9Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHNsaWRlclZhbHVlID49IDEwICYmIHNsaWRlclZhbHVlIDw9IDI5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50UmVzdWx0KCfQtNC+IDMwINC80LvQvScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBzbGlkZXJWYWx1ZSA+PSAzMCAmJiBzbGlkZXJWYWx1ZSA8PSA0OTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludFJlc3VsdCgn0LTQviA4MCDQvNC70L0nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Ugc2xpZGVyVmFsdWUgPj0gNTAgJiYgc2xpZGVyVmFsdWUgPD0gNzA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRSZXN1bHQoJ9C00L4gMTIwINC80LvQvScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBzbGlkZXJWYWx1ZSA+PSA3MSAmJiBzbGlkZXJWYWx1ZSA8PSA5MzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludFJlc3VsdCgn0LTQviA0MDAg0LzQu9C9Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHNsaWRlclZhbHVlID49IDk0ICYmIHNsaWRlclZhbHVlIDw9IDExNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludFJlc3VsdCgn0LTQviA4MDAg0LzQu9C9Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHNsaWRlclZhbHVlID49IDExNiAmJiBzbGlkZXJWYWx1ZSA8PSAxMzg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRSZXN1bHQoJ9C00L4gMiDQvNC70YDQtCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBzbGlkZXJWYWx1ZSA+PSAxMzk6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRSZXN1bHQoJ9Cx0L7Qu9C10LUgMiDQvNC70YDQtCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludFJlc3VsdCgn0LjQvdC00LjQstC40LTRg9Cw0LvRjNC90L4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNhbGNFbXBsUmVzdWx0OiBmdW5jdGlvbiAoc2xpZGVyVmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlclJlc3VsdCA9IHRoaXMuZWxlbWVudC5maW5kKCcuc2xpZGVyLWVtcGxveWVlcnMgLnNsaWRlcl9faGVhZGVyLXZhbHVlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBzbGlkZXJWYWx1ZSA8IDEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50UmVzdWx0KCfQtNC+IDMwINGH0LXQuycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBzbGlkZXJWYWx1ZSA+PSAxMCAmJiBzbGlkZXJWYWx1ZSA8PSA3NDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludFJlc3VsdCgn0LTQviAxMDAg0YfQtdC7Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHNsaWRlclZhbHVlID49IDc1ICYmIHNsaWRlclZhbHVlIDw9IDEzOTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludFJlc3VsdCgn0LTQviA1MDAg0YfQtdC7Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHNsaWRlclZhbHVlID49IDE0MDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludFJlc3VsdCgn0LHQvtC70LXQtSA1MDAg0YfQtdC7Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50UmVzdWx0KCfQuNC90LTQuNCy0LjQtNGD0LDQu9GM0L3QvicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJpbnRSZXN1bHQ6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlclJlc3VsdC5odG1sKHRleHQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWJtaXRGb3JtOiBmdW5jdGlvbiAoZXYpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0YXhTeXN0ZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnLnNlbGVjdGVkW2RhdGEtdGF4XScpLmRhdGEoJ3RheCcpO1xyXG4gICAgICAgICAgICAgICAgdWlWYWx1ZSA9IHRoaXMuc2xpZGVyUHJvZml0RWxlbS5zbGlkZXIoXCJ2YWx1ZVwiKTtcclxuICAgICAgICAgICAgICAgIHVpVmFsdWUyID0gdGhpcy5zbGlkZXJFbXBsRWxlbS5zbGlkZXIoXCJ2YWx1ZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmUodWlWYWx1ZSwgdWlWYWx1ZTIsIHRheFN5c3RlbSk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMucGFnZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChldikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKmlmICh0eXBlb2YgR1RNcHVzaEV2ZW50ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudCgnRm9ybV9BY2NvdW50aW5nX0NhbGN1bGF0b3JfRXh0ZW5kZWRfQ2xpY2tfU2hvd19SZXN1bHQnLCB0aGlzLmd0bUNhdGVnb3J5LCAnRm9ybV9BY2NvdW50aW5nX0NhbGN1bGF0b3JfRXh0ZW5kZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuYnV0dG9uLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7IC8vINCf0L7RgdC70LUg0YDRg9GH0L3QvtCz0L4g0YDQsNGB0YfQtdGC0LAg0LTQtdCw0LrRgtC40LLQuNGA0LXQvCDQutC90L7Qv9C60YNcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuYnV0dG9uLnJlbW92ZUNsYXNzKCdhbmltYXRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2UgPT0gJ2FjY291bnRpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDRgdGC0YDQsNC90LjRhtGLINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQstGL0LHRgNCw0L3QvdGL0YUg0LfQvdCw0YfQtdC90LjQuSDQsiDQutCw0LvRjNC60YPQu9GP0YLQvtGA0LUg0LTQu9GPINGB0YLRgNCw0L3QuNGG0YsgYWNjb3VudGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodWlWYWx1ZSA8PSAxMTUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTFdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xMS0xXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTRdJykuc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWNvbnRlbnQtdGFic10nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS10YWJzLWJ0bl0nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTE4XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjFdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMS0yXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTldJykuaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTddJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xOF0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTIxXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjEtMV0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTIyXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjItMV0nKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtYnRuLWlubm92YXRpb25zPTNdJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1jb250ZW50LWlubm92YXRpb25zPTNdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWJ0bi1pbm5vdmF0aW9ucz0xXScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtYnRuLWlubm92YXRpb25zPTJdJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1jb250ZW50LWlubm92YXRpb25zPTFdJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC1pbm5vdmF0aW9ucz0yXScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1jb250ZW50LXRhYnM9Ml0nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS10YWJzLWJ0bj0yXScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWNvbnRlbnQtdGFicz0xXSwgW2RhdGEtY29udGVudC10YWJzPTNdJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtdGFicy1idG49MV0sIFtkYXRhLXRhYnMtYnRuPTNdJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1aVZhbHVlMiA+PSA3NSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTldJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTddJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MThdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjBdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjItMV0nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMS0xXScpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMV0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMl0nKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWNvbnRlbnQtdGFic10nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtdGFicy1idG5dJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTFdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTEtMV0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xNF0nKS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWNvbnRlbnQtdGFicz0zXScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS10YWJzLWJ0bj0zXScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MThdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjFdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjEtMl0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1aVZhbHVlID49IDExNikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTldJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xN10nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTE4XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjBdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMi0xXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjEtMV0nKS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMV0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTIyXScpLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1jb250ZW50LXRhYnNdJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtdGFicy1idG5dJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xMV0nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTExLTFdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xNF0nKS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC10YWJzPTNdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtdGFicy1idG49M10nKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MThdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMV0nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTIxLTJdJykuc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWJ0bi1pbm5vdmF0aW9ucz0xXScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC1pbm5vdmF0aW9ucz0xXScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1idG4taW5ub3ZhdGlvbnM9M10nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWJ0bi1pbm5vdmF0aW9ucz0yXScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC1pbm5vdmF0aW9ucz0zXScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWNvbnRlbnQtaW5ub3ZhdGlvbnM9Ml0nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVpVmFsdWUyID49IDc1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xOV0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1aVZhbHVlMiA+PSA3NSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTddJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xOF0nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTE5XScpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjItMV0nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTIxLTFdJykuaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjFdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMl0nKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC10YWJzXScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXRhYnMtYnRuXScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTFdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xMS0xXScpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTRdJykuaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWNvbnRlbnQtdGFicz0zXScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXRhYnMtYnRuPTNdJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xOF0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTIxXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjEtMl0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC10YWJzXScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXRhYnMtYnRuXScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC10YWJzPTNdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtdGFicy1idG49M10nKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRheFN5c3RlbSA9PSAnc2ltcGxpZmllZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTFdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xMS0xXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTRdJykuc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWNvbnRlbnQtdGFic10nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS10YWJzLWJ0bl0nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTE4XScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjFdJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMS0yXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTldJykuaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MTddJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0xOF0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTIxXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjEtMV0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1zZWN0aW9uPTIyXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjItMV0nKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC10YWJzPTJdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtdGFicy1idG49Ml0nKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1idG4taW5ub3ZhdGlvbnM9M10nKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWJ0bi1pbm5vdmF0aW9ucz0xXSwgW2RhdGEtYnRuLWlubm92YXRpb25zPTJdJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtY29udGVudC1pbm5vdmF0aW9ucz0zXScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLWNvbnRlbnQtaW5ub3ZhdGlvbnM9Ml0sIFtkYXRhLWNvbnRlbnQtaW5ub3ZhdGlvbnM9MV0nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGF4U3lzdGVtID09ICdtYWluJyAmJiB1aVZhbHVlIDw9IDExNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMS0xXScpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjEtMl0nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGF4U3lzdGVtID09ICdtYWluJyAmJiB1aVZhbHVlID49IDExNikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEtc2VjdGlvbj0yMS0xXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ1tkYXRhLXNlY3Rpb249MjEtMl0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vR1RNXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codGF4U3lzdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHVpVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codWlWYWx1ZTIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRheFN5c3RlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzaW1wbGlmaWVkJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd0bVNub0V2ZW50ID0gJ3NldF9zbm9fdXByb3NoZW5rYSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbWFpbic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndG1Tbm9FdmVudCA9ICdzZXRfc25vX2Jhc2ljJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdvdGhlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndG1Tbm9FdmVudCA9ICdzZXRfc25vX290aGVyJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3RtU25vRXZlbnQgPSAnc2V0X3Nub19vdGhlcic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlIDw9IDEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3RtSW5jb21lRXZlbnQgPSAnc2V0X2luY29tZV8xMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID4gMTAgJiYgdWlWYWx1ZSA8PSAzMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd0bUluY29tZUV2ZW50ID0gJ3NldF9pbmNvbWVfMzAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA+IDMwICYmIHVpVmFsdWUgPD0gNTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndG1JbmNvbWVFdmVudCA9ICdzZXRfaW5jb21lXzgwJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPiA1MCAmJiB1aVZhbHVlIDw9IDcwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3RtSW5jb21lRXZlbnQgPSAnc2V0X2luY29tZV8xMjAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA+IDcwICYmIHVpVmFsdWUgPD0gOTM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndG1JbmNvbWVFdmVudCA9ICdzZXRfaW5jb21lXzQwMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID4gOTMgJiYgdWlWYWx1ZSA8PSAxMTU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndG1JbmNvbWVFdmVudCA9ICdzZXRfaW5jb21lXzgwMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID4gMTE1ICYmIHVpVmFsdWUgPD0gMTM4OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3RtSW5jb21lRXZlbnQgPSAnc2V0X2luY29tZV8yMDAwJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPiAxMzg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndG1JbmNvbWVFdmVudCA9ICdzZXRfaW5jb21lX292ZXJfMjAwMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd0bUluY29tZUV2ZW50ID0gJ3NldF9pbmNvbWVfMjAnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZTIgPD0gMzA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndG1FbXBsb3llZUV2ZW50ID0gJ3NldF9lbXBsb3llZV8zMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlMiA+IDMwICYmIHVpVmFsdWUyIDw9IDc0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3RtRW1wbG95ZWVFdmVudCA9ICdzZXRfZW1wbG95ZWVfMTAwJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUyID4gNzQgJiYgdWlWYWx1ZTIgPD0gMTM5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3RtRW1wbG95ZWVFdmVudCA9ICdzZXRfZW1wbG95ZWVfNTAwJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUyID4gMTM5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3RtRW1wbG95ZWVFdmVudCA9ICdzZXRfZW1wbG95ZWVfb3Zlcl81MDAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndG1FbXBsb3llZUV2ZW50ID0gJ3NldF9lbXBsb3llZV8zMCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKGd0bVNub0V2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKGd0bUluY29tZUV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKGd0bUVtcGxveWVlRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uICh1aVZhbHVlLCB1aVZhbHVlMiwgdGF4U3lzdGVtKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINCS0YvRgNGD0YfQutCwINC00L4gMTAg0LzQu9C9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlIDwgMTAgJiYgKHRheFN5c3RlbSA9PSAnb3RoZXInIHx8IHRheFN5c3RlbSA9PSAnc2ltcGxpZmllZCcpOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbMF0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA8IDEwICYmICh0YXhTeXN0ZW0gPT0gJ21haW4nKTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzEwXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JLRi9GA0YPRh9C60LAg0LTQviAzMCDQvNC70L1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPj0gMTAgJiYgdWlWYWx1ZSA8PSAyOSAmJiAodGF4U3lzdGVtID09ICdvdGhlcicgfHwgdGF4U3lzdGVtID09ICdzaW1wbGlmaWVkJyk6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxQcmljZUVsZW0uaHRtbCh0aGlzLnByaWNlc1sxXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDEwICYmIHVpVmFsdWUgPD0gMjkgJiYgKHRheFN5c3RlbSA9PSAnbWFpbicpOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbMTFdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQktGL0YDRg9GH0LrQsCDQtNC+IDgwINC80LvQvVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA+PSAzMCAmJiB1aVZhbHVlIDw9IDQ5ICYmICh0YXhTeXN0ZW0gPT0gJ290aGVyJyB8fCB0YXhTeXN0ZW0gPT0gJ3NpbXBsaWZpZWQnKTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzJdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPj0gMzAgJiYgdWlWYWx1ZSA8PSA0OSAmJiAodGF4U3lzdGVtID09ICdtYWluJyk6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxQcmljZUVsZW0uaHRtbCh0aGlzLnByaWNlc1sxMl0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINCS0YvRgNGD0YfQutCwINC00L4gMTIwINC80LvQvVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA+PSA1MCAmJiB1aVZhbHVlIDw9IDcwICYmICh0YXhTeXN0ZW0gPT0gJ290aGVyJyB8fCB0YXhTeXN0ZW0gPT0gJ3NpbXBsaWZpZWQnKSAmJiB1aVZhbHVlMiA8IDEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbM10pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA+PSA1MCAmJiB1aVZhbHVlIDw9IDcwICYmICh0YXhTeXN0ZW0gPT0gJ290aGVyJyB8fCB0YXhTeXN0ZW0gPT0gJ3NpbXBsaWZpZWQnKSAmJiB1aVZhbHVlMiA+PSAxMCAmJiB1aVZhbHVlMiA8PSA3NDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzE0XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDUwICYmIHVpVmFsdWUgPD0gNzAgJiYgKHRheFN5c3RlbSA9PSAnb3RoZXInIHx8IHRheFN5c3RlbSA9PSAnc2ltcGxpZmllZCcpICYmIHVpVmFsdWUyID49IDc1ICYmIHVpVmFsdWUyIDw9IDEzOTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzE1XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDUwICYmIHVpVmFsdWUgPD0gNzAgJiYgKHRheFN5c3RlbSA9PSAnb3RoZXInIHx8IHRheFN5c3RlbSA9PSAnc2ltcGxpZmllZCcpICYmIHVpVmFsdWUyID49IDE0MDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzE2XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDUwICYmIHVpVmFsdWUgPD0gNzAgJiYgKHRheFN5c3RlbSA9PSAnbWFpbicpICYmIHVpVmFsdWUyIDwgMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxQcmljZUVsZW0uaHRtbCh0aGlzLnByaWNlc1syOV0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA+PSA1MCAmJiB1aVZhbHVlIDw9IDcwICYmICh0YXhTeXN0ZW0gPT0gJ21haW4nKSAmJiB1aVZhbHVlMiA+PSAxMCAmJiB1aVZhbHVlMiA8PSA3NDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzMwXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDUwICYmIHVpVmFsdWUgPD0gNzAgJiYgKHRheFN5c3RlbSA9PSAnbWFpbicpICYmIHVpVmFsdWUyID49IDc1ICYmIHVpVmFsdWUyIDw9IDEzOTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzMxXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDUwICYmIHVpVmFsdWUgPD0gNzAgJiYgKHRheFN5c3RlbSA9PSAnbWFpbicpICYmIHVpVmFsdWUyID49IDE0MDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzMyXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JLRi9GA0YPRh9C60LAg0LTQviA0MDAg0LzQu9C9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDcxICYmIHVpVmFsdWUgPD0gOTMgJiYgdWlWYWx1ZTIgPCAxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzE3XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDcxICYmIHVpVmFsdWUgPD0gOTMgJiYgdWlWYWx1ZTIgPj0gMTAgJiYgdWlWYWx1ZTIgPD0gNzQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxQcmljZUVsZW0uaHRtbCh0aGlzLnByaWNlc1sxOF0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA+PSA3MSAmJiB1aVZhbHVlIDw9IDkzICYmIHVpVmFsdWUyID49IDc1ICYmIHVpVmFsdWUyIDw9IDEzOTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzE5XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDcxICYmIHVpVmFsdWUgPD0gOTMgJiYgdWlWYWx1ZTIgPj0gMTQwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbMjBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQktGL0YDRg9GH0LrQsCDQtNC+IDgwMCDQvNC70L1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPj0gOTQgJiYgdWlWYWx1ZSA8PSAxMTUgJiYgdWlWYWx1ZTIgPCAxMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzIxXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDk0ICYmIHVpVmFsdWUgPD0gMTE1ICYmIHVpVmFsdWUyID49IDEwICYmIHVpVmFsdWUyIDw9IDc0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbMjJdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPj0gOTQgJiYgdWlWYWx1ZSA8PSAxMTUgJiYgdWlWYWx1ZTIgPj0gNzUgJiYgdWlWYWx1ZTIgPD0gMTM5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbMjNdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPj0gOTQgJiYgdWlWYWx1ZSA8PSAxMTUgJiYgdWlWYWx1ZTIgPj0gMTQwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbMjRdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQktGL0YDRg9GH0LrQsCDQtNC+IDIg0LzQu9GA0LRcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPj0gMTE2ICYmIHVpVmFsdWUgPD0gMTM4ICYmIHVpVmFsdWUyIDwgMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxQcmljZUVsZW0uaHRtbCh0aGlzLnByaWNlc1syNV0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA+PSAxMTYgJiYgdWlWYWx1ZSA8PSAxMzggJiYgdWlWYWx1ZTIgPj0gMTAgJiYgdWlWYWx1ZTIgPD0gNzQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxQcmljZUVsZW0uaHRtbCh0aGlzLnByaWNlc1syNl0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdWlWYWx1ZSA+PSAxMTYgJiYgdWlWYWx1ZSA8PSAxMzggJiYgdWlWYWx1ZTIgPj0gNzUgJiYgdWlWYWx1ZTIgPD0gMTM5OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbMjddKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPj0gMTE2ICYmIHVpVmFsdWUgPD0gMTM4ICYmIHVpVmFsdWUyID49IDE0MDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzI4XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JLRi9GA0YPRh9C60LAg0LHQvtC70LXQtSAyINC80LvRgNC0XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDEzOSAmJiB1aVZhbHVlMiA8IDEwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbMzNdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPj0gMTM5ICYmIHVpVmFsdWUyID49IDEwICYmIHVpVmFsdWUyIDw9IDc0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsUHJpY2VFbGVtLmh0bWwodGhpcy5wcmljZXNbMzRdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVpVmFsdWUgPj0gMTM5ICYmIHVpVmFsdWUyID49IDc1ICYmIHVpVmFsdWUyIDw9IDEzOTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbFByaWNlRWxlbS5odG1sKHRoaXMucHJpY2VzWzM1XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1aVZhbHVlID49IDEzOSAmJiB1aVZhbHVlMiA+PSAxNDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxQcmljZUVsZW0uaHRtbCh0aGlzLnByaWNlc1szNl0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxQcmljZUVsZW0uaHRtbCh0aGlzLnByaWNlc1s5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwdXNoRXZlbnRzOiBmdW5jdGlvbiAoZXZlbnRzLCBndG1DYXRlZ29yeSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50KHZhbHVlLCBndG1DYXRlZ29yeSwgJ0Zvcm1fQWNjb3VudGluZ19DYWxjdWxhdG9yX0V4dGVuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHB1c2hNb21lbnRFdmVudHM6IGZ1bmN0aW9uIChldmVudHMsIGd0bUNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEdUTXB1c2hFdmVudCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudCgnRm9ybV9BY2NvdW50aW5nX0NhbGN1bGF0b3JfRXh0ZW5kZWRfQ2hvb3NlZF8nICsgdmFsdWUsIGd0bUNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VsZWN0VGF4OiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZmluZCgnLnNlbGVjdGVkW2RhdGEtdGF4XScpLmRhdGEoJ3RheCcpICE9ICQoZWwpLmRhdGEoJ3RheCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmJ1dHRvbi5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5idXR0b24uYWRkQ2xhc3MoJ2FuaW1hdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuY2xvc2VzdCgnLnNlbGVjdGlvbl9fYnV0dG9ucycpLmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKGVsKS5kYXRhKCd0YXgnKSA9PSAnbWFpbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzID0gWydPc25vdm5heWEnXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoZWwpLmRhdGEoJ3RheCcpID09ICdzaW1wbGlmaWVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMgPSBbJ1Vwcm9zY2hlbmthJ107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKGVsKS5kYXRhKCd0YXgnKSA9PSAnb3RoZXInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cyA9IFsnRHJ1Z29lJ107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoTW9tZW50RXZlbnRzKGV2ZW50cywgdGhpcy5ndG1DYXRlZ29yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0Rm9ybSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0UHVzaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLnB1c2hFdmVudHMsIHRoaXMudGltZW91dCAqIDEwMDAsIHRoaXMuZXZlbnRzLCB0aGlzLmd0bUNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2hFdmVudHModGhpcy5ldmVudHMsIHRoaXMuZ3RtQ2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufShqUXVlcnkpKTtcclxuIiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5CYWNrVG9Ub3AgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRCYWNrVG9Ub3AnLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLm9mZnNldCA9IDEwMDA7XHJcblxyXG5cdFx0XHRcdHRoaXMub24odGhpcy5lbGVtZW50LCAnY2xpY2snLCAnc2Nyb2xsVG9Ub3AnKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdCdzY3JvbGxUb1RvcCc6IGZ1bmN0aW9uKGVsLCBldikge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdCAgICAgICAgICAgIHNjcm9sbFRvcDogMFxyXG5cdFx0ICAgICAgICB9LCAxODAwKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnQgPT0gXCJmdW5jdGlvblwiICYmIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLm1hdGNoZXMpIHtcclxuICAgICAgICAgIEdUTXB1c2hFdmVudCgnTW9iaWxlQnV0dG9uQ2xpY2snLCAnTW9iaWxlQnV0dG9uJyk7XHJcbiAgICAgICAgfVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0J3t3aW5kb3d9IHNjcm9sbCc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSA+IHRoaXMub2Zmc2V0KSB7XHJcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50LmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICBBcHAuV2lkZ2V0cy5CYW5uZXIgPSBBcHAuV2lkZ2V0cy5CYW5uZXIgfHwge307XHJcbiAgQXBwLldpZGdldHMuQmFubmVyLkxhenlMb2FkID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICB7XHJcbiAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldEJhbm5lckxhenlMb2FkJyxcclxuICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgZ2F0ZXdheTogJy9hamF4L2Jhbm5lcnMvJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1xyXG5cclxuICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB0aGlzLmJhbm5lcklEID0gdGhpcy5lbGVtZW50LmRhdGEoJ2Jhbm5lcicpO1xyXG5cdFx0XHQgIHRoaXMucmVxdWVzdFBhcmFtcyA9IHdpbmRvd1xyXG5cdFx0XHRcdCAgLmxvY2F0aW9uXHJcblx0XHRcdFx0ICAuc2VhcmNoXHJcblx0XHRcdFx0ICAucmVwbGFjZSgnPycsJycpXHJcblx0XHRcdFx0ICAuc3BsaXQoJyYnKVxyXG5cdFx0XHRcdCAgLnJlZHVjZShcclxuXHRcdFx0XHRcdCAgZnVuY3Rpb24ocCxlKXtcclxuXHRcdFx0XHRcdFx0ICB2YXIgYSA9IGUuc3BsaXQoJz0nKTtcclxuXHRcdFx0XHRcdFx0ICBwWyBkZWNvZGVVUklDb21wb25lbnQoYVswXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KGFbMV0pO1xyXG5cdFx0XHRcdFx0XHQgIHJldHVybiBwO1xyXG5cdFx0XHRcdFx0ICB9LFxyXG5cdFx0XHRcdFx0ICB7fVxyXG5cdFx0XHRcdCAgKTtcclxuICAgICAgICAgICAgICBpZih0aGlzLmJhbm5lcklEKXtcclxuICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICQuZ2V0KHRoaXMub3B0aW9ucy5nYXRld2F5LCB7aWQ6IHRoaXMuYmFubmVySUQsIGNsZWFyX2NhY2hlOiB0aGlzLnJlcXVlc3RQYXJhbXNbJ2NsZWFyX2NhY2hlJ119LCB0aGlzLnByb3h5KCdpbnNlcnRCYW5uZXInKSk7XHJcbiAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUk9SOiBhcHBXaWRnZXRCYW5uZXJMYXp5TG9hZCB1bmFibGUgdG8gbG9hZCBiYW5uZXIgSUQgJyt0aGlzLmJhbm5lcklEKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgaW5zZXJ0QmFubmVyOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCB4aHIpe1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuaHRtbChkYXRhKTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgKTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLkJsb2dBY2NvcmRpb24gPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRCbG9nQWNjb3JkaW9uJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCAgICB0aGlzLmJ0biA9IHRoaXMuZWxlbWVudDtcclxuICAgICAgICAgIFx0XHR0aGlzLm9uKHRoaXMuYnRuLCAnY2xpY2sgdG91Y2hzdGFydCcsICdzaG93SGlkZURlc2NyaXB0aW9uJyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdCdzaG93SGlkZURlc2NyaXB0aW9uJzogZnVuY3Rpb24oZWwsIGV2KSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpZihlbC5oYXNDbGFzcygnb3BlbicpKSB7XHJcblx0XHRcdFx0XHRlbC50b2dnbGVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0ZWwubmV4dCgpLnNsaWRlVXAoKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRlbC50b2dnbGVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHRcdFx0ZWwubmV4dCgpLnNsaWRlRG93bigpLmFkZENsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuV2lkZ2V0cy5CbG9nQXJjaGl2ZSA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRCbG9nQXJjaGl2ZScsXHJcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7fVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckl0ZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWJsb2ctZmlsdGVyLWl0ZW0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFncyA9ICQoJy5qcy1ibG9nLXRhZ3MnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2dGaWVsZCA9ICQoJy5qcy1ibG9nLWZpZWxkJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2dGaWVsZFVsID0gJCgnLmpzLWJsb2ctZmllbGQgPiAuanMtYmxvZy11bCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9nRmllbGRQYWdlciA9ICQoJy5qcy1ibG9nLWZpZWxkID4gLmpzLXBhZ2luYXRpb24tLWJsb2cnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5maWx0ZXJJdGVtLCAnY2xpY2snLCAnZmlsdGVyQXJjaGl2ZU9uQ2xpY2snKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAnZmlsdGVyQXJjaGl2ZU9uQ2xpY2snOiBmdW5jdGlvbihlbCwgZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbC5oYXNDbGFzcygnY3VycmVudCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuZmluZCgnLmN1cnJlbnQtY2xvc2UnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwucHJlcGVuZCgnPHNwYW4gY2xhc3M9XCJjdXJyZW50LWNsb3NlXCI+Y2xvc2U8L3NwYW4+Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbC50b2dnbGVDbGFzcygnY3VycmVudCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQmxvZ0FyY2hpdmUoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICd1cGRhdGVCbG9nQXJjaGl2ZSc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGk9MCwgYURhdGU9W10sIG89dGhpcywgYVRhZz1bXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWJsb2ctZmlsdGVyLWl0ZW0uY3VycmVudCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFEYXRlW2ldID0gJCh0aGlzKS5kYXRhKCdtb250aCcpK1wiLVwiKyQodGhpcykuZGF0YSgneWVhcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGk9MDtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFncy5maW5kKCcuanMtYmxvZy10YWctaXRlbS5jdXJyZW50JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNUYWc7XHJcbiAgICAgICAgICAgICAgICAgICAgc1RhZyA9ICQodGhpcykuZGF0YSgndGFnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFUYWdbaV0gPSBzVGFnO1xyXG4gICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZ2V0KFwiXCIseydEQVRFW10nOmFEYXRlLCd0YWdzJzphVGFnLCAnaXNBamF4Jzp0cnVlfVxyXG4gICAgICAgICAgICAgICAgKS5kb25lKGZ1bmN0aW9uKHJlc3VsdCl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG8uYmxvZ0ZpZWxkLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgby5ibG9nRmllbGQuYXBwZW5kKHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVJST1IgQURESU5HIEJMT0cnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuV2lkZ2V0cy5CbG9nVGFncyA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRCbG9nVGFncycsXHJcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7fVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckl0ZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWJsb2ctdGFnLWl0ZW0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJjaGl2ZSA9JCgnLmpzLWJsb2ctYXJjaGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuYmxvZ0ZpZWxkID0gJCgnLmpzLWJsb2ctZmllbGQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxvZ0ZpZWxkVWwgPSAkKCcuanMtYmxvZy1maWVsZCA+IC5qcy1ibG9nLXVsJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2dGaWVsZFBhZ2VyID0gJCgnLmpzLWJsb2ctZmllbGQgPiAuanMtcGFnaW5hdGlvbi0tYmxvZycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmZpbHRlckl0ZW0sICdjbGljaycsICdmaWx0ZXJUYWdPbkNsaWNrJyk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgJ2ZpbHRlclRhZ09uQ2xpY2snOiBmdW5jdGlvbihlbCwgZW0pIHtcclxuICAgICAgICAgICAgICAgIGVtLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBlbC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVCbG9nKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAndXBkYXRlQmxvZyc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGk9MCwgYURhdGU9W10sIG89dGhpcywgYVRhZyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuYXJjaGl2ZS5maW5kKCcuanMtYmxvZy1maWx0ZXItaXRlbS5jdXJyZW50JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYURhdGVbaV0gPSAkKHRoaXMpLmRhdGEoJ21vbnRoJykrXCItXCIrJCh0aGlzKS5kYXRhKCd5ZWFyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaT0wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1ibG9nLXRhZy1pdGVtLmFjdGl2ZScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc1RhZztcclxuICAgICAgICAgICAgICAgICAgICBzVGFnID0gJCh0aGlzKS5kYXRhKCd0YWcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYVRhZ1tpXSA9IHNUYWc7XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5nZXQoXCJcIix7J0RBVEVbXSc6YURhdGUsJ3RhZ3MnOmFUYWcsJ0FKQVgnOidZJ31cclxuICAgICAgICAgICAgICAgICkuZG9uZShmdW5jdGlvbihyZXN1bHQpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBvLmJsb2dGaWVsZC5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG8uYmxvZ0ZpZWxkLmFwcGVuZChyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VSUk9SIEFERElORyBCTE9HJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMuQnVyZ2VyTW9iaWxlID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldEJ1cmdlck1vYmlsZScsXHJcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7fVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1cmdlckJ0biA9IHRoaXMuZWxlbWVudC5maW5kKCcuYnVyZ2VyX19idG4nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVyZ2VyTmF2ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5idXJnZXJfX3dyYXBwZXInKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVyZ2VyQ2xvc2UgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmJ1cmdlcl9fY2xvc2UnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVyZ2VyTmF2U2xpZGUgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmJ1cmdlcl9fbmF2LXNsaWRlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1cmdlck5hdkxpbmsgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmJ1cmdlcl9fbmF2LWxpbmsnKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmJ1cmdlckJ0biwgJ2NsaWNrJywgJ29wZW5OYXYnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5idXJnZXJDbG9zZSwgJ2NsaWNrJywgJ2Nsb3NlTmF2Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuYnVyZ2VyTmF2U2xpZGUsICdjbGljaycsICdzbGlkZU5hdkl0ZW0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5idXJnZXJOYXZMaW5rLCAnY2xpY2snLCAnc2xpZGVOYXZJdGVtJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdvcGVuTmF2JzogZnVuY3Rpb24oZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idXJnZXJOYXYuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdvdmVyZmxvdy1pcy1oaWRkZW4nKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2Nsb3NlTmF2JzogZnVuY3Rpb24oZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idXJnZXJOYXYucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdvdmVyZmxvdy1pcy1oaWRkZW4nKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3NsaWRlTmF2SXRlbSc6IGZ1bmN0aW9uKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQoZWwpLmF0dHIoJ2hyZWYnKSA9PSAnIycpIHtcclxuICAgICAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWwpLmNsb3Nlc3QoJy5idXJnZXJfX25hdi1pdGVtJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsKS5uZXh0KCcuYnVyZ2VyX19zdWJuYXYnKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWwpLm5leHQoKS5uZXh0KCcuYnVyZ2VyX19zdWJuYXYnKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5Db3N0Q2FsY3VsYXRvciA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldENvc3RDYWxjdWxhdG9yJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCAgICB0aGlzLnJhbmdlU2xpZGVyID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1jb3N0LWNhbGN1bGF0b3JfX3JhbmdlJyk7XHJcblx0XHRcdCAgICB0aGlzLnJlc3VsdCA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtY29zdC1jYWxjdWxhdG9yX19yZXN1bHQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZWxlbWVudC5maW5kKCcuZm9ybS0tY2FsY3VsYXRvci1zZW5kJyk7XHJcblxyXG5cdFx0XHRcdHRoaXMuZm9ybUVtYWlsID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9FTUFJTFwiXScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idXR0b24gPSAkKCcuanMtc2VuZC1ydXN1bHQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2hhdEluUHJpY2UgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLW1vZGFsJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRCbG9jayA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtY2FsY3VsYXRvci1mb3JtJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByaWNlSW5wdXQgPSB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXRbbmFtZT1cIlBSSUNFXCJdJyk7XHJcblxyXG5cdFx0XHQgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0ICAgIHRoaXMucmFuZ2VTbGlkZXIuc2xpZGVyKHtcclxuXHRcdFx0ICAgIFx0cmFuZ2U6ICdtaW4nLFxyXG5cdFx0XHRcdFx0bWluOiAwLFxyXG5cdFx0XHRcdFx0bWF4OiAxNjUsXHJcblx0XHRcdFx0XHRzdGVwOiAxLFxyXG5cdFx0XHRcdFx0dmFsdWU6IDEwLFxyXG5cdFx0XHRcdFx0c2xpZGU6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuXHRcdFx0IFx0XHRcdHNlbGYuY2FsY3VsYXRlQ29zdCh1aS52YWx1ZSk7XHJcblxyXG5cdFx0XHQgXHRcdH0sXHJcblx0XHRcdFx0XHRjaGFuZ2U6IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50ID09IFwiZnVuY3Rpb25cIil7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFnZXRDb29raWUoJ2NhbGNzY3JvbGwnKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0R1RNcHVzaEV2ZW50KCdjYWxjc2Nyb2xsJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRHVE1wdXNoRXZlbnQoJ0Zvcm1fQWNjb3VudGluZ19DYWxjdWxhdG9yX0Nob29zZWRfUmV2ZW51ZScsICdGb3JtX0FjY291bnRpbmdfQ2FsY3VsYXRvcicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0c2V0Q29va2llKCdjYWxjc2Nyb2xsJywgMSwgMjQqNjAqNjApO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHQgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5idXR0b24ub24oXCJjbGlja1wiLCB0aGlzLnN1Ym1pdEZvcm0pO1xyXG5cdFx0XHRcdHRoaXMud2hhdEluUHJpY2Uub24oXCJjbGlja1wiLCB0aGlzLnNlbmRXaGF0RXZlbnQpO1xyXG5cdFx0XHRcdGlmICh0aGlzLmZvcm1FbWFpbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5vbih0aGlzLmZvcm1FbWFpbCwgJ2NoYW5nZScsICdjaGFuZ2VFbWFpbCcpO1xyXG5cdFx0XHRcdFx0dGhpcy5vbmNlRW1haWxTZW5kID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGNoYW5nZUVtYWlsOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcblx0XHRcdFx0aWYgKCQodGhpcy5mb3JtKS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZUVtYWlsU2VuZCkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBHVE1wdXNoRXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdFx0XHRcdEdUTXB1c2hFdmVudCgnRm9ybV9BY2NvdW50aW5nX0NhbGN1bGF0b3JfRmlsbGVkX0VtYWlsJywgJ0Zvcm1fQWNjb3VudGluZ19DYWxjdWxhdG9yJyk7XHJcblx0XHRcdFx0XHRcdHRoaXMub25jZUVtYWlsU2VuZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0c2VuZFdoYXRFdmVudDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBHVE1wdXNoRXZlbnQgPT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0XHRcdEdUTXB1c2hFdmVudCgnRm9ybV9BY2NvdW50aW5nX0NhbGN1bGF0b3JfQ2xpY2tfV2hhdF9BZmZlY3RzJywgJ0Zvcm1fQWNjb3VudGluZ19DYWxjdWxhdG9yJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Ly8g0KDQsNGB0YfRkdGCINGB0YLQvtC40LzQvtGB0YLQuFxyXG5cdFx0XHRjYWxjdWxhdGVDb3N0OiBmdW5jdGlvbihkb2N1bWVudHNOdW1iZXIpIHtcclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiBHVE1wdXNoRXZlbnQgPT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0XHRcdGlmICghZ2V0Q29va2llKCdDYWxjdWxhdG9yU3RhcnQnKSkgeyBHVE1wdXNoRXZlbnQoJ0NhbGN1bGF0b3JTdGFydCcpOyBzZXRDb29raWUoJ0NhbGN1bGF0b3JTdGFydCcsIDEsIDI0KjYwKjYwKTsgfVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c3dpdGNoKHRydWUpIHtcclxuXHRcdCAgICBcdFx0Y2FzZSBkb2N1bWVudHNOdW1iZXIgPCA1OlxyXG5cdFx0ICAgIFx0XHRcdHRoaXMucHJpbnRSZXN1bHQoJ9CY0LfQstC40L3QuNGC0LUsINC80Ysg0YHQv9C10YbQuNCw0LvQuNC30LjRgNGD0LXQvNGB0Y8g0L3QsCDQvtCx0YHQu9GD0LbQuNCy0LDQvdC40Lgg0LHQvtC70LXQtSDQutGA0YPQv9C90YvRhSDQsdC40LfQvdC10YHQvtCyJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZEJsb2NrLmhpZGUoKTtcclxuXHRcdCAgICBcdFx0XHRicmVhaztcclxuXHRcdCAgICBcdFx0Y2FzZSBkb2N1bWVudHNOdW1iZXIgPj0gNSAmJiBkb2N1bWVudHNOdW1iZXIgPD0gMjk6XHJcblx0XHQgICAgXHRcdFx0dGhpcy5wcmludFJlc3VsdCgnMzAg4oCTIDU1INGC0YvRgS4g0YDRg9CxLicsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kQmxvY2suc2hvdygpO1xyXG5cdFx0ICAgIFx0XHRcdGJyZWFrO1xyXG5cdFx0ICAgIFx0XHRjYXNlIGRvY3VtZW50c051bWJlciA+PSAzMCAmJiBkb2N1bWVudHNOdW1iZXIgPD0gNTU6XHJcblx0XHQgICAgXHRcdFx0dGhpcy5wcmludFJlc3VsdCgnNTAg4oCTIDg1INGC0YvRgS4g0YDRg9CxLicsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kQmxvY2suc2hvdygpO1xyXG5cdFx0ICAgIFx0XHRcdGJyZWFrO1xyXG5cdFx0ICAgIFx0XHRjYXNlIGRvY3VtZW50c051bWJlciA+PSA1NiAmJiBkb2N1bWVudHNOdW1iZXIgPD0gODA6XHJcblx0XHQgICAgXHRcdFx0dGhpcy5wcmludFJlc3VsdCgnNjUg4oCTIDEwMCDRgtGL0YEuINGA0YPQsS4nLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZEJsb2NrLnNob3coKTtcclxuXHRcdCAgICBcdFx0XHRicmVhaztcclxuXHRcdCAgICBcdFx0Y2FzZSBkb2N1bWVudHNOdW1iZXIgPj0gODEgJiYgZG9jdW1lbnRzTnVtYmVyIDw9IDEwNjpcclxuXHRcdCAgICBcdFx0XHR0aGlzLnByaW50UmVzdWx0KCc5MCDigJMgMTMwINGC0YvRgS4g0YDRg9CxLicsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kQmxvY2suc2hvdygpO1xyXG5cdFx0ICAgIFx0XHRcdGJyZWFrO1xyXG5cdFx0ICAgIFx0XHRjYXNlIGRvY3VtZW50c051bWJlciA+PSAxMDcgJiYgZG9jdW1lbnRzTnVtYmVyIDw9IDEzMTpcclxuXHRcdCAgICBcdFx0XHR0aGlzLnByaW50UmVzdWx0KCcxMDAg4oCTIDE1MCDRgtGL0YEuINGA0YPQsS4nLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZEJsb2NrLnNob3coKTtcclxuXHRcdCAgICBcdFx0XHRicmVhaztcclxuXHRcdCAgICBcdFx0Y2FzZSBkb2N1bWVudHNOdW1iZXIgPj0gMTMyICYmIGRvY3VtZW50c051bWJlciA8PSAxNjU6XHJcblx0XHQgICAgXHRcdFx0dGhpcy5wcmludFJlc3VsdCgn0JzRiyDQvtCx0YHQu9GD0LbQuNCy0LDQtdC8INC00LXRgdGP0YLQutC4INCx0LjQt9C90LXRgdC+0LIg0YEg0LLRi9GA0YPRh9C60L7QuSDQvtGCIDIwMCDQvNC70L0g0LTQviA0INC80LvRgNC0INGA0YPQsS4v0LPQvtC0LiAg0JHRg9C00LXQvCDRgNCw0LTRiyDQv9GA0LXQtNC+0YHRgtCw0LLQuNGC0Ywg0JLQsNC8INC40L3QtNC40LLQuNC00YPQsNC70YzQvdGL0Lkg0YDQsNGB0YfQtdGCINC/0YDQuCDQu9C40YfQvdC+0Lkg0LLRgdGC0YDQtdGH0LUuJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZEJsb2NrLnNob3coKTtcclxuXHRcdCAgICBcdFx0XHRicmVhaztcclxuXHRcdCAgICBcdFx0ZGVmYXVsdDpcclxuXHRcdCAgICBcdFx0XHR0aGlzLnByaW50UmVzdWx0KCfQuNC90LTQuNCy0LjQtNGD0LDQu9GM0L3QsNGPJywgZmFsc2UpO1xyXG5cdFx0ICAgIFx0XHRcdGJyZWFrO1xyXG5cdFx0ICAgIFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0cHJpbnRSZXN1bHQ6IGZ1bmN0aW9uICh0ZXh0LCBsYXJnZVRleHRGbGFnKSB7XHJcblx0XHRcdFx0dmFyIHJlc3VsdEJsb2NrID0gdGhpcy5yZXN1bHQ7XHJcblx0XHRcdFx0aWYobGFyZ2VUZXh0RmxhZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFyZXN1bHRCbG9jay5oYXNDbGFzcygnY29zdC1jYWxjdWxhdG9yX19yZXN1bHQtc21hbGwnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRCbG9jay5hZGRDbGFzcygnY29zdC1jYWxjdWxhdG9yX19yZXN1bHQtc21hbGwnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0QmxvY2suaGFzQ2xhc3MoJ2Nvc3QtY2FsY3VsYXRvcl9fcmVzdWx0LXNtYWxsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QmxvY2sucmVtb3ZlQ2xhc3MoJ2Nvc3QtY2FsY3VsYXRvcl9fcmVzdWx0LXNtYWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgIHRoaXMucHJpY2VJbnB1dC52YWwodGV4dCk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRCbG9jay50ZXh0KHRleHQpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc3VibWl0Rm9ybTogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcy5mb3JtKS52YWxpZGF0ZSh3aW5kb3cuYXBwbGljYXRpb24udmFsaWRhdGVPcHRpb25zRGVmYXVsdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJCh0aGlzLmZvcm0pLmRhdGEoJ3ZhbGlkYXRlJykgJiYgISQodGhpcy5mb3JtKS52YWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcy5mb3JtKS5zdGFydFdhaXRpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLnBvc3QoXHJcbiAgICAgICAgICAgICAgICBcdCcvYWpheC9pbnRlcmZhY2UvY2FsY3VsYXRvci8nLFxyXG5cdFx0XHRcdFx0JCh0aGlzLmZvcm0pLnNlcmlhbGl6ZSgpLFxyXG5cdFx0XHRcdFx0ZnVuY3Rpb24oZGF0YSl7XHJcblxyXG4gICAgICAgICAgICAgICAgXHRcdGlmKGRhdGEuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmZvcm0tLWNhbGN1bGF0b3Itc2VuZCcpLmVuZFdhaXRpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEdUTXB1c2hFdmVudCA9PSBcImZ1bmN0aW9uXCIpe1xyXG5cdFx0XHRcdFx0XHRcdFx0R1RNcHVzaEV2ZW50KCdGb3JtX0FjY291bnRpbmdfQ2FsY3VsYXRvcl9TZW50JywgJ0Zvcm1fQWNjb3VudGluZ19DYWxjdWxhdG9yJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZmFuY3lib3goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyYXBDU1MgOiAnbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luIDogKCQod2luZG93KS53aWR0aCgpID4gOTM3KSA/IDIwIDogNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nIDogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVscGVycyA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheSA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzcyA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCcgOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29udGVudCcgOiAkKGRhdGEuaHRtbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIEdUTXB1c2hFdmVudCA9PSBcImZ1bmN0aW9uXCIpe1xyXG5cdFx0XHRcdFx0XHRcdFx0R1RNcHVzaEV2ZW50KCdGb3JtX0FjY291bnRpbmdfQ2FsY3VsYXRvcl9FcnJvcicsICdGb3JtX0FjY291bnRpbmdfQ2FsY3VsYXRvcicpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZmFuY3lib3goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyYXBDU1MgOiAnbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luIDogKCQod2luZG93KS53aWR0aCgpID4gOTM3KSA/IDIwIDogNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nIDogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVscGVycyA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheSA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzcyA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCcgOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29udGVudCcgOiAkKCc8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtLXZpc2libGVcIj48ZGl2IGNsYXNzPVwibW9kYWxfX3RpdGxlXCI+0KHQtdGA0LLQuNGBINCy0YDQtdC80LXQvdC90L4g0L3QtSDQtNC+0YHRgtGD0L/QtdC9PC9kaXY+PHA+0J/QvtCy0YLQvtGA0LjRgtC1INC/0L7Qv9GL0YLQutGDINC/0L7Qt9C20LU8L3A+PC9kaXY+JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0J2pzb24nXHJcblx0XHRcdFx0KTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5DaGFuZ2VhYmxlQ29udGFjdHMgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRDaGFuZ2VhYmxlQ29udGFjdHMnLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgd2FNYXA7XHJcblxyXG5cdFx0XHRcdC8vINC60L7QvtGA0LTQuNC90LDRgtGLINC/0L4g0LTQtdGE0L7Qu9GC0YM6INCh0LDQvdC60YIt0J/QtdGC0LXRgNCx0YPRgNCzXHJcblx0XHRcdFx0dmFyIGRlZmF1bHRNYXBDb29yZGluYXRlcyA9ICc1OS45NzEyNDQ1NjQxMDA3MTUsMzAuMzEyNjY5OTk5OTk5OTQ0JztcclxuXHJcblx0XHRcdFx0Ly8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LrQsNGA0YLRiyDRgSDQtNC10YTQvtC70YLQvdGL0LzQuCDQutC+0L7RgNC00LjQvdCw0YLQsNC80LhcclxuXHRcdFx0XHR0aGlzLmluaXRNYXAoZGVmYXVsdE1hcENvb3JkaW5hdGVzKTtcclxuXHJcblxyXG5cdFx0XHRcdC8vINC/0L7QuNGB0Logc2VsZWN0XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RDaXR5ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1zZWxlY3QnKTtcclxuXHRcdFx0XHQvLyDQv9C+0LjRgdC6INC/0L7Qu9GPINCw0LTRgNC10YHQsFxyXG5cdFx0XHRcdHRoaXMuYWRkcmVzc1ZhbHVlID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1jaGFuZ2VhYmxlLWNvbnRhY3RzLWFkZHJlc3MnKTtcclxuICAgICAgICAgICAgICAgIC8vINC/0L7QuNGB0Log0L/QvtC70Y8g0YLQtdC70LXRhNC+0L3QvdGL0Lkg0LrQvtC0INCz0L7RgNC+0LTQsFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2RlVmFsdWUgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWNoYW5nZWFibGUtY29udGFjdHMtcGhvbmUgLmpzLXNpdGUtcGhvbmUtY2NvZGUnKTtcclxuXHRcdFx0XHQvLyDQv9C+0LjRgdC6INC/0L7Qu9GPINGC0LXQu9C10YTQvtC90LBcclxuXHRcdFx0XHR0aGlzLnBob25lVmFsdWUgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWNoYW5nZWFibGUtY29udGFjdHMtcGhvbmUgLmpzLXNpdGUtcGhvbmUtbG9jYWwnKTtcclxuICAgICAgICAgICAgICAgIC8vINC/0L7QuNGB0Log0L/QvtC70Y8g0YHRgdGL0LvQutCwINGC0LXQu9C10YTQvtC90LBcclxuICAgICAgICAgICAgICAgIHRoaXMudGVsVmFsdWUgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWNoYW5nZWFibGUtY29udGFjdHMtcGhvbmUgLmpzLXNpdGUtcGhvbmUtYScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RFbGVtZW50ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1jaGFuZ2VhYmxlLWNvbnRhY3RzLXBob25lIC5qcy1zaXRlLXBob25lLWEnKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudCA9IHRoaXMuZWxlbWVudC5maW5kKCcuY29udGFjdC1saXN0LS1jdXN0b20tbWFyZ2luJyk7XHJcblx0XHRcdFx0Ly8g0LHQu9C+0Log0LrQsNC6INC00L7QsdGA0LDRgtGM0YHRj1xyXG5cdFx0XHRcdHRoaXMuaG93VG9HZXQgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWNoYW5nZWFibGUtY29udGFjdHMtaG93LXRvLWdldCcpO1xyXG5cclxuXHRcdFx0XHQvLyDRgdC+0LHRi9GC0LjQtSDQuNC30LzQtdC90LXQvdC40Y8g0LfQvdCw0YfQtdC90LjRjyBzZWxlY3RcclxuXHRcdFx0XHR0aGlzLm9uKHRoaXMuc2VsZWN0Q2l0eSwgJ2NoYW5nZScsICdzZWxlY3RDaXR5Q2hhbmdlJyk7XHJcblxyXG5cdFx0XHRcdHZhciB1cmkgPSBuZXcgVVJJKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuXHRcdFx0XHR1cmkuZnJhZ21lbnRQcmVmaXgoJyEnKTtcclxuXHRcdFx0XHRpZiAodXJpLmZyYWdtZW50KHRydWUpKSB7XHJcblx0XHRcdFx0XHR2YXIgaEZyYWdtZW50ID0gdXJpLmZyYWdtZW50KHRydWUpO1xyXG5cdFx0XHRcdFx0aWYgKCdjb2RlJyBpbiBoRnJhZ21lbnQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5zZWxlY3RDaXR5LnZhbChoRnJhZ21lbnRbJ2NvZGUnXSkudHJpZ2dlcignY2hhbmdlJyk7O1xyXG5cdFx0XHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiAkKCcjc3BiJykub2Zmc2V0KCkudG9wIC0gNjBcclxuXHRcdFx0XHRcdFx0fSwgMTUwMCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuICAgICAgICB2YXIgY3VyUGx1Z2luID0gdGhpcztcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1jb250YWN0LWhlYWRlci1saW5rJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB2YXIgdXJpID0gbmV3IFVSSSgkKHRoaXMpLmF0dHIoJ2hyZWYnKSk7XHJcblxyXG4gICAgICAgICAgdXJpLmZyYWdtZW50UHJlZml4KCchJyk7XHJcbiAgICAgICAgICBpZiAodXJpLmZyYWdtZW50KHRydWUpKSB7XHJcbiAgICAgICAgICAgIHZhciBoRnJhZ21lbnQgPSB1cmkuZnJhZ21lbnQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmICgnY29kZScgaW4gaEZyYWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgY3VyUGx1Z2luLnNlbGVjdENpdHkudmFsKGhGcmFnbWVudFsnY29kZSddKS50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuICAgICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoJyNzcGInKS5vZmZzZXQoKS50b3AgLSA2MFxyXG4gICAgICAgICAgICAgIH0sIDE1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzZWxlY3RDaXR5Q2hhbmdlOiBmdW5jdGlvbiAoZXZlbnQsIHByb3RvKSB7XHJcblxyXG5cdFx0XHRcdC8vINC/0L7Qu9GD0YfQtdC90LjQtSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDQuNC3IHNlbGVjdC0+b3B0aW9uXHJcblx0XHRcdFx0dmFyIHNlbGVjdCA9IHByb3RvLnRhcmdldDtcclxuXHJcblx0XHRcdFx0Ly8gY29udGFjdHNQYXJhbXMuY2l0eSAtINCz0L7RgNC+0LRcclxuXHRcdFx0XHQvLyBjb250YWN0c1BhcmFtcy5hZGRyZXNzIC0g0LDQtNGA0LXRgVxyXG4gICAgICAgICAgICAgICAgLy8gY29udGFjdHNQYXJhbXMuY29kZSAtINC60L7QtCDQs9C+0YDQvtC00LBcclxuXHRcdFx0XHQvLyBjb250YWN0c1BhcmFtcy5wY29kZSAtINGC0LXQu9C10YTQvtC90L3Ri9C5INC60L7QtCDQs9C+0YDQvtC00LBcclxuXHRcdFx0XHQvLyBjb250YWN0c1BhcmFtcy5waG9uZSAtINGC0LXQu9C10YTQvtC9INCx0LXQtyDQutC+0LTQsCDQs9C+0YDQvtC00LAg0YTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90L3Ri9C5XHJcblx0XHRcdFx0Ly8gY29udGFjdHNQYXJhbXMuY29vcmRpbmF0ZXMgLSDQutC+0L7RgNC00LjQvdCw0YLRiyDQtNC70Y8g0LrQsNGA0YLRi1xyXG5cdFx0XHRcdHZhciBjb250YWN0c1BhcmFtcyA9ICQoc2VsZWN0KS5maW5kKCc6c2VsZWN0ZWQnKS5kYXRhKCdwYXJhbScpLFxyXG4gICAgICAgICAgICAgICAgXHRwaG9uZSA9IGNvbnRhY3RzUGFyYW1zLnBob25lLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0Ly8g0YHQvNC10L3QsCDQsNC00YDQtdGB0LBcclxuXHRcdFx0XHR2YXIgY29vcmRpbmF0ZXMgPSBjb250YWN0c1BhcmFtcy5jb29yZGluYXRlcy5zcGxpdCgnLCcpLFxyXG5cdFx0XHRcdFx0Y29vcmRpbmF0ZXNSZXZlcnNlID0gY29vcmRpbmF0ZXNbMV0gKyAnLCcgKyBjb29yZGluYXRlc1swXTtcclxuXHRcdFx0XHR2YXIgYWRkcmVzcyA9ICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cHM6Ly95YW5kZXgucnUvbWFwcy8/ej0xNiZsbD0nK2Nvb3JkaW5hdGVzUmV2ZXJzZSsnJmw9bWFwJnJ0ZXh0PX4nK2NvbnRhY3RzUGFyYW1zLmNvb3JkaW5hdGVzKycmb3JpZ2luPWpzYXBpXzJfMV83MiZmcm9tPWFwaS1tYXBzXCI+J1xyXG5cdFx0XHRcdFx0KyBjb250YWN0c1BhcmFtcy5hZGRyZXNzICtcclxuXHRcdFx0XHRcdCc8L2E+JztcclxuXHRcdFx0XHR0aGlzLmFkZHJlc3NWYWx1ZS5odG1sKGFkZHJlc3MpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vINGB0LzQtdC90LAg0YLQtdC70LXRhNC+0L3QsFxyXG4gICAgICAgICAgICAgICAgaWYocGhvbmUubGVuZ3RoID49IDEgJiYgY29udGFjdHNQYXJhbXMucGNvZGUgIT0gJycpe1xyXG4gICAgICAgICAgICAgICAgXHRpZihwaG9uZS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybWF0UGhvbmUgPSBwaG9uZVswXS5yZXBsYWNlKCctJywgJycpLnJlcGxhY2UoJy0nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29kZVZhbHVlLmh0bWwoY29udGFjdHNQYXJhbXMucGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBob25lVmFsdWUuaHRtbChwaG9uZVswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGVsVmFsdWVbMF0uc2V0QXR0cmlidXRlKCdocmVmJywgJ3RlbDorNycgKyBjb250YWN0c1BhcmFtcy5wY29kZSArIGZvcm1hdFBob25lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZWxWYWx1ZVswXS5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJys3JyArIGNvbnRhY3RzUGFyYW1zLnBjb2RlICsgZm9ybWF0UGhvbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRlbFZhbHVlLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdub25lJyk7XHJcblx0XHRcdFx0XHRcdCQoJy5qcy1jaGFuZ2VhYmxlLWNvbnRhY3RzLXBob25lLXR3bycpLnBhcmVudCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtYXRQaG9uZSA9IHBob25lWzBdLnJlcGxhY2UoJy0nLCAnJykucmVwbGFjZSgnLScsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2RlVmFsdWUuaHRtbChjb250YWN0c1BhcmFtcy5wY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGhvbmVWYWx1ZS5odG1sKHBob25lWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZWxWYWx1ZVswXS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAndGVsOis3JyArIGNvbnRhY3RzUGFyYW1zLnBjb2RlICsgZm9ybWF0UGhvbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRlbFZhbHVlWzBdLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnKzcnICsgY29udGFjdHNQYXJhbXMucGNvZGUgKyBmb3JtYXRQaG9uZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGVsVmFsdWUucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ25vbmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0UGhvbmUgPSBwaG9uZVsxXS5yZXBsYWNlKCctJywgJycpLnJlcGxhY2UoJy0nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBcdFx0dmFyIGNsb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIFx0XHRjbG9uLmNsYXNzTmFtZSA9ICdjb250YWN0LWxpc3RfX3Jvdyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb24uaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJjb250YWN0LWxpc3RfX2NvbHVtblwiPjwvZGl2PjxkaXYgY2xhc3M9XCJjb250YWN0LWxpc3RfX2NvbHVtbiBjb250YWN0LWxpc3RfX2NvbHVtbi0tcGhvbmUganMtY2hhbmdlYWJsZS1jb250YWN0cy1waG9uZS10d29cIj48c3BhbiBjbGFzcz1cImpzLXNpdGUtcGhvbmVcIj48YSBocmVmPVwidGVsOis3JyArIGNvbnRhY3RzUGFyYW1zLmNvZGUgKyBmb3JtYXRQaG9uZSArICdcIiB0aXRsZT1cIis3JyArIGNvbnRhY3RzUGFyYW1zLmNvZGUgKyBmb3JtYXRQaG9uZSAgKydcIiBjbGFzcz1cIm5vLXVuZGVybGluZSBibGFjay1saW5rIGpzLXNpdGUtcGhvbmUtYVwiPjxub2JyPjxzcGFuIGNsYXNzPVwianMtc2l0ZS1waG9uZS13Y29kZVwiPis3PC9zcGFuPiAoPHNwYW4gY2xhc3M9XCJqcy1zaXRlLXBob25lLWNjb2RlXCI+JysgY29udGFjdHNQYXJhbXMucGNvZGUgKyc8L3NwYW4+KSA8c3Ryb25nPjxzcGFuIGNsYXNzPVwianMtc2l0ZS1waG9uZS1sb2NhbFwiPicrIHBob25lWzFdICsgJzwvc3Bhbj48L3N0cm9uZz48L25vYnI+PC9hPjwvc3Bhbj48L2Rpdj4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnRbMF0uaW5zZXJ0QmVmb3JlKGNsb24sIHRoaXMuc2VsZWN0RWxlbWVudFswXS5uZXh0U2libGluZyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMudGVsVmFsdWUucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoJ25vbmUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vINC+0YLQvtCx0YDQsNC20LXQvdC40LUg0LHQu9C+0LrQsCBcItCa0LDQuiDQtNC+0LHRgNCw0YLRjNGB0Y9cIi4g0JXRgdC70LggXCLQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQs1wiLCDRgtC+INC+0YLQvtCx0YDQsNC20LDQtdC8LCDQsiDQuNC90L7QvCDRgdC70YPRh9Cw0LUgLSDRgdC60YDRi9Cy0LDQtdC8XHJcblx0XHRcdFx0Y29udGFjdHNQYXJhbXMuY29kZSA9PSAnc2Fua3QtcGV0ZXJidXJnJyA/IHRoaXMuaG93VG9HZXQucmVtb3ZlQ2xhc3MoJ25vbmUnKSA6IHRoaXMuaG93VG9HZXQuYWRkQ2xhc3MoJ25vbmUnKTtcclxuXHJcblx0XHRcdFx0Ly8g0L7Rh9C40YnQsNC10Lwg0LrQsNGA0YLRg1xyXG5cdFx0XHRcdHRoaXMuZGVzdHJveU1hcCgpO1xyXG5cclxuXHRcdFx0XHQvLyDQsNC60YLQuNCy0LjQt9C40YDRg9C10Lwg0LrQsNGA0YLRgyDRgSDQvdC+0LLRi9C80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuFxyXG5cdFx0XHRcdHRoaXMuaW5pdE1hcChjb250YWN0c1BhcmFtcy5jb29yZGluYXRlcyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRpbml0TWFwOiBmdW5jdGlvbiAobWFwQ29vcmRpbmF0ZXMpIHtcclxuXHRcdFx0XHR5bWFwcy5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR3YU1hcCA9IG5ldyB5bWFwcy5NYXAoJ2NoYW5nZWFibGUtbWFwJywge1xyXG5cdFx0XHRcdFx0XHRjZW50ZXI6IG1hcENvb3JkaW5hdGVzLnNwbGl0KCcsJyksXHJcblx0XHRcdFx0XHRcdHpvb206IDE2LFxyXG5cdFx0XHRcdFx0XHRjb250cm9sczogWyd6b29tQ29udHJvbCddXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHR3YU1hcC5iZWhhdmlvcnMuZGlzYWJsZSgnZHJhZycpO1xyXG5cclxuXHRcdFx0XHRcdHZhciBwYXJraW5nQ29udHJvbCA9IHtcclxuXHRcdFx0XHRcdFx0YmFsbG9vblNoYWRvdzogZmFsc2UsXHJcblx0XHRcdFx0XHRcdGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuXHRcdFx0XHRcdFx0aWNvbkltYWdlSHJlZjogJy9sb2NhbC90ZW1wbGF0ZXMvbWFpbi9idWlsZC9pbWFnZXMvd2EtbWFwLW1hcmsucG5nJyxcclxuXHRcdFx0XHRcdFx0aWNvbkltYWdlU2l6ZTogWzQ5LCA0NV0sXHJcblx0XHRcdFx0XHRcdHpJbmRleDogOThcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0d2FQbGFjZW1hcmsgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKG1hcENvb3JkaW5hdGVzLnNwbGl0KCcsJyksIHt9LCBwYXJraW5nQ29udHJvbCk7XHJcblxyXG5cdFx0XHRcdFx0d2FNYXAuZ2VvT2JqZWN0cy5hZGQod2FQbGFjZW1hcmspO1xyXG5cclxuXHRcdFx0XHRcdGZ1bmN0aW9uIHNldENlbnRlciAoKSB7XHJcblx0XHRcdFx0XHRcdHdhTWFwLnNldENlbnRlcihtYXBDb29yZGluYXRlcy5zcGxpdCgnLCcpKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHR3YU1hcC5zZXRDZW50ZXIobWFwQ29vcmRpbmF0ZXMuc3BsaXQoJywnKSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHQkKCcuanMtY2hhbmdlYWJsZS1jb250YWN0cy1hZGRyZXNzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHR3YU1hcC5wYW5UbyhbbWFwQ29vcmRpbmF0ZXMuc3BsaXQoJywnKV0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRkZXN0cm95TWFwOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0eW1hcHMucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0d2FNYXAuZGVzdHJveSgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuV2lkZ2V0cy5DaGFuZ2VzID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldENoYW5nZXMnLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge31cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5MUFJJdGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1scHInKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVzaW5lc3NJdGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1idXNpbmVzcy10eXBlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRheEl0ZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXRheC10eXBlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUl0ZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWNoYW5nZS10eXBlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50RmllbGQgPSAkKCcuanMtY2hhbmdlcy1jb250ZW50Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuTFBSSXRlbSwgJ2NsaWNrJywgJ2ZpbHRlckNoYW5nZXNPbkNsaWNrJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuYnVzaW5lc3NJdGVtLCAnY2xpY2snLCAnZmlsdGVyQ2hhbmdlc09uQ2xpY2snKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy50YXhJdGVtLCAnY2xpY2snLCAnZmlsdGVyQ2hhbmdlc09uQ2xpY2snKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5jaGFuZ2VJdGVtLCAnY2xpY2snLCAnZmlsdGVyQ2hhbmdlc09uQ2xpY2snKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAnZmlsdGVyQ2hhbmdlc09uQ2xpY2snOiBmdW5jdGlvbiAoZWwsIGVtKSB7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlbC5oYXNDbGFzcygnanMtbHByJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5qcy1scHInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWxwcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlbC5oYXNDbGFzcygnanMtYnVzaW5lc3MtdHlwZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsLmhhc0NsYXNzKCdqcy10YXgtdHlwZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsLmhhc0NsYXNzKCdqcy1jaGFuZ2UtdHlwZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAndXBkYXRlQ29udGVudCc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpID0gMCwgYUxQUiA9IFtdLCBvID0gdGhpcywgYUJ1c2luZXNzID0gW10sIGFUYXggPSBbXSwgYUNoYW5nZSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcuanMtbHByLmFjdGl2ZScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFMUFJbaV0gPSAkKHRoaXMpLmRhdGEoJ2NvZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcuanMtYnVzaW5lc3MtdHlwZS5hY3RpdmUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhQnVzaW5lc3NbaV0gPSAkKHRoaXMpLmRhdGEoJ2NvZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcuanMtdGF4LXR5cGUuYWN0aXZlJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYVRheFtpXSA9ICQodGhpcykuZGF0YSgnY29kZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1jaGFuZ2UtdHlwZS5hY3RpdmUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhQ2hhbmdlW2ldID0gJCh0aGlzKS5kYXRhKCdjb2RlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICQuZ2V0KFwiXCIsIHsnTFBSW10nOiBhTFBSLCAnYnVzaW5lc3NfdHlwZVtdJzogYUJ1c2luZXNzLCAndGF4X3R5cGVbXSc6IGFUYXgsICdjaGFuZ2VfdHlwZVtdJzogYUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICkuZG9uZShmdW5jdGlvbiAocmVzdWx0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG8uY29udGVudEZpZWxkLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgby5jb250ZW50RmllbGQuYXBwZW5kKHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbi5pbnN0YWxsQ29udHJvbGxlcignLmpzLWFjY29yZGlvbicsICdhcHBXaWRnZXRBY2NvcmRpb24nKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVJST1IgQURESU5HIENPTlRFTlQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuV2lkZ2V0cy5DaGVja1N1YnNjcmliZUZvcm0gPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0Q2hlY2tTdWJzY3JpYmVGb3JtJyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICQoJ2Zvcm1bbmFtZT1cIlBPUFVQX1NVQlNDUklQVElPTlwiXScpLmZpbmQoJy5qcy1pY2hlY2tib3gucnVicmljcycpLm9uKCdpZkNsaWNrZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQoJ2Zvcm1bbmFtZT1cIlBPUFVQX1NVQlNDUklQVElPTlwiXScpLmZpbmQoJy5qcy1pY2hlY2tib3gucnVicmljcycpLmlDaGVjaygndW5jaGVjaycpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soJ2NoZWNrJyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgJCgnZm9ybVtuYW1lPVwiUE9QVVBfU1VCU0NSSVBUSU9OXCJdJykuZmluZCgnLmpzLWljaGVja2JveC5jaXRpZXMnKS5vbignaWZDbGlja2VkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdmb3JtW25hbWU9XCJQT1BVUF9TVUJTQ1JJUFRJT05cIl0nKS5maW5kKCcuanMtaWNoZWNrYm94LmNpdGllcycpLmlDaGVjaygndW5jaGVjaycpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soJ2NoZWNrJyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMuQ2xpZW50c0ZpbHRlciA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldENsaWVudHNGaWx0ZXInLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ICAgIHRoaXMuZmlsdGVyQnRuID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1jbGllbnRzLWZpbHRlcl9fYnRuJyk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJCdG5zTGlzdCA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtY2xpZW50cy1maWx0ZXJfX2J0bnMtbGlzdCcpO1xyXG5cdFx0XHQgICAgdGhpcy5maWx0ZXJJdGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1jbGllbnRzLWZpbHRlcl9faXRlbScpO1xyXG5cdFx0XHRcdHRoaXMuc2VsZWN0TWVudSA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtY2xpZW50cy1maWx0ZXJfX3NlbGVjdC1tZW51Jyk7XHJcblx0XHRcdFx0dGhpcy5zaG93TW9yZUJ0biA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtY2xpZW50cy1maWx0ZXJfX3Nob3ctbW9yZS1idG4nKTtcclxuXHRcdFx0XHR0aGlzLmZvcmVpZ25DbGllbnRzID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1jbGllbnRzLWZpbHRlcl9fZm9yZWlnbicpO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyQnlDb3VudHJ5TGlzdCA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtY2xpZW50cy1maWx0ZXJfX2J5LWNvdW50cnktbGlzdCcpO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyQnlDb3VudHJ5QnRuID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1jbGllbnRzLWZpbHRlcl9fYnktY291bnRyeS1idG4nKTtcclxuXHRcdFx0XHR0aGlzLmZpbHRlckJ5Q291bnRyeUJ0bkFsbCA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtY2xpZW50cy1maWx0ZXJfX2J5LWNvdW50cnktYnRuW2RhdGEtaWQ9XCJmb3JlaWduLWNsaWVudHNcIl0nKTtcclxuXHJcblx0XHRcdFx0dmFyIGZpbHRlckJ0bklzQ2xpY2tlZCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRpZighdGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdqcy1jbGllbnRzLWZpbHRlci0tbm8tc2xpY2UnKSkge1xyXG5cdFx0XHRcdFx0dGhpcy5maWx0ZXJJdGVtLnNsaWNlKDAsIDEyKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZih0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ2pzLWNsaWVudHMtZmlsdGVyLS1uby1zbGljZScpICYmICQod2luZG93KS53aWR0aCgpIDwgMTAwMykge1xyXG5cdFx0XHRcdFx0dGhpcy5maWx0ZXJJdGVtLnNsaWNlKDAsIDEyKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQgICAgdGhpcy5vbih0aGlzLmZpbHRlckJ0biwgJ2NsaWNrJywgJ3N3aXRjaFRhYk9uQ2xpY2snKTtcclxuXHRcdFx0ICAgIHRoaXMub24odGhpcy5maWx0ZXJCeUNvdW50cnlCdG4sICdjbGljaycsICdmaWx0ZXJCeUNvdW50cnknKTtcclxuXHRcdFx0XHR0aGlzLm9uKHRoaXMuc2VsZWN0TWVudSwgJ2NsaWNrJywgJ3Nob3dUYWJzTGlzdE9uQ2xpY2snKTtcclxuXHRcdFx0XHR0aGlzLm9uKHRoaXMuc2hvd01vcmVCdG4sICdjbGljaycsICdzaG93TW9yZUl0ZW1zJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnc3dpdGNoVGFiT25DbGljayc6IGZ1bmN0aW9uKGVsLCBldikge1xyXG5cdFx0XHRcdHZhciBmaWx0ZXJJZCA9IGVsLmF0dHIoJ2RhdGEtaWQnKTtcclxuXHJcblx0XHRcdFx0Ly8g0J/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INCw0LrRgtC40LLQvdC+0LPQviDRgdC+0YHRgtC+0Y/QvdC40Y8g0YLQsNCx0L7QslxyXG5cdFx0XHRcdHRoaXMuZmlsdGVyQnRuLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdC8vINCY0LfQvNC10L3QtdC90LjQtSDRhtCy0LXRgtCwINC00LXQutC+0YDQsNGC0LjQstC90L7QuSDQu9C40L3QuNC4INCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0LjQuCDRgSDRhtCy0LXRgtC+0Lwg0YLQtdC60YPRidC10Lkg0LLQutC70LDQtNC60LhcclxuXHRcdFx0XHR2YXIgdGFyZ2V0Q29sb3IgPSBlbC5kYXRhKCdjb2xvcicpO1xyXG5cdFx0XHRcdHZhciB0YXJnZXRJZEFycmF5ID0gW107XHJcblxyXG5cdFx0XHRcdCQoJy5qcy1jbGllbnRzLWZpbHRlcl9fYnRuJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBhdHRycyA9ICQodGhpcykuZGF0YSgnY29sb3InKTtcclxuXHRcdFx0XHRcdHRhcmdldElkQXJyYXkucHVzaChhdHRycyk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXRJZEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdCAgICBcdHZhciB0YXJnZXRJZEFycmF5SXRlbSA9IHRhcmdldElkQXJyYXlbaV07XHJcblxyXG5cdFx0XHQgICAgXHRlbC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaG9yaXpvbnRhbC10YWJzX19saXN0LS0nICsgdGFyZ2V0SWRBcnJheUl0ZW0pLmFkZENsYXNzKCdob3Jpem9udGFsLXRhYnNfX2xpc3QtLScgKyB0YXJnZXRDb2xvcik7XHJcblx0XHRcdCAgICB9XHJcblxyXG5cdFx0XHQgICAgLy8g0KTQuNC70YzRgtGA0LDRhtC40Y8g0LrQu9C40LXQvdGC0L7QslxyXG5cdFx0XHQgICAgdGhpcy5maWx0ZXJJdGVtLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtZmlsdGVyfj1cIicgKyBmaWx0ZXJJZCArICdcIl0nKTtcclxuXHJcblx0XHRcdCAgICBpZighdGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdqcy1jbGllbnRzLWZpbHRlci0tbm8tc2xpY2UnKSkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWQuc2xpY2UoMCwgMTIpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKHRoaXMuZWxlbWVudC5oYXNDbGFzcygnanMtY2xpZW50cy1maWx0ZXItLW5vLXNsaWNlJykgJiYgJCh3aW5kb3cpLndpZHRoKCkgPCAxMDAzKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZC5zbGljZSgwLCAxMikucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWQucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vINCa0LvQuNC6INC/0L4g0LLQutC70LDQtNC60LUgXCLQmNC90L7RgdGC0YDQsNC90L3Ri9C1INC60LvQuNC10L3RgtGLXCJcclxuXHRcdFx0XHR0aGlzLmZvcmVpZ25DbGllbnRzLnJlbW92ZUNsYXNzKCdob3Jpem9udGFsLXRhYnNfXzItMy1jb2wnKTtcclxuXHRcdFx0XHR0aGlzLmZpbHRlckJ5Q291bnRyeUxpc3QuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcblx0XHRcdFx0aWYoZWwuaGFzQ2xhc3MoJ2pzLWNsaWVudHMtZmlsdGVyX19idG4tLWZvcmVpZ24nKSAmJiAhdGhpcy5mb3JlaWduQ2xpZW50cy5oYXNDbGFzcygnaG9yaXpvbnRhbC10YWJzX18yLTMtY29sJykpIHtcclxuXHRcdFx0XHRcdHRoaXMuZm9yZWlnbkNsaWVudHMuYWRkQ2xhc3MoJ2hvcml6b250YWwtdGFic19fMi0zLWNvbCcpO1xyXG5cdFx0XHRcdFx0dGhpcy5maWx0ZXJCeUNvdW50cnlMaXN0LnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Y8g0YTQuNC70YzRgtGA0LAg0L/QviDRgdGC0YDQsNC90LDQvCDQv9C+0YHQu9C1INC/0LXRgNC10YXQvtC00LAg0Log0LTRgNGD0LPQuNC8INGC0LDQsdCw0LxcclxuXHRcdFx0XHR0aGlzLmZpbHRlckJ5Q291bnRyeUJ0bi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJCeUNvdW50cnlCdG5BbGwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0ICAgIC8vINCg0LDQsdC+0YLQsCDRgdC10LvQtdC60YLQsCwg0LIg0LrQvtGC0L7RgNGL0Lkg0YLRgNCw0L3RgdGE0L7RgNC80LjRgNGD0Y7RgtGB0Y8g0LLQutC70LDQtNC60Lgg0L3QsCDQvNC+0LHQuNC70YzQvdGL0YVcclxuXHRcdFx0XHR0aGlzLmFjdGl2ZVRhYlRleHQgPSBlbC50ZXh0KCk7XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RNZW51LnRleHQodGhpcy5hY3RpdmVUYWJUZXh0KTtcclxuXHRcdFx0XHR0aGlzLnNob3dUYWJzTGlzdE9uQ2xpY2soKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIGZpbHRlcmVkO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0J3Nob3dUYWJzTGlzdE9uQ2xpY2snOiBmdW5jdGlvbihlbCwgZXYpIHtcclxuXHRcdFx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA8IDEwMDMpIHtcclxuXHRcdFx0XHRcdHRoaXMuZmlsdGVyQnRuc0xpc3Quc2xpZGVUb2dnbGUoJ2Zhc3QnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnZmlsdGVyQnlDb3VudHJ5JzogZnVuY3Rpb24oZWwsIGV2KSB7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJCeUNvdW50cnlCdG4ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0dGhpcy5maWx0ZXJJdGVtLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0dmFyIGZpbHRlcklkID0gZWwuYXR0cignZGF0YS1pZCcpO1xyXG5cdFx0XHQgICAgdmFyIGZpbHRlcmVkID0gdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWZpbHRlcn49XCInICsgZmlsdGVySWQgKyAnXCJdJyk7XHJcblxyXG5cdFx0XHQgICAgaWYoIXRoaXMuZWxlbWVudC5oYXNDbGFzcygnanMtY2xpZW50cy1maWx0ZXItLW5vLXNsaWNlJykpIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkLnNsaWNlKDAsIDEyKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZih0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ2pzLWNsaWVudHMtZmlsdGVyLS1uby1zbGljZScpICYmICQod2luZG93KS53aWR0aCgpIDwgMTAwMykge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWQuc2xpY2UoMCwgMTIpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0J3Nob3dNb3JlSXRlbXMnOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRjb3VudHJ5SWQgPSB0aGlzLmZpbHRlckJ5Q291bnRyeUJ0bi5maWx0ZXIoJy5hY3RpdmUnKS5kYXRhKCdpZCcpO1xyXG5cdFx0XHRcdHRoaXMuaGlkZGVuSXRlbXMgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWNsaWVudHMtZmlsdGVyX19pdGVtJykuZmlsdGVyKCdbZGF0YS1maWx0ZXJ+PVwiJyArIGNvdW50cnlJZCArICdcIl0nKS5maWx0ZXIoJzpoaWRkZW4nKTtcclxuXHRcdFx0XHR0aGlzLmhpZGRlbkl0ZW1zLnNsaWNlKDAsIDEyKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTtcclxuIiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMuQ3VzdG9tRm9ybUVsZW1lbnQgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0Q3VzdG9tRm9ybUVsZW1lbnQnLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge31cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja2JveCA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtY3VzdG9tLWZvcm0tZWxlbWVudF9fY2hlY2tib3gnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFkaW8gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWN1c3RvbS1mb3JtLWVsZW1lbnRfX3JhZGlvJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja2JveC5pQ2hlY2soe1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94Q2xhc3M6ICdjdXN0b20tY2hlY2tib3gnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWRDaGVja2JveENsYXNzOiAnY3VzdG9tLWNoZWNrYm94LS1jaGVja2VkJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmFkaW8uaUNoZWNrKHtcclxuICAgICAgICAgICAgICAgICAgICByYWRpb0NsYXNzOiAnY3VzdG9tLXJhZGlvJyxcclxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkUmFkaW9DbGFzczogJ2N1c3RvbS1yYWRpby0tY2hlY2tlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yYWRpby5vbignaWZDaGVja2VkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1lcnJvcicpID09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCgnLmZvcm1fX2Vycm9ycyBwJykubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5mb3JtX19lcnJvcnMnKS5hcHBlbmQoJzxwPjwvcD4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2Zvcm1fcmFkaW9fRk9STV9TVEFUVVMtZXJyb3InKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmZvcm1fX2Vycm9ycyBwJykuYXBwZW5kKCc8Zm9udCBpZD1cImZvcm1fcmFkaW9fRk9STV9TVEFUVVMtZXJyb3JcIiBjbGFzcz1cImVycm9ydGV4dFwiPtCY0LfQstC40L3QuNGC0LUsINC90L4g0Y3RgtC+INC30LDQutGA0YvRgtC+0LUg0LzQtdGA0L7Qv9GA0LjRj9GC0LjQtSDRgtC+0LvRjNC60L4g0LTQu9GPINCz0LXQvdC10YDQsNC70YzQvdGL0YUg0LTQuNGA0LXQutGC0L7RgNC+0LIg0Lgg0YHQvtCx0YHRgtCy0LXQvdC90LjQutC+0LIg0LHQuNC30L3QtdGB0LA8YnI+PC9mb250PicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjZm9ybV9yYWRpb19GT1JNX1NUQVRVUy1lcnJvcicpLmRldGFjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG90aGVySW5wdXQgPSAkKCcub3RoZXItaW5wdXQnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFyZW50JykgPT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVySW5wdXQuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVySW5wdXQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJJbnB1dC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcuanMtY3VzdG9tLWZvcm0tZWxlbWVudF9fY2hlY2tib3gnKS5maWx0ZXIoJ1tkYXRhLXBhcmVudD1cInRydWVcIl0nKS5vbignaWZDaGVja2VkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvdGhlcklucHV0ID0gJCgnLm90aGVyLXRoZW1lLWlucHV0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVySW5wdXQuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnLmpzLWN1c3RvbS1mb3JtLWVsZW1lbnRfX2NoZWNrYm94JykuZmlsdGVyKCdbZGF0YS1wYXJlbnQ9XCJ0cnVlXCJdJykub24oJ2lmVW5jaGVja2VkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvdGhlcklucHV0ID0gJCgnLm90aGVyLXRoZW1lLWlucHV0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3RoZXJJbnB1dC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG4gIEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG4gIEFwcC5XaWRnZXRzLldpZGdldHMuQ3VzdG9tU2VsZWN0ID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAge1xyXG4gICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0Q3VzdG9tU2VsZWN0JyxcclxuICAgICAgZGVmYXVsdHM6IHt9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3QgPSB0aGlzLmVsZW1lbnQuc2VsZWN0Mih7XHJcbiAgICAgICAgICB3aWR0aDogJ29mZicsXHJcbiAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogLTEsXHJcbiAgICAgICAgICBkcm9wZG93bkF1dG9XaWR0aDogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5Ecm9wZG93bk1lbnUgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXREcm9wZG93bk1lbnUnLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLm1lbnVUb2dnbGVCdG4gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLW1lbnVfX3RvZ2dsZS1idG4nKTtcclxuXHRcdFx0ICAgIHRoaXMubWVudUl0ZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLW1lbnVfX2l0ZW0nKTtcclxuXHRcdFx0ICAgIHRoaXMubWVudUxpc3QgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLW1lbnVfX2xpc3QnKTtcclxuXHRcdFx0ICAgIHZhciBzZWxmID0gdGhpcy5lbGVtZW50O1xyXG5cclxuXHRcdFx0ICAgIHRoaXMubWVudUl0ZW0ub24oJ21vdXNlZW50ZXIgbW91c2VsZWF2ZScsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ICAgIFx0dGhpcy5tZW51Q29udGFpbmVyID0gc2VsZi5maW5kKCcuanMtbWVudV9fY29udGFpbmVyJyk7XHJcblx0XHRcdFx0XHR0aGlzLm1lbnVDb250YWluZXJXaWR0aCA9IHRoaXMubWVudUNvbnRhaW5lci5vdXRlcldpZHRoKCk7XHJcblx0XHRcdFx0XHR0aGlzLm1lbnVDb250YWluZXJPZmZzZXRMZWZ0ID0gdGhpcy5tZW51Q29udGFpbmVyLm9mZnNldCgpLmxlZnQ7XHJcblxyXG5cdFx0XHRcdCAgICB0aGlzLmRyb3Bkb3duID0gJCh0aGlzKS5maW5kKCcuanMtbWVudV9fZHJvcGRvd24nKTtcclxuXHRcdFx0XHQgICAgdGhpcy5kcm9wZG93bldpZHRoID0gdGhpcy5kcm9wZG93bi5vdXRlcldpZHRoKCk7XHJcblx0XHRcdFx0ICAgIHRoaXMuZHJvcGRvd25PZmZzZXRMZWZ0ID0gdGhpcy5kcm9wZG93bi5vZmZzZXQoKS5sZWZ0O1xyXG5cclxuXHRcdFx0XHQgICAgdmFyIGlzVmlzaWJsZSA9ICh0aGlzLmRyb3Bkb3duT2Zmc2V0TGVmdCArIHRoaXMuZHJvcGRvd25XaWR0aCA8PSB0aGlzLm1lbnVDb250YWluZXJXaWR0aCArIHRoaXMubWVudUNvbnRhaW5lck9mZnNldExlZnQpO1xyXG5cclxuXHRcdFx0ICAgIFx0aWYgKCFpc1Zpc2libGUpIHtcclxuXHRcdCAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5qcy1tZW51X19kcm9wZG93bicpLmFkZENsYXNzKCdtYWluLW5hdl9fZHJvcGRvd24tLXJpZ2h0Jyk7XHJcblx0XHQgICAgICAgICAgICB9IGVsc2Uge1xyXG5cdFx0ICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLmpzLW1lbnVfX2Ryb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ21haW4tbmF2X19kcm9wZG93bi0tcmlnaHQnKTtcclxuXHRcdCAgICAgICAgICAgIH1cclxuXHRcdFx0ICAgIH0pO1xyXG5cclxuXHRcdFx0ICAgIHRoaXMubWVudVRvZ2dsZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0ICAgIFx0JCh0aGlzKS50b2dnbGVDbGFzcygnbWFpbi1uYXZfX21lbnUtYnRuLS1hY3RpdmUnKTtcclxuXHRcdFx0ICAgIFx0JCgnLmpzLW1lbnVfX2xpc3QnKS50b2dnbGVDbGFzcygnbWFpbi1uYXZfX2xpc3QtLW9wZW4nKTtcclxuXHRcdFx0ICAgIFx0c2VsZi50b2dnbGVDbGFzcygnbWFpbi1uYXYtLW9wZW4nKTtcclxuXHRcdFx0ICAgIFx0JCgnYm9keScpLnRvZ2dsZUNsYXNzKCdvdmVyZmxvdy1pcy1oaWRkZW4nKTtcclxuXHRcdFx0ICAgIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLkVxdWFsSGVpZ2h0QmxvY2tzID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0RXF1YWxIZWlnaHRCbG9ja3MnLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLml0ZW1zID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1lcXVhbC1oZWlnaHQtYmxvY2tzX19pdGVtJyk7XHJcblx0XHRcdFx0dGhpcy5pbWFnZXMgPSB0aGlzLmVsZW1lbnQuZmluZCgnaW1nJyk7XHJcblxyXG5cdFx0XHRcdHRoaXMuc2V0SGVpZ2h0KCk7XHJcblx0XHRcdCAgICB0aGlzLm9uKHdpbmRvdywgJ3Jlc2l6ZScsICdzZXRIZWlnaHQnKTtcclxuXHRcdFx0ICAgIHRoaXMub24odGhpcy5pbWFnZXMsICdsb2FkJywgJ3NldEhlaWdodCcpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0J3NldEhlaWdodCc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBtYXhIZWlnaHQgPSAwO1xyXG5cdFx0XHRcdHRoaXMuaXRlbXMuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xyXG5cclxuXHRcdFx0XHR0aGlzLml0ZW1zLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdFx0XHRcdHZhciBpdGVtSGVpZ2h0ID0gcGFyc2VJbnQoJCh0aGlzKS5vdXRlckhlaWdodCgpKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXRlbUhlaWdodCA+IG1heEhlaWdodCkge1xyXG5cdFx0XHRcdFx0XHRtYXhIZWlnaHQgPSBpdGVtSGVpZ2h0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLml0ZW1zLmNzcygnaGVpZ2h0JywgbWF4SGVpZ2h0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7XHJcblxyXG5cclxuIiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5FdmVudFB1c2ggPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRFdmVudFB1c2gnXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCAgICB0aGlzLmV2ZW50TmFtZSA9IHRoaXMuZWxlbWVudC5kYXRhKCdwdXNoLS1ldmVudCcpO1xyXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBHVE1wdXNoRXZlbnQgPT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0XHRcdFx0aWYgKCFnZXRDb29raWUoc2VsZi5ldmVudE5hbWUpKSB7IEdUTXB1c2hFdmVudChzZWxmLmV2ZW50TmFtZSk7IHNldENvb2tpZShzZWxmLmV2ZW50TmFtZSwgMSwgMjQqNjAqNjApOyB9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG4gICAgQXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzLkV2ZW50c0FyY2hpdmUgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0RXZlbnRzQXJjaGl2ZScsXHJcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7fVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckl0ZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWV2ZW50cy1maWx0ZXItaXRlbScpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZW50aXR5RmllbGQgPSAkKCcuanMtZXZlbnQtbGlzdCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbnRpdHlGaWVsZFBhZ2VyID0gJCgnLmpzLWV2ZW50LWxpc3QgPiAuanMtcGFnaW5hdGlvbi0tZXZlbnRzJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZmlsdGVySXRlbSwgJ2NsaWNrJywgJ2ZpbHRlckFyY2hpdmVPbkNsaWNrJyk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgJ2ZpbHRlckFyY2hpdmVPbkNsaWNrJzogZnVuY3Rpb24oZWwsIGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWwuaGFzQ2xhc3MoJ2N1cnJlbnQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLmZpbmQoJy5jdXJyZW50LWNsb3NlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLnByZXBlbmQoJzxzcGFuIGNsYXNzPVwiY3VycmVudC1jbG9zZVwiPmNsb3NlPC9zcGFuPicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWwudG9nZ2xlQ2xhc3MoJ2N1cnJlbnQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUV2ZW50cygpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgJ3VwZGF0ZUV2ZW50cyc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGk9MCwgYURhdGU9W10sIG89dGhpcywgYVRhZz1bXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWV2ZW50cy1maWx0ZXItaXRlbS5jdXJyZW50JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYURhdGVbaV0gPSAkKHRoaXMpLmRhdGEoJ21vbnRoJykrXCItXCIrJCh0aGlzKS5kYXRhKCd5ZWFyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5nZXQoXCJcIix7J0RBVEVbXSc6YURhdGV9XHJcbiAgICAgICAgICAgICAgICApLmRvbmUoZnVuY3Rpb24ocmVzdWx0KXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgby5lbnRpdHlGaWVsZC5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG8uZW50aXR5RmllbGQuYXBwZW5kKHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVJST1IgQURESU5HIEVWRU5UUycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG4gICAgQXBwLldpZGdldHMuRXZlbnQgPSBBcHAuV2lkZ2V0cy5FdmVudCB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzLkV2ZW50LkxhenlMb2FkID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldEV2ZW50TGF6eUxvYWQnLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgICAgICAgZ2F0ZXdheTogJy9hamF4L2V2ZW50cy5pbnNlcnQvJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBpZCA9IHRoaXMuZWxlbWVudC5kYXRhKCdwaWQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFBhcmFtcyA9IHdpbmRvd1xyXG4gICAgICAgICAgICAgICAgICAgIC5sb2NhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIC5zZWFyY2hcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnPycsICcnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdCgnJicpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHAsIGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gZS5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFtkZWNvZGVVUklDb21wb25lbnQoYVswXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBpZCB8fCB0aGlzLnBpZCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZ2V0KHRoaXMub3B0aW9ucy5nYXRld2F5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5waWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9jYWNoZTogdGhpcy5yZXF1ZXN0UGFyYW1zWydjbGVhcl9jYWNoZSddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMucHJveHkoJ2luc2VydEV2ZW50JykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJST1I6IGFwcFdpZGdldEV2ZW50TGF6eUxvYWQgdW5hYmxlIHRvIGxvYWQgYmFubmVyIElEICcgKyB0aGlzLlBJRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgaW5zZXJ0RXZlbnQ6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIHhocikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lmh0bWwoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRFdmVudHMoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGluaXRFdmVudHM6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYXBwbGljYXRpb24uaW5zdGFsbENvbnRyb2xsZXIodGhpcy5lbGVtZW50LmZpbmQoJy5qcy1nZXQtZXZlbnQtZm9ybScpLCAnYXBwV2lkZ2V0RXZlbnRGb3JtR2V0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZpZGVvID0gdGhpcy5lbGVtZW50LmZpbmQoJy52aWRlbycpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlID0gdGhpcy5lbGVtZW50LmZpbmQoJy5ldmVudF9fcHJvcHMtcGxhY2UnKSxcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgICAgdmlkZW8ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdmlkZW8tc3JjJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UobmV3IFJlZ0V4cChcIndhdGNoXFxcXD92PVwiLCBcImlcIiksICd2LycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnP2ZzPTEmYXV0b3BsYXk9MSZyZWw9MCc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQuZmFuY3lib3goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyd3cmFwQ1NTJzogJ21vZGFsLXdyYXBwZXInLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmcnOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHJlZic6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnc3dmJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N3Zic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3bW9kZSc6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYWxsb3dmdWxsc2NyZWVuJzogJ3RydWUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHBsYWNlLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmRhdGEoJ2lkJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdCA9ICQodGhpcykuZGF0YSgnbGF0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmcgPSAkKHRoaXMpLmRhdGEoJ2xvbmcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJC5mYW5jeWJveC5vcGVuKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcENTUzogJ21vZGFsLXdyYXBwZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICgkKHdpbmRvdykud2lkdGgoKSA+IDkzNykgPyAyMCA6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDE1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWxwZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kJzogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IFwiL2xvY2FsL2NvbXBvbmVudHMvd2lzZWFkdmljZS9ldmVudHMvdGVtcGxhdGVzLy5kZWZhdWx0L21hcC5waHBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhamF4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFqYXg6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlclNob3c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cmkgPSBcImh0dHBzOi8vYXBpLW1hcHMueWFuZGV4LnJ1LzIuMS8/bGFuZz1ydV9SVVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5nZXRTY3JpcHQodXJpLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMubWFwUmVhZHkobGF0LCBsb25nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIG1hcFJlYWR5OiBmdW5jdGlvbiAobGF0LCBsb25nKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgeW1hcHMucmVhZHkoc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5pdE1hcChsYXQsIGxvbmcpXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBpbml0TWFwOiBmdW5jdGlvbiAobGF0LCBsb25nKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hcENlbnRlciA9IFtsYXQsIGxvbmddO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1hcENlbnRlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1hcENvbnRyb2wgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vblNoYWRvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb25JbWFnZUhyZWY6ICcvbG9jYWwvdGVtcGxhdGVzL21haW4vYnVpbGQvaW1hZ2VzL3dhLW1hcC1tYXJrLnBuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbkltYWdlU2l6ZTogWzQ5LCA0NV0sXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiA5OFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgd2FNYXAgPSBuZXcgeW1hcHMuTWFwKFwianMtbWFwXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IG1hcENlbnRlcixcclxuICAgICAgICAgICAgICAgICAgICB6b29tOiAxMyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sczogW11cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHdhTWFwLmJlaGF2aW9ycy5kaXNhYmxlKFsnc2Nyb2xsWm9vbScsICdkcmFnJ10pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB3YVBsYWNlbWFyayA9IG5ldyB5bWFwcy5QbGFjZW1hcmsobWFwQ2VudGVyLCB7fSwgbWFwQ29udHJvbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2FNYXAuZ2VvT2JqZWN0cy5hZGQod2FQbGFjZW1hcmspO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FNYXAuc2V0Q2VudGVyKG1hcENlbnRlcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLkZpbHRlciA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldEZpbHRlcicsXHJcblx0XHRcdGRlZmF1bHRzOiB7fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyQnRuID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1maWx0ZXJfX2J0bicpO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVySXRlbSA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtZmlsdGVyX19pdGVtJyk7XHJcblx0XHRcdFx0dGhpcy5vbih0aGlzLmZpbHRlckJ0biwgJ2NsaWNrJywgJ2ZpbHRlck9uQ2xpY2snKTtcclxuXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnZmlsdGVyT25DbGljayc6IGZ1bmN0aW9uKGVsLCBlbSkge1xyXG5cdFx0XHRcdHZhciBmaWx0ZXJJZCA9IGVsLmF0dHIoJ2RhdGEtaWQnKTtcclxuXHJcblx0XHRcdFx0dGhpcy5maWx0ZXJJdGVtLmhpZGUoKTtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtZmlsdGVyfj1cIicgKyBmaWx0ZXJJZCArICdcIl0nKS5zaG93KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMuRmxpcENhcmQgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRGbGlwQ2FyZCcsXHJcblx0XHRcdGRlZmF1bHRzOiB7fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuZmxpcENhcmRGcm9udCA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtZmxpcC1jYXJkX19mcm9udCcpO1xyXG5cdFx0XHRcdHRoaXMuZmxpcENhcmRCYWNrID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1mbGlwLWNhcmRfX2JhY2snKTtcclxuXHJcblx0XHRcdFx0dGhpcy5vbih0aGlzLmVsZW1lbnQsICdtb3VzZWVudGVyJywgJ2ZsaXBPbk1vdXNlZW50ZXInKTtcclxuXHRcdFx0XHR0aGlzLm9uKHRoaXMuZWxlbWVudCwgJ21vdXNlbGVhdmUnLCAnZmxpcEJhY2tPbk1vdXNlbGVhdmUnKTtcclxuXHRcdFx0XHR0aGlzLm9uKHRoaXMuZWxlbWVudCwgJ2NsaWNrJywgJ2ZsaXBPbkNsaWNrJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnZmxpcE9uQ2xpY2snOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZih3aW5kb3cuVVNFUl9JU19UT1VDSElORykge1xyXG5cdFx0XHRcdFx0aWYodGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdmbGlwLS1ob3ZlcmVkJykpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmbGlwLS1ob3ZlcmVkJyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50LnRvZ2dsZUNsYXNzKCdmbGlwLS1jbGlja2VkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0J2ZsaXBPbk1vdXNlZW50ZXInOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZighd2luZG93LlVTRVJfSVNfVE9VQ0hJTkcpIHtcclxuXHRcdFx0XHRcdGlmKHRoaXMuZWxlbWVudC5oYXNDbGFzcygnZmxpcC0tY2xpY2tlZCcpKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnZmxpcC0tY2xpY2tlZCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hZGRDbGFzcygnZmxpcC0taG92ZXJlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdCdmbGlwQmFja09uTW91c2VsZWF2ZSc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmKCF3aW5kb3cuVVNFUl9JU19UT1VDSElORykge1xyXG5cdFx0XHRcdFx0aWYodGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdmbGlwLS1jbGlja2VkJykpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmbGlwLS1jbGlja2VkJyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdmbGlwLS1ob3ZlcmVkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTtcclxuXHJcblxyXG4iLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLkZvcm1TZWxlY3QgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRGb3JtU2VsZWN0JyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5zZWxlY3QgPSB0aGlzLmVsZW1lbnQuc2VsZWN0Mih7XHJcblx0XHRcdFx0XHRtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHksXHJcblx0XHRcdFx0XHR0aGVtZTogXCJmb3JtLXNlbGVjdFwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5QbHVnaW5zID0gQXBwLlBsdWdpbnMgfHwge307XHJcblx0QXBwLlBsdWdpbnMuSFJUZXN0ID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwUGx1Z2luSFJUZXN0JyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuZ2F0ZXdheSA9IHRoaXMuZWxlbWVudC5kYXRhKCdnYXRld2F5Jyk7XHJcblx0XHRcdFx0dGhpcy5ib2R5ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1wbHVnaW4tYm9keScpO1xyXG5cdFx0XHRcdHRoaXMuYmFzZUFuc3dlckNsYXNzID0gJ3Rlc3QtcXVlc3Rpb25zX19hbnN3ZXInO1xyXG5cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHJlbG9hZEJvZHk6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0dGhpcy5ib2R5LnN0YXJ0V2FpdGluZygpO1xyXG5cdFx0XHRcdCQucG9zdCh0aGlzLmdhdGV3YXksIGRhdGEsIHRoaXMucHJveHkoJ19yZXBsYWNlQm9keUNvbnRlbnQnKSk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRfcmVwbGFjZUJvZHlDb250ZW50OiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHJcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0XHRzZWxmLmJvZHkuaHRtbChyZXNwb25zZSk7XHJcblxyXG5cdFx0XHRcdHNlbGYucmFkaW9CdG4gPSBzZWxmLmVsZW1lbnQuZmluZCgnLmpzLWFuc3dlcicpO1xyXG5cclxuXHRcdFx0XHR2YXIgY3VycmVudFF1ZXN0aW9uTnVtID0gc2VsZi5lbGVtZW50LmZpbmQoJy5qcy1xdWVzdGlvbicpLmRhdGEoJ251bScpO1xyXG5cclxuXHRcdFx0XHRzZWxmLnJhZGlvQnRuLmlDaGVjayh7XHJcblx0XHRcdFx0XHRyYWRpb0NsYXNzOiAnY3VzdG9tLXJhZGlvJyxcclxuXHRcdFx0XHRcdGNoZWNrZWRSYWRpb0NsYXNzOiAnY3VzdG9tLXJhZGlvLS1jaGVja2VkJyxcclxuXHRcdFx0XHRcdGN1cnNvcjogdHJ1ZVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRzZWxmLmJvZHkuZW5kV2FpdGluZygpO1xyXG5cclxuXHRcdFx0XHRzZWxmLnJhZGlvQnRuLm9uKCdpZkNoYW5nZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdCQucG9zdChzZWxmLmdhdGV3YXksIHtcclxuXHRcdFx0XHRcdFx0YWN0aW9uOiAnZ2V0Y29tbWVudCcsXHJcblx0XHRcdFx0XHRcdHE6IGN1cnJlbnRRdWVzdGlvbk51bSxcclxuXHRcdFx0XHRcdFx0YTogJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKCdudW0nKVxyXG5cdFx0XHRcdFx0fSwgc2VsZi5wcm94eShmdW5jdGlvbiAoYW5zd2VyKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuX2dldEFuc3dlckNvbW1lbnQoYW5zd2VyLCAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpKTtcclxuXHRcdFx0XHRcdH0pLCAnanNvbicpO1xyXG5cdFx0XHRcdFx0c2VsZi5lbGVtZW50LmZpbmQoJy5qcy1idXR0b24tMScpLmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0X2dldEFuc3dlckNvbW1lbnQ6IGZ1bmN0aW9uIChhbnN3ZXIsIGJ0bikge1xyXG5cdFx0XHRcdHZhciAkbGFiZWwgPSBidG4ucGFyZW50KCkucGFyZW50KCk7XHJcblxyXG5cdFx0XHRcdCRsYWJlbC5hZGRDbGFzcyh0aGlzLmJhc2VBbnN3ZXJDbGFzcyArICctLScgKyBhbnN3ZXIudHlwZSArICcgaXMtc2VsZWN0ZWQnKTtcclxuXHRcdFx0XHQkbGFiZWwucGFyZW50KCkuZmluZCgnLmpzLWNvbW1lbnQnKS5odG1sKGFuc3dlci50ZXh0KS5hZGRDbGFzcygnaXMtc2hvd24nKTtcclxuXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnLmpzLWJ1dHRvbi0xIGNsaWNrJzogZnVuY3Rpb24gKGVsLCBldikge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0dmFyIGRhdGEgPSAkLmV4dGVuZChlbC5kYXRhKCdwYXJhbScpLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcTogJCgnLmpzLXF1ZXN0aW9uJykuYXR0cignZGF0YS1udW0nKSxcclxuICAgICAgICAgICAgICAgICAgICBhOiAkKCcuanMtYW5zd2VyOmNoZWNrZWQnKS5hdHRyKCdkYXRhLW51bScpXHJcbiAgICAgICAgICAgIFx0fSk7XHJcblx0XHRcdFx0dGhpcy5yZWxvYWRCb2R5KGRhdGEpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Jy5qcy1idXR0b24tMiBjbGljayc6IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHR2YXIgZW1haWwgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXVzZXJtYWlsJykudmFsKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLl92YWxpZE1haWwoZW1haWwpKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJlbG9hZEJvZHkoeydhY3Rpb24nOiAnZW1haWwnLCAnZW1haWwnOiBlbWFpbH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXVzZXJtYWlsJykuYWRkQ2xhc3MoJ2Zvcm1fX2lucHV0LS1pbnZhbGlkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0X3ZhbGlkTWFpbDogZnVuY3Rpb24gKGVtYWlsKSB7XHJcblx0XHRcdFx0dmFyIHJlID0gL14oKFtePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSsoXFwuW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKykqKXwoXFxcIi4rXFxcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcXSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC87XHJcblx0XHRcdFx0cmV0dXJuIHJlLnRlc3QoZW1haWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLkxhbmd1YWdlc1N3aXRjaCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldExhbmd1YWdlc1N3aXRjaCcsXHJcblx0XHRcdGRlZmF1bHRzOiB7fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB1cmxzID0gJCgnLmpzLWxhbmd1YWdlcy1zd2l0Y2hfX2J0bicpOyAvLyDQt9Cw0LrQtdGI0LjRgNC+0LLQsNC7IDQg0YTQu9Cw0LbQutC4INCyINC80LXQvdGOXHJcblx0XHRcdFx0dXJscy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdC8vINC10YHQu9C4INC90LXRgtGDINC60LvQsNGB0YHQsCBcImZyb20tY2FjaGV1cmxcIiwg0LTQtdC70LDQtdC8IGFqYXgg0LfQsNC/0YDQvtGBINC90LAg0YHRg9GJINGB0YLRgNCw0L3QuNGG0YtcclxuXHRcdFx0XHRcdGlmKCEkKHRoaXMpLmhhc0NsYXNzKCdmcm9tLWNhY2hldXJsJykpe1xyXG5cdFx0XHRcdFx0XHRjdXJyZW50VXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJykgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3Vic3RyaW5nKDEpO1xyXG5cdFx0XHRcdFx0XHQkLmdldChjdXJyZW50VXJsKS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdHN3aXRjaCh0aGlzLnVybC5zdWJzdHJpbmcoMCw0KSl7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICcvZW4vJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0dXJscy5maWx0ZXIoJ1tocmVmPVwiL2VuL1wiXScpLmF0dHIoJ2hyZWYnLHRoaXMudXJsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICcvZGUvJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0dXJscy5maWx0ZXIoJ1tocmVmPVwiL2RlL1wiXScpLmF0dHIoJ2hyZWYnLHRoaXMudXJsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlICcvZnIvJzpcclxuXHRcdFx0XHRcdFx0XHRcdFx0dXJscy5maWx0ZXIoJ1tocmVmPVwiL2ZyL1wiXScpLmF0dHIoJ2hyZWYnLHRoaXMudXJsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRcdFx0XHR1cmxzLmZpbHRlcignW2hyZWY9XCIvXCJdJykuYXR0cignaHJlZicsdGhpcy51cmwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTtcclxuIiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5MYXp5TG9hZCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldExhenlMb2FkJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHtcclxuXHRcdFx0XHRnYXRld2F5OiAnL2FqYXgvY29udGVudC8nXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ICAgIHRoaXMuaW5jbHVkZVBhdGggPSB0aGlzLmVsZW1lbnQuZGF0YSgnYWpheC0tdXJsJyk7XHJcblx0XHRcdFx0dGhpcy5nYXRld2F5ID0gdGhpcy5lbGVtZW50LmRhdGEoJ2dhdGV3YXknKSA/IHRoaXMub3B0aW9ucy5nYXRld2F5K3RoaXMuZWxlbWVudC5kYXRhKCdnYXRld2F5JykrJy8nIDogdGhpcy5vcHRpb25zLmdhdGV3YXk7XHJcblx0XHRcdFx0aWYodGhpcy5pbmNsdWRlUGF0aCl7XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHQkLnBvc3QodGhpcy5nYXRld2F5LCB7cGF0aDogdGhpcy5pbmNsdWRlUGF0aH0sIHRoaXMucHJveHkoJ2luc2VydENvbnRlbnQnKSk7XHJcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0VSUk9SOiBhcHBXaWRnZXRMYXp5TG9hZCB1bmFibGUgdG8gbG9hZCBwYXRoICcrdGhpcy5pbmNsdWRlUGF0aCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0aW5zZXJ0Q29udGVudDogZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgeGhyKXtcclxuXHJcblx0XHRcdFx0dGhpcy5lbGVtZW50Lmh0bWwoZGF0YSk7XHJcblx0XHRcdFx0dmFyICRhckFjY29yZGlvbiA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtYWNjb3JkaW9uJyk7XHJcblx0XHRcdFx0d2luZG93LmFwcGxpY2F0aW9uLmluc3RhbGxDb250cm9sbGVyKCRhckFjY29yZGlvbiwgJ2FwcFdpZGdldEFjY29yZGlvbicpO1xyXG5cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5OZXdMYXp5TG9hZCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldE5ld0xhenlMb2FkJ1xyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuXHRcdFx0XHR0aGlzLnJlcXVlc3RLZXkgPSB0aGlzLmVsZW1lbnQuZGF0YSgnbGF6eWxvYWQta2V5Jyk7XHJcblx0XHRcdFx0dGhpcy5nYXRld2F5ID0gdGhpcy5wcmVwYXJlVXJpKCk7XHJcblx0XHRcdFx0dGhpcy5jb250cm9sID0gdGhpcy5lbGVtZW50LmRhdGEoJ2NvbnRyb2xsZXInKS5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVycyA9IHt9O1xyXG5cclxuXHRcdFx0XHRpZih0aGlzLmVsZW1lbnQuZGF0YSgnY29udHJvbGxlcicpICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sID0gdGhpcy5lbGVtZW50LmRhdGEoJ2NvbnRyb2xsZXInKS5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSB0aGlzLmdldENvbnRyb2xsZXIodGhpcy5jb250cm9sKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcdGlmICh0aGlzLnJlcXVlc3RLZXkpIHtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdHZhciBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuXHRcdFx0XHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuXHRcdFx0XHRcdFx0Ly8g0LXRgdC70Lgg0LzRiyDQsiDQv9C10YDQtdGH0LjRgdC70LXQvdC90YvRhSDRgNCw0LfQtNC10LvQsNGFLCDRgtC+INC/0L7Qu9GD0YfQsNC10Lwg0YHRgdGB0YvQu9C60YMg0L3QsCDQtNC10YLQsNC70YzQvdGL0Lkg0L/RgNC+0YHQvNC+0YLRgFxyXG5cdFx0XHRcdFx0XHRpZihbJy9jb21wYW55L2Jsb2cvJywgJy9jbGllbnQvY2x1Yi8nXS5pbmRleE9mKHBhdGhuYW1lKSA+IC0xKXtcclxuXHRcdFx0XHRcdFx0XHRkYXRhID0geyB1cmw6IHRoaXMuZWxlbWVudC5wcmV2KCkuYXR0cignaHJlZicpIH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQkLmdldCh0aGlzLmdhdGV3YXksIGRhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0c2VsZi5lbGVtZW50LnJlbW92ZURhdGEoKS51bmJpbmQoKTtcclxuXHRcdFx0XHRcdFx0XHRzZWxmLmVsZW1lbnQucmVwbGFjZVdpdGgoZGF0YSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmKE9iamVjdC5rZXlzKHNlbGYuY29udHJvbGxlcnMpLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGZvcihzZWxlY3RvciBpbiBzZWxmLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5hcHBsaWNhdGlvbi5pbnN0YWxsQ29udHJvbGxlcihzZWxlY3Rvciwgc2VsZi5jb250cm9sbGVyc1tzZWxlY3Rvcl0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcbiAgICAgICAgICAgICAgaWYod2luZG93LmxvY2F0aW9uLmhhc2ggIT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGlmKCQoJy5qcy1sYXp5bG9hZCcpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBhVGFnID0gJCh3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZiAoYVRhZy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IGFUYWcub2Zmc2V0KCkudG9wIC0gNjBcclxuICAgICAgICAgICAgICAgICAgICB9LCA3NTApO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcignRVJST1I6IExhenlMb2FkINC90LUg0L7RgtCy0YfQsNC10YIg0L/QviDQv9GD0YLQuCAnICsgdGhpcy5nYXRld2F5KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRpbnNlcnRDb250ZW50OiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCB4aHIpIHtcclxuXHRcdFx0XHQvLyB0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQucmVtb3ZlRGF0YSgpLnVuYmluZCgpO1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5yZXBsYWNlV2l0aChkYXRhKTtcclxuXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRwcmVwYXJlVXJpOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdHZhciBnYXRld2F5ID0gbmV3IFVSSSgpO1xyXG5cclxuXHRcdFx0XHRnYXRld2F5LnNldFNlYXJjaCgnTEFaWScsICdZJykuc2V0U2VhcmNoKCdLRVknLCB0aGlzLnJlcXVlc3RLZXkpLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0cmV0dXJuIGdhdGV3YXk7XHJcblxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Ly8g0JzQtdGC0L7QtCDQtNC70Y8g0YHQstGP0LfQutC4INGB0LXQu9C10LrRgtC+0YDQsCDQuCDQutC+0L3RgtGA0L7Qu9C70LXRgNCwXHJcblx0XHRcdGdldENvbnRyb2xsZXI6IGZ1bmN0aW9uIChjb250cm9sbGVycykge1xyXG5cclxuXHRcdFx0XHR2YXIgYXJDb250cm9sbGVycyA9IHtcclxuXHRcdFx0XHRcdFwiYXBwV2lkZ2V0VGFic1wiOiBcIiNjb21wYW55LXRlYW0gLmpzLXRhYnNcIixcclxuICAgICAgICAgICAgICAgXHRcdCdhcHBXaWRnZXRTaG93SW5mbyc6ICcjY29tcGFueS10ZWFtIC5qcy1zaG93LWluZm8nLFxyXG5cdFx0XHRcdFx0XCJhcHBXaWRnZXRDb250ZW50U2xpZGVyXCIgOiAnLm93bC1jYXJvdXNlbC5qcy1jb250ZW50LXNsaWRlcicsXHJcbiAgICAgICAgICAnYXBwV2lkZ2V0Rm9ybUdldCcgOiAnI3p2ZXJza2llIC5qcy1nZXQtZm9ybScsXHJcbiAgICAgICAgICAnYXBwV2lkZ2V0RXZlbnRQdXNoJyA6ICcjenZlcnNraWUgLmpzLXB1c2gtZXZlbnQnXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xyXG5cclxuXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY29udHJvbGxlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdHJlc3VsdFthckNvbnRyb2xsZXJzW2NvbnRyb2xsZXJzW2ldXV0gPSBjb250cm9sbGVyc1tpXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7XHJcbiIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMuTG9uZ1RhYmxlID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0TG9uZ1RhYmxlJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy50YWJsZSA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtbG9uZy10YWJsZV9fdGFibGUnKTtcclxuXHRcdFx0XHR0aGlzLm9wZW5CdG5Db250YWluZXIgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWxvbmctdGFibGVfX29wZW4tYnRuLXdyYXAnKTtcclxuXHRcdFx0XHR0aGlzLm9wZW5CdG4gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWxvbmctdGFibGVfX29wZW4tYnRuJyk7XHJcblx0XHRcdFx0dGhpcy50YWJsZUNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtbG9uZy10YWJsZV9fY29udGFpbmVyJyk7XHJcblx0XHRcdFx0dGhpcy50YWJsZUhlaWdodCA9IDE5NTA7XHJcblxyXG5cdFx0XHRcdHRoaXMub24odGhpcy5vcGVuQnRuLCAnY2xpY2snLCAnb3BlblRhYmxlJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRvcGVuVGFibGU6IGZ1bmN0aW9uKGVsLCBldikge1xyXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdFx0aWYodGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdqcy1sb25nLXRhYmxlLS1hY2NvdW50aW5nJykpIHtcclxuXHJcblx0XHRcdFx0XHR0aGlzLnRhYmxlSGVpZ2h0ID0gdGhpcy50YWJsZS5vdXRlckhlaWdodCgpO1xyXG5cclxuXHRcdFx0XHRcdHRoaXMudGFibGVDb250YWluZXIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRcdGhlaWdodDogdGhpcy50YWJsZUhlaWdodFxyXG5cdFx0XHRcdFx0fSwgNTAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5vcGVuQnRuQ29udGFpbmVyLmZhZGVPdXQoMzAwKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ2pzLWxvbmctdGFibGUtLWluc3VyYW5jZS1mdW5kcycpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYmxlSGVpZ2h0ID0gdGhpcy50YWJsZS5vdXRlckhlaWdodCgpKzEyNztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFibGVDb250YWluZXIuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMudGFibGVIZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub3BlbkJ0bkNvbnRhaW5lci5mYWRlT3V0KDMwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdqcy1sb25nLXRhYmxlLS1lbXBsb3llZXMtdGF4JykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYmxlSGVpZ2h0ID0gdGhpcy50YWJsZS5vdXRlckhlaWdodCgpKzE2MjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYmxlQ29udGFpbmVyLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy50YWJsZUhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9wZW5CdG5Db250YWluZXIuZmFkZU91dCgzMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFibGVDb250YWluZXIuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnRhYmxlSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9wZW5CdG5Db250YWluZXIuZmFkZU91dCgzMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudGFibGUuc3RpY2t5VGFibGVIZWFkZXJzKHtmaXhlZE9mZnNldDogNDZ9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICBBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuICBBcHAuV2lkZ2V0cy5XaWRnZXRzLk1hcCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuICAgIHtcclxuICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldE1hcCcsXHJcbiAgICAgIGRlZmF1bHRzOiB7fVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHltYXBzLnJlYWR5KHRoaXMuaW5pdE1hcCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBpbml0TWFwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1hcENlbnRlck1vc2NvdyA9IFs1NS43MTgzMjQwNjg5OTk2NjQsMzcuNzkxOTg5NDk5OTk5OThdO1xyXG4gICAgICAgIHZhciBtYXBDZW50ZXJTa29sa292byA9IFs1NS42OTIwODk1NjkwMjE2NCwzNy4zNDc2MTk1MDAwMDAwMV07XHJcblxyXG4gICAgICAgIHZhciBtYXBDb250cm9sID0ge1xyXG4gICAgICAgICAgYmFsbG9vblNoYWRvdzogZmFsc2UsXHJcbiAgICAgICAgICBpY29uTGF5b3V0OiAnZGVmYXVsdCNpbWFnZScsXHJcbiAgICAgICAgICBpY29uSW1hZ2VIcmVmOiAnL2xvY2FsL3RlbXBsYXRlcy9tYWluL2J1aWxkL2ltYWdlcy93YS1tYXAtbWFyay5wbmcnLFxyXG4gICAgICAgICAgaWNvbkltYWdlU2l6ZTogWzQ5LCA0NV0sXHJcbiAgICAgICAgICB6SW5kZXg6IDk4XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYoJCgnI21vc2Nvd01hcCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgdmFyIHdhTWFwTW9zY293ID0gbmV3IHltYXBzLk1hcChcIm1vc2Nvd01hcFwiLCB7XHJcbiAgICAgICAgICAgIGNlbnRlcjogbWFwQ2VudGVyTW9zY293LFxyXG4gICAgICAgICAgICB6b29tOiAxNixcclxuICAgICAgICAgICAgY29udHJvbHM6IFsnem9vbUNvbnRyb2wnXVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgd2FNYXBNb3Njb3cuYmVoYXZpb3JzLmRpc2FibGUoJ2RyYWcnKTtcclxuXHJcbiAgICAgICAgICB2YXIgd2FQbGFjZW1hcmtNb3Njb3cgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKG1hcENlbnRlck1vc2Nvdywge30sIG1hcENvbnRyb2wpO1xyXG5cclxuICAgICAgICAgIHdhTWFwTW9zY293Lmdlb09iamVjdHMuYWRkKHdhUGxhY2VtYXJrTW9zY293KTtcclxuXHJcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHdhTWFwTW9zY293LnNldENlbnRlcihtYXBDZW50ZXJNb3Njb3cpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgJCgnLmpzLW1hcC1hZGRyZXNzJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHdhTWFwTW9zY293LnBhblRvKG1hcENlbnRlck1vc2Nvdyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCQoJyNza29sa292by1tYXAnKS5sZW5ndGgpIHtcclxuICAgICAgICAgIHZhciB3YU1hcFNrb2xrb3ZvID0gbmV3IHltYXBzLk1hcChcInNrb2xrb3ZvLW1hcFwiLCB7XHJcbiAgICAgICAgICAgIGNlbnRlcjogbWFwQ2VudGVyU2tvbGtvdm8sXHJcbiAgICAgICAgICAgIHpvb206IDE2LFxyXG4gICAgICAgICAgICBjb250cm9sczogWyd6b29tQ29udHJvbCddXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB3YU1hcFNrb2xrb3ZvLmJlaGF2aW9ycy5kaXNhYmxlKCdkcmFnJyk7XHJcblxyXG4gICAgICAgICAgdmFyIHdhUGxhY2VtYXJrU2tvbGtvdm8gPSBuZXcgeW1hcHMuUGxhY2VtYXJrKG1hcENlbnRlclNrb2xrb3ZvLCB7fSwgbWFwQ29udHJvbCk7XHJcblxyXG4gICAgICAgICAgd2FNYXBTa29sa292by5nZW9PYmplY3RzLmFkZCh3YVBsYWNlbWFya1Nrb2xrb3ZvKTtcclxuXHJcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHdhTWFwU2tvbGtvdm8uc2V0Q2VudGVyKG1hcENlbnRlclNrb2xrb3ZvKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICQoJy5qcy1tYXAtYWRkcmVzcy1za29sa292bycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB3YU1hcFNrb2xrb3ZvLnBhblRvKG1hcENlbnRlclNrb2xrb3ZvKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMuTmV3c0FyY2hpdmUgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0TmV3c0FyY2hpdmUnLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge31cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJJdGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1uZXdzLWZpbHRlci1pdGVtJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdzRmllbGQgPSAkKCcuanMtbmV3cy1maWVsZCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdzRmllbGRVbCA9ICQoJy5qcy1uZXdzLWZpZWxkID4gdWwnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3c0ZpZWxkUGFnZXIgPSAkKCcuanMtbmV3cy1maWVsZCA+IC5wYWdpbmF0aW9uLS1uZXdzJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZmlsdGVySXRlbSwgJ2NsaWNrJywgJ2ZpbHRlckFyY2hpdmVPbkNsaWNrJyk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgJ2ZpbHRlckFyY2hpdmVPbkNsaWNrJzogZnVuY3Rpb24oZWwsIGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWwuaGFzQ2xhc3MoJ2N1cnJlbnQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLmZpbmQoJy5jdXJyZW50LWNsb3NlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLnByZXBlbmQoJzxzcGFuIGNsYXNzPVwiY3VycmVudC1jbG9zZVwiPmNsb3NlPC9zcGFuPicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWwudG9nZ2xlQ2xhc3MoJ2N1cnJlbnQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU5ld3MoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICd1cGRhdGVOZXdzJzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaT0wLCBhRGF0ZT1bXSwgbz10aGlzO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcuanMtbmV3cy1maWx0ZXItaXRlbS5jdXJyZW50JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYURhdGVbaV0gPSAkKHRoaXMpLmRhdGEoJ21vbnRoJykrXCItXCIrJCh0aGlzKS5kYXRhKCd5ZWFyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkLmdldChcIlwiLHsnREFURVtdJzphRGF0ZX1cclxuICAgICAgICAgICAgICAgICkuZG9uZShmdW5jdGlvbihyZXN1bHQpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBvLm5ld3NGaWVsZC5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG8ubmV3c0ZpZWxkLmFwcGVuZChyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VSUk9SIEFERElORyBORVdTJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgQXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcbiAgQXBwLldpZGdldHMuV2lkZ2V0cy5PZmZDYW52YXNNb2JpbGUgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICB7XHJcbiAgICAgIHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRPZmZDYW52YXNNb2JpbGUnLFxyXG4gICAgICBkZWZhdWx0czoge31cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHRoaXMudHJpZ2dlciA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtb2ZmLWNhbnZhcy1tb2JpbGUtdHJpZ2dlcicpO1xyXG4gICAgICAgICAgdGhpcy5tZW51ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1vZmYtY2FudmFzLW1vYmlsZS1tZW51Jyk7XHJcbiAgICAgICAgICB0aGlzLm92ZXJsYXkgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLW9mZi1jYW52YXMtbW9iaWxlLW92ZXJsYXknKTtcclxuXHJcbiAgICAgICAgICB0aGlzLm9uKHRoaXMudHJpZ2dlciwgJ2NsaWNrJywgJ3Nob3dPZmZDYW52YXNNb2JpbGUnKTtcclxuICAgICAgICAgIHRoaXMub24odGhpcy5vdmVybGF5LCAnY2xpY2snLCAnaGlkZU9mZkNhbnZhc01vYmlsZScpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgJ3Nob3dPZmZDYW52YXNNb2JpbGUnOiBmdW5jdGlvbihlbCwgZXYpIHtcclxuICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ29mZi1jYW52YXMtb3ZlcmZsb3cnKTtcclxuICAgICAgICB0aGlzLm1lbnUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIHRoaXMub3ZlcmxheS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAnaGlkZU9mZkNhbnZhc01vYmlsZSc6IGZ1bmN0aW9uKGVsLCBldikge1xyXG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb2ZmLWNhbnZhcy1vdmVyZmxvdycpO1xyXG4gICAgICAgIHRoaXMubWVudS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgdGhpcy5vdmVybGF5LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBBcHAuV2lkZ2V0cy5QcmludCA9IEFwcC5XaWRnZXRzLlByaW50IHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuUHJpbnQuUHJpbnQgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0UHJpbnQnLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge31cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyAuanMtcHJpbnQgLSDQvtC/0YDQtdC00LXQu9C10L3QuNC1INC80L7QtNGD0LvRjyDQtNC70Y8g0L/QtdGH0LDRgtC4XHJcbiAgICAgICAgICAgIC8vIC5qcy1wcmludC1idG4gLSDQutC90L7Qv9C60LAg0L/QtdGH0LDRgtC4XHJcbiAgICAgICAgICAgIC8vIGRhdGEtcHJpbnQ9XCJwcmludEVsZW1lbnRcIiAtIGRhdGEt0LDRgtGA0LjQsdGD0YIg0LTQu9GPINC30LDQtNCw0L3QuNGPINGN0LvQtdC80LXQvdGC0LAsINC60L7RgtC+0YDRi9C5INC90YPQttC90L4g0YDQsNGB0L/QtdGH0LDRgtCw0YLRjCAoLmpzLWNsYXNzKVxyXG4gICAgICAgICAgICAvLyAubm8tcHJpbnQgLSDQutC70LDRgdGBINC00LvRjyDRgdC60YDRi9GC0LjRjyDRjdC70LXQvNC10L3RgtCwINC/0YDQuCDQv9C10YfQsNGC0LhcclxuICAgICAgICAgICAgLy8gZGF0YS1wcmludGxvZ289XCJ0cnVlXCIg0LTQu9GPINC/0LXRh9Cw0YLQuCDQu9C+0LPQvtGC0LjQv9CwINC60L7QvNC/0LDQvdC40Lgg0LIg0LfQsNCz0L7Qu9C+0LLQutC1XHJcbiAgICAgICAgICAgICcuanMtcHJpbnQtYnRuIGNsaWNrJzogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcHJpbnROb2RlQ2xhc3NOYW1lID0gJy4nICsgZWwuZGF0YSgncHJpbnQnKTtcclxuICAgICAgICAgICAgICAgIHZhciAkcHJpbnRFbGVtZW50Q2xvbmUgPSAkKHByaW50Tm9kZUNsYXNzTmFtZSkuY2xvbmUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAkcHJpbnRFbGVtZW50Q2xvbmUuZmluZCgnLmNvbnRlbnQtYmFubmVyJykuYWRkQ2xhc3MoJ25vLXByaW50Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVsLmRhdGEoJ3ByaW50bG9nbycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHByaW50RWxlbWVudENsb25lLnByZXBlbmQoJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+PGltZyBzcmM9XCIvbG9jYWwvdGVtcGxhdGVzL21haW4vYnVpbGQvaW1hZ2VzL2xvZ28ucG5nXCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJHByaW50RWxlbWVudENsb25lLnByaW50VGhpcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlU2NyaXB0czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBwcmludERlbGF5OiA0NTBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuV2lkZ2V0cy5RdWl6RXZlbnRzID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldFF1aXpFdmVudHMnLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge31cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJtaXRCdG4gPSB0aGlzLmVsZW1lbnQuZmluZCgnLnF1ZXN0aW9uX19sYWJlbCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ndG1DYXRlZ29yeSA9IHRoaXMuZWxlbWVudC5kYXRhKCdndG1jYXRlZ29yeScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLnN1Ym1pdEJ0biwgJ2NsaWNrJywgJ3N1Ym1pdEJ0bk9uQ2xpY2snKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZCA9IFtdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWJtaXRCdG5PbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VuZC5pbmRleE9mKGUuZmluZCgnW2RhdGEtY2hlY2stcXVlc3Rpb25dJykuZGF0YSgncHVzaCcpKSAhPSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoRXZlbnQoZSwgdGhpcy5ndG1DYXRlZ29yeSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHB1c2hFdmVudDogZnVuY3Rpb24gKGVsZW1lbnQsIGd0bUNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmQucHVzaChlbGVtZW50LmZpbmQoJ1tkYXRhLWNoZWNrLXF1ZXN0aW9uXScpLmRhdGEoJ3B1c2gnKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhndG1DYXRlZ29yeSArICdfQ2hvb3NlZF8nICsgZWxlbWVudC5maW5kKCdbZGF0YS1jaGVjay1xdWVzdGlvbl0nKS5kYXRhKCdwdXNoJykpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnQgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudChndG1DYXRlZ29yeSArICdfQ2hvb3NlZF8nICsgZWxlbWVudC5maW5kKCdbZGF0YS1jaGVjay1xdWVzdGlvbl0nKS5kYXRhKCdwdXNoJyksIGd0bUNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn0oalF1ZXJ5KSk7XHJcblxyXG5cclxuIiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5TY3JvbGxUbyA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldFNjcm9sbFRvJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5vbih0aGlzLmVsZW1lbnQsICdjbGljaycsICdzY3JvbGxUbycpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0J3Njcm9sbFRvJzogZnVuY3Rpb24oZWwsIGV2KSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0dGhpcy50YXJnZXRJZCA9IGVsLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSk7XHJcblx0XHRcdFx0dGhpcy50YXJnZXRPYmplY3QgPSAkKCcjJyArIHRoaXMudGFyZ2V0SWQpO1xyXG5cclxuXHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcblx0XHQgICAgICAgICAgICBzY3JvbGxUb3A6IHRoaXMudGFyZ2V0T2JqZWN0Lm9mZnNldCgpLnRvcCAtIDYwXHJcblx0XHQgICAgICAgIH0sIDE1MDApO1xyXG5cclxuXHRcdCAgICAgICAgaWYodGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdqcy1zY3JvbGwtdG8tLXNlY3JldC1pbmZvLXRhYicpKSB7XHJcblx0XHQgICAgICAgIFx0JCgnLmpzLXRhYnNfX3RhYltkYXRhLWlkPXNlY3JldC1pbmZvXScpLmNsaWNrKCk7XHJcblx0XHQgICAgICAgIH0gZWxzZSBpZih0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ2pzLXNjcm9sbC10by0tY29tcGFueS1jaGllZi1hY2NvdW50YW50cy10YWInKSkge1xyXG5cdFx0ICAgICAgICBcdCQoJy5qcy10YWJzX190YWJbZGF0YS1pZD1jb21wYW55LWNoaWVmLWFjY291bnRhbnRzXScpLmNsaWNrKCk7XHJcblx0XHQgICAgICAgIH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5TaG93SW5mbyA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldFNob3dJbmZvJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCAgICB0aGlzLmJ0biA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtc2hvdy1pbmZvX19idG4nKTtcclxuXHRcdFx0ICAgIHRoaXMuaGlkZGVuSW5mbyA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtc2hvdy1pbmZvX19pbmZvJyk7XHJcblxyXG5cdFx0XHQgICAgdGhpcy5vbih0aGlzLmJ0biwgJ2NsaWNrJywgJ3Nob3dIaWRkZW5JbmZvJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzY3JvbGxUbzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHNjcm9sbFRvcDogJCgnW2RhdGEtdGFyZ2V0PScgKyBzZWxmLmRhdGFUYXJnZXQgKyAnXScpLm9mZnNldCgpLnRvcCAtIDYwXHJcblx0XHRcdFx0fSwgMTUwMCk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnc2hvd0hpZGRlbkluZm8nOiBmdW5jdGlvbihlbCwgZXYpIHtcclxuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHR2YXIgbmVlZFNjcm9sbCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRpZighZWwuaGFzQ2xhc3MoJ29wZW4nKSAmJiBlbC5kYXRhKCdzY3JvbGwtdG8nKSlcclxuXHRcdFx0XHRcdG5lZWRTY3JvbGwgPSB0cnVlO1xyXG5cclxuXHJcblx0XHRcdFx0ZWwudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRlbC5uZXh0KHRoaXMuaGlkZGVuSW5mbykuc2xpZGVUb2dnbGUoKTtcclxuXHJcblx0XHRcdFx0aWYodGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdqcy1zaG93LWluZm8tLW5vLWFuaW1hdGlvbicpKSB7XHJcblx0XHRcdFx0XHRlbC5uZXh0KHRoaXMuaGlkZGVuSW5mbykudG9nZ2xlKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyDQldGB0LvQuCDRgdC60YDRi9GC0YPRjiDQuNC90YTQvtGA0LzQsNGG0LjRjiDQuCDQutC90L7Qv9C60YMt0YLRgNC40LPQs9C10YAg0L3QtdCy0L7Qt9C80L7QttC90L4g0YDQsNC30LzQtdGB0YLQuNGC0Ywg0LIg0L7QsdGJ0LXQvCDQutC+0L3RgtC10LnQvdC10YDQtVxyXG5cdFx0XHRcdC8vINCY0LvQuCDRgdC60YDRi9GC0LDRjyDQuNC90YTQvtGA0LzQsNGG0LjRjyDRgNCw0YHQv9C+0LvQvtC20LXQvdCwINC90LUg0L/QvtGB0LvQtSDQutC90L7Qv9C60Lgt0YLRgNC40LPQs9C10YDQsFxyXG5cdFx0XHRcdGlmKHRoaXMuZWxlbWVudC5maWx0ZXIoJ1tkYXRhLWF0dHJpYnV0ZV0nKSAmJiAhdGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdqcy1zaG93LWluZm8tLW5vLWFuaW1hdGlvbicpKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRhdGFUYXJnZXQgPSBlbC5hdHRyKCdkYXRhLWF0dHJpYnV0ZScpO1xyXG5cdFx0XHRcdFx0JCgnW2RhdGEtdGFyZ2V0PScgKyB0aGlzLmRhdGFUYXJnZXQgKyAnXScpLnNsaWRlVG9nZ2xlKCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKHRoaXMuZWxlbWVudC5maWx0ZXIoJ1tkYXRhLWF0dHJpYnV0ZV0nKSAmJiB0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ2pzLXNob3ctaW5mby0tbm8tYW5pbWF0aW9uJykpIHtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YVRhcmdldCA9IGVsLmF0dHIoJ2RhdGEtYXR0cmlidXRlJyk7XHJcblx0XHRcdFx0XHQkKCdbZGF0YS10YXJnZXQ9JyArIHRoaXMuZGF0YVRhcmdldCArICddJykudG9nZ2xlKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZihuZWVkU2Nyb2xsKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNjcm9sbFRvKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLlNob3dNb3JlID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0U2hvd01vcmUnLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLml0ZW1zID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1zaG93LW1vcmVfX2l0ZW0nKTtcclxuXHRcdFx0XHR0aGlzLnNob3dNb3JlQnRuID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1zaG93LW1vcmVfX2J0bicpO1xyXG5cclxuXHRcdFx0XHR0aGlzLml0ZW1zLnNsaWNlKDAsIDMpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG5cdFx0XHQgICAgdGhpcy5vbih0aGlzLnNob3dNb3JlQnRuLCAnY2xpY2snLCAnc2hvd01vcmVPbkNsaWNrJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnc2hvd01vcmVPbkNsaWNrJzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRkZW5JdGVtcyA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtc2hvdy1tb3JlX19pdGVtLmhpZGUnKTtcclxuXHRcdFx0XHR0aGlzLmhpZGRlbkl0ZW1zLnNsaWNlKDAsIDMpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpO1xyXG5cclxuXHJcbiIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMuU2hvd1NlYXJjaEZvcm0gPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRTaG93U2VhcmNoRm9ybScsXHJcblx0XHRcdGRlZmF1bHRzOiB7fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZGVuT25DbGljayA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtc2hvdy1zZWFyY2gtZm9ybV9faGlkZGVuJyk7XHJcblx0XHRcdFx0dGhpcy5zaG93bk9uQ2xpY2sgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXNob3ctc2VhcmNoLWZvcm1fX3Nob3duJyk7XHJcblx0XHRcdFx0dGhpcy5zaG93Rm9ybUJ0biA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtc2hvdy1zZWFyY2gtZm9ybV9fYnRuJyk7XHJcblxyXG5cdFx0XHQgICAgdGhpcy5vbih0aGlzLnNob3dGb3JtQnRuLCAnY2xpY2snLCAnc2hvd0Zvcm1PbkNsaWNrJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnc2hvd0Zvcm1PbkNsaWNrJzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5oaWRkZW5PbkNsaWNrLmFkZENsYXNzKCdub25lJyk7XHJcblx0XHRcdFx0dGhpcy5zaG93bk9uQ2xpY2sucmVtb3ZlQ2xhc3MoJ25vbmUnKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdCdoaWRlRm9ybU9uQ2xpY2snOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGRlbk9uQ2xpY2sucmVtb3ZlQ2xhc3MoJ25vbmUnKTtcclxuXHRcdFx0XHR0aGlzLnNob3duT25DbGljay5hZGRDbGFzcygnbm9uZScpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0J3tkb2N1bWVudH0ga2V5dXAnOiBmdW5jdGlvbihlbCwgZXYpIHtcclxuXHRcdFx0XHRpZiAoZXYua2V5Q29kZSA9PSAyNykge1xyXG5cdFx0XHRcdCAgXHR0aGlzLmhpZGVGb3JtT25DbGljaygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdCd7ZG9jdW1lbnR9IGNsaWNrJzogZnVuY3Rpb24oZWwsIGV2KSB7XHJcblx0XHRcdFx0aWYoIXRoaXMuc2hvd25PbkNsaWNrLmhhc0NsYXNzKCdub25lJykpIHtcclxuXHRcdFx0XHRcdGlmKCQoZXYudGFyZ2V0KS5jbG9zZXN0KCcuanMtc2hvdy1zZWFyY2gtZm9ybV9fc2hvd24nKS5sZW5ndGggfHwgJChldi50YXJnZXQpLmhhc0NsYXNzKCdqcy1zaG93LXNlYXJjaC1mb3JtX19idG4nKSlcclxuICAgICAgICBcdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdFx0ICAgIHRoaXMuaGlkZUZvcm1PbkNsaWNrKCk7XHJcblx0XHRcdFx0ICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7XHJcblxyXG5cclxuIiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMuUGFnaW5hdGlvblBvcnRmb2xpbyA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsdWdpbk5hbWU6ICdhcHBQYWdpbmF0aW9uUG9ydGZvbGlvJyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHt9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9ydGZvbGlvRmllbGQgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXBvcnRmb2xpby1pdGVtJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb25CbG9jayA9ICQoJy5qcy1wYWdpbmF0aW9uLS1wb3J0Zm9saW8nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkN1cnJlbnRJdGVtID0gJCgnLmpzLXBhZ2luYXRpb24tLXBvcnRmb2xpbyA+IGRpdi5wYWdpbmF0aW9uX19pdGVtJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVQYWdpbmF0b3IoKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAncHJlcGFyZVBhZ2luYXRvcic6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uSXRlbSA9ICQoJy5qcy1wYWdpbmF0aW9uLS1wb3J0Zm9saW8gYS5wYWdpbmF0aW9uX19pdGVtJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMucGFnaW5hdGlvbkl0ZW0sICdjbGljaycsICdwYWdpbmF0ZVBvcnRmb2xpbycpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgJ3BhZ2luYXRlUG9ydGZvbGlvJzogZnVuY3Rpb24gKGVsLCBlbSkge1xyXG4gICAgICAgICAgICAgICAgZW0ucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSXRlbShlbC5hdHRyKCdocmVmJykpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgJ3VwZGF0ZUl0ZW0nOiBmdW5jdGlvbiAoc3JjKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3RhcnRXYWl0aW5nKCk7XHJcbiAgICAgICAgICAgICAgICAkLmdldChzcmMsIHRoaXMucHJveHkoJ3Nob3dSZXN1bHQnKSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAnc2hvd1Jlc3VsdCc6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcnRmb2xpb0ZpZWxkLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcnRmb2xpb0ZpZWxkLmFwcGVuZChkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbkl0ZW0ub2ZmKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVQYWdpbmF0b3IoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5lbmRXYWl0aW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG4gIEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG4gIEFwcC5XaWRnZXRzLldpZGdldHMuSW1hZ2Vab29tID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAge1xyXG4gICAgICBwbHVnaW5OYW1lOiAnYXBwSW1hZ2Vab29tJyxcclxuICAgICAgZGVmYXVsdHM6IHt9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHpvb21JbWFnZXMgPSB7XHJcbiAgICAgICAgICBzdGVwMSA6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGltZyA6ICcvbG9jYWwvdGVtcGxhdGVzL21haW4vaW1hZ2VzL2luc3RydWtjaWFfYWxmYV9iYW5rL3N0ZXAxXzEucG5nJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgaW1nIDogJy9sb2NhbC90ZW1wbGF0ZXMvbWFpbi9pbWFnZXMvaW5zdHJ1a2NpYV9hbGZhX2Jhbmsvc3RlcDFfMi5wbmcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBzdGVwMiA6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGltZyA6ICcvbG9jYWwvdGVtcGxhdGVzL21haW4vaW1hZ2VzL2luc3RydWtjaWFfYWxmYV9iYW5rL3N0ZXAyXzEucG5nJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgaW1nIDogJy9sb2NhbC90ZW1wbGF0ZXMvbWFpbi9pbWFnZXMvaW5zdHJ1a2NpYV9hbGZhX2Jhbmsvc3RlcDJfMi5wbmcnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICBpbWcgOiAnL2xvY2FsL3RlbXBsYXRlcy9tYWluL2ltYWdlcy9pbnN0cnVrY2lhX2FsZmFfYmFuay9zdGVwMl8zLnBuZydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIHN0ZXAzIDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaW1nIDogJy9sb2NhbC90ZW1wbGF0ZXMvbWFpbi9pbWFnZXMvaW5zdHJ1a2NpYV9hbGZhX2Jhbmsvc3RlcDNfMS5wbmcnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICBpbWcgOiAnL2xvY2FsL3RlbXBsYXRlcy9tYWluL2ltYWdlcy9pbnN0cnVrY2lhX2FsZmFfYmFuay9zdGVwM18yLnBuZydcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgIGltZyA6ICcvbG9jYWwvdGVtcGxhdGVzL21haW4vaW1hZ2VzL2luc3RydWtjaWFfYWxmYV9iYW5rL3N0ZXAzXzMucG5nJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgc3RlcDQgOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBpbWcgOiAnL2xvY2FsL3RlbXBsYXRlcy9tYWluL2ltYWdlcy9pbnN0cnVrY2lhX2FsZmFfYmFuay9zdGVwNF8xLnBuZydcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgIGltZyA6ICcvbG9jYWwvdGVtcGxhdGVzL21haW4vaW1hZ2VzL2luc3RydWtjaWFfYWxmYV9iYW5rL3N0ZXA0XzIucG5nJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgaW1nIDogJy9sb2NhbC90ZW1wbGF0ZXMvbWFpbi9pbWFnZXMvaW5zdHJ1a2NpYV9hbGZhX2Jhbmsvc3RlcDRfMy5wbmcnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICBpbWcgOiAnL2xvY2FsL3RlbXBsYXRlcy9tYWluL2ltYWdlcy9pbnN0cnVrY2lhX2FsZmFfYmFuay9zdGVwNF80LnBuZydcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgIGltZyA6ICcvbG9jYWwvdGVtcGxhdGVzL21haW4vaW1hZ2VzL2luc3RydWtjaWFfYWxmYV9iYW5rL3N0ZXA0XzUucG5nJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgc3RlcDUgOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBpbWcgOiAnL2xvY2FsL3RlbXBsYXRlcy9tYWluL2ltYWdlcy9pbnN0cnVrY2lhX2FsZmFfYmFuay9zdGVwNV8xLnBuZydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciB6b29tQ3VyU3RlcCA9ICdzdGVwMScsXHJcbiAgICAgICAgICB6b29tV3JhcHBlciA9ICQoJyNpbWFnZS1nYWxsZXJ5LScgKyB6b29tQ3VyU3RlcCksXHJcbiAgICAgICAgICB6b29tVG90YWwgPSB6b29tSW1hZ2VzW3pvb21DdXJTdGVwXS5sZW5ndGgsXHJcbiAgICAgICAgICB6b29tQ3VySW1hZ2VJZHggPSAxO1xyXG5cclxuICAgICAgICAkKFwiLmZhbmN5Ym94XCIpLmZhbmN5Ym94KHtcclxuICAgICAgICAgIGFycm93czogZmFsc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrIG1vdXNlZW50ZXIgdG91Y2hzdGFydCcsICcuanMtem9vbS1zbGlkZS1zZWxlY3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlmKHpvb21DdXJJbWFnZUlkeCAhPSAkKHRoaXMpLmRhdGEoJ3NsaWRlbnVtJykpIHtcclxuICAgICAgICAgICAgem9vbUN1ckltYWdlSWR4ID0gJCh0aGlzKS5kYXRhKCdzbGlkZW51bScpO1xyXG5cclxuICAgICAgICAgICAgJCh6b29tV3JhcHBlcikuZmluZCgnLmZhbmN5Ym94JykuYXR0cignaHJlZicsIHpvb21JbWFnZXNbem9vbUN1clN0ZXBdW3pvb21DdXJJbWFnZUlkeCAtIDFdLmltZyk7XHJcbiAgICAgICAgICAgICQoem9vbVdyYXBwZXIpLmZpbmQoJy5mYW5jeWJveCBpbWcnKS5hdHRyKCdzcmMnLCB6b29tSW1hZ2VzW3pvb21DdXJTdGVwXVt6b29tQ3VySW1hZ2VJZHggLSAxXS5pbWcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcuanMtc2xpZGVyLXpvb20tbGVucycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICQodGhpcykucGFyZW50KCcuc2xpZGVyLXpvb20taW1nJykuZmluZCgnLmZhbmN5Ym94JykuY2xpY2soKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy16b29tX3RhYicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaWYoJCh0aGlzKS5kYXRhKCdzdGVwJykgIT0gJycgJiYgJCh0aGlzKS5kYXRhKCdzdGVwJykgIT0gem9vbUN1clN0ZXApIHtcclxuICAgICAgICAgICAgem9vbUN1clN0ZXAgPSAkKHRoaXMpLmRhdGEoJ3N0ZXAnKTtcclxuICAgICAgICAgICAgem9vbVdyYXBwZXIgPSAkKCcjaW1hZ2UtZ2FsbGVyeS0nICsgem9vbUN1clN0ZXApO1xyXG4gICAgICAgICAgICB6b29tVG90YWwgPSB6b29tSW1hZ2VzW3pvb21DdXJTdGVwXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHpvb21DdXJJbWFnZUlkeCA9IDE7XHJcblxyXG4gICAgICAgICAgICAkKHpvb21XcmFwcGVyKS5maW5kKCcuZmFuY3lib3gnKS5hdHRyKCdocmVmJywgem9vbUltYWdlc1t6b29tQ3VyU3RlcF1bMF0uaW1nKTtcclxuICAgICAgICAgICAgJCh6b29tV3JhcHBlcikuZmluZCgnLmZhbmN5Ym94IGltZycpLmF0dHIoJ3NyYycsIHpvb21JbWFnZXNbem9vbUN1clN0ZXBdWzBdLmltZyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG59KGpRdWVyeSkpO1xyXG5cclxuLypcclxuICAgIEltYWdlVmlld2VyIHYgMS4xLjNcclxuICAgIEF1dGhvcjogU3VkaGFuc2h1IFlhZGF2XHJcbiAgICBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNiB0byBTdWRoYW5zaHUgWWFkYXYgLSBpZ25pdGVyc3dvcmxkLmNvbSAsIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuICAgIERlbW8gb246IGh0dHA6Ly9pZ25pdGVyc3dvcmxkLmNvbS9sYWIvaW1hZ2VWaWV3ZXIuaHRtbFxyXG4qL1xyXG5cclxuLyoqKiBwaWN0dXJlIHZpZXcgcGx1Z2luICoqKiovXHJcbihmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gIC8vYW4gZW1wdHkgZnVuY3Rpb25cclxuICB2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cclxuICB2YXIgJGJvZHkgPSAkKCdib2R5JyksXHJcbiAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxyXG4gICAgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XHJcblxyXG5cclxuICAvL2NvbnN0YW50c1xyXG4gIHZhciBaT09NX0NPTlNUQU5UID0gMTU7IC8vaW5jcmVhc2Ugb3IgZGVjcmVhc2UgdmFsdWUgZm9yIHpvb20gb24gbW91c2Ugd2hlZWxcclxuICB2YXIgTU9VU0VfV0hFRUxfQ09VTlQgPSA1OyAvL0EgbW91c2UgZGVsdGEgYWZ0ZXIgd2hpY2ggaXQgc2hvdWxkIHN0b3AgcHJldmVudGluZyBkZWZhdWx0IGJlaGF2aW91ciBvZiBtb3VzZSB3aGVlbFxyXG5cclxuICAvL2Vhc2Ugb3V0IG1ldGhvZFxyXG4gIC8qXHJcbiAgICAgIHQgOiBjdXJyZW50IHRpbWUsXHJcbiAgICAgIGIgOiBpbnRpYWwgdmFsdWUsXHJcbiAgICAgIGMgOiBjaGFuZ2VkIHZhbHVlLFxyXG4gICAgICBkIDogZHVyYXRpb25cclxuICAqL1xyXG4gIGZ1bmN0aW9uIGVhc2VPdXRRdWFydCh0LCBiLCBjLCBkKSB7XHJcbiAgICB0IC89IGQ7XHJcbiAgICB0LS07XHJcbiAgICByZXR1cm4gLWMgKiAodCAqIHQgKiB0ICogdCAtIDEpICsgYjtcclxuICB9O1xyXG5cclxuXHJcbiAgLy8gaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cclxuICAvLyBodHRwOi8vbXkub3BlcmEuY29tL2Vtb2xsZXIvYmxvZy8yMDExLzEyLzIwL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtZXItYW5pbWF0aW5nXHJcblxyXG4gIC8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXJcclxuICAvLyBmaXhlcyBmcm9tIFBhdWwgSXJpc2ggYW5kIFRpbm8gWmlqZGVsXHJcblxyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xyXG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcclxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcclxuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdGltZVRvQ2FsbCk7XHJcbiAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XHJcbiAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgICB9O1xyXG5cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxyXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xyXG4gICAgICB9O1xyXG4gIH0oKSk7XHJcblxyXG4gIC8vZnVuY3Rpb24gdG8gY2hlY2sgaWYgaW1hZ2UgaXMgbG9hZGVkXHJcbiAgZnVuY3Rpb24gaW1hZ2VMb2FkZWQoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmICh0eXBlb2YgaW1nLm5hdHVyYWxXaWR0aCA9PT0gJ3VuZGVmaW5lZCcgfHwgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMCk7XHJcbiAgfVxyXG5cclxuICB2YXIgaW1hZ2VWaWV3SHRtbCA9ICc8ZGl2IGNsYXNzPVwiaXYtbG9hZGVyXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJpdi1zbmFwLXZpZXdcIj4nICsgJzxkaXYgY2xhc3M9XCJpdi1zbmFwLWltYWdlLXdyYXBcIj4nICsgJzxkaXYgY2xhc3M9XCJpdi1zbmFwLWhhbmRsZVwiPjwvZGl2PicgKyAnPC9kaXY+JyArICc8ZGl2IGNsYXNzPVwiaXYtem9vbS1zbGlkZXJcIj48ZGl2IGNsYXNzPVwiaXYtem9vbS1oYW5kbGVcIj48L2Rpdj48L2Rpdj48L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJpdi1pbWFnZS12aWV3XCIgPjxkaXYgY2xhc3M9XCJpdi1pbWFnZS13cmFwXCIgPjwvZGl2PjwvZGl2Pic7XHJcblxyXG4gIC8vYWRkIGEgZnVsbCBzY3JlZW4gdmlld1xyXG4gICQoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYoISRib2R5Lmxlbmd0aCkgJGJvZHkgPSAkKCdib2R5Jyk7XHJcbiAgICAkYm9keS5hcHBlbmQoJzxkaXYgaWQ9XCJpdi1jb250YWluZXJcIj4nICsgaW1hZ2VWaWV3SHRtbCArICc8ZGl2IGNsYXNzPVwiaXYtY2xvc2VcIj48L2Rpdj48ZGl2PicpO1xyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBTbGlkZXIoY29udGFpbmVyLCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIHRoaXMub25TdGFydCA9IG9wdGlvbnMub25TdGFydCB8fCBub29wO1xyXG4gICAgdGhpcy5vbk1vdmUgPSBvcHRpb25zLm9uTW92ZSB8fCBub29wO1xyXG4gICAgdGhpcy5vbkVuZCA9IG9wdGlvbnMub25FbmQgfHwgbm9vcDtcclxuICAgIHRoaXMuc2xpZGVySWQgPSBvcHRpb25zLnNsaWRlcklkIHx8ICdzbGlkZXInICsgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcclxuICB9XHJcblxyXG4gIFNsaWRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXHJcbiAgICAgIGV2ZW50U3VmZml4ID0gJy4nICsgdGhpcy5zbGlkZXJJZDtcclxuXHJcbiAgICAvL2Fzc2lnbiBldmVudCBvbiBzbmFwIGltYWdlIHdyYXBcclxuICAgIHRoaXMuY29udGFpbmVyLm9uKCd0b3VjaHN0YXJ0JyArIGV2ZW50U3VmZml4ICsgJyBtb3VzZWRvd24nICsgZXZlbnRTdWZmaXgsIGZ1bmN0aW9uIChlc3RhcnQpIHtcclxuICAgICAgZXN0YXJ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHZhciB0b3VjaE1vdmUgPSAoZXN0YXJ0LnR5cGUgPT0gXCJ0b3VjaHN0YXJ0XCIgPyBcInRvdWNobW92ZVwiIDogXCJtb3VzZW1vdmVcIikgKyBldmVudFN1ZmZpeCxcclxuICAgICAgICB0b3VjaEVuZCA9IChlc3RhcnQudHlwZSA9PSBcInRvdWNoc3RhcnRcIiA/IFwidG91Y2hlbmRcIiA6IFwibW91c2V1cFwiKSArIGV2ZW50U3VmZml4LFxyXG4gICAgICAgIGVPcmdpbmFsID0gZXN0YXJ0Lm9yaWdpbmFsRXZlbnQsXHJcbiAgICAgICAgc3ggPSBlT3JnaW5hbC5jbGllbnRYIHx8IGVPcmdpbmFsLnRvdWNoZXNbMF0uY2xpZW50WCxcclxuICAgICAgICBzeSA9IGVPcmdpbmFsLmNsaWVudFkgfHwgZU9yZ2luYWwudG91Y2hlc1swXS5jbGllbnRZO1xyXG5cclxuICAgICAgdmFyIHN0YXJ0ID0gc2VsZi5vblN0YXJ0KGVzdGFydCwge1xyXG4gICAgICAgIHg6IHN4LFxyXG4gICAgICAgIHk6IHN5XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKHN0YXJ0ID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgdmFyIG1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbW92ZSkge1xyXG4gICAgICAgIGVtb3ZlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGVPcmdpbmFsID0gZW1vdmUub3JpZ2luYWxFdmVudDtcclxuXHJcbiAgICAgICAgLy9nZXQgdGhlIGNvcmRpbmF0ZXNcclxuICAgICAgICB2YXIgbXggPSBlT3JnaW5hbC5jbGllbnRYIHx8IGVPcmdpbmFsLnRvdWNoZXNbMF0uY2xpZW50WCxcclxuICAgICAgICAgIG15ID0gZU9yZ2luYWwuY2xpZW50WSB8fCBlT3JnaW5hbC50b3VjaGVzWzBdLmNsaWVudFk7XHJcblxyXG4gICAgICAgIHNlbGYub25Nb3ZlKGVtb3ZlLCB7XHJcbiAgICAgICAgICBkeDogbXggLSBzeCxcclxuICAgICAgICAgIGR5OiBteSAtIHN5LFxyXG4gICAgICAgICAgbXg6IG14LFxyXG4gICAgICAgICAgbXk6IG15XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIGVuZExpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRkb2N1bWVudC5vZmYodG91Y2hNb3ZlLCBtb3ZlTGlzdGVuZXIpO1xyXG4gICAgICAgICRkb2N1bWVudC5vZmYodG91Y2hFbmQsIGVuZExpc3RlbmVyKTtcclxuICAgICAgICBzZWxmLm9uRW5kKCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkZG9jdW1lbnQub24odG91Y2hNb3ZlLCBtb3ZlTGlzdGVuZXIpO1xyXG4gICAgICAkZG9jdW1lbnQub24odG91Y2hFbmQsIGVuZExpc3RlbmVyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIEltYWdlVmlld2VyKGNvbnRhaW5lciwgb3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGlmIChjb250YWluZXIuaXMoJyNpdi1jb250YWluZXInKSkge1xyXG4gICAgICBzZWxmLl9mdWxsUGFnZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICBvcHRpb25zID0gc2VsZi5vcHRpb25zID0gJC5leHRlbmQoe30sIEltYWdlVmlld2VyLmRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICBzZWxmLnpvb21WYWx1ZSA9IDEwMDtcclxuXHJcbiAgICBpZiAoIWNvbnRhaW5lci5maW5kKCcuc25hcC12aWV3JykubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnRhaW5lci5wcmVwZW5kKGltYWdlVmlld0h0bWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRhaW5lci5hZGRDbGFzcygnaXYtY29udGFpbmVyJyk7XHJcblxyXG4gICAgaWYgKGNvbnRhaW5lci5jc3MoJ3Bvc2l0aW9uJykgPT0gJ3N0YXRpYycpIGNvbnRhaW5lci5jc3MoJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XHJcblxyXG4gICAgc2VsZi5zbmFwVmlldyA9IGNvbnRhaW5lci5maW5kKCcuaXYtc25hcC12aWV3Jyk7XHJcbiAgICBzZWxmLnNuYXBJbWFnZVdyYXAgPSBjb250YWluZXIuZmluZCgnLml2LXNuYXAtaW1hZ2Utd3JhcCcpO1xyXG4gICAgc2VsZi5pbWFnZVdyYXAgPSBjb250YWluZXIuZmluZCgnLml2LWltYWdlLXdyYXAnKTtcclxuICAgIHNlbGYuc25hcEhhbmRsZSA9IGNvbnRhaW5lci5maW5kKCcuaXYtc25hcC1oYW5kbGUnKTtcclxuICAgIHNlbGYuem9vbUhhbmRsZSA9IGNvbnRhaW5lci5maW5kKCcuaXYtem9vbS1oYW5kbGUnKTtcclxuICAgIHNlbGYuX3ZpZXdlcklkID0gJ2l2JyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApO1xyXG4gIH1cclxuXHJcblxyXG4gIEltYWdlVmlld2VyLnByb3RvdHlwZSA9IHtcclxuICAgIGNvbnN0cnVjdG9yOiBJbWFnZVZpZXdlcixcclxuICAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB2aWV3ZXIgPSB0aGlzLFxyXG4gICAgICAgIG9wdGlvbnMgPSB2aWV3ZXIub3B0aW9ucyxcclxuICAgICAgICB6b29taW5nID0gZmFsc2UsIC8vIHRlbGwgd2VhdGhlciB3ZSBhcmUgem9vbWluZyB0cm91Z2ggdG91Y2hcclxuICAgICAgICBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcjtcclxuXHJcbiAgICAgIHZhciBldmVudFN1ZmZpeCA9ICcuJyArIHZpZXdlci5fdmlld2VySWQ7XHJcblxyXG4gICAgICAvL2NhY2hlIGRvbSByZWZyZW5jZVxyXG4gICAgICB2YXIgc25hcEhhbmRsZSA9IHRoaXMuc25hcEhhbmRsZTtcclxuICAgICAgdmFyIHNuYXBJbWdXcmFwID0gdGhpcy5zbmFwSW1hZ2VXcmFwO1xyXG4gICAgICB2YXIgaW1hZ2VXcmFwID0gdGhpcy5pbWFnZVdyYXA7XHJcblxyXG4gICAgICB2YXIgc25hcFNsaWRlciA9IG5ldyBTbGlkZXIoc25hcEltZ1dyYXAsIHtcclxuICAgICAgICBzbGlkZXJJZDogdmlld2VyLl92aWV3ZXJJZCxcclxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgaWYgKCF2aWV3ZXIubG9hZGVkKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgdmFyIGhhbmRsZVN0eWxlID0gc25hcEhhbmRsZVswXS5zdHlsZTtcclxuXHJcbiAgICAgICAgICB0aGlzLmN1ckhhbmRsZVRvcCA9IHBhcnNlRmxvYXQoaGFuZGxlU3R5bGUudG9wKTtcclxuICAgICAgICAgIHRoaXMuY3VySGFuZGxlTGVmdCA9IHBhcnNlRmxvYXQoaGFuZGxlU3R5bGUubGVmdCk7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZVdpZHRoID0gcGFyc2VGbG9hdChoYW5kbGVTdHlsZS53aWR0aCk7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZUhlaWdodCA9IHBhcnNlRmxvYXQoaGFuZGxlU3R5bGUuaGVpZ2h0KTtcclxuICAgICAgICAgIHRoaXMud2lkdGggPSBzbmFwSW1nV3JhcC53aWR0aCgpO1xyXG4gICAgICAgICAgdGhpcy5oZWlnaHQgPSBzbmFwSW1nV3JhcC5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAvL3N0b3AgbW9tZW50dW0gb24gaW1hZ2VcclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW1hZ2VTbGlkZXIuc2xpZGVNb21lbnR1bUNoZWNrKTtcclxuICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGltYWdlU2xpZGVyLnNsaWRlck1vbWVudHVtRnJhbWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25Nb3ZlOiBmdW5jdGlvbiAoZSwgcG9zaXRpb24pIHtcclxuICAgICAgICAgIHZhciB4UGVyYyA9IHRoaXMuY3VySGFuZGxlTGVmdCArIHBvc2l0aW9uLmR4ICogMTAwIC8gdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgeVBlcmMgPSB0aGlzLmN1ckhhbmRsZVRvcCArIHBvc2l0aW9uLmR5ICogMTAwIC8gdGhpcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgeFBlcmMgPSBNYXRoLm1heCgwLCB4UGVyYyk7XHJcbiAgICAgICAgICB4UGVyYyA9IE1hdGgubWluKDEwMCAtIHRoaXMuaGFuZGxlV2lkdGgsIHhQZXJjKTtcclxuXHJcbiAgICAgICAgICB5UGVyYyA9IE1hdGgubWF4KDAsIHlQZXJjKTtcclxuICAgICAgICAgIHlQZXJjID0gTWF0aC5taW4oMTAwIC0gdGhpcy5oYW5kbGVIZWlnaHQsIHlQZXJjKTtcclxuXHJcblxyXG4gICAgICAgICAgdmFyIGNvbnRhaW5lckRpbSA9IHZpZXdlci5jb250YWluZXJEaW0sXHJcbiAgICAgICAgICAgIGltZ1dpZHRoID0gdmlld2VyLmltYWdlRGltLncgKiAodmlld2VyLnpvb21WYWx1ZSAvIDEwMCksXHJcbiAgICAgICAgICAgIGltZ0hlaWdodCA9IHZpZXdlci5pbWFnZURpbS5oICogKHZpZXdlci56b29tVmFsdWUgLyAxMDApLFxyXG4gICAgICAgICAgICBpbWdMZWZ0ID0gaW1nV2lkdGggPCBjb250YWluZXJEaW0udyA/IChjb250YWluZXJEaW0udyAtIGltZ1dpZHRoKSAvIDIgOiAtaW1nV2lkdGggKiB4UGVyYyAvIDEwMCxcclxuICAgICAgICAgICAgaW1nVG9wID0gaW1nSGVpZ2h0IDwgY29udGFpbmVyRGltLmggPyAoY29udGFpbmVyRGltLmggLSBpbWdIZWlnaHQpIC8gMiA6IC1pbWdIZWlnaHQgKiB5UGVyYyAvIDEwMDtcclxuXHJcbiAgICAgICAgICBzbmFwSGFuZGxlLmNzcyh7XHJcbiAgICAgICAgICAgIHRvcDogeVBlcmMgKyAnJScsXHJcbiAgICAgICAgICAgIGxlZnQ6IHhQZXJjICsgJyUnXHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIHZpZXdlci5jdXJyZW50SW1nLmNzcyh7XHJcbiAgICAgICAgICAgIGxlZnQ6IGltZ0xlZnQsXHJcbiAgICAgICAgICAgIHRvcDogaW1nVG9wXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSkuaW5pdCgpO1xyXG5cclxuXHJcbiAgICAgIC8qQWRkIHNsaWRlIGludGVyYWN0aW9uIHRvIGltYWdlKi9cclxuICAgICAgdmFyIGltYWdlU2xpZGVyID0gdmlld2VyLl9pbWFnZVNsaWRlciA9IG5ldyBTbGlkZXIoaW1hZ2VXcmFwLCB7XHJcbiAgICAgICAgc2xpZGVySWQ6IHZpZXdlci5fdmlld2VySWQsXHJcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24gKGUsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICBpZiAoIXZpZXdlci5sb2FkZWQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIGlmICh6b29taW5nKSByZXR1cm47XHJcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICBzbmFwU2xpZGVyLm9uU3RhcnQoKTtcclxuICAgICAgICAgIHNlbGYuaW1nV2lkdGggPSB2aWV3ZXIuaW1hZ2VEaW0udyAqIHZpZXdlci56b29tVmFsdWUgLyAxMDA7XHJcbiAgICAgICAgICBzZWxmLmltZ0hlaWdodCA9IHZpZXdlci5pbWFnZURpbS5oICogdmlld2VyLnpvb21WYWx1ZSAvIDEwMDtcclxuXHJcbiAgICAgICAgICBzZWxmLnBvc2l0aW9ucyA9IFtwb3NpdGlvbiwgcG9zaXRpb25dO1xyXG5cclxuICAgICAgICAgIHNlbGYuc3RhcnRQb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cclxuICAgICAgICAgIC8vY2xlYXIgYWxsIGFuaW1hdGlvbiBmcmFtZSBhbmQgaW50ZXJ2YWxcclxuICAgICAgICAgIHZpZXdlci5fY2xlYXJGcmFtZXMoKTtcclxuXHJcbiAgICAgICAgICBzZWxmLnNsaWRlTW9tZW50dW1DaGVjayA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFzZWxmLmN1cnJlbnRQb3MpIHJldHVybjtcclxuICAgICAgICAgICAgc2VsZi5wb3NpdGlvbnMuc2hpZnQoKTtcclxuICAgICAgICAgICAgc2VsZi5wb3NpdGlvbnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgeDogc2VsZi5jdXJyZW50UG9zLm14LFxyXG4gICAgICAgICAgICAgIHk6IHNlbGYuY3VycmVudFBvcy5teVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25Nb3ZlOiBmdW5jdGlvbiAoZSwgcG9zaXRpb24pIHtcclxuICAgICAgICAgIGlmICh6b29taW5nKSByZXR1cm47XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSBwb3NpdGlvbjtcclxuXHJcbiAgICAgICAgICBzbmFwU2xpZGVyLm9uTW92ZShlLCB7XHJcbiAgICAgICAgICAgIGR4OiAtcG9zaXRpb24uZHggKiBzbmFwU2xpZGVyLndpZHRoIC8gdGhpcy5pbWdXaWR0aCxcclxuICAgICAgICAgICAgZHk6IC1wb3NpdGlvbi5keSAqIHNuYXBTbGlkZXIuaGVpZ2h0IC8gdGhpcy5pbWdIZWlnaHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25FbmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICh6b29taW5nKSByZXR1cm47XHJcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgdmFyIHhEaWZmID0gdGhpcy5wb3NpdGlvbnNbMV0ueCAtIHRoaXMucG9zaXRpb25zWzBdLngsXHJcbiAgICAgICAgICAgIHlEaWZmID0gdGhpcy5wb3NpdGlvbnNbMV0ueSAtIHRoaXMucG9zaXRpb25zWzBdLnk7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gbW9tZW50dW0oKSB7XHJcbiAgICAgICAgICAgIGlmIChzdGVwIDw9IDYwKSB7XHJcbiAgICAgICAgICAgICAgc2VsZi5zbGlkZXJNb21lbnR1bUZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1vbWVudHVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcG9zaXRpb25YID0gcG9zaXRpb25YICsgZWFzZU91dFF1YXJ0KHN0ZXAsIHhEaWZmIC8gMywgLXhEaWZmIC8gMywgNjApO1xyXG4gICAgICAgICAgICBwb3NpdGlvblkgPSBwb3NpdGlvblkgKyBlYXNlT3V0UXVhcnQoc3RlcCwgeURpZmYgLyAzLCAteURpZmYgLyAzLCA2MClcclxuXHJcblxyXG4gICAgICAgICAgICBzbmFwU2xpZGVyLm9uTW92ZShudWxsLCB7XHJcbiAgICAgICAgICAgICAgZHg6IC0oKHBvc2l0aW9uWCkgKiBzbmFwU2xpZGVyLndpZHRoIC8gc2VsZi5pbWdXaWR0aCksXHJcbiAgICAgICAgICAgICAgZHk6IC0oKHBvc2l0aW9uWSkgKiBzbmFwU2xpZGVyLmhlaWdodCAvIHNlbGYuaW1nSGVpZ2h0KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3RlcCsrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChNYXRoLmFicyh4RGlmZikgPiAzMCB8fCBNYXRoLmFicyh5RGlmZikgPiAzMCkge1xyXG4gICAgICAgICAgICB2YXIgc3RlcCA9IDEsXHJcbiAgICAgICAgICAgICAgcG9zaXRpb25YID0gc2VsZi5jdXJyZW50UG9zLmR4LFxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uWSA9IHNlbGYuY3VycmVudFBvcy5keTtcclxuXHJcbiAgICAgICAgICAgIG1vbWVudHVtKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS5pbml0KCk7XHJcblxyXG5cclxuICAgICAgLypBZGQgem9vbSBpbnRlcmF0aW9uIGluIG1vdXNlIHdoZWVsKi9cclxuICAgICAgdmFyIGNoYW5nZWREZWx0YSA9IDA7XHJcbiAgICAgIGltYWdlV3JhcC5vbihcIm1vdXNld2hlZWxcIiArIGV2ZW50U3VmZml4ICsgXCIgRE9NTW91c2VTY3JvbGxcIiArIGV2ZW50U3VmZml4LCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmKCFvcHRpb25zLnpvb21Pbk1vdXNlV2hlZWwpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKCF2aWV3ZXIubG9hZGVkKSByZXR1cm47XHJcblxyXG5cclxuICAgICAgICAvL2NsZWFyIGFsbCBhbmltYXRpb24gZnJhbWUgYW5kIGludGVydmFsXHJcbiAgICAgICAgdmlld2VyLl9jbGVhckZyYW1lcygpO1xyXG5cclxuICAgICAgICAvLyBjcm9zcy1icm93c2VyIHdoZWVsIGRlbHRhXHJcbiAgICAgICAgdmFyIGRlbHRhID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIChlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSB8fCAtZS5vcmlnaW5hbEV2ZW50LmRldGFpbCkpKSxcclxuICAgICAgICAgIHpvb21WYWx1ZSA9IHZpZXdlci56b29tVmFsdWUgKiAoMTAwICsgZGVsdGEgKiBaT09NX0NPTlNUQU5UKSAvIDEwMDtcclxuXHJcbiAgICAgICAgaWYoISh6b29tVmFsdWUgPj0gMTAwICYmIHpvb21WYWx1ZSA8PSBvcHRpb25zLm1heFpvb20pKXtcclxuICAgICAgICAgIGNoYW5nZWREZWx0YSArPSBNYXRoLmFicyhkZWx0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBjaGFuZ2VkRGVsdGEgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoY2hhbmdlZERlbHRhID4gTU9VU0VfV0hFRUxfQ09VTlQpIHJldHVybjtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgY29udE9mZnNldCA9IGNvbnRhaW5lci5vZmZzZXQoKSxcclxuICAgICAgICAgIHggPSAoZS5wYWdlWCB8fCBlLm9yaWdpbmFsRXZlbnQucGFnZVgpIC0gY29udE9mZnNldC5sZWZ0LFxyXG4gICAgICAgICAgeSA9IChlLnBhZ2VZIHx8IGUub3JpZ2luYWxFdmVudC5wYWdlWSkgLSBjb250T2Zmc2V0LnRvcDtcclxuXHJcblxyXG5cclxuICAgICAgICB2aWV3ZXIuem9vbSh6b29tVmFsdWUsIHtcclxuICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICB5OiB5XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vc2hvdyB0aGUgc25hcCB2aWV3ZXJcclxuICAgICAgICBzaG93U25hcFZpZXcoKTtcclxuICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgLy9hcHBseSBwaW5jaCBhbmQgem9vbSBmZWF0dXJlXHJcbiAgICAgIGltYWdlV3JhcC5vbigndG91Y2hzdGFydCcgKyBldmVudFN1ZmZpeCwgZnVuY3Rpb24gKGVzdGFydCkge1xyXG4gICAgICAgIGlmICghdmlld2VyLmxvYWRlZCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciB0b3VjaDAgPSBlc3RhcnQub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLFxyXG4gICAgICAgICAgdG91Y2gxID0gZXN0YXJ0Lm9yaWdpbmFsRXZlbnQudG91Y2hlc1sxXTtcclxuXHJcbiAgICAgICAgaWYgKCEodG91Y2gwICYmIHRvdWNoMSkpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB6b29taW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRPZmZzZXQgPSBjb250YWluZXIub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgIHZhciBzdGFydGRpc3QgPSBNYXRoLnNxcnQoTWF0aC5wb3codG91Y2gxLnBhZ2VYIC0gdG91Y2gwLnBhZ2VYLCAyKSArIE1hdGgucG93KHRvdWNoMS5wYWdlWSAtIHRvdWNoMC5wYWdlWSwgMikpLFxyXG4gICAgICAgICAgc3RhcnRab29tID0gdmlld2VyLnpvb21WYWx1ZSxcclxuICAgICAgICAgIGNlbnRlciA9IHtcclxuICAgICAgICAgICAgeDogKCh0b3VjaDEucGFnZVggKyB0b3VjaDAucGFnZVgpIC8gMikgLSBjb250T2Zmc2V0LmxlZnQsXHJcbiAgICAgICAgICAgIHk6ICgodG91Y2gxLnBhZ2VZICsgdG91Y2gwLnBhZ2VZKSAvIDIpIC0gY29udE9mZnNldC50b3BcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbW92ZSkge1xyXG4gICAgICAgICAgZW1vdmUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICB2YXIgdG91Y2gwID0gZW1vdmUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLFxyXG4gICAgICAgICAgICB0b3VjaDEgPSBlbW92ZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMV0sXHJcbiAgICAgICAgICAgIG5ld0Rpc3QgPSBNYXRoLnNxcnQoTWF0aC5wb3codG91Y2gxLnBhZ2VYIC0gdG91Y2gwLnBhZ2VYLCAyKSArIE1hdGgucG93KHRvdWNoMS5wYWdlWSAtIHRvdWNoMC5wYWdlWSwgMikpLFxyXG4gICAgICAgICAgICB6b29tVmFsdWUgPSBzdGFydFpvb20gKyAobmV3RGlzdCAtIHN0YXJ0ZGlzdCkgLyAyO1xyXG5cclxuICAgICAgICAgIHZpZXdlci56b29tKHpvb21WYWx1ZSwgY2VudGVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZW5kTGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkZG9jdW1lbnQub2ZmKCd0b3VjaG1vdmUnLCBtb3ZlTGlzdGVuZXIpO1xyXG4gICAgICAgICAgJGRvY3VtZW50Lm9mZigndG91Y2hlbmQnLCBlbmRMaXN0ZW5lcik7XHJcbiAgICAgICAgICB6b29taW5nID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJGRvY3VtZW50Lm9uKCd0b3VjaG1vdmUnLCBtb3ZlTGlzdGVuZXIpO1xyXG4gICAgICAgICRkb2N1bWVudC5vbigndG91Y2hlbmQnLCBlbmRMaXN0ZW5lcik7XHJcblxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICAvL2hhbmRsZSBkb3VibGUgdGFwIGZvciB6b29tIGluIGFuZCB6b29tIG91dFxyXG4gICAgICB2YXIgdG91Y2h0aW1lID0gMCxcclxuICAgICAgICBwb2ludCxcclxuICAgICAgICBjdXJQb2ludDtcclxuXHJcbiAgICAgIGltYWdlV3JhcC5vbignbW91c2Vkb3duJyArIGV2ZW50U3VmZml4ICsgJyB0b3VjaHN0YXJ0JyArIGV2ZW50U3VmZml4LCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHBvaW50ID0ge1xyXG4gICAgICAgICAgeDogMCxcclxuICAgICAgICAgIHk6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZih0eXBlb2YgZS5wYWdlWCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgcG9pbnQueCA9IGUucGFnZVg7XHJcbiAgICAgICAgICBwb2ludC55ID0gZS5wYWdlWTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcG9pbnQueCA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLnBhZ2VYO1xyXG4gICAgICAgICAgcG9pbnQueSA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLnBhZ2VZO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpbWFnZVdyYXAub24oJ21vdXNldXAnICsgZXZlbnRTdWZmaXggKyAnIHRvdWNoZW5kJyArIGV2ZW50U3VmZml4LCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGN1clBvaW50ID0ge1xyXG4gICAgICAgICAgeDogMCxcclxuICAgICAgICAgIHk6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZih0eXBlb2YgZS5wYWdlWCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgY3VyUG9pbnQueCA9IGUucGFnZVg7XHJcbiAgICAgICAgICBjdXJQb2ludC55ID0gZS5wYWdlWTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY3VyUG9pbnQueCA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcclxuICAgICAgICAgIGN1clBvaW50LnkgPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTWF0aC5hYnMoY3VyUG9pbnQueCAtIHBvaW50LngpIDwgNTAgJiYgTWF0aC5hYnMoY3VyUG9pbnQueSAtIHBvaW50LnkpIDwgNTApIHtcclxuICAgICAgICAgIGlmKHZpZXdlci56b29tVmFsdWUgPT0gb3B0aW9ucy5tYXhab29tKSB7XHJcbiAgICAgICAgICAgIHZpZXdlci56b29tKDEwMCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAyOyBpIDw9IChvcHRpb25zLm1heFpvb20gLyAxMDApOyBpKyspIHtcclxuICAgICAgICAgICAgICBpZigodmlld2VyLnpvb21WYWx1ZSAvIDEwMCkgPCBpKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3ZXIuem9vbSgoaSAqIDEwMCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8qaW1hZ2VXcmFwLm9uKCdjbGljaycgKyBldmVudFN1ZmZpeCwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIGlmICh0b3VjaHRpbWUgPT0gMCkge1xyXG4gICAgICAgICAgICAgIHRvdWNodGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgICAgcG9pbnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgIHg6IGUucGFnZVgsXHJcbiAgICAgICAgICAgICAgICAgIHk6IGUucGFnZVlcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpZiAoKERhdGUubm93KCkgLSB0b3VjaHRpbWUpIDwgNTAwICYmIE1hdGguYWJzKGUucGFnZVggLSBwb2ludC54KSA8IDUwICYmIE1hdGguYWJzKGUucGFnZVkgLSBwb2ludC55KSA8IDUwKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh2aWV3ZXIuem9vbVZhbHVlID09IG9wdGlvbnMuem9vbVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB2aWV3ZXIuem9vbSgyMDApXHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB2aWV3ZXIucmVzZXRab29tKClcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB0b3VjaHRpbWUgPSAwO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHRvdWNodGltZSA9IDA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTsqL1xyXG5cclxuICAgICAgLy96b29tIGluIHpvb20gb3V0IHVzaW5nIHpvb20gaGFuZGxlXHJcbiAgICAgIHZhciBzbGlkZXIgPSB2aWV3ZXIuc25hcFZpZXcuZmluZCgnLml2LXpvb20tc2xpZGVyJyk7XHJcbiAgICAgIHZhciB6b29tU2xpZGVyID0gbmV3IFNsaWRlcihzbGlkZXIsIHtcclxuICAgICAgICBzbGlkZXJJZDogdmlld2VyLl92aWV3ZXJJZCxcclxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbiAoZVN0YXJ0KSB7XHJcblxyXG4gICAgICAgICAgaWYgKCF2aWV3ZXIubG9hZGVkKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgdGhpcy5sZWZ0T2Zmc2V0ID0gc2xpZGVyLm9mZnNldCgpLmxlZnQ7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZVdpZHRoID0gdmlld2VyLnpvb21IYW5kbGUud2lkdGgoKTtcclxuICAgICAgICAgIHRoaXMub25Nb3ZlKGVTdGFydCk7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25Nb3ZlOiBmdW5jdGlvbiAoZSwgcG9zaXRpb24pIHtcclxuICAgICAgICAgIHZhciBuZXdMZWZ0ID0gKGUucGFnZVggfHwgZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0ucGFnZVgpIC0gdGhpcy5sZWZ0T2Zmc2V0IC0gdGhpcy5oYW5kbGVXaWR0aCAvIDI7XHJcblxyXG4gICAgICAgICAgbmV3TGVmdCA9IE1hdGgubWF4KDAsIG5ld0xlZnQpO1xyXG4gICAgICAgICAgbmV3TGVmdCA9IE1hdGgubWluKHZpZXdlci5fem9vbVNsaWRlckxlbmd0aCwgbmV3TGVmdCk7XHJcblxyXG4gICAgICAgICAgdmFyIHpvb21WYWx1ZSA9IDEwMCArIChvcHRpb25zLm1heFpvb20gLSAxMDApICogbmV3TGVmdCAvIHZpZXdlci5fem9vbVNsaWRlckxlbmd0aDtcclxuXHJcbiAgICAgICAgICB2aWV3ZXIuem9vbSh6b29tVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkuaW5pdCgpO1xyXG5cclxuXHJcbiAgICAgIC8vZGlzcGxheSBzbmFwVmlldyBvbiBpbnRlcmFjdGlvblxyXG4gICAgICB2YXIgc25hcFZpZXdUaW1lb3V0LCBzbmFwVmlld1Zpc2libGU7XHJcblxyXG4gICAgICBmdW5jdGlvbiBzaG93U25hcFZpZXcobm9UaW1lb3V0KSB7XHJcbiAgICAgICAgaWYoIW9wdGlvbnMuc25hcFZpZXcpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHNuYXBWaWV3VmlzaWJsZSB8fCB2aWV3ZXIuem9vbVZhbHVlIDw9IDEwMCB8fCAhdmlld2VyLmxvYWRlZCkgcmV0dXJuO1xyXG4gICAgICAgIGNsZWFyVGltZW91dChzbmFwVmlld1RpbWVvdXQpO1xyXG4gICAgICAgIHNuYXBWaWV3VmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdmlld2VyLnNuYXBWaWV3LmNzcygnb3BhY2l0eScsIDEpO1xyXG4gICAgICAgIGlmICghbm9UaW1lb3V0KSB7XHJcbiAgICAgICAgICBzbmFwVmlld1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmlld2VyLnNuYXBWaWV3LmNzcygnb3BhY2l0eScsIDApO1xyXG4gICAgICAgICAgICBzbmFwVmlld1Zpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgIH0sIDQwMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaW1hZ2VXcmFwLm9uKCd0b3VjaG1vdmUnICsgZXZlbnRTdWZmaXggKyAnIG1vdXNlbW92ZScgKyBldmVudFN1ZmZpeCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNob3dTbmFwVmlldygpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciBzbmFwRXZlbnRzQ2FsbGJhY2sgPSB7fTtcclxuICAgICAgc25hcEV2ZW50c0NhbGxiYWNrWydtb3VzZWVudGVyJyArIGV2ZW50U3VmZml4ICsgJyB0b3VjaHN0YXJ0JyArIGV2ZW50U3VmZml4XSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzbmFwVmlld1Zpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBzaG93U25hcFZpZXcodHJ1ZSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzbmFwRXZlbnRzQ2FsbGJhY2tbJ21vdXNlbGVhdmUnICsgZXZlbnRTdWZmaXggKyAnIHRvdWNoZW5kJyArIGV2ZW50U3VmZml4XSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzbmFwVmlld1Zpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBzaG93U25hcFZpZXcoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHZpZXdlci5zbmFwVmlldy5vbihzbmFwRXZlbnRzQ2FsbGJhY2spO1xyXG5cclxuXHJcbiAgICAgIC8vY2FsY3VsYXRlIGVsbWVudHMgc2l6ZSBvbiB3aW5kb3cgcmVzaXplXHJcbiAgICAgIGlmIChvcHRpb25zLnJlZnJlc2hPblJlc2l6ZSkgJHdpbmRvdy5vbigncmVzaXplJyArIGV2ZW50U3VmZml4LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmlld2VyLnJlZnJlc2goKVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICh2aWV3ZXIuX2Z1bGxQYWdlKSB7XHJcbiAgICAgICAgLy9wcmV2ZW50IHNjcm9sbGluZyB0aGUgYmFja3NpZGUgaWYgY29udGFpbmVyIGlmIGZpeGVkIHBvc2l0aW9uZWRcclxuICAgICAgICBjb250YWluZXIub24oJ3RvdWNobW92ZScgKyBldmVudFN1ZmZpeCArICcgbW91c2V3aGVlbCcgKyBldmVudFN1ZmZpeCArICcgRE9NTW91c2VTY3JvbGwnICsgZXZlbnRTdWZmaXgsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vYXNzaWduIGV2ZW50IG9uIGNsb3NlIGJ1dHRvblxyXG4gICAgICAgIGNvbnRhaW5lci5maW5kKCcuaXYtY2xvc2UnKS5vbignY2xpY2snICsgZXZlbnRTdWZmaXgsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZpZXdlci5oaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy9tZXRob2QgdG8gem9vbSBpbWFnZXNcclxuICAgIHpvb206IGZ1bmN0aW9uIChwZXJjLCBwb2ludCkge1xyXG4gICAgICBwZXJjID0gTWF0aC5yb3VuZChNYXRoLm1heCgxMDAsIHBlcmMpKTtcclxuICAgICAgcGVyYyA9IE1hdGgubWluKHRoaXMub3B0aW9ucy5tYXhab29tLCBwZXJjKTtcclxuXHJcbiAgICAgIHBvaW50ID0gcG9pbnQgfHwge1xyXG4gICAgICAgIHg6IHRoaXMuY29udGFpbmVyRGltLncgLyAyLFxyXG4gICAgICAgIHk6IHRoaXMuY29udGFpbmVyRGltLmggLyAyXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgbWF4Wm9vbSA9IHRoaXMub3B0aW9ucy5tYXhab29tLFxyXG4gICAgICAgIGN1clBlcmMgPSB0aGlzLnpvb21WYWx1ZSxcclxuICAgICAgICBjdXJJbWcgPSB0aGlzLmN1cnJlbnRJbWcsXHJcbiAgICAgICAgY29udGFpbmVyRGltID0gdGhpcy5jb250YWluZXJEaW0sXHJcbiAgICAgICAgY3VyTGVmdCA9IHBhcnNlRmxvYXQoY3VySW1nLmNzcygnbGVmdCcpKSxcclxuICAgICAgICBjdXJUb3AgPSBwYXJzZUZsb2F0KGN1ckltZy5jc3MoJ3RvcCcpKTtcclxuXHJcbiAgICAgIHNlbGYuX2NsZWFyRnJhbWVzKCk7XHJcblxyXG4gICAgICB2YXIgc3RlcCA9IDA7XHJcblxyXG4gICAgICAvL2NhbGN1bGF0ZSBiYXNlIHRvcCxsZWZ0LGJvdHRvbSxyaWdodFxyXG4gICAgICB2YXIgY29udGFpbmVyRGltID0gc2VsZi5jb250YWluZXJEaW0sXHJcbiAgICAgICAgaW1hZ2VEaW0gPSBzZWxmLmltYWdlRGltO1xyXG4gICAgICB2YXIgYmFzZUxlZnQgPSAoY29udGFpbmVyRGltLncgLSBpbWFnZURpbS53KSAvIDIsXHJcbiAgICAgICAgYmFzZVRvcCA9IChjb250YWluZXJEaW0uaCAtIGltYWdlRGltLmgpIC8gMixcclxuICAgICAgICBiYXNlUmlnaHQgPSBjb250YWluZXJEaW0udyAtIGJhc2VMZWZ0LFxyXG4gICAgICAgIGJhc2VCb3R0b20gPSBjb250YWluZXJEaW0uaCAtIGJhc2VUb3A7XHJcblxyXG4gICAgICBmdW5jdGlvbiB6b29tKCkge1xyXG4gICAgICAgIHN0ZXArKztcclxuXHJcbiAgICAgICAgaWYgKHN0ZXAgPCAyMCkge1xyXG4gICAgICAgICAgc2VsZi5fem9vbUZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHpvb20pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRpY2tab29tID0gZWFzZU91dFF1YXJ0KHN0ZXAsIGN1clBlcmMsIHBlcmMgLSBjdXJQZXJjLCAyMCk7XHJcblxyXG5cclxuICAgICAgICB2YXIgcmF0aW8gPSB0aWNrWm9vbSAvIGN1clBlcmMsXHJcbiAgICAgICAgICBpbWdXaWR0aCA9IHNlbGYuaW1hZ2VEaW0udyAqIHRpY2tab29tIC8gMTAwLFxyXG4gICAgICAgICAgaW1nSGVpZ2h0ID0gc2VsZi5pbWFnZURpbS5oICogdGlja1pvb20gLyAxMDAsXHJcbiAgICAgICAgICBuZXdMZWZ0ID0gLSgocG9pbnQueCAtIGN1ckxlZnQpICogcmF0aW8gLSBwb2ludC54KSxcclxuICAgICAgICAgIG5ld1RvcCA9IC0oKHBvaW50LnkgLSBjdXJUb3ApICogcmF0aW8gLSBwb2ludC55KTtcclxuXHJcbiAgICAgICAgLy9maXggZm9yIGxlZnQgYW5kIHRvcFxyXG4gICAgICAgIG5ld0xlZnQgPSBNYXRoLm1pbihuZXdMZWZ0LCBiYXNlTGVmdCk7XHJcbiAgICAgICAgbmV3VG9wID0gTWF0aC5taW4obmV3VG9wLCBiYXNlVG9wKTtcclxuXHJcbiAgICAgICAgLy9maXggZm9yIHJpZ2h0IGFuZCBib3R0b21cclxuICAgICAgICBpZigobmV3TGVmdCArIGltZ1dpZHRoKSA8IGJhc2VSaWdodCl7XHJcbiAgICAgICAgICBuZXdMZWZ0ID0gYmFzZVJpZ2h0IC0gaW1nV2lkdGg7IC8vbmV3TGVmdCAtIChuZXdMZWZ0ICsgaW1nV2lkdGggLSBiYXNlUmlnaHQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZigobmV3VG9wICsgaW1nSGVpZ2h0KSA8IGJhc2VCb3R0b20pe1xyXG4gICAgICAgICAgbmV3VG9wID0gIGJhc2VCb3R0b20gLSBpbWdIZWlnaHQ7IC8vbmV3VG9wICsgKG5ld1RvcCArIGltZ0hlaWdodCAtIGJhc2VCb3R0b20pXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgY3VySW1nLmNzcyh7XHJcbiAgICAgICAgICBoZWlnaHQ6IGltZ0hlaWdodCArICdweCcsXHJcbiAgICAgICAgICB3aWR0aDogaW1nV2lkdGggKyAncHgnLFxyXG4gICAgICAgICAgbGVmdDogbmV3TGVmdCArICdweCcsXHJcbiAgICAgICAgICB0b3A6IG5ld1RvcCArICdweCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2VsZi56b29tVmFsdWUgPSB0aWNrWm9vbTtcclxuXHJcbiAgICAgICAgc2VsZi5fcmVzaXplSGFuZGxlKGltZ1dpZHRoLCBpbWdIZWlnaHQsIG5ld0xlZnQsIG5ld1RvcCk7XHJcblxyXG4gICAgICAgIC8vdXBkYXRlIHpvb20gaGFuZGxlIHBvc2l0aW9uXHJcbiAgICAgICAgc2VsZi56b29tSGFuZGxlLmNzcygnbGVmdCcsICgodGlja1pvb20gLSAxMDApICogc2VsZi5fem9vbVNsaWRlckxlbmd0aCkgLyAobWF4Wm9vbSAtIDEwMCkgKyAncHgnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgem9vbSgpO1xyXG4gICAgfSxcclxuICAgIF9jbGVhckZyYW1lczogZnVuY3Rpb24gKCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2ltYWdlU2xpZGVyLnNsaWRlTW9tZW50dW1DaGVjayk7XHJcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX2ltYWdlU2xpZGVyLnNsaWRlck1vbWVudHVtRnJhbWUpO1xyXG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl96b29tRnJhbWUpXHJcbiAgICB9LFxyXG4gICAgcmVzZXRab29tOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuem9vbSh0aGlzLm9wdGlvbnMuem9vbVZhbHVlKTtcclxuICAgIH0sXHJcbiAgICAvL2NhbGN1bGF0ZSBkaW1lbnNpb25zIG9mIGltYWdlLCBjb250YWluZXIgYW5kIHJlc2V0IHRoZSBpbWFnZVxyXG4gICAgX2NhbGN1bGF0ZURpbWVuc2lvbnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy9jYWxjdWxhdGUgY29udGVudCB3aWR0aCBvZiBpbWFnZSBhbmQgc25hcCBpbWFnZVxyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY3VySW1nID0gc2VsZi5jdXJyZW50SW1nLFxyXG4gICAgICAgIGNvbnRhaW5lciA9IHNlbGYuY29udGFpbmVyLFxyXG4gICAgICAgIHNuYXBWaWV3ID0gc2VsZi5zbmFwVmlldyxcclxuICAgICAgICBpbWFnZVdpZHRoID0gY3VySW1nLndpZHRoKCksXHJcbiAgICAgICAgaW1hZ2VIZWlnaHQgPSBjdXJJbWcuaGVpZ2h0KCksXHJcbiAgICAgICAgY29udFdpZHRoID0gY29udGFpbmVyLndpZHRoKCksXHJcbiAgICAgICAgY29udEhlaWdodCA9IGNvbnRhaW5lci5oZWlnaHQoKSxcclxuICAgICAgICBzbmFwVmlld1dpZHRoID0gc25hcFZpZXcuaW5uZXJXaWR0aCgpLFxyXG4gICAgICAgIHNuYXBWaWV3SGVpZ2h0ID0gc25hcFZpZXcuaW5uZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgIC8vc2V0IHRoZSBjb250YWluZXIgZGltZW5zaW9uXHJcbiAgICAgIHNlbGYuY29udGFpbmVyRGltID0ge1xyXG4gICAgICAgIHc6IGNvbnRXaWR0aCxcclxuICAgICAgICBoOiBjb250SGVpZ2h0XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vc2V0IHRoZSBpbWFnZSBkaW1lbnNpb25cclxuICAgICAgdmFyIGltZ1dpZHRoLCBpbWdIZWlnaHQsIHJhdGlvID0gaW1hZ2VXaWR0aCAvIGltYWdlSGVpZ2h0O1xyXG5cclxuICAgICAgaW1nV2lkdGggPSAoaW1hZ2VXaWR0aCA+IGltYWdlSGVpZ2h0ICYmIGNvbnRIZWlnaHQgPj0gY29udFdpZHRoKSB8fCByYXRpbyAqIGNvbnRIZWlnaHQgPiBjb250V2lkdGggPyBjb250V2lkdGggOiByYXRpbyAqIGNvbnRIZWlnaHQ7XHJcblxyXG4gICAgICBpbWdIZWlnaHQgPSBpbWdXaWR0aCAvIHJhdGlvO1xyXG5cclxuICAgICAgc2VsZi5pbWFnZURpbSA9IHtcclxuICAgICAgICB3OiBpbWdXaWR0aCxcclxuICAgICAgICBoOiBpbWdIZWlnaHRcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9yZXNldCBpbWFnZSBwb3NpdGlvbiBhbmQgem9vbVxyXG4gICAgICBjdXJJbWcuY3NzKHtcclxuICAgICAgICB3aWR0aDogaW1nV2lkdGggKyAncHgnLFxyXG4gICAgICAgIGhlaWdodDogaW1nSGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgICBsZWZ0OiAoY29udFdpZHRoIC0gaW1nV2lkdGgpIC8gMiArICdweCcsXHJcbiAgICAgICAgdG9wOiAoY29udEhlaWdodCAtIGltZ0hlaWdodCkgLyAyICsgJ3B4JyxcclxuICAgICAgICAnbWF4LXdpZHRoJzogJ25vbmUnLFxyXG4gICAgICAgICdtYXgtaGVpZ2h0JzogJ25vbmUnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy9zZXQgdGhlIHNuYXAgSW1hZ2UgZGltZW5zaW9uXHJcbiAgICAgIHZhciBzbmFwV2lkdGggPSBpbWdXaWR0aCA+IGltZ0hlaWdodCA/IHNuYXBWaWV3V2lkdGggOiBpbWdXaWR0aCAqIHNuYXBWaWV3SGVpZ2h0IC8gaW1nSGVpZ2h0LFxyXG4gICAgICAgIHNuYXBIZWlnaHQgPSBpbWdIZWlnaHQgPiBpbWdXaWR0aCA/IHNuYXBWaWV3SGVpZ2h0IDogaW1nSGVpZ2h0ICogc25hcFZpZXdXaWR0aCAvIGltZ1dpZHRoO1xyXG5cclxuICAgICAgc2VsZi5zbmFwSW1hZ2VEaW0gPSB7XHJcbiAgICAgICAgdzogc25hcFdpZHRoLFxyXG4gICAgICAgIGg6IHNuYXBIZWlnaHRcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5zbmFwSW1nLmNzcyh7XHJcbiAgICAgICAgd2lkdGg6IHNuYXBXaWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHNuYXBIZWlnaHRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL2NhbGN1bGF0ZSB6b29tIHNsaWRlciBhcmVhXHJcbiAgICAgIHNlbGYuX3pvb21TbGlkZXJMZW5ndGggPSBzbmFwVmlld1dpZHRoIC0gc2VsZi56b29tSGFuZGxlLm91dGVyV2lkdGgoKTtcclxuXHJcbiAgICB9LFxyXG4gICAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIXRoaXMubG9hZGVkKSByZXR1cm47XHJcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZURpbWVuc2lvbnMoKTtcclxuICAgICAgdGhpcy5yZXNldFpvb20oKTtcclxuICAgIH0sXHJcbiAgICBfcmVzaXplSGFuZGxlOiBmdW5jdGlvbiAoaW1nV2lkdGgsIGltZ0hlaWdodCwgaW1nTGVmdCwgaW1nVG9wKSB7XHJcbiAgICAgIHZhciBjdXJJbWcgPSB0aGlzLmN1cnJlbnRJbWcsXHJcbiAgICAgICAgaW1hZ2VXaWR0aCA9IGltZ1dpZHRoIHx8IHRoaXMuaW1hZ2VEaW0udyAqIHRoaXMuem9vbVZhbHVlIC8gMTAwLFxyXG4gICAgICAgIGltYWdlSGVpZ2h0ID0gaW1nSGVpZ2h0IHx8IHRoaXMuaW1hZ2VEaW0uaCAqIHRoaXMuem9vbVZhbHVlIC8gMTAwLFxyXG4gICAgICAgIGxlZnQgPSBNYXRoLm1heCgtKGltZ0xlZnQgfHwgcGFyc2VGbG9hdChjdXJJbWcuY3NzKCdsZWZ0JykpKSAqIDEwMCAvIGltYWdlV2lkdGgsIDApLFxyXG4gICAgICAgIHRvcCA9IE1hdGgubWF4KC0oaW1nVG9wIHx8IHBhcnNlRmxvYXQoY3VySW1nLmNzcygndG9wJykpKSAqIDEwMCAvIGltYWdlSGVpZ2h0LCAwKSxcclxuICAgICAgICBoYW5kbGVXaWR0aCA9IE1hdGgubWluKHRoaXMuY29udGFpbmVyRGltLncgKiAxMDAgLyBpbWFnZVdpZHRoLCAxMDApLFxyXG4gICAgICAgIGhhbmRsZUhlaWdodCA9IE1hdGgubWluKHRoaXMuY29udGFpbmVyRGltLmggKiAxMDAgLyBpbWFnZUhlaWdodCwgMTAwKTtcclxuXHJcblxyXG4gICAgICB0aGlzLnNuYXBIYW5kbGUuY3NzKHtcclxuICAgICAgICB0b3A6IHRvcCArICclJyxcclxuICAgICAgICBsZWZ0OiBsZWZ0ICsgJyUnLFxyXG4gICAgICAgIHdpZHRoOiBoYW5kbGVXaWR0aCArICclJyxcclxuICAgICAgICBoZWlnaHQ6IGhhbmRsZUhlaWdodCArICclJ1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzaG93OiBmdW5jdGlvbiAoaW1hZ2UsIGhpUmVzSW1nKSB7XHJcbiAgICAgIGlmICh0aGlzLl9mdWxsUGFnZSkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnNob3coKTtcclxuICAgICAgICBpZiAoaW1hZ2UpIHRoaXMubG9hZChpbWFnZSwgaGlSZXNJbWcpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaGlkZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5fZnVsbFBhZ2UpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvcHRpb25zOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm4gdGhpcy5vcHRpb25zW2tleV07XHJcblxyXG4gICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IHZhbHVlO1xyXG4gICAgfSxcclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgIHZhciBldmVudFN1ZmZpeCA9ICcuJyArIHRoaXMuX3ZpZXdlcklkO1xyXG4gICAgICBpZiAodGhpcy5fZnVsbFBhZ2UpIHtcclxuICAgICAgICBjb250YWluZXIub2ZmKGV2ZW50U3VmZml4KTtcclxuICAgICAgICBjb250YWluZXIuZmluZCgnW2NsYXNzXj1cIml2XCJdJykub2ZmKGV2ZW50U3VmZml4KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmUoJ1tjbGFzc149XCJpdlwiXScpO1xyXG4gICAgICB9XHJcbiAgICAgICR3aW5kb3cub2ZmKGV2ZW50U3VmZml4KTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9LFxyXG4gICAgbG9hZDogZnVuY3Rpb24gKGltYWdlLCBoaVJlc0ltZykge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgY29udGFpbmVyID0gdGhpcy5jb250YWluZXI7XHJcblxyXG4gICAgICBjb250YWluZXIuZmluZCgnLml2LXNuYXAtaW1hZ2UsLml2LWxhcmdlLWltYWdlJykucmVtb3ZlKCk7XHJcbiAgICAgIHZhciBzbmFwSW1hZ2VXcmFwID0gdGhpcy5jb250YWluZXIuZmluZCgnLml2LXNuYXAtaW1hZ2Utd3JhcCcpO1xyXG4gICAgICBzbmFwSW1hZ2VXcmFwLnByZXBlbmQoJzxpbWcgY2xhc3M9XCJpdi1zbmFwLWltYWdlXCIgc3JjPVwiJyArIGltYWdlICsgJ1wiIC8+Jyk7XHJcbiAgICAgIHRoaXMuaW1hZ2VXcmFwLnByZXBlbmQoJzxpbWcgY2xhc3M9XCJpdi1sYXJnZS1pbWFnZVwiIHNyYz1cIicgKyBpbWFnZSArICdcIiAvPicpO1xyXG5cclxuICAgICAgaWYgKGhpUmVzSW1nKSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZVdyYXAuYXBwZW5kKCc8aW1nIGNsYXNzPVwiaXYtbGFyZ2UtaW1hZ2VcIiBzcmM9XCInICsgaGlSZXNJbWcgKyAnXCIgLz4nKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY3VycmVudEltZyA9IHRoaXMuY3VycmVudEltZyA9IHRoaXMuY29udGFpbmVyLmZpbmQoJy5pdi1sYXJnZS1pbWFnZScpO1xyXG4gICAgICB0aGlzLnNuYXBJbWcgPSB0aGlzLmNvbnRhaW5lci5maW5kKCcuaXYtc25hcC1pbWFnZScpO1xyXG4gICAgICBzZWxmLmxvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgLy9zaG93IGxvYWRlclxyXG4gICAgICBjb250YWluZXIuZmluZCgnLml2LWxvYWRlcicpLnNob3coKTtcclxuICAgICAgY3VycmVudEltZy5oaWRlKCk7XHJcbiAgICAgIHNlbGYuc25hcEltZy5oaWRlKCk7XHJcblxyXG4gICAgICAvL3JlZnJlc2ggdGhlIHZpZXdcclxuICAgICAgZnVuY3Rpb24gcmVmcmVzaFZpZXcoKSB7XHJcbiAgICAgICAgc2VsZi5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYuem9vbVZhbHVlID0gMTAwO1xyXG5cclxuICAgICAgICAvL3Jlc2V0IHpvb20gb2YgaW1hZ2VzXHJcbiAgICAgICAgY3VycmVudEltZy5zaG93KCk7XHJcbiAgICAgICAgc2VsZi5zbmFwSW1nLnNob3coKTtcclxuICAgICAgICBzZWxmLnJlZnJlc2goKTtcclxuICAgICAgICBzZWxmLnJlc2V0Wm9vbSgpO1xyXG5cclxuICAgICAgICAvL2hpZGUgbG9hZGVyXHJcbiAgICAgICAgY29udGFpbmVyLmZpbmQoJy5pdi1sb2FkZXInKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbWFnZUxvYWRlZChjdXJyZW50SW1nWzBdKSkge1xyXG4gICAgICAgIHJlZnJlc2hWaWV3KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJChjdXJyZW50SW1nWzBdKS5vbignbG9hZCcsIHJlZnJlc2hWaWV3KTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIEltYWdlVmlld2VyLmRlZmF1bHRzID0ge1xyXG4gICAgem9vbVZhbHVlOiAxMDAsXHJcbiAgICBzbmFwVmlldzogdHJ1ZSxcclxuICAgIG1heFpvb206IDUwMCxcclxuICAgIHJlZnJlc2hPblJlc2l6ZTogdHJ1ZSxcclxuICAgIHpvb21Pbk1vdXNlV2hlZWwgOiB0cnVlXHJcbiAgfVxyXG5cclxuICB3aW5kb3cuSW1hZ2VWaWV3ZXIgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgaW1nRWxtLCBpbWdTcmMsIGhpUmVzSW1nO1xyXG4gICAgaWYgKCEoY29udGFpbmVyICYmICh0eXBlb2YgY29udGFpbmVyID09IFwic3RyaW5nXCIgfHwgY29udGFpbmVyIGluc3RhbmNlb2YgRWxlbWVudCB8fCBjb250YWluZXJbMF0gaW5zdGFuY2VvZiBFbGVtZW50KSkpIHtcclxuICAgICAgb3B0aW9ucyA9IGNvbnRhaW5lcjtcclxuICAgICAgY29udGFpbmVyID0gJCgnI2l2LWNvbnRhaW5lcicpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRhaW5lciA9ICQoY29udGFpbmVyKTtcclxuXHJcbiAgICBpZiAoY29udGFpbmVyLmlzKCdpbWcnKSkge1xyXG4gICAgICBpbWdFbG0gPSBjb250YWluZXI7XHJcbiAgICAgIGltZ1NyYyA9IGltZ0VsbVswXS5zcmM7XHJcbiAgICAgIGhpUmVzSW1nID0gaW1nRWxtLmF0dHIoJ2hpZ2gtcmVzLXNyYycpIHx8IGltZ0VsbS5hdHRyKCdkYXRhLWhpZ2gtcmVzLXNyYycpO1xyXG4gICAgICBjb250YWluZXIgPSBpbWdFbG0ud3JhcCgnPGRpdiBjbGFzcz1cIml2LWNvbnRhaW5lclwiIHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2s7IG92ZXJmbG93OmhpZGRlblwiPjwvZGl2PicpLnBhcmVudCgpO1xyXG4gICAgICBpbWdFbG0uY3NzKHtcclxuICAgICAgICBvcGFjaXR5OiAwLFxyXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgIHpJbmRleDogLTFcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpbWdTcmMgPSBjb250YWluZXIuYXR0cignc3JjJykgfHwgY29udGFpbmVyLmF0dHIoJ2RhdGEtc3JjJyk7XHJcbiAgICAgIGhpUmVzSW1nID0gY29udGFpbmVyLmF0dHIoJ2hpZ2gtcmVzLXNyYycpIHx8IGNvbnRhaW5lci5hdHRyKCdkYXRhLWhpZ2gtcmVzLXNyYycpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YXIgdmlld2VyID0gbmV3IEltYWdlVmlld2VyKGNvbnRhaW5lciwgb3B0aW9ucyk7XHJcbiAgICB2aWV3ZXIuX2luaXQoKTtcclxuXHJcbiAgICBpZiAoaW1nU3JjKSB2aWV3ZXIubG9hZChpbWdTcmMsIGhpUmVzSW1nKTtcclxuXHJcbiAgICByZXR1cm4gdmlld2VyO1xyXG4gIH07XHJcblxyXG5cclxuICAkLmZuLkltYWdlVmlld2VyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICB2YXIgdmlld2VyID0gd2luZG93LkltYWdlVmlld2VyKCR0aGlzLCBvcHRpb25zKTtcclxuICAgICAgJHRoaXMuZGF0YSgnSW1hZ2VWaWV3ZXInLCB2aWV3ZXIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufSgod2luZG93LmpRdWVyeSksIHdpbmRvdywgZG9jdW1lbnQpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLkZvcm0gPSBBcHAuV2lkZ2V0cy5Gb3JtIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuRm9ybS5BamF4ID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldEV2ZW50Rm9ybUFqYXgnLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgICAgICAgWkFUT2dhdGV3YXk6ICcvYWpheC9pbnRlcmZhY2UvemF0by8nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5lbGVtZW50LmZpbmQoJ2Zvcm0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybU5hbWUgPSB0aGlzLmZvcm0uYXR0cignbmFtZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYXRld2F5ID0gdGhpcy5mb3JtLmF0dHIoJ2FjdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5LSVNEaXJlY3Rpb24gPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0RJUkVDVElPTlwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5LSVNDb21tZW50ID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiS0lTX0NPTU1FTlRcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuS0lTVHlwZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIlRZUEVcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuS0lTQ29kZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkNPREVcIl0nKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEdUTXB1c2hFdmVudExvYWRGb3JtID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudExvYWRGb3JtKHRoaXMuZm9ybU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiAhdGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlLW5vbXNnJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsaWRhdGUod2luZG93LmFwcGxpY2F0aW9uLnZhbGlkYXRlT3B0aW9uc0RlZmF1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsaWRhdGUod2luZG93LmFwcGxpY2F0aW9uLnZhbGlkYXRlT3B0aW9uc05vTXNnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1JFR0lPTlwiXScpLnZhbChHZW8ucmVnaW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2xpZW50SUQgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2FUcmFjayA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50SUQgPSBnZXRHQUNsaWVudElEKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudElEID0gd2FUcmFjay5jbGllbnRJRDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ0lEXCJdJykudmFsKGNsaWVudElEKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1VSTFwiXScpLnZhbCh3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtVG91Y2hFdmVudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5mb3JtLCAnc3VibWl0JywgJ3N1Ym1pdEZvcm0nKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0Tm90UnVzTGFuZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhbmdzID0gWydlbicsICdkZScsICdmciddO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGhBcnJheSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhbmdzLmluZGV4T2YocGF0aEFycmF5WzFdKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybVRvdWNoRXZlbnQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIGZvcm1JbnB1dHMgPSB0aGlzLmZvcm0uZmluZCgnOmlucHV0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5mb3JtVG91Y2ggPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXRzLm9uKCdmb2N1cycsIHNlbmRUb3VjaEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGZvcm1JbnB1dHMub24oJ2NoYW5nZScsIHNlbmRUb3VjaEV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZW5kVG91Y2hFdmVudCgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLmZvcm1Ub3VjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZvcm1Ub3VjaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1JbnB1dHMub2ZmKCdmb2N1cycsIHNlbmRUb3VjaEV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybUlucHV0cy5vZmYoJ2NoYW5nZScsIHNlbmRUb3VjaEV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRUb3VjaEZvcm0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHNlbGYuZm9ybU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZXhwb3J0RmllbGRzWkFUTzogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgU3VibWl0U2VuZGVyMk1haWwyQ1QgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5lcnJvcignd2FUcmFjayBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLktJU0RpcmVjdGlvbiAmJiB0aGlzLktJU0RpcmVjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFpBVE9UeXBlRm9ybSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRvZG86INCf0L7Rh9C10LzRgyDQvtGC0LrQu9GO0YfQuNC7INGA0LXQs9C40L7QvSDQt9C00LXRgdGMPyBaQVRPINC/0YDQuNC90LjQvNCw0LXRgiDRgNC10LPQuNC+0L0/XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0ubmFtZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIk5BTUVcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLnBob25lID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiUEhPTkVcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmRpcmVjdGlvbiA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRElSRUNUSU9OXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vWkFUT1R5cGVGb3JtLm5hbWUgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1JFR0lPTlwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY2xpZW50SWQgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0NJRFwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uaW5VcmwgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1VSTFwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uZW1haWwgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJFTUFJTFwiXScpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmF1dG9jYWxsID0gKHRoaXMuZ2V0Tm90UnVzTGFuZygpIHx8IFpBVE9UeXBlRm9ybS5waG9uZS5sZW5ndGggPD0gMCkgPyBmYWxzZSA6IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY29tbWVudCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5LSVNDb21tZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNvbW1lbnQgKz0gdGhpcy5LSVNDb21tZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmZpbmQoJypbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0NPTU1FTlRcIl0nKS52YWwoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9ICcgJyArIHRoaXMuZm9ybS5maW5kKCcqW2RhdGEtZmllbGR0eXBlPVwiRk9STV9DT01NRU5UXCJdJykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiQ09NUEFOWVwiXScpLnZhbCgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNvbW1lbnQgKz0gJyDQndCw0LfQstCw0L3QuNC1INC60L7QvNC/0LDQvdC40Lg6JyArIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkNPTVBBTllcIl0nKS52YWwoKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiU1RBVFVTXCJdOmNoZWNrZWQnKS5hdHRyKCdkYXRhLW5hbWUnKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9ICcg0KHRgtCw0YLRg9GBOicgKyB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJTVEFUVVNcIl06Y2hlY2tlZCcpLmF0dHIoJ2RhdGEtbmFtZScpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fT1RIRVJcIl0nKS52YWwoKSAmJiB0aGlzLmZvcm0uZmluZCgnaW5wdXRbbmFtZT1cImZvcm1fcmFkaW9fRk9STV9TVEFUVVNcIl06Y2hlY2tlZCcpLmF0dHIoJ2RhdGEtbmFtZScpID09ICfQlNGA0YPQs9C+0LUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNvbW1lbnQgKz0gJyAtICcgKyB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX09USEVSXCJdJykudmFsKCk7Ki9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qdmFyIHRoZW1lcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fVEhFTUVcIl06Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWVzLnB1c2goJCh0aGlzKS5jbG9zZXN0KCcuZm9ybV9fZmllbGQnKS5maW5kKCdsYWJlbCcpLnRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoZW1lcy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY29tbWVudCArPSAnINCi0LXQvNGLOiBbJyArIHRoZW1lcy5qb2luKCcsICcpICsgJ10nO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fVEhFTUVfT1RIRVJcIl0nKS52YWwoKSAmJiB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1uYW1lPVwi0J/RgNC10LTQu9C+0LbQuNGC0Ywg0YHQstC+0Y4g0YLQtdC80YNcIl06Y2hlY2tlZCcpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNvbW1lbnQgKz0gJyAtICcgKyB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1RIRU1FX09USEVSXCJdJykudmFsKCk7Ki9cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBaQVRPRGF0YU9iaiA9IHdhVHJhY2suWkFUT0RhdGEoWkFUT1R5cGVGb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFpBVE9EYXRhT2JqID0gU3VibWl0U2VuZGVyMk1haWwyQ1QoWkFUT1R5cGVGb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhaQVRPRGF0YU9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBDb250ZXh0ID0ge1pBVE86IFpBVE9EYXRhT2JqfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4aHI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4aHIgJiYgeGhyLnJlYWR5U3RhdGUgIT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyID0gJC5wb3N0KHRoaXMub3B0aW9ucy5aQVRPZ2F0ZXdheSwgQ29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzdWJtaXRGb3JtOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiAhdGhpcy5mb3JtLnZhbGlkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLnN0YXJ0V2FpdGluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB4aHI7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyICYmIHhoci5yZWFkeVN0YXRlICE9IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICB4aHIuYWJvcnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHhociA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLmdhdGV3YXksXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGhpcy5mb3JtLnNlcmlhbGl6ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRoaXMucHJveHkoJ2RvbmVTdWJtaXQnKSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogdGhpcy5wcm94eSgnZmFpbFN1Ym1pdCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZm9ybS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRvbmVTdWJtaXQ6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXhwb3J0RmllbGRzWkFUTygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtWzBdLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uZW5kV2FpdGluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50U2VuZEZvcm0gPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuS0lTVHlwZSA9PSAndGFibGUnIHx8IHRoaXMuS0lTVHlwZSA9PSAnYnJlYWtmYXN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50TmFtZSA9ICdmb3JtU2VtaW5hclNlbnQnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5LSVNUeXBlID09ICd3ZWJpbmFyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50TmFtZSA9ICdmb3JtV2ViaW5hclNlbnQnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5LSVNUeXBlID09ICdyZWNvcmRpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnROYW1lID0gJ2Zvcm1XZWJpbmFyUmVjU2VudCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudE5hbWUgPSB0aGlzLmZvcm1OYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50U2VuZEZvcm0odGhpcy5ldmVudE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmZvcm0sICdzdWJtaXQnLCAnc3VibWl0Rm9ybScpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcyA9IGpRdWVyeS5wYXJzZUpTT04oSlNPTi5zdHJpbmdpZnkocmVzKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuaHRtbChyZXMuaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8v0L/QtdGA0LXRgNC40YHQvtCy0YvQstCw0LXQvCBmYW5jeWJveCDQtdGJ0LUg0YDQsNC3LCDRh9GC0L7QsdGLINGD0LHRgNCw0YLRjCDRgdC60YDQvtC70Lsg0L/QvtGB0LvQtSDQv9C+0Y/QstC70LXQvdC40Y8g0L/Qu9Cw0YjQutC4IGZiXHJcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC51cGRhdGUoKTtcclxuICAgICAgICAgICAgICB9LCAxNTAwKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFpbFN1Ym1pdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5leHBvcnRGaWVsZHNaQVRPKCk7XHJcbiAgICAgICAgICAgICAgICAvL0dUTXB1c2hFdmVudFNlbmRGb3JtKHRoaXMuZm9ybU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLmVsZW1lbnQuaHRtbCgkKHJlcy5yZXNwb25zZVRleHQpLmh0bWwoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG4gICAgQXBwLldpZGdldHMuRm9ybSA9IEFwcC5XaWRnZXRzLkZvcm0gfHwge307XHJcbiAgICBBcHAuV2lkZ2V0cy5Gb3JtLkFqYXggPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0Rm9ybUFqYXgnLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgICAgICAgWkFUT2dhdGV3YXk6ICcvYWpheC9pbnRlcmZhY2UvemF0by8nLFxyXG4gICAgICAgICAgICAgICAgZGVtb0FjY2Vzc0dhdGV3YXk6ICcvYWpheC9pbnRlcmZhY2UvZGVtb2FjY2Vzcy8nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5lbGVtZW50LmZpbmQoJ2Zvcm0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybU5hbWUgPSB0aGlzLmZvcm0uYXR0cignbmFtZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ndG1DYXRlZ29yeSA9IHRoaXMuZm9ybS5hdHRyKCdndG1jYXRlZ29yeScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYXRld2F5ID0gdGhpcy5mb3JtLmF0dHIoJ2FjdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5LSVNEaXJlY3Rpb24gPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0RJUkVDVElPTlwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5LSVNJZGVudGl0eSA9IHRoaXMuZm9ybS5hdHRyKCdkYXRhLWtpcy1pZGVudGl0eScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXN0b21Qb3NpdGlvbiA9IHRoaXMuZm9ybS5hdHRyKCdkYXRhLWN1c3RvbS1wb3NpdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5LSVNDb21tZW50ID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiS0lTX0NPTU1FTlRcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuS0lTVHlwZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1GaW8gPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX05BTUVcIl0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUNvbW1lbnQgPSB0aGlzLmZvcm0uZmluZCgnKltkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ09NTUVOVFwiXScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtUGhvbmUgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1BIT05FXCJdJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1FbWFpbCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRU1BSUxcIl0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVdoYXRzYXBwID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9XSEFUU0FQUFwiXScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtRmFjZWJvb2sgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0ZBQ0VCT09LXCJdJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Ta3lwZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fU0tZUEVcIl0nKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm1OYW1lID09ICdQT1BVUF9TVUJTQ1JJUFRJT04nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtbGFiZWwgPSB0aGlzLmZvcm0uZmluZCgnbGFiZWwuZm9ybV9fbGFiZWwtLWNoZWNrYm94LWlubGluZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtSW50ZXJlc3RDaGVja2JveCA9IHRoaXMuZm9ybS5maW5kKCdsYWJlbC5mb3JtX19maWVsZC0tY2hlY2tib3hlcycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtSW50ZXJlc3QgPSB0aGlzLmZvcm0uZmluZCgnKltkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ09OQ1JFVEVMWV9JTlRFUkVTVEVEXCJdJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBob25lQnV0ID0gdGhpcy5mb3JtLmZpbmQoJy5qcy1zaXRlLXBob25lJykuZmluZCgnYScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lU2VsZWN0ID0gdGhpcy5mb3JtLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZm9ybV9kcm9wZG93bl9GT1JNX1RJTUVfVE9fQ0FMTFwiXScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXREZW1vYWNjZXNzID0gdGhpcy5mb3JtLmF0dHIoJ2RhdGEtZ2V0LWRlbW9hY2Nlc3MnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIga2lzVHlwZUZpZWxkID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiS0lTX1RZUEVcIl0nKTtcclxuICAgICAgICAgICAgICAgIGlmIChraXNUeXBlRmllbGQubGVuZ3RoID4gMCAmJiBraXNUeXBlRmllbGQudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLktJU1R5cGUgPSBraXNUeXBlRmllbGQudmFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRMb2FkRm9ybSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBHVE1wdXNoRXZlbnRMb2FkRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgIXRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZS1ub21zZycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh3aW5kb3cuYXBwbGljYXRpb24udmFsaWRhdGVPcHRpb25zRGVmYXVsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbGlkYXRlKHdpbmRvdy5hcHBsaWNhdGlvbi52YWxpZGF0ZU9wdGlvbnNEZWZhdWx0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbGlkYXRlKHdpbmRvdy5hcHBsaWNhdGlvbi52YWxpZGF0ZU9wdGlvbnNOb01zZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9SRUdJT05cIl0nKS52YWwoR2VvLnJlZ2lvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNsaWVudElEID0gJyc7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHdhVHJhY2sgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudElEID0gZ2V0R0FDbGllbnRJRCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGllbnRJRCA9IHdhVHJhY2suY2xpZW50SUQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0NJRFwiXScpLnZhbChjbGllbnRJRCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9VUkxcIl0nKS52YWwod2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVRvdWNoRXZlbnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybSwgJ3N1Ym1pdCcsICdzdWJtaXRGb3JtJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybUZpbykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5mb3JtRmlvLCAnY2hhbmdlJywgJ2NoYW5nZU5hbWUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VOYW1lU2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtQ29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5mb3JtQ29tbWVudCwgJ2NoYW5nZScsICdjaGFuZ2VDb21tZW50Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlQ29tbWVudFNlbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybVBob25lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmZvcm1QaG9uZSwgJ2NoYW5nZScsICdjaGFuZ2VQaG9uZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZVBob25lU2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtRW1haWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybUVtYWlsLCAnY2hhbmdlJywgJ2NoYW5nZUVtYWlsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlRW1haWxTZW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm1XaGF0c2FwcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5mb3JtV2hhdHNhcHAsICdjaGFuZ2UnLCAnY2hhbmdlV2hhdHNhcHAnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VXaGF0c2FwcFNlbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybUZhY2Vib29rKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmZvcm1GYWNlYm9vaywgJ2NoYW5nZScsICdjaGFuZ2VGYWNlYm9vaycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZUZhY2Vib29rU2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtU2t5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybVNreXBlLCAnY2hhbmdlJywgJ2NoYW5nZVNreXBlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlU2t5cGVTZW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBob25lQnV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLnBob25lQnV0LCAnY2xpY2snLCAnY2xpY2tUZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VUZWxTZW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVTZWxlY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMudGltZVNlbGVjdCwgJ2NoYW5nZScsICdjaGFuZ2VUaW1lU2VsZWN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlU2VsZWN0U2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtSW50ZXJlc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybUludGVyZXN0LCAnY2hhbmdlJywgJ2NoYW5nZUludGVyZXN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlSW50ZXJlc3RTZW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm1JbnRlcmVzdENoZWNrYm94KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtSW50ZXJlc3RDaGVja2JveC5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9uKCQodGhpcyksICdjbGljaycsICdjaGFuZ2VJbnRlcmVzdENoZWNrYm94Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtbGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrYm94T25jZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybWxhYmVsLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tib3hPbmNlLnB1c2goJCh0aGlzKS5hdHRyKCdmb3InKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub24oJCh0aGlzKSwgJ2NsaWNrJywgJ2NoYW5nZUNoZWNrQm94Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoYW5nZUNoZWNrQm94OiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmllbGROYW1lID0gJChlbCkuYXR0cignZm9yJyksXHJcbiAgICAgICAgICAgICAgICAgICAgY3VyciA9IHRoaXMuaW5BcnJheShmaWVsZE5hbWUsIHRoaXMuY2hlY2tib3hPbmNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgY3VyciAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCBmaWVsZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNoZWNrYm94T25jZVtjdXJyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaW5BcnJheTogZnVuY3Rpb24gKHdoYXQsIHdoZXJlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRydWUgPSAtMTtcclxuICAgICAgICAgICAgICAgIHdoZXJlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAod2hhdCA9PT0gaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdHJ1ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoYW5nZVRpbWVTZWxlY3Q6IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiB0aGlzLm9uY2VTZWxlY3RTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX1RJTUUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VTZWxlY3RTZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNsaWNrVGVsOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgdGhpcy5vbmNlVGVsU2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9URUwnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VUZWxTZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoYW5nZU5hbWU6IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiB0aGlzLm9uY2VOYW1lU2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9OQU1FJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlTmFtZVNlbmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hhbmdlQ29tbWVudDogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZUNvbW1lbnRTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX0NPTU1FTlQnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VDb21tZW50U2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGFuZ2VQaG9uZTogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZVBob25lU2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9QSE9ORScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZVBob25lU2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGFuZ2VFbWFpbDogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZUVtYWlsU2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9FTUFJTCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZUVtYWlsU2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGFuZ2VXaGF0c2FwcDogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZVdoYXRzYXBwU2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1XaGF0c2FwcCwgdGhpcy5ndG1DYXRlZ29yeSwgJ0ZPUk1fV0hBVFNBUFAnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VXaGF0c2FwcFNlbmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hhbmdlRmFjZWJvb2s6IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiB0aGlzLm9uY2VGYWNlYm9va1NlbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBHVE1wdXNoRXZlbnRUb3VjaEZvcm0odGhpcy5mb3JtRmFjZWJvb2ssIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX0ZBQ0VCT09LJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlRmFjZWJvb2tTZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoYW5nZVNreXBlOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgdGhpcy5vbmNlU2t5cGVTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybVNreXBlLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9TS1lQRScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZVNreXBlU2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGFuZ2VJbnRlcmVzdDogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZUludGVyZXN0U2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9DT05DUkVURUxZX0lOVEVSRVNURUQnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VJbnRlcmVzdFNlbmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hhbmdlSW50ZXJlc3RDaGVja2JveCA6IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9JTlRFUkVTVEVEXycrICgkKGVsKS5pbmRleCgpKzEpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybVRvdWNoRXZlbnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcywgZm9ybUlucHV0cyA9IHRoaXMuZm9ybS5maW5kKCc6aW5wdXQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmZvcm1Ub3VjaCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvcm1JbnB1dHMub24oJ2ZvY3VzJywgc2VuZFRvdWNoRXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgZm9ybUlucHV0cy5vbignY2hhbmdlJywgc2VuZFRvdWNoRXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNlbmRUb3VjaEV2ZW50KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5mb3JtVG91Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mb3JtVG91Y2ggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtSW5wdXRzLm9mZignZm9jdXMnLCBzZW5kVG91Y2hFdmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1JbnB1dHMub2ZmKCdjaGFuZ2UnLCBzZW5kVG91Y2hFdmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50VG91Y2hGb3JtID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybShzZWxmLmZvcm1OYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0Tm90UnVzTGFuZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhbmdzID0gWydlbicsICdkZScsICdmciddO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGhBcnJheSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhbmdzLmluZGV4T2YocGF0aEFycmF5WzFdKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXhwb3J0RmllbGRzWkFUTzogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgU3VibWl0U2VuZGVyMk1haWwyQ1QgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3dhVHJhY2sgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5LSVNEaXJlY3Rpb24gJiYgdGhpcy5LSVNEaXJlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBaQVRPVHlwZUZvcm0gPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0b2RvOiDQn9C+0YfQtdC80YMg0L7RgtC60LvRjtGH0LjQuyDRgNC10LPQuNC+0L0g0LfQtNC10YHRjD8gWkFUTyDQv9GA0LjQvdC40LzQsNC10YIg0YDQtdCz0LjQvtC9P1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLm5hbWUgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX05BTUVcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLnBob25lID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9QSE9ORVwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uZGlyZWN0aW9uID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9ESVJFQ1RJT05cIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9aQVRPVHlwZUZvcm0ubmFtZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fUkVHSU9OXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jbGllbnRJZCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ0lEXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5pblVybCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fVVJMXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5lbWFpbCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRU1BSUxcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLnR5cGUgPSB0aGlzLktJU1R5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5mb3JtSWRlbnRpdHkgPSB0aGlzLktJU0lkZW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uYXV0b2NhbGwgPSAodGhpcy5nZXROb3RSdXNMYW5nKCkgfHwgWkFUT1R5cGVGb3JtLnBob25lLmxlbmd0aCA8PSAwKSA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCa0L7QvNC80LXQvdGC0LDRgNC40Lgg0LTQu9GPINGE0L7RgNC80Ysg0L/QvtC00L/QuNGB0LrQuCDQsiDQsdC70L7Qs9C1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aG9BcmVZb3UgPSB0aGlzLmZvcm0uZmluZCgnW2RhdGEtY2hlY2tib3hlcz1cIkZPUk1fV0hPXCJdIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXTpjaGVja2VkJykuZGF0YSgndmFsJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISF3aG9BcmVZb3UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5wb3NpdGlvbiA9IHdob0FyZVlvdTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5wb3NpdGlvbiA9IHRoaXMuY3VzdG9tUG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZW1vYWNjZXNEYXRhID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXREZW1vYWNjZXNzID09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlbW9GaWVsZHMgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC70L7Qs9C40LrQsCDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC70L7Qs9C40L3QsCDQtNC70Y8g0LTQtdC80L4t0LTQvtGB0YLRg9C/0LAuINC10YHQu9C4INC90LXRgiDQuNC80LXQvdC4LCDQuNC70Lgg0LjQvNGPID0g0JDQvdC+0L3QuNC8LCDQuNGB0L/QvtC70YzQt9GD0LXQvCDQtdC80YvQu9C+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKFpBVE9UeXBlRm9ybS5uYW1lID09ICcnKSB8fCAoWkFUT1R5cGVGb3JtLm5hbWUgPT0gJ9CQ0L3QvtC90LjQvCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVtb0ZpZWxkcy51c2VybmFtZSA9IFpBVE9UeXBlRm9ybS5lbWFpbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVtb0ZpZWxkcy51c2VybmFtZSA9IFpBVE9UeXBlRm9ybS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVtb0ZpZWxkcy5DSUQgPSBaQVRPVHlwZUZvcm0uY2xpZW50SWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZW1vRmllbGRzLk5hbWUgPSBaQVRPVHlwZUZvcm0uZW1haWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZW1vRmllbGRzLkVtYWlsID0gWkFUT1R5cGVGb3JtLmVtYWlsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVtb0ZpZWxkcy5Db21wYW55ID0gJ0ZSTSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZW1vRmllbGRzLnBob25lTnVtYmVyID0gWkFUT1R5cGVGb3JtLnBob25lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVtb0ZpZWxkcy5Qb3NpdGlvbiA9IFpBVE9UeXBlRm9ybS5wb3NpdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZW1vYWNjZXNEYXRhID0gdGhpcy5nZXREZW1vYWNjZXNzRGF0YShkZW1vRmllbGRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGVtb2FjY2VzRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmFjY2Vzc19kZW1vID0gZGVtb2FjY2VzRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybU5hbWUgPT0gJ0ZPUk1fVVBSQVZMRU5LQScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jYWxsYmFjayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmF1dG9jYWxsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQvtGC0LTQtdC70YzQvdGL0Lkg0YTQvtGA0LzQsNGCINC00LDQvdC90YvRhSDQtNC70Y8g0LHQu9C+0LPQsFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ29wZW4tZnJvbScpID09PSAnYmxvZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZm9ybS5kYXRhKCd0aXRsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aXRsZSA9PT0gJ3N0cmluZycgJiYgdGl0bGUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9ICfQotC40L8g0YPRgdC70YPQs9C4OiAnICsgdGl0bGUgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21tZW50VmFsdWUgPSB0aGlzLmZvcm0uZmluZCgnKltkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ09NTUVOVFwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1lbnRWYWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY29tbWVudCArPSAn0JrQvtC80LzQtdC90YLQsNGA0LjQuTogJyArIGNvbW1lbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1dIQVRTQVBQXCJdJykudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY29tbWVudCArPSAnV2hhdHNBcHA6ICcgKyB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1dIQVRTQVBQXCJdJykudmFsKCkgKyAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRkFDRUJPT0tcIl0nKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9ICdGYWNlYm9vazogJyArIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRkFDRUJPT0tcIl0nKS52YWwoKSArICcgJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9TS1lQRVwiXScpLnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNvbW1lbnQgKz0gJ1NreXBlOiAgJyArIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fU0tZUEVcIl0nKS52YWwoKSArICcgJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5LSVNDb21tZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9IHRoaXMuS0lTQ29tbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZmluZCgnKltkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ09NTUVOVFwiXScpLnZhbCgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9ICcgJyArIHRoaXMuZm9ybS5maW5kKCcqW2RhdGEtZmllbGR0eXBlPVwiRk9STV9DT01NRU5UXCJdJykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ09SUFwiXScpLnZhbCgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9ICcg0J3QsNC30LLQsNC90LjQtSDQutC+0LzQv9Cw0L3QuNC4OicgKyB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0NPUlBcIl0nKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9TVEFURV9RVFlcIl0nKS52YWwoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY29tbWVudCArPSAnINCo0YLQsNGCICjRh9C10LspOicgKyB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1NUQVRFX1FUWVwiXScpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZmluZCgnaW5wdXRbbmFtZT1cImZvcm1fcmFkaW9fRk9STV9TVEFUVVNcIl06Y2hlY2tlZCcpLmF0dHIoJ2RhdGEtbmFtZScpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9ICcg0KHRgtCw0YLRg9GBOicgKyB0aGlzLmZvcm0uZmluZCgnaW5wdXRbbmFtZT1cImZvcm1fcmFkaW9fRk9STV9TVEFUVVNcIl06Y2hlY2tlZCcpLmF0dHIoJ2RhdGEtbmFtZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX09USEVSXCJdJykudmFsKCkgJiYgdGhpcy5mb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJmb3JtX3JhZGlvX0ZPUk1fU1RBVFVTXCJdOmNoZWNrZWQnKS5hdHRyKCdkYXRhLW5hbWUnKSA9PSAn0JTRgNGD0LPQvtC1JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY29tbWVudCArPSAnIC0gJyArIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fT1RIRVJcIl0nKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlbWVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fVEhFTUVcIl06Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lcy5wdXNoKCQodGhpcykuY2xvc2VzdCgnLmZvcm1fX2ZpZWxkJykuZmluZCgnbGFiZWwnKS50ZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoZW1lcy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNvbW1lbnQgKz0gJyDQotC10LzRizogWycgKyB0aGVtZXMuam9pbignLCAnKSArICddJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9USEVNRV9PVEhFUlwiXScpLnZhbCgpICYmIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLW5hbWU9XCLQn9GA0LXQtNC70L7QttC40YLRjCDRgdCy0L7RjiDRgtC10LzRg1wiXTpjaGVja2VkJykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNvbW1lbnQgKz0gJyAtICcgKyB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1RIRU1FX09USEVSXCJdJykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNpdHkgPSB0aGlzLmZvcm0uZmluZCgnW2RhdGEtY2hlY2tib3hlcz1cIkZPUk1fQ0lUWVwiXSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCcpLmRhdGEoJ25hbWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFjaXR5ICYmIGNpdHkgIT09ICfQlNGA0YPQs9C+0LUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNpdHkgPSBjaXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBaQVRPRGF0YU9iaiA9IHdhVHJhY2suWkFUT0RhdGEoWkFUT1R5cGVGb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFpBVE9EYXRhT2JqID0gU3VibWl0U2VuZGVyMk1haWwyQ1QoWkFUT1R5cGVGb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhaQVRPRGF0YU9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBDb250ZXh0ID0ge1pBVE86IFpBVE9EYXRhT2JqfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQucG9zdCh0aGlzLm9wdGlvbnMuWkFUT2dhdGV3YXksIENvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc3VibWl0Rm9ybTogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgIXRoaXMuZm9ybS52YWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRFcnJvckZvcm0gPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudEVycm9yRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5zdGFydFdhaXRpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLnBvc3QodGhpcy5nYXRld2F5LCB0aGlzLmZvcm0uc2VyaWFsaXplKCksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIH0sICdqc29uJylcclxuICAgICAgICAgICAgICAgICAgICAuZG9uZSh0aGlzLnByb3h5KCdkb25lU3VibWl0JykpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZhaWwodGhpcy5wcm94eSgnZmFpbFN1Ym1pdCcpKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkb25lU3VibWl0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4cG9ydEZpZWxkc1pBVE8oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVswXS5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmVuZFdhaXRpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEdUTXB1c2hFdmVudFNlbmRGb3JtID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFNlbmRGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3goe1xyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBDU1M6ICdtb2RhbC13cmFwcGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICgkKHdpbmRvdykud2lkdGgoKSA+IDkzNykgPyAyMCA6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVscGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50JzogJChyZXMuaHRtbClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZmFpbFN1Ym1pdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLmV4cG9ydEZpZWxkc1pBVE8oKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50RXJyb3JGb3JtID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudEVycm9yRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5odG1sKCQocmVzLnJlc3BvbnNlVGV4dCkuaHRtbCgpKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5mb3JtID0gdGhpcy5lbGVtZW50LmZpbmQoJ2Zvcm0nKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5nYXRld2F5ID0gdGhpcy5mb3JtLmF0dHIoJ2FjdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLm9uKHRoaXMuZm9ybSwgJ3N1Ym1pdCcsICdzdWJtaXRGb3JtJyk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXREZW1vYWNjZXNzRGF0YTogZnVuY3Rpb24gKGZpZWxkcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2FzeW5jJzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3VybCc6IHRoaXMub3B0aW9ucy5kZW1vQWNjZXNzR2F0ZXdheSxcclxuICAgICAgICAgICAgICAgICAgICAnZGF0YSc6IGZpZWxkcyxcclxuICAgICAgICAgICAgICAgICAgICAnZGF0YVR5cGUnOiAnanNvbidcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlJlc3VsdFN0YXRlID09ICdlcnJvcicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gJ2Vycm9yJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gJ18nICsgZGF0YS5Mb2dpbiArICcmUD0nICsgZGF0YS5QYXNzd29yZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLkZvcm0gPSBBcHAuV2lkZ2V0cy5Gb3JtIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuRm9ybS5EZWZhdWx0ID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldEZvcm1EZWZhdWx0JyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5lbGVtZW50LmZpbmQoJ2Zvcm0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybU5hbWUgPSB0aGlzLmZvcm0uYXR0cignbmFtZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYXRld2F5ID0gdGhpcy5mb3JtLmF0dHIoJ2FjdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ndG1DYXRlZ29yeSA9IHRoaXMuZm9ybS5hdHRyKCdndG1jYXRlZ29yeScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtRmlvID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9OQU1FXCJdJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Db21tZW50ID0gdGhpcy5mb3JtLmZpbmQoJypbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0NPTU1FTlRcIl0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVBob25lID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9QSE9ORVwiXScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtRW1haWwgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0VNQUlMXCJdJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBob25lQnV0ID0gdGhpcy5mb3JtLmZpbmQoJy5qcy1zaXRlLXBob25lJykuZmluZCgnYScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiAhdGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlLW5vbXNnJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHdpbmRvdy5hcHBsaWNhdGlvbi52YWxpZGF0ZU9wdGlvbnNEZWZhdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsaWRhdGUod2luZG93LmFwcGxpY2F0aW9uLnZhbGlkYXRlT3B0aW9uc0RlZmF1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsaWRhdGUod2luZG93LmFwcGxpY2F0aW9uLnZhbGlkYXRlT3B0aW9uc05vTXNnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1JFR0lPTlwiXScpLnZhbChHZW8ucmVnaW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2xpZW50SUQgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2FUcmFjayA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50SUQgPSBnZXRHQUNsaWVudElEKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudElEID0gd2FUcmFjay5jbGllbnRJRDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ0lEXCJdJykudmFsKGNsaWVudElEKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1VSTFwiXScpLnZhbCh3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy90aGlzLmZvcm1Ub3VjaEV2ZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmZvcm0sICdzdWJtaXQnLCAnc3VibWl0Rm9ybScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm1GaW8pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybUZpbywgJ2NoYW5nZScsICdjaGFuZ2VOYW1lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlTmFtZVNlbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybUNvbW1lbnQsICdjaGFuZ2UnLCAnY2hhbmdlQ29tbWVudCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZUNvbW1lbnRTZW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm1QaG9uZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5mb3JtUGhvbmUsICdjaGFuZ2UnLCAnY2hhbmdlUGhvbmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VQaG9uZVNlbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybUVtYWlsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmZvcm1FbWFpbCwgJ2NoYW5nZScsICdjaGFuZ2VFbWFpbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZUVtYWlsU2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5waG9uZUJ1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5waG9uZUJ1dCwgJ2NsaWNrJywgJ2NsaWNrVGVsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlVGVsU2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNsaWNrVGVsOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbmNlVGVsU2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9URUwnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VUZWxTZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoYW5nZU5hbWU6IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiB0aGlzLm9uY2VOYW1lU2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9OQU1FJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlTmFtZVNlbmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hhbmdlQ29tbWVudDogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZUNvbW1lbnRTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX0NPTU1FTlQnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VDb21tZW50U2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGFuZ2VQaG9uZTogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZVBob25lU2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9QSE9ORScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZVBob25lU2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGFuZ2VFbWFpbDogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZUVtYWlsU2VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFRvdWNoRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5LCAnRk9STV9FTUFJTCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZUVtYWlsU2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZm9ybVRvdWNoRXZlbnQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIGZvcm1JbnB1dHMgPSB0aGlzLmZvcm0uZmluZCgnOmlucHV0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5mb3JtVG91Y2ggPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXRzLm9uKCdmb2N1cycsIHNlbmRUb3VjaEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGZvcm1JbnB1dHMub24oJ2NoYW5nZScsIHNlbmRUb3VjaEV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZW5kVG91Y2hFdmVudCgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLmZvcm1Ub3VjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZvcm1Ub3VjaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1JbnB1dHMub2ZmKCdmb2N1cycsIHNlbmRUb3VjaEV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybUlucHV0cy5vZmYoJ2NoYW5nZScsIHNlbmRUb3VjaEV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRUb3VjaEZvcm0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHNlbGYuZm9ybU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXROb3RSdXNMYW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFuZ3MgPSBbJ2VuJywgJ2RlJywgJ2ZyJ107XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aEFycmF5ID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAobGFuZ3MuaW5kZXhPZihwYXRoQXJyYXlbMV0pICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWJtaXRGb3JtOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm0uZGF0YSgndmFsaWRhdGUnKSAmJiAhdGhpcy5mb3JtLnZhbGlkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEdUTXB1c2hFdmVudEVycm9yRm9ybSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50RXJyb3JGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLnN0YXJ0V2FpdGluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICQucG9zdCh0aGlzLmdhdGV3YXksIHRoaXMuZm9ybS5zZXJpYWxpemUoKSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgfSwgJ2pzb24nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kb25lKHRoaXMucHJveHkoJ2RvbmVTdWJtaXQnKSlcclxuICAgICAgICAgICAgICAgICAgICAuZmFpbCh0aGlzLnByb3h5KCdmYWlsU3VibWl0JykpO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGRvbmVTdWJtaXQ6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVswXS5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmVuZFdhaXRpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEdUTXB1c2hFdmVudFNlbmRGb3JtID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFNlbmRGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZmJxID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZicSgndHJhY2snLCAnTGVhZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3goe1xyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBDU1M6ICdtb2RhbC13cmFwcGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICgkKHdpbmRvdykud2lkdGgoKSA+IDkzNykgPyAyMCA6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVscGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50JzogJChyZXMuaHRtbClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZmFpbFN1Ym1pdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lmh0bWwoJChyZXMucmVzcG9uc2VUZXh0KS5odG1sKCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRFcnJvckZvcm0gPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50RXJyb3JGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy90aGlzLmZvcm0gPSB0aGlzLmVsZW1lbnQuZmluZCgnZm9ybScpO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLmdhdGV3YXkgPSB0aGlzLmZvcm0uYXR0cignYWN0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMub24odGhpcy5mb3JtLCAnc3VibWl0JywgJ3N1Ym1pdEZvcm0nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuRm9ybSA9IEFwcC5XaWRnZXRzLkZvcm0gfHwge307XHJcblx0QXBwLldpZGdldHMuRm9ybS5EdW1teSA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldEZvcm1EdW1teScsXHJcblx0XHRcdGRlZmF1bHRzOiB7fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMucGhvbmVDYWxsT3JkZXJCdG4gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWZvcm1fX3Bob25lLWNhbGwtb3JkZXItYnRuJyk7XHJcbiAgICAgICAgdGhpcy5jYWxsT3JkZXJCdG4gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLWZvcm1fX2NhbGwtb3JkZXItYnRuJyk7XHJcblx0XHRcdFx0dGhpcy5jb250YWN0c09yZGVyQnRuID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1mb3JtX19jb250YWN0cy1vcmRlci1idG4nKTtcclxuXHRcdFx0XHR0aGlzLnRlc3RSZXN1bHRPcmRlckJ0biA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtZm9ybV9fdGVzdC1yZXN1bHRzLW9yZGVyLWJ0bicpO1xyXG5cdFx0XHRcdHRoaXMudXNlclN1cnZleUJ0biA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtZm9ybV9fdXNlci1zdXJ2ZXktYnRuJyk7XHJcblx0XHRcdFx0dGhpcy5lbWFpbEZpZWxkID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1mb3JtX19lbWFpbCcpO1xyXG5cclxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRcdHRoaXMub24odGhpcy5lbGVtZW50LCAnc3VibWl0JywgJ3N1Y2Nlc3NNZXNzYWdlJyk7XHJcblxyXG5cdFx0XHRcdHRoaXMuZW1haWxGaWVsZC5vbignY2hhbmdlJywgZnVuY3Rpb24oZWwsIGV2KSB7XHJcblx0XHRcdFx0XHR2YXIgZW1haWxGaWVsZFZhbHVlID0gJCh0aGlzKS52YWwoKTtcclxuXHJcblx0XHRcdFx0XHRzZWxmLmNvbnRhY3RzT3JkZXJCdG4uZmFuY3lib3goe1xyXG5cdFx0XHRcdFx0XHRjb250ZW50OiAnPGRpdiBjbGFzcz1cIm1vZGFsIG1vZGFsLS12aXNpYmxlXCI+PGRpdiBjbGFzcz1cIm1vZGFsX190aXRsZVwiPtCh0L/QsNGB0LjQsdC+PC9kaXY+PHA+0J3QsNGI0Lgg0LrQvtC90YLQsNC60YLRiyDQvtGC0L/RgNCw0LLQu9C10L3RiyDQvdCwINC/0L7Rh9GC0YMgPGI+JyArIGVtYWlsRmllbGRWYWx1ZSArICc8L2I+PC9wPjwvZGl2PicsXHJcblx0XHRcdFx0XHRcdHdyYXBDU1M6ICdtb2RhbC13cmFwcGVyJyxcclxuXHRcdFx0XHRcdFx0bWFyZ2luOiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpID8gMjAgOiA1LFxyXG5cdFx0XHRcdFx0XHRwYWRkaW5nOiAxNSxcclxuXHRcdFx0XHRcdFx0aGVscGVyczoge1xyXG5cdFx0XHRcdFx0XHRcdG92ZXJsYXkgOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRjc3MgOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCdiYWNrZ3JvdW5kJyA6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0dGhpcy5waG9uZUNhbGxPcmRlckJ0bi5mYW5jeWJveCh7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICc8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtLXZpc2libGVcIj48ZGl2IGNsYXNzPVwibW9kYWxfX3RpdGxlXCI+0JfQsNGP0LLQutCwINC+0YLQv9GA0LDQstC70LXQvdCwPC9kaXY+PHA+0KHQv9Cw0YHQuNCx0L4hINCd0LDRiCDRgdC/0LXRhtC40LDQu9C40YHRgiDRgdCy0Y/QttC10YLRgdGPINGBINCS0LDQvNC4INCyINCx0LvQuNC20LDQudGI0LXQtSDQstGA0LXQvNGPLjwvcD48L2Rpdj4nLFxyXG4gICAgICAgICAgICB3cmFwQ1NTOiAnbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgIG1hcmdpbjogKCQod2luZG93KS53aWR0aCgpID4gNzY4KSA/IDIwIDogNSxcclxuICAgICAgICAgICAgcGFkZGluZzogMTUsXHJcbiAgICAgICAgICAgIGhlbHBlcnMgOiB7XHJcbiAgICAgICAgICAgICAgb3ZlcmxheSA6IHtcclxuICAgICAgICAgICAgICAgIGNzcyA6IHtcclxuICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnIDogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy51c2VyU3VydmV5QnRuLmZhbmN5Ym94KHtcclxuICAgICAgICAgICAgY29udGVudDogJzxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC0tdmlzaWJsZVwiPjxkaXYgY2xhc3M9XCJtb2RhbF9fdGl0bGVcIj7QktCw0Ygg0LPQvtC70L7RgSDRg9GH0YLQtdC9PC9kaXY+PHA+0KHQv9Cw0YHQuNCx0L4g0LfQsCDQstCw0YjQtSDRg9GH0LDRgdGC0LjQtSDQsiDQvtC/0YDQvtGB0LU8L3A+PC9kaXY+JyxcclxuICAgICAgICAgICAgd3JhcENTUzogJ21vZGFsLXdyYXBwZXInLFxyXG4gICAgICAgICAgICBtYXJnaW46ICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkgPyAyMCA6IDUsXHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE1LFxyXG4gICAgICAgICAgICBoZWxwZXJzIDoge1xyXG4gICAgICAgICAgICAgIG92ZXJsYXkgOiB7XHJcbiAgICAgICAgICAgICAgICBjc3MgOiB7XHJcbiAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kJyA6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudGVzdFJlc3VsdE9yZGVyQnRuLmZhbmN5Ym94KHtcclxuICAgICAgICAgICAgY29udGVudDogJzxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC0tc21hbGwgbW9kYWwtLXZpc2libGVcIj48ZGl2IGNsYXNzPVwibW9kYWxfX3RpdGxlXCI+0KHQv9Cw0YHQuNCx0L48L2Rpdj48cD7QodGB0YvQu9C60LAg0L7RgtC/0YDQsNCy0LvQtdC90LAg0L3QsCDQktCw0YjRgyDQv9C+0YfRgtGDPC9wPjwvZGl2PicsXHJcbiAgICAgICAgICAgIHdyYXBDU1M6ICdtb2RhbC13cmFwcGVyJyxcclxuICAgICAgICAgICAgbWFyZ2luOiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpID8gMjAgOiA1LFxyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNSxcclxuICAgICAgICAgICAgaGVscGVycyA6IHtcclxuICAgICAgICAgICAgICBvdmVybGF5IDoge1xyXG4gICAgICAgICAgICAgICAgY3NzIDoge1xyXG4gICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCcgOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNhbGxPcmRlckJ0bi5mYW5jeWJveCh7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6ICc8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtLXNtYWxsIG1vZGFsLS1oYXMtYmcgbW9kYWwtLXZpc2libGVcIj48ZGl2IGNsYXNzPVwibW9kYWxfX3RpdGxlXCI+0KHQv9Cw0YHQuNCx0L4uPC9kaXY+PHA+0JzRiyDRgdCy0Y/QttC10LzRgdGPINGBINCy0LDQvNC4INCyINCy0YvQsdGA0LDQvdC90L7QtSDQstGA0LXQvNGPLjwvcD48L2Rpdj4nLFxyXG4gICAgICAgICAgICB3cmFwQ1NTOiAnbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgIG1hcmdpbjogKCQod2luZG93KS53aWR0aCgpID4gNzY4KSA/IDIwIDogNSxcclxuICAgICAgICAgICAgcGFkZGluZzogMCxcclxuICAgICAgICAgICAgaGVscGVycyA6IHtcclxuICAgICAgICAgICAgICBvdmVybGF5IDoge1xyXG4gICAgICAgICAgICAgICAgY3NzIDoge1xyXG4gICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCcgOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0c3VjY2Vzc01lc3NhZ2U6IGZ1bmN0aW9uKGVsLCBldikge1xyXG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdC8vIEB0b2RvOiDQkdGD0LTRgyDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Yw/XHJcblx0QXBwLldpZGdldHMuRm9ybSA9IEFwcC5XaWRnZXRzLkZvcm0gfHwge307XHJcblx0QXBwLldpZGdldHMuRm9ybS5UcmFjayA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldEZvcm1UcmFjaycsXHJcblx0XHRcdGRlZmF1bHRzOiB7fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHR0aGlzLmlucHV0cyA9IHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1maWVsZHR5cGVdJyk7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fUkVHSU9OXCJdJykudmFsKEdlby5yZWdpb24pO1xyXG5cclxuXHRcdFx0XHR2YXIgY2xpZW50SUQgPSAnJztcclxuXHRcdFx0XHRpZiAodHlwZW9mIHdhVHJhY2sgPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdFx0Y2xpZW50SUQgPSBnZXRHQUNsaWVudElEKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNsaWVudElEID0gd2FUcmFjay5jbGllbnRJRDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9DSURcIl0nKS52YWwoY2xpZW50SUQpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1VSTFwiXScpLnZhbCh3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSk7XHJcblxyXG5cdFx0XHRcdHRoaXMub24odGhpcy5lbGVtZW50LCAnc3VibWl0JywgJ3NhdmVWYWx1ZXMnKTtcclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdFxyXG5cdFx0XHRzYXZlVmFsdWVzOiBmdW5jdGlvbihlbCwgZXYpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzLmlucHV0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLkZvcm0gPSBBcHAuV2lkZ2V0cy5Gb3JtIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuRm9ybS5HZXQgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0RXZlbnRGb3JtR2V0JyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcclxuICAgICAgICAgICAgICAgIGZvcm1HYXRld2F5U3RhcnRQYXRoOiAnL2FqYXgvZm9ybXMvZXZlbnRfaW52aXRlLydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRJZCA9IHRoaXMuZWxlbWVudC5kYXRhKCdldmVudC1pZCcpID8gdGhpcy5lbGVtZW50LmRhdGEoJ2V2ZW50LWlkJykgOiAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRUeXBlID0gdGhpcy5lbGVtZW50LmRhdGEoJ2V2ZW50LXR5cGUnKSA/IHRoaXMuZWxlbWVudC5kYXRhKCdldmVudC10eXBlJykgOiAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRDb2RlID0gdGhpcy5lbGVtZW50LmRhdGEoJ2V2ZW50LWNvZGUnKSA/IHRoaXMuZWxlbWVudC5kYXRhKCdldmVudC1jb2RlJykgOiAnJztcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZWxlbWVudCwgJ2NsaWNrJywgJ3Nob3dGb3JtJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNob3dGb3JtOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGFqYXhHYXRld2F5ID0gdGhpcy5vcHRpb25zLmZvcm1HYXRld2F5U3RhcnRQYXRoICsgJz9ldmVudF9pZD0nICsgdGhpcy5ldmVudElkICsgJyZldmVudF90eXBlPScgKyB0aGlzLmV2ZW50VHlwZSArICcmY29kZT0nICsgdGhpcy5ldmVudENvZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5vcGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hyZWYnOiBhamF4R2F0ZXdheVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYWpheCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9TaXplOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwQ1NTOiAnbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogKCQod2luZG93KS53aWR0aCgpID4gOTM3KSA/IDIwIDogNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVscGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmVTaG93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYXBwbGljYXRpb24uaW5zdGFsbENvbnRyb2xsZXIoJy5qcy1ldmVudC1mb3JtLWFqYXgnLCAnYXBwV2lkZ2V0RXZlbnRGb3JtQWpheCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlclNob3c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZmFuY3lib3gudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBBcHAuV2lkZ2V0cy5Gb3JtID0gQXBwLldpZGdldHMuRm9ybSB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzLkZvcm0uR2V0ID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldEZvcm1HZXRGaWxlJyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcclxuICAgICAgICAgICAgICAgIGZvcm1HYXRld2F5U3RhcnRQYXRoOiAnL2FqYXgvZm9ybXMvJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHN0ciA9IHRoaXMuZWxlbWVudC5hdHRyKCdocmVmJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVOYW1lID0gc3RyLnNwbGl0KCcvJykucG9wKCkgPyAnJmZpbGVOYW1lPScgKyBzdHIuc3BsaXQoJy8nKS5wb3AoKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtTmFtZSA9IHRoaXMuZWxlbWVudC5kYXRhKCdmb3JtJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1MYW5nID0gdGhpcy5lbGVtZW50LmRhdGEoJ2Zvcm0tbGFuZycpID8gdGhpcy5lbGVtZW50LmRhdGEoJ2Zvcm0tbGFuZycpIDogd2luZG93LkxhbmcgPyB3aW5kb3cuTGFuZyA6ICdydSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmFtc0lkID0gdGhpcy5lbGVtZW50LmRhdGEoJ2lkJykgPyAnJmlkPScgKyB0aGlzLmVsZW1lbnQuZGF0YSgnaWQnKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJhbXNDaXR5ID0gdGhpcy5lbGVtZW50LmRhdGEoJ2NpdHknKSA/IHRoaXMuZWxlbWVudC5kYXRhKCdjaXR5JykgOiAnJztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzaG93UG9wVXAgPSB1cmwuc2VhcmNoUGFyYW1zLmdldChcInNob3dfY2FsbGJhY2tcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzaG93UG9wVXAgPSB0aGlzLmdldFBhcmFtcyhcInNob3dfY2FsbGJhY2tcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNob3dQb3BVcCA9PSAnWScgJiYgKHRoaXMuZm9ybU5hbWUgPT0gXCJmb3JtX2Zvcl9jYWxsYmFja1wiIHx8IHRoaXMuZm9ybU5hbWUgPT0gXCJidXNpbmVzc19yYWlmZmVpc2VuXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93Rm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm1OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmVsZW1lbnQsICdjbGljaycsICdzaG93Rm9ybScpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdkYXRhLWZvcm0gaXMgbm90IHNldCBmb3IgZWxlbWVudDonLCB0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRQYXJhbXM6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW0gPSBwYXJhbS5yZXBsYWNlKC8oW1xcW1xcXV0pL2csIFwiXFxcXFxcJDFcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiW1xcXFw/Jl1cIiArIHBhcmFtICsgXCI9KFteJiNdKilcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWMod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMgPyByZXN1bHRzWzFdIDogXCJcIjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2hvd0Zvcm06IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgYWpheEdhdGV3YXkgPSB0aGlzLm9wdGlvbnMuZm9ybUdhdGV3YXlTdGFydFBhdGggKyB0aGlzLmZvcm1OYW1lICsgJy8/TEFORz0nICsgdGhpcy5mb3JtTGFuZyArIHRoaXMucGFyYW1zSWQgKyB0aGlzLmZpbGVOYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3gub3BlbihcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdocmVmJzogYWpheEdhdGV3YXlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FqYXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwQ1NTOiAnbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogKCQod2luZG93KS53aWR0aCgpID4gOTM3KSA/IDIwIDogNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlbHBlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2hvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmFwcGxpY2F0aW9uLmluc3RhbGxDb250cm9sbGVyKCcuanMtZm9ybS1hamF4JywgJ2FwcFdpZGdldEZvcm1BamF4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYXBwbGljYXRpb24uaW5zdGFsbENvbnRyb2xsZXIoJy5qcy16ZXJvLWNvbnRhY3QtZm9ybScsICdhcHBQYXltZW50Rm9ybVplcm9Db250YWN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG4gICAgQXBwLldpZGdldHMuRm9ybSA9IEFwcC5XaWRnZXRzLkZvcm0gfHwge307XHJcbiAgICBBcHAuV2lkZ2V0cy5Gb3JtLkdldCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRGb3JtR2V0JyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcclxuICAgICAgICAgICAgICAgIGZvcm1HYXRld2F5U3RhcnRQYXRoOiAnL2FqYXgvZm9ybXMvJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtTmFtZSA9IHRoaXMuZWxlbWVudC5kYXRhKCdmb3JtJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1UaXRsZSA9IHRoaXMuZWxlbWVudC5kYXRhKCdmb3JtLXRpdGxlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1LaXNJZGVudGl0eSA9IHRoaXMuZWxlbWVudC5kYXRhKCdraXMtaWRlbnRpdHknKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2VDb2RlID0gdGhpcy5lbGVtZW50LmRhdGEoJ3NlcnZpY2UtY29kZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlcnZpY2VDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlQ29kZSA9ICcmc2VydmljZT0nICsgdGhpcy5zZXJ2aWNlQ29kZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlQ29kZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm1UaXRsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybVRpdGxlID0gJyZuYW1lPScgKyB0aGlzLmZvcm1UaXRsZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtVGl0bGUgPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1DbG9zZSA9ICh0aGlzLmVsZW1lbnQuZGF0YSgnY2xvc2UnKSA9PSAnTicpID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtUGFkZGluZyA9ICh0aGlzLmVsZW1lbnQuZGF0YSgncGFkZGluZycpID09ICdOJykgPyAwIDogMTU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtT3BlbkZyb20gPSB0aGlzLmVsZW1lbnQuZGF0YSgnZm9ybS1vcGVuLWZyb20nKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZvcm1PcGVuRnJvbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybU9wZW5Gcm9tID0gJyZvcGVuRnJvbT0nICsgdGhpcy5mb3JtT3BlbkZyb21cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtT3BlbkZyb20gPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1MYW5nID0gdGhpcy5lbGVtZW50LmRhdGEoJ2Zvcm0tbGFuZycpID8gdGhpcy5lbGVtZW50LmRhdGEoJ2Zvcm0tbGFuZycpIDogd2luZG93LkxhbmcgPyB3aW5kb3cuTGFuZyA6ICdydSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmFtc0lkID0gdGhpcy5lbGVtZW50LmRhdGEoJ2lkJykgPyAnJmlkPScgKyB0aGlzLmVsZW1lbnQuZGF0YSgnaWQnKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJhbXNDaXR5ID0gdGhpcy5lbGVtZW50LmRhdGEoJ2NpdHknKSA/IHRoaXMuZWxlbWVudC5kYXRhKCdjaXR5JykgOiAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUtpc0lkZW50aXR5ID0gdGhpcy5lbGVtZW50LmRhdGEoJ2tpcy1pZGVudGl0eScpID8gJyZraXMtaWRlbnRpdHk9JyArIHRoaXMuZWxlbWVudC5kYXRhKCdraXMtaWRlbnRpdHknKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXREZW1vQWNjZXNzID0gdGhpcy5lbGVtZW50LmRhdGEoJ2dldC1kZW1vYWNjZXNzJykgPyAnJmdldC1kZW1vYWNjZXNzPScgKyB0aGlzLmVsZW1lbnQuZGF0YSgnZ2V0LWRlbW9hY2Nlc3MnKSA6ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNob3dQb3BVcCA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwic2hvd19jYWxsYmFja1wiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNob3dQb3BVcCA9IHRoaXMuZ2V0UGFyYW1zKFwic2hvd19jYWxsYmFja1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2hvd1BvcFVwID09ICdZJyAmJiAodGhpcy5mb3JtTmFtZSA9PSBcImZvcm1fZm9yX2NhbGxiYWNrXCIgfHwgdGhpcy5mb3JtTmFtZSA9PSBcImJ1c2luZXNzX3JhaWZmZWlzZW5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNob3dGb3JtKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZWxlbWVudCwgJ2NsaWNrJywgJ3Nob3dGb3JtJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2RhdGEtZm9ybSBpcyBub3Qgc2V0IGZvciBlbGVtZW50OicsIHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBhcmFtczogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbSA9IHBhcmFtLnJlcGxhY2UoLyhbXFxbXFxdXSkvZywgXCJcXFxcXFwkMVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXFxcXD8mXVwiICsgcGFyYW0gKyBcIj0oW14mI10qKVwiKSxcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cyA/IHJlc3VsdHNbMV0gOiBcIlwiO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaG93Rm9ybTogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHZhciBhamF4R2F0ZXdheSA9IHRoaXMub3B0aW9ucy5mb3JtR2F0ZXdheVN0YXJ0UGF0aCArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtTmFtZSArXHJcbiAgICAgICAgICAgICAgICAgICAgJy8/TEFORz0nICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm1MYW5nICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmFtc0lkICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm1UaXRsZSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtT3BlbkZyb20gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmljZUNvZGUgK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybUtpc0lkZW50aXR5ICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlbW9BY2Nlc3M7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1OYW1lID0gdGhpcy5mb3JtTmFtZTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJhbXNDaXR5ID0gdGhpcy5wYXJhbXNDaXR5O1xyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1QYWRkaW5nID0gdGhpcy5mb3JtUGFkZGluZztcclxuICAgICAgICAgICAgICAgIHZhciBmb3JtQ2xvc2UgPSB0aGlzLmZvcm1DbG9zZTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94Lm9wZW4oXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHJlZic6IGFqYXhHYXRld2F5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhamF4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcENTUzogJ21vZGFsLXdyYXBwZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICgkKHdpbmRvdykud2lkdGgoKSA+IDkzNykgPyAyMCA6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IGZvcm1QYWRkaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUJ0bjogZm9ybUNsb3NlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWxwZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kJzogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZVNob3c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbi5pbnN0YWxsQ29udHJvbGxlcignLmpzLWZvcm0tYWpheCcsICdhcHBXaWRnZXRGb3JtQWpheCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmFwcGxpY2F0aW9uLmluc3RhbGxDb250cm9sbGVyKCcuanMtZm9ybS1kZWZhdWx0JywgJ2FwcFdpZGdldEZvcm1EZWZhdWx0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYXBwbGljYXRpb24uaW5zdGFsbENvbnRyb2xsZXIoJy5qcy16ZXJvLWNvbnRhY3QtZm9ybScsICdhcHBQYXltZW50Rm9ybVplcm9Db250YWN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyU2hvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1OYW1lID09IFwiY29udGFjdF91c1wiIHx8IGZvcm1OYW1lID09IFwiY29udGFjdF9oYW5zXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGFyQWNjb3JkaW9uID0gJCgnZm9ybVtuYW1lPVwiQ09OVEFDVF9VU19GT1JNXCJdJykuZmluZCgnLmpzLWFjY29yZGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkYXJBY2NvcmRpb24ubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGFyQWNjb3JkaW9uID0gJCgnZm9ybVtuYW1lPVwiRm9ybV9NYWluX0ZvcmVpZ25cIl0nKS5maW5kKCcuanMtYWNjb3JkaW9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbi5pbnN0YWxsQ29udHJvbGxlcigkYXJBY2NvcmRpb24sICdhcHBXaWRnZXRBY2NvcmRpb24nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybU5hbWUgPT0gXCJjb250YWN0X3VzXCIgJiYgcGFyYW1zQ2l0eSA9PSBcInNwYlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGFsID0gJCgnLm1vZGFsLS12aXNpYmxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnYS5qcy1zaXRlLXBob25lLWEnKS5hdHRyKCd0aXRsZScsICcrJyArICc3ICg4MTIpIDMwOS03MS05MycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsLmZpbmQoJ2EuanMtc2l0ZS1waG9uZS1hJykuYXR0cignaHJlZicsICd0ZWw6KycgKyAnKzc4MTIzMDk3MTkzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnLmpzLXNpdGUtcGhvbmUtY2NvZGUnKS50ZXh0KCc4MTInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCcuanMtc2l0ZS1waG9uZS1sb2NhbCcpLnRleHQoJzMwOS03MS05MycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3JtTmFtZSA9PSAnc3Vic2NyaWJlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbi5pbnN0YWxsQ29udHJvbGxlcignZm9ybVtuYW1lPVwiUE9QVVBfU1VCU0NSSVBUSU9OXCJdJywgJ2FwcFdpZGdldENoZWNrU3Vic2NyaWJlRm9ybScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5XaWRnZXRzLkZvcm0gPSBBcHAuV2lkZ2V0cy5Gb3JtIHx8IHt9O1xyXG5cdEFwcC5XaWRnZXRzLkZvcm0uUG9sbCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldEZvcm1Qb2xsJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5nYXRld2F5ID0gdGhpcy5lbGVtZW50LmF0dHIoJ2FjdGlvbicpO1xyXG5cdFx0XHRcdHRoaXMub24odGhpcy5lbGVtZW50LCAnc3VibWl0JywgJ3N1Ym1pdEZvcm0nKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHN1Ym1pdEZvcm06IGZ1bmN0aW9uKGVsLCBldikge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LnN0YXJ0V2FpdGluZygpO1xyXG5cdFx0XHRcdCQucG9zdCh0aGlzLmdhdGV3YXksIHRoaXMuZWxlbWVudC5zZXJpYWxpemUoKSwgdGhpcy5wcm94eSgnc2hvd1Jlc3VsdCcpKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHNob3dSZXN1bHQ6IGZ1bmN0aW9uIChkYXRhKXtcclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiBHVE1wdXNoRXZlbnQgPT0gXCJmdW5jdGlvblwiKXtcclxuXHRcdFx0XHRcdEdUTXB1c2hFdmVudCgnRm9ybVlvdURvbnRDYWxsU2VudCcpO1xyXG5cdFx0XHRcdFx0R1RNcHVzaEV2ZW50KCdTdWNjZXNzU2VuZCcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JC5mYW5jeWJveCh7XHJcblx0XHRcdFx0XHR3cmFwQ1NTIDogJ21vZGFsLXdyYXBwZXInLFxyXG5cdFx0XHRcdFx0bWFyZ2luIDogKCQod2luZG93KS53aWR0aCgpID4gOTM3KSA/IDIwIDogNSxcclxuXHRcdFx0XHRcdHBhZGRpbmcgOiAxNSxcclxuXHRcdFx0XHRcdGhlbHBlcnMgOiB7XHJcblx0XHRcdFx0XHRcdG92ZXJsYXkgOiB7XHJcblx0XHRcdFx0XHRcdFx0Y3NzIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0J2JhY2tncm91bmQnIDogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQnY29udGVudCcgOiBkYXRhXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmVuZFdhaXRpbmcoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG4gICAgQXBwLldpZGdldHMuRm9ybSA9IEFwcC5XaWRnZXRzLkZvcm0gfHwge307XHJcbiAgICBBcHAuV2lkZ2V0cy5Gb3JtLlN1YnNjcmliZSA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRTbGlkZXJGb3JtJyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcclxuICAgICAgICAgICAgICAgIFpBVE9nYXRld2F5OiAnL2FqYXgvaW50ZXJmYWNlL3phdG8vJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZWxlbWVudDtcclxuXHRcdFx0XHR0aGlzLmZvcm1OYW1lID0gdGhpcy5mb3JtLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2F0ZXdheSA9IHRoaXMuZWxlbWVudC5hdHRyKCdhY3Rpb24nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3RtQ2F0ZWdvcnkgPSB0aGlzLmZvcm0uYXR0cignZ3RtY2F0ZWdvcnknKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5lbGVtZW50LCAnc3VibWl0JywgJ3N1Ym1pdEZvcm0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuS0lTRGlyZWN0aW9uID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9ESVJFQ1RJT05cIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuS0lTQ29tbWVudCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIktJU19DT01NRU5UXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1GaW8gPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX05BTUVcIl0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVBob25lID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9QSE9ORVwiXScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybUZpbykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5mb3JtRmlvLCAnY2hhbmdlJywgJ2NoYW5nZU5hbWUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VOYW1lU2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtUGhvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybVBob25lLCAnY2hhbmdlJywgJ2NoYW5nZVBob25lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlUGhvbmVTZW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNoYW5nZVBob25lOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGEoJ3ZhbGlkYXRlJykgJiYgdGhpcy5vbmNlUGhvbmVTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX1BIT05FJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlUGhvbmVTZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoYW5nZU5hbWU6IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuZGF0YSgndmFsaWRhdGUnKSAgJiYgdGhpcy5vbmNlTmFtZVNlbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBHVE1wdXNoRXZlbnRUb3VjaEZvcm0odGhpcy5mb3JtTmFtZSwgdGhpcy5ndG1DYXRlZ29yeSwgJ0ZPUk1fTkFNRScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZU5hbWVTZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Ym1pdEZvcm06IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGEoJ3ZhbGlkYXRlJykgJiYgIXRoaXMuZWxlbWVudC52YWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRFcnJvckZvcm0gPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudEVycm9yRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0YXJ0V2FpdGluZygpO1xyXG4gICAgICAgICAgICAgICAgJC5wb3N0KHRoaXMuZ2F0ZXdheSwgdGhpcy5lbGVtZW50LnNlcmlhbGl6ZSgpLCB0aGlzLnByb3h5KCdzaG93UmVzdWx0JykpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2hvd1Jlc3VsdDogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4cG9ydEZpZWxkc1pBVE8oKTtcclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRTZW5kRm9ybSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0XHRcdEdUTXB1c2hFdmVudFNlbmRGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnkpO1xyXG5cdFx0XHRcdH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbXNnQ29udGVudCA9ICc8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtLXZpc2libGVcIj48ZGl2IGNsYXNzPVwibW9kYWxfX3RpdGxlXCI+0JfQsNGP0LLQutCwINC+0YLQv9GA0LDQstC70LXQvdCwPC9kaXY+PHA+0KHQv9Cw0YHQuNCx0L4hINCd0LDRiCDRgdC/0LXRhtC40LDQu9C40YHRgiDRgdCy0Y/QttC10YLRgdGPINGBINCS0LDQvNC4INCyINCx0LvQuNC20LDQudGI0LXQtSDQstGA0LXQvNGPLjwvcD48L2Rpdj4nO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB1cmxBcnJheSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh1cmxBcnJheVsxXSA9PT0gJ2VuJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1zZ0NvbnRlbnQgPSAnPGRpdiBjbGFzcz1cIm1vZGFsIG1vZGFsLS12aXNpYmxlXCI+PGRpdiBjbGFzcz1cIm1vZGFsX190aXRsZVwiPlRoYW5rIHlvdSE8L2Rpdj48cD5XZSB3aWxsIGNvbnRhY3QgeW91IGF0IHRoZSBjaG9zZW4gdGltZSE8L3A+PC9kaXY+JztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94KHtcclxuICAgICAgICAgICAgICAgICAgICB3cmFwQ1NTOiAnbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5MzcpID8gMjAgOiA1LFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDE1LFxyXG4gICAgICAgICAgICAgICAgICAgIGhlbHBlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IG1zZ0NvbnRlbnRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmVuZFdhaXRpbmcoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0Tm90UnVzTGFuZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhbmdzID0gWydlbicsICdkZScsICdmciddO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGhBcnJheSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhbmdzLmluZGV4T2YocGF0aEFycmF5WzFdKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXhwb3J0RmllbGRzWkFUTzogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgU3VibWl0U2VuZGVyMk1haWwyQ1QgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3dhVHJhY2sgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5LSVNEaXJlY3Rpb24gJiYgdGhpcy5LSVNEaXJlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBaQVRPVHlwZUZvcm0gPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5uYW1lID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9OQU1FXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5waG9uZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fUEhPTkVcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmRpcmVjdGlvbiA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRElSRUNUSU9OXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5pblVybCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fVVJMXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5mb3JtSWRlbnRpdHkgPSB0aGlzLmZvcm0uYXR0cignZGF0YS1raXMtaWRlbnRpdHknKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5hdXRvY2FsbCA9ICh0aGlzLmdldE5vdFJ1c0xhbmcoKSB8fCBaQVRPVHlwZUZvcm0ucGhvbmUubGVuZ3RoIDw9IDApID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNvbW1lbnQgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuS0lTQ29tbWVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9IHRoaXMuS0lTQ29tbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5maW5kKCcqW2RhdGEtZmllbGR0eXBlPVwiRk9STV9DT01NRU5UXCJdJykudmFsKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY29tbWVudCArPSAnICcgKyB0aGlzLmZvcm0uZmluZCgnKltkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ09NTUVOVFwiXScpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFpBVE9EYXRhT2JqID0gU3VibWl0U2VuZGVyMk1haWwyQ1QoWkFUT1R5cGVGb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIENvbnRleHQgPSB7WkFUTzogWkFUT0RhdGFPYmp9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5wb3N0KHRoaXMub3B0aW9ucy5aQVRPZ2F0ZXdheSwgQ29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLkZvcm0gPSBBcHAuV2lkZ2V0cy5Gb3JtIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuRm9ybS5TdWJzY3JpYmUgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0Rm9ybVN1YnNjcmliZScsXHJcbiAgICAgICAgICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgICAgICAgICBaQVRPZ2F0ZXdheTogJy9hamF4L2ludGVyZmFjZS96YXRvLydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLktJU0RpcmVjdGlvbiA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRElSRUNUSU9OXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLktJU0NvbW1lbnQgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJLSVNfQ09NTUVOVFwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5LSVNUeXBlID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiS0lTX1RZUEVcIl0nKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1JFR0lPTlwiXScpLnZhbChHZW8ucmVnaW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2xpZW50SUQgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2FUcmFjayA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50SUQgPSBnZXRHQUNsaWVudElEKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudElEID0gd2FUcmFjay5jbGllbnRJRDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ0lEXCJdJykudmFsKGNsaWVudElEKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1VSTFwiXScpLnZhbCh3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICQoJ2Zvcm1bbmFtZT1cIlNVQlNDUklQVElPTl9CTE9HXCJdJykuZmluZCgnLmpzLWljaGVja2JveC5ydWJyaWNzJykub24oJ2lmQ2xpY2tlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdmb3JtW25hbWU9XCJTVUJTQ1JJUFRJT05fQkxPR1wiXScpLmZpbmQoJy5qcy1pY2hlY2tib3gucnVicmljcycpLmlDaGVjaygndW5jaGVjaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuaUNoZWNrKCdjaGVjaycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkKCdmb3JtW25hbWU9XCJTVUJTQ1JJUFRJT05fQkxPR1wiXScpLmZpbmQoJy5qcy1pY2hlY2tib3guY2l0aWVzJykub24oJ2lmQ2xpY2tlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdmb3JtW25hbWU9XCJTVUJTQ1JJUFRJT05fQkxPR1wiXScpLmZpbmQoJy5qcy1pY2hlY2tib3guY2l0aWVzJykuaUNoZWNrKCd1bmNoZWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soJ2NoZWNrJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2F0ZXdheSA9IHRoaXMuZWxlbWVudC5hdHRyKCdhY3Rpb24nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5lbGVtZW50LCAnc3VibWl0JywgJ3N1Ym1pdEZvcm0nKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHN1Ym1pdEZvcm06IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGEoJ3ZhbGlkYXRlJykgJiYgIXRoaXMuZWxlbWVudC52YWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0YXJ0V2FpdGluZygpO1xyXG4gICAgICAgICAgICAgICAgJC5wb3N0KHRoaXMuZ2F0ZXdheSwgdGhpcy5lbGVtZW50LnNlcmlhbGl6ZSgpLCB0aGlzLnByb3h5KCdzaG93UmVzdWx0JykpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2hvd1Jlc3VsdDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKGRhdGEpLmZpbmQoJ2lucHV0W25hbWU9XCJzdWJzY3JpYmVfZXJyb3JcIl0nKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwb3J0RmllbGRzWkFUTygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEdUTXB1c2hFdmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50KCdJbmZvU3Vic2NyaXB0aW9uU2VudCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94KHtcclxuICAgICAgICAgICAgICAgICAgICB3cmFwQ1NTOiAnbW9kYWwtd3JhcHBlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5MzcpID8gMjAgOiA1LFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDE1LFxyXG4gICAgICAgICAgICAgICAgICAgIGhlbHBlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IGRhdGFcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmVuZFdhaXRpbmcoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXhwb3J0RmllbGRzWkFUTzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBTdWJtaXRTZW5kZXIyTWFpbDJDVCA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignd2FUcmFjayBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuS0lTRGlyZWN0aW9uICYmIHRoaXMuS0lTRGlyZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgWkFUT1R5cGVGb3JtID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0ubmFtZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0ucGhvbmUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmRpcmVjdGlvbiA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRElSRUNUSU9OXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jbGllbnRJZCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ0lEXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5pblVybCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fVVJMXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5lbWFpbCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRU1BSUxcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLnR5cGUgPSB0aGlzLktJU1R5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2hvQXJlWW91ID0gdGhpcy5mb3JtLmZpbmQoJ1tkYXRhLWNoZWNrYm94ZXM9XCJGT1JNX1dIT1wiXSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCcpLmRhdGEoJ3ZhbCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhd2hvQXJlWW91KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0ucG9zaXRpb24gPSB3aG9BcmVZb3U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaXR5ID0gdGhpcy5mb3JtLmZpbmQoJ1tkYXRhLWNoZWNrYm94ZXM9XCJGT1JNX0NJVFlcIl0gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQnKS5kYXRhKCduYW1lJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFjaXR5ICYmIGNpdHkgIT09ICfQlNGA0YPQs9C+0LUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY2l0eSA9IGNpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5LSVNDb21tZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY29tbWVudCArPSB0aGlzLktJU0NvbW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIFpBVE9EYXRhT2JqID0gd2FUcmFjay5aQVRPRGF0YShaQVRPVHlwZUZvcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgWkFUT0RhdGFPYmogPSBTdWJtaXRTZW5kZXIyTWFpbDJDVChaQVRPVHlwZUZvcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFpBVE9EYXRhT2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIENvbnRleHQgPSB7WkFUTzogWkFUT0RhdGFPYmp9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5wb3N0KHRoaXMub3B0aW9ucy5aQVRPZ2F0ZXdheSwgQ29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5XaWRnZXRzLkZvcm0gPSBBcHAuV2lkZ2V0cy5Gb3JtIHx8IHt9O1xyXG5cdEFwcC5XaWRnZXRzLkZvcm0uQWpheCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldEZvcm1UZXN0Q29sbGVjdCcsXHJcblx0XHRcdGRlZmF1bHRzOiB7XHJcblx0XHRcdFx0WkFUT2dhdGV3YXk6ICcvYWpheC9pbnRlcmZhY2UvemF0by8nLFxyXG5cdFx0XHRcdFpBVE9nYXRld2F5QWN0aW9uOiAnL2FqYXgvaW50ZXJmYWNlL3phdG8vYWN0aW9uLydcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuZm9ybSA9IHRoaXMuZWxlbWVudC5maW5kKCdmb3JtJyk7XHJcblx0XHRcdFx0dGhpcy5mb3JtTmFtZSA9IHRoaXMuZm9ybS5hdHRyKCduYW1lJyk7XHJcblx0XHRcdFx0dGhpcy5nYXRld2F5ID0gdGhpcy5mb3JtLmF0dHIoJ2FjdGlvbicpO1xyXG5cdFx0XHRcdHRoaXMuS0lTRGlyZWN0aW9uID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9ESVJFQ1RJT05cIl0nKS52YWwoKTtcclxuXHRcdFx0XHR0aGlzLktJU0NvbW1lbnQgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJLSVNfQ09NTUVOVFwiXScpLnZhbCgpO1xyXG5cdFx0XHRcdHRoaXMuS0lTVHlwZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIktJU19UWVBFXCJdJykudmFsKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuS0lTQWN0aW9uID0ge1xyXG5cdFx0XHRcdFx0dHlwZTogdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9LSVNfQUNUSU9OXCJdJykudmFsKCksXHJcblx0XHRcdFx0XHRlbWFpbDogdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiQ0hJRUZfRU1BSUxcIl0nKS52YWwoKSxcclxuXHRcdFx0XHRcdGRldGFpbHM6IHtcclxuXHRcdFx0XHRcdFx0YWNjb3VudGluZ190eXBlOiB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJBQ0NPVU5USU5HX1RZUEVcIl0nKS52YWwoKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0dGhpcy5LSVNBY3Rpb25Db250ZXh0ID0ge307XHJcblxyXG5cdFx0XHRcdHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fUkVHSU9OXCJdJykudmFsKEdlby5yZWdpb24pO1xyXG5cclxuXHRcdFx0XHR2YXIgY2xpZW50SUQgPSAnJztcclxuXHRcdFx0XHRpZiAodHlwZW9mIHdhVHJhY2sgPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdGNsaWVudElEID0gZ2V0R0FDbGllbnRJRCgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjbGllbnRJRCA9IHdhVHJhY2suY2xpZW50SUQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ0lEXCJdJykudmFsKGNsaWVudElEKTtcclxuXHJcblx0XHRcdFx0dGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9VUkxcIl0nKS52YWwod2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCkpO1xyXG5cclxuXHRcdFx0XHR0aGlzLm9uKHRoaXMuZm9ybSwgJ3N1Ym1pdCcsICdzdWJtaXRGb3JtJyk7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzdWJtaXRGb3JtOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmICF0aGlzLmZvcm0udmFsaWQoKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5mb3JtLnN0YXJ0V2FpdGluZygpO1xyXG5cclxuXHRcdFx0XHQkLnBvc3QodGhpcy5nYXRld2F5LCB0aGlzLmZvcm0uc2VyaWFsaXplKCksIGZ1bmN0aW9uICgpIHt9LCAnanNvbicpXHJcblx0XHRcdFx0XHQuZG9uZSh0aGlzLnByb3h5KCdkb25lU3VibWl0JykpXHJcblx0XHRcdFx0XHQuZmFpbCh0aGlzLnByb3h5KCdmYWlsU3VibWl0JykpO1xyXG5cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGRvbmVTdWJtaXQ6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHR0aGlzLmV4cG9ydEZpZWxkc1pBVE8oKTtcclxuXHRcdFx0XHR0aGlzLnByZXBhcmVaQVRPQWN0aW9uKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuZm9ybS5lbmRXYWl0aW5nKCk7XHJcblxyXG5cdFx0XHRcdGlmIChyZXMuc3VjY2VzcyA9PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRpZiAoISQuaXNFbXB0eU9iamVjdCh0aGlzLktJU0FjdGlvbkNvbnRleHQpKVxyXG5cdFx0XHRcdFx0XHQkLnBvc3QodGhpcy5vcHRpb25zLlpBVE9nYXRld2F5QWN0aW9uLCB0aGlzLktJU0FjdGlvbkNvbnRleHQpO1xyXG5cdFx0XHRcdFx0dGhpcy5mb3JtLnJlbW92ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JC5mYW5jeWJveCh7XHJcblx0XHRcdFx0XHR3cmFwQ1NTOiAnbW9kYWwtd3JhcHBlcicsXHJcblx0XHRcdFx0XHRtYXJnaW46ICgkKHdpbmRvdykud2lkdGgoKSA+IDkzNykgPyAyMCA6IDUsXHJcblx0XHRcdFx0XHRwYWRkaW5nOiAxNSxcclxuXHRcdFx0XHRcdGhlbHBlcnM6IHtcclxuXHRcdFx0XHRcdFx0b3ZlcmxheToge1xyXG5cdFx0XHRcdFx0XHRcdGNzczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0J2JhY2tncm91bmQnOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdCdjb250ZW50JzogJChyZXMuaHRtbClcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGZhaWxTdWJtaXQ6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHR0aGlzLmV4cG9ydEZpZWxkc1pBVE8oKTtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuaHRtbCgkKHJlcy5yZXNwb25zZVRleHQpLmh0bWwoKSk7XHJcblx0XHRcdFx0dGhpcy5mb3JtID0gdGhpcy5lbGVtZW50LmZpbmQoJ2Zvcm0nKTtcclxuXHRcdFx0XHR0aGlzLmdhdGV3YXkgPSB0aGlzLmZvcm0uYXR0cignYWN0aW9uJyk7XHJcblx0XHRcdFx0dGhpcy5vbih0aGlzLmZvcm0sICdzdWJtaXQnLCAnc3VibWl0Rm9ybScpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRleHBvcnRGaWVsZHNaQVRPOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlb2YgU3VibWl0U2VuZGVyMk1haWwyQ1QgPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3dhVHJhY2sgaXMgdW5kZWZpbmVkJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRpZiAodGhpcy5LSVNEaXJlY3Rpb24gJiYgdGhpcy5LSVNEaXJlY3Rpb24ubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdHZhciBaQVRPVHlwZUZvcm0gPSB7fTtcclxuXHJcblx0XHRcdFx0XHRcdFpBVE9UeXBlRm9ybS5uYW1lID0gJyc7XHJcblx0XHRcdFx0XHRcdFpBVE9UeXBlRm9ybS5wb3NpdGlvbiA9ICcnO1xyXG5cdFx0XHRcdFx0XHRaQVRPVHlwZUZvcm0ucGhvbmUgPSAnJztcclxuXHRcdFx0XHRcdFx0WkFUT1R5cGVGb3JtLmRpcmVjdGlvbiA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRElSRUNUSU9OXCJdJykudmFsKCk7XHJcblx0XHRcdFx0XHRcdFpBVE9UeXBlRm9ybS5jbGllbnRJZCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ0lEXCJdJykudmFsKCk7XHJcblx0XHRcdFx0XHRcdFpBVE9UeXBlRm9ybS5pblVybCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fVVJMXCJdJykudmFsKCk7XHJcblx0XHRcdFx0XHRcdFpBVE9UeXBlRm9ybS5lbWFpbCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fRU1BSUxcIl0nKS52YWwoKTtcclxuXHRcdFx0XHRcdFx0WkFUT1R5cGVGb3JtLnR5cGUgPSB0aGlzLktJU1R5cGU7XHJcblxyXG5cdFx0XHRcdFx0XHRaQVRPVHlwZUZvcm0uY29tbWVudCA9ICcnO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuS0lTQ29tbWVudCkge1xyXG5cdFx0XHRcdFx0XHRcdFpBVE9UeXBlRm9ybS5jb21tZW50ICs9IHRoaXMuS0lTQ29tbWVudDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0dmFyIHdob0FyZVlvdSA9IHRoaXMuZm9ybS5maW5kKCdbZGF0YS1jaGVja2JveGVzPVwiRk9STV9XSE9cIl0gaW5wdXRbdHlwZT1cInJhZGlvXCJdOmNoZWNrZWQnKS5kYXRhKCduYW1lJyk7XHJcblx0XHRcdFx0XHRcdGlmICghIXdob0FyZVlvdSkge1xyXG5cdFx0XHRcdFx0XHRcdFpBVE9UeXBlRm9ybS5jb21tZW50ICs9ICcg0JrRgtC+INCy0Ys6ICcgKyB3aG9BcmVZb3U7XHJcblx0XHRcdFx0XHRcdFx0WkFUT1R5cGVGb3JtLnBvc2l0aW9uID0gdGhpcy5mb3JtLmZpbmQoJ1tkYXRhLWNoZWNrYm94ZXM9XCJGT1JNX1dIT1wiXSBpbnB1dFt0eXBlPVwicmFkaW9cIl06Y2hlY2tlZCcpLnZhbCgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQvL3ZhciBaQVRPRGF0YU9iaiA9IHdhVHJhY2suWkFUT0RhdGEoWkFUT1R5cGVGb3JtKTtcclxuXHRcdFx0XHRcdFx0dmFyIFpBVE9EYXRhT2JqID0gU3VibWl0U2VuZGVyMk1haWwyQ1QoWkFUT1R5cGVGb3JtKTtcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coWkFUT0RhdGFPYmopO1xyXG5cdFx0XHRcdFx0XHR2YXIgQ29udGV4dCA9IHtaQVRPOiBaQVRPRGF0YU9ian07XHJcblxyXG5cdFx0XHRcdFx0XHQkLnBvc3QodGhpcy5vcHRpb25zLlpBVE9nYXRld2F5LCBDb250ZXh0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHByZXBhcmVaQVRPQWN0aW9uOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBTdWJtaXRBY3Rpb24yTWFpbDJDVCA9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignd2FUcmFjayBpcyBpbmNvcnJlY3QnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuS0lTQWN0aW9uLnR5cGUgJiYgdGhpcy5LSVNBY3Rpb24udHlwZS5sZW5ndGgpIHtcclxuXHJcblx0XHRcdFx0XHRcdHRoaXMuS0lTQWN0aW9uLmNvbW1lbnQgPSAnJztcclxuXHRcdFx0XHRcdFx0dmFyIHNlbmRUZXN0VG8gPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0VNQUlMXCJdJykudmFsKCk7XHJcblx0XHRcdFx0XHRcdGlmICghIXNlbmRUZXN0VG8pIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5LSVNBY3Rpb24udHlwZSA9PT0gJzFjd2FfdGVzdF9zZW5kJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5LSVNBY3Rpb24uY29tbWVudCArPSAn0J7RgtC/0YDQsNCy0LjQuyDRgtC10YHRgiDQtNC70Y8gOiAnO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5LSVNBY3Rpb24udHlwZSA9PT0gJzFjd2FfdGVzdF9jb21wbGV0ZWQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLktJU0FjdGlvbi5jb21tZW50ICs9ICfQn9GA0L7QudC00LXQvSDRgtC10YHRgiA6ICc7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuS0lTQWN0aW9uLmNvbW1lbnQgKz0gc2VuZFRlc3RUbztcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0dmFyIEtJU0FjdGlvbk9iaiA9IFN1Ym1pdEFjdGlvbjJNYWlsMkNUKHRoaXMuS0lTQWN0aW9uKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5LSVNBY3Rpb25Db250ZXh0ID0ge0FjdGlvbjogS0lTQWN0aW9uT2JqfTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLkNsaWVudHNTbGlkZXIgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRDbGllbnRzU2xpZGVyJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCAgICB0aGlzLmVsZW1lbnQub3dsQ2Fyb3VzZWwoe1xyXG5cdFx0XHQgICAgXHRhdXRvcGxheTogdHJ1ZSxcclxuXHRcdFx0XHRcdGF1dG9wbGF5SG92ZXJQYXVzZTogdHJ1ZSxcclxuXHRcdFx0ICAgIFx0YXV0b3BsYXlUaW1lb3V0OiAyMDAwLFxyXG5cdFx0XHQgICAgXHRhdXRvcGxheVNwZWVkOiA3MDAsXHJcblx0XHRcdCAgICBcdGxvb3A6IHRydWUsXHJcblx0XHRcdCAgICBcdG5hdjogZmFsc2UsXHJcblx0XHRcdFx0XHRyZXNwb25zaXZlOntcclxuXHRcdFx0XHRcdFx0MDp7XHJcblx0XHRcdFx0XHRcdFx0aXRlbXM6IDFcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0MjAwOntcclxuXHRcdFx0XHRcdFx0XHRpdGVtczogMlxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHQ0NTA6e1xyXG5cdFx0XHRcdFx0XHRcdGl0ZW1zOiAzXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdDYwMDp7XHJcblx0XHRcdFx0XHRcdFx0aXRlbXM6IDRcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0MTAwMDp7XHJcblx0XHRcdFx0XHRcdFx0aXRlbXM6IDVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCdpbWcubHp5X2ltZycpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkKHRoaXMpLmF0dHIoJ3NyYycsICQodGhpcykuZGF0YSgnc3JjJykpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLkNvbnRlbnRTbGlkZXIgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRDb250ZW50U2xpZGVyJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5zY3JvbGxZVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRcdHRoaXMud2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cdFx0XHRcdHRoaXMuc2Nyb2xsWUJvdHRvbSA9IHRoaXMuc2Nyb2xsWVRvcCArIHRoaXMud2luZG93SGVpZ2h0O1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudE9mZnNldFRvcCA9IHRoaXMuZWxlbWVudC5wYXJlbnQoKS5vZmZzZXQoKS50b3A7XHJcblxyXG5cdFx0XHQgICAgdGhpcy5lbGVtZW50Lm93bENhcm91c2VsKHtcclxuXHRcdFx0ICAgIFx0aXRlbXM6IDEsXHJcblx0XHRcdCAgICBcdGF1dG9wbGF5OiB0cnVlLFxyXG5cdFx0XHRcdFx0YXV0b3BsYXlIb3ZlclBhdXNlOiB0cnVlLFxyXG5cdFx0XHQgICAgXHRhdXRvcGxheVRpbWVvdXQ6IDEwMDAwLFxyXG5cdFx0XHQgICAgXHRhdXRvcGxheVNwZWVkOiA4NTAsXHJcblx0XHRcdCAgICBcdG5hdlNwZWVkOiA4NTAsXHJcblx0XHRcdCAgICBcdGxvb3A6IHRydWUsXHJcblx0XHRcdCAgICBcdG5hdjogdHJ1ZSxcclxuXHRcdFx0ICAgIFx0bmF2VGV4dDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b0hlaWdodDogdHJ1ZVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnaW1nLmx6eV9pbWcnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5hdHRyKCdzcmMnLCAkKHRoaXMpLmRhdGEoJ3NyYycpKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0dGhpcy5lbGVtZW50SGVpZ2h0ID0gdGhpcy5lbGVtZW50LnBhcmVudCgpLm91dGVySGVpZ2h0KCk7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50T2Zmc2V0Qm90dG9tID0gdGhpcy5lbGVtZW50T2Zmc2V0VG9wICsgdGhpcy5lbGVtZW50SGVpZ2h0O1xyXG5cclxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRcdCQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNjcm9sbFlUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblx0XHRcdFx0XHR0aGlzLnNjcm9sbFlCb3R0b20gPSB0aGlzLnNjcm9sbFlUb3AgKyBzZWxmLndpbmRvd0hlaWdodDtcclxuXHJcblx0XHRcdFx0XHRpZih0aGlzLnNjcm9sbFlCb3R0b20gPiBzZWxmLmVsZW1lbnRPZmZzZXRUb3AgJiYgdGhpcy5zY3JvbGxZVG9wIDwgc2VsZi5lbGVtZW50T2Zmc2V0Qm90dG9tKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuZWxlbWVudC50cmlnZ2VyKCdwbGF5Lm93bC5hdXRvcGxheScsWzEwMDAwLCA4NTBdKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuZWxlbWVudC50cmlnZ2VyKCdzdG9wLm93bC5hdXRvcGxheScsWzEwMDAwLCA4NTBdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5Eb3R0ZWROYXZTbGlkZXIgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXREb3R0ZWROYXZTbGlkZXJOb0F1dG8nLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ICAgIHRoaXMuZWxlbWVudC5vd2xDYXJvdXNlbCh7XHJcblx0XHRcdCAgICBcdGl0ZW1zOiAxLFxyXG5cdFx0XHQgICAgXHRsb29wOiB0cnVlLFxyXG5cdFx0XHQgICAgXHRkb3RzRWFjaDogdHJ1ZSxcclxuXHRcdFx0ICAgIFx0ZG90c1NwZWVkOiA4MDAsXHJcblx0XHRcdCAgICBcdGF1dG9wbGF5OiBmYWxzZSxcclxuXHRcdFx0XHRcdGF1dG9IZWlnaHQ6IHRydWVcclxuXHRcdFx0ICAgIH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnaW1nLmx6eV9pbWcnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5hdHRyKCdzcmMnLCAkKHRoaXMpLmRhdGEoJ3NyYycpKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5Eb3R0ZWROYXZTbGlkZXIgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXREb3R0ZWROYXZTbGlkZXInLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ICAgIHRoaXMuZWxlbWVudC5vd2xDYXJvdXNlbCh7XHJcblx0XHRcdCAgICBcdGl0ZW1zOiAxLFxyXG5cdFx0XHQgICAgXHRsb29wOiB0cnVlLFxyXG5cdFx0XHQgICAgXHRkb3RzRWFjaDogdHJ1ZSxcclxuXHRcdFx0ICAgIFx0ZG90c1NwZWVkOiA4MDAsXHJcblx0XHRcdCAgICBcdGF1dG9wbGF5OiB0cnVlLFxyXG5cdFx0XHQgICAgXHRhdXRvcGxheVRpbWVvdXQ6IDYwMDAsXHJcblx0XHRcdCAgICBcdGF1dG9wbGF5U3BlZWQ6IDgwMCxcclxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheUhvdmVyUGF1c2U6IHRydWVcclxuXHRcdFx0ICAgIH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnaW1nLmx6eV9pbWcnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5hdHRyKCdzcmMnLCAkKHRoaXMpLmRhdGEoJ3NyYycpKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5FbXBsb3llZVJldmlld3NTbGlkZXIgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRFbXBsb3llZVJldmlld3NTbGlkZXInLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQub3dsQ2Fyb3VzZWwoe1xyXG5cdFx0XHQgICAgXHRpdGVtczogMSxcclxuXHRcdFx0ICAgIFx0bmF2U3BlZWQ6IDg1MCxcclxuXHRcdFx0ICAgIFx0bG9vcDogdHJ1ZSxcclxuXHRcdFx0ICAgIFx0bmF2OiB0cnVlLFxyXG5cdFx0XHQgICAgXHRuYXZUZXh0OiAnJyxcclxuXHRcdFx0ICAgIFx0YXV0b0hlaWdodCA6IHRydWVcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJ2ltZy5senlfaW1nJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQodGhpcykuYXR0cignc3JjJywgJCh0aGlzKS5kYXRhKCdzcmMnKSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG4gICAgQXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzLkltYWdlc0Nhcm91c2VsID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldEltYWdlc0Nhcm91c2VsJyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHt9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXlUaW1lb3V0OiAyMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5U3BlZWQ6IDcwMCxcclxuICAgICAgICAgICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMjAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDYwNToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA4MDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA5ODA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnaW1nLmx6eV9pbWcnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignc3JjJywgJCh0aGlzKS5kYXRhKCdzcmMnKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5NYWluU2xpZGVyID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0TWFpblNsaWRlcicsXHJcblx0XHRcdGRlZmF1bHRzOiB7fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aXNNb3VzZUxlYXZlOiB0cnVlLFxyXG5cclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHR2YXIgJG93bCA9IHRoaXMuZWxlbWVudDtcclxuXHJcblx0XHRcdFx0JG93bC5vd2xDYXJvdXNlbCh7XHJcblx0XHRcdCAgICBcdGl0ZW1zOiAxLFxyXG5cdFx0XHQgICAgXHRsb29wOiB0cnVlLFxyXG5cdFx0XHQgICAgXHRkb3RzRWFjaDogdHJ1ZSxcclxuXHRcdFx0ICAgIFx0bmF2OiBmYWxzZSxcclxuXHRcdFx0ICAgIFx0YW5pbWF0ZU91dDogJ2ZhZGVPdXQnLFxyXG5cdFx0XHRcdFx0YXV0b3BsYXk6IGZhbHNlLFxyXG5cdFx0XHRcdFx0Ly8g0LLRgdC1LCDRh9GC0L4g0LfQsNC60L7QvNC80LXQvdGH0LXQvdC+IC0g0L3QtSDQvtGC0YDQsNCx0LDRgtGL0LLQsNC10YIsINGCLtC6LiDQv9C10YDQtdC60LvRjtGH0LXQvdC40LUg0YHQu9Cw0LnQtNC+0LIg0LfQsNC/0LjQu9C10L3QviDQstCb0L7QsSDRgdC8LiDQvdC40LbQtVxyXG5cdFx0XHQgICAgXHQvLyBhdXRvcGxheTogdHJ1ZSxcclxuXHRcdFx0ICAgIFx0Ly8gYXV0b3BsYXlUaW1lb3V0OiAzMDAwLFxyXG5cdFx0XHRcdFx0Ly8gYXV0b3BsYXlIb3ZlclBhdXNlOiB0cnVlLFxyXG5cdFx0XHRcdFx0Ly8gc3RvcE9uSG92ZXI6dHJ1ZSxcclxuXHRcdFx0ICAgIFx0YXV0b0hlaWdodCA6IHRydWUsXHJcblx0XHRcdFx0XHRtb3VzZURyYWc6IGZhbHNlXHJcblx0XHRcdCAgICB9KTtcclxuXHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJ2ltZy5senlfaW1nJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQodGhpcykuYXR0cignc3JjJywgJCh0aGlzKS5kYXRhKCdzcmMnKSk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdC8vINC70L7Qs9C40LrQsCDQsdC70L7QutC40YDQvtCy0LrQuCDQv9GA0L7QutGA0YPRgtC60Lgg0YHQu9Cw0LnQtNC10YDQsCDQv9GA0LggaG92ZXJcclxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdFx0JG93bC5vbignbW91c2VsZWF2ZScsZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHNlbGYuaXNNb3VzZUxlYXZlID0gdHJ1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0JG93bC5vbignbW91c2VlbnRlcicsZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHNlbGYuaXNNb3VzZUxlYXZlID0gZmFsc2U7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHRoaXMuc2xpZGVOZXh0KCk7XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcclxuXHRcdFx0c2xpZGVOZXh0OiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdHZhciAkb3dsID0gdGhpcy5lbGVtZW50LFxyXG5cdFx0XHRcdFx0c2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHNlbGYuaXNNb3VzZUxlYXZlKSB7ICRvd2wudHJpZ2dlcignbmV4dC5vd2wuY2Fyb3VzZWwnKTsgfVxyXG5cdFx0XHRcdFx0XHRzZWxmLnNsaWRlTmV4dCh0cnVlKTtcclxuXHRcdFx0XHRcdH0sIDQ1MDApO1xyXG5cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcblx0QXBwLldpZGdldHMuV2lkZ2V0cy5QYXJ0bmVyc0Nhcm91c2VsTW9iID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0UGFydG5lcnNDYXJvdXNlbE1vYicsXHJcblx0XHRcdGRlZmF1bHRzOiB7fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQgICAgdGhpcy5lbGVtZW50Lm93bENhcm91c2VsKHtcclxuXHRcdFx0ICAgIFx0bG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcblx0XHRcdFx0XHRyZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogNVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA0ODA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogNVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCdpbWcubHp5X2ltZycpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkKHRoaXMpLmF0dHIoJ3NyYycsICQodGhpcykuZGF0YSgnc3JjJykpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG4gICAgQXBwLldpZGdldHMuV2lkZ2V0cy5QYXJ0bmVyc0Nhcm91c2VsTmF2ID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGx1Z2luTmFtZTogJ2FwcFdpZGdldFBhcnRuZXJzQ2Fyb3VzZWxOYXYnLFxyXG4gICAgICAgICAgICBkZWZhdWx0czoge31cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheVRpbWVvdXQ6IDIwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXlTcGVlZDogNzAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlbXM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvV2lkdGg6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgNDI1OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVtczogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9XaWR0aDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA0ODA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0ZW1zOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b1dpZHRoOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDk4MDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDMwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnaW1nLmx6eV9pbWcnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignc3JjJywgJCh0aGlzKS5kYXRhKCdzcmMnKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMuUGFydG5lcnNDYXJvdXNlbCA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRQYXJ0bmVyc0Nhcm91c2VsJyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHt9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXlUaW1lb3V0OiAyMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5U3BlZWQ6IDcwMCxcclxuICAgICAgICAgICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDQyNToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA0ODA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgOTgwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogNixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMjBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ2ltZy5senlfaW1nJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsICQodGhpcykuZGF0YSgnc3JjJykpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMuU2xpZGVyID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0U2xpZGVyJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCAgICB0aGlzLmVsZW1lbnQub3dsQ2Fyb3VzZWwoe1xyXG5cdFx0XHQgICAgXHRpdGVtczogMSxcclxuXHRcdFx0ICAgIFx0bG9vcDogdHJ1ZSxcclxuXHRcdFx0ICAgIFx0YW5pbWF0ZU91dDogJ2ZhZGVPdXQnLFxyXG5cdFx0XHQgICAgXHRhdXRvcGxheTogdHJ1ZSxcclxuXHRcdFx0ICAgIFx0YXV0b3BsYXlUaW1lb3V0OiAzMDAwXHJcblx0XHRcdCAgICB9KTtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnaW1nLmx6eV9pbWcnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5hdHRyKCdzcmMnLCAkKHRoaXMpLmRhdGEoJ3NyYycpKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdCk7XHJcbn0oalF1ZXJ5KSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuICAgIEFwcC5XaWRnZXRzLldpZGdldHMuU3luY1NsaWRlciA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRTeW5jU2xpZGVyJyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHt9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNsaWRlc1BlclBhZ2U6IDUsXHJcbiAgICAgICAgICAgIHN5bmNlZFNlY29uZGFyeTogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgYmlnID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1zeW5jLXNsaWRlci1iaWcnKSxcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1zeW5jLXNsaWRlci1wcmV2aWV3Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ2ltZy5senlfaW1nJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdzcmMnLCAkKHRoaXMpLmRhdGEoJ3NyYycpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGJpZy5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZU91dDogJ2ZhZGVPdXQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheVRpbWVvdXQ6IDUwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b0hlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtb3VzZURyYWc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZVJlZnJlc2hSYXRlOiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA4MDA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLm9uKCdjaGFuZ2VkLm93bC5jYXJvdXNlbCcsIHN5bmNQb3NpdGlvbkJpZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcHJldmlldy5vbignaW5pdGlhbGl6ZWQub3dsLmNhcm91c2VsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXcuZmluZChcIi5vd2wtaXRlbVwiKS5lcSgwKS5hZGRDbGFzcyhcImN1cnJlbnRcIik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMzAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBzZWxmLnNsaWRlc1BlclBhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbWFydFNwZWVkOiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlU3BlZWQ6IDUwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVCeTogc2VsZi5zbGlkZXNQZXJQYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlUmVmcmVzaFJhdGU6IDEwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDIwMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDYwNToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDgwMDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDk4MDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSkub24oJ2NoYW5nZWQub3dsLmNhcm91c2VsJywgc3luY1Bvc2l0aW9uUHJldmlldyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcHJldmlldy5vbihcImNsaWNrXCIsIFwiLm93bC1pdGVtXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBudW1iZXIgPSAkKHRoaXMpLmluZGV4KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmlnLmRhdGEoJ293bC5jYXJvdXNlbCcpLnRvKG51bWJlciwgMzAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHByZXZpZXcubW91c2VvdmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBiaWcudHJpZ2dlcignc3RvcC5vd2wuYXV0b3BsYXknKTtcclxuICAgICAgICAgICAgICAgIH0pLm1vdXNlb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBiaWcudHJpZ2dlcigncGxheS5vd2wuYXV0b3BsYXknLCBbNTAwMF0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN5bmNQb3NpdGlvbkJpZyhlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IGVsLml0ZW0uY291bnQgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gTWF0aC5yb3VuZChlbC5pdGVtLmluZGV4IC0gKGVsLml0ZW0uY291bnQgLyAyKSAtIC41KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25zY3JlZW4gPSBwcmV2aWV3LmZpbmQoJy5vd2wtaXRlbS5hY3RpdmUnKS5sZW5ndGggLSAxO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IGNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlld1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZChcIi5vd2wtaXRlbVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJjdXJyZW50XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lcShjdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJjdXJyZW50XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3LmRhdGEoJ293bC5jYXJvdXNlbCcpLnRvKGN1cnJlbnQgLSBvbnNjcmVlbiwgMTAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gc3luY1Bvc2l0aW9uUHJldmlldyhlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnN5bmNlZFNlY29uZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtYmVyID0gZWwuaXRlbS5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmlnLmRhdGEoJ293bC5jYXJvdXNlbCcpLnRvKG51bWJlciwgMTAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLk1vYmlsZUFwcFRhYnMgPSBjYW4uQ29udHJvbC5leHRlbmQoXHJcblx0XHR7XHJcblx0XHRcdHBsdWdpbk5hbWU6ICdhcHBXaWRnZXRNb2JpbGVBcHBUYWJzJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50SGVpZ2h0ID0gdGhpcy5lbGVtZW50Lm91dGVySGVpZ2h0KCk7XHJcblx0XHRcdFx0dGhpcy50YWIgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLW1vYmlsZS1hcHAtdGFic19fdGFiJyk7XHJcblx0XHRcdFx0dGhpcy50YWJDb250YWluZXIgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLW1vYmlsZS1hcHAtdGFic19fY29udGFpbmVyJyk7XHJcblx0XHRcdFx0dGhpcy50YWJDb250YWluZXJIZWlnaHQgPSB0aGlzLnRhYkNvbnRhaW5lci5vdXRlckhlaWdodCgpO1xyXG5cdFx0XHQgICAgdGhpcy50YWJDb250ZW50ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy1tb2JpbGUtYXBwLXRhYnNfX2NvbnRlbnQnKTtcclxuXHRcdFx0XHR0aGlzLnB1c2hQb2ludCA9IHRoaXMudGFiQ29udGFpbmVyLm9mZnNldCgpLnRvcDtcclxuXHRcdFx0ICAgIHRoaXMuc3RvcFBvaW50ID0gKHRoaXMucHVzaFBvaW50ICsgdGhpcy5lbGVtZW50SGVpZ2h0KSAtIHRoaXMudGFiQ29udGFpbmVySGVpZ2h0O1xyXG5cdFx0XHQgICAgdGhpcy5zY3JvbGxZVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuXHRcdFx0ICAgIHRoaXMub24odGhpcy50YWIsICdtb3VzZW92ZXInLCAnc3dpdGNoVGFiT25Ib3ZlcicpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0c3dpdGNoVGFiT25Ib3ZlcjogZnVuY3Rpb24oZWwsIGV2KSB7XHJcblx0XHRcdFx0dGhpcy50YWIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdGVsLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0dmFyIHRhcmdldElkID0gZWwuZGF0YSgnaWQnKTtcclxuXHRcdFx0XHR0aGlzLnRhYkNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdCQoJyMnICsgdGFyZ2V0SWQpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdCd7d2luZG93fSBzY3JvbGwnOiBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdHRoaXMuc2Nyb2xsWVRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHRcdFx0aWYodGhpcy5zY3JvbGxZVG9wID4gdGhpcy5wdXNoUG9pbnQgJiYgdGhpcy5zY3JvbGxZVG9wIDwgdGhpcy5zdG9wUG9pbnQpIHtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGFpbmVyLmFkZENsYXNzKCdzdGlja3knKTtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdub3Qtc3RpY2t5Jyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKHRoaXMuc2Nyb2xsWVRvcCA+IHRoaXMuc3RvcFBvaW50KSB7XHJcblx0XHRcdFx0XHR0aGlzLnRhYkNvbnRhaW5lci5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XHJcblx0XHRcdFx0XHR0aGlzLnRhYkNvbnRhaW5lci5hZGRDbGFzcygnbm90LXN0aWNreScpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdub3Qtc3RpY2t5Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0J3t3aW5kb3d9IHJlc2l6ZSc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudEhlaWdodCA9IHRoaXMuZWxlbWVudC5vdXRlckhlaWdodCgpO1xyXG5cdFx0XHQgICAgdGhpcy5zdG9wUG9pbnQgPSAodGhpcy5wdXNoUG9pbnQgKyB0aGlzLmVsZW1lbnRIZWlnaHQpIC0gdGhpcy50YWJDb250YWluZXJIZWlnaHQ7XHJcblxyXG5cdFx0XHQgICAgaWYodGhpcy5zY3JvbGxZVG9wID4gdGhpcy5wdXNoUG9pbnQgJiYgdGhpcy5zY3JvbGxZVG9wIDwgdGhpcy5zdG9wUG9pbnQpIHtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGFpbmVyLmFkZENsYXNzKCdzdGlja3knKTtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdub3Qtc3RpY2t5Jyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKHRoaXMuc2Nyb2xsWVRvcCA+IHRoaXMuc3RvcFBvaW50KSB7XHJcblx0XHRcdFx0XHR0aGlzLnRhYkNvbnRhaW5lci5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XHJcblx0XHRcdFx0XHR0aGlzLnRhYkNvbnRhaW5lci5hZGRDbGFzcygnbm90LXN0aWNreScpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdub3Qtc3RpY2t5Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLk92YWxUYWJzID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0T3ZhbFRhYnMnLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLnRhYkNvbnRlbnRJZElkQXJyYXkgPSBbXTtcclxuXHJcblx0XHRcdCAgICB0aGlzLnRhYiA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtb3ZhbC10YWJzX190YWInKTtcclxuXHRcdFx0ICAgIHRoaXMudGFiQ29udGVudCA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtb3ZhbC10YWJzX19jb250ZW50Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvID0gZmFsc2U7XHJcblxyXG5cdFx0XHQgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0ICAgIHRoaXMub24odGhpcy50YWIsICdjbGljaycsICdzd2l0Y2hUYWJPbkNsaWNrJyk7XHJcblxyXG5cdFx0XHQgICAgLy8g0J7RgtC60YDRi9GC0LjQtSDQt9Cw0LTQsNC90L3QvtCz0L4g0YXQtdGI0LXQvCDQsiB1cmwg0YLQsNCx0LAg0L/RgNC4INC/0LXRgNC10YXQvtC00LUg0L3QsCDRgdGC0YDQsNC90LjRhtGDXHJcblx0XHRcdFx0dGhpcy50YWIuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGVudElkID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xyXG5cdFx0XHRcdFx0c2VsZi50YWJDb250ZW50SWRJZEFycmF5LnB1c2godGhpcy50YWJDb250ZW50SWQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR2YXIgdXJpID0gbmV3IFVSSSh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcblx0XHRcdFx0dXJpLmZyYWdtZW50UHJlZml4KFwiIVwiKTtcclxuXHRcdFx0XHRpZih1cmkuZnJhZ21lbnQodHJ1ZSkpIHtcclxuXHRcdFx0XHRcdHZhciBoRnJhZ21lbnQgPSB1cmkuZnJhZ21lbnQodHJ1ZSk7XHJcblx0XHRcdFx0XHRpZiAoJ292YWwtdGFicycgaW4gaEZyYWdtZW50KSB7XHJcblx0XHRcdFx0XHRcdHRoaXMubG9jaGFzaCA9IGhGcmFnbWVudFsnb3ZhbC10YWJzJ107XHJcblx0XHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCdzY3JvbGwtdG8nIGluIGhGcmFnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvID0gaEZyYWdtZW50WydzY3JvbGwtdG8nXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0LypcclxuXHRcdFx0ICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XHJcblx0XHRcdFx0XHR0aGlzLmxvY2hhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCovXHJcblxyXG5cdFx0XHQgICAgdGhpcy50YWJDb250ZW50SWRJZEFycmF5LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdFx0aWYoc2VsZi5sb2NoYXNoID09PSBpdGVtKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuZWxlbWVudC5maW5kKCdbZGF0YS1pZD0nICsgaXRlbSArICddJykuY2xpY2soKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnNjcm9sbFRvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoJyMnICsgc2VsZi5zY3JvbGxUbykub2Zmc2V0KCkudG9wIC0gNjBcclxuICAgICAgICAgICAgICAgICAgICB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHN3aXRjaFRhYk9uQ2xpY2s6IGZ1bmN0aW9uKGVsLCBldikge1xyXG5cdFx0XHRcdHRoaXMudGFiLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdHZhciB0YXJnZXRJZCA9IGVsLmRhdGEoJ2lkJyk7XHJcblx0XHRcdFx0dGhpcy50YWJDb250ZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHQkKCcjJyArIHRhcmdldElkKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMuVGFicyA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuXHRcdHtcclxuXHRcdFx0cGx1Z2luTmFtZTogJ2FwcFdpZGdldFRhYnMnLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLnRhYkNvbnRlbnRJZElkQXJyYXkgPSBbXTtcclxuXHJcblx0XHRcdFx0dGhpcy50YWIgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXRhYnNfX3RhYicpO1xyXG5cdFx0XHRcdHRoaXMudGFiQ29udGVudCA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtdGFic19fY29udGVudCcpO1xyXG5cdFx0XHRcdHRoaXMucGllVGFiID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy10YWJzX19waWUtdGFiJyk7XHJcblxyXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdFx0dGhpcy5vbih0aGlzLnRhYiwgJ2NsaWNrJywgJ3N3aXRjaFRhYk9uQ2xpY2snKTtcclxuXHRcdFx0XHR0aGlzLm9uKHRoaXMucGllVGFiLCAnY2xpY2snLCAnc3dpdGNoUGllVGFiT25DbGljaycpO1xyXG5cclxuXHRcdFx0XHRpZih0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ2pzLXRhYnMtLXRyYW5zZm9ybWVyJykpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2VsZWN0TWVudSA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtdGFic19fc2VsZWN0LW1lbnUnKTtcclxuXHRcdFx0XHRcdHRoaXMudGFic0xpc3QgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXRhYnNfX2xpc3QnKTtcclxuXHJcblx0XHRcdFx0XHR0aGlzLm9uKHRoaXMuc2VsZWN0TWVudSwgJ2NsaWNrJywgJ3Nob3dUYWJzT25DbGljaycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyDQkNCy0YLQvtC80LDRgtC40YfQtdGB0LrQvtC1INC/0LXRgNC10LrQu9GO0YfQtdC90LjQtSDRgtCw0LHQvtCyINC/0YDQuCDQvdCw0LvQuNGH0LjQuCDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC10LPQviDQutC70LDRgdGB0LBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuZWxlbWVudC5oYXNDbGFzcygnanMtdGFicy0tYXV0b3N3aXRjaCcpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnRBdXRvU3dpdGNoID0gc2V0SW50ZXJ2YWwoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJzQXV0b1N3aXRjaCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW50QXV0b1N3aXRjaDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLnRhYiwgJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludEF1dG9Td2l0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMudGFiQ29udGVudCwgJ21vdXNlb3ZlcicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRBdXRvU3dpdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblx0XHRcdFx0Ly8g0J7RgtC60YDRi9GC0LjQtSDQt9Cw0LTQsNC90L3QvtCz0L4g0YXQtdGI0LXQvCDQsiB1cmwg0YLQsNCx0LAg0L/RgNC4INC/0LXRgNC10YXQvtC00LUg0L3QsCDRgdGC0YDQsNC90LjRhtGDXHJcblx0XHRcdFx0dGhpcy50YWIuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHRoaXMudGFiQ29udGVudElkID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xyXG5cdFx0XHRcdFx0c2VsZi50YWJDb250ZW50SWRJZEFycmF5LnB1c2godGhpcy50YWJDb250ZW50SWQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRpZih3aW5kb3cubG9jYXRpb24uaGFzaCkge1xyXG5cdFx0XHRcdFx0dGhpcy5sb2NoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy50YWJDb250ZW50SWRJZEFycmF5LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdFx0aXRlbUFyciA9IGl0ZW0uc3BsaXQoJyAnKTtcclxuXHRcdFx0XHRcdGl0ZW1BcnIuZm9yRWFjaChmdW5jdGlvbihpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChzZWxmLmxvY2hhc2ggPT09IGkpIHtcclxuXHRcdFx0XHRcdFx0XHRzZWxmLmVsZW1lbnQuZmluZCgnW2RhdGEtaWR+PScgKyBpICsgJ10nKS5jbGljaygpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHN3aXRjaFRhYk9uQ2xpY2s6IGZ1bmN0aW9uKGVsLCBldikge1xyXG5cdFx0XHRcdHRoaXMudGFiLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdHZhciB0YXJnZXRJZCA9IGVsLmRhdGEoJ2lkJykuc3BsaXQoJyAnKVswXTtcclxuXHRcdFx0XHR0aGlzLnRhYkNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHQkKCcjJyArIHRhcmdldElkKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdGlmKHRoaXMuZWxlbWVudC5oYXNDbGFzcygnanMtdGFicy0taG9yaXpvbnRhbCcpKSB7XHJcblx0XHRcdFx0XHR2YXIgdGFyZ2V0Q29sb3IgPSBlbC5kYXRhKCdjb2xvcicpO1xyXG5cdFx0XHRcdFx0dmFyIHRhcmdldElkQXJyYXkgPSBbXTtcclxuXHJcblx0XHRcdFx0XHQkKCcuanMtdGFicy0taG9yaXpvbnRhbCAuanMtdGFic19fdGFiJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dmFyIGF0dHJzID0gJCh0aGlzKS5kYXRhKCdjb2xvcicpO1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRJZEFycmF5LnB1c2goYXR0cnMpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXRJZEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciB0YXJnZXRJZEFycmF5SXRlbSA9IHRhcmdldElkQXJyYXlbaV07XHJcblxyXG5cdFx0XHRcdFx0XHRlbC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaG9yaXpvbnRhbC10YWJzX19saXN0LS0nICsgdGFyZ2V0SWRBcnJheUl0ZW0pLmFkZENsYXNzKCdob3Jpem9udGFsLXRhYnNfX2xpc3QtLScgKyB0YXJnZXRDb2xvcik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZih0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ2pzLXRhYnMtLXBpZS10YWJzJykpIHtcclxuXHRcdFx0XHRcdHZhciB0YXJnZXRQaWUgPSBlbC5kYXRhKCdwaWUnKTtcclxuXHRcdFx0XHRcdHZhciB0YXJnZXRJZEFycmF5ID0gW107XHJcblxyXG5cdFx0XHRcdFx0JCgnLmpzLXRhYnMtLXBpZS10YWJzIC5qcy10YWJzX190YWInKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHR2YXIgYXR0cnMgPSAkKHRoaXMpLmRhdGEoJ3BpZScpO1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRJZEFycmF5LnB1c2goYXR0cnMpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXRJZEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciB0YXJnZXRJZEFycmF5SXRlbSA9IHRhcmdldElkQXJyYXlbaV07XHJcblxyXG5cdFx0XHRcdFx0XHRlbC5wYXJlbnQoKS5yZW1vdmVDbGFzcygncGllLXRhYnNfX2xpc3QtLScgKyB0YXJnZXRJZEFycmF5SXRlbSkuYWRkQ2xhc3MoJ3BpZS10YWJzX19saXN0LS0nICsgdGFyZ2V0UGllKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKHRoaXMuZWxlbWVudC5oYXNDbGFzcygnanMtdGFicy0tdHJhbnNmb3JtZXInKSApIHtcclxuXHRcdFx0XHRcdHRoaXMuYWN0aXZlVGFiVGV4dCA9IGVsLnRleHQoKTtcclxuXHRcdFx0XHRcdHRoaXMuc2VsZWN0TWVudS50ZXh0KHRoaXMuYWN0aXZlVGFiVGV4dCk7XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5zaG93VGFic09uQ2xpY2soKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnc3dpdGNoUGllVGFiT25DbGljayc6IGZ1bmN0aW9uKGVsLCBldikge1xyXG5cdFx0XHRcdHRoaXMucGllVGFiLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdHZhciB0YXJnZXRJZCA9IGVsLmRhdGEoJ2lkJykuc3BsaXQoJyAnKVswXTtcclxuXHRcdFx0XHR0aGlzLnRhYkNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHQkKCcjJyArIHRhcmdldElkKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdCQodGhpcy50YWIpLmZpbHRlcignW2RhdGEtaWR+PVwiJyArIHRhcmdldElkICsnXCJdJykuY2xpY2soKTtcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdCdzaG93VGFic09uQ2xpY2snOiBmdW5jdGlvbihlbCwgZXYpIHtcclxuXHRcdFx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA8IDc4MyAmJiB0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ2pzLXRhYnMtLXZlcnRpY2FsJykpIHtcclxuXHRcdFx0XHRcdHRoaXMudGFic0xpc3Quc2xpZGVUb2dnbGUoJ2Zhc3QnKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYoJCh3aW5kb3cpLndpZHRoKCkgPCA5ODMgJiYgdGhpcy5lbGVtZW50Lmhhc0NsYXNzKCdqcy10YWJzLS12ZXJ0aWNhbC1sYXJnZScpKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRhYnNMaXN0LnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKCQod2luZG93KS53aWR0aCgpIDwgMTAwMyAmJiB0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoJ2pzLXRhYnMtLWhvcml6b250YWwnKSkge1xyXG5cdFx0XHRcdFx0dGhpcy50YWJzTGlzdC5zbGlkZVRvZ2dsZSgnZmFzdCcpO1xyXG5cdFx0XHRcdH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vINCc0LXRgtC+0LQg0LTQu9GPINCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutC+0LPQviDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0YLQsNCx0L7QslxyXG4gICAgICAgICAgICAndGFic0F1dG9Td2l0Y2gnOiBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZVRhYiA9IHRoaXMudGFiLmZpbHRlcignLmFjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZUNvbnRlbnQgPSB0aGlzLnRhYkNvbnRlbnQuZmlsdGVyKCcuYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgYWN0aXZlVGFiLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZVRhYi5uZXh0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVUYWIuaXMoJzpsYXN0LWNoaWxkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYi5lcSgwKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYWN0aXZlVGFiID0gdGhpcy50YWIuZmlsdGVyKCcuYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldElkID0gYWN0aXZlVGFiLmRhdGEoJ2lkJykuc3BsaXQoJyAnKVswXTtcclxuXHRcdFx0XHRhY3RpdmVDb250ZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHQkKCcjJyArIHRhcmdldElkKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG4gICAgQXBwLldpZGdldHMuV2lkZ2V0cyA9IEFwcC5XaWRnZXRzLldpZGdldHMgfHwge307XHJcbiAgICBBcHAuV2lkZ2V0cy5XaWRnZXRzLlplcm9SZXBvcnRpbmdPcmRlciA9IGNhbi5Db250cm9sLmV4dGVuZChcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsdWdpbk5hbWU6ICdhcHBQYXltZW50Rm9ybVplcm9Db250YWN0JyxcclxuICAgICAgICAgICAgZGVmYXVsdHM6IHtcclxuICAgICAgICAgICAgICAgIFpBVE9nYXRld2F5OiAnL2FqYXgvaW50ZXJmYWNlL3phdG8vJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZWxlbWVudC5maW5kKCdmb3JtJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1OYW1lID0gdGhpcy5mb3JtLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2F0ZXdheSA9IHRoaXMuZm9ybS5hdHRyKCdhY3Rpb24nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3RtQ2F0ZWdvcnkgPSB0aGlzLmZvcm0uYXR0cignZ3RtY2F0ZWdvcnknKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUZpbyA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fTkFNRVwiXScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtQ29tbWVudCA9IHRoaXMuZm9ybS5maW5kKCcqW2RhdGEtZmllbGR0eXBlPVwiRk9STV9DT01NRU5UXCJdJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1QaG9uZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fUEhPTkVcIl0nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUVtYWlsID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9FTUFJTFwiXScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waG9uZUJ1dCA9IHRoaXMuZm9ybS5maW5kKCcuanMtc2l0ZS1waG9uZS1hJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBheUJ1dCA9IHRoaXMuZm9ybS5maW5kKCcuanMtemNmMnBheScpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuS0lTRGlyZWN0aW9uID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9ESVJFQ1RJT05cIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuS0lTQ29tbWVudCA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIktJU19DT01NRU5UXCJdJykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRMb2FkRm9ybSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBHVE1wdXNoRXZlbnRMb2FkRm9ybSh0aGlzLmZvcm1OYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgIXRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZS1ub21zZycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbGlkYXRlKHdpbmRvdy5hcHBsaWNhdGlvbi52YWxpZGF0ZU9wdGlvbnNEZWZhdWx0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbGlkYXRlKHdpbmRvdy5hcHBsaWNhdGlvbi52YWxpZGF0ZU9wdGlvbnNOb01zZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9JUFwiXScpLnZhbChHZW8uaXApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9TRVJWSUNFXCJdJykudmFsKEFwcC5aZXJvV2ViRm9ybVZhbHVlcy5zZXJ2aWNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fUkVHSU9OXCJdJykudmFsKEdlby5yZWdpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjbGllbnRJRCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB3YVRyYWNrID09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGllbnRJRCA9IGdldEdBQ2xpZW50SUQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50SUQgPSB3YVRyYWNrLmNsaWVudElEO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9DSURcIl0nKS52YWwoY2xpZW50SUQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVRvdWNoRXZlbnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybSwgJ3N1Ym1pdCcsICdzdWJtaXRGb3JtJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybUZpbykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5mb3JtRmlvLCAnY2hhbmdlJywgJ2NoYW5nZU5hbWUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VOYW1lU2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtQ29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24odGhpcy5mb3JtQ29tbWVudCwgJ2NoYW5nZScsICdjaGFuZ2VDb21tZW50Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlQ29tbWVudFNlbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybVBob25lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLmZvcm1QaG9uZSwgJ2NoYW5nZScsICdjaGFuZ2VQaG9uZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZVBob25lU2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtRW1haWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybUVtYWlsLCAnY2hhbmdlJywgJ2NoYW5nZUVtYWlsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlRW1haWxTZW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBob25lQnV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbih0aGlzLnBob25lQnV0LCAnY2xpY2snLCAnY2xpY2tUZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VUZWxTZW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBheUJ1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZVBheVNlbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2xpY2tUZWw6IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uY2VUZWxTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX1RFTCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZVRlbFNlbmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hhbmdlTmFtZTogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5kYXRhKCd2YWxpZGF0ZScpICYmIHRoaXMub25jZU5hbWVTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX05BTUUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2VOYW1lU2VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGFuZ2VDb21tZW50OiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgdGhpcy5vbmNlQ29tbWVudFNlbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBHVE1wdXNoRXZlbnRUb3VjaEZvcm0odGhpcy5mb3JtTmFtZSwgdGhpcy5ndG1DYXRlZ29yeSwgJ0ZPUk1fQ09NTUVOVCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZUNvbW1lbnRTZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoYW5nZVBob25lOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgdGhpcy5vbmNlUGhvbmVTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX1BIT05FJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlUGhvbmVTZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoYW5nZUVtYWlsOiBmdW5jdGlvbiAoZWwsIGV2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgdGhpcy5vbmNlRW1haWxTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX0VNQUlMJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmNlRW1haWxTZW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZvcm1Ub3VjaEV2ZW50OiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLCBmb3JtSW5wdXRzID0gdGhpcy5mb3JtLmZpbmQoJzppbnB1dCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuZm9ybVRvdWNoID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9ybUlucHV0cy5vbignZm9jdXMnLCBzZW5kVG91Y2hFdmVudCk7XHJcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXRzLm9uKCdjaGFuZ2UnLCBzZW5kVG91Y2hFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gc2VuZFRvdWNoRXZlbnQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLmZvcm1Ub3VjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZvcm1Ub3VjaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1JbnB1dHMub2ZmKCdmb2N1cycsIHNlbmRUb3VjaEV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybUlucHV0cy5vZmYoJ2NoYW5nZScsIHNlbmRUb3VjaEV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRUb3VjaEZvcm0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHNlbGYuZm9ybU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc3VibWl0Rm9ybTogZnVuY3Rpb24gKGVsLCBldikge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgIXRoaXMuZm9ybS52YWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHVE1wdXNoRXZlbnRFcnJvckZvcm0gPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudEVycm9yRm9ybSh0aGlzLmZvcm1OYW1lLCB0aGlzLmd0bUNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5zdGFydFdhaXRpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLnBvc3QodGhpcy5nYXRld2F5LCB0aGlzLmZvcm0uc2VyaWFsaXplKCksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIH0sICdqc29uJylcclxuICAgICAgICAgICAgICAgICAgICAuZG9uZSh0aGlzLnByb3h5KCdkb25lU3VibWl0JykpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZhaWwodGhpcy5wcm94eSgnZmFpbFN1Ym1pdCcpKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkb25lU3VibWl0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4cG9ydEZpZWxkc1pBVE8oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEdUTXB1c2hFdmVudFNlbmRGb3JtID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdUTXB1c2hFdmVudFNlbmRGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3goe1xyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBDU1M6ICdtb2RhbC13cmFwcGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICgkKHdpbmRvdykud2lkdGgoKSA+IDkzNykgPyAyMCA6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVscGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50JzogJChyZXMuaHRtbClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZmFpbFN1Ym1pdDogZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgR1RNcHVzaEV2ZW50RXJyb3JGb3JtID09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHRcdFx0R1RNcHVzaEV2ZW50RXJyb3JGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnkpO1xyXG5cdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5odG1sKCQocmVzLnJlc3BvbnNlVGV4dCkuaHRtbCgpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZWxlbWVudC5maW5kKCdmb3JtJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhdGV3YXkgPSB0aGlzLmZvcm0uYXR0cignYWN0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKHRoaXMuZm9ybSwgJ3N1Ym1pdCcsICdzdWJtaXRGb3JtJyk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAgICAgLyogQHRvZG86IGV4cG9ydEZpZWxkc1pBVE8g0LTRg9Cx0LvQuNGA0YPQtdGC0YHRjywg0YHQtNC10LvQsNGC0Ywg0LLQvdC10YjQvdC40LkganMt0LzQtdGC0L7QtCAqL1xyXG4gICAgICAgICAgICBleHBvcnRGaWVsZHNaQVRPOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBTdWJtaXRTZW5kZXIyTWFpbDJDVCA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignd2FUcmFjayBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLktJU0RpcmVjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFpBVE9UeXBlRm9ybSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRvZG86INCf0L7Rh9C10LzRgyDQvtGC0LrQu9GO0YfQuNC7INGA0LXQs9C40L7QvSDQt9C00LXRgdGMPyBaQVRPINC/0YDQuNC90LjQvNCw0LXRgiDRgNC10LPQuNC+0L0/XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0ubmFtZSA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fTkFNRVwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0ucGhvbmUgPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1BIT05FXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5kaXJlY3Rpb24gPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0RJUkVDVElPTlwiXScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1pBVE9UeXBlRm9ybS5uYW1lID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9SRUdJT05cIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNsaWVudElkID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9DSURcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmluVXJsID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9VUkxcIl0nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmVtYWlsID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0W2RhdGEtZmllbGR0eXBlPVwiRk9STV9FTUFJTFwiXScpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgWkFUT1R5cGVGb3JtLmNvbW1lbnQgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuS0lTQ29tbWVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFpBVE9UeXBlRm9ybS5jb21tZW50ICs9IHRoaXMuS0lTQ29tbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9ybS5maW5kKCcqW2RhdGEtZmllbGR0eXBlPVwiRk9STV9DT01NRU5UXCJdJykudmFsKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBaQVRPVHlwZUZvcm0uY29tbWVudCArPSAnICcgKyB0aGlzLmZvcm0uZmluZCgnKltkYXRhLWZpZWxkdHlwZT1cIkZPUk1fQ09NTUVOVFwiXScpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy92YXIgWkFUT0RhdGFPYmogPSB3YVRyYWNrLlpBVE9EYXRhKFpBVE9UeXBlRm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBaQVRPRGF0YU9iaiA9IFN1Ym1pdFNlbmRlcjJNYWlsMkNUKFpBVE9UeXBlRm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coWkFUT0RhdGFPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgQ29udGV4dCA9IHtaQVRPOiBaQVRPRGF0YU9ian07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLnBvc3QodGhpcy5vcHRpb25zLlpBVE9nYXRld2F5LCBDb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICcuanMtemNmMnBheSBjbGljayc6IGZ1bmN0aW9uIChlbCwgZXYpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfbmFtZScsIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fTkFNRVwiXScpLnZhbCgpKTtcclxuICAgICAgICAgICAgICAgIENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc19waG9uZScsIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fUEhPTkVcIl0nKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfZW1haWwnLCB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX0VNQUlMXCJdJykudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5zZXQoJ1plcm9XZWJGb3JtVmFsdWVzX2lubicsIHRoaXMuZm9ybS5maW5kKCdpbnB1dFtkYXRhLWZpZWxkdHlwZT1cIkZPUk1fSU5OXCJdJykudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5zZXQoJ1plcm9XZWJGb3JtVmFsdWVzX3NlcnZpY2UnLCB0aGlzLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1maWVsZHR5cGU9XCJGT1JNX1NFUlZJQ0VcIl0nKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfY29tbWVudCcsIHRoaXMuZm9ybS5maW5kKCcqW2RhdGEtZmllbGR0eXBlPVwiRk9STV9DT01NRU5UXCJdJykudmFsKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uY2VQYXlTZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR1RNcHVzaEV2ZW50VG91Y2hGb3JtKHRoaXMuZm9ybU5hbWUsIHRoaXMuZ3RtQ2F0ZWdvcnksICdGT1JNX1BBWScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jZVBheVNlbmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb3JtLmRhdGEoJ3ZhbGlkYXRlJykgJiYgIXRoaXMuZm9ybS52YWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59KGpRdWVyeSkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMgPSBBcHAuV2lkZ2V0cy5XaWRnZXRzIHx8IHt9O1xyXG5cdEFwcC5XaWRnZXRzLldpZGdldHMuWmVyb1JlcG9ydGluZ09yZGVyID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0WmVyb1JlcG9ydGluZ09yZGVyJyxcclxuXHRcdFx0ZGVmYXVsdHM6IHt9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5vcHRpb24gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXplcm8tcmVwb3J0aW5nLW9yZGVyX19vcHRpb24nKTtcclxuXHRcdFx0XHR0aGlzLm9wdGlvblByaWNlID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy16ZXJvLXJlcG9ydGluZy1vcmRlcl9fb3B0aW9uLXByaWNlJyk7XHJcblx0XHRcdFx0dGhpcy50b3RhbFByaWNlID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy16ZXJvLXJlcG9ydGluZy1vcmRlcl9fdG90YWwtcHJpY2UnKTtcclxuXHJcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0XHR0aGlzLm9wdGlvbi5vbignaWZDaGVja2VkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIgbmV3VG90YWxQcmljZSA9ICtzZWxmLnRvdGFsUHJpY2UudGV4dCgpO1xyXG5cdFx0XHRcdFx0dmFyIGNoZWNrZWRQcmljZSA9ICskKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKHNlbGYub3B0aW9uUHJpY2UpLmZpbmQoJ3NwYW4nKS50ZXh0KCk7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0UHJpY2UgPSBuZXdUb3RhbFByaWNlICsgY2hlY2tlZFByaWNlO1xyXG5cclxuXHRcdFx0XHRcdHNlbGYudG90YWxQcmljZS50ZXh0KHJlc3VsdFByaWNlKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgcHJvcCA9ICQodGhpcykuZGF0YSgncHJvcCcpO1xyXG5cdFx0XHRcdFx0dmFyIHZhbCA9ICQodGhpcykuZGF0YSgndmFsJyk7XHJcblx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXNbcHJvcF0gPSB2YWw7XHJcblx0XHRcdFx0XHRDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfJytwcm9wLHZhbCk7XHJcblxyXG5cdFx0XHRcdFx0QXBwLlplcm9XZWJGb3JtVmFsdWVzLnN1bW0gPSByZXN1bHRQcmljZTtcclxuXHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zdW1tJyxyZXN1bHRQcmljZSk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHRoaXMub3B0aW9uLm9uKCdpZlVuY2hlY2tlZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIG5ld1RvdGFsUHJpY2UgPSArc2VsZi50b3RhbFByaWNlLnRleHQoKTtcclxuXHRcdFx0XHRcdHZhciB1bmNoZWNrZWRQcmljZSA9ICskKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKHNlbGYub3B0aW9uUHJpY2UpLmZpbmQoJ3NwYW4nKS50ZXh0KCk7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0UHJpY2UgPSBuZXdUb3RhbFByaWNlIC0gdW5jaGVja2VkUHJpY2U7XHJcblxyXG5cdFx0XHRcdFx0c2VsZi50b3RhbFByaWNlLnRleHQocmVzdWx0UHJpY2UpO1xyXG5cclxuXHRcdFx0XHRcdHZhciBwcm9wID0gJCh0aGlzKS5kYXRhKCdwcm9wJyk7XHJcblx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXNbcHJvcF0gPSAnJztcclxuXHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc18nK3Byb3AsJycpO1xyXG5cclxuXHRcdFx0XHRcdEFwcC5aZXJvV2ViRm9ybVZhbHVlcy5zdW1tID0gcmVzdWx0UHJpY2U7XHJcblx0XHRcdFx0XHRDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc3VtbScscmVzdWx0UHJpY2UpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLlplcm9SZXBvcnRpbmdQYXltZW50ID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0WmVyb1JlcG9ydGluZ1BheW1lbnQnLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbiA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtemVyby1yZXBvcnRpbmctcGF5bWVudF9fb3B0aW9uJyk7XHJcblx0XHRcdFx0dGhpcy5leHRyYU9wdGlvbnMgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXplcm8tcmVwb3J0aW5nLXBheW1lbnRfX2V4dHJhLW9wdGlvbnMnKTtcclxuXHRcdFx0XHR0aGlzLnByaWNpbmdQbGFuID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy16ZXJvLXJlcG9ydGluZy1wYXltZW50X19wcmljaW5nLXBsYW4nKTtcclxuXHRcdFx0XHR0aGlzLmRpc2NvdW50ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy16ZXJvLXJlcG9ydGluZy1wYXltZW50X19kaXNjb3VudCcpO1xyXG5cdFx0XHRcdHRoaXMubm9EaXNjb3VudHMgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXplcm8tcmVwb3J0aW5nLXBheW1lbnRfX2Rpc2NvdW50LS16ZXJvJyk7XHJcblx0XHRcdFx0dGhpcy5vcHRpb25QcmljZSA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtemVyby1yZXBvcnRpbmctcGF5bWVudF9fb3B0aW9uLXByaWNlJyk7XHJcblx0XHRcdFx0dGhpcy50b3RhbFByaWNlID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy16ZXJvLXJlcG9ydGluZy1wYXltZW50X190b3RhbC1wcmljZScpO1xyXG5cdFx0XHRcdHRoaXMudG90YWxQcmljZU51bSA9ICt0aGlzLnRvdGFsUHJpY2UudmFsKCk7XHJcblxyXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdFx0Ly8g0JLRi9Cx0L7RgCDRg9GB0LvRg9Cz0LggLSBcItCf0LDQutC10YJcIiDQuNC70LggXCLQmtC+0LzRhNC+0YDRglwiXHJcblx0XHRcdFx0dGhpcy5wcmljaW5nUGxhbi5vbignaWZDaGVja2VkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzZWxmLnRvdGFsUHJpY2VOdW0gPSArJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncyhzZWxmLm9wdGlvblByaWNlKS5maW5kKCdzcGFuJykudGV4dCgpO1xyXG5cdFx0XHRcdFx0c2VsZi50b3RhbFByaWNlLnZhbChzZWxmLnRvdGFsUHJpY2VOdW0pO1xyXG5cdFx0XHRcdFx0QXBwLlplcm9XZWJGb3JtVmFsdWVzLnN1bW0gPSBzZWxmLnRvdGFsUHJpY2VOdW07XHJcblx0XHRcdFx0XHRDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc3VtbScsc2VsZi50b3RhbFByaWNlTnVtKTtcclxuXHJcblxyXG5cdFx0XHRcdFx0c2VsZi5kaXNjb3VudC5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XHJcblx0XHRcdFx0XHRcdCQodGhpcykuaUNoZWNrKCd1bmNoZWNrJyk7XHJcblx0XHRcdFx0XHRcdC8vc2VsZi5ub0Rpc2NvdW50cy5pQ2hlY2soJ2NoZWNrJyk7XHJcblx0XHRcdFx0XHRcdGlmIChBcHAuWmVyb1dlYkZvcm1WYWx1ZXMuc2FsZV9jb2RlKSB7XHJcblx0XHRcdFx0XHRcdFx0c2VsZi5lbGVtZW50LmZpbmQoJyMnK0FwcC5aZXJvV2ViRm9ybVZhbHVlcy5zYWxlX2NvZGUpLmlDaGVjaygnY2hlY2snKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRzZWxmLm5vRGlzY291bnRzLmlDaGVjaygnY2hlY2snKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cclxuXHRcdFx0XHRcdHNlbGYub3B0aW9uLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcclxuXHRcdFx0XHRcdFx0JCh0aGlzKS5pQ2hlY2soJ3VuY2hlY2snKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoJ2pzLXplcm8tcmVwb3J0aW5nLXBheW1lbnRfX3ByaWNpbmctcGxhbi0tY29tZm9ydCcpKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuZXh0cmFPcHRpb25zLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXMuc2VydmljZSA9ICfQn9Cw0LrQtdGCIFwi0JrQvtC80YTQvtGA0YJcIic7XHJcblx0XHRcdFx0XHRcdEFwcC5aZXJvV2ViRm9ybVZhbHVlcy5zZXJ2aWNlX2NvZGUgPSAyO1xyXG5cdFx0XHRcdFx0XHRDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc2VydmljZScsJ9Cf0LDQutC10YIgXCLQmtC+0LzRhNC+0YDRglwiJyk7XHJcblx0XHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zZXJ2aWNlX2NvZGUnLDIpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5leHRyYU9wdGlvbnMuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcblx0XHRcdFx0XHRcdEFwcC5aZXJvV2ViRm9ybVZhbHVlcy5zZXJ2aWNlID0gJ9Cf0LDQutC10YIgXCLQrdC60L7QvdC+0LxcIic7XHJcblx0XHRcdFx0XHRcdEFwcC5aZXJvV2ViRm9ybVZhbHVlcy5zZXJ2aWNlX2NvZGUgPSAxO1xyXG5cdFx0XHRcdFx0XHRDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc2VydmljZScsJ9Cf0LDQutC10YIgXCLQrdC60L7QvdC+0LxcIicpO1xyXG5cdFx0XHRcdFx0XHRDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc2VydmljZV9jb2RlJywxKTtcclxuXHJcblx0XHRcdFx0XHRcdEFwcC5aZXJvV2ViRm9ybVZhbHVlcy5vcHRpb25zX2VsZWN0cm9uID0gJyc7XHJcblx0XHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc19vcHRpb25zX2VsZWN0cm9uJywnJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXMub3B0aW9uc19jb3VyaWVyID0gJyc7XHJcblx0XHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc19vcHRpb25zX2NvdXJpZXInLCcnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8g0JLRi9Cx0L7RgCDQstC40LTQsCDRgdC60LjQtNC60LhcclxuXHRcdFx0XHR0aGlzLmRpc2NvdW50Lm9uKCdpZkNoZWNrZWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBjaGVja2VkRGlzY291bnQgPSAkKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKHNlbGYub3B0aW9uUHJpY2UpLmZpbmQoJ3NwYW4nKS50ZXh0KCkgLyAxMDA7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0UHJpY2UgPSBzZWxmLnRvdGFsUHJpY2VOdW0gLSBzZWxmLnRvdGFsUHJpY2VOdW0gKiBjaGVja2VkRGlzY291bnQ7XHJcblxyXG5cdFx0XHRcdFx0c2VsZi5vcHRpb24ucGFyZW50KCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xyXG5cdFx0XHRcdFx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKCdjdXN0b20tY2hlY2tib3gtLWNoZWNrZWQnKSkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvcHRpb25QcmljZSA9ICskKHRoaXMpLnNpYmxpbmdzKHNlbGYub3B0aW9uUHJpY2UpLmZpbmQoJ3NwYW4nKS50ZXh0KCk7XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0UHJpY2UgPSByZXN1bHRQcmljZSArIG9wdGlvblByaWNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRzZWxmLnRvdGFsUHJpY2UudmFsKHJlc3VsdFByaWNlKTtcclxuXHRcdFx0XHRcdEFwcC5aZXJvV2ViRm9ybVZhbHVlcy5zdW1tID0gcmVzdWx0UHJpY2U7XHJcblx0XHRcdFx0XHRDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc3VtbScscmVzdWx0UHJpY2UpO1xyXG5cclxuXHJcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5hdHRyKCdpZCcpICYmICQodGhpcykuYXR0cignaWQnKSAhPT0gJ25vLWRpc2NvdW50cycpIHtcclxuXHRcdFx0XHRcdFx0QXBwLlplcm9XZWJGb3JtVmFsdWVzLnNhbGUgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXMuc2FsZV9jb2RlID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xyXG5cdFx0XHRcdFx0XHRDb29raWVzLnNldCgnWmVyb1dlYkZvcm1WYWx1ZXNfc2FsZScsJCh0aGlzKS52YWwoKSk7XHJcblx0XHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zYWxlX2NvZGUnLCQodGhpcykuYXR0cignaWQnKSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXMuc2FsZSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXMuc2FsZV9jb2RlID0gJyc7XHJcblx0XHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zYWxlJywnJyk7XHJcblx0XHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zYWxlX2NvZGUnLCcnKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvLyDQktGL0LHQvtGAINC00L7Qv9C+0LvQvdC40YLQtdC70YzQvdGL0YUg0L7Qv9GG0LjQuSDQuiDQv9Cw0LrQtdGC0YMgXCLQmtC+0LzRhNC+0YDRglwiXHJcblx0XHRcdFx0dGhpcy5vcHRpb24ub24oJ2lmQ2hlY2tlZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIG5ld1RvdGFsUHJpY2UgPSArc2VsZi50b3RhbFByaWNlLnZhbCgpO1xyXG5cdFx0XHRcdFx0dmFyIGNoZWNrZWRQcmljZSA9ICskKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKHNlbGYub3B0aW9uUHJpY2UpLmZpbmQoJ3NwYW4nKS50ZXh0KCk7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0UHJpY2UgPSBuZXdUb3RhbFByaWNlICsgY2hlY2tlZFByaWNlO1xyXG5cclxuXHRcdFx0XHRcdHNlbGYudG90YWxQcmljZS52YWwocmVzdWx0UHJpY2UpO1xyXG5cdFx0XHRcdFx0QXBwLlplcm9XZWJGb3JtVmFsdWVzLnN1bW0gPSByZXN1bHRQcmljZTtcclxuXHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc19zdW1tJyxyZXN1bHRQcmljZSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIG9wdE5hbWUgPSAkKHRoaXMpLmRhdGEoJ29wdC1uYW1lJyk7XHJcblxyXG5cdFx0XHRcdFx0QXBwLlplcm9XZWJGb3JtVmFsdWVzW29wdE5hbWVdID0gJ1knO1xyXG5cdFx0XHRcdFx0Q29va2llcy5zZXQoJ1plcm9XZWJGb3JtVmFsdWVzXycrb3B0TmFtZSwnWScpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLm9wdGlvbi5vbignaWZVbmNoZWNrZWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBuZXdUb3RhbFByaWNlID0gK3NlbGYudG90YWxQcmljZS52YWwoKTtcclxuXHRcdFx0XHRcdHZhciB1bmNoZWNrZWRQcmljZSA9ICskKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKHNlbGYub3B0aW9uUHJpY2UpLmZpbmQoJ3NwYW4nKS50ZXh0KCk7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0UHJpY2UgPSBuZXdUb3RhbFByaWNlIC0gdW5jaGVja2VkUHJpY2U7XHJcblxyXG5cdFx0XHRcdFx0c2VsZi50b3RhbFByaWNlLnZhbChyZXN1bHRQcmljZSk7XHJcblx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXMuc3VtbSA9IHJlc3VsdFByaWNlO1xyXG5cdFx0XHRcdFx0Q29va2llcy5zZXQoJ1plcm9XZWJGb3JtVmFsdWVzX3N1bW0nLHJlc3VsdFByaWNlKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgb3B0TmFtZSA9ICQodGhpcykuZGF0YSgnb3B0LW5hbWUnKTtcclxuXHJcblx0XHRcdFx0XHRBcHAuWmVyb1dlYkZvcm1WYWx1ZXNbb3B0TmFtZV0gPSAnJztcclxuXHRcdFx0XHRcdENvb2tpZXMuc2V0KCdaZXJvV2ViRm9ybVZhbHVlc18nK29wdE5hbWUsJycpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLnNldFN0YXJ0VmFscygpO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0c2V0U3RhcnRWYWxzOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0aWYgKEFwcC5aZXJvV2ViRm9ybVZhbHVlcy5zZXJ2aWNlX2NvZGUgJiYgQXBwLlplcm9XZWJGb3JtVmFsdWVzLnNlcnZpY2VfY29kZSA9PSAyKSB7XHJcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzLXplcm8tcmVwb3J0aW5nLXBheW1lbnRfX3ByaWNpbmctcGxhbi0tY29tZm9ydCcpLmlDaGVjaygnY2hlY2snKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoQXBwLlplcm9XZWJGb3JtVmFsdWVzLm9wdGlvbnNfZWxlY3Ryb24gJiYgQXBwLlplcm9XZWJGb3JtVmFsdWVzLm9wdGlvbnNfZWxlY3Ryb24gPT0gJ1knKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCcjemVyby1yZXBvcnRpbmctc2VuZGluZycpLmlDaGVjaygnY2hlY2snKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoQXBwLlplcm9XZWJGb3JtVmFsdWVzLm9wdGlvbnNfY291cmllciAmJiBBcHAuWmVyb1dlYkZvcm1WYWx1ZXMub3B0aW9uc19jb3VyaWVyID09ICdZJykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnI3plcm8tcmVwb3J0aW5nLWNvdXJpZXInKS5pQ2hlY2soJ2NoZWNrJyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdGlmIChBcHAuWmVyb1dlYkZvcm1WYWx1ZXMuc2FsZV9jb2RlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnIycrQXBwLlplcm9XZWJGb3JtVmFsdWVzLnNhbGVfY29kZSkuaUNoZWNrKCdjaGVjaycpO1xyXG5cdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KTtcclxufShqUXVlcnkpKTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzID0gQXBwLldpZGdldHMuV2lkZ2V0cyB8fCB7fTtcclxuXHRBcHAuV2lkZ2V0cy5XaWRnZXRzLlplcm9SZXBvcnRpbmdUZXN0ID0gY2FuLkNvbnRyb2wuZXh0ZW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRwbHVnaW5OYW1lOiAnYXBwV2lkZ2V0WmVyb1JlcG9ydGluZ1Rlc3QnLFxyXG5cdFx0XHRkZWZhdWx0czoge31cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0XHR0aGlzLiRxdWVzdGlvbnMgPSB0aGlzLmVsZW1lbnQuZmluZCgnLnRlc3QtcXVlc3Rpb25zIGxpJyk7XHJcblx0XHRcdFx0dGhpcy4kYW5zd2VycyA9IHRoaXMuZWxlbWVudC5maW5kKCcuanMtemVyby1yZXBvcnRpbmctdGVzdF9fYW5zd2VyJyk7XHJcblx0XHRcdFx0dGhpcy4kYnRuID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qcy16ZXJvLXJlcG9ydGluZy10ZXN0X19idG4nKTtcclxuXHJcblx0XHRcdFx0dGhpcy4kYW5zd2Vycy5vbignaWZDaGVja2VkJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBlbXB0eUFuc3dlciA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0dmFyIHRlc3RSZXN1bHQgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0XHRzZWxmLiRxdWVzdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGlmICghJCh0aGlzKS5maW5kKCdpbnB1dDpyYWRpbycpLmlzKCc6Y2hlY2tlZCcpKVxyXG5cdFx0XHRcdFx0XHRcdGVtcHR5QW5zd2VyID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCQodGhpcykuZmluZCgnaW5wdXQ6cmFkaW86Y2hlY2tlZCcpLnZhbCgpID09ICd0cnVlJylcclxuXHRcdFx0XHRcdFx0XHRcdHRlc3RSZXN1bHQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFlbXB0eUFuc3dlcikge1xyXG5cdFx0XHRcdFx0XHRzZWxmLiRidG4ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdFx0XHRcdGlmICh0ZXN0UmVzdWx0KVxyXG5cdFx0XHRcdFx0XHRcdHNlbGYuJGJ0bi5hdHRyKCdocmVmJywgJyNuby16ZXJvLXJlcG9ydGluZycpO1xyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0c2VsZi4kYnRuLmF0dHIoJ2hyZWYnLCAnI3plcm8tcmVwb3J0aW5nJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpO1xyXG59KGpRdWVyeSkpOyJdfQ==
