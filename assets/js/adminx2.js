var dataTablesPath = "/assets/plugins/datatables/jquery.dataTables.min.js";
(function() {
    /**
     * Verifies if a script is added and if not injects it into the page.
     * Allows libraries to be automatically loaded in where necessary.
     * 
     * @param string src
     * @param function test
     * @returns nothing
     */
    this.addScript = function(src, test) {
        if (isNullOrUndefined(test)) {
            $('body').append('<script src="' + src + '"></script>');
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
            success: function(result) {
                elem.html(result);

                if (box != null) {
                    box.find('.loader').remove();
                }
            }
        })
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
            addScript(dataTablesPath, $.fn.DataTable);

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
        $('.sidebar-nav li.collapsable a[role="menu"]').each(function() {
            $(this).append('<i class="icon-angle icon-angle-down"></i>')
        });
        $('.sidebar-nav li.collapsable a[role="menu"]').click(function() {
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
            }
        })
    }
    this.setAutofocus = function(){
        $('.autofocus:first').focus();
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

        // Setup the side navigation collapsable links
        setupSideNav();

        // Setup the UI Buttons to do what they are supposed to do.
        configureUiButtons();

        // Setup datatables if there are any.
        createDataTables();

        // Look for auto refresh div's and setup timers.
        createTimedRefresh();

    });

})();