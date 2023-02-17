export default class SMPService {
    async getSystemData() {
        const res = await fetch('https://smp.gridcogh.com/api/system-data');
        const d = await res.json();
        return d.data;
    }

    async getGeneration() {
        const res = await fetch('https://smp.gridcogh.com/api/generation');
        const d = await res.json();
        return d.data;
    }
}