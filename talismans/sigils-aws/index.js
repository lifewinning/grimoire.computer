var width = window.innerWidth,
height = window.innerHeight

div_w = width*.25;
div_h = div_w;

d3.json('talismans.json', function(tld){
    tld.forEach(function(t){
        if (t.spons == 'Amazon Registry Services, Inc.'){
        var svg = d3.select('#flex').append('div').attr('class','sigil')
        .attr('width', div_w+15)
        .attr('height', div_h+15)
        .append('svg')
        .attr('width', div_w)
        .attr('height', div_h)
        //.attr("transform", "translate(" + (div_w/2) + "," + (div_h/2) +")")
        
        circle = svg.append('g').append("circle")
          .attr("fill", "white")
          .attr("stroke","black")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", div_w/2)
          .attr("transform", "translate(" + (div_w/2) + "," + (div_h/2) +")")
        
        black_circle = svg.append('g').append('circle')
        .attr('fill','black')
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", div_w/3)
        .attr("transform", "translate(" + (div_w/2) + "," + (div_h/2) +")")

        
        svg.append('text')
        .attr('fill','white')
        .attr('class','center')
        .attr("transform", "translate(" + (div_w/2) + "," + (div_h/2) +")")
        .text(t.name);

        var nameserver_arc = d3.svg.arc()
          .startAngle(0)
          .endAngle(360)
          //.endAngle(2*Math.PI)
          .innerRadius(div_w/2.65)
          .outerRadius(div_w/2.65)

        ns_path = svg.append('path')
        .attr('d', nameserver_arc)
        .attr('fill','black')
        .attr('id', 'path-'+t.name.replace('.',''))
        .attr('class','spiral')
        .attr("startOffset", "50%")
        .attr("transform", "translate(" + (div_w/2) + "," + (div_h/2) +")")
        

        var namestext = svg.append("text")
            .attr('textLength', function(){
                p = document.querySelector('.spiral').getTotalLength()
                return p/2;
            })
            .append("textPath") 
            .attr("xlink:href", '#path-'+t.name.replace('.',''))        
            .attr("id",t.name.replace('.','')+"-textpath")
            .attr('class','arc-text')
            .text(t.nameservers.toString().replace(/,/g, " | "));
        
       var ip_arc = d3.svg.arc()
          .startAngle(0)
          .endAngle(360)
          //.endAngle(2*Math.PI)
          .innerRadius(div_w/2.25)
          .outerRadius(div_w/2.25)


        ip_path = svg.append('path')
        .attr('d', ip_arc)
        .attr('fill','black')
        .attr('id', 'ip-path-'+t.name.replace('.',''))
        .attr('class','ipspiral')
        // .attr("startOffset", "50%")
        .attr("transform", "translate(" + (div_w/2) + "," + (div_h/2) +")")
        
        var text = svg.append("text")
            .attr('textLength', function(){
                p = document.querySelector('.ipspiral').getTotalLength()
                return p/2;
            })
            .append("textPath") 
            .attr("xlink:href", '#ip-path-'+t.name.replace('.',''))        
            .attr("id",t.name.replace('.','')+"-textpath")
            .attr('class','arc-text')
            .text("| "+t.ip_addresses.toString().replace(/,/g, " | "));
        
    var slogan_arc = d3.svg.arc()
          .startAngle(0)
          .endAngle(360)
          //.endAngle(2*Math.PI)
          .innerRadius(div_w/3.5)
          .outerRadius(div_w/3.5)

    slogan_path = svg.append('path')
        .attr('d', slogan_arc)
        .attr('fill','white')
        .attr('id', 'slogan-path-'+t.name.replace('.',''))
        .attr('class','ipspiral')
        .attr("transform", "translate(" + (div_w/2) + "," + (div_h/2) +")")

      var slogan_text = svg.append("text")
            .attr("fill","white")
            .attr('textLength', function(){
                p = document.querySelector('.ipspiral').getTotalLength()
                return p/3.25;
            })
            .append("textPath") 
            .attr("xlink:href", '#slogan-path-'+t.name.replace('.',''))        
            .attr("id",t.name.replace('.','')+"-textpath")
            .attr('class','slogan')
            .text("Laborare. Frui vita. fac Historia");
}
})
})
    