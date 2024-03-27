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

import { defineComponent, reactive, onMounted, watch, onUpdated, nextTick, ref } from 'vue'
import { CollectionTag, Edit, Management, Sunset } from '@element-plus/icons-vue'

import { useRoute } from 'vue-router'
import router from '@/config/router'

import { getDeviceByDriverId, getDeviceStatusByDriverId } from '@/api/device'
import { getProfileByIds } from '@/api/profile'
import { getDriverByIds } from '@/api/driver'
import { getDriverById } from '@/api/driver'

import baseCard from '@/components/card/base/BaseCard.vue'
import detailCard from '@/components/card/detail/DetailCard.vue'
import deviceCard from '@/views/device/card/DeviceCard.vue'
import pointCard from '@/views/point/card/PointCard.vue'
import * as echarts from 'echarts'
import { timestamp } from '@/utils/CommonUtils'

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

        const deviceName = () => {
            return reactiveData.listDeviceData.map((device) => device.pointName).join(', ')
        }

        const changeActive = (tab) => {
            const query = route.query
            router.push({ query: { ...query, active: tab.props.name } }).catch(() => {
                // nothing to do
            })
            switch (tab.props.name) {
                case 'whdetail':
                    Echart2()
                    break
                default:
                    break
            }
        }

        driver()
        device()

        //位号详情
        const InforCard = [
            {
                title: '当前位号被XX个设备引用',
            },
            {
                title: '当前位号下数据量:XXX',
            },
        ]
        onMounted(() => {
            Echart2()
        })
        const value1 = ref(['设备一'])
        const options = [
            {
                value: '设备一',
                label: '设备一',
            },
            {
                value: '设备二',
                label: '设备二',
            },
            {
                value: '设备三',
                label: '设备三',
            },
            {
                value: '设备四',
                label: '设备四',
            },
            {
                value: '设备五',
                label: '设备五',
            },
            {
                value: '设备六',
                label: '设备六',
            },
            {
                value: '设备七',
                label: '设备七',
            },
            {
                value: '设备八',
                label: '设备八',
            },
            {
                value: '设备九',
                label: '设备九',
            },
            {
                value: '设备十',
                label: '设备十',
            },
        ]
        watch(value1, (newVal) => {
            Echart2(newVal)
        })
        const Echart2 = () => {
            const initChart = () => {
                const chartDom = document.getElementById('echart2')
                if (!chartDom || chartDom.offsetWidth === 0 || chartDom.offsetHeight === 0) {
                    // 如果未加载完或者宽高为0，终止初始化
                    return
                }

                let myChart = echarts.init(chartDom)
                if (myChart) {
                    myChart.dispose() // 销毁已经初始化的实例
                }
                myChart = echarts.init(chartDom)
                let option
                option = {
                    title: {
                        text: '统计最近7天位号在不同设备下产生的数据量',
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
                            name: '设备一',
                            type: 'line',
                            stack: 'Total',
                            data: [120, 132, 101, 134, 90, 230, 210],
                        },
                        {
                            name: '设备二',
                            type: 'line',
                            stack: 'Total',
                            data: [220, 182, 191, 234, 290, 330, 310],
                        },
                        {
                            name: '设备三',
                            type: 'line',
                            stack: 'Total',
                            data: [150, 232, 201, 154, 190, 330, 410],
                        },
                        {
                            name: '设备四',
                            type: 'line',
                            stack: 'Total',
                            data: [320, 332, 301, 334, 390, 330, 320],
                        },
                        {
                            name: '设备五',
                            type: 'line',
                            stack: 'Total',
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                        },
                        {
                            name: '设备六',
                            type: 'line',
                            stack: 'Total',
                            data: [80, 102, 101, 154, 90, 200, 200],
                        },
                        {
                            name: '设备七',
                            type: 'line',
                            stack: 'Total',
                            data: [110, 112, 171, 134, 100, 230, 1330],
                        },
                        {
                            name: '设备八',
                            type: 'line',
                            stack: 'Total',
                            data: [132, 132, 101, 1330, 90, 230, 210],
                        },
                        {
                            name: '设备九',
                            type: 'line',
                            stack: 'Total',
                            data: [120, 102, 1101, 134, 190, 230, 210],
                        },
                        {
                            name: '设备十',
                            type: 'line',
                            stack: 'Total',
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

            initChart()
        }
        onUpdated(() => {
            Echart2()
        })
        return {
            reactiveData,
            options,
            value1,
            InforCard,
            Echart2,
            driver,
            device,
            deviceName,
            changeActive,
            timestamp,
        }
    },
})
