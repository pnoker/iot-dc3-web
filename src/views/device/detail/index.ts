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

import { computed, defineComponent, reactive, ref, onMounted, watch, onUpdated, nextTick } from 'vue'
import { CollectionTag, Edit, List, Management, Promotion, Sunset } from '@element-plus/icons-vue'

import { useRoute } from 'vue-router'
import router from '@/config/router'

import { getDriverById } from '@/api/driver'
import { getProfileByDeviceId } from '@/api/profile'
import { getDeviceById, getdeviceOnline, getdeviceOffline } from '@/api/device'
import { getProfileByIds } from '@/api/profile'

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

import { timestamp } from '@/utils/CommonUtils'
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
        const value1 = ref(['位号一'])
        const pointCard = [
            {
                title: '设备运行时间',
                lines: ['总在线时长:XX', '总离线时长:XXX'],
            },
            {
                title: '位号统计',
                lines: ['位号数量:XX', '已配置的位号数量:XX', '未配置的位号数量:XX'],
            },
        ]
        const options = [
            {
                value: '位号一',
                label: '位号一',
            },
            {
                value: '位号二',
                label: '位号二',
            },
            {
                value: '位号三',
                label: '位号三',
            },
            {
                value: '位号四',
                label: '位号四',
            },
            {
                value: '位号五',
                label: '位号五',
            },
            {
                value: '位号六',
                label: '位号六',
            },
            {
                value: '位号七',
                label: '位号七',
            },
            {
                value: '位号八',
                label: '位号八',
            },
            {
                value: '位号九',
                label: '位号九',
            },
            {
                value: '位号十',
                label: '位号十',
            },
        ]
        watch(value1, (newVal) => {
            Echart2(newVal)
        })
        const Echart1 = () => {
            const echart1Element = document.getElementById('echart1')
            if (echart1Element.offsetWidth === 0) {
                // 如果 echarts 容器的宽度或高度为 0，则等待 DOM 加载完成后再进行初始化
                window.addEventListener('load', () => {
                    Echart1()
                })
                return
            }
            let chart1 = echarts.getInstanceByDom(echart1Element)
            if (chart1) {
                chart1.dispose()
            }
            chart1 = echarts.init(echart1Element)
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
                        stack: 'Total',
                        smooth: true,
                        data: Object.values(onlinedata.value).reverse(),
                    },
                    {
                        name: '离线时长',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: Object.values(offlinedata.value).reverse(),
                    },
                ],
            }
            chart1.setOption(option)

            nextTick(() => {
                chart1.resize()
            })
            window.addEventListener('resize', () => {
                chart1.resize()
            })
        }
        const Echart2 = () => {
            const chartDom = document.getElementById('echart2')
            if (chartDom.offsetWidth === 0) {
                // 如果 echarts 容器的宽度或高度为 0，则等待 DOM 加载完成后再进行初始化
                window.addEventListener('load', () => {
                    Echart2()
                })
                return
            }
            let myChart = echarts.getInstanceByDom(chartDom)
            if (myChart) {
                myChart.dispose() // 销毁已经初始化的实例
            }
            myChart = echarts.init(chartDom)
            let option
            option = {
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
                series: [
                    {
                        name: '位号一',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [120, 132, 101, 134, 90, 230, 210],
                    },
                    {
                        name: '位号二',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [220, 182, 191, 234, 290, 330, 310],
                    },
                    {
                        name: '位号三',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [150, 232, 201, 154, 190, 330, 410],
                    },
                    {
                        name: '位号四',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [320, 332, 301, 334, 390, 330, 320],
                    },
                    {
                        name: '位号五',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                    },
                    {
                        name: '位号六',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [80, 102, 101, 154, 90, 200, 200],
                    },
                    {
                        name: '位号七',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [110, 112, 171, 134, 100, 230, 1330],
                    },
                    {
                        name: '位号八',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [132, 132, 101, 1330, 90, 230, 210],
                    },
                    {
                        name: '位号九',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [120, 102, 1101, 134, 190, 230, 210],
                    },
                    {
                        name: '位号十',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: [320, 132, 1101, 134, 190, 230, 1210],
                    },
                ],
            }

            const updateChart = () => {
                const filteredSeries = option.series.filter((series) => value1.value.includes(series.name))
                const newOption = { ...option, series: filteredSeries }
                myChart.setOption(newOption)
            }

            updateChart()

            window.addEventListener('resize', () => {
                myChart.resize()
            })
            nextTick(() => {
                myChart.resize()
            })
        }
        onUpdated(() => {
            Echart1()
            Echart2()
        })
        onMounted(() => {
            getOnline()
            getOffline()
            Echart2()
        })
        const onlinedata = ref({})
        const offlinedata = ref({})
        const getOnline = async () => {
            const res = await getdeviceOnline()
            onlinedata.value = res.data.duration
            console.log(res.data.duration)
            Echart1()
        }
        const getOffline = async () => {
            const res = await getdeviceOffline()
            offlinedata.value = res.data.duration
            console.log(res.data.duration)
            Echart1()
        }
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
            pointCard,
            updateThing,
            changeActive,
            timestamp,
            Echart1,
            Echart2,
        }
    },
})
