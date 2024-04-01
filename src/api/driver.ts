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

import request from '@/config/axios'

export const getDriverById = (id: string) =>
    request<R>({
        url: `api/v3/manager/driver/id/${id}`,
        method: 'get',
    })

export const getDriverByIds = (driverIds: any) =>
    request<R>({
        url: `api/v3/manager/driver/ids`,
        method: 'post',
        data: driverIds,
    })

export const getDriverList = (driver: any) =>
    request<R>({
        url: `api/v3/manager/driver/list`,
        method: 'post',
        data: driver,
    })

export const getDriverStatus = (driver: any) =>
    request<R>({
        url: `api/v3/data/driver/status/driver`,
        method: 'post',
        data: driver,
    })

export const getDriverOnline = () =>
    request<R>({
        url: `api/v3/data/driver/status/driverOnline/1768309657572560898`,
        method: 'get',
    })
export const getDriverOffline = () =>
    request<R>({
        url: `api/v3/data/driver/status/driverOffline/1768309657572560898`,
        method: 'get',
    })
//在线设备数据量
export const getOnlineId = () =>
    request<R>({
        url: `api/v3/data/driver/status/getDeviceOnlineByDriverId/1768309657572560898`,
        method: 'get',
    })
//离线设备数据量
export const getOfflineId = () =>
    request<R>({
        url: `api/v3/data/driver/status/getDeviceOfflineByDriverId/1764560313863610369`,
        method: 'get',
    })
//设备数量
export const getDriverId = () =>
    request<R>({
        url: `api/v3/manager//device/getDeviceByDriverId/1764560313863610369`,
        method: 'get',
    })
//驱动下位号数据量
export const getDataPointId = () =>
    request<R>({
        url: `api/v3/manager/point/selectPointDataByDriverId/1764560313863610369`,
        method: 'get',
    })
//总位号数量
export const gettotalpointId = () =>
    request<R>({
        url: `api/v3/manager/point/selectPointByDriverId/1764560313863610369`,
        method: 'get',
    })
//统计7天驱动下位号数据量
export const getStatisticsrId = () =>
    request<R>({
        url: `api/v3/manager/point/selectPointDataStatisticsByDriverId/1764560313863610369`,
        method: 'get',
    })
