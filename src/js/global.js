/**
 * Created by treen on 03/09/2016.
 */
jQuery(document).ready(function ($) {
    var textEditor = $('#bbp_topic_content');

    // Onsubmit, parse datas and populate fields
    $('#bbpcs').on('click', 'button#scanparser', function (e) {
        e.preventDefault();
        var currentVal = $('#support_parser').val();
        var items = parse_item(currentVal);
        $.each(items, function (key, value) {
            $('[data-id="' + key + '"]').val(value);
            if (key !== 'uri' && key !== 'host') {
                $('[data-id="' + key + '"]').prop('readonly', true);
            }
            $('.bbpcs__summary__list__item--' + key + '> .bbpcs__summary__list__item__version').text(value)
        });
        $('.bbpcs__panel__content').hide();
        $('.bbpcs__summary').show();
        switch_editor('show');
    });

    // When chaings inputs content, update summary
    $('.bbpcs__panel__content__input').on('input', function () {
        if ($(this).val() === '') {
            switch_editor('hide');
            return;
        } else {
            $('.bbpcs__summary').show();
            switch_editor('show');
        }
        var inputId = $('.bbpcs__summary__list__item--' + $(this).data('id'));
        inputId.find('.bbpcs__summary__list__item__version').text($(this).val());

    });

    // Panel management
    $('.bbpcs__panel__headers__title').click(function () {
        var panel_prefix = '#bbpcs_panel_';
        var panel = panel_prefix + $(this).data('panel');
        $('.bbpcs__panel__content').hide();
        $('.bbpcs__panel__headers__title').removeClass('active');
        $(panel).fadeIn();
        $(this).addClass('active');
    });

    /*
     * Function to parse and transform textarea string to object
     * todo: Change plugin to return normalized keys
     * */
    function parse_item(datas) {
        var matches;
        var output = {};
        var pattern = '^- (.*) : (.*)$';
        var regex = new RegExp(pattern);
        datas = datas.split('\n');
        datas.forEach(function (item) {
            if (regex.test(item)) {
                matches = item.match(pattern);
                switch (matches[1]) {
                    case 'Version de WordPress':
                        output['wp_version'] = matches[2];
                        break;
                    case 'Version de PHP/MySQL':
                        var php_mysql = matches[2].split(' / ');
                        output['php_version'] = php_mysql[0];
                        output['mysql_version'] = php_mysql[1];
                        break;
                    case 'Thème utilisé':
                        output['theme_name'] = matches[2];
                        break;
                    case 'Thème URI':
                        output['theme_uri'] = matches[2];
                        break;
                    case 'Extensions en place':
                        output['plugins'] = matches[2];
                        break;
                    case 'Adresse du site':
                        output['uri'] = matches[2];
                        break;
                    case 'Nom de l\'hébergeur':
                        output['host'] = matches[2];
                        break;
                }
            }
        });
        return output;

    }

    function switch_editor(mode) {
        if (mode === 'show') {
            textEditor.text('');
            textEditor.prop('disabled', false);
            textEditor.parent().css('opacity', 1);
            $('.bbpcs__container .bbpcs__alert').remove();
            $('.bbp-form').show();
            return true;
        } else {
            $('.bbpcs__container').prepend('<div class="bbpcs__alert bbpcs__alert--warning text-center">' + bbpcs_alert_empty_form + '</div>');
            $('.bbp-form').hide();
            return false;
        }
    }

    if (!$('#support_wp_version').val()) {
        switch_editor('hide');
    } else {
        switch_editor('show');
    }

});