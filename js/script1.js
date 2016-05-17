var defaultContent = '';

$(document).ready(function() {
    checkURL();

    $('ul li a').click(function (e) {
        checkURL(this.hash);
    });
 
    // filling in the default content
    defaultContent = $('#pageContent').html();

    setInterval(checkURL(), 250);
});
