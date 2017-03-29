$("#gameCanvas").on("mouseover", function() {
        $(this).css('cursor', 'url(./img/crosshair.cur), crosshair');
    })
    .mouseout(function() {
        $(this).css('cursor', 'auto');
    });