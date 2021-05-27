
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

province = urlParams.get('p');
//console.log(province); 

district = urlParams.get('d');
//console.log(district); 

commune = urlParams.get('c'); 
//console.log(commune); 




var spreadsheetUrl_tinh = "https://spreadsheets.google.com/feeds/cells/1_TKYFJ69Uh-s0i6fk8A7mvecTu76d2oDtLg0ZB-2Dug/1/public/values?alt=json-in-script&callback=doData1";

var spreadsheetUrl_quan = "https://spreadsheets.google.com/feeds/cells/1_TKYFJ69Uh-s0i6fk8A7mvecTu76d2oDtLg0ZB-2Dug/2/public/values?alt=json-in-script&callback=doData2";

var spreadsheetUrl_xa = "https://spreadsheets.google.com/feeds/cells/1_TKYFJ69Uh-s0i6fk8A7mvecTu76d2oDtLg0ZB-2Dug/3/public/values?alt=json-in-script&callback=doData3";

var data1=new Map();
var data2=new Map();
var data3=new Map(); 
function doData1(data) { 
    var results = []; 
    var entries = data.feed.entry; 
    var previousRow = 0; 
    for (var i = 0; i < entries.length; i++) { 
        var latestRow = results[results.length - 1]; 
        var cell = entries[i]; 
        var text = cell.content.$t; 
        var row = cell.gs$cell.row; 
        if (row > previousRow) { 
            var newRow = [];  
            newRow.push(text); 
            results.push(newRow); 
            previousRow++;
        } else { 
            latestRow.push(text);
        } 
    } 
	 for (var i = 1; i < results.length; i++) {  
	//	data3.set(results[i][1]+results[i][2]+results[i][3],results[i][4]); 
		data1.set(results[i][1],results[i][2]); 
	 }  
	 
	 
	adm1 = L.geoJson(mydata1, {
		style: style,
		onEachFeature: onEachFeature1
	}).addTo(map);
 
}
 
function doData2(data) { 
    var results = []; 
    var entries = data.feed.entry; 
    var previousRow = 0; 
    for (var i = 0; i < entries.length; i++) { 
        var latestRow = results[results.length - 1]; 
        var cell = entries[i]; 
        var text = cell.content.$t; 
        var row = cell.gs$cell.row; 
        if (row > previousRow) { 
            var newRow = [];  
            newRow.push(text); 
            results.push(newRow); 
            previousRow++;
        } else { 
            latestRow.push(text);
        } 
    } 
	 for (var i = 1; i < results.length; i++) {   
		data2.set(results[i][1]+results[i][2],results[i][3]); 
	 }  
	 
	  
	adm2 = L.geoJson(mydata2, {
		style: style,
		onEachFeature: onEachFeature2
	});//.addTo(map);
 
}
 
function doData3(data) { 
    var results = []; 
    var entries = data.feed.entry; 
    var previousRow = 0; 
    for (var i = 0; i < entries.length; i++) { 
        var latestRow = results[results.length - 1]; 
        var cell = entries[i]; 
        var text = cell.content.$t; 
        var row = cell.gs$cell.row; 
        if (row > previousRow) { 
            var newRow = [];  
            newRow.push(text); 
            results.push(newRow); 
            previousRow++;
        } else { 
            latestRow.push(text);
        } 
    } 
	 for (var i = 1; i < results.length; i++) {  
		data3.set(results[i][1]+results[i][2]+results[i][3],results[i][4]);  
	 }  
	 
	 

	adm3 = L.geoJson(mydata3, {
		style: style,
		onEachFeature: onEachFeature3
	}); 
}


// Create JSONP Request to Google Docs API, then execute the callback function doData
$.ajax({
    url: spreadsheetUrl_tinh,
    jsonp: 'doData1',
    dataType: 'jsonp'
});	
	
	// Create JSONP Request to Google Docs API, then execute the callback function doData
$.ajax({
    url: spreadsheetUrl_quan,
    jsonp: 'doData2',
    dataType: 'jsonp'
});	
	
	// Create JSONP Request to Google Docs API, then execute the callback function doData
$.ajax({
    url: spreadsheetUrl_xa,
    jsonp: 'doData3',
    dataType: 'jsonp'
});	
	
	
	
	
var map = L.map('map').setView([18.6376435, 107.5341797], 6);

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

// get lấy nhãn risk
function getRisk(d) {
	// ptype = ["","Bình thường mới", "Nguy cơ", "Nguy cơ cao", "Nguy cơ rất cao"]
	return d > 90 ? "Nguy cơ rất cao" :
		d > 70 ? "Nguy cơ cao" :
			d > 50 ? "Nguy cơ" :
				d > 30 ? "Bình thường mới" :
					"Bình thường mới";
}

info.update = function (feature) {
	if(feature && feature.properties){
	var sc=0;
		sc=feature.properties.score;
		sc=getScore(feature); 
	this._div.innerHTML = '' + (feature.properties ?
		'<b>' + feature.properties.name + '</b><br />' +sc+ '.'
		+ '<br />' + getRisk(sc) + '.'
		: '');
		
	}  
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
	if (currentZoom < 8) {
		clean_map();
		adm1.addTo(map);
		// $("#layername").html("Coors Field");
	}
	if (currentZoom >= 8 && currentZoom < 10) {
		clean_map();
		adm2.addTo(map);
	}
	if (currentZoom >= 10) {
		clean_map();
		adm3.addTo(map);
	}

}
// get color depending on population density value
function getColor(d) {  
	return d > 90 ? '#FF00FF' :
		d > 70 ? '#AA00FF' :
			d > 50 ? '#5500FF' :
				d > 3 ? '#002AFF' :
					'#ECFFEC';
}
 
function getScore(feature){ 
		var sc=data3.get(feature.properties.name1+feature.properties.name2+feature.properties.name);
		if(sc) return sc; 
		 sc= data2.get(feature.properties.name1+feature.properties.name);
		 if(sc) return sc; 
		 sc=  data1.get(feature.properties.name); 
		 if(sc) return sc; 
	return feature.properties.score;  
}
 

function style(feature) { 
	return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(getScore(feature))
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

	info.update(layer.feature);
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
		province = e.target.feature.properties.name;
		str = buildString2(province,mapVN[province]);
		document.getElementById("thelist").innerHTML = "<h5 class=\"text-danger\">Danh sách quận, huyện của " + province + "</h5></br>" + str;
	});
}

function onEachFeature2(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
	layer.on('click', function (e) {
		province = e.target.feature.properties.name1;
		district = e.target.feature.properties.name;
		str = buildString3(province+district,mapVN[province + " " + district]);
		document.getElementById("thelist").innerHTML = "<h5 class=\"text-danger\">Danh sách xã, phường của " + district + ", " + province + "</h5></br>" + str;
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
		commune = e.target.feature.properties.name;
		province = e.target.feature.properties.name1;
		district = e.target.feature.properties.name2;
		str = "";
		document.getElementById("thelist").innerHTML = "<h5 class=\"text-danger\">Danh sách thôn của " + commune + ", " + district + ", " + province + "</h5></br>" + str; 
	});
}

function buildString2(parent,map) {
	var str = "";
	var open_div1 = '<div class="legend" style="width: 50%; float:left">';
	var open_div2 = '<div class="legend" style="width: 50%; float:right">';
	var close_div = '</div>';
	str = open_div1;
	mid = (map.length/2).toFixed();
	
	map=map.sort(function(a, b) {
		return data2.get(parent+b) - data2.get(parent+a);
	}); 
	for (var i = 0; i < map.length; i++) {
		item = map[i]; 
		
		console.log(parent+item);
		console.log(data2.get(parent+item));
		str += '<i style="background:' + getColor(data2.get(parent+item)) + '"></i> ' + item + '</br>';
		if (i == mid - 1) {
			str += close_div + open_div2;
		}
	}
	str += close_div;
	return str;
};
 

function buildString3(parent,map) {
	var str = "";
	var open_div1 = '<div class="legend" style="width: 50%; float:left">';
	var open_div2 = '<div class="legend" style="width: 50%; float:right">';
	var close_div = '</div>';
	str = open_div1;
	mid = (map.length/2).toFixed();
	map=map.sort(function(a, b) {
		return data3.get(parent+b) - data3.get(parent+a);
	}); 
	for (var i = 0; i < map.length; i++) {
		item = map[i]; 
		str += '<i style="background:' +  getColor(data3.get(parent+item)) + '"></i> ' + item + '</br>';
		if (i == mid - 1) {
			str += close_div + open_div2;
		}
	}
	str += close_div;
	return str;
};
 

map.attributionControl.addAttribution('Data &copy; <a href="http://antoancovid.dtt.vn/admin/hotro">iNhanDao</a>');


var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [30, 50, 70, 90],
		ptype = ["Bình thường mới", "Nguy cơ", "Nguy cơ cao", "Nguy cơ rất cao"],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i> ' +
			ptype[i]);
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);


//console.log(layers[commune]);
if (commune) {
	map.fitBounds(layers[commune].getBounds());
}
