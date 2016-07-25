//very much indebted to http://bl.ocks.org/syntagmatic/3543186 for the spiral path-making tricks
var width = window.innerWidth,
height = window.innerHeight
start = 0
end = 15;
var theta = function(r) {
  return -3*Math.PI*r;
};


d3.json('tlds-by-year.json', function(tlds){

var color = d3.scale.linear()
    .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });

var arc = d3.svg.arc()
  .startAngle(0)
  .endAngle(2*Math.PI);

var radius = d3.scale.linear()
  .domain([start, end])
  .range([0, height/2-5]);

var zoom = d3.behavior.zoom()
    .translate([width/2, height/2])
    .scale(1)
    .scaleExtent([1, Infinity])
    .on("zoom", zoomed);

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

// var svg = d3.select("#flex").append("svg")
//     .attr("class","sigil")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//     .attr("transform", "translate(" + (width/2) + "," + (height/2) +")")
    //.call(zoom)
    //.call(drag);


function zoomed() {
  svg.attr("transform", "translate(" + zoom.event.translate + ")scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}

function newSpiral(s){
  if (s != 'generic'){
    start = 0
    end = 11;
  } else {
    start = 0
    end = 27;
    height = window.innerHeight*1.85
  }
  var header = d3.select("body").append("h1")
  .style("text-transform","uppercase")
  .html("Hail, Hail to the "+s.replace(/-/g,' ')+" Talismans of the Highest Order")
  var svg = d3.select("body").append("svg")
    .attr("class","sigil")
    .attr("id",s)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width/2) + "," + (height/2) +")")
    var pieces = d3.range(start, end+0.001, (end-start)/1500);

  svg.selectAll("circle")
    .data(d3.range(end,start,(start-end)))
    .enter().append("circle")
      .attr("fill", "white")
      .attr("stroke","black")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", function(d) { return radius(d); })

    var spiral = d3.svg.line.radial()
      .interpolate("cardinal")
      .angle(theta)
      .radius(radius);

    svg.selectAll(".spiral")
      .data([pieces])
      .enter().append("path")
        .attr("class", "spiral")
        .attr("id",s+'-path')
        .attr("d", spiral)
        .attr("transform", function(d) { return "rotate(" + 90 + ")" });

    var text = svg.append("text")
        .append("textPath")
        .attr("xlink:href", '#'+s+'-path')
        .attr("startOffset", ".2%")
        .style("text-anchor","start")
        .attr("id",s+"-textpath");
    if (s != "generic"){
         text.attr('textLength', function(){
          p = document.querySelector('.spiral').getTotalLength()
          return p/2;
            })
    }

}

  var hover  = d3.select("body").append("div").attr("class","hover").attr("id","hover").style("display","none")

dates =[
 [1985,1999],
 [2000,2008],
 [2009,2013],
 [2014,2014],
 [2015,2016]
]

companies = ["Amazon Registry Services, Inc.","Charleston Road Registry Inc. (Google)"]

types = ["country-code", "sponsored", "generic"]


types.forEach(function(t){
  sigilByType('type',t)
})

// companies.forEach(function(c){
//   sigilByOwn(c)
// })

function sigilByType(field, type){
  newSpiral(type)
  //console.log(field, type)
  text = d3.select("#"+type+"-textpath");
  hover = d3.select("#hover");
  array = []
  Object.keys(tlds).forEach(function(key) {
        tlds[key].forEach(function(d){
        if (d.type == type){
            array.push(d.name)
            text.append('tspan')
              .attr('class','arc-text')
              //.style('fill', color(key*.1))
              .html(d.name+" ")
              .on("mouseover", function(){
                d3.select(this).style("fill", "#ccc")
               hover.style("display", null) 
                .style("right", (d3.event.pageX)+"px")
                .style("top", (d3.event.pageY) + "px")
                .html("<h2>"+d.name+"</h2><p><em>Conjured Thusly</em><br>"+d.registered+"</p><p><em>Of The High Fiefdom of</em> "+d.spons+"</p>")
              })
              .on("mouseout", function(){
                d3.select(this).style("fill","black");
                hover.style("display","none")
              });
            }
          })
        })
    if (array.length > 375){
      text.attr("startOffset", ".1%")
      thispath = document.getElementById(type+'-textpath')
      arc = thispath.querySelectorAll('tspan')
      arc.forEach(function(a){
        a.style.fontSize = '14px'
        a.style.letterSpacing = .5
      })
    }
}

function sigilByOwn(type){
  typename= type.replace(/ /g,"-").replace(/,/g,"").replace('(','').replace(')','').replace('.','')
  newSpiral(typename)
  //console.log(field, type)
  text = d3.select("#"+typename+"-textpath");
  array = []
  Object.keys(tlds).forEach(function(key) {
        tlds[key].forEach(function(d){
        if (d.spons == type){
            array.push(d.name)
            text.append('tspan')
              .attr('class','arc-text')
              //.style('fill', color(key*.1))
              .html(d.name+" ")
              // .on("mouseover", function(){
              //   d3.select(this).style("fill", "#ccc").style("font-weight",800) 
              // })
              // .on("click", function(){
              //   hover.style("display", "block" )
              //   .html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p>")
              // })
              // .on("mouseout", function(){
              //   d3.select(this).style("fill","black").style("font-weight",100);
              // });
            }
          })
        })
    if (array.length > 375){
      text.attr("startOffset", ".1%")
      thispath = document.getElementById(typename+'-textpath')
      arc = thispath.querySelectorAll('tspan')
      arc.forEach(function(a){
        a.style.fontSize = '11px'
        a.style.letterSpacing = .5
      })
    }
}

  // Object.keys(tlds).forEach(function(key) {
  //     tlds[key].forEach(function(d){
  //     text.append('tspan')
  //     .attr('class','arc-text')
  //     //.style('fill', color(key*.1))
  //     .html(d.name+" ")
  //     .on("mouseover", function(){
  //       d3.select(this).style("fill", "#ccc").style("font-weight",800) 
  //     })
  //     .on("click", function(){
  //       hover.style("display", "block" )
  //       .html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p>")
  //     })
  //     .on("mouseout", function(){
  //       d3.select(this).style("fill","black").style("font-weight",100);
  //     });
  //   })
  // })

});




