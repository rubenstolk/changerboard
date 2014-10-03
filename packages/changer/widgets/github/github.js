widget = {
    onData: function(el, data) {
        $('.content', el).empty();

        if (data.title) {
            $('h2', el).text(data.title);
        }

        (data.pulls || []).forEach(function (pull) {

            $('.content', el).append(
                "<p>" + pull.user + " created PR #" + pull.number  + " in " + pull.repo + "<br /><small>" +
                moment(pull.created_at).fromNow() + "</small></p>"
            );
        })
    }
};
