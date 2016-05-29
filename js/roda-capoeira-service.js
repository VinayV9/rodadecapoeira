


function retrieveTasksService() {
	return $.ajax({
		url : "/ccms/wfm/task-list.htm",
		dataType : "json",
		type : "get"
	});
}
