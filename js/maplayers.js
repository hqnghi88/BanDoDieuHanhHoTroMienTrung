
	const queryString = window.location.search;

	const urlParams = new URLSearchParams(queryString);

	 province = urlParams.get('p');
	//console.log(province); 

	 district = urlParams.get('d');
	//console.log(district); 

	 commune = urlParams.get('c');
	//console.log(commune);
	

	var map = L.map('map').setView([15.0376435,107.5341797], 6);
		
		L.tileLayer('https://maps.vietmap.vn/api/tm/{z}/{x}/{y}.png?apikey=383a90729d0590f9e1074083a11791ff64767fb56c1d9c4f', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
				'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
			id: 'mapbox/light-v9',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);


		// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
		
			this._div.innerHTML = '' +  (props ?
				'<b>' + props.name + '</b><br />' + props.density + '.'
				: ''); 
		};

		info.addTo(map);
		 
map.on('zoomend', function (e) {
	zoom_based_layerchange();
});

function clean_map() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON)
        //Do marker specific actions here

        {
			//layer._leaflet_id = null;
            map.removeLayer(layer);

        }
        //console.log(layer);


    });
}
function zoom_based_layerchange() {
    //console.log(map.getZoom());
    $("#zoomlevel").html(map.getZoom());
    var currentZoom = map.getZoom();
	//console.log(currentZoom);
    if (currentZoom<8) { 
            clean_map();
            adm1.addTo(map);  
           // $("#layername").html("Coors Field");
    }
    if (currentZoom>=8 && currentZoom<10 ) {  
            clean_map();
            adm2.addTo(map);  
	}
    if (currentZoom>=10) { 
            clean_map();
			adm3.addTo(map);
	}
    
}
		// get color depending on population density value
		function getColor(d) {
			return d > 1000 ? '#800026' :
					d > 500  ? '#BD0026' :
					d > 200  ? '#E31A1C' :
					d > 100  ? '#FC4E2A' :
					d > 50   ? '#FD8D3C' :
					d > 20   ? '#FEB24C' :
					d > 10   ? '#FED976' :
								'#FFEDA0';
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.density)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var adm1;
		var adm2;
		var adm3;

		function resetHighlight(e) {
			adm1.resetStyle(e.target);
			adm2.resetStyle(e.target);
			adm3.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature1(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});        
			layer.on('click', function (e) {        
				province=e.target.feature.properties.gid; 
			}); 
		}

		function onEachFeature2(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			}); 
			layer.on('click', function (e) {        
				district=e.target.feature.properties.gid; 
			}); 
		}
var layers = {};
		function onEachFeature3(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
			layers[feature.properties.gid] = layer;

			//layer._leaflet_id = feature.id;  
			layer.on('click', function (e) {    
				commune=e.target.feature.properties.gid; 
				console.log(commune);    
			}); 
		}

		adm1 = L.geoJson(mydata1, {
			style: style,
			onEachFeature: onEachFeature1
		}).addTo(map);

		adm2 = L.geoJson(mydata2, {
			style: style,
			onEachFeature: onEachFeature2
		});//.addTo(map);

		adm3 = L.geoJson(mydata3, {
			style: style,
			onEachFeature: onEachFeature3
		}).on('click', function (e) { 
			window.location.href ="4-DaChonPhuongXa.html?p="+province+"&d="+district+"&c="+commune; 
		  });//.addTo(map);
		   
		map.attributionControl.addAttribution('Data &copy; <a href="http://antoancovid.dtt.vn/admin/hotro">iNhanDao</a>');


		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 10, 20, 50, 100, 200, 500, 1000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);
		
		
//console.log(layers[commune]);
if(commune){	
map.fitBounds(layers[commune].getBounds());
}
