function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample

  var selectedSample = d3.select("#selDataset").node().value;

  // Use d3 to select the panel with id of `#sample-metadata`

  d3.json('metadata/' + selectedSample).then((data) =>  {

    var metadiv = d3.select("#sample-metadata");

    var contents = '';

      Object.entries(data).forEach(function ([key, value], index) {
        contents = contents + `${key}: ${value} <br>`;  
      });
    
    metadiv.html(contents);
  });
};

function buildCharts(sample) {

    // Use `d3.json` to fetch the sample data for the plots
  
  var selectedSample = d3.select("#selDataset").node().value;

  d3.json('samples/' + selectedSample).then((data) =>  {

    // Pie Chart

    var orderedData = [];

    for (i=0; i < data.otu_ids.length; i++) {
      orderedData.push({
        'otu_id': data.otu_ids[i],
        'sample_value': data.sample_values[i],
        'otu_label': data.otu_labels[i]
      })
    };

    var top_sample_values = orderedData.sort((a, b) => {
      return b.sample_value - a.sample_value;
    });

    top_sample_values = top_sample_values.slice(0, 10);

    console.log(top_sample_values);

    var pieData = [{
      values: top_sample_values.map(row => row.sample_value),
      labels: top_sample_values.map(row => row.otu_id),
      type: 'pie'
    }]

    var layout = {
      // height: 400,
      // width: 500
    };

    Plotly.newPlot('pie', pieData, layout);

    // Bubble Chart

    var bubbleData = [{
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
      }
    }];
    
    var layout = {
      title: 'Marker Size',
      showlegend: false,
      // height: 600,
      // width: 600
    };
    
    Plotly.newPlot('bubble', bubbleData, layout);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
