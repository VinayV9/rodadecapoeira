/*jslint browser: true*/
/*global $, jQuery, alert*/
function prepareEventHandlers() {
        
$('.more-info').click(function() {
                var elementA = $(this).parentsUntil('.row.article').last().parent();
                console.log(elementA.html());
                elementA.find('.detail-section').toggle();
});
     
}

// this will be executed once the document is ready
$(document).ready(function () {
    prepareEventHandlers();
    // console.log("Event handlers loaded");

});