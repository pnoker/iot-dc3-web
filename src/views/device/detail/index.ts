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

import { computed, defineComponent, nextTick, onMounted, onUpdated, reactive, ref } from 'vue'
import { CollectionTag, Edit, List, Management, Promotion, Sunset } from '@element-plus/icons-vue'

import { useRoute } from 'vue-router'
import router from '@/config/router'

import { getDriverById } from '@/api/driver'
import { getProfileByDeviceId, getProfileByIds } from '@/api/profile'
import { deviceStatisticsByPointId, getDeviceById, getdeviceOffline, getdeviceOnline, pointByDeviceId, pointConfigByDeviceId } from '@/api/device'

import baseCard from '@/components/card/base/BaseCard.vue'
import detailCard from '@/components/card/detail/DetailCard.vue'
import skeletonCard from '@/components/card/skeleton/SkeletonCard.vue'
import deviceCard from '@/views/device/card/DeviceCard.vue'
import profileCard from '@/views/profile/card/ProfileCard.vue'
import profile from '@/views/profile/Profile.vue'
import pointCard from '@/views/point/card/PointCard.vue'
import point from '@/views/point/Point.vue'
import pointValueCard from '@/views/point/value/card/PointValueCard.vue'
import pointValue from '@/views/point/value/PointValue.vue'
import pointValueEditForm from '@/views/point/value/edit/PointValueEditForm.vue'

import { timestamp } from '@/utils/CommonUtil'
import * as echarts from 'echarts'

export default defineComponent({
    name: 'DeviceDetail',
    components: {
        baseCard,
        detailCard,
        skeletonCard,
        deviceCard,
        profileCard,
        pointCard,
        pointValueCard,
        pointValue,
        pointValueEditForm,
        point,
        profile,
        Promotion,
        List,
        Management,
        Edit,
        Sunset,
        CollectionTag,
    },
    props: {
        deviceName: {
            type: String,
            default: '',
        },
    },
    setup() {
        const route = useRoute()

        const profileViewRef: any = ref<InstanceType<typeof profile>>()
        const pointViewRef: any = ref<InstanceType<typeof point>>()
        const pointValueViewRef: any = ref<InstanceType<typeof pointValue>>()

        // 定义响应式数据
        const reactiveData = reactive({
            id: route.query.id as string,
            active: route.query.active,
            profileLoading: true,
            pointLoading: true,
            pointValueLoading: true,
            data: {} as any,
            driver: {} as any,
            profileTable: {},
            pointTable: {},
            deviceTable: {},
            unitTable: {},
            listProfileData: [] as any[],
            listPointData: [] as any[],
            listPointValueData: [] as any[],
            listPointValueHistoryData: {},
            pointValueDetailData: {},
        })

        const profileLength = computed(() => {
            return profileViewRef.value?.reactiveData.page.total || 0
        })

        const pointLength = computed(() => {
            return pointViewRef.value?.reactiveData.page.total || 0
        })

        const hasPointValueData = computed(() => {
            return !reactiveData.pointValueLoading && reactiveData.listPointValueData?.length < 1
        })

        const device = () => {
            getDeviceById(reactiveData.id)
                .then((res) => {
                    console.log(res)
                    reactiveData.data = res.data
                    reactiveData.deviceTable[reactiveData.data.id] = reactiveData.data.deviceName

                    getDriverById(reactiveData.data.driverId)
                        .then((res) => {
                            reactiveData.driver = res.data
                        })
                        .catch(() => {
                            // nothing to do
                        })
                })
                .catch(() => {
                    // nothing to do
                })
        }

        const profiles = () => {
            getProfileByDeviceId(reactiveData.id)
                .then((res) => {
                    reactiveData.listProfileData = res.data

                    // profile
                    const profileIds = Array.from(new Set(reactiveData.listProfileData.map((pointValue) => pointValue.id)))
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
                .finally(() => {
                    reactiveData.profileLoading = false
                })
        }

        const updateThing = (pointValue) => {
            console.log('update things', pointValue)
        }

        const changeActive = (tab) => {
            const query = route.query
            router.push({ query: { ...query, active: tab.props.name } }).catch(() => {
                // nothing to do
            })

            switch (tab.props.name) {
                case 'profile':
                    break
                case 'point':
                    pointViewRef.value?.refresh()
                    break
                case 'pointValue':
                    pointValueViewRef.value?.refresh()
                    break
                case 'pointDetail':
                    Echart1()
                    Echart2()
                    break
                default:
                    break
            }
        }

        device()
        profiles()
        //设备详情

        const Echart1 = () => {
            const chartDom1 = document.getElementById('echart1')
            echarts.dispose(chartDom1)
            const myChart1 = echarts.init(chartDom1)
            const option = {
                title: {
                    text: '统计最近7天驱动每天的在线和离线时长',
                    bottom: 'bottom',
                    textStyle: {
                        fontSize: 14, // 设置标题字体大小
                    },
                },
                tooltip: {
                    trigger: 'axis',
                },
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
                series: [
                    {
                        name: '在线时长',
                        type: 'line',
                        smooth: true,
                        data: Object.values(onlinedata.value).reverse(),
                    },
                    {
                        name: '离线时长',
                        type: 'line',
                        smooth: true,
                        data: Object.values(offlinedata.value).reverse(),
                    },
                ],
            }
            option && myChart1.setOption(option)
            nextTick(() => {
                window.addEventListener('resize', () => {
                    myChart1.resize()
                })
            })
        }
        onUpdated(() => {
            Echart1()
            Echart2(chartData)
        })
        onMounted(() => {
            getOnline()
            getOffline()
            ConfigByDeviceId()
            Echart1()
            Echart2(chartData)
        })
        const onlinedata = ref({})
        const offlinedata = ref({})
        const Onname = ref('')
        const Ofname = ref('')
        const getOnline = async () => {
            const res = await getdeviceOnline()
            onlinedata.value = res.data.duration
            Onname.value = res.data.deviceName
            console.log('在线', res.data.deviceName)
            Echart1()
        }
        const getOffline = async () => {
            const res = await getdeviceOffline()
            offlinedata.value = res.data.duration
            Ofname.value = res.data.deviceName
            console.log('离线', res.data.deviceName)
            Echart1()
        }
        //位号数量
        const whnumber = ref('')
        const PointByDeviceId = async () => {
            const res = await pointByDeviceId()
            whnumber.value = res.data
        }
        PointByDeviceId()
        //设备下已配置位号数量
        const unConfigCount = ref('')
        const configCount = ref('')
        const value1 = ref([])
        const options = ref([])
        // watch(value1, (newVal) => {
        //     Echart2(newVal)
        // })
        const ConfigByDeviceId = async () => {
            try {
                const res = await pointConfigByDeviceId()
                console.log(res)
                unConfigCount.value = res.data.unConfigCount
                configCount.value = res.data.configCount
                options.value = res.data.points.map((point: { id: any; pointName: any }) => ({
                    value: point.id,
                    label: point.pointName,
                }))
                value1.value = options.value.map((option) => option.value)
                console.log(value1.value)
                await DeviceByPointId()
            } catch (error) {
                console.error('发生错误:', error)
            }
        }
        //设备在不同位号下的数据量
        const chartData = ref('')
        const DeviceByPointId = async () => {
            try {
                // console.log(value1.value)
                const res = await deviceStatisticsByPointId(value1.value)
                console.log(res)
                chartData.value = res.data.map((point) => ({
                    name: point.pointName,
                    total: point.total,
                }))
                console.log(chartData.value)
                Echart2(chartData)
            } catch (error) {
                console.error('发生错误:', error)
            }
        }
        ConfigByDeviceId()
        // DeviceByPointId()
        const Echart2 = (chartData) => {
            const chartDom = document.getElementById('echart2')
            echarts.dispose(chartDom)
            const myChart = echarts.init(chartDom)
            const option = {
                title: {
                    text: '统计最近7天设备下各个位号的每天数据量',
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

            for (let i = 0; i < Math.min(chartData.value.length, 10); i++) {
                console.log(chartData.value.length)
                const seriesData = {
                    name: chartData.value[i].name,
                    type: 'line',
                    smooth: true,
                    data: chartData.value[i].total,
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
        const updateChart = () => {
            console.log('111')
            const deletedValues = options.value.filter((option) => !value1.value.includes(option.value))
            const addedValues = value1.value.filter((value) => !options.value.some((option) => option.value === value))

            const updateChartData = (res) => {
                console.log(res)
                chartData.value = res.data.map((device) => ({
                    name: device.deviceName,
                    total: device.total,
                }))
                Echart2(chartData)
            }

            if (value1.value.length === 0 && options.value.length > 0) {
                value1.value = [options.value[0].value]
            }

            if (deletedValues.length > 0 || addedValues.length > 0) {
                options.value = options.value.filter((option) => !deletedValues.includes(option.value))
                value1.value = value1.value.filter((value) => !deletedValues.includes(value))
                deviceStatisticsByPointId(value1.value).then(updateChartData)
                console.log(value1.value)
            } else {
                deviceStatisticsByPointId(value1.value).then(updateChartData)
                console.log(value1.value)
            }
        }
        const pointCard = () => [
            {
                title: '设备运行时间',
                lines: [`总在线时长:${Onname.value}`, `总离线时长:${Ofname.value}`],
            },
            {
                title: '位号统计',
                lines: [`位号数量:${whnumber.value}`, `已配置的位号数量:${configCount.value}`, `未配置的位号数量:${unConfigCount.value}`],
            },
        ]
        return {
            profileViewRef,
            pointViewRef,
            pointValueViewRef,
            reactiveData,
            profileLength,
            pointLength,
            hasPointValueData,
            options,
            value1,
            updateChart,
            pointCard,
            updateThing,
            changeActive,
            timestamp,
            Echart1,
            Echart2,
        }
    },
})
