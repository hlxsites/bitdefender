const BASE_URL = 'https://www.bitdefender.com.au/site/Store/ajax';

const PLANS_NAME_TO_ID_MAP = {
    'Internet Security': 'is',
    'Bitdefender Total Security': 'tsmd',
    'Bitdefender Antivirus Plus': 'av'
}

export async function getAntivirusPlan(antivirus) {
    const formData = new FormData();
    formData.append('ev', 1);
    formData.append('product_id', PLANS_NAME_TO_ID_MAP[antivirus]);
    formData.append('config', {
        'country_code': 'ro',
        'extra_params': {
            'pid': null
        }
    })
    const response = await fetch(BASE_URL, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: formData
    });

    const data = await response.json();
    console.log(data);
    return data;
}