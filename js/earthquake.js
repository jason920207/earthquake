/**
 * @Author: xiaojiezhang
 * @Date:   2018-05-06T08:43:10-04:00
 * @Last modified by:   xiaojiezhang
 * @Last modified time: 2018-05-06T19:33:20-04:00
 */

  			var parseDate = d3.timeParse("%Y-%m-%d");
 			var parseDate1 = d3.timeParse("%Y");

 			var margin = {top: 20, right: 20, bottom: 180, left: 40},
 	        margin2 = {top: 250, right: 20, bottom: 50, left: 40},

 	        width = 900 - margin.left - margin.right,
 	        height = 400  - margin.top - margin.bottom,
 	        height2 = 400 - margin2.top - margin2.bottom;




 		var baseUrl = "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVtaWZhbGxzIiwiYSI6ImNpem9saGxuZzAwMDgycnFnZnN4cDAwdnkifQ.NL-iJC6Y9lqAjwD0z9fEWw";
         var map = L.map('map').setView([40, 11], 1);
         mapLink =
             '<a href="http://openstreetmap.org">OpenStreetMap</a>';
         L.tileLayer(
             baseUrl, {
             attribution: '&copy; ' + mapLink + ' Contributors',
             maxZoom: 18,
             }).addTo(map);

             function getColor(d) {
           return d > 1000 ? '#b30000' :
                  d > 100  ? '#e34a33' :
                  d > 30   ? '#fc8d59' :
                  d > 10   ? '#fdcc8a' :
                             '#fef0d9';
       }

       var legend = L.control({position: 'bottomright'});

   legend.onAdd = function (map) {



       var div = L.DomUtil.create('div', 'info legend'),
           grades = [0, 10,30,  100,  1000],
           labels = [];
          div.innerHTML +="The Depth of Earthquake"+"<br>"
       // loop through our density intervals and generate a label with a colored square for each interval
       for (var i = 0; i < grades.length; i++) {
           div.innerHTML +=
               '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
               grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
       }

       return div;
   };

   legend.addTo(map);

 	var eqColorScale = d3.scaleLinear()
 			.domain([0,10,30,100,1000])
 			// .range(["#fdbe85", "#fd8d3c", "#e6550d","#ff220d"]);
      // .range(["#D2C4C4", "#C8ABAB", "#BE9393","#B37A7A","#A96262","#9F4949","#8A1818"]);
      .range(["#fef0d9","#fdcc8a","#fc8d59", "#e34a33", "#b30000"]);


 	/* Initialize the SVG layer */
 	map._initPathRoot()

 	var svg_map = d3.select("#map").select("svg"),
 	g = svg_map.append("g");
 	var tooltip = d3.select("#tooltip")
 	var rScale = d3.scaleLinear().range([2, 20]);

 	d3.csv("data/earth1.csv", function(collection) {
 		/* Add a LatLng object to each item in the dataset */
 		collection.forEach(function(d) {
 			d.LatLng = new L.LatLng(d.latitude,d.longitude);
 			 d.mag=+ d.mag;
       d.depth=+d.depth;
 		})
 		rScale.domain(d3.extent(collection, d => d.mag));
 		// rScale_death.domain(d3.extent(collection.features, d => d.properties.DEATHS));




   		// rScale.domain(d3.extent(collection, function(d){ return d.mag} ));
 		var feature = g.selectAll("circle")
 		  .data(collection)
 		  .enter().append("circle")
 			.attr('class', "mapcircle")
 		  .attr("r",d => rScale(d.mag))
 		  .style("opacity", 0.8)
 			// .style("fill", function(d){
 	 		// 		return eqColorScale(d.mag);
 			// })
 			.style("fill", d => eqColorScale(d.depth))


     	.style("stroke", "rgba(255, 255, 255, 0.5)")
 				.on("mouseover", function(d) {
 						selection = d3.select(this)
 												.attr('r', 15)
 						// 						//Update the tooltip position and value
 												tool_tip_show( (d3.event.pageX) + "px", (d3.event.pageY - 28) + "px", d)

 												//Show the tooltip
 												d3.select("#tooltip").classed("hidden", false);
 												})


 				.on("mouseout", function(d) {
 				    d3.select(this)
 				      .transition()
 				      .duration(500)
 				      .attr("r", function (d) {

 				                    return rScale(d.mag);
 				       });

 				                          //Hide the tooltip
 				       d3.select("#tooltip").classed("hidden", true);
 				               });
   			map.on("viewreset", update);
         //


 		update();
 		createScatter(collection)
 		d3.select("#options").on("change",function(){
 			currentkey=d3.select(this).property("value");
 			update_1(currentkey)

 		})


 		function update() {
 			feature.attr("transform",
 			function(d) {
 				return "translate("+
 					map.latLngToLayerPoint(d.LatLng).x +","+
 					map.latLngToLayerPoint(d.LatLng).y +")";
 				}
 			)
 		}
 		function update_1(currentkey){
 			d3.selectAll(".mapcircle")
 				.filter(function(d){return d.mag>=currentkey})
 				.transition()
 				.duration(1200)
 				.attr("r",  d => rScale(d.mag))
 		 .attr('fill', d => eqColorScale(d.depth))
 			d3.selectAll(".mapcircle")
 				.filter(function(d){return d.mag<currentkey})
 				.transition()
 				.duration(1200)
 				.attr("r", "0")

 				d3.selectAll(".dot")
 					.filter(function(d){return d.mag>=currentkey})
 					.transition()
 					.duration(1200)
 					.attr("r", d => rScale(d.mag))

 			d3.selectAll(".dot")
 				.filter(function(d){return d.mag<currentkey})
 				.transition()
 				.duration(1200)
 				.attr("r", "0")

 				d3.selectAll(".mapcircle")
 					.filter(function(d){return d.mag>=currentkey})
 					.transition()
 					.duration(1200)
 					.attr("r",  d => rScale(d.mag))




 		}

 	})

 	function tool_tip_show(left,top,d){
 			 tooltip
 				 .style("left", left)
 				 .style("top", top)
 				 .select("#magnitude")
 				 .text("Magnitude: " + d.mag)

 				 tooltip
 					 .select("#date")
 					 .text("Date: " + d.time)

 				 tooltip
 					 .select("#country")
 					 .text("Country: " + d.place)

           tooltip
             .select("#depth")
             .text("Depth: " + d.depth)



  }
  function tool_tip_show1(left,top,d){
       tooltip
         .style("left", left)
         .style("top", top)
         .select("#year")
         .text("Year: " + d.key)

         tooltip
           .select("#count")
           .text("Count: " + d.value.count)

  }


 			function createScatter(data,currentkey){

 				var svg = d3.select("#scatter").append("svg")
 						.attr("width", width + margin.left + margin.right)
 						.attr("height", height + margin.top + margin.bottom);

 						svg.append("defs").append("clipPath")
 								.attr("id", "clip")
 							.append("rect")
 								.attr("width", width)
 								.attr("height", height);

 				var context = svg.append("g")
 					 .attr("class", "context")
 					 .attr("transform", `translate(${margin2.left},${margin2.top})`);
 					 var maxDate = d3.max(data, function(d) { return parseDate(d.time)});

 	 				var minDate = d3.min(data, function(d) { return parseDate(d.time)});
       //
       			maxDate_plus = new Date(maxDate.getTime() + 300*144000000)


            var expenseMetrics = d3.nest()
                .key(function(d) { return d.time1;})
                .rollup(function(v) { return {
                count: v.length,
                }; })
                .entries(data);

 				var x = d3.scaleTime()
 							 .domain([minDate, maxDate_plus])
 							 .range([0, width]);

 					var x2 = d3.scaleTime()
 								.domain(x.domain())
 								.rangeRound([0, width]);


 				var y = d3.scaleLinear()
 							 .domain(d3.extent([6.5,d3.max(data,d=>d.mag)+0.5]))
 					     .range([height, 0]);

 				// var y2 = d3.scaleLinear()
 				// 					 .domain(y.domain())
 				// 					 .range([height2, 0]);
        // var x2 = d3.scaleBand().rangeRound([0, width]).padding(0.1)
        var y2 = d3.scaleLinear().range([height2, 0]);
        // x2.domain(expenseMetrics.map(function(d) { return d.key; }));
        y2.domain([0, d3.max(expenseMetrics, function(d) { return d.value.count; })]);



 				var xAxis = d3.axisBottom(x);
 				var xAxis2 = d3.axisBottom(x2);
 				var yAxis = d3.axisLeft(y);

 				var brush = d3.brushX()
 											.extent([[0, 0], [width, height2]])
 											.on("brush end", brushed);

 				var focus = svg.append("g")
 			  .attr("class", "focus")
 			  .attr("transform", `translate(${margin.left},${margin.top})`);



 				var dots = focus.append("g");
 				 dots.attr("clip-path", "url(#clip)");

 					 dots.selectAll("dot")
 	 			   // .data(data.filter(function(d,i){
 						//  return d.properties.EQ_PRIMARY>=currentkey
 					 // }))
 					 .data(data)
 	 			   .enter().append("circle")
 	         .attr('class', "dot" )
 	         .filter(function (d) {return d.mag != null })
 	          .attr("cx", d=>x(parseDate(d.time)))
 	          .attr("cy", d=>y(d.mag))
 						.attr("r",d => rScale(d.mag))
 							 .attr('fill', d => eqColorScale(d.depth))
 							 .style("opacity", 0.8)
 							 .on("mouseover", function(d) {
 										d3.selectAll(".mapcircle")
 										  .filter(function(a){return d.id==a.id})
 											.style("fill","#0547fc")
 											.attr('r', 15)

 							 		d3.select(this).attr('r', 15)
 											 // 						//Update the tooltip position and value
 									tool_tip_show( (d3.event.pageX) + "px", (d3.event.pageY - 28) + "px", d)

 																	 //Show the tooltip
 									d3.select("#tooltip").classed("hidden", false);
 									})
 								.on("mouseout", function(d) {
 											 d3.select(this)
 												 .transition()
 												 .duration(500)
 												 .attr("r", d => rScale(d.mag));

 												d3.selectAll(".mapcircle")
 													.filter(function(a){return d.id==a.id})
 													.style("fill",d => eqColorScale(d.depth))
 													.attr("r",d => rScale(d.mag))

 																//Hide the tooltip
 								 d3.select("#tooltip").classed("hidden", true);
 									});

 					focus.append("g")
 						   .attr("class", "axis axis--x")
 						   .attr("transform", "translate(0," + height + ")")
 						   .call(xAxis);

 					focus.append("g")
 						   .attr("class", "axis axis--y")
 						   .call(yAxis);


 				  focus.append('text')
 				       .attr('transform', 'rotate(-90)')
 				       .attr('y', 0 - margin.left)
 				       .attr('x', 0 - (height / 2))
 				       .attr('dy', '1em')
 				       .style('text-anchor', 'middle')
 				       .text('Magnitude');

 					var dots = context.append("g");
 	 				dots.attr("clip-path", "url(#clip)");




 				 dots.selectAll("dot")
         .data(expenseMetrics)
         .enter()
         .append("rect")
             .attr("class", "bar")
           .attr("x", function(d) { return x2(parseDate1(d.key)); })
           .attr("y", function(d) { return y2(d.value.count); })
           .attr("width", 15)
           .attr("height", function(d) { return height2 - y2(d.value.count); })
          .style("fill", "#e6550d")
          // draw the scatter
           	 //dots.selectAll("dot")
 						// 	.data(data)
 						// 	.enter()
 						// 	.append("circle")
 						// 	.attr('class', 'dotContext')
 						// 	.attr("cx", d=>x2(parseDate(d.time))
 						// )
 						// 	.attr("cy",d=>y2(d.mag)
            //
 						// )
 						// 	.attr("r",d => (rScale(d.mag)/3))
 						// .attr('fill', d => eqColorScale(d.mag))

 		 context.append("g")
 				 .attr("class", "axis axis--x")
 				 .attr("transform", "translate(0," + height2 + ")")
 				 .call(xAxis2);


// // creat histogram
//
//
//
//    var svg = d3.select("#hist").append("svg")
//        .attr("width", width + margin.left + margin.right)
//        .attr("height", height + margin.top + margin.bottom);
//
//        bar = svg.append("g") .attr("transform", `translate(${margin2.left},${margin2.top})`);
//
//
//        var x3 = d3.scaleBand().rangeRound([0, width]).padding(0.1)
//        var y3 = d3.scaleLinear().range([height, 0]);
//
//        x3.domain(expenseMetrics.map(function(d) { return d.key; }));
//        y3.domain([0, d3.max(expenseMetrics, function(d) { return d.value.count; })]);
//
//
//        var xaxis = svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .attr("class", "x axis")
//     .call(xAxis)
//
//     .selectAll("text")
//       .style("text-anchor", "end")
//       .attr("dx", "-.8em")
//       .attr("dy", "1em");
//
//
//  // Draw the bars
//  svg.selectAll(".rect")
//      .data(expenseMetrics)
//      .enter()
//      .append("rect")
//          .attr("class", "bar")
//        .attr("x", function(d) { return x3(d.key); })
//        .attr("y", function(d) { return y3(d.value.count); })
//        .attr("width", x3.bandwidth())
//        .attr("height", function(d) { return height - y3(d.value.count); })
//       .style("fill", "#e6550d")
//       .on("mouseover", function(d) {
//           d3.select(this)
//           .transition()
//           .style('fill',"#800000")
//
//          })
//        .on("mouseout", function(d) {
//          d3.select(this)
//          .transition()
//          .style('fill',"#e6550d")
//
//          });



 		 context.append("g")
 							 .attr("class", "brush")
 							 .call(brush)
 							 .call(brush.move, x.range());

    function brushed() {
              const selection = d3.event.selection;
              x.domain(selection.map(x2.invert, x2));
              focus.selectAll(".dot")
              .attr("cx", d=>x(parseDate(d.time)))
              .attr("cy", d=>y(d.mag))
              focus.select(".axis--x").call(xAxis);
              if (d3.event.type == "end") {
                change_map_points()
              }
        }
               function change_map_points () {

                    var curr_view_erth = []
                    var time=[0,0]
                      d3.selectAll(".dot").each(
                        function(d, i) {
                          if (parseDate(d.time) >= x.domain()[0] && parseDate(d.time) <= x.domain()[1] ) {
                              curr_view_erth.push(d.id.toString());
                              }
                          time=[x.domain()[0],x.domain()[1]]
                            })
                      d3.selectAll(".mapcircle")
                          .filter(function(d) {
                            return curr_view_erth.indexOf(d.id) != -1;} )
                          .attr('r', 10)
                          .transition()
                          .duration(1200)
                          .attr("r", d => rScale(d.mag))
                       .attr('fill', d => eqColorScale(d.depth))

                      d3.selectAll(".mapcircle")
                          .filter(function(d) {return curr_view_erth.indexOf(d.id) == -1;} )
                          .transition()
                          .duration(1250)
                          .attr('r', 0 )
                          }


 			}
