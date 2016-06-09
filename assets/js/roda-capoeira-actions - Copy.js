
	 /**
	  * Associated Actions
	  */
	 var associatedActionsPanelId = "#associatedActionsList";
	 var selectedTaskAssociatedActions = [];

	 /**
	  * Modal properties
	  */
	 var conditionDeleteActionType = 'btn-delete-action-event-condition';

	 var actionIcon = 'fa fa-cogs fa';
	 var actionEditIcon = 'fa fa-pencil fa';
	 var actionNewIcon = 'fa fa-external-link-square fa';
	 var conditionIconChecked = 'fa fa-check-square-o fa';
	 var conditionIconUnChecked = 'fa fa-square-o fa';

	 var actionEventCompleteIcon = 'fa fa-check-circle fa-2x grey';
	 var actionEventCancelIcon = 'fa fa-ban fa-2x grey';
	 var actionEventCreateIcon = 'fa fa-plus-circle fa-2x grey';

	 /**
	  * Action Event / Condition
	  */
	 var selectedCondition = '';
	 var selectedConditionName = '';

	 var selectedCriteriaType = '';

	 var selectedConditionType = '';
	 var selectedAction = '';


	 /**
	  * Action Modal - Manage Add / Edit Action Requests
	  */

	 $("#addActionModal").on("show.bs.modal", function(e){
		 $("#deleteWarningAlertWindow").hide();
		 $("#actionModalPanelBody").html('');

		 var dataRequestType = e.relatedTarget.attributes.getNamedItem("data-requesttype").value;

		 requestType = (dataRequestType=='new') ? workflowRequestType.CREATE_ACTION : workflowRequestType.EDIT_ACTION;

		 var selectedActionId = e.relatedTarget.attributes.getNamedItem("data-actionId").value;
		 action = {};
		 action.actionConditions = [];

		 //find action
		 if(requestType == workflowRequestType.EDIT_ACTION){
			 $("#deleteAction").show();

			  action = findAction(selectedActionId);

				 console.log('requestType: ' + requestType.value + " " + requestType.name + " actionid: " + action.id + " action name " + action.name + ' actionTaskId ' + action.relatedTaskId);

				 $("#actionEventOptions.btn-group > .btn").each(function(){
					 if($(this).text().trim()==action.name.trim()){
						 toggleSelectedActionName($(this));
					 }
				 });


				 updateEventConditionsHeaderTitle(action.name.trim() + " When <span class=\"fa fa-arrow-circle-right fa\">&nbsp;</span>");

				 for (i=0; i<action.actionConditions.length; i++){
					 createActionEventConditionItem(action.actionConditions[i].description, '#actionModalPanelBody', conditionDeleteActionType, actionIcon);
				 }
		 }else{
			 $("#deleteAction").hide();
		 }

		 $("#addActionModalLabel").html(selectedTaskName);
	 });

	 /**
	  * Action Modal -> Action Event Selection (Complete / Cancel / Create Task)
	  */
	 $("#actionEventOptions.btn-group > .btn").on("click", function(){
		 console.log("clicked button group " + $(this).text());
		 selectedAction = $(this).text();

		 updateEventConditionsHeaderTitle(selectedAction + " When <span class=\"fa fa-arrow-circle-right fa\">&nbsp;</span>");
		 var actionButtonGroup = $(this);

		 toggleSelectedActionName(actionButtonGroup)
	 });

	 function toggleSelectedActionName(actionButtonGroup){
		 actionButtonGroup.attr("class", "btn btn-primary");
		 actionButtonGroup.find("span:first").removeClass("grey").addClass("white");
		 actionButtonGroup.siblings().attr("class", "btn btn-default");
		 actionButtonGroup.siblings().children().removeClass("white").addClass("grey");
	 }

	 /**
	  * Action Modal -> Selection Condition
	  */
	 $("#actionConditions .btn").on("click", function(){
		 var selectedCondition = $(this).find("span:first").attr("class");

		 if(selectedCondition == conditionIconChecked){
			 $(this).find("span:first").attr("class", conditionIconUnChecked);
		 }else if(selectedCondition == conditionIconUnChecked){
			 $.uncheckConditionItems();
			 $(this).find("span:first").attr("class", conditionIconChecked);
		 }

		 selectedConditionName = $(this).closest('td').next().html();

		 console.log('conditionName; ' + selectedConditionName);
		 console.log('selectedCondition; ' + selectedCondition);

		 $("#actionConditionType").children().empty();

		 if(selectedConditionName==='Report Exists'){
			 $("#conditionTypeButton").text("Select Report Type");
			 /**
			  * TODO Create service / model to retrieve report items.
			  */
			 $("#actionConditionType").append("<li> <a href=\"#\"> Report A</a></li>");
			 $("#actionConditionType").append("<li> <a href=\"#\"> Report B</a></li>");
			 $("#actionConditionType").append("<li> <a href=\"#\"> Report C</a></li>");
			 selectedCriteriaType = 'Report';
		 }else{

			 $("#conditionTypeButton").text("Select Task Type");
			 for(i=0; i<availableTasks.length; i++){
				 $("#actionConditionType").append("<li> <a href=\"#\"> " + availableTasks[i].name + "</a></li>");
			 }
			 selectedCriteriaType = 'Task';

		 }
	 });


	 $.uncheckConditionItems = function(){
		 $("#actionConditions td").each(function(){
			 var currentCheckBox = $(this).find("span:first").attr("class");
			 if(currentCheckBox != 'undefined'){
				 $(this).find("span:first").attr("class", conditionIconUnChecked);
			 }
		 })
	 }

	 /**
	  * Action Modal -  Condition Type Dropdown
	  */
	 $("#actionConditionType").on("click", "li a", function(){
		 //console.log('condition type dropdown click; ' + $(this).html());
		    $('#conditionTypeButton').html($(this).text());
		    selectedConditionType = $(this).text();
	 });

	 /**
	  * Action Modal -> Add Condition
	  */
	 $("#addCondition").on("click", function(){
		 if(selectedConditionType =='' && selectedCondition ==''){
			 return;
		 }

		 var actionCondition = createActionCondition();

		 createActionEventConditionItem(actionCondition.description, '#actionModalPanelBody', conditionDeleteActionType, actionIcon);

		 resetConditionItems();

		 updateEventConditionsHeaderTitle(selectedAction + " When <span class=\"fa fa-arrow-circle-right fa\">&nbsp;</span>");
	 });

	 function findAction(selectedActionId){
		 for(var i=0; i<selectedTaskAssociatedActions.length; i++){
			 if(selectedActionId!=null && selectedActionId==selectedTaskAssociatedActions[i].id){
					return selectedTaskAssociatedActions[i];
			 }
		 }
	 }

	 function findTask(taskName){
			for(i=0; i<availableTasks.length; i++){
				 if(availableTasks[i].name == taskName.trim()){
					 console.log('-->findTask(taskName) found match ' + availableTasks[i].name + " " + taskName);
					return availableTasks[i];
				 }
			 };
		 }


	 function createActionCondition(){
		 var conditionIdentity = '';
		 if(selectedCriteriaType=='Task'){
			 var task = findTask(selectedConditionType);
			 console.log('createActionCondition id; ' + task.taskId);
			 conditionIdentity = task.taskId;
		 }

		 var conditionStatus = selectedConditionName.replace('Task','').replace('Report','');

		 var status = findConditionStatusValue(conditionStatus);

		 var actionCondition = new ActionCondition(status, "TASK", conditionIdentity, action.id);

		 var additionalMessageItem = (actionCondition.conditionType == 'TASK') ? " is " : "";
		 var description = selectedConditionType + additionalMessageItem + " " +  findConditionStatusName(conditionStatus);

		 actionCondition.description = description;

		 action.actionConditions.push(actionCondition);

		 return actionCondition;
	 }



	 function resetConditionItems(){
		 $("#conditionTypeButton").text("Condition Type");
		 $("#actionConditionType").children().empty();
		 $.uncheckConditionItems();
		 selectedCondition = '';
		 selectedConditionType = '';
		 selectedConditionName = '';
	 }

	 function updateEventConditionsHeaderTitle(headerTitleMessage){
		 $("#eventsConditionsPanelHeading").html("<h4>" + headerTitleMessage + "</h4>");
	 }


	 function createListActionItem(associatedAction, index){
		 console.log('creating list item; ' + index);
		 var listItem = createActionItemForTaskSelectionView(associatedAction, index);
		 $(associatedActionsPanelId).append(listItem).children(':last').hide().fadeIn(500);
    	 updateAssociatedListGroupItemHeaderIfRequired(associatedActionsPanelId, actionIcon, "a");
	 }

	 function createActionItemIconFromEventType(eventType){
		 var iconType = (eventType == 'Complete Task') ? actionEventCompleteIcon : ((eventType == 'Cancel Task') ? actionEventCancelIcon : actionEventCreateIcon);
		 return createSpanWith(iconType);
	 }

	 function createActionButtonWith(iconType, text, buttonType, actionId){
		 var target = " data-toggle=\"modal\" data-target=\"#addActionModal\" ";

		 var id =  (text=="New Action") ? "id=\"addAction\"" + " data-requesttype=\"new\" " : "id=\"editAction\"" + " data-requesttype=\"edit\" ";

		 var dataActionId = " data-actionId=\"" + actionId + " \"";

		 return "</div><div class=\"col-md-2 text-center\">" +
			"<button type=\"submit\" " + id + dataActionId +  target + " class=\"btn btn-" + buttonType + "\">" +
			 createSpanWith(actionEditIcon) + " " + text +
			"</button></div>";
	 }


	 function createActionItemForTaskSelectionView(associatedAction, index){

		 var actionItem = "<a href=\"#\" class=\"list-group-item\">";

		 var associatedActionName = (associatedAction!=null && associatedAction.name!=null) ? associatedAction.name.trim() : '';
		 var actionItemMainIcon = "<div class=\"col-md-1\">" + "<div class=\"pull-left\">" + createActionItemIconFromEventType(associatedActionName ) + "</div></div>";

		 var actionItemEventConditionItems = "<div class=\"col-md-11\">";

		 var actionTitle = "<h4 class=\"list-group-item-heading\">" + associatedAction.name + "</h4>";

		 var eventConditions = "";

		 if(associatedAction.actionConditions!=null){
			 for (n=0; n<associatedAction.actionConditions.length; n++){
				 eventConditions += "<p class=\"list-group-item-text\">" + associatedAction.actionConditions[n].description + "</p>";
			 }
		 }

		 var editButton =  createActionButtonWith(actionEditIcon, "Edit", "success", associatedAction.id);

		 var endActionItem = "</div></a>";

		return actionItem + actionItemMainIcon + actionItemEventConditionItems + actionTitle
		+ eventConditions  + editButton + endActionItem;

	 }

	 /**
	  * TODO Refactor Duplicate
	  * @returns {String}
	  */
	 function appendActionItemButton(){
		 var actionItem = "<a href=\"#\" class=\"list-group-item\">";

		 var actionItemMainIcon = "<div class=\"col-md-1\">" + "<div class=\"pull-left\">" +  "</div></div>";

		 var actionItemEventConditionItems = "<div class=\"col-md-11\">";

		 var actionTitle = "<h4 class=\"list-group-item-heading\">"  + "</h4>";

		 var actionNewButton = createActionButtonWith(actionNewIcon, "New Action", "primary");

		 var endActionItem = "</div></a>";

		return actionItem + actionItemMainIcon + actionItemEventConditionItems + actionTitle
		  + actionNewButton + endActionItem;
	 }

	 /**
	  * List group items
	  */
	 function createActionEventConditionItem(itemName, panelId, actionEventType, iconType){
		 var listItem = createConditionItemWithDeleteButton(itemName, actionEventType);
		 $(panelId).append(listItem).children(':last').hide().fadeIn(500);
	 }

	 function createConditionItemWithDeleteButton(listItemName, classAttribute){
		 return "<li class=\"list-group-item\">" + listItemName + '<button type="button" class="btn btn-link pull-right '
		 + classAttribute + '"'  + '>' + createSpanWith(deleteIcon) + '</button>' + " </li>";
	 }


	 function updateAssociatedListGroupItemHeaderIfRequired(panelId, iconType, selectorTag){
		 if ( selectedTaskAssociatedActions.length > 0 ) {
			 var header =  "<h4> " + createSpanWith(iconType) + " " + selectedTaskName + " </h4>";
			 $(panelId + " li").first().html(header);
		 }
	 }



	 /**
	  * TODO REMOVE DUPLICATE FUNCTION
	  * @param type
	  * @returns {String}
	  */
	 function createSpanWith(type){
			return "<span class=\"" + type + "\"" +"></span>";
	}


	 /**
	  * Delete Action Event Condition TODO Refactor function too long
	  */
	 $('#actionModalPanelBody').on('click', 'li .btn.btn-link.pull-right.btn-delete-action-event-condition', function(){
		 var selectedConditionToDelete = $(this).closest("li");

		 var taskName = findTaskNameFromActionConditionItem(selectedConditionToDelete.text());

		 if(taskName==null){
			 return;
		 }

		 printActionConditions();

		 var currentConditionStatus = findConditionStatusFromActionConditionItem(selectedConditionToDelete.text());

		 console.log('found condition status ' + currentConditionStatus);

		 //var task = findTask(taskName.trim());

		 if(currentConditionStatus && taskName.trim()){
			 var status = findConditionStatusValue(currentConditionStatus);


			 var parentTask = findTask(taskName.trim());
			 var taskId = -1;

			 if(parentTask!=null){
				taskId = parentTask.taskId;
				console.log('parent taskId: ' + taskId);
			 }

			 var index = findActionConditionItemWith(taskId, status);

			 console.log('index to delete: ' + index);

			 action.actionConditions.splice(index, 1);

			 /**
			  * TODO Create service to delete 'action condition item' from database when user is editing the action
			  */
			 if(index > -1){
				 selectedConditionToDelete.fadeOut(300, function(){
					 selectedConditionToDelete.remove();
					 updateActionConditionsHeaderIfRequired();
				 });
			 }

		 }


	 });

	 function updateActionConditionsHeaderIfRequired(){
		 if(action!=null && action.actionConditions.length == 0){
			 var actionConditionsHeaderTitle = "<span class=\"fa fa-chain-broken fa\">&nbsp;</span> No events and conditions have been defined";
			 updateEventConditionsHeaderTitle(actionConditionsHeaderTitle);
		 }
	 }

	 function findActionConditionItemWith(taskId, conditionStatus){
		 for(i=0; i<action.actionConditions.length; i++){
			 console.log('action.actioncondition item; ' + action.actionConditions[i].conditionIdentity + ' matching taskId? ' + taskId);
			 console.log('action.actioncondition item; ' + action.actionConditions[i].conditionStatus + ' matching taskName? ' + conditionStatus);
			 if (action.actionConditions[i].conditionIdentity==taskId && action.actionConditions[i].conditionStatus == conditionStatus){
				 return i;
			 }
		 }

		 return -1;
	 }

	 function actionForTaskAlreadyExists(actionName){
		 for(i=0; i<selectedTaskAssociatedActions.length; i++){
			 if(selectedTaskAssociatedActions[i].name==actionName){
				 return true;
			 }
		 }
		 return false;
	 }


	 function findTaskNameFromActionConditionItem(conditionEvent){
			  $.each(conditionStatusLabelItems, function(item, value){
				 console.log("condition status item " + item + " value " + value);
				 conditionEvent = conditionEvent.replace(value, '');
			 });

			 return conditionEvent.replace('is','');
	 }

	 function findConditionStatusFromActionConditionItem(conditionEvent){
		 var itemFound = '';

		 $.each(conditionStatusLabelItems, function(item, value){
			 console.log("condition status item " + item + " value " + value);
			 var pattern = new RegExp(value);
			 var result = pattern.test(conditionEvent);

			 if(result==true){
				return itemFound = value;
			 }
		 });

		 return itemFound;
	 }



	 /**
	  * TODO Save action. TODO Refactor function too long.
	  */
	 $("#saveAction").on("click",function(){

		 if(requestType == workflowRequestType.CREATE_ACTION){

			 if(actionForTaskAlreadyExists(selectedAction)){
				 console.log('action already exists; ');
				 return;
			 }

			 action.name = selectedAction;
			 action.conditions = [];
			 action.relatedTaskId = selectedTaskId;

			 console.log('action event ' + action.event + ' actionTaskId ' + action.taskId);

			 for(i=0; i<actionConditions.length; i++){
				 action.actionConditions.push(actionConditions[i]);
			 }
		 }


		 console.log('-----saving action-----'  + action.name);
		 console.log('action name '  + action.name);
		 console.log('action id '  + action.id);
		 console.log('action relatedTaskId '  + action.relatedTaskId);

		if(action.id=='undefined')action.id=0;

		 var associatedAction = {
				 "name" : action.name.trim(),
		 		 "taskId" : action.relatedTaskId,
		 		 "actionConditions" : action.actionConditions,
		 		 "id": action.id
		 };

		 var result = null;
		 if(requestType == workflowRequestType.CREATE_ACTION){
			 result = createAssociatedActionService(associatedAction);
		 }else{
			 result = saveAssociatedActionService(associatedAction);
		 }

		 afterSaveDeleteAction(result);

	 });

	 $("#deleteAction").on("click", function(){
		 $("#deleteWarningAlertWindow").show();
	 });

	 $("#addActionModal #deleteConfirmed").on("click", function(){
		 var associatedAction = {
				 "name" : action.name.trim(),
		 		 "taskId" : action.relatedTaskId,
		 		 "actionConditions" : action.actionConditions,
		 		 "id": action.id
		 };

		 var result = deleteAssociatedActionService(associatedAction);
		 afterSaveDeleteAction(result);
	 });

	 $("#deleteUnconfirmed").on("click", function(){
		 $("#deleteWarningAlertWindow").hide();
	 });



	 function afterSaveDeleteAction(result){
		 result.success(function (data){
			 $('#addActionModal').modal('toggle');
			 resetActionConditions();

		 });
	 }

	 $("#closeActionModal").on("click", function(){
		 console.log('reset actions ');
		 resetActionConditions();
		 updateAssociatedListGroupItemHeaderIfRequired();
	 })

	 function resetActionConditions(){
		 action = {};
		 action.actionConditions = [];
		// selectedTaskAssociatedActions = [];
		 updateActionConditionsHeaderIfRequired();
	 }

	 function printActionConditions(){
		 for(i=0; i < action.actionConditions.length; i++){
				console.log('actionCondition # ' + i + " of " + action.actionConditions.length);
				console.log('actionConditions condition ' + action.actionConditions[i].conditionStatus);
				console.log('actionConditions type ' + action.actionConditions[i].conditionType);
				console.log('actionConditions id ' + action.actionConditions[i].conditionIdentity);
			}
	 }
