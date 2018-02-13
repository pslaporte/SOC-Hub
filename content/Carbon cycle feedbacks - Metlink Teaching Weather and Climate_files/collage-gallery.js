(function ($) {

    $.fn.collageGallery = function () {

        if (!$(this).length)
            return false;

        this.each(function (e) {
            var ugData = {};

            var ugSettings = $(this).data('ug');
            if (typeof ugSettings !== 'undefined') {
                ugData = $.extend({}, ugDefaults, ugSettings);
            }
            else
                ugData = ugDefaults;

            $(this).justifiedGallery(ugData);
            $(this).justifiedGallery().on('jg.complete', function (e) {
                captionsLineHeight($(this), ugData);
                //console.log('Complete');
            });

        });


        function captionsLineHeight(container, ugData) {
            var captions = container.find('.caption');
            if (captions) {
                var lineHeight = 0;

                $.each(captions, function () {

                    if (!lineHeight) {
                        var captionCSS = {
                            top: Math.round(parseInt($(this).css('padding-top'))) || 0,
                            bottom: Math.round(parseInt($(this).css('padding-bottom'))) || 0,
                            lineHeight: Math.round(parseInt($(this).css('line-height'))) || 0,
                            boxSizing: $(this).css('box-sizing') || ''
                        };

                        lineHeight = captionCSS.lineHeight * ugData.lineHeight;

                        if (captionCSS.boxSizing != 'content-box') {
                            lineHeight = lineHeight + captionCSS.top + captionCSS.bottom;
                        }

                        lineHeight = lineHeight + 'px';

                    }

                    $(this).css('max-height', lineHeight);


                });
            }
        }

    };
})(jQuery);