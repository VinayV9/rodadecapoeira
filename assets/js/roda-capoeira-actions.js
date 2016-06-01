/*jslint browser: true*/
/*global $, jQuery, alert*/
var data = [
 {"Id": 10004, "PageName": "club"},
 {"Id": 10040, "PageName": "qaz"},
 {"Id": 10059, "PageName": "jjjjjjj"}
];

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
                    url: 'data/json/article.json',
                    type: 'get',
                    success: function(data) {
                     $.each(item.items, function(index,item) {
                        console.log(item.Id+" "+item.title)
                     });
                    },
                    error: function(e) {
                        console.log(e.message);
                    }
             });
        });
}

/* data is loaded synchronously loaded on page ready /
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


// this will be executed once the document is ready
$(document).ready(function () {
    prepareEventHandlers();
    // console.log("Event handlers loaded");

});
