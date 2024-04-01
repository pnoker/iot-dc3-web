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

/**
 * 新增设备
 *
 * @param device Device
 * @returns MyAxiosPromise
 */
export const addDevice = (device: any) =>
    request<R>({
        url: `api/v3/manager/device/add`,
        method: 'post',
        data: device,
    })

/**
 * 删除设备
 *
 * @param id 设备ID
 * @returns MyAxiosPromise
 */
export const deleteDevice = (id: string) =>
    request<R>({
        url: `api/v3/manager/device/delete/${id}`,
        method: 'post',
    })

/**
 * 更新设备
 *
 * @param device Device
 * @returns MyAxiosPromise
 */
export const updateDevice = (device: any) =>
    request<R>({
        url: `api/v3/manager/device/update`,
        method: 'post',
        data: device,
    })

/**
 * 通过设备ID查询设备
 *
 * @param id 设备ID
 * @returns MyAxiosPromise
 */
export const getDeviceById = (id: string) =>
    request<R>({
        url: `api/v3/manager/device/id/${id}`,
        method: 'get',
    })

/**
 * 通过设备ID集查询设备
 *
 * @param deviceIds DeviceId Array
 * @returns MyAxiosPromise
 */
export const getDeviceByIds = (deviceIds: any) =>
    request<R>({
        url: `api/v3/manager/device/ids`,
        method: 'post',
        data: deviceIds,
    })

/**
 * 通过驱动ID查询设备
 *
 * @param driverId 驱动ID
 * @returns MyAxiosPromise
 */
export const getDeviceByDriverId = (driverId: string) =>
    request<R>({
        url: `api/v3/manager/device/driver_id/${driverId}`,
        method: 'get',
    })

/**
 * 通过模板ID查询设备
 *
 * @param profileId 模板ID
 * @returns MyAxiosPromise
 */
export const getDeviceByProfileId = (profileId: string) =>
    request<R>({
        url: `api/v3/manager/device/profile_id/${profileId}`,
        method: 'get',
    })

/**
 * 分页查询设备
 *
 * @param device Device
 * @returns MyAxiosPromise
 */
export const getDeviceList = (device: any) =>
    request<R>({
        url: `api/v3/manager/device/list`,
        method: 'post',
        data: device,
    })

/**
 * 分页查询设备状态
 *
 * @param device Device
 * @returns MyAxiosPromise
 */
export const getDeviceStatus = (device: any) =>
    request<R>({
        url: `api/v3/data/device/status/device`,
        method: 'post',
        data: device,
    })

/**
 * 通过驱动ID查询设备状态
 *
 * @param driverId 驱动ID
 * @returns MyAxiosPromise
 */
export const getDeviceStatusByDriverId = (driverId: string) =>
    request<R>({
        url: `api/v3/data/device/status/device/driver_id/${driverId}`,
        method: 'get',
    })

/**
 * 通过模板ID查询设备状态
 *
 * @param profileId 模板ID
 * @returns MyAxiosPromise
 */
export const getDeviceStatusByProfileId = (profileId: string) =>
    request<R>({
        url: `api/v3/data/device/status/device/profile_id/${profileId}`,
        method: 'get',
    })

/**
 * 通过驱动ID和模板ID获取设备导入模板
 *
 * @param device Device
 * @returns MyAxiosPromise
 */
export const importDeviceTemplate = (device: any) =>
    request<R>({
        url: `api/v3/manager/device/import/template`,
        responseType: 'blob',
        method: 'post',
        data: device,
    })

/**
 * 通过驱动ID和模板ID获取设备导入模板
 *
 * @param device Device
 * @returns MyAxiosPromise
 */
export const importDevice = (device: any) =>
    request<R>({
        url: `api/v3/manager/device/import`,
        method: 'post',
        timeout: 0,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: device,
    })
    export const getdeviceOnline = () =>
    request<R>({
        url: `api/v3/data/device/status/deviceOnline/1768316832571260930`,
        method: 'get',
    })

export const getdeviceOffline = () =>
    request<R>({
        url: `api/v3/data/device/status/deviceOffline/1768514346554793985`,
        method: 'get',
    })
//位号详情
export const tagDetailsTotle = () =>
    request<R>({
        url: `api/v3/manager/point/selectPointStatisticsWithDevice/1768514129788968962`,
        method: 'GET',
    })
export const tagDetailsData = () =>
    request<R>({
        url: `api/v3/manager/point/selectPointStatisticsByPointId/1768316736936935426`,
        method: 'GET',
    })
export const tagDetailsEquipments = (deviceId) =>
    request<R>({
        url: `api/v3/manager/point/selectPointStatisticsByDeviceId/1768514129788968962`,
        method: 'POST',
        data:  deviceId
    })

    export const pointByDeviceId = () =>
    request<R>({
        url: `api/v3/manager/point/selectPointByDeviceId/1768514346554793985`,
        method: 'get',
    })
//设备下已配置位号数量
export const pointConfigByDeviceId = () =>
    request<R>({
        url: `api/v3/manager/point/selectPointConfigByDeviceId/1768514346554793985`,
        method: 'get',
    })
//设备在不同位号下的数据量
export const deviceStatisticsByPointId = (pointid: any) =>
    request<R>({
        url: `api/v3/manager/point/selectDeviceStatisticsByPointId/1768316832571260930`,
        method: 'post',
        data: JSON.stringify([pointid]),
    })
