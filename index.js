'use strict';

const repoUrl = 'https://developer.nps.gov/api/v1/parks';
const apiKey = 'Tm1KITEL3OVCt69MilJucLy5tIuzuiSQxfVjsjgY';

// Generate park address from address parameters (line1, line2, etc.)
function generateAddress(addressInfo) {
    console.log('`generateAddress` ran');

    let address = "";
    address += (addressInfo.line1 !== "") ? addressInfo.line1 + '<br>' : '';
    address += (addressInfo.line2 !== "") ? addressInfo.line2 + '<br>' : '';
    address += (addressInfo.line3 !== "") ? addressInfo.line3 + '<br>' : '';
    address += `${addressInfo.city}, ${addressInfo.stateCode} ${addressInfo.postalCode}`;
    return address;
}

// Take results from API and display them in the container in the DOM
function displayResults(results) {
    console.log('`displayResults` ran');

    // Clear out previous results
    $('#js-results-list').empty();
    
    // Only add results if parks were found (parks list length > 0)
    if (parseInt(results.data.length) > 0) {
        // For each item in results, extract name, description, URL, and address;
        // create string with that info, add that info to results list in DOM        
        for (let i = 0; i < results.data.length; i++) {
            // Find address index for physical address if address exists
            const addressIndex = (results.data[i].addresses.length > 0) ? results.data[i].addresses.findIndex(item => item.type === 'Physical') : -1;
            
            // Add park info as list item
            $('#js-results-list').append(`
                <li>
                    ${results.data[i].fullName}
                    <br>
                    <br>
                    ${results.data[i].description}
                    <br>
                    <br>
                    ${(addressIndex !== -1) ? generateAddress(results.data[i].addresses[addressIndex]) : 'No address listed'}
                    <br><br>
                    <a href="${results.data[i].url}">${results.data[i].url}</a>
                    <br><br>
                </li>`
            );
        }
    }
    // Otherwise state that no parks exist
    else {
        $('#js-results-list').append('<li>There are no parks in the selected states</li>');
    }
    // Change classes to display results list
    $('#js-results').removeClass('hidden'); 
}

// Generate query string that concatenates all parameters in proper format
function formatQueryParameters(queryParameters) {
    console.log('`formatQueryParameters` ran');

    const parameterString = Object.keys(queryParameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key])}`);
    console.log('parameterString = ' + parameterString);
    return parameterString.join('&');
}

// Call NPS API to get list of parks given states and max results
function getParks(statesList, maxResults) {
    console.log('`getRepos` ran');

    // Clear out previous error message
    $('#js-error-message').empty();

    // Hide results list
    $('#js-results').addClass('hidden');

    // Create parameters for API query
    const queryParameters = {
        stateCode: statesList.join(','),
        limit: maxResults,
        fields: 'addresses',
        api_key: apiKey
    }
    const parameterString = formatQueryParameters(queryParameters);

    // Create API call URL
    const url = repoUrl + '?' + parameterString;

    // Create fetch options for API authentication > THIS DOESN"T WORK FOR SOME REASON
    // const options = {
    //     headers: new Headers({
    //         'x-api-key': apiKey
    //     })
    // };
    // console.log(options.headers.get('x-api-key'));

    // Call API
    fetch(url)
        .then(response => {
            // Make sure response is good before proceeding, otherwise throw error
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => {
            console.log(responseJson);
            displayResults(responseJson);
        })
        .catch(err => {
            $('#js-error-message').text(`There was an error: ${err.message}`)
        });
    
}

// Watch for form submittals
function watchForm() {
    console.log('`watchForm` ran');
    $('#js-form').submit(function () {
        event.preventDefault();

        // Grab states and max results from inputs
        const statesList = $('#js-park-states').val();
        const maxResults = $('#js-max-results').val();
        
        getParks(statesList, maxResults);

    })
}

$(watchForm);