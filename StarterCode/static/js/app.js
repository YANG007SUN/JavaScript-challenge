// from data.js
var tableData = data;
var formDate = d3.select("#form");
var buttonDate = d3.select("#filter-btn");
var formState = d3.select("#form-state");
var buttonState = d3.select("#filter-btn-state");
var optionMenu = d3.select("#city");


// get table element
var tbody = d3.select("tbody");

// create event handler
formState.on("submit", runEnter);
buttonState.on("click", runEnter);
formDate.on("submit", runEnter);
buttonDate.on("click", runEnter);
optionMenu.on("change", runEnter);



// fill out all data
tableData.forEach(processTable);
// construct dropdown menue
constructOptions(tableData);


/**************************************** Functions ****************************************/
// append data from tableData
function processTable(tableInfo){
    /* this function takes into of a table and display to the frontend */
    var row = tbody.append("tr");
    Object.entries(tableInfo).forEach(([key, value])=> {
        var cell = row.append("td");
        cell.text(value);
    });
};

// event handler function
function runEnter(){

    d3.event.preventDefault();

    // grab input value
    var dateElement = d3.select("#datetime");
    var stateElement = d3.select("#state");
    var dateValue = dateElement.property("value");
    var stateValue = stateElement.property("value");
    var cityValue = optionMenu.node().value;
    console.log(cityValue);


    // filter the data based on date or state or both
    var filteredDate = tableData.filter(eachRow=> eachRow.datetime===dateValue);
    var filteredState = tableData.filter(eachRow=> eachRow.state===stateValue);

    var filteredDateAndState = tableData.filter(eachRow=> eachRow.state===stateValue && eachRow.datetime==dateValue);

 

    // remove existing data
    tbody.html("");

    // check if inputs if empty on which condition - date and state filter are independent, 
    // city selector depends on the other two
    // first condition: both date and state is empty
    if (dateValue.length==0 && stateValue.length==0){

        constructOptions(tableData)
        outputTable(cityValue, tableData)

    // second condition: state is filled, date is empty
    }else if(dateValue.length==0 && stateValue.length>0){

        constructOptions(filteredState);
        outputTable(cityValue, filteredState)

    // third condition: date is filled, state is empty
    }else if(stateValue.length==0 && dateValue.length>0){

        constructOptions(filteredDate);
        outputTable(cityValue, filteredDate)

    // last condition: both is filled
    }else{

        constructOptions(filteredDateAndState);
        outputTable(cityValue, filteredDateAndState)
    };

};

function removeDuplicates(array){
    return array.filter((value, index)=> array.indexOf(value)===index);
}

function constructOptions(data){
    /* construct city selector based on the input data */
    optionMenu.html("");
    var cityTable = data.map(city=> city.city);
    var uniqueCity = removeDuplicates(cityTable);

    optionMenu.append("option").text("all").attr("selected","selected");
    uniqueCity.forEach(city=> {
        optionMenu.append("option").text(city).attr("value",city);
    })
}

function outputTable(cityValue, data){
    /* output table to the frontend based on all three selectors */
    if(cityValue=="all"){
        data.forEach(processTable);
    }else{
        var finalData = data.filter(eachRow=> eachRow.city===cityValue);
        finalData.forEach(processTable);
    }
}