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
		
			imageZoom : function($tag, data) {
				app.u.dump('data.value:'); app.u.dump(data.value); 
				var image = data.value['zoovy:prod_image1'];
				var imageURL = app.u.makeImage({
					"name" : image,
					"w" : 296,
					"h" : 296,
					"b" : "FFFFFF"
				}); 
			
				$mainImage = $('div', $tag).hasAttr('data-mainimage');
				app.u.dump('mainImage'); app.u.dump($mainImage); 
				//$($mainImage, $tag).append(imageURL);
			
			}
		
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