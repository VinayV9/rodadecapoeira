$(document).ready(function() {


	 var requestType = '';
	 var selectedColumnText  = '';

	 /**
	  * Add / Edit Task Form
	  */
	 var selectedUrgencyType = '';
	 var selectedAssignee = '';

	 /**
	  * Associated Forms
	  */
	 var availableFormsMap = {};
	 var availableForms = [];
	 var selectedTaskAssociatedForms = [];
	 var associatedFormsPanelId = "#associatedFormsList";
	 var associatedFormDeleteActionType = 'btn-delete-associated-form';

	 /**
	  * Associated Classifications
	  */
	 var availableClassificationsMap = {};
	 var availableClassifications = [];
	 var selectedTaskAssociatedClassifications = [];
	 var associatedClassificationsPanelId = "#associatedClassificationsList";
	 var associatedClassificationDeleteActionType = "btn-delete-associated-classification";

	 /**
	  * Associated Tasks
	  */
	 var selectedTaskAssociatedTasks = [];
	 var associatedTasksPanelId = "#associatedTasksList";
	 var associatedTaskDeleteActionType = 'btn-delete-associated-task';


	 var TASK_EDIT_COLUMN_INDEX = 7;
	 var TASK_DELETE_COLUMN_INDEX = 8;


	 /**
	  * Initialise taskManagementTable
	  */
	 initialise();

	 function initialise(){
		 retrieveAllTasks();
		 retrieveAllAssociatedForms();
		 retrieveWorkflowClassifications();
	 }

	 function retrieveAllTasks(){
		 var result = retrieveTasksWithSortColumnService('id', 'desc');
		 afterRetrieveAllTasks(result);
	 }

	 function afterRetrieveAllTasks(result){
		 result.success(function (data){
			 	$("#taskManagementTable tr:gt(0)").remove();

			 	$.map(data, function (item){
				   $('#taskManagementTable').append(createTaskRowItem(item));
				   availableTasks.push(item);
				   var id = item.taskId.toString();
				   availableTasksMapById[id] = item;
				   availableTasksMap[item.name] = item;
				});

			 	 createListGroupItemHeader(emptyIcon, 'actions', selectedTaskName);
		 });
	 }

	 function retrieveWorkflowClassifications(){
		 var result = retrieveWorkflowClassificationsService();
		 afterRetrieveWorkflowClassifications(result);
	 }

	 function afterRetrieveWorkflowClassifications(result){
		 result.success(function(data){
				$.map(data, function (item){
					availableClassifications.push(item);
					availableClassificationsMap[item.name] = item;
				});
		 });
	 }

	 function retrieveAllAssociatedForms(){
		 var result = retrieveAssociatedFormsService();
		 afterRetrieveAllAssociatedForms(result);
	 }

	 function afterRetrieveAllAssociatedForms(result){
		 result.success(function(data){
				$.map(data, function (item){
					availableForms.push(item);
					availableFormsMap[item.name] = item;
				});
		 });
	 }

	 function retrieveAssociatedItemsFor(taskId){
		 var result = retrieveAssociatedTaskItemsService(taskId);
		 afterRetrieveAssociatedTaskItems(result);
	 }

	 function afterRetrieveAssociatedTaskItems(result){
		 console.log('-----------afterRetrieveTaskItems-----------');
		 result.success(function(data){
			 resetAssociatedItems();

			 var count = 0;
			 $.map(data, function(item, key){
				 if(item!=null && item.length > 0){
					 if(key=='associatedForms'){
						 processAssociatedFormsResultSet(item);
					 }

					 if(key=='associatedTasks'){
						 processAssociatedTasksResultSet(item);
					 }

					  if(key=='associatedActions'){
						  processAssociatedActionsResultSet(item);
					  }

					  if(key=='associatedClassifications'){
						  processAssociatedClassificationsResultSet(item);
					  }

				 }

			 });

			 updateAssociatedItemPanelsForSelectedTask();

			 var actionButton = appendActionItemButton();
	    	 $(associatedActionsPanelId).append(actionButton).children(':last').hide().fadeIn(500);

			 if(requestType==workflowRequestType.DELETE_TASK){
				 confirmDeleteTask();
			 }

		 })
	 }

	 function updateAssociatedItemPanelsForSelectedTask(){
		 addBadgeForAssociatedItemTabLabel('Actions', selectedTaskAssociatedActions.length);
		 addBadgeForAssociatedItemTabLabel('Forms', selectedTaskAssociatedForms.length);
		 addBadgeForAssociatedItemTabLabel('Tasks', selectedTaskAssociatedTasks.length);
		 addBadgeForAssociatedItemTabLabel('Classifications', selectedTaskAssociatedClassifications.length);
	 }

	 function addBadgeForAssociatedItemTabLabel(tabLabelName, numberOfItems){
		 $("a:contains('"+ tabLabelName +"')")
		    .text(tabLabelName + ' ')
		    .append($('<span></span>')
		        .addClass('badge')
		        .text(numberOfItems)
		    );
	 }

	 function processAssociatedActionsResultSet(item){
		 var n = 0;
		  for (i=0; i<item.length; i++){
				 var rAssociatedAction = item[i];
				 selectedTaskAssociatedActions.push(rAssociatedAction);
				 n=i+1;
				 createListActionItem(rAssociatedAction, n);
		  }
	 }

	 function processAssociatedFormsResultSet(item){
		 for (i=0; i<item.length; i++){
			 var associatedFormItem = item[i].workflowForm;
			 createAssociatedListGroupItem(associatedFormItem.name, associatedFormsPanelId, associatedFormDeleteActionType, formIcon);
			 selectedTaskAssociatedForms.push(associatedFormItem);
		 }
	 }

	 function processAssociatedClassificationsResultSet(item){
		 for (i=0; i<item.length; i++){
			 var associatedClassificationItem = item[i].workflowClassification;

			 if(associatedClassificationItem==null){
				 for(j=0; j<availableClassifications.length; j++){
					 if(availableClassifications[j].id == item[i].classificationId){
						 associatedClassificationItem = availableClassifications[j];
					 }
				 }
			 }

			 if(associatedClassificationItem!=null){
				 createAssociatedListGroupItem(associatedClassificationItem.name, associatedClassificationsPanelId, associatedClassificationDeleteActionType, classificationIcon);
				 selectedTaskAssociatedClassifications.push(associatedClassificationItem);
			 }
		 }
	 }

	 function processAssociatedTasksResultSet(item){
		 for (i=0; i<item.length; i++){
			 var associatedTask = item[i];
			 var relatedTaskId = associatedTask.relatedTaskId.toString();
			 var task = availableTasksMapById[ relatedTaskId ];
			 if(task!=null){
				 createAssociatedListGroupItem(task.name, associatedTasksPanelId, associatedTaskDeleteActionType, taskIcon);
				 selectedTaskAssociatedTasks.push(task);
			 }
		 }
	 }

	 /**
	  * Reset to initial state
	  */
	 function resetAssociatedItems(){
		 selectedTaskAssociatedForms = [];
		 selectedTaskAssociatedTasks = [];
		 selectedTaskAssociatedActions = [];
		 selectedTaskAssociatedClassifications = [];
		 action = {};
		 createListGroupItemHeader(emptyIcon, 'forms', selectedTaskName);
		 createListGroupItemHeader(emptyIcon, 'tasks', selectedTaskName);
		 createListGroupItemHeader(emptyIcon, 'actions', selectedTaskName);
		 createListGroupItemHeader(emptyIcon, 'classifications', selectedTaskName);
	 }


	 function createAssociatedListItem(icon, name){
		 return "<li class=\"list-group-item\">" + createSpanWith(icon) + " " + name + "</li>";
		 $(panelId).append(listItem).children(':last').hide().fadeIn(500);
    	 updateAssociatedListGroupItemHeaderIfRequired(panelId, iconType, "li");
	 }

	 function confirmDeleteTask(){

	   	var associatedFormsToDelete = "";
	   	var associatedTasksToDelete = "";
	   	var associatedActionsToDelete = "";
	   	var messageSubHeader = (selectedTaskAssociatedForms.length > 0 || selectedTaskAssociatedTasks.length > 0) ? "<p>Please note any items which are associated with this task will also be deleted:</p>" : "";

	   	for (i=0; i<selectedTaskAssociatedForms.length; i++){
	   		associatedFormsToDelete += createAssociatedListItem(formIcon, selectedTaskAssociatedForms[i].name);
	   	}

	   	for (i=0; i<selectedTaskAssociatedTasks.length; i++){
	   		associatedTasksToDelete += createAssociatedListItem(taskIcon, selectedTaskAssociatedTasks[i].name);
	   	}

	   	for (i=0; i<selectedTaskAssociatedActions.length; i++){
	   		associatedActionsToDelete += createAssociatedListItem(actionIcon, selectedTaskAssociatedActions[i].name);
	   	}

	   	var warningText = createDeleteTaskWarningText(messageSubHeader, associatedFormsToDelete, associatedTasksToDelete, associatedActionsToDelete);

		 $("#deleteTaskModalBody").html(warningText);
	 }

	 function createDeleteTaskWarningText(messageSubHeader, associatedFormsToDelete, associatedTasksToDelete, associatedActionsToDelete){
		 return "<ul class=\"list-group list-group-info\">" +
			"<li class=\"list-group-item list-group-item-danger\">" +
				"<h4>" + createSpanWith(exclamationIcon) +
				" Are you sure you want to delete " + selectedTaskName + "?" +
				"</h4>" + messageSubHeader + "</li>" + associatedFormsToDelete
				+ associatedTasksToDelete + associatedActionsToDelete +
		  "</ul>";
	 }

	 /**
	  * Delete Task
	  */
	 $("#deleteTaskConfirmation").on("click", function(){
		 var json = {"taskId" : selectedTaskId};
		 var result = deleteTaskService(json);
		 afterDeleteTask(result);
	 });

	 function afterDeleteTask(result){
		result.success(function(data){
			$('#deleteTaskModal').modal('toggle');
			selectedTaskAssociatedForms = [];
			selectedTaskAssociatedTasks = [];
			createListGroupItemHeader('fa fa-info-circle fa', 'forms', '');
			createListGroupItemHeader('fa fa-info-circle fa', 'tasks', '');
			retrieveAllTasks();
		});
	 }

	 /**
	  * Save Task (Add)
	  */
	 $("#saveTask").on("click", function(){

		 var json = buildTaskAsJSONString();
		 console.log('actionRequestType: ' + requestType.name);
		 //console.log("json: " + JSON.stringify(json));

		 var result = saveTaskService(requestType.name, json);
		 afterSaveTask(result);

	 });

	 function afterSaveTask(result){
		 result.success(function (data){
			 $('#taskModal').modal('toggle');
			  retrieveAllTasks();
		 });
	 }

	 $(".list-group.checked-list-box .list-group-item").each(function () {
		 //console.log("clicked.");
	 });


	 /**
	  * Task Edit Click
	  */
	 $('#taskManagementTable').on('click', '.table-center-icon .btn.btn-link.btn-edit-task', function () {
		 	requestType = workflowRequestType.EDIT_TASK;
		 	console.log('table clicked ' + 'edit action type');
		    var currentRow = $(this).closest("tr");

		    var id = currentRow.find("td").eq(0).text();
		    if(id==''){ //ignoring header row.
		    	return;
		    }

		    selectedTaskId = id;


		    var name= currentRow.find("td").eq(1).text();
		    selectedTaskName = name;

		    //TODO Refactor
		    var description = currentRow.find("td").eq(2).text();
		    var urgency = currentRow.find("td").eq(3).text();
		    var assignee = currentRow.find("td").eq(4).text();
		    var startDays = currentRow.find("td").eq(5).text();
		    var completedDays = currentRow.find("td").eq(6).text();


             $("#addTaskModalLabel").html("<i class='fa fa-tasks'>&nbsp;</i> Edit Task");
             $("#taskName").val(name);
             $("#taskDescription").val(description);
             $("#urgencyDropdown").html(urgency);
             $("#assigneeDropdown").html(assignee);
             $("#taskStartDays").val(startDays);
             $("#taskCompletedDays").val(completedDays);
             $("#deleteTaskModalBody").html('Task Name: ' + selectedTaskName);

		});

		$('.workflow-task-list-column-header').on('mouseover', function(){
			var current = $(this).attr('style').replace('; background-color:transparent', '');
			console.log('current ' + current);

			$(this).attr('style', current + '; background-color:#E0EAFF');
		});

		$('.workflow-task-list-column-header').on('mouseout', function(){
			if($(this).text().trim()!=selectedColumnText){
				var current = $(this).attr('style').replace('; background-color:#E0EAFF', '');
				$(this).attr('style', current + '; background-color:transparent');
			}
		});

	 /**
		 * Workflow Task Table Header Row Sort - Status
		 */
		$('.workflow-task-list-column-header').on('click', function(){
			console.log('status column clicked.' + $(this).text().trim() + ' style; ');

			var $selectedColumnHeader = $(this);
			console.log('selectedSortColumn .' + $selectedColumnHeader);

			applySortToWorkflowTasks($selectedColumnHeader);

		    selectedColumnText = $(this).text().trim();
			selectedSortColumn =  findSortColumnNameFromSelection(selectedColumnText, sortColumnNamesWorkflowTasks);
			console.log('selectedSortColumn .' + selectedSortColumn);

			var result = retrieveTasksWithSortColumnService(selectedSortColumn, selectedSortOrder);
			afterRetrieveAllTasks(result);
		});

	 /**
	  * Task Confirm Delete
	  */
	 $('#taskManagementTable').on('click', '.table-center-icon .btn.btn-link.btn-delete-task', function () {

		 requestType = workflowRequestType.DELETE_TASK;
		 console.log('table clicked ' + 'delete action type');
		 var currentRow = $(this).closest("tr");

		 var id = currentRow.find("td").eq(0).text();
		   if(id==''){ //ignoring header row.
		    	return;
		    }

		 selectedTaskId = id;
		 var name= currentRow.find("td").eq(1).text();
		 selectedTaskName = name;

		 var taskId = {"taskId" : id};
		 retrieveAssociatedItemsFor(taskId);

	 });

	 /**
	  * Delete Associated Form
	  */
	 $('#associatedFormsList').on('click', '.btn.btn-link.pull-right.btn-delete-associated-form', function(){
		 // console.log('clicked remove form item ' + $(this).closest("li").text());
		 var selectedForm = $(this).closest("li");
		 var formName = selectedForm.text();

		 for(var formItem in availableForms){
			 var form = availableForms[formItem];
			 if(formName.trim() == form.name){
				deleteAssociatedFormService(selectedTaskId, form.formId);
			 }
		 }

		 selectedForm.fadeOut(300, function(){
			 selectedForm.remove();
			 if ( $('#associatedFormsList li').length == 1 ) {
		 			 var associatedFormListHeader =  "<h4><span class=\"fa fa-chain-broken  fa\"> </span> There are no forms associated with " + selectedTaskName + "</h4>";
		 		 	$("#associatedFormsList li").first().html(associatedFormListHeader);
		 	 }
          });

	 });



	 /**
	  * Delete Associated Classification
	  */
	 $('#associatedClassificationsList').on('click', '.btn.btn-link.pull-right.btn-delete-associated-classification', function(){
		 // console.log('clicked remove form item ' + $(this).closest("li").text());
		 var selectedClassification = $(this).closest("li");
		 var classificationName = selectedClassification.text();

		 for(var classificationItem in availableClassifications){
			 var classification = availableClassifications[classificationItem];
			 if(classificationName.trim() == classification.name){
				 deleteAssociatedClassificationService(selectedTaskId, classification.id);
			 }
		 }

		 selectedClassification.fadeOut(300, function(){
			 selectedClassification.remove();
			 if ( $('#associatedClassificationsList li').length == 1 ) {
				 var associatedClassificationListHeader =  "<h4><span class=\"fa fa-chain-broken  fa\"> </span> There are no classifications associated with " + selectedTaskName + "</h4>";
				 $("#associatedClassificationsList li").first().html(associatedClassificationListHeader);
			 }
		 });

	 });

	 /**
	  * Delete Associated Task
	  */
	 $('#associatedTasksList').on('click', '.btn.btn-link.pull-right.btn-delete-associated-task', function(){
		 // console.log('clicked remove form item ' + $(this).closest("li").text());
		 var selectedTask = $(this).closest("li");
		 var taskName = selectedTask.text();

		 for(var taskItem in availableTasks){
			 var task = availableTasks[taskItem];
			 console.log('id: ' + task.name);

			 if(taskName.trim() == task.name){
				 deleteAssociatedTaskService(selectedTaskId, task.taskId);
			 }

		 }


		 //console.log('selectedForm: ' + associatedFormId);
		 selectedTask.fadeOut(300, function(){
			 selectedTask.remove();
			 if ( $('#associatedTasksList li').length == 1 ) {
				 console.log('length > 1 111' + $("#associatedTasksList li").first().text());
				 var associatedTaskListHeader =  "<h4><span class=\"fa fa-chain-broken  fa\"> </span> There are no tasks associated with " + selectedTaskName + "</h4>";
				 $("#associatedTasksList li").first().html(associatedTaskListHeader);
			 }

		 });

	 });


	 /**
	  * Task Table Row Click
	  */
	 $('#taskManagementTable').on('click', 'tr', function () {
		 console.log('table row clicked update actions / associated forms / associated tasks');
		    var currentRow = $(this).closest("tr");
		    var $selectedRow = $(this).closest("tr");
		    $("#taskManagementTable tr").removeClass("task-highlight");

		    var id = currentRow.find("td").eq(0).text();
		    selectedTaskId = id;
		    if(id==''){ //ignoring header row.
		    	return;
		    }
		    var name= currentRow.find("td").eq(1).text();
		    selectedTaskName = name;


		    //Ensure all of the edit / delete table icon colours are not highlighted
		    $('#taskManagementTable tr').each(function (i, row) {
		    	   var $row = $(row);
		    	   var $currentEditButton = ($row).find("td").eq(TASK_EDIT_COLUMN_INDEX).children("button");
		    	   var $currentDeleteButton = ($row).find("td").eq(TASK_DELETE_COLUMN_INDEX).children("button");
		    	   ($currentEditButton).find("span").removeClass('white');
		    	   ($currentDeleteButton).find("span").removeClass('white');
		    });

		    var $tableRowDeleteButtonIcon = ($selectedRow).find("td").eq(TASK_DELETE_COLUMN_INDEX).children("button");
		    var $tableRowEditButtonIcon = ($selectedRow).find("td").eq(TASK_EDIT_COLUMN_INDEX).children("button");

		    /**
		     * Selected Row
		     */
		    var selected = ($selectedRow).hasClass("task-highlight");

		    if(!selected){
		    	($tableRowDeleteButtonIcon).find("span").addClass('white');
		    	($tableRowEditButtonIcon).find("span").addClass('white');
		    	($selectedRow).addClass("task-highlight");
		    }

		    /**
		     * Retrieve the associated task items (i.e. actions / related forms / related tasks)
		     */
		    	var taskId = {"taskId" : id};
		    	retrieveAssociatedItemsFor(taskId);


		 /**
		  * End Task Management Table Click
		  */

	 });


	 /**
	  * Associated Forms Search Input
	  */
	 var $input = $('.typeahead');

	 $input.typeahead({
		 source:availableForms,
	     autoSelect: true,
	     highlighter: function(item){
	    	 var availableForm = availableFormsMap[ item ];
	    	 return createHighlightItemWith(availableForm.name, availableForm.description);
	     },
	     updater: function(data){
	    	 console.log('selected id: ' + data.formId + ' ' + data.name + ' ' + data.description + ' taskId: ' + selectedTaskId);
	    	 createAssociatedListGroupItem(data.name, associatedFormsPanelId, associatedFormDeleteActionType, formIcon);
	    	 saveAssociatedFormService(selectedTaskId, data.formId);
	     }

	   });

	 /**
	  * Associated Classifications Search Input
	  */
	 var $input = $('.typeahead-classifications');


	 $input.typeahead({
		 source:availableClassifications,
		 autoSelect: true,
		 highlighter: function(item){
			 var availableClassification = availableClassificationsMap[ item ];
			 return createHighlightItemWith(availableClassification.name, availableClassification.description);
		 },
		 updater: function(data){
			 for(i=0; i<selectedTaskAssociatedClassifications.length; i++){
				 if(selectedTaskAssociatedClassifications[i].id==data.id){
					 return;
				 }
			 }

			 console.log('selected classification id: ' + data.id + ' ' + data.name + ' ' + data.description + ' taskId: ' + selectedTaskId);
			 createAssociatedListGroupItem(data.name, associatedClassificationsPanelId, associatedClassificationDeleteActionType, classificationIcon);
			 saveAssociatedClassificationService(selectedTaskId, data.id);
			 selectedTaskAssociatedClassifications.push(data);
		 }

	 });

	 /**
	  * Associated Tasks Search Input
	  */
	 var $input = $('.typeahead-tasks');

	 $input.typeahead({
		 source:availableTasks,
		 autoSelect: true,
		 highlighter: function(item){
			 var availableTask = availableTasksMap[ item ];
			 return createHighlightItemWith(availableTask.name, availableTask.description);
		 },
		 updater: function(data){
			 console.log('(search) selected task id: ' + data.taskId + ' ' + data.name + ' ' + data.description + ' taskId: ' + selectedTaskId);
			 createAssociatedListGroupItem(data.name, associatedTasksPanelId, associatedTaskDeleteActionType, taskIcon);
			 saveAssociatedTaskService(selectedTaskId, data.taskId);
		 }

	 });

	 function createHighlightItemWith(name, description){
		 return "<div class=\"task-search-input\">" +
		 		"<h4> " + "<i class=\"fa fa-plus-circle fa pull-right \" style=\"color:#43BD4B\">&nbsp;</i>" +
		 		name + "</h4> " + "<p>" + ' ' + description + "</p>" + "</div>";
	 }

	 /**
	  * List group items
	  */
	 function createAssociatedListGroupItem(itemName, panelId, actionEventType, iconType){
		 var listItem = createListItemWithDeleteButton(itemName, actionEventType);
		 $(panelId).append(listItem).children(':last').hide().fadeIn(500);
		 updateAssociatedListGroupItemHeaderIfRequired(panelId, iconType, "li");
	 }

	 function createListItemWithDeleteButton(listItemName, classAttribute){
		 return "<li class=\"list-group-item\">" + listItemName + '<button type="button" class="btn btn-link pull-right '
		 + classAttribute + '"'  + '>' + createSpanWith(deleteIcon) + '</button>' + " </li>";
	 }

	 function updateAssociatedListGroupItemHeaderIfRequired(panelId, iconType, selectorTag){
		 if ( $(panelId + " " + selectorTag).length > 1 ) {
			 var header =  "<h4> " + createSpanWith(iconType) + " " + selectedTaskName + " </h4>";
			 $(panelId + " li").first().html(header);
		 }
	 }



	 /**
	  * Add Task
	  */

	 $("#taskModal").on("shown", function(){
		 //console.log('shown');
		    $('#taskName').autofocus();
	 });

	 $("#addTask").on("click", function(){
		 	 requestType = workflowRequestType.CREATE_TASK;

             $("#addTaskModalLabel").html("<i class='fa fa-tasks'>&nbsp;</i> Create New Task");

             $("#taskName").val('');
             $("#taskDescription").val('');
             $("#urgencyDropdown").html('Select Urgency');
             $("#assigneeDropdown").html('Select Assignee');
             $("#taskStartDays").val(0);
             $("#taskCompletedDays").val(0);
	 });


	 /**
	  * Add Task - Urgency Dropdown
	  */
	 $('#taskUrgencyList li').on('click', function(){
		    $('#urgencyDropdown').html($(this).text());
		    selectedUrgencyType = $(this).text();
	 });

	 /**
	  * Add Task - Assignee Dropdown
	  */
	 $('#taskAssigneeList li').on('click', function(){
		 $('#assigneeDropdown').html($(this).text());
		 	selectedAssignee = $(this).text();
	 });

	 /**
	  * Add Task - Start Days Numeric Input
	  */
	 (function ($) {
		 $('.start-days-numeric-input .btn:first-of-type').on('click', function() {
		    $('.start-days-numeric-input input').val( parseInt($('.start-days-numeric-input input').val(), 10) + 1);
		  });

		  $('.start-days-numeric-input .btn:last-of-type').on('click', function() {
		    $('.start-days-numeric-input input').val( parseInt($('.start-days-numeric-input input').val(), 10) - 1);
		  });

		})($);

	 /**
	  * Add Task - Completed Days Numeric Input
	  */
	 (function ($) {
		 $('.completed-days-numeric-input .btn:first-of-type').on('click', function() {
			 $('.completed-days-numeric-input input').val( parseInt($('.completed-days-numeric-input input').val(), 10) + 1);
		 });

		 $('.completed-days-numeric-input .btn:last-of-type').on('click', function() {
			 $('.completed-days-numeric-input input').val( parseInt($('.completed-days-numeric-input input').val(), 10) - 1);
		 });

	 })($);





	 function buildTaskAsJSONString(){
		 var completedDays = $("#taskCompletedDays").val();
		 var startDays = $("#taskStartDays").val();
		 var taskDescription = $("#taskDescription").val();
		 var taskName = $("#taskName").val();
		 //var taskId = $("#taskId").val();

		 if(selectedAssignee==null || selectedAssignee.length==''){
			 selectedAssignee = $("#assigneeDropdown").html().trim();
		 }

		 if(selectedUrgencyType==null || selectedUrgencyType.length==''){
			 selectedUrgencyType = $("#urgencyDropdown").html().trim();
		 }

		 return json = {
				 "taskId" : selectedTaskId,
				 "name" : taskName,
				 "description" : taskDescription,
				 "assignee" : selectedAssignee,
				 "startDays" : startDays,
				 "completedDays" : completedDays,
				 "urgency" : selectedUrgencyType
		 };
	 }

	function createTaskRowItem(item){
		var task = '<tr>' +
		'<td>' + item.taskId +  '</td>' +
		'<td>' + item.name + '</td>' +
		'<td>' + item.description + '</td>' +
		'<td>' + item.urgency + '</td>' +
		'<td>' + item.assignee + '</td>' +
		'<td style="text-align: center;">' + item.startDays + '</td>' +
		'<td style="text-align: center;">' + item.completedDays + '</td>' +
		  createTaskIconButtonWith("edit", "#taskModal") +
		  createTaskIconButtonWith("delete", "#deleteTaskModal") +
		'</tr>'
		return task;
	}

	function createTaskIconButtonWith(action, target){
		var icon  = (action=="edit") ? createSpanWith(taskEditIcon) : createSpanWith(deleteIcon);
		var selectorType = (action=="edit") ? 'btn-edit-task' : 'btn-delete-task';

		var taskItemIconButton = '<td class="table-center-icon">' +
		'<button type="button" class="btn btn-link ' + selectorType + "\"" +
		' data-toggle="modal" data-target="' + target + '">' + icon +
		'</button>' + '</td>';
		return taskItemIconButton;
	}

	function createSpanWith(type){
		return "<span class=\"" + type + "\"" +"></span>";
	}


	function createListGroupItemHeader(iconName, headerPanelType, headerName){
		var panelId = findPanelId(headerPanelType);

		var title = (headerName!='') ? " There are no " + headerPanelType + " associated with " + selectedTaskName : " Select a task to view its associated actions, forms, tasks and classifications";

		 $(panelId).hide().html(""+
    			 "<li class=\"list-group-item\"> "
    			 + "<h4>" + createSpanWith(iconName) + title + "</h4>"
    			 + "</li>")
			    .fadeIn('fast');
	}

	function findPanelId(headerPanelType){
		if(headerPanelType=='forms'){
			return associatedFormsPanelId;
		}else if(headerPanelType=='tasks'){
			return associatedTasksPanelId;
		}else if(headerPanelType=='actions'){
			return associatedActionsPanelId;
		}else{
			return associatedClassificationsPanelId;
		}
	}

	$('#addActionModal').on('hidden.bs.modal', function () {
		console.log('selectedTaskId; ' + selectedTaskId);
		 var currentTaskId = {"taskId" : selectedTaskId};
		retrieveAssociatedItemsFor(currentTaskId);
	});


	/**
	 * Classifications Panel - Add New Classification
	 */
	$('#autoAddClassification').on('click', function(){
		 var selectedCondition = $(this).attr("class");
		 var uncheckedSquare = 'fa fa-square-o fa-2x grey';
		 var checkedSquare= 'fa fa-check-square-o fa-2x grey';

		 var attributeValue = (selectedCondition==checkedSquare) ? uncheckedSquare : checkedSquare;

		 $(this).attr("class", attributeValue);

	});


	/**
	 * Create Classification Modal - reset data when initialised
	 */
    $('#createClassificationModal').on('shown.bs.modal', function (event) {
    	$("#enteredClassificationName").focus();
		 $("#enteredClassificationName").text('');
		 $("#enteredClassificationName").val('');
		 $("#enteredClassificationDescription").val('');
		 $("#confirmAddClassificationTask").text('Add classification to ' + selectedTaskName);
	 });

    /**
     * Create Classification Modal - Save
     */
    $('#createClassificationModalSaveButton').on('click', function(event){
    	if($("#enteredClassificationName").val()=='' || $("#enteredClassificationName").val()==''){
    		return;
    	}

    	var autoAddTaskAttributeValue = $("#autoAddClassification").attr("class");
    	console.log('autoAddTaskAttributeValue ' + autoAddTaskAttributeValue);
    	var checkedSquare= 'fa fa-check-square-o fa-2x grey';
    	var addCreatedClassificationToTask = (autoAddTaskAttributeValue==checkedSquare) ? true : false;

    	var result = createClassificationService($("#enteredClassificationName").val(), $("#enteredClassificationDescription").val());
    	afterCreateClassification(result, addCreatedClassificationToTask);
    });

    function afterCreateClassification(result, addCreatedClassificationToTask){
		 result.success(function(data){
			 	var item = {};
			 	item.name = data.model.name;
			 	item.description = data.model.description;

				availableClassifications.push(item);
				availableClassificationsMap[item.name] = item;

			 if(addCreatedClassificationToTask){
				 createAssociatedListGroupItem(data.model.name, associatedClassificationsPanelId, associatedClassificationDeleteActionType, classificationIcon);
				 selectedTaskAssociatedClassifications.push(item);
			 }

			 $('#createClassificationModal').modal('toggle');
		 });
	 }


});



