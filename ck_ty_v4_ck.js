try {
    // Set the survival mins for local storage data
    var ckSurvivalMinutes = 1 * 24 * 60; // in mins
    // for 7 days // var ckSurvivalMinutes = 7*24*60 
    // Extract order details from Shopify variables
    // var ck_order_id = '3895479'; // Combine order ID and name
    // ck_order_id = ck_order_id.replace("#", ""); // Remove '#' from the order ID
    // var ck_order_value = 909; // Extract order total amount
    // var ck_discount_code = 'test'; // Extract discount code used, if any
    // var ck_secure_code = '1a79cab13eb1583b19cfe9b0c12136ad';
    // var ck_product_name = '';
    // var ck_goal = '';
    console.log('CK thankyou script initiated');

    var count = localStorage.getItem('ck_count') ? parseInt(localStorage.getItem('ck_count')) : 0
    if (!ck_order_id && count <= 2) {
        count += 1
        localStorage.setItem('ck_count', count)
        location.reload()
    } else {
        localStorage.removeItem('ck_count')
    }

    // Function to retrieve data from local storage with a specific prefix
    var getCKLocalData = function (prefix) {
        var keysAndValues = {};
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                var value = localStorage.getItem(key);
                keysAndValues[key] = value;
            }
        }
        return keysAndValues;
    }

    // Function to delete data from local storage with a specific prefix
    var deleteCKLocalData = function (prefix) {
        Object.keys(localStorage)
            .forEach(function (key) {
                if (/^ck_/.test(key)) {
                    localStorage.removeItem(key);
                }
            });
    }

    // Function to send postback data
    var ckPostback = function (data) {
        var url = "https://offers-cashkaro.affise.com/postback?clickid=" + data.ck_clickid + "&secure=" + ck_secure_code + "&action_id=" + ck_order_id + "&sum=" + ck_order_value + "&status=2&custom_field1=" + ck_order_value + "&custom_field2=" + data.ck_utm_campaign + "&custom_field3=" + ck_discount_code + "&custom_field5=" + ck_product_name

        // Fetch the postback URL
        fetch(url)
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.log(error));

        // Log UTM source and campaign
        console.log('CK UTM source: ' + data.ck_utm_source + '\nCK UTM campaign: ' + data.ck_utm_campaign);
    }

    // Retrieve local storage data with a specific prefix
    var ckLocalData = getCKLocalData('ck_');
    console.log('ckLocalData :', ckLocalData)

    // Check if local storage data is present and within the survival days
    if (ckLocalData.ck_timestamp && ckLocalData.ck_clickid && (ckLocalData.ck_utm_source === 'ck' || ckLocalData.ck_utm_source === 'ppipl' || ckLocalData.ck_utm_source.toLowerCase().includes('ppipl') || ckLocalData.ck_utm_source.toLowerCase().includes('cashkaro'))) {
        console.log("inside if")
        var epochTimestamp = ckLocalData.ck_timestamp;
        var date = new Date(epochTimestamp * 1000);
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        var hours = String(date.getHours()).padStart(2, '0');
        var minutes = String(date.getMinutes()).padStart(2, '0');
        var seconds = String(date.getSeconds()).padStart(2, '0');
        var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        var providedDate = new Date(formattedDateTime);
        var currentDate = new Date();
        var timeDifference = currentDate - providedDate;
        var minutesDifference = timeDifference / (1000 * 60);

        // Check if the difference is within the survival days
        if (minutesDifference <= ckSurvivalMinutes) {
            // Check if tracking parameters are present
            if (!('ck_gclid' in ckLocalData) && !('ck_fbclid' in ckLocalData) && !('ck_igshid' in ckLocalData) && !('ck_gad_source' in ckLocalData) && !('ck_msclkid' in ckLocalData)) {
                // Send postback data
                ckPostback(ckLocalData);
            }
        } else {
            // Delete local storage data if it's older than the survival days
            deleteCKLocalData('ck_');
        }
    } else {
        console.log('Clickid or utm_source or timestamp not found')
    }
    console.log('CK thankyou script ended');
} catch (error) {
    console.log('ck_thankyou_page_error :', error)
}
