var backend_root = "{{ external_backend_root }}";
var frontend_root = "{{ external_frontend_root }}";
var dash_path = frontend_root + '/dash/rep/';
var schema = "{{ schema }}";

// Variables specific to the rep view
var rule_environment_statistics_id = {{ rule_environment_statistics_id }};
var rep_property = "{{ rep_property }}";
var rep_query_id = {{ rep_query_id }};

async function postRequest(url = '', data = {}) {

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

async function getRequest(url = '') {

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });
    return response.json();
}

var property_metadata;
var display_name_to_property_name = {};

function get_prop_options() {
    let query_schema = "";
    if (schema !== 'None') {
        query_schema = "?schema=" + schema;
    }
    return getRequest(backend_root + '/propertyMetadata' + query_schema)
    .then(function(data) {
        property_metadata = data;
        if (property_metadata.length !== 0) {
            for (const [key, value] of Object.entries(property_metadata)) {
                display_name_to_property_name[value['display_name']] = key;
            }
        }
    })
}

function resize_iframe(iframe, desired_height="15000px") {

    setTimeout(function () {
        //iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + "px";
        iframe.style.height = desired_height;
    }, 100);
}

const initPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, 300);
});

function startup() {
    initPromise
    .then(get_prop_options, () => {})
    .then(initialize_content,  () => {})
}

function initialize_content() {
    document.getElementById("repOutput").setAttribute("src", dash_path);
}

function push_original_url () {
    history.pushState("", document.title, window.location.pathname);
}

function jump_to_results () {
    // A delay is necessary here (when called from a Dash callback after the results are ready), otherwise the jump won't work
    setTimeout(function () {
        location.href = "#repOutput";
        push_original_url();
    }, 2000);
}


