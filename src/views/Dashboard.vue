<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import SMPService from '@/service/SMPService';

const { isDarkTheme, contextPath } = useLayout();

const products = ref(null);

const systemData = ref(null);
let systemFrequency = ref([ { value: 0, unit: 'Hz', time: '...'} ]);
let systemGeneration = ref([ { value: 0, unit: 'MW', time: '...'} ]);
let voltaBus = ref([ { value: 0, unit: 'kV', time: '...'} ]);
const outages = ref(null);
let outageArray = [];

const generation = ref(null);
let vraData = ref([]);
let ippData = ref([]);
let generationLabels = ref([]);

let time = ref(null);
let date = ref(null);

const lineData = reactive({
    labels: generationLabels,
    datasets: [
        {
            label: 'VRA',
            data: vraData,
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'IPP',
            data: ippData,
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const lineOptions = ref(null);
const productService = new ProductService();
const smpService = new SMPService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));

    setInterval(() => {
        smpService.getSystemData().then((data) => {
            (systemData.value = data)

            systemFrequency.value.value = systemData.value['system_frequency']['value']
            systemFrequency.value.unit = systemData.value['system_frequency']['unit']
            systemFrequency.value.time = systemData.value['system_frequency']['update_time']

            systemGeneration.value.value = systemData.value['system_generation']['value']
            systemGeneration.value.unit = systemData.value['system_generation']['unit']
            systemGeneration.value.time = systemData.value['system_generation']['update_time']

            voltaBus.value.value = systemData.value['volta_bus']['value']
            voltaBus.value.unit = systemData.value['volta_bus']['unit']
            voltaBus.value.time = systemData.value['volta_bus']['update_time']

            console.log(systemData.value['system_frequency']['value']);
        })

        smpService.getGeneration().then((data) => {
            (generation.value = data)

            vraData.value = convertJsonToArray(generation.value['vra'])
            ippData.value = convertJsonToArray(generation.value['ipp'])
            generationLabels.value = generation.value['keys']

            console.log(convertJsonToArray(generation.value['vra']));
        })

        smpService.getOutages().then((data) => {
            (outages.value = data)

            // for (var i in outages.value)
            //     outageArray.value.push(outages.value[(i).toString()])
            
            console.log(outages.value);
        })
    }, 60000);
});

const convertJsonToArray = (jsondata) => {
    var result = [];

    for (var i in jsondata)
        result.push(parseFloat(jsondata[i]))

    return result;
}

const getEquipment = (data) => {
    var result = [];

    for (var i in data)
        result.push(data[i]['name'])

    return result;
}

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Losses (Dec 2022)</span>
                        <div class="text-900 font-medium text-xl">4.36%</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-window-minimize text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-red-500 font-medium">0.2% </span>
                <span class="text-500">excess</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total System Generation</span>
                        <div class="text-900 font-medium text-xl">{{ systemGeneration.value }}MW</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-bar text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-orange-500 font-medium">{{ systemGeneration.time }}</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">System Frequency</span>
                        <div class="text-900 font-medium text-xl">{{ systemFrequency.value }}Hz</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-line text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-cyan-500 font-medium">{{ systemFrequency.time }}</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Volta Bus</span>
                        <div class="text-900 font-medium text-xl">{{ voltaBus.value }}kV</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-ticket text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-purple-500 font-medium">{{ voltaBus.time }}</span>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-5">
                    <h5>Outages</h5>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu2.toggle($event)"></Button>
                        <Menu ref="menu2" :popup="true" :model="items"></Menu>
                    </div>
                </div>
                <ul class="list-none p-0 m-0">
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">xx</span>
                            <div class="mt-1 text-600">yy</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-orange-500 h-full" style="width: 50%"></div>
                            </div>
                            <span class="text-orange-500 ml-3 font-medium">%50</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Portal Sticker</span>
                            <div class="mt-1 text-600">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                            </div>
                            <span class="text-cyan-500 ml-3 font-medium">%16</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Supernova Sticker</span>
                            <div class="mt-1 text-600">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-pink-500 h-full" style="width: 67%"></div>
                            </div>
                            <span class="text-pink-500 ml-3 font-medium">%67</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Wonders Notebook</span>
                            <div class="mt-1 text-600">Office</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-green-500 h-full" style="width: 35%"></div>
                            </div>
                            <span class="text-green-500 ml-3 font-medium">%35</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Mat Black Case</span>
                            <div class="mt-1 text-600">Accessories</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-purple-500 h-full" style="width: 75%"></div>
                            </div>
                            <span class="text-purple-500 ml-3 font-medium">%75</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Robots T-Shirt</span>
                            <div class="mt-1 text-600">Clothing</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-teal-500 h-full" style="width: 40%"></div>
                            </div>
                            <span class="text-teal-500 ml-3 font-medium">%40</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Generation (MW)</h5>
                <Chart type="line" :data="lineData" :options="lineOptions" />
            </div>
            <div
                class="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                style="border-radius: 1rem; background: linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1c80cf 47.88%, #ffffff 100.01%)"
            >
                <div>
                    <div class="text-blue-100 font-medium text-xl mt-2 mb-3">Corporate News</div>
                    <div class="text-white font-medium text-5xl">Weekly News Transmitter</div>
                </div>
                <div class="mt-4 mr-auto md:mt-0 md:mr-0">
                    <a href="#" class="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"> Read </a>
                </div>
            </div>
        </div>
    </div>
</template>
