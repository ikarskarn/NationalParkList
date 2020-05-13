'use strict';

const apiKey = 'q5CJDWvLbDbcPNJI1ZsLf3VtyFvkEMFuymeR9LTL'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';
const dropdownList = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    DC: "District Of Columbia",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
};
let currentState = '';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
    //if there are previous results, remove them
    $('#results-list').empty();
    // iterate through the items array
    $('#js-state').text(currentState);
    for (let i = 0; i < responseJson.data.length; i++) {
        // for each data object in the items array, add a list item to the results list with the
        //Full Name of the Park
        //Description,
        //and Website URL
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].name}</h3>
            <p>${responseJson.data[i].description}</p>
            <a href='${responseJson.data[i].url}'>${responseJson.data[i].name} Website</a>
            </li>`
        )};
    
    //display the results section
    $('#results').removeClass('hidden');
};

function getNationalParks(query, maxResults=10) {

    const params = {
        stateCode: query,
        limit: maxResults,
    };

    const queryString = formatQueryParams(params);
    const url = 'https://cors-anywhere.herokuapp.com/' + searchURL + '?' + queryString;

    console.log(url);

    const options = {
        headers: new Headers({
            "x-api-key": apiKey})
    };

    fetch(url, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function createDropdown() {
    //use the dropdown object to create a dropdown in the DOM
    for (let [key, value] of Object.entries(dropdownList)) {
        $('#js-search-state').append(
            `<option value="${key}">${value}</option>`
    )};
}

function watchForm() {
    createDropdown();
    $('form').submit(event => {
        event.preventDefault();
        const searchState = $('#js-search-state').val();
        currentState = dropdownList[searchState];
        const maxResults = $('#js-max-results').val();
        getNationalParks(searchState, maxResults);
    });
}

$(watchForm);