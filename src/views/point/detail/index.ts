/*
 * Copyright 2016-present the IoT DC3 original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { CollectionTag, Edit, Management, Sunset } from '@element-plus/icons-vue'

import { useRoute } from 'vue-router'
import router from '@/config/router'

import { getDeviceByDriverId, getDeviceStatusByDriverId, tagDetailsData, tagDetailsEquipments, tagDetailsTotle } from '@/api/device'
import { getProfileByIds } from '@/api/profile'
import { getDriverById, getDriverByIds } from '@/api/driver'

import baseCard from '@/components/card/base/BaseCard.vue'
import detailCard from '@/components/card/detail/DetailCard.vue'
import deviceCard from '@/views/device/card/DeviceCard.vue'
import pointCard from '@/views/point/card/PointCard.vue'
import * as echarts from 'echarts'
import { timestamp } from '@/utils/CommonUtil'

export default defineComponent({
    components: {
        baseCard,
        detailCard,
        deviceCard,
        pointCard,
        CollectionTag,
        Edit,
        Sunset,
        Management,
    },
    setup() {
        const route = useRoute()
        // 定义响应式数据
        const reactiveData = reactive({
            id: route.query.id as string,
            active: route.query.active,
            driverTable: {},
            profileTable: {},
            statusTable: {},
            data: {} as any,
            listDeviceData: [] as any[],
        })

        //定义位号详情页响应式
        const getTagDetailsData = reactive({
            total: 0,
            data: '',
            deviceName: [],
            equipment: '',
            equipment1Name: '',
        })
        const selectedOptions = ref([])
        // const value1 = ref([])
        const selectedDeviceValue = ref([])
        const driver = () => {
            getDriverById(reactiveData.id)
                .then((res) => {
                    reactiveData.data = res.data
                })
                .catch(() => {
                    // nothing to do
                })
        }

        const device = () => {
            getDeviceByDriverId(reactiveData.id)
                .then((res) => {
                    reactiveData.listDeviceData = res.data

                    // driver
                    const driverIds = Array.from(new Set(reactiveData.listDeviceData.map((device) => device.driverId)))
                    getDriverByIds(driverIds)
                        .then((res) => {
                            reactiveData.driverTable = res.data
                        })
                        .catch(() => {
                            // nothing to do
                        })

                    // profile
                    const profileIds = Array.from(
                        new Set(
                            reactiveData.listDeviceData.reduce((pre, cur) => {
                                pre.push(...cur.profileIds)
                                return pre
                            }, []),
                        ),
                    )
                    getProfileByIds(profileIds)
                        .then((res) => {
                            reactiveData.profileTable = res.data
                        })
                        .catch(() => {
                            // nothing to do
                        })
                })
                .catch(() => {
                    // nothing to do
                })

            getDeviceStatusByDriverId(reactiveData.id)
                .then((res) => {
                    reactiveData.statusTable = res.data
                })
                .catch(() => {
                    // nothing to do
                })
        }
        const tagDetails = () => {
            tagDetailsTotle()
                .then((res) => {
                    console.log(res)
                    getTagDetailsData.total = res.data.count
                    getTagDetailsData.deviceName = res.data.devices.map((device: { deviceName: any }) => device.deviceName)
                    // const deviceNameToAdd = getTagDetailsData.deviceName[0];
                    selectedOptions.value = res.data.devices.map((device: { id: any; deviceName: any }) => ({
                        value: device.id, // 使用设备的 id 作为 value
                        label: device.deviceName, // 使用设备的 deviceName 作为 label
                    }))
                    selectedDeviceValue.value = selectedOptions.value.map((option) => option.value)
                    console.log(selectedDeviceValue.value)
                    return tagDetailsData()
                })
                .then((res) => {
                    getTagDetailsData.data = res.data
                    console.log(selectedDeviceValue.value)
                    return tagDetailsEquipments(selectedDeviceValue.value)
                })
                .then((res) => {
                    console.log(selectedDeviceValue.value)
                    console.log(res)
                    getTagDetailsData.equipment = res.data.map((device) => ({
                        name: device.deviceName,
                        total: device.total,
                    }))
                    console.log(getTagDetailsData.equipment)
                    Echart2(getTagDetailsData)
                })
                .catch(() => {
                    // nothing to do
                })
        }
        const deviceName = () => {
            return reactiveData.listDeviceData.map((device) => device.pointName).join(', ')
        }

        const changeActive = (tab: { props: { name: any } }) => {
            const query = route.query
            router.push({ query: { ...query, active: tab.props.name } }).catch(() => {
                // nothing to do
            })
            switch (tab.props.name) {
                case 'whdetail':
                    // Echart2()
                    break
                default:
                    break
            }
        }
        const updateChart = () => {
            const deletedValues = selectedOptions.value.filter((option) => !selectedDeviceValue.value.includes(option.value))
            const addedValues = selectedDeviceValue.value.filter((value) => !selectedOptions.value.some((option) => option.value === value))

            const updateChartData = (res) => {
                console.log(res)
                getTagDetailsData.equipment = res.data.map((device) => ({
                    name: device.deviceName,
                    total: device.total,
                }))
                Echart2(getTagDetailsData)
            }

            if (selectedDeviceValue.value.length === 0 && selectedOptions.value.length > 0) {
                selectedDeviceValue.value = [selectedOptions.value[0].value]
            }

            if (deletedValues.length > 0 || addedValues.length > 0) {
                selectedOptions.value = selectedOptions.value.filter((option) => !deletedValues.includes(option.value))
                selectedDeviceValue.value = selectedDeviceValue.value.filter((value) => !deletedValues.includes(value))
                tagDetailsEquipments(selectedDeviceValue.value).then(updateChartData)
            } else {
                tagDetailsEquipments(selectedDeviceValue.value).then(updateChartData)
            }
        }

        driver()
        device()

        //位号详情
        const InforCard = () => [
            {
                title: `当前位号被${getTagDetailsData.total}个设备引用`,
            },
            {
                title: `当前位号下数据量:${getTagDetailsData.data}`,
            },
        ]
        onMounted(() => {
            tagDetails()
            Echart2(getTagDetailsData)
        })
        const Echart2 = (getTagDetailsData) => {
            const chartDom = document.getElementById('echart2')
            echarts.dispose(chartDom)
            const myChart = echarts.init(chartDom)
            console.log(getTagDetailsData.equipment)
            const option = {
                title: {
                    text: '统计最近7天位号在不同设备下产生的数据量，最多展示10个设备，可通过下拉选择',
                    bottom: 'bottom',
                    textStyle: {
                        fontSize: 14,
                    },
                },
                tooltip: { trigger: 'axis' },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1', '2', '3', '4', '5', '6', '7'],
                },
                yAxis: [
                    {
                        type: 'value',
                    },
                ],
                series: [] as { name: string; type: string; stack: string; smooth: boolean; data: any }[],
            }

            for (let i = 0; i < Math.min(getTagDetailsData.equipment.length, 10); i++) {
                console.log(getTagDetailsData.equipment)
                const seriesData = {
                    name: getTagDetailsData.equipment[i].name,
                    type: 'line',
                    smooth: true,
                    data: getTagDetailsData.equipment[i].total,
                }

                option.series.push(seriesData)
            }

            option && myChart.setOption(option)
            nextTick(() => {
                window.addEventListener('resize', () => {
                    myChart.resize()
                })
            })
        }
        return {
            reactiveData,
            selectedOptions,
            selectedDeviceValue,
            // value1,
            InforCard,
            Echart2,
            driver,
            device,
            tagDetails,
            deviceName,
            changeActive,
            updateChart,
            timestamp,
        }
    },
})
