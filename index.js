'use strict';

const apiKey = 'q5CJDWvLbDbcPNJI1ZsLf3VtyFvkEMFuymeR9LTL'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';
//https://developer.nps.gov/api/v1/parks

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++) {
    console.log(responseJson.data[i].name);
    console.log(responseJson.data[i].description);
    console.log(responseJson.data[i].url);

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
    //?stateCode=NC&limit=10
    const params = {
        stateCode: query,
        limit: maxResults,
        api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  //header option won't work due to CORS policy
  //const options = {
  //  headers: new Headers({
  //    "x-api-key": apiKey})
  //};

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    //.then(responseJson => console.log(responseJson))
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchState = $('#js-search-state').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(searchState, maxResults);
  });
}

$(watchForm);