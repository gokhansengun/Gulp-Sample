var lasturl = '';

function checkURL(hash) {
    if (!hash) {
        hash = window.location.hash;
    }

    if (hash != lasturl) {
        lasturl = hash;

        // FIX - if we've used the history buttons to return to the homepage,
        // fill the pageContent with the default_content

        if (hash === '') {
            $('#pageContent').html(defaultContent);
        }
        else {
            loadPage(hash);
        }
    }
}

function loadPage(url) {
    url = 'page' + url.replace('#page','');

    $('#loading').css('visibility', 'visible');

    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'html',
        success: function(msg) {
            if (parseInt(msg) !== 0) {
                $('#pageContent').html(msg);
                $('#loading').css('visibility','hidden');
            }
        }

    });
}
