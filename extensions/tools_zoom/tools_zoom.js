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



//	Intended as a free, open source alternative to 3rd party plugins like Magic Zoom Plus.
//	Utilizes the jQuery Zoom jQuery plugin: http://jacklmoore.com/zoom/

var tools_zoom = function() {
	var theseTemplates = new Array('');
	var r = {

////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

	callbacks : {
		init : {
			onSuccess : function()	{
				var r = false; 

				app.u.loadResourceFile(['script',0,'extensions/tools_zoom/zoom/js/jquery.zoom.min.js']);
				
				r = true;

				return r;
				},
			onError : function()	{
				app.u.dump('BEGIN tools_zoom.callbacks.init.onError');
				}
			}
		}, //callbacks

////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		a : {
			}, //Actions
////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		renderFormats : {
		
/****************************************

A renderformat for creating a magnified image of a product, and the ability to switch an image out 
with thumbnails of up to 6 of it's alternate images. The images will be based on the product container
which renderformat element resides.

This renderformat is intended to be on a stand-alone element such as a div.
ex: 
<div data-bind="useParentData:true; format:imageZoom; extension:tools_zoom; isThumbs:1;" data-thumbclass='thumbCarousel' height='296' width='296' zheight='800' zwidth='800' theight='50' twidth='50'>

Do not specify a var, ALWAYS set useParentData to true.

bindData params:
required:
	none
optional:
	isThumbs - An indicator that thumbnail images should be created. 1 = true.
	bgcolor - A background color to be passed to the app.u.makeImage call for all images.
	isElastic - An indicator that the renderformat will be run on elastic results. 1 = true.

data attributes:
required:
		none
optional:
	data-thumbclass - A class that will be added to the container that holds the thumbnails.
	data-zoomclass - Indicates that the zoomed image should be created in a separate container. 
					 It's value is added as a class to that container.
	height - A height to be passed to the app.u.makeImage call for the main, standard size image.
	width -	A width to be passed to the app.u.makeImage call for the main, standard size image.
	theight - A height to be passed to the app.u.makeImage call for the thumbnail image(s).
	twidth - A width to be passed to the app.u.makeImage call for the thumbnail image(s).
	zheight - A height to be passed to the app.u.makeImage call for the larger, zoom size image.
	zwidth - TA width to be passed to the app.u.makeImage call for the larger, zoom size image.
	
					 
****************************************/
		
			imageZoom : function($tag, data) {
		//		app.u.dump('data.value:'); app.u.dump(data.value); app.u.dump('thumbclass'); app.u.dump($tag.data('thumbclass'));

					//create containers & classes for images
				var $mainImageCont = ('<div class="mainImageCont_'+data.value.pid+'"></div>');

					//if the zoom will not be in the original image container, different properties are needed
				if($tag.data('zoomclass')) {
					var $zoomImageCont = ('<div class="displayNone '+$tag.data('zoomclass')+' '+$tag.data('zoomclass')+'_'+data.value.pid+'"></div>');
					var zoomImageClass = '.'+$tag.data('zoomclass')+'_'+data.value.pid;
					var seperateZoomIn = function() {$(zoomImageClass).show();};
					var seperateZoomOut = function() {$(zoomImageClass).hide();};
					$tag.append($mainImageCont).append($zoomImageCont);
				}
				else {
					var zoomImageClass = '.mainImageCont_'+data.value.pid;
					$tag.append($mainImageCont)
				}
				$mainImageCont = $('.mainImageCont_'+data.value.pid,$tag);
								
				
					//get bgcolor and image path, create main product image
				var bgcolor = data.bindData.bgcolor ? data.bindData.bgcolor : 'ffffff'
		//		app.u.dump('data.bindData'); app.u.dump(data.bindData);
				var image = data.bindData.isElastic ? data.value.images[0] : data.value['%attribs']['zoovy:prod_image1'];
				var imageURL = app.u.makeImage({
					"name" 	: image,
					"w" 	: $tag.attr('width'),
					"h" 	: $tag.attr('height'),
					"b" 	: bgcolor
				}); 
				$mainImageCont.append('<img src="'+imageURL+'" />');
				
				
					//create zoom image
				var zoomURL = app.u.makeImage({
					"name" 	: image,
					"w" 	: $tag.attr('zwidth'),
					"h" 	: $tag.attr('zheight'),
					"b"		: bgcolor
				});
				
				
					//enable zoom on main image, 
					//if a separate container is used for the zoom it is the target, 
					//and must be shown and hidden on mouseenter & mouseleave
				if($tag.data('zoomclass')) {
					$mainImageCont.zoom(
						{
							url			: zoomURL,
							on			: 'mouseover',
							duration	: 500,
							target		: zoomImageClass,
							onZoomIn	: seperateZoomIn,
							onZoomOut	: seperateZoomOut
						}
					);
				}
					//no separate container, no target or show/hide needed
				else {
					$mainImageCont.zoom(
						{
							url			: zoomURL,
							on			: 'mouseover',
							duration	: 500
						}
					);
				}
				
					//if isThumbs is set then add thumbnails, if not... don't.
					//if no prod_image2, likely there are no thumbnails, don't create the container as
					//and fill it w/ a redundant image (may need a better check form the same image later).
				if(data.bindData.isThumbs == 1 && data.value['%attribs']['zoovy:prod_image2']) {
				
					var $thumbImageCont = ('<div class="thumbImageCont '+$tag.data('thumbclass')+'"></div>');
					$tag.append($mainImageCont).append($thumbImageCont)
					$thumbImageCont = $('.thumbImageCont',$tag);
					
						//get product images, up to 6, and create thumbnails.
					var thumbName; //recycled in loop
					var tImages = ''; 
					for (var i = 1; i < 7; i +=1) {
						thumbName = data.value['%attribs']['zoovy:prod_image'+i];
						
						if(app.u.isSet(thumbName)) {
							app.u.dump(" -> "+i+": "+thumbName);
								//make thumb and assign path as attr for use in swaping later
							$thumbImageCont.append('<div><img src="'+app.u.makeImage({'tag':0,'name':thumbName,'w':$tag.attr('twidth'),'h':$tag.attr('theight'),'b':bgcolor})+'" data-imgsrc="'+thumbName+'"/></div>');
						}
					}
					
					
						//add mouseenter to each thumb to show it in the main image area
					$('img',$thumbImageCont).each(function() {
						$(this).on('mouseenter', function() {
							$mainImageCont.trigger('zoom.destroy');		//kill zoom on main image
							var newImage = $(this).attr('data-imgsrc');	//get path for thumb image
							
								//change image source for main image
							$('img:first-child',$mainImageCont).attr('src', app.u.makeImage({
								"name" 	: newImage,
								"w" 	: $tag.attr('width'),
								"h" 	: $tag.attr('height'),
								"b" 	: bgcolor
							}));
								
								//make new zoom image
							var newImageURL = app.u.makeImage({
								"name" 	: newImage,
								"w" 	: $tag.attr('zwidth'),
								"h" 	: $tag.attr('zheight'),
								"b" 	: bgcolor
							});
							
								//start zoom on main image again
							$mainImageCont.zoom(
								{
									url			: newImageURL,
									on			: 'mouseover',
									duration	: 500
								}
							);
						}); //mouseenter
					}); //thumbnails
				}
				
			} //imageZoom
		
		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		u : {
			}, //u [utilities]			
////////////////////////////////////   APP EVENT [e]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\			

		e : {
			} //e [app Events]
		} //r object.
	return r;
	}