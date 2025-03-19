const url = 'https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'cf4f4c72eamsh065efa2a0112b62p1ea0d1jsn72174e23d7be',
        'x-rapidapi-host': 'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com'
    }
};

try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result, response);
} catch (error) {
    console.error(error);
}


const url2 = 'https://ip-geolocation-find-ip-location-and-ip-info.p.rapidapi.com/backend/ipinfo/?ip=103.129.134.43';
const options2 = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'cf4f4c72eamsh065efa2a0112b62p1ea0d1jsn72174e23d7be',
        'x-rapidapi-host': 'ip-geolocation-find-ip-location-and-ip-info.p.rapidapi.com'
    }
};



try {
    const response = await fetch(url2, options2);
    const result = await response.json();
    console.log(result);
} catch (error) {
    console.error(error);
}

// 4ba422932856fb

// Fetch your own IP address and location
async function getMyIP() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=4ba422932856fb');
        const data = await response.json();
        console.log('Your IP Address Info:', data);
        console.log(data.ip);
        console.log(data.city);
        console.log(data.region);
        console.log(data.country);
        console.log(data.loc);
        console.log(data.company.name);
        console.log(response.status, response);
    } catch (error) {
        console.error('Error fetching IP info:', error);
    }
}

getMyIP();
