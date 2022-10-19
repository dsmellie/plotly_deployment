function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    //console.log(data);
    var sampleArray = data.samples;
    //console.log(sampleArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = desiredArray[0];
    //console.log(desiredArray);
    //console.log(firstSample);
    var metadataGauge = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultGaugeArray = metadataGauge.filter(sampleObj => sampleObj.id == sample);
    var resultGauge = resultGaugeArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
   // console.log(otu_ids);
    var otu_labels = firstSample.otu_labels;
  //  console.log(otu_labels);
    var sample_values = firstSample.sample_values;
  //  console.log(sample_values);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map((a,b) => b - a);
    yticks = yticks.slice(0,10);
   //console.log(yticks);

    for(i=0; i<yticks.length; i++){
      yticks[i] = "OTU " + (Math.abs(yticks[i]) + i);
    }
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: otu_labels,
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Sample Values"},
      yaxis: {'categoryorder':'total ascending'}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
 //   console.log(otu_ids);
  //  console.log(sample_values);
  // 1. Create the trace for the bubble chart.
  var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker:{
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth',
      }
  }];

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    hovermode: "closest",
    xaxis: {title: "OTU ID"}
  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

      // 4. Create the trace for the gauge chart.
      var washFreq = resultGauge.wfreq;
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: {text: '<b> Belly Button Washing Frequency </b> <br>Scrubs per Week'},
        type: "indicator",
        mode:"gauge+number",
        gauge: { axis: {range: [null, 10]},
        bar: {color: 'black'},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4,6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen"},
          { range: [8, 10], color: "green" }
        ]}
        
     
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 600, 
        height: 450, 
        margin: { t: 0, b: 0 }
       
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
