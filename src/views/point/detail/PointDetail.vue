<!--
  - Copyright 2016-present the IoT DC3 original author or authors.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -      https://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
    <div>
        <base-card>
            <el-tabs v-model="reactiveData.active" @tab-click="changeActive">
                <el-tab-pane label="位号信息" name="detail">
                    <detail-card>
                        <ul>
                            <li>
                                <el-icon>
                                    <CollectionTag />
                                </el-icon>
                                位号名称:
                                {{ reactiveData.data.pointName }}
                            </li>
                            <li>
                                <el-icon>
                                    <Management />
                                </el-icon>
                                关联设备 [{{ reactiveData.listDeviceData.length || 0 }} 个]: {{ deviceName() }}
                            </li>
                            <li>
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                修改日期:
                                {{ timestamp(reactiveData.data.createTime) }}
                            </li>
                            <li>
                                <el-icon>
                                    <Sunset />
                                </el-icon>
                                创建日期:
                                {{ timestamp(reactiveData.data.operateTime) }}
                            </li>
                        </ul>
                    </detail-card>
                </el-tab-pane>
                <el-tab-pane label="关联设备" name="device">
                    <el-row>
                        <el-col v-for="data in reactiveData.listDeviceData" :key="data.id" :lg="6" :md="8" :sm="12" :xl="4" :xs="24">
                            <device-card :data="data" :driver="reactiveData.driverTable[data.driverId]" :embedded="true" :status="reactiveData.statusTable[data.id]"></device-card>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </base-card>
    </div>
</template>

<script lang="ts" src="./index.ts" />

<style lang="scss" scoped>
    @use '@/components/card/styles/things-card.scss';
</style>
