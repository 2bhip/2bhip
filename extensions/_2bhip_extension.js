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

var store_filter = function() {
	var theseTemplates = new Array('');
	var r = {
		
		vars : {
			'templates' : []
		},
		
						////////////////////////////////////   CALLS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\		


//store_search contains the maintained elastic query search. use that.
	calls : {}, //calls
//key is safe id. value is name of the filter form.
	filterMap : {

		".t_shirts.80s_t_shirts":{
			"filter": "tShirtsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			}/*,
			".00027-metal-chess-pieces":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00024-marble-onyx-chess-sets.marble-onyx-chess-pieces":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00020-plastic-chess-sets":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00029-theme-chess-pieces":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00055-unfinished-chess-sets":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00022-jaques-london-chess-sets":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".00033-artisan-hand-carved-chess-sets":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},
			".000295-most-unique-chess-pieces":{
			"filter": "chessPiecesForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:500});}
			},*/
		},
		

////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
			
			
				app.ext.store_filter.u.runCarousels();
				app.ext.store_filter.a.showDescription();
					app.u.dump("_2bhip showDescription() run");
				app.ext.store_filter.a.cartSpinner();
				/*app.ext._2bhip.a.connect();*/
					app.u.dump('connect() run');
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
						app.ext.myRIA.template.cartTemplate.onCompletes.push(function(P) {     
							var $context =  $('#cartTemplate');
							$('.qtyInput', $context).spinner();
						});

					} else	{
						setTimeout(function(){app.ext.store_filter.callbacks.startExtension.onSuccess()},250);
					}
					//was here to show hidden divs onComplete, but now is just here for future reference
					app.ext.myRIA.template.homepageTemplate.onCompletes.push(function(P) {
						app.ext.store_filter.u.showMainBanner();	
					})
				},
				onError : function (){
					app.u.dump('BEGIN app.ext._2bhip.callbacks.startExtension.onError');
				}
			}
		}, //callbacks
		
		
////////////////////////////////////   getFilterObj    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		getElasticFilter : {

			slider : function($fieldset){
				var r = false; //what is returned. Will be set to an object if valid.
				var $slider = $('.slider-range',$fieldset);
				if($slider.length > 0)	{
					r = {"range":{}}
//if data-min and/or data-max are not set, use the sliders min/max value, respectively.
					r.range[$fieldset.attr('data-elastic-key')] = {
						"from" : $slider.slider('values', 0 ) * 100,
						"to" : $slider.slider("values",1) * 100
						}
					}
				else	{
					app.u.dump("WARNING! could not detect .ui-slider class within fieldset for slider filter.");
					}
				return r;
				}, //slider

			hidden : function($fieldset){
				return app.ext.store_filter.u.buildElasticTerms($("input:hidden",$fieldset),$fieldset.attr('data-elastic-key'));
				},
			checkboxes : function($fieldset)	{
				return app.ext.store_filter.u.buildElasticTerms($(':checked',$fieldset),$fieldset.attr('data-elastic-key'));
				} //checkboxes

			}, //getFilterObj


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
						$('.prodSelectSeeDescriptionButton', $context).click(app.ext.store_filter.a.showDescription);
					}, 250);
				}, //END showReviews
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
						$('.prodSelectSeeReviewButton', $context).click(app.ext.store_filter.a.showReviews);
					}, 250);
				}, //END showDescription
				
				cartSpinner : function() {
					var spinner = $('#spinner').spinner();
				},


	/*Spinner functions that don't work correctly.
				connect : function() {
					$(".cartQty div").append('<div class="inc spinButton">+</div><div class="dec spinButton">-</div>');
				},
				
				spinner : function() {
					$(".spinButton").click(function() {
					var $spinButton = $(this);
					var oldValue = $spinButton.parent().find("input").val();
				
					if ($spinButton.text() == "+") {
						var newVal = parseFloat(oldValue) + 1;
						app.u.dump('plus 1');
					  	// AJAX save would go here
					}	else {
				    	// Don't allow decrementing below zero
				    	if (oldValue >= 1) {
							var newVal = parseFloat(oldValue) - 1;
							app.u.dump('minus 1');
							// AJAX save would go here
						}
					}
					$spinButton.parent().find("input").val(newVal);
				});}
	*/			
	
			execFilter : function($form,$page){

app.u.dump("BEGIN store_filter.a.filter");
var $prodlist = $("[data-app-role='productList']",$page).first().empty();


$('.categoryList',$page).hide(); //hide any subcategory lists in the main area so customer can focus on results
$('.categoryText',$page).hide(); //hide any text blocks.

if(app.ext.store_filter.u.validateFilterProperties($form))	{
//	app.u.dump(" -> validated Filter Properties.")
	var query = {
		"mode":"elastic-native",
		"size":50,
		"filter" : app.ext.store_filter.u.buildElasticFilters($form)
		}//query
//	app.u.dump(" -> Query: "); app.u.dump(query);
	if(query.filter.and.length > 0)	{
		$prodlist.addClass('loadingBG');
		app.ext.store_search.calls.appPublicProductSearch.init(query,{'callback':function(rd){

			if(app.model.responseHasErrors(rd)){
				$page.anymessage({'message':rd});
				}
			else	{
				var L = app.data[rd.datapointer]['_count'];
				$prodlist.removeClass('loadingBG')
				if(L == 0)	{
					$page.anymessage({"message":"Your query returned zero results."});
					}
				else	{
					$prodlist.append(app.ext.store_search.u.getElasticResultsAsJQObject(rd));
					}
				}

			},'datapointer':'appPublicSearch|elasticFiltering','templateID':'productListTemplateResults'});
		app.model.dispatchThis();
		}
	else	{
		$page.anymessage({'message':"Please make some selections from the list of filters"});
		}
	}
else	{
	$page.anymessage({"message":"Uh Oh! It seems an error occured. Please try again or contact the site administator if error persists."});
	}
$('html, body').animate({scrollTop : 0},200); //new page content loading. scroll to top.


				},//filter
	
	
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
				//was here to show hidden divs onComplete, but now is just here for future reference
				showMainBanner : function() {
					app.u.dump('showMainBanner just ran');
					$('.mainBannerCarouselCatagories').show();
				},
				
				
//pass in form as object.  This function will verify that each fieldset has the appropriate attributes.
//will also verify that each filterType has a getElasticFilter function.
			validateFilterProperties : function($form)	{
				var r = true, //what is returned. false if form doesn't validate.
				$fieldset, filterType; //recycled.

				$('fieldset',$form).each(function(index){
					$fieldset = $(this);
					filterType = $fieldset.attr('data-filtertype');
					if(!filterType)	{
						r = false;
						$form.anymessage({"message":"In store_filters.u.validateFilterProperties,  no data-filtertype set on fieldset. can't include as part of query. [index: "+index+"]",gMessage:true});
						}
					else if(typeof app.ext.store_filter.getElasticFilter[filterType] != 'function')	{
						r = false;
						$form.anymessage({"message":"WARNING! type ["+filterType+"] has no matching getElasticFilter function. [typoof: "+typeof app.ext.store_filter.getElasticFilter[filterType]+"]",gMessage:true});
						}
					else if(!$fieldset.attr('data-elastic-key'))	{
						r = false;
						$form.anymessage({"message":"WARNING! data-elastic-key not set for filter. [index: "+index+"]",gMessage:true});
						}
					else	{
						//catch.
						}
					});
				return r;
				},


			buildElasticFilters : function($form)	{

var filters = {
	"and" : [] //push on to this the values from each fieldset.
	}//query


$('fieldset',$form).each(function(){
	var $fieldset = $(this),
	filter = app.ext.store_filter.getElasticFilter[$fieldset.attr('data-filtertype')]($fieldset);
	if(filter)	{
		filters.and.push(filter);
		}
	});
//and requires at least 2 inputs, so add a match_all.
//if there are no filters, don't add it. the return is also used to determine if any filters are present
	if(filters.and.length == 1)	{
		filters.and.push({match_all:{}})
		}
return filters;				

				},

//pass in a jquery object or series of objects for form inputs (ex: $('input:hidden')) and a single term or a terms object will be returned.
//false is returned in nothing is checked/selected.
//can be used on a series of inputs, such as hidden or checkbox 
			buildElasticTerms : function($obj,attr)	{
				var r = false; //what is returned. will be term or terms object if valid.
				if($obj.length == 1)	{
					r = {term:{}};
					r.term[attr] = $obj.val().toLowerCase();
					}
				else if($obj.length > 1)	{
					r = {terms:{}};
					r.terms[attr] = new Array();
					$obj.each(function(){
						r.terms[attr].push($(this).val().toLowerCase());
						});
					}
				else	{
					//nothing is checked.
					}
				return r;
				},


			renderSlider : function($form, infoObj, props){
				$( ".slider-range" ).slider({
					range: true,
					min: props.MIN,
					max: props.MAX,
					values: [ props.MIN, props.MAX ],
					stop : function(){
						$form.submit();
						},
					slide: function( event, ui ) {
						$( ".sliderValue",$form ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
						}
					});
				$( ".sliderValue",$form ).val( "$" + $( ".slider-range" ).slider( "values", 0 ) + " - $" + $( ".slider-range" ).slider( "values", 1 ) );
				}, //renderSlider
				
				
//CAROUSEL FUNCTIONS
			runCarousels : function() {
				app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(p){
					//mainBanner Carousel horizontal sliders
					var mainBannerCarousel;
						function foo(){ $(".mainBannerCarousel").carouFredSel({
							width   : 936,
							height  : 300,
							items   : 1,
							scroll: 1,
							auto : false,
							prev : "#mainBannerCarouselButtonPrev",
							next : "#mainBannerCarouselButtonNext",
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					}
					mainBannerCarousel = foo;
					setTimeout(mainBannerCarousel, 2000);
					
					
					//subcatagories Carousel horizontal sliders
					var carousel2;
						function foo2(){ $(".subCarouselCategoryContainer").carouFredSel({
							width   : 883,
							height  : 160,
							items   : 3,
							scroll: 3,
							auto : false,
							prev : "#subButtonPrev",
							next : "#subButtonNext",
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					}
					carousel2 = foo2;
					setTimeout(carousel2, 2000); 
					
					
					//Best Selling Items Carousel horizontal sliders
					var carousel3;
						function foo3(){ $(".homePageTempCarousel1").carouFredSel({
							width    : 956,
							height 	 : 305,
							items    : 4,
							scroll   : 4,
							/*auto     : {
										delay : 1,
										items : 4,
										duration : 9
							}*/
							auto	 : false,
							prev : {
								button : "#homeCarButtonPrev1",
								key    : "left"
							},
							next : {
								button : "#homeCarButtonNext1",
								key	   : "right"
							},
							pagination: "#homePaginationContainer1",
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					}
					carousel3 = foo3;
					setTimeout(carousel3, 2000); 	
					
					
					//New Arrivals Carousel horizontal sliders
					var carousel4;
						function foo4(){ $(".homePageTempCarousel12").carouFredSel({
							width    : 960,
							height 	 : 305,
							items    : 4,
							scroll   : 4,
							auto	 : false,
							prev : {
								button : "#homeCarButtonPrev2",
								key    : "left"
							},
							next : {
								button : "#homeCarButtonNext2",
								key	   : "right"
							},
							pagination: "#homePaginationContainer2",
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					}
					carousel4 = foo4;
					setTimeout(carousel4, 2000); 
					
					
					//FREE SHIPPING! Carousel horizontal sliders
					var carousel5;
						function foo5(){ $(".homePageTempCarousel13").carouFredSel({
							width    : 960,
							height 	 : 305,
							items    : 4,
							scroll   : 4,
							auto	 : false,
							prev : {
								button : "#homeCarButtonPrev3",
								key    : "left"
							},
							next : {
								button : "#homeCarButtonNext3",
								key	   : "right"
							},
							pagination: "#homePaginationContainer3",
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					}
					carousel5 = foo5;
					setTimeout(carousel5, 2000); 
					
					
					//Similar Items Carousel on Product Details page horizontal sliders
					var carousel6;
						function foo6(){ $(".prodDetailTempCarousel1").carouFredSel({
							width    : 960,
							height 	 : 305,
							items    : 4,
							scroll   : 4,
							auto	 : false,
							prev : {
								button : ".prodDetailCarButtonPrev6",
								key    : "left"
							},
							next : {
								button : ".prodDetailCarButtonNext6",
								key	   : "right"
							},
							pagination: ".prodDetailPaginationContainer6",
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					}
					carousel6 = foo6;
					setTimeout(carousel6, 2000); 
					
					
					//Previously Viewed Items Carousel on Product Details page horizontal sliders
					var carousel7;
						function foo7(){ $(".prodDetailTempCarousel2").carouFredSel({
							width    : 960,
							height 	 : 305,
							items    : 4,
							scroll   : 4,
							auto	 : false,
							prev : {
								button : ".prodDetailCarButtonPrev7",
								key    : "left"
							},
							next : {
								button : ".prodDetailCarButtonNext7",
								key	   : "right"
							},
							pagination: ".prodDetailPaginationContainer7",
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					}
					carousel7 = foo7;
					setTimeout(carousel7, 2000); 
					
					
					//Homepage customer review switcher
					var revChange = $('.miscCustReviews li');
					var i=1;
					$(revChange).hide();
					$(revChange[0]).show();
					revChange.siblings();
					function loop() {
						revChange.siblings().delay(4000).fadeOut(4000).delay(4000).eq(i).fadeIn(4000, function() {
							check = i != revChange.length-1 ? i++ : i=0;
							loop();
						});
					};
					loop();
				
				
					/*MOVED TO _2Bhip_extension.js
					var description = $('.prodSummaryContainer');
					var review = $('.prodReviewContainer');
					var seeRevButton = $('.prodSelectSeeReviewButton');
					var seeDescButton = $('.prodSelectSeeDescriptionButton');
					$(review).hide();
					$(seeDescButton).hide();
					$(seeRevButton).click(function() {
						$(description).hide();
						$(review).show();
						$(seeRevButton).hide();
						$(seeDescButton).show();
					});
					$(seeDescButton).bind('click', function() {
						$(review).hide();
						$(description).show();
						$(seeDescButton).hide();
						$(seeRevButton).show();
					});*/
					
				}]);	
			},//END CAROUSELS
			
				
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