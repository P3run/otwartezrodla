var margin = { top: 15, right: 65, bottom: 15, left: 65 },
    width = 1280 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

var tree = d3.tree().size([height, width]);

var diagonal = d3.linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);

var svg = d3.select("#body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("arf.json").then(json => {
    root = d3.hierarchy(json);
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    root.children.forEach(collapse);
    update(root);
});

function update(source) {
    var nodes = tree(root).descendants();
    nodes.forEach(d => d.y = d.depth * 180);

    var node = svg.selectAll("g.node")
        .data(nodes, d => d.id || (d.id = ++i));

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .on("click", (event, d) => { toggle(d); update(d); });

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", d => d._children ? "lightsteelblue" : "#fff");

    nodeEnter.append("a")
        .attr("target", "_blank")
        .attr("xlink:href", d => d.data.url)
        .append("text")
        .attr("x", d => d.children || d._children ? -10 : 10)
        .attr("dy", ".35em")
        .attr("text-anchor", d => d.children || d._children ? "end" : "start")
        .text(d => d.data.name)
        .style("fill: rgb(0, 0, 0)", d => d.data.free ? 'black' : '#999')
        .style("fill-opacity", 1e-6);

    nodeEnter.append("title").text(d => d.data.description);

    var nodeUpdate = node.merge(nodeEnter).transition()
        .duration(duration)
        .attr("transform", d => `translate(${d.y},${d.x})`);

    nodeUpdate.select("circle")
        .attr("r", 6)
        .style("fill", d => d._children ? "#ffc900" : "#fff");

    nodeUpdate.select("text").style("fill-opacity", 1);

    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .remove();

    nodeExit.select("circle").attr("r", 1e-6);
    nodeExit.select("text").style("fill-opacity", 1e-6);

    var link = svg.selectAll("path.link")
        .data(root.links(), d => d.target.id);

    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", d => diagonal({ source: { x: source.x0, y: source.y0 }, target: { x: source.x0, y: source.y0 } }))
        .merge(link)
        .transition()
        .duration(duration)
        .attr("d", diagonal);

    link.exit().transition()
        .duration(duration)
        .attr("d", d => diagonal({ source: { x: source.x, y: source.y }, target: { x: source.x, y: source.y } }))
        .remove();

    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

function toggle(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
}