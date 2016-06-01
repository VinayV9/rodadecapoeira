/*jslint browser: true*/
/*global $, jQuery, alert*/


function prepareEventHandlers() {

    $('.more-info').click(function() {
                    var elementA = $(this).parentsUntil('.row.article').last().parent();
                    console.log(elementA.html());
                    elementA.find('.detail-section').toggle();
    });
}

function loadJsonData() {
    $('.more-info').click(function() {




            $.ajax({
                    url: 'assets/data/article.json',
                    type: 'get',
                    dataType : 'json',
                    success: function(data) {
                        console.log(data);
                        $.each(data, function(key, item) {
                        console.log("<input type='checkbox' data-price='" + item.Price + "' name='" + item.Name + "' value='" + item.ID + "'/>" + item.Name + "<br/>");

                    });
                    /* $.each(item.items, function(index,item) {
                        alert('Success');
                        console.log("Value of the itemest "+item.Id+" "+item.title)
                     });*/
                    },
                    error: function(e) {
                        console.log('error message'+e.message);
                        /*alert('Error');*/
                    }
             });
        });
}

/* data is loaded synchronously loaded on page ready
function loadData()
 $.ajax({
        type : 'GET',
        dataType : 'json',
        url: 'data/json/topics.json',
        success : function(data) {
            console.log(data);
            var topics = [];
            $.each(data.results, function(index, obj){
                topics.push({
                    username: obj.TopicName,
                    mentions: obj.LastHourCount,
                    totalcount: obj.TotalCount,
                    daycount: obj.Last24HoursCount
                });
            });
            $('#leader').tmpl(topics).appendTo('#top3');
        }
    });
*/

// this will be executed once the document is ready
$(document).ready(function () {
    prepareEventHandlers();
    // console.log("Event handlers loaded");
loadJsonData();
});
