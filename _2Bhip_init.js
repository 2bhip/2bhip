var app = app || {vars:{},u:{}}; //make sure app exists.
app.rq = app.rq || []; //ensure array is defined. rq = resource queue.




//app.rq.push(['extension',0,'convertSessionToOrder','extensions/checkout_passive/extension.js']);
app.rq.push(['extension',0,'convertSessionToOrder','extensions/checkout_active/extension.js']);
//app.rq.push(['extension',0,'convertSessionToOrder','extensions/checkout_required/extension.js']);
app.rq.push(['extension',0,'store_checkout','extensions/store_checkout.js']);
app.rq.push(['extension',0,'store_prodlist','extensions/store_prodlist.js']);
app.rq.push(['extension',0,'store_navcats','extensions/store_navcats.js']);
app.rq.push(['extension',0,'store_search','extensions/store_search.js']);
app.rq.push(['extension',0,'store_product','extensions/store_product.js']);
app.rq.push(['extension',0,'store_cart','extensions/store_cart.js']);
app.rq.push(['extension',0,'store_crm','extensions/store_crm.js']);
app.rq.push(['extension',0,'myRIA','quickstart.js','startMyProgram']);

app.rq.push(['extension',1,'google_analytics','extensions/partner_google_analytics.js','startExtension']);
//app.rq.push(['extension',1,'resellerratings_survey','extensions/partner_buysafe_guarantee.js','startExtension']); /// !!! needs testing.
//app.rq.push(['extension',1,'buysafe_guarantee','extensions/partner_buysafe_guarantee.js','startExtension']);
//app.rq.push(['extension',1,'powerReviews_reviews','extensions/partner_powerreviews_reviews.js','startExtension']);
//app.rq.push(['extension',0,'magicToolBox_mzp','extensions/partner_magictoolbox_mzp.js','startExtension']); // (not working yet - ticket in to MTB)


//spec_LLTRSHIRT017_0
//add tabs to product data.
//tabs are handled this way because jquery UI tabs REALLY wants an id and this ensures unique id's between product
app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	var safePID = app.u.makeSafeHTMLId(P.pid); //can't use jqSelector because productTEmplate_pid still used makesafe. planned Q1-2013 update ###
	var $tabContainer = $( ".tabbedProductContent",$('#productTemplate_'+safePID));
		if($tabContainer.length)	{
			if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
			else	{
				$tabContainer.anytabs();
				}
			}
		else	{} //couldn't find the tab to tabificate.
	}]);

app.rq.push(['script',0,(document.location.protocol == 'file:') ? app.vars.httpURL+'jquery/config.js' : app.vars.baseURL+'jquery/config.js']); //The config.js is dynamically generated.
app.rq.push(['script',0,app.vars.baseURL+'model.js']); //'validator':function(){return (typeof zoovyModel == 'function') ? true : false;}}
app.rq.push(['script',0,app.vars.baseURL+'includes.js']); //','validator':function(){return (typeof handlePogs == 'function') ? true : false;}})
app.rq.push(['script',1,app.vars.baseURL+'jeditable.js']); //used for making text editable (customer address). non-essential. loaded late.
app.rq.push(['script',0,app.vars.baseURL+'controller.js']);

app.rq.push(['script',0,app.vars.baseURL+'anyplugins.js']); //in zero pass in case product page is first page.
app.rq.push(['script',0,app.vars.baseURL+'carouFredSel-6.2.0/jquery.carouFredSel-6.2.0-packed.js']);

//sample of an onDeparts. executed any time a user leaves this page/template type.
app.rq.push(['templateFunction','homepageTemplate','onDeparts',function(P) {app.u.dump("just left the homepage")}]);





//group any third party files together (regardless of pass) to make troubleshooting easier.
app.rq.push(['script',0,(document.location.protocol == 'https:' ? 'https:' : 'http:')+'//ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.js']);


/*
This function is overwritten once the controller is instantiated. 
Having a placeholder allows us to always reference the same messaging function, but not impede load time with a bulky error function.
*/
app.u.throwMessage = function(m)	{
	alert(m); 
	}
	
	
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
		next : "#mainBannerCarouselButtonNext"
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
  	scroll: 1,
  	auto : false,
    	prev : "#subButtonPrev",
		next : "#subButtonNext"
 		});
	}
	carousel2 = foo2;
 	setTimeout(carousel2, 1000); 
	
	
	//Best Selling Items Carousel horizontal sliders
 	var carousel3;
		function foo3(){ $(".homePageTempCarousel1").carouFredSel({
  			width    : 956,
  			height 	 : 305,
     		items    : 4,
  			scroll   : 1,
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
			pagination: "#homePaginationContainer1"
 		});
	}
 	carousel3 = foo3;
	setTimeout(carousel3, 1000); 	
	
	
	//New Arrivals Carousel horizontal sliders
	var carousel4;
		function foo4(){ $(".homePageTempCarousel12").carouFredSel({
  			width    : 960,
  			height 	 : 305,
     		items    : 2,
  			scroll   : 1,
			auto	 : false,
			prev : {
				button : "#homeCarButtonPrev2",
				key    : "left"
			},
			next : {
				button : "#homeCarButtonNext2",
				key	   : "right"
			},
			pagination: "#homePaginationContainer2"
 		});
	}
 	carousel4 = foo4;
	setTimeout(carousel4, 1000); 
	
	
	//BATMAN Carousel horizontal sliders
	var carousel5;
		function foo5(){ $(".homePageTempCarousel13").carouFredSel({
  			width    : 960,
  			height 	 : 305,
     		items    : 2,
  			scroll   : 1,
			auto	 : false,
			prev : {
				button : "#homeCarButtonPrev3",
				key    : "left"
			},
			next : {
				button : "#homeCarButtonNext3",
				key	   : "right"
			},
			pagination: "#homePaginationContainer3"
 		});
	}
 	carousel5 = foo5;
	setTimeout(carousel5, 1000); 
	
	
	//Similar Items Carousel on Product Details page horizontal sliders
	var carousel6;
		function foo6(){ $(".prodDetailTempCarousel1").carouFredSel({
  			width    : 960,
  			height 	 : 305,
     		items    : 2,
  			scroll   : 1,
			auto	 : false,
			prev : {
				button : ".prodDetailCarButtonPrev6",
				key    : "left"
			},
			next : {
				button : ".prodDetailCarButtonNext6",
				key	   : "right"
			},
			pagination: ".prodDetailPaginationContainer6"
 		});
	}
 	carousel5 = foo5;
	setTimeout(carousel5, 1000); 
	
	
	//Previously Viewed Items Carousel on Product Details page horizontal sliders
	var carousel7;
		function foo7(){ $(".prodDetailTempCarousel2").carouFredSel({
  			width    : 960,
  			height 	 : 305,
     		items    : 2,
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
			pagination: ".prodDetailPaginationContainer7"
 		});
	}
 	carousel5 = foo5;
	setTimeout(carousel5, 1000); 
	
	
	//Homepage customer review switcher
	var revChange = $('.miscCustReviews li');
	var i=1;
	$(revChange[0]).show();
	function loop() {
		revChange.siblings().delay(3000).fadeOut(2000).delay(2000).eq(i).fadeIn(2000, function() {
			check = i != revChange.length-1 ? i++ : i=0;
			loop();
		});
	};
	loop();
	
}]);
 

app.u.howManyPassZeroResourcesAreLoaded = function(debug)	{
	var L = app.vars.rq.length;
	var r = 0; //what is returned. total # of scripts that have finished loading.
	for(var i = 0; i < L; i++)	{
		if(app.vars.rq[i][app.vars.rq[i].length - 1] === true)	{
			r++;
			}
		if(debug)	{app.u.dump(" -> "+i+": "+app.vars.rq[i][2]+": "+app.vars.rq[i][app.vars.rq[i].length -1]);}
		}
	return r;
	}


//gets executed once controller.js is loaded.
//check dependencies and make sure all other .js files are done, then init controller.
//function will get re-executed if not all the scripts in app.vars.scripts pass 1 are done loading.
//the 'attempts' var is incremented each time the function is executed.

app.u.initMVC = function(attempts){
	app.u.dump("app.u.initMVC activated ["+attempts+"]");
	var includesAreDone = true;

//what percentage of completion a single include represents (if 10 includes, each is 10%).
	var percentPerInclude = (100 / app.vars.rq.length);  
	var resourcesLoaded = app.u.howManyPassZeroResourcesAreLoaded();
	var percentComplete = Math.round(resourcesLoaded * percentPerInclude); //used to sum how many includes have successfully loaded.
	//make sure precentage is never over 100
	if(percentComplete > 100 )	{
		percentComplete = 100;
		}
	
	$('#appPreViewProgressBar').val(percentComplete);
	$('#appPreViewProgressText').empty().append(percentComplete+"% Complete");

	if(resourcesLoaded == app.vars.rq.length)	{

		var clickToLoad = false;
		if(clickToLoad){
			$('#loader').fadeOut(1000);
			$('#clickToLoad').delay(1000).fadeIn(1000).click(function() {
				app.u.loadApp();
			});
		} else {
			app.u.loadApp();
			}
		}
	else if(attempts > 50)	{
		app.u.dump("WARNING! something went wrong in init.js");
		//this is 10 seconds of trying. something isn't going well.
		$('#appPreView').empty().append("<h2>Uh Oh. Something seems to have gone wrong. </h2><p>Several attempts were made to load the store but some necessary files were not found or could not load. We apologize for the inconvenience. Please try 'refresh' and see if that helps.<br><b>If the error persists, please contact the site administrator</b><br> - dev: see console.</p>");
		app.u.howManyPassZeroResourcesAreLoaded(true);
		}
	else	{
		setTimeout("app.u.initMVC("+(attempts+1)+")",250);
		}

	}

app.u.loadApp = function() {
//instantiate controller. handles all logic and communication between model and view.
//passing in app will extend app so all previously declared functions will exist in addition to all the built in functions.
//tmp is a throw away variable. app is what should be used as is referenced within the mvc.
		app.vars.rq = null; //to get here, all these resources have been loaded. nuke record to keep DOM clean and avoid any duplication.
		var tmp = new zController(app);
//instantiate wiki parser.
		myCreole = new Parse.Simple.Creole();
}


//Any code that needs to be executed after the app init has occured can go here.
//will pass in the page info object. (pageType, templateID, pid/navcat/show and more)
app.u.appInitComplete = function(P)	{
	app.u.dump("Executing myAppIsLoaded code...");
	}




//don't execute script till both jquery AND the dom are ready.
$(document).ready(function(){
	app.u.handleRQ(0)
	});






