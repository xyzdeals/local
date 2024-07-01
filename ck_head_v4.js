try {
    console.log('ck head script initiated')
    // var ckSurvivalMinutes = 30; //in mins
    // for 7 days var ckSurvivalMinutes = 7*24*60 
    // Define the number of mins for cookie survival

    // Function to extract query parameters from the URL
    var getCKSearchParams = function () {
        var searchParams = new URLSearchParams(window.location.search);
        var params = {};
        // Iterate through the query parameters and store them in the 'params' object
        searchParams.forEach(function (value, key) {
            params[key] = value;
        });
        return params;
    }

    // Function to store query parameters in local storage
    var storeCKInLocalStorage = function (params) {
        // Remove specific items from local storage if they are not present in 'params'
        if (!('gclid' in params)) {
            localStorage.removeItem('ck_gclid');
        }
        if (!('fbclid' in params)) {
            localStorage.removeItem('ck_fbclid');
        }
        if (!('igshid' in params)) {
            localStorage.removeItem('ck_igshid');
        }
        if (!('gad_source' in params)) {
            localStorage.removeItem('ck_gad_source')
        }
        if (!('msclkid' in params)) {
            localStorage.removeItem('ck_msclkid')
        }

        // If any of the specified parameters are present, clear all 'ck_' items from local storage
        if ('gclid' in params || 'fbclid' in params || 'igshid' in params || 'gad_source' in params || 'msclkid' in params) {
            Object.keys(localStorage).forEach(function (key) {
                if (/^ck_/.test(key)) {
                    localStorage.removeItem(key);
                }
            });
        } else {
            // Store each query parameter in local storage with a 'ck_' prefix
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    localStorage.setItem("ck_" + key, params[key]);
                }
            }

            // Store the current timestamp in local storage
            var currentTimestamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
            localStorage.setItem('ck_timestamp', currentTimestamp);
        }
    }
    // Get the query parameters from the URL
    var ckSearchParams = getCKSearchParams();
    console.log('ckSearchParams :', ckSearchParams)
    // Store the query parameters in local storage
    storeCKInLocalStorage(ckSearchParams);
    console.log('head script ended')
} catch (error) {
    console.log('ck_head_error', error)
} 