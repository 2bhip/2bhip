/* **************************************************************

   Copyright 2013 Zoovy, Inc.

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



//    !!! ->   TODO: replace 'username' in the line below with the merchants username.     <- !!!

var _2bhip = function() {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
			
				app.ext._2bhip.a.showDescription();
					app.u.dump("_2bhip showDescription() run");
				return true;
				/*var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).

				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;*/
			},
			onError : function() {
				app.u.dump('BEGIN app.ext._2bhip.callbacks.init.onError');
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			},
			
			startExtension : {
				onSuccess : function() {
					if(app.ext.myRIA && app.ext.myRIA.template){
						app.u.dump("_2bhip Extension Started");
					} else	{
						setTimeout(function(){app.ext._2bhip.callbacks.startExtension.onSuccess()},250);
					}
					app.ext.myRIA.template.homepageTemplate.onCompletes.push(function(P) {
						app.ext._2bhip.u.showMainBanner();	
					})
				},
				onError : function (){
					app.u.dump('BEGIN app.ext._2bhip.callbacks.startExtension.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {

				showReviews : function(pid) {
					var $context = $('#productTemplate_'+app.u.makeSafeHTMLId(pid));
					
					app.u.dump('SHOW REVIEW');
				
					$('.prodSelectSeeReviewButton', $context).animate(1000);
					setTimeout(function() {
						$('.prodSummaryContainer', $context).hide();
						$('.prodReviewContainer', $context).show();
						$('.prodSelectSeeReviewButton', $context).hide();
						$('.prodSelectSeeDescriptionButton', $context).show();
						$('.prodSelectSeeDescriptionButton', $context).unbind();
						$('.prodSelectSeeDescriptionButton', $context).click(app.ext._2bhip.a.showDescription);
					}, 250);
				},
				showDescription : function(pid) {
					var $context = $('#productTemplate_'+app.u.makeSafeHTMLId(pid));
					
					app.u.dump('SHOW DESC');
					
					$('.prodSelectSeeDescriptionButton', $context).animate(1000);
					setTimeout(function() {
						$('.prodReviewContainer', $context).hide();
						$('.prodSummaryContainer', $context).show();
						$('.prodSelectSeeDescriptionButton', $context).hide();
						$('.prodSelectSeeReviewButton', $context).show();
						$('.prodSelectSeeReviewButton', $context).unbind();
						$('.prodSelectSeeReviewButton', $context).click(app.ext._2bhip.a.showReviews);
					}, 250);
				}
				
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {

			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
				
				showMainBanner : function() {
					app.u.dump('showMainBanner just ran');
					$('.mainBannerCarouselCatagories').delay(1000).show();
				}
				
			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}