'use strict';

const repoUrl = 'https://developer.nps.gov/api/v1/parks';
const apiKey = 'Tm1KITEL3OVCt69MilJucLy5tIuzuiSQxfVjsjgY';

function displayResults(results) {
    console.log('`displayResults` ran');

    // Clear out previous results
    $('#js-results-list').empty();

    // Only add results if user has repos
    if (results.length > 0) {
        // For each item in results, extract name and repo URL,
        // create string with that info, add that info to results
        // list in DOM
        for (let i = 0; i < results.length; i++) {
            $('#js-results-list').append(`
                <li>
                    ${results[i].data.fullName}
                    <br>
                    ${results[i].data.description}
                    <br>
                    <a href="${results[i].data.url}">${results[i].data.url}</a>
                </li>`
            );
        }
    }
    // Otherwise state no repos exist
    else {
        $('#js-results-list').append('<li>User has no public repositories</li>');
    }
    // Change class to display results list
    $('#js-results').removeClass('hidden'); 
}

function formatQueryParameters(queryParameters) {
    console.log(queryParameters);
    const parameterString = Object.keys(queryParameters)
        // .map(key => `${key}=${queryParameters[key]}`);
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key])}`);
    console.log('parameterString = ' + parameterString);
    return parameterString.join('&');
}
// function formatQueryParams(params) {
//     const queryItems = Object.keys(params)
//       .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
//     return queryItems.join('&');
// }

function getParks(statesList, maxResults) {
    console.log('`getRepos` ran');

    // Clear out previous error message
    $('#js-error-message').empty();

    // Hide results list
    $('#js-results').addClass('hidden');

    // Create parameters for API query
    const queryParameters = {
        parkCode: 'acad',
        stateCode: statesList.join(','),
        limit: maxResults
    }
    console.log('stateCode = ' + queryParameters.stateCode);
    const parameterString = formatQueryParameters(queryParameters);

    // Create API call URL
    const url = repoUrl + '?' + parameterString;
    console.log(url);

    // Create fetch options for API authentication
    const options = {
        headers: new Headers({
          "X-Api-Key": apiKey})
    };
    console.log(options);

    // Call API
    fetch(url, options)
        // Do I need to handle a user with no repos?
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`There was an error: ${err.message}`)
        });
    
}

// Watch for form submittals
function watchForm() {
    console.log('`watchForm` ran');
    $('#js-form').submit(function () {
        event.preventDefault();

        // Grab username from input field
        const statesList = $('#js-park-states').val();
        const maxResults = $('#js-max-results').val();
        console.log(statesList, maxResults);
        getParks(statesList, maxResults);

    })
}

$(watchForm);