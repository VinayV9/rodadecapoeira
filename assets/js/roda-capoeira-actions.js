/*jslint browser: true*/
/*global $, jQuery, alert*/

// TODO: User Filters: http://jsfiddle.net/giorgitbs/52ak9/1/

// TODO fix issue with event not loaded when generating dynamic content
// http://stackoverflow.com/questions/15090942/jquery-event-handler-not-working-on-dynamic-content

function prepareEventHandlers() {
     // Bind event to static content
     /*  $('.more-info').click(function() {
                    var elementA = $(this).parentsUntil('.row.article').last().parent();
                    console.log(elementA.html());
                    var moreInfoClicker =  elementA.find('.detail-section')
                    loadJsonData(moreInfoClicker)
                    moreInfoClicker.toggle();
       });*/
     // Bind event to dynamically generated content
      /*$(document.body).on('click','.more-info',function() {
                    var elementA = $(this).parentsUntil('.row.article').last().parent();
                    console.log(elementA.html());
                    var moreInfoClicker =  elementA.find('.detail-section')
                    loadJsonData(moreInfoClicker)
                    moreInfoClicker.toggle();
       });*/
    $(document.body).on('click','.more-info',function() {
                    var elementA = $(this).parentsUntil('.row.article').last().parent();
                    var id       = elementA.attr("id"); 
                    var moreInfoClicker =  elementA.find('.detail-section')
                    loadArticleDetailById(id,elementA);
                    moreInfoClicker.slideToggle();
       });
}
/* a specific details for a roda */
function initLatestRoda() {
     var articlesContainer = $(document).find('.col-md-12.articles');
     var latestArticle =  $('#article-template:last');
     var template;
   
     //Load template in local variable template must be on local 
     //Ajax policy wil prenvent template file to be loaded from other domaina
     $.ajax({
      url: 'article.html',
      type: 'get',
      success: function(data) {
        template = data;
      }
     });
    
     $.ajax({
      url: 'assets/data/latest.json',
      type: 'get',
      dataType : 'json',
      success: function(data) {
      //Append template  and bind json data
       $.each(data, function(key, item) {
        articlesContainer.append(template);
        latestArticle =  $('.row.article:last');
        latestArticle.find('.Title').text(item.Title);
        latestArticle.find('.detail-section').text(item.Description);
        latestArticle.find('.location').text(item.Location);
        latestArticle.find('date').text(item.Date);
        latestArticle.find('.img-responsive.center-block').attr("src",item.Image);
        latestArticle.find('.img-responsive.center-block').attr("id",item.id);   
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
                    }
             });
}
/* Load  a specific details for a roda */
function loadJsonData(moreInfoElement) {
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
                    }
             });
}

/* Load  a specific details for a roda */
function loadArticleDetailById(id, detail) {
            $.ajax({
                    url: 'assets/data/latest.json',
                    type: 'get',
                    dataType : 'json',
                    success: function(data) {
                    $.each(data, function(key, item) {
                        console.log("Article ID"+id);
                        if (id ==  item.id){
                            detail.text(item.Description);
                        }
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
