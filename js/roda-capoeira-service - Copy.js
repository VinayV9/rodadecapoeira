


function retrieveTasksService() {
	return $.ajax({
		url : "/ccms/wfm/task-list.htm",
		dataType : "json",
		type : "get"
	});
}

function retrieveAssociatedTaskItemsService(task) {
	return $.ajax({
		url : "/ccms/wfm/get-task-items.htm",
		dataType : "json",
		type : "POST",
     	contentType: "application/json",
		data: JSON.stringify(task)
	});
}

function saveTaskService(actionRequestType, task){
	var url = (actionRequestType=='Edit Task') ? "/ccms/wfm/update-task.htm" : "/ccms/wfm/create-task.htm";

	return $.ajax({
	 url: url,
	 dataType: 'json',
	 type: "POST",
	 contentType: "application/json",
	 data: JSON.stringify(task)
});
}


function deleteTaskService(task){
	return $.ajax({
	 url: "/ccms/wfm/delete-task.htm",
	 dataType: 'json',
	 type: "POST",
	 contentType: "application/json",
	 data: JSON.stringify(task)
	});
}



function retrieveAssociatedFormsService() {
	return $.ajax({
		url : "/ccms/wfm/forms/workflow-forms-list.htm",
		dataType : "json",
		type : "get"
	});
}

function retrieveWorkflowClassificationsService() {
	return $.ajax({
		url : "/ccms/wfm/classifications/list.htm",
		dataType : "json",
		type : "get"
	});
}

function saveAssociatedFormService(taskId, formId) {
	return $.ajax({
		url : "/ccms/wfm/forms/save-associated-form.htm",
		dataType : "json",
		type : "post",
		data : {
			taskId : taskId,
			formId : formId
			}
	});
}

function saveAssociatedClassificationService(taskId, classificationId) {
	return $.ajax({
		url : "/ccms/wfm/classifications/save-associated-classification.htm",
		dataType : "json",
		type : "post",
		data : {
			taskId : taskId,
			classificationId : classificationId
		}
	});
}

function deleteAssociatedFormService(taskId, formId) {
	return $.ajax({
		url : "/ccms/wfm/forms/delete-associated-form.htm",
		dataType : "json",
		type : "post",
		data : {
			taskId : taskId,
			formId : formId
			}
	});
}

function saveAssociatedTaskService(taskId, relatedTaskId) {
	return $.ajax({
		url : "/ccms/wfm/save-associated-task.htm",
		dataType : "json",
		type : "post",
		data : {
			taskId : taskId,
			relatedTaskId : relatedTaskId
			}
	});
}

function deleteAssociatedTaskService(taskId, relatedTaskId) {
	return $.ajax({
		url : "/ccms/wfm/delete-associated-task.htm",
		dataType : "json",
		type : "post",
		data : {
			taskId : taskId,
			relatedTaskId : relatedTaskId
			}
	});
}

function createAssociatedActionService(associatedAction) {
	return $.ajax({
		url : "/ccms/wfm/actions/create-action.htm",
		contentType: "application/json; charset=utf-8",
		type : "post",
		data : JSON.stringify(associatedAction)
	});
}

function saveAssociatedActionService(associatedAction) {
	return $.ajax({
		url : "/ccms/wfm/actions/save-update-action.htm",
		contentType: "application/json; charset=utf-8",
		type : "post",
		data : JSON.stringify(associatedAction)
	});
}

function deleteAssociatedActionService(associatedAction) {
	return $.ajax({
		url : "/ccms/wfm/actions/delete-action.htm",
		contentType: "application/json; charset=utf-8",
		type : "post",
		data : JSON.stringify(associatedAction)
	});
}





