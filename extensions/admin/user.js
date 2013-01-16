/* **************************************************************

   Copyright 2011 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */





var admin_user = function() {
	var theseTemplates = new Array('userManagerPageTemplate','userManagerUserRowTemplate','userManagerRoleRowTemplate','userManagerUserCreateUpdateTemplate');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = true; //return false if extension won't load for some reason (account config, dependencies, etc).

				app.model.fetchNLoadTemplates(app.vars.baseURL+'extensions/admin/user.html',theseTemplates);
				app.rq.push(['css',0,app.vars.baseURL+'extensions/admin/user.css','user_styles']);

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		a : {
//This is how the task manager is opened. Just execute this function.
// later, we may add the ability to load directly into 'edit' mode and open a specific user. not supported just yet.
			showUserManager : function() {
				app.u.dump("BEGIN admin_user.a.showUserManager");
				var $tabContent = $(app.u.jqSelector('#',app.ext.admin.vars.tab+"Content"));
//generate some of the task list content right away so the user knows something is happening.
				$tabContent.empty();
				$tabContent.append(app.renderFunctions.createTemplateInstance('userManagerPageTemplate',{'id':'userManagerContent'})); //placeholder
				$('#userManagerContent').showLoading();
				app.ext.admin.calls.bossRoleList.init({},'mutable'); //have this handy.
				app.ext.admin.calls.bossUserList.init({'callback':'translateSelector','extension':'admin','selector':'#userManagerContent'},'mutable');
				app.model.dispatchThis('mutable');
				} //showTaskManager
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		renderFormats : {}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		u : {
//mode is optional.  If not passed, it'll toggle. valid modes are list and detail.
//list mode will toggle the detail column OFF and expand the list column to 100%.
//detail mode will toggle the detail column ON and shrink the list column to 65%.
			toggleDualMode : function($parent,mode)	{
				var $L = $("[data-app-role='dualModeList']",$parent), //List column
				$D = $("[data-app-role='dualModeDetail']",$parent), //detail column
				numDetailPanels = $D.children().length,
				$btn = $("[data-app-event='admin_user|toggleDualMode']",$parent);
				
				if(mode)	{}
				else if($parent.data('app-mode') == 'list')	{mode = 'detail'}
				else if($parent.data('app-mode') == 'detail')	{mode = 'list'}
				else	{} //invalid mode. error handled below.

//go into detail mode. This expands the detail column and shrinks the list col. 
//this also toggles a specific class in the list column off
				
				app.u.dump(" -> mode: "+mode);
				
				if(mode == 'detail')	{
					$btn.show().button('destroy').button({icons: {primary: "ui-icon-seek-prev"},text: false});
					$parent.data('app-mode','detail');
					$L.animate({width:"49%"},1000); //shrink list side.
					$D.show().animate({width:"49%"},1000); //expand detail side.
					$('.hideInDetailMode',$L).hide(); //adjust list for minification.
//when switching from detail to list mode, the detail panels collapse. re-open them IF they were open when the switch to list mode occured.
					if(numDetailPanels)	{
						$('.ui-widget-anypanel',$D).each(function(){
							if($(this).anypanel('option','state') == 'expand' && !$('.ui-widget-content',$(this)).is(':visible')){
								$(this).anypanel('expand');
								}
							});						
						}
					}
				else if (mode == 'list')	{
					$btn.button('destroy').button({icons: {primary: "ui-icon-seek-next"},text: false});
					$parent.data('app-mode','list');
//if there are detail panels open, shrink them down but show the headers.
					if(numDetailPanels)	{
						$L.animate({width:"84%"},1000); //shrink list side.
						$D.show().animate({width:"14%"},1000); //expand detail side.
						$btn.show();
						$('.ui-widget-anypanel',$D).each(function(){
							$(this).anypanel('collapse',true)
							});
						}
//there are no panels open in the detail column, so expand list to 100%.
					else	{
						$L.animate({width:"100%"},1000); //shrink list side.
						$D.show().animate({width:0},1000); //expand detail side.
						$btn.hide();
						}
					
					$('.hideInDetailMode',$L).show(); //adjust list for minification.
					}
				else	{
					app.u.throwGMessage("In admin_user.u.toggleDisplayMode, invalid mode ["+mode+"] passed. only list or detail are supported.");
					}
				
				}, //toggleDualMode

			emptyUsersTable : function()	{
				$("[data-app-role='dualModeListContents']","#userManagerContent").empty();
				},

			getRoleCheckboxesAsArray : function($parent)	{
				var roles = new Array();
				if($parent && $parent.length)	{
					$(":checkbox",$parent).each(function(){
						var $cb = $(this);
						if($cb.is(':checked'))	{roles.push($cb.attr('name'))}
						else	{} //not checked. do nothing.
						});
					}
				else	{
					roles = false;
					app.u.throwGMessage("In admin_users,u.getRoleCheckboxesAsArray, $parent not specified or does not exist on the DOM.");					
					}
				return roles;
				}
			}, //u

		e : {

			"toggleDualMode" : function($btn)	{
				$btn.button({icons: {primary: "ui-icon-seek-next"},text: false});
				$btn.hide(); //editor opens in list mode. so button is hidden till detail mode is activated by edit/detail button.
				$btn.off('click.toggleDualMode').on('click.toggleDualMode',function(event){
					event.preventDefault();
					app.ext.admin_user.u.toggleDualMode($('#userManagerContent'));
					});
				}, //toggleDualMode

			"roleListEdit" : function($this)	{
				app.u.dump("BEGIN admin_users.e.roleListEdit");
				$this.sortable({ handle: ".handle" });
				}, //roleListEdit


			"bossUserUpdateSave" : function($btn)	{
				$btn.button();
				$btn.off('click.bossUserUpdateSave').on('click.bossUserUpdateSave',function(event){
					event.preventDefault();
					app.u.dump("BEGIN admin_user.e.bossUserUpdateSave");
					var $panel = $(this).closest('.ui-widget-anypanel'),
					updateObject = {'uid':$panel.data('uid'),'roles':app.ext.admin_user.u.getRoleCheckboxesAsArray($panel)}
//add all CHANGED attributes to the update object.
					$(".edited",$panel).each(function(){
						app.u.dump(" -> $(this).attr('name'): "+$(this).attr('name'));
						updateObject[$(this).attr('name')] = $(this).val();
						});
					app.u.dump(" -> updateObject: "); app.u.dump(updateObject);
					$("#userDetail_"+uid).showLoading();
					app.model.destroy('bossUserList'); //clear local so a dispatch occurs.
					app.ext.admin_user.u.emptyUsersTable();  //empty list of users so that changes are reflected.
					app.ext.admin.calls.bossUserUpdate.init(updateObject,{'callback':'translateSelector','extension':'admin','selector':"#userDetail_"+uid},'immutable');
					app.ext.admin.calls.bossUserList.init({'callback':'translateSelector','extension':'admin','selector':"#userManagerContent [data-app-role='dualModeList']"},'immutable');
					app.model.dispatchThis('immutable');
					});
				},

/*
the create and update template is recycled. the button has the same app event, but performs a different action based on whether or not a save or update is being perfomed.
Whether it's a create or update is based on the data-usermode on the parent.
*/
			"bossUserCreateSave" : function($btn){
				$btn.button();
				$btn.off('click.bossUserCreateUpdateSave').on('click.bossUserCreateUpdateSave',function(event){
					event.preventDefault();
					app.u.dump("BEGIN admin_user.e.bossUserCreateUpdateSave");
					var $parent = $('#bossUserCreateModal'),
					frmObj = $(this).closest("form").serializeJSON(); //used to generate roles array and also sent directly as part of create. not used in update.
					
					if($.isEmptyObject(frmObj))	{
						app.u.throwGMessage('In admin_user.e.bossUserCreateUpdateSave, unable to locate form object for serialization or serialized object is empty.');
						}
					else {
						$parent.showLoading();

//build an array of the roles that are checked. order is important.
						frmObj['@roles'] = app.ext.admin_user.u.getRoleCheckboxesAsArray($parent);
						$(":checkbox",$parent).each(function(){
							delete frmObj[$(this).attr('name')]; //remove from serialized form object. params are/may be whitelisted.
							});

						app.model.destroy('bossUserList');
						app.ext.admin.calls.bossUserCreate.init(frmObj,{'callback':function(rd){ //rd is responseData.
							if(app.model.responseHasErrors(rd)){
								$parent.animate({scrollTop: 0}, 'slow'); //scroll to top of modal div to messaging appears. not an issue on success cuz content is emptied.
								rd.parentID = 'bossUserCreateModal'; //set so errors appear in modal.
								app.u.throwMessage(rd);
								}
							else	{
								var msg = app.u.successMsgObject("User has been created!");
								msg.parentID = 'bossUserCreateModal';
								$parent.empty(); //only empty if no error occurs. That way user can correct and re-submit.
								app.u.throwMessage(msg);
								$( ".selector" ).dialog( "option", "buttons", [ { text: "Close", click: function() { $( this ).dialog( "close" ); }} ] );
								}
							$parent.hideLoading();
							}},'immutable');
						app.ext.admin.calls.bossUserList.init({'callback':'translateSelector','extension':'admin','selector':"#userManagerContent [data-app-role='dualModeList']"},'immutable');
						app.model.dispatchThis('immutable');
						}
					});
				}, //bossUserCreateUpdateSave
			
			"bossUserUpdate" : function($btn){
				$btn.button({icons: {primary: "ui-icon-pencil"},text: false}); //ui-icon-pencil
				$btn.off('click.bossUserUpdate').on('click.bossUserUpdate',function(event){
					event.preventDefault();
//					app.u.dump("BEGIN admin_user.e.bossUserUpdate click event");

					var $target = $("[data-app-role='dualModeDetail']","#userManagerContent"),
					index = $(this).closest('tr').data('obj_index');
					user = app.data.bossUserList['@USERS'][index];
					user['@ROLES'] = {};

					$.extend(user['@ROLES'],app.data.bossRoleList['@ROLES']);

//					app.u.dump(" -> user object["+index+"]: "); app.u.dump(user);
					if(!$.isEmptyObject(user))	{
					//see bossUserCreateUpdateSave app event to see what usermode is used for.

var panelID = app.u.jqSelector('','userDetail_'+user.uid),
$panel = $("<div\/>").data('uid',user.uid).hide().anypanel({
	'title':'Edit: '+user.uid,
	'templateID':'userManagerUserCreateUpdateTemplate',
//	'data':user, //data not passed because it needs req and manipulation prior to translation.
	'dataAttribs': {'id':panelID,'uid':user.uid,'usermode':'update'}
	}).prependTo($target);

//adds the save button to the bottom of the form. not part of the template because the template is shared w/ create.
var $saveButton = $("<button \/>").attr('data-app-event','admin_user|bossUserUpdateSave').html("Save <span class='numChanges'></span> Changes").button({'disabled':true});
$('form',$panel).append($saveButton);
app.ext.admin.u.handleAppEvents($panel);
$panel.slideDown('slow');


app.calls.bossUserDetail.init(user.luser,{
	'callback':function(rd){

		if(app.model.responseHasErrors(rd)){
			$parent.animate({scrollTop: 0}, 'slow'); //scroll to top of modal div to messaging appears. not an issue on success cuz content is emptied.
			rd.parentID = 'bossUserCreateModal'; //set so errors appear in modal.
			app.u.throwMessage(rd);
			}
		else	{		
			
			var userData = app.data[rd.datapointer];
			userData.myRoles = userData['@roles']; //have to merge in bossRoleList which also has @roles. so rename to preserve data.
			$.extend(userData,app.data.bossRoleList);
			$('#'+panelID).append(app.renderFunctions.translateSelector('#'+panelID),userData);
			
			$("[data-app-role='roleList']",$panel).sortable({ handle: ".handle" });
			$(":input",$panel).off('change.trackChange').on('change.trackChange',function(){
				$(this).addClass('edited');
				$('.numChanges',$panel).text($(".edited",$panel).length);
				$saveButton.button('enable').addClass('ui-state-highlight');
				});
			}
		}
	},'mutable');
app.model.dispatchThis('mutable');
						}
//append detail children before changing modes. descreases 'popping'.
					app.ext.admin_user.u.toggleDualMode($('#userManagerContent'),'detail');

					});
				},
			
			"bossUserDelete" : function($btn)	{
				$btn.button({icons: {primary: "ui-icon-trash"},text: false});
				$btn.off('click.bossUserCreate').on('click.bossUserCreate',function(event){
					event.preventDefault();
					var data = $(this).closest('tr').data(),
					$D = $("<div \/>").attr('title','Delete User').append("Are you sure you want to delete user <b>"+(data.fullname || data.luser)+"<\/b>? This action can not be undone.");

					$D.dialog({
resizable: false,
modal: true,
buttons: {
	"Delete User": function() {
		app.model.destroy('bossUserList'); //clear local so a dispatch occurs.
		app.ext.admin_user.u.emptyUsersTable();  //empty list of users so that changes are reflected.
		app.ext.admin.calls.bossUserDelete.init(data.uid,{},'immutable');
		app.ext.admin.calls.bossUserList.init({'callback':'translateSelector','extension':'admin','selector':"#userManagerContent [data-app-role='dualModeList']"},'immutable');
		app.model.dispatchThis('immutable');
		},
	Cancel: function() {$( this ).dialog( "close" ).empty().remove();}
	}
        });
					});
				
				},
			
			"bossUserCreate" : function($btn){
				$btn.button();
				$btn.off('click.bossUserCreate').on('click.bossUserCreate',function(event){
					event.preventDefault();
					var $target = $('#bossUserCreateModal');
					if($target.length)	{$target.empty();}
					else	{
						$target = $("<div \/>").attr({'id':'bossUserCreateModal','title':'Create User'});
						$target.appendTo("body");
						$target.dialog({width:500,height:600,autoOpen:false,modal:true});
						}
					$target.dialog('open');
					//see bossUserCreateUpdateSave app event to see what usermode is used for.
					$target.append(app.renderFunctions.transmogrify({'id':'bossUserCreateContent','usermode':'create'},'userManagerUserCreateUpdateTemplate',app.data.bossRoleList)); //populate content.
					//adds the save button to the bottom of the form. not part of the template because the template is shared w/ create.
					$('form',$target).append("<button data-app-event='admin_user|bossUserCreateSave' class='alignCenter'>Create User</button>");

					app.ext.admin.u.handleAppEvents($target);
					});
				}
			}
		} //r object.
	return r;
	}