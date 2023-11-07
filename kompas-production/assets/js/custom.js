$(function() {
    var scrollTo = function(elm) {
        if (elm.length !== 0) {
            $('html, body').stop().animate({
                scrollTop: elm.offset().top
            }, 500);
        }
    };
    var $menuElm = $('#menu');
    var $slideIntro = $('.slideIntro');
    var navCheck = function() {
        if ($slideIntro.height() - $(window).scrollTop() > 0) {
            if ($menuElm.hasClass('inverse')) {
                $menuElm.removeClass('inverse');
            }
        } else {
            $menuElm.addClass('inverse');
        }
    };
    $menuElm.fadeIn(200);
    navCheck();
    $(window).on('scroll', navCheck);
    $('a').on('click', function(e) {
        var $elm = $(this);
        if ($elm.hasClass('disabled')) {
            return false;
        }
        var href = $elm.attr('href').substr(1);
        $pageElm = $('.section[data-page="' + href + '"]');
        if ($pageElm.length === 0) {
            return;
        }
        e.preventDefault();
        scrollTo($pageElm);
    });
    var $msgElm = $('#contact-msg');
    var submitMsg = function(type, msg) {
        switch (type) {
            case 'error':
                $msgElm.addClass('error').html('<i class="fa fa-exclamation-triangle fa-fw"></i> <strong>Error:</strong> ' + msg);
                break;
            case 'success':
                $msgElm.addClass('success').html('<i class="fa fa-smile-o fa-fw"></i> ' + msg);
                break;
            case 'clear':
                $msgElm.removeClass('error').html('');
                break;
        }
    };
    $('.contact-form').on('submit', function(e) {
        e.preventDefault();
        submitMsg('clear');
        var $btn = $('#contact-submit');
        var name = $.trim($('#contact-name').val());
        var email = $.trim($('#contact-email').val());
        var subject = $.trim($('#contact-subject').val());
        var message = $.trim($('#contact-message').val());
        if (name == '' || email == '' || subject == '' || message == '') {
            submitMsg('error', 'Please enter your name, Your email &amp; Your message');
            return;
        }
        if (grecaptcha.getResponse() === '') {
            submitMsg('error', 'Please complete the CAPTCHA');
            return;
        }
        $btn.prop('disabled', true);
        $.post('mail.php', {
            name: name,
            email: email,
            subject: subject,
            message: message,
            captcha: grecaptcha.getResponse()
        }, function(data) {
            if (data.status === 'ok') {
                submitMsg('success', 'Email sent!');
            } else {
                submitMsg('error', data.msg);
                $btn.prop('disabled', false);
            }
        });
    });
});