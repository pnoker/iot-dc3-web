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

import { defineComponent, reactive, ref, computed, onUpdated, onMounted, nextTick } from 'vue'
import { Connection, Edit, Management, Monitor, Position, Promotion, Sunset } from '@element-plus/icons-vue'

import { useRoute } from 'vue-router'
import router from '@/config/router'

import { getDriverById, getDriverOnline, getDriverOffline, getOnlineId, getOfflineId, getDriverId, getDataPointId, gettotalpointId, getStatisticsrId } from '@/api/driver'

import blankCard from '@/components/card/blank/BlankCard.vue'
import baseCard from '@/components/card/base/BaseCard.vue'
import detailCard from '@/components/card/detail/DetailCard.vue'
import skeletonCard from '@/components/card/skeleton/SkeletonCard.vue'
import driverTool from '@/views/driver/tool/DriverTool.vue'
import deviceList from '@/views/device/Device.vue'
import driverCard from '@/views/driver/card/DriverCard.vue'
import deviceCard from '@/views/device/card/DeviceCard.vue'
import device from '@/views/device/Device.vue'
import pointCard from '@/views/point/card/PointCard.vue'

import { timestamp } from '@/utils/CommonUtils'
import * as echarts from 'echarts'
export default defineComponent({
    name: 'DriverDetail',
    components: {
        blankCard,
        baseCard,
        detailCard,
        skeletonCard,
        driverTool,
        deviceList,
        driverCard,
        deviceCard,
        device,
        pointCard,
        Position,
        Promotion,
        Edit,
        Sunset,
        Management,
        Connection,
        Monitor,
    },
    setup() {
        const route = useRoute()

        const deviceViewRef: any = ref<InstanceType<typeof device>>()

        // 定义响应式数据
        const reactiveData = reactive({
            id: route.query.id as string,
            active: route.query.active,
            data: {} as any,
        })

        const deviceLength = computed(() => {
            return deviceViewRef.value?.reactiveData.page.total || 0
        })

        // 加载驱动数据
        const driver = () => {
            console.log(reactiveData.id)
            getDriverById(reactiveData.id).then((res) => {
                reactiveData.data = res.data
                console.log(res)
            })
        }

        // 切换Tab
        const changeActive = (tab) => {
            reactiveData.active = tab.props.name
            const query = route.query
            switch (reactiveData.active) {
                case 'detail':
                    driver()
                    break
                case 'device':
                    deviceViewRef.value?.refresh()
                    break
                case 'information':
                    break
                case 'event':
                    // to do something
                    break
                default:
                    break
            }
            router.push({ query: { ...query, active: tab.props.name } })
        }

        driver()

        //信息监控
        const renderECharts = () => {
            const echart1Element = document.getElementById('echart1')
            const echart2Element = document.getElementById('echart2')

            if (echart1Element.offsetWidth === 0 || echart2Element.offsetHeight === 0) {
                // 如果 echarts 容器的宽度或高度为 0，则等待 DOM 加载完成后再进行初始化
                window.addEventListener('load', () => {
                    renderECharts()
                })
                return
            }

            let chart1 = echarts.getInstanceByDom(echart1Element)
            if (chart1) {
                chart1.dispose()
            }
            chart1 = echarts.init(echart1Element)

            let chart2 = echarts.getInstanceByDom(echart2Element)
            if (chart2) {
                chart2.dispose()
            }
            chart2 = echarts.init(echart2Element)
            const option1 = {
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
            const option2 = {
                title: {
                    text: '统计最近7天驱动每天产生的位号数据量',
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
                        name: '位号数据量',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        data: Object.values(whechart.value).reverse(),
                    },
                ],
            }
            chart1.setOption(option1)
            chart2.setOption(option2)
            nextTick(() => {
                chart1.resize()
                chart2.resize()
            })
            window.addEventListener('resize', () => {
                chart1.resize()
                chart2.resize()
            })
        }
        onUpdated(() => {
            renderECharts()
        })
        onMounted(() => {
            getOnline()
            getOffline()
            getStatisticsr()
        })
        const onlinedata = ref({})
        const offlinedata = ref({})
        const OFdriverName = ref('')
        const ONdriverName = ref('')
        const getOnline = async () => {
            const res = await getDriverOnline()
            ONdriverName.value = res.data.driverName
            onlinedata.value = res.data.duration
            renderECharts()
        }

        const getOffline = async () => {
            const res = await getDriverOffline()
            OFdriverName.value = res.data.driverName
            offlinedata.value = res.data.duration
            renderECharts()
        }
        const ONmseeage = ref('')
        const OFmseeage = ref('')
        const allmseeage = ref('')
        const getOnlineNum = async () => {
            const res = await getOnlineId()
            ONmseeage.value = res.message
        }
        getOnlineNum()
        const getOfflineNum = async () => {
            const res = await getOfflineId()
            OFmseeage.value = res.message
        }
        getOfflineNum()
        const getallNum = async () => {
            const res = await getDriverId()
            allmseeage.value = res.message
        }
        getallNum()
        //位号数据量
        const whdata = ref('')
        const getPointId = async () => {
            const res = await getDataPointId()
            whdata.value = res.data
        }
        getPointId()
        //总位号数量
        const totalpoint = ref('')
        const getTotalPoint = async () => {
            const res = await gettotalpointId()
            totalpoint.value = res.data
        }
        getTotalPoint()
        //统计7天驱动下位号数据量
        const whechart = ref({})
        const getStatisticsr = async () => {
            const res = await getStatisticsrId()
            whechart.value = res.data.total
            renderECharts()
        }
        const InforCard = () => [
            {
                title: '驱动运行时长',
                lines: [`${ONdriverName.value}在线时长`, `${OFdriverName.value}离线时长`],
            },
            {
                title: '驱动下设备数量',
                lines: [`设备数量:${allmseeage.value}`, `当前在线设备数量:${ONmseeage.value}`, `当前离线设备数量:${OFmseeage.value}`],
            },
            {
                title: `驱动下位号数据量:${whdata.value}`,
                lines: [`总位号数量:${totalpoint.value}`],
            },
        ]
        return {
            deviceViewRef,
            reactiveData,
            deviceLength,
            InforCard,
            onlinedata,
            changeActive,
            timestamp,
            renderECharts,
        }
    },
})
