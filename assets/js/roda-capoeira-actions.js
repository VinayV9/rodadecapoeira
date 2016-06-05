/*jslint browser: true*/
/*global $, jQuery, alert*/

function prepareEventHandlers() {

    $('.more-info').click(function() {
                    var elementA = $(this).parentsUntil('.row.article').last().parent();
                    console.log(elementA.html());
                    var moreInfoClicker =  elementA.find('.detail-section')
                    loadJsonData(moreInfoClicker)
                    moreInfoClicker.toggle();
       });
}
/* a specific details for a roda */
function initLatestRoda() {
     var articlesContainer = $(document).find('.col-md-12.articles');
     var latestArticle = null;
     console.log("Step1 ");
     console.log(""+articlesContainer.html());
     //Iterate through the json collection
     //Load template
     //Append template  as the latest element of the content section
     //Map current Json data with $Jquery node
     $.ajax({
                    url: 'assets/data/latest.json',
                    type: 'get',
                    dataType : 'json',
                    success: function(data) {
                        console.log("Step 2 ");
                          $.each(data, function(key, item) {
                             console.log("Step 3 ");
//                             if (latestArticle === null){
//                             latestArticle = $(articlesContainer).filter('.row.article:last');
                             $(".col-md-12.articles").load("article.html .row.article",
                                                       function(responseTxt, statusTxt, xhr){
                                                        if(statusTxt == "success") {
                                                            console.log("First article");
                                                            console.log(articlesContainer.html());
                                                            var latestArticle = $(articlesContainer).filter('.row.article:last');
                                                            // Append the text value of the article in the section
                                                            $(latestArticle).find('.detail-section').text(item.Description);
                                                        }
                                                        if(statusTxt == "error")
                                                        alert("Error: " + xhr.status + ": " + xhr.statusText);
                            });
//                            } else {
//
//                                //Load the other elements with the template
//                            }


                               // Go the latest article
                            //$(articlesContainer).load("article.html .row.article");


                    });
                    },
                    error: function(e) {
                        console.log('error message'+e.message);
                        /*alert('Error');*/
                    }
             });
}
function fetchLatestRoda() {
     $.ajax({
                    url: 'assets/data/latest.json',
                    type: 'get',
                    dataType : 'json',
                    success: function(data) {
                          $.each(data, function(key, item) {
                            moreInfoElement.text(item.Description);
                    });
                    },
                    error: function(e) {
                        console.log('error message'+e.message);
                        /*alert('Error');*/
                    }
             });


    //Iterate through the json collection
    //Load template
    //Append template  as the latest element of the content section
    //Map current Json data with $Jquery node
    //
}

/* Load  a specific details for a roda */
function loadJsonData(moreInfoElement) {
            $.ajax({
                    url: 'assets/data/article.json',
                    type: 'get',
                    dataType : 'json',
                    success: function(data) {
                    $.each(data, function(key, item) {
                        moreInfoElement.text(item.Description);
                    });
                    },
                    error: function(e) {
                        console.log('error message'+e.message);
                    }
             });
}
// this will be executed once the document is ready
$(document).ready(function () {
    prepareEventHandlers();
    initLatestRoda();


});
