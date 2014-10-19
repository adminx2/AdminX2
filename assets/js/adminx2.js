// Requirements for displaying dataTables
var dataTablesPath = "/assets/plugins/datatables/jquery.dataTables.min.js";
// Requirements for displaying a morris chart.
var morrisRequirements = [
    "/assets/plugins/morris/raphael-min.js",
    "/assets/plugins/morris/morris.js"
];
var ckEditorRequirements = '/assets/plugins/ckeditor/ckeditor.js';
(function() {
    window.charts = new Array();
    this.loadScript = function(src) {
        $.ajax({
            url: src,
            async: false,
            dataType: "script"
        });
    }
    this.insertScript = function(src) {
        var script = document.createElement('script');

        script.async = false;
        script.src = src;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    /**
     * Verifies if a script is added and if not injects it into the page.
     * Allows libraries to be automatically loaded in where necessary.
     * 
     * @param string src
     * @param function test
     * @returns nothing
     */
    this.addScript = function(src, test) {
        var scriptExists = false;
        if (typeof test == 'function'){
            scriptExists = true;
        }
        // jQuery function to use jqueries check
        
        //if ((typeof test == 'function') == false || isNullOrUndefined(test)) {
        if (!$.isFunction(test))
            if (typeof src === 'string') {

                $('head').append('<script src="' + src + '"></script>');
                //insertScript(src);
                //loadScript(src)
            } else {
                // Means an array is being passed.
                for (i = 0; i < src.length; i++) {
                    //insertScript(src[i]);
                    $('head').append('<script src="' + src[i] + '"></script>');
                }
            }
        }
    

    /**
     * Returns true if the object is null or undefined. Just serves as a 
     * simple short hand function.
     * 
     * @param {Object} obj
     * @returns {Boolean}
     */
    this.isNullOrUndefined = function(obj) {
        try {
            return (obj == null || obj == 'undefined')
        } catch (err) {
            // Not interested in catching an error. Just in case a browser
            // throws an error return true.
            return true;
        }
    }

    /**
     * Setup the UI buttons to serve their various purposes.
     * 
     * @returns nothing
     */
    this.configureUiButtons = function() {
        $('.box .close-btn').click(function() {
            event.preventDefault();
            $(this).parent().parent().slideUp('fast', function() {

                $(this).parent().parent().remove();
            });
        });
        $('.box .reload-btn').click(function() {
            event.preventDefault();
            var reloadUrl = $(this).attr('data-url');
            var reloadTarget = $(this).attr('data-target');
            // Grab and store in a localized variable to keep it in scope
            // during ajax call.
            var baseElem = $(this);
            if (!isNullOrUndefined(reloadUrl) && reloadUrl != '') {
                var elem = null;
                if (isNullOrUndefined(reloadTarget)) {
                    elem = $(baseElem).parent().parent().parent().find('.content');
                } else {
                    elem = $(reloadTarget);
                }

                loadContent(elem, reloadUrl, true)
            }
        });
        $('.box .collapse-btn').click(function() {
            var baseElem = $(this).find('.fa');
            var elem = $(this).parent().parent().parent().find('.content');
            if (!isNullOrUndefined(elem)) {
                if (elem.is(':visible')) {
                    baseElem.addClass('icon-up-open-big');
                    baseElem.removeClass('icon-down-open-big');
                    elem.slideUp('fast');
                } else {
                    baseElem.removeClass('icon-up-open-big');
                    baseElem.addClass('icon-down-open-big');
                    elem.slideDown('fast');
                }
            }
        });
    }

    /**
     * Finds the first box element as parent.
     * @returns element
     */
    this.findBox = function(baseElem) {
        var elemParent = baseElem.parent();
        if (elemParent.hasClass('box')) {

            return elemParent;
        } else {
            while (!elemParent.hasClass('box') && !isNullOrUndefined(elemParent)) {

                elemParent = elemParent.parent();
            }
        }
        if (elemParent.hasClass('box')) {
            return elemParent;
        }
        return null;
    }

    /**
     * Loads content into the designated element from the designated url.
     * @returns nothing
     */
    this.loadContent = function(elem, dataRefreshUrl, loader) {
        if (loader == true) {
            var box = findBox(elem);
            if (box != null) {
                box.append('<div class="loader"></div>');
            }
        }
        $.ajax({
            url: dataRefreshUrl,
            type: 'get',
            timeout: 4000,
            success: function(result) {
                elem.html(result);
                if (box != null) {
                    box.find('.loader').remove();
                }
            }
        })
    }

    /**
     * Turns textareas with ckeditor class into ckeditors
     * @returns nothing
     */
    this.createCKEditor = function() {
        if ($('.ckeditor').length) {
            addScript(ckEditorRequirements, 'CKEditor')
        }
    }

    /**
     * Creates timed functions which occur at specific intervals that 
     * automatically refresh data.
     * 
     * [NOTE] This can cause some load on the server, especially if there are
     * many active users and if the data being retreived is larger or involes
     * database queries (Especially more complex database queries). As such
     * this functionality should be used sparingly to avoid a heavy hit on the
     * server.
     * 
     * @returns nothing
     */
    this.createTimedRefresh = function() {
        $('div[data-refresh="true"]').each(function() {
            var dataRefreshTarget = $(this).attr('data-target');
            var dataRefreshSpeed = $(this).attr('data-refresh-speed');
            var dataRefreshUrl = $(this).attr('data-url');
            var dataAutoLoad = $(this).attr('data-autoload')
            if (!isNullOrUndefined(dataRefreshUrl)) {
                if (isNullOrUndefined(dataRefreshSpeed)) {
                    dataRefreshSpeed = 5000;
                }
                var elem = null;
                if (isNullOrUndefined(dataRefreshTarget)) {
                    elem = $(this);
                } else {
                    elem = $(dataRefreshTarget);
                }


                if (!isNullOrUndefined(dataAutoLoad) && dataAutoLoad == 'true') {
                    loadContent(elem, dataRefreshUrl, true);
                }
                setInterval(function() {
                    loadContent(elem, dataRefreshUrl);
                }, dataRefreshSpeed)
            }
        });
    }

    this.createDataTables = function() {
        if ($('.dataTable').length) {
            // add in the datatables script if it's not already loaded in.
            addScript(dataTablesPath,'DataTable');
            var options = {
                "bPaginate": (!$(this).hasClass('noPaginate')),
                "bLengthChange": (!$(this).hasClass('noLengthChange')),
                "bSort": $(!$(this).hasClass('noSort')),
                "bInfo": $(!$(this).hasClass('noInfo')),
                "bAutoWidth": $(!$(this).hasClass('noAutoWidth')),
                "aoColumns": []
            }
            $('.dataTable').each(function() {
                $(this).find('thead th').each(function() {
                    if ($(this).hasClass('nosort')) {
                        options.aoColumns.push({"bSortable": false});
                    } else {
                        options.aoColumns.push(null);
                    }
                });
                $(this).DataTable(options);
            });
        }
    }

    this.setupSideNav = function() {
        $('.sidebar-nav li.collapsable a[data-role="menu"]').each(function() {
            $(this).append('<i class="icon-angle icon-angle-down"></i>')
        });
        $('.sidebar-nav li.collapsable a[data-role="menu"]').click(function() {
            event.preventDefault();
            if ($(this).parent().find('ul:first').is(':visible')) {
                $(this).parent().find('ul:first').slideUp('fast');
            } else {
                $('.sidebar-nav li.collapsable ul').slideUp('fast');
                $(this).parent().find('ul:first').slideDown('fast');
            }
        })
    }

    /**
     * Activetes the correct sidebar-nav link based on the current Url and if 
     * needed expands the sub-menu so it is displayed.
     * 
     * @returns nothing
     */
    this.setupActiveNavbar = function() {
        $('.sidebar-nav li.active').removeClass('active');
        var curPath = window.location.pathname;
        $('.sidebar-nav li a[href="' + curPath + '"]').parent().addClass('active')
        $('.sidebar-nav li.active').each(function() {
            if ($(this).parent().parent().hasClass('collapsable')) {
                $(this).parent().show();
                $(this).parent().parent().addClass('active');
            }
        })
    }

    /**
     * Generates a morris chart from an element using data-* fields.
     * The fields required are:
     * data-xkey,data-ykeys,data-labels,data-url, and data-type
     * @returns nothing
     */
    this.generateMorrisChart = function(elem) {

        // Several data- fields are required
        var xKey = elem.attr('data-xkey');
        var dYKeys = elem.attr('data-ykeys');
        var dLabels = elem.attr('data-labels');
        var url = elem.attr('data-url');
        var dType = elem.attr('data-type');

        if (isNullOrUndefined(xKey) || isNullOrUndefined(dYKeys) ||
                isNullOrUndefined(dLabels) || isNullOrUndefined(url) ||
                isNullOrUndefined(dType)) {

            return;
        }
        dType = dType.toLowerCase();
        // Build out arrays for the labels and ykeys by splitting on
        // comma.
        var labels = dLabels.split(',');
        var yKeys = dYKeys.split(',');


        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function(result) {
                if (dType == 'line') {
                    var chart = Morris.Line({
                        element: elem,
                        data: result,
                        resize: true,
                        xkey: xKey,
                        ykeys: yKeys,
                        labels: labels
                    });
                }
                else if (dType == 'bar') {
                    var chart = Morris.Bar({
                        element: elem,
                        data: result,
                        resize: true,
                        xkey: xKey,
                        ykeys: yKeys,
                        labels: labels
                    });
                }
                window.charts.push(chart);
            }
        });
    }

    this.createMorrisChart = function() {
        if ($('.morrisChart').length) {
            addScript(morrisRequirements, 'Morris');
            $('.morrisChart').each(function() {
                generateMorrisChart($(this));
            });
        }
    }


    this.setAutofocus = function() {
        $('.autofocus:first').focus();
    }
    
    this.setupScrollBox = function(){        
        $('.scrollBox').each(function(){
            var nHeight = $(this).attr('data-height');
            var nWidth = $(this).attr('data-width');
            if (isNullOrUndefined(nHeight)){
                nHeight = '250px';
            }
            if (isNullOrUndefined(nWidth)){
                nWidth = 'auto';
            }
            $(this).slimScroll({
                width: nWidth,
                height: nHeight
            })
        })
    }

    $(document).ready(function() {

        // Setup the active navbar item.
        setupActiveNavbar();
        // Set autofocus if configured in the html
        setAutofocus();
        // Simply modifies the sidebar visibility and the main-content's
        // left margin.
        $('.sidebar-toggle').click(function() {
            if ($('aside.navigation').is(':visible')) {
                $('aside.navigation').hide();
                $('aside.main-content').css('marginLeft', '20px');
            } else {
                $('aside.navigation').show();
                $('aside.main-content').css('marginLeft', '270px');
            }

        });
        
        setupScrollBox();

        createCKEditor();

        // Setup the side navigation collapsable links
        setupSideNav();
        // Setup the UI Buttons to do what they are supposed to do.
        configureUiButtons();
        // Setup datatables if there are any.
        createDataTables();
        // Setup any morrisCharts
        createMorrisChart();
        // Look for auto refresh div's and setup timers.
        createTimedRefresh();
    });
})();