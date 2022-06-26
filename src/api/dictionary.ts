/*
 * Copyright (c) 2022. Pnoker. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import request from "@/config/axios";
import { R } from "@/config/type/types";

export const driverDictionary = () => request<R>({
    url: `api/v3/manager/dictionary/driver`,
    method: "get"
}).then(res => res)

export const profileDictionary = () => request<R>({
    url: `api/v3/manager/dictionary/profile`,
    method: "get"
}).then(res => res)

export const deviceDictionary = () => request<R>({
    url: `api/v3/manager/dictionary/device`,
    method: "get"
}).then(res => res)

export const pointDictionary = (parent: string) => request<R>({
    url: `api/v3/manager/dictionary/point/${parent}`,
    method: "get"
}).then(res => res)