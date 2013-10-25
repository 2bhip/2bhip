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
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:100});}
			},
		".t_shirts.band_t_shirts_music_t_shirts":{
			"filter": "tShirtsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:100});}
			},
		".t_shirts.beer_t_shirts":{
			"filter": "tShirtsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:100});}
			},
		".t_shirts.brand_names":{
			"filter": "tShirtsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:100});}
			},
		".t_shirts.cartoons":{
			"filter": "tShirtsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:100});}
			},
		".t_shirts.clothes_brand_names":{
			"filter": "tShirtsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:100});}
			},
		".t_shirts.comic_heroes":{
			"filter": "tShirtsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:100});}
			},
		".t_shirts.costume":{
			"filter": "tShirtsForm",
			"exec" : function($form,infoObj){app.ext.store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:100});}
			}
		},
		

////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
			
			
				app.ext.store_filter.u.runCarousels();
				app.ext.store_filter.a.showDescription();
					app.u.dump("_2bhip showDescription() run");
				app.rq.push(['templateFunction','productTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID)); //grabs the currently loaded product page (to ignore previously loaded / invisible ones)
					app.ext.store_filter.u.showRecentlyViewedItems($context);
					app.ext.store_filter.u.runProductCarousel($context);
				}]);
				
				app.rq.push(['templateFunction','productTemplate','onDeparts',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					var pid = infoObj.pid;
					app.ext.store_filter.u.addRecentlyViewedItems($context, pid);
				}]);
				
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
						
						$.extend(handlePogs.prototype,app.ext.store_filter.variations);
							app.u.dump('*** Extending Pogs');
						
						//app.ext.myRIA.template.cartTemplate.onCompletes.push(function(P) {     
							//var $context =  $('#cartTemplate');
							//$('.qtyInput', $context).spinner();
						//});

					} else	{
						setTimeout(function(){app.ext.store_filter.callbacks.startExtension.onSuccess()},250);
					}
					//was here to show hidden divs onComplete, but now is just here for future reference
					app.ext.myRIA.template.homepageTemplate.onCompletes.push(function(P) {
						//app.ext.store_filter.u.showMainBanner();	
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
				
				//CHANGES DISPLAYED LIST ON ALPHABET CLICK IN CHARACTERS AND TITLES ARTICLE
				switchAllCharacters : function($this) {
					//app.u.dump('allz'+$this.attr("class"));
					$("[class^=allz]").addClass('displayNone');
					$('.allz'+$this.attr("class")).removeClass('displayNone');
				},
				
				//EXPANDS CATEGORY DESCRIPTION 1 TO SHOW/HIDE WHAT IS IN IT
				expand1 : function ($tag) {
					//var $context = $('#categoryTemplate_'+app.u.makeSafeHTMLId(catsafeid));
					var $catDesc1 = (".catDesc1", $tag.parent());
					var $expandButton = (".expandButton", $tag);
					var $collapseButton = (".collapseButton", $tag.next());
					var height = "auto";
					$catDesc1.css({"height":height});
					$expandButton.css({"display":"none"});
					$collapseButton.css({"display":"inline"});
				},
				
				// COLLAPSES CATEGORY DESCRIPTION 1 TO HIDE WHAT IS IN IT
				collapse1 : function ($tag) {
					var $catDesc1 = (".catDesc1", $tag.parent());
					var $expandButton = (".expandButton", $tag.prev());
					var $collapseButton = (".collapseButton", $tag);
					var height = 95;
					$catDesc1.css({"height":height+"px"});
					$collapseButton.css({"display":"none"});
					$expandButton.css({"display":"inline"});
				},				
				
				//EXPANDS CATEGORY DESCRIPTION 2 TO SHOW/HIDE WHAT IS IN IT
				expand2 : function ($tag) {
					//var $context = $('#categoryTemplate_'+app.u.makeSafeHTMLId(catsafeid));
					var $catDesc2 = (".catDesc2", $tag.parent());
					var $expandButton = (".expandButton", $tag);
					var $collapseButton = (".collapseButton", $tag.next());
					var height = "auto";
					$catDesc2.css({"height":height});
					$expandButton.css({"display":"none"});
					$collapseButton.css({"display":"inline"});
				},
				
				// COLLAPSES CATEGORY DESCRIPTION 2 TO HIDE WHAT IS IN IT
				collapse2 : function ($tag) {
					var $catDesc2 = (".catDesc2", $tag.parent());
					var $expandButton = (".expandButton", $tag.prev());
					var $collapseButton = (".collapseButton", $tag);
					var height = 95;
					$catDesc2.css({"height":height+"px"});
					$collapseButton.css({"display":"none"});
					$expandButton.css({"display":"inline"});
				},
					
				//SHOWS REVIEWS / HIDES SHOWN REVIEWS ON BUTTON CLICK PRODUCT PAGE / QUICKVIEW
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
				
				//SHOW MAIN CATEGORY DROPDOWN MENU (HOVER ACTION TO BE USED W/ CLICK ACTION BELOW)
				showDropdown : function ($tag) {
					if(!$tag.data('timeoutNoShow') || $tag.data('timeoutNoShow')=== "false") {
						var $dropdown = $(".dropdown", $tag);
						var height = 0;
						$dropdown.show();
						if($dropdown.data('height')) {
							height = $dropdown.data('height');
						} else {
							$dropdown.children().each(function(){
								height += $(this).outerHeight();
							});
						}
						if($tag.data('timeout') && $tag.data('timeout') !== "false") {
							clearTimeout($tag.data('timeout'));
							$tag.data('timeout','false');
						}
						$dropdown.stop().animate({"height":height+"px"}, 1000);
						return true;
						}
					return false;
				},
				
				//ANIMATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU
				hideDropdown : function ($tag) {
					app.u.dump('hiding');
					$(".dropdown", $tag).stop().animate({"height":"0px"}, 500);
					if($tag.data('timeout') && $tag.data('timeout')!== "false"){
						$tag.data('timeout')
						$tag.data('timeout','false');
					}
					$tag.data('timeout',setTimeout(function(){$(".dropdown", $tag).hide();},500));
					return true;
				},
				
				//IMEDIATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU WHEN HEADER IS CLICKED
				clickDropdown : function ($tag) {
					$(".dropdown", $tag).stop().animate({"height":"0px"}, 0);
				},
				
				//CONVERTS MAIN CATEGORY DROPDOWN MENU TO USE CLICK TO OPEN
				showDropDownClick : function($tag){
					app.u.dump('showClick');
					if(this.showDropdown($tag)){
						$('.dropdown',$tag).unbind('click');
						$('.dropdown',$tag).click(function(event){event.stopPropagation()});
						$tag.attr('onClick','').unbind('click');
						setTimeout(function(){$('body').click(function(){
						app.u.dump('set Hide...');
							app.ext.store_filter.a.hideDropdownClick($tag);
							});}, 500);
						}
				},
				
				//CONVERTS MAIN CATEGORY DROPDOWN MENU TO USE CLICK TO CLOSE
				hideDropdownClick : function($tag){
				app.u.dump('hideClick');
				if(this.hideDropdown($tag)){
					app.u.dump('set Show...');
					$tag.click(function(){app.ext.store_filter.a.showDropDownClick($(this));});
					$('body').unbind('click');
					}
				},
				
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

		
			sizeDisplay : function($tag,data) {


// app.u.dump("BEGIN sizeDisplay");
if(data.bindData.isElastic)	{$tag.text('incomplete')}
else	{
//	app.u.dump(" -> not an elastic.");
	if(data.value['@variations'] && data.value['@variations'].length == 1 && data.value['@variations'][0].options && data.value['@variations'][0].options.length)	{
//		app.u.dump(' -> has options');
		//only 1 option group on the product and at least one selectable option.
		var
			variations = data.value['@variations'][0].options, //shortcut
			variationID = data.value['@variations'][0].id, //SOGID/variation ID (ex: A1)
			inventory = {}, //if inventory record is available, it'll be set in this var.
			pid = data.value.pid, //shortcut.
			$ul = $("<ul \/>"),
			L = variations.length;

//		app.u.dump(" -> L: "+L);
//		app.u.dump(" -> variations: "); app.u.dump(variations);
		$ul.addClass('sizeVariations');
		if(app.data['appProductGet|'+data.value.pid] && app.data['appProductGet|'+data.value.pid]['@inventory'])	{
			inventory = app.data['appProductGet|'+data.value.pid]['@inventory'];
			}

//		app.u.dump(" -> inventory: "); app.u.dump(inventory);

		for(var i = 0; i < L; i += 1) {
			var
				$li = $("<li \/>").text(app.ext.store_filter.u.guessOptionSize(variations[i].prompt)).attr('title',variations[i].prompt),
				varVal = variations[i].v;
				invKey = pid+':'+variationID+varVal;
//the value is a string, not an int, so "0" is treated as an isSet. That's good. that means we know we got to the inv record AND it's empty.
			if(inventory[invKey] && inventory[invKey].inv)	{
				if(Number(inventory[invKey].inv) > 0)	{
					$li.off('click.addToCart').on('click.addToCart',function(){
						var addObj = {'sku':pid,'qty':1,'%variations' : {}};
						addObj['%variations'][variationID] = varVal;
						app.calls.cartItemAppend.init(addObj,{},'immutable');
						app.model.destroy('cartDetail');
						showContent('cart',{'mode':'modal'})
						$('#modalCartContents').showLoading({'message':'Adding item to your cart'});
						app.calls.cartDetail.init({'callback':'handleCart','templateID':'cartTemplate','extension':'myRIA','parentID':'modalCartContents'},'immutable');
						app.model.dispatchThis('immutable');
						});
					} //inventory is available.
				else	{
					$li.addClass('soldout');
					}
				}
			else	{
				$li.off('click.showContent').on('click.showContent',function(){
					showContent('product',{'pid':pid});
					});
				}
			$ul.append($li);
			}
		$tag.append($ul);
		
		}
	else	{
		//more than 1 option or only 1 option group and no options available.
		app.u.dump(" -> not a match. show no options.");
		}
	}
			},
		
			onlyBasePrice : function($tag,data) {
				var msrp = data.value['%attribs']['zoovy:prod_msrp'];
				//app.u.dump('*** '+msrp);
				if (typeof msrp === 'undefined' || msrp <= 0) {
					$tag.children('.basePrice').addClass('percentBasePrice');
				}	
				else {
					$tag.children('.basePrice').addClass('fixedBasePrice');
				}
			},
			
			// used to display product image 1 thru X where X is the last image. checks spot 1 - 50 (30 maybe?)
			// product id should be used as var
			productImages : function($tag,data)	{
//				app.u.dump("BEGIN 2bhip.renderFormats.productImages ["+data.value+"]");
				var pdata = app.data['appProductGet|'+data.value]['%attribs']; //short cut to product object in memory.
				var imgs = ''; //all the html for all the images. appended to $tag after loop.
				var imgName; //recycled in loop.
				for(i = 1; i < 30; i += 1)	{
					imgName = pdata['zoovy:prod_image'+i];
//					app.u.dump(" -> "+i+": "+imgName);
					if(app.u.isSet(imgName))	{
						imgs += "<li><a class='MagicThumb MagicThumb-swap' rel='zoom-id: prodBigImage_href;' rev='"+app.u.makeImage({'tag':0,'w':380,'h':380,'name':imgName,'b':'ffffff'})+"' href='"+app.u.makeImage({'tag':0,'w':'','h':'','name':imgName,'b':'ffffff'})+"'><img src='"+app.u.makeImage({'tag':0,'w':65,'h':65,'name':imgName,'b':'ffffff'})+"' \/><\/a><\/li>";
						}
					}
				$tag.append(imgs);
				}, //productImages
				
		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
			
	//called on depart from prod page to add item to recently viewed items list
	//changed this from quickstart's addition at page load to prevent items from showing in list on first page visit
			addRecentlyViewedItems : function($context, pid) {
					//pid is infoObj.pid passed from onDeparts
				if($.inArray(pid,app.ext.myRIA.vars.session.recentlyViewedItems) < 0)	{
					app.ext.myRIA.vars.session.recentlyViewedItems.unshift(pid);
					}
				else	{
					//the item is already in the list. move it to the front.
					app.ext.myRIA.vars.session.recentlyViewedItems.splice(0, 0, app.ext.myRIA.vars.session.recentlyViewedItems.splice(app.ext.myRIA.vars.session.recentlyViewedItems.indexOf(pid), 1)[0]);
					}
			},//addRecentlyViewedItems
				
				//populates carousel if items in recently viewed list, shows placeholder text if list empty
			showRecentlyViewedItems : function($context) {
				var $container = $('.productRecentCarousel', $context);
				
					//if no recently viewed items, tell them the sky is blue
				if(app.ext.myRIA.vars.session.recentlyViewedItems.length == 0) {
					$('.recentEmpty',$container).show();
					//app.u.dump('There aint nuthin in there ma!');
				}
					//otherwise, show them what they've seen
				else {
					$('.recentEmpty',$container).hide();
					$('ul',$container).empty(); //empty product list;
					$($container.anycontent({data:app.ext.myRIA.vars.session})); //build product list
					//app.u.dump('SESSION VAR:'); app.u.dump(app.ext.myRIA.vars.session.recentlyViewedItems);
				}
			},//showRecentlyViewedItems
			
			guessOptionSize : function (text) {
//				app.u.dump('text: '+text);
				var r;
				text = text.toLowerCase(); //make lowercase to make searching values easier. (no searching for xxl and XXL)
				if(text.indexOf('extra') >=0 && text.indexOf('small') >=0) {r = 'XS'}
				else if(text.indexOf('small') >=0) {r = 'S'}
				else if(text.indexOf('med') >=0) {r = 'M'}
				else if(text.indexOf('xxx') >=0) {r = 'XXXL'}
				else if(text.indexOf('xx') >=0) {r = 'XXL'}
				else if(text.indexOf('x') >=0) {r = 'XL'}
				else if(text.indexOf('large') >=0) {r = 'L'}
				else {r = text.substring(0,3);}
//				app.u.dump(" -> r: "+r);
				return r
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
						// THE CAROUSELS FOR THE HOMEPAGE SHOULD HAVE THE ONCOMPLETES MOVED TO THE INIT
						// ONSUCCESS FUNCTION SO THAT THERE IS ONLY ONE FOR ALL. MUCH LIKE THE PRODUCT 
						// PAGE CAROUSELS BELOW THE HOMEPAGE CAROUSELS ARE SET UP.
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
					
				}]);	
			},//END CAROUSELS
					
				
			runProductCarousel : function($context) {
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
							scroll   : 1,
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
					
					//Thumbnail Carousel on Product Details page under main product image
					var carousel8;
						function foo8(){ $(".thumbCarousel").carouFredSel({
							width    : 296,
							height 	 : 75,
							items	 : {
								visible  : 3,
								minimum  : 2
							},
							scroll   : 1,
							auto	 : false,
							prev : {
								button : ".thumbCarouselButtonPrev",
								key    : "left"
							},
							next : {
								button : ".thumbCarouselButtonNext",
								key	   : "right"
							},
							swipe: {
								onMouse: true,
								onTouch: true
							}
						});
					}
					carousel8 = foo8;
					setTimeout(carousel8, 2000); 
					
			}

			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			}, //e [app Events]
			
			
			
		variations : {
			
			renderOptionSelectAsRADIO : function(pog) {
				
				var pogid = pog.id;

				var $parentDiv = $("<span class='radioContainer' \/>");
				
			//display ? with hint in hidden div IF ghint is set
				if(pog['ghint']) {$parentDiv.append(pogs.showHintIcon(pogid,pog['ghint']))}
				var i = 0;
				var len = pog['options'].length;
				while (i < len) {
					$parentDiv.append($("<label \/>").append($('<input>').attr({type: "radio", name: pogid, value: pog['options'][i]['v']}).after(pog['options'][i]['prompt'])));
					i++;
					}
				return $parentDiv;
			},
			
			xinit : function(){
				this.addHandler("type","select","renderOptionSelectAsRADIO");
				app.u.dump("--- RUNNING XINIT");
			}
			
		} //variations
			
			
		} //r object.
	return r;
	}