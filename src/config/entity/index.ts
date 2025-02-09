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

/**
 * 登录信息
 */
export interface Login {
    tenant?: string
    name?: string
    salt?: string
    password?: string
    token?: string
}

/**
 * 属性
 */
export interface Attribute {
    id: string
    name: string
    attributeName: string
}

/**
 * 字典
 */
export interface Dictionary {
    type: string
    label: string
    value: string
    disabled: boolean
    expand: boolean
    children: Array<Dictionary>
}

/**
 * 排序
 */
export interface Order {
    column: string
    asc: boolean
}
