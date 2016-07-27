(function iife() {
    // 
    var QuotesAPI = {
            getRandom: function getQuote() {
                return axios.get('https://got-quotes.herokuapp.com/quotes');
            }
        },

        App = (function(api) {
            var data = {
                    quote: "",
                    character: ""
                },
                options = {};

            function build(opt) {
                options = opt;
            }

            function updateData(response) {
                data = response.data;
            }

            function updateLoadState(val) {
                if (val) {
                    options.loadingIcon.addClass('fa-spin');
                } else {
                    options.loadingIcon.removeClass('fa-spin');
                }
            }

            function loadQuote() {
                updateLoadState(true);
                api.getRandom()
                    .then(function(response) {
                        updateData(response);
                        insertQuote();
                    })
                    .catch(function handleError(error) {
                        console.log(error);
                    });
            }

            function insertQuote() {
                options.quote.text(data.quote);
                options.char.text('- ' + data.character);

                options.container
                    .fadeIn(500, function() {
                        updateLoadState(false)
                    });
            }

            function shareQuote() {
                var len = data.quote.length + data.character.length + 3,
                    url;

                if (len <= 144) {
                    url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent('"' + data.quote + '" - ' + data.character);
                    
                    window.open(url, '_blank');
                }
            }

            return {
                build: build,
                update: loadQuote,
                shareQuote: shareQuote
            }
        })(QuotesAPI);


    $(document).ready(function() {
        var $container = $('#quote-container'),
            $quote = $('#quote'),
            $character = $('#character'),
            $refresh = $('.fa-refresh'),
            $buttoNew = $('#new-quote'),
            $tweet = $('#share');

        App.build({
            container: $container,
            quote: $quote,
            char: $character,
            loadingIcon: $refresh
        });

        App.update();

        $buttoNew.on('click', function() {
            $('p.fade-in, #character').removeClass('delay-1half delay-2');

            $container.fadeOut(500, function() {
                App.update();
            });
        });

        $tweet.on('click', function(){
            App.shareQuote();
        });
    });
})();