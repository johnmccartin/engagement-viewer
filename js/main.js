
$(document).ready(function(){
	fire.zoom_init = 14;
	setSizes();
	mapInit();
	mobileControls();


	$('.content img').addClass('pure-img');

	$(document).on('click','.left-pane .reveal-about',function(){
		$('.desktop-about-pane').removeClass('not-revealed').addClass('revealed');
	});
	$(document).on('click','.desktop-about-pane .close',function(){
		$('.desktop-about-pane').removeClass('revealed').addClass('not-revealed');
	})





	$(window).load(function(){
		setSizes();
		controlTheMap();
	});
	
	$(window).resize(function(){
		setSizes();
	
	});

	$(window).scroll(function(){
	
	});


});

function setSizes() {
	var winW = $(window).width();
	var winH = $(window).height();

	if(winW < 600) {
		fire.zoom_init = 13
	} else {
		fire.zoom_init = 14
	}
	
	/*
	var postsW = $(".posts").width();
	var postsH = $(".posts").height();
	var $footer = $(".footer");
	
	if (postsH < winH) {
		
	} else {
		
	}
	*/
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function mapInit() {

	var map = L.map('map',{
		attributionControl: false
	}).setView([42.3751,-71.1056],fire.zoom_init);

	var tiles = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
		});
	


	function onEachFeature(feature, layer) {
		var popUpContent = "";
		if(feature.properties && feature.properties.PopupInfo) {
			popUpContent = feature.properties.PopupInfo;
		} else {
			popUpContent = "No comments."
		}
		layer.bindPopup(popUpContent);
	}

	var cambridge_bounds = new L.geoJSON(fire.cambridge_bounds, {
		style: {
			fillOpacity: 0,
			weight: 2,
			color: "#000000",
			dashArray: "15 10 5 10",
			clickable: false,
			pointerEvents: false,
			className: "bounds"
		}
	});

	var bounds_coords = fire.cambridge_bounds.features[0].geometry.coordinates[0][0];
	var bounds_latlng = [];

	$.each(bounds_coords,function(index,value){
		bounds_latlng.push(new L.LatLng(bounds_coords[index][1], bounds_coords[index][0]))
	});

	//L.mask(bounds_latlng).addTo(map);

	




	var listening_polygons = new L.geoJSON(fire.listening_polygons,{
			onEachFeature: onEachFeature,
			style: function(feature) {	
				var fill_color;
				var feature_type = feature.properties.Type;
				var feature_type_class = slugify(feature_type)

				if (feature_type == 'Favorite') {
					fill_color = "#00ff72";
				} else if (feature_type == 'Least Favorite') {
					fill_color = "#ff3550"
				} else if (feature_type == 'Future') {
					fill_color = "#3859ff";
				}

				style_object = {
						"color": fill_color,
						"weight": 0,
						"opacity": 0.3,
						"className": 'area listening '+feature_type_class
				}

				return style_object;

				
			}
	});

	var listening_points = new L.geoJSON(fire.listening_points,{
			onEachFeature: onEachFeature,
			pointToLayer: function(feature,latlng) {

				var fill_color;
				var feature_type = feature.properties.Type;
				var feature_type_class = slugify(feature_type)

				if (feature_type == 'Favorite') {
					fill_color = "#00ff72";
				} else if (feature_type == 'Least Favorite') {
					fill_color = "#ff3550"
				} else if (feature_type == 'Future') {
					fill_color = "#3859ff";
				}


				return L.circleMarker(latlng,{
					radius: 3,
					fillColor: fill_color,
					fillOpacity: 0.5,
					color: fill_color,
					weight: 0,
					className: 'point listening '+feature_type_class
				})
			}
	});


	var visioning_points = new L.geoJSON(fire.visioning_points,{
			onEachFeature: onEachFeature,
			pointToLayer: function(feature,latlng) {



				return L.circleMarker(latlng,{
					radius: 3,
					fillColor: "#222222",
					fillOpacity: 0.6,
					color: "#222222",
					weight: 0,
					className: 'point visioning'
				})
			}
	});
	

	map.addLayer(tiles);
	map.addLayer(cambridge_bounds);
	map.addLayer(listening_polygons);
	map.addLayer(listening_points);
	map.addLayer(visioning_points);

	map.createPane('labels');
	map.getPane('labels').style.zIndex = 650;
	map.getPane('labels').style.pointerEvents = 'none';

	var tileLabels = new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png', {
			maxZoom: 18,
			pane: 'labels',
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
			
		});
	map.addLayer(tileLabels);

	var cambridge_mask = new L.mask(bounds_latlng,{pane: 'labels'});
	cambridge_mask.addTo(map);

	


}


function controlTheMap() {
	var svgRoot = $('.leaflet-overlay-pane svg')
	var $vectors = $('.leaflet-overlay-pane svg path');
	var vectors = document.querySelectorAll('.leaflet-overlay-pane svg path')
	
	$vectors.attr('data-geom-active',true).attr('data-type-active',true).attr('data-phase-active',true);
	

	$(document).on('click','.map-controls button', function() {
		var $t = $(this);
		var vectors = document.querySelectorAll('.leaflet-overlay-pane svg path')


		var filter_value = $t.attr('data-filter');


		//TURNING OFF
		if($t.hasClass('pure-button-active')) {
			console.log('turn off');
			console.log(filter_value);
			$t.removeClass('pure-button-active');
			$.each(vectors,function(index,path){
					if( lunar.hasClass(path, filter_value) ) {

						if ($t.hasClass('filter-types')) {

							$(this).attr('data-type-active',false);
							
						} else if ($t.hasClass('filter-geoms')) {

							$(this).attr('data-geom-active',false);

						} else if ($t.hasClass('filter-phases')) {
							$(this).attr('data-phase-active',false);
						}

						if ( $(this).attr('data-type-active') == "true" && $(this).attr('data-geom-active') == "true" && $(this).attr('data-phase-active') == "true" ) {
							$(this).show();
						} else {
							$(this).hide();
						}
						
					} // if they have the target class
				}); //each path


		//TURNING ON
		} else {
			$t.addClass('pure-button-active');
			console.log('turn on');
			console.log(filter_value);
			$.each(vectors,function(index,path){
				if( lunar.hasClass(path, filter_value) ) {

					if ($t.hasClass('filter-types')) {

						$(this).attr('data-type-active',true);
						
					} else if ($t.hasClass('filter-geoms')) {

						$(this).attr('data-geom-active',true);

					} else if ($t.hasClass('filter-phases')) {
							$(this).attr('data-phase-active',true);
						}

					if ( $(this).attr('data-type-active') == "true" && $(this).attr('data-geom-active') == "true" && $(this).attr('data-phase-active') == "true" ) {
							$(this).show();
						} else {
							$(this).hide();
					}
					
				} // if they have the target class
			}); //each path

		}




	});



}

// credits: https://github.com/turban/Leaflet.Mask
L.Mask = L.Polygon.extend({
	options: {
		stroke: false,
		color: '#ffffff',
		fillOpacity: 0.4,
		clickable: true,

		outerBounds: new L.LatLngBounds([-90, -360], [90, 360])
	},

	initialize: function (latLngs, options) {
        
         var outerBoundsLatLngs = [
			this.options.outerBounds.getSouthWest(),
			this.options.outerBounds.getNorthWest(),
			this.options.outerBounds.getNorthEast(),
			this.options.outerBounds.getSouthEast()
		];
        L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);	
	},

});
L.mask = function (latLngs, options) {
	return new L.Mask(latLngs, options);
};


function mobileControls() {
	$(document).on('click','.reveal-mobile-filters',function(){
		$('.mobile-map-controls').removeClass('not-revealed').addClass('revealed');
	});

	$(document).on('click','.mobile-map-controls span.close, .mobile-apply-filters',function(){
		$('.mobile-map-controls').removeClass('revealed').addClass('not-revealed');
	});

	$(document).on('click','.mobile-nav .reveal-about',function(){
		$('.mobile-about-pane').removeClass('not-revealed').addClass('revealed');
	});

	$(document).on('click','.mobile-about-pane span.close',function(){
		$('.mobile-about-pane').removeClass('revealed').addClass('not-revealed');
	});




}