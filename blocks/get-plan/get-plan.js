import { getAntivirusPlan } from '../../scripts/api';

async function fetchData() {
    const data = await getAntivirusPlan('Internet Security');
}

export default function decorate(block) {
    fetchData();
}

