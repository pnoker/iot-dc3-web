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
                <el-tab-pane label="驱动信息" name="detail">
                    <detail-card>
                        <ul>
                            <li>
                                <el-icon>
                                    <Position />
                                </el-icon>
                                驱动名称: {{ reactiveData.data.driverName }}
                            </li>
                            <li>
                                <el-icon>
                                    <Management />
                                </el-icon>
                                关联设备: {{ deviceLength }} 个
                            </li>
                            <li class="nowrap-item">
                                <el-icon>
                                    <Monitor />
                                </el-icon>
                                主机: {{ reactiveData.data.serviceHost }}
                            </li>
                            <li class="nowrap-item">
                                <el-icon>
                                    <Promotion />
                                </el-icon>
                                驱动服务: {{ reactiveData.data.serviceName }}
                            </li>
                            <li>
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                修改日期: {{ timestamp(reactiveData.data.createTime) }}
                            </li>
                            <li>
                                <el-icon>
                                    <Sunset />
                                </el-icon>
                                创建日期: {{ timestamp(reactiveData.data.operateTime) }}
                            </li>
                        </ul>
                    </detail-card>
                </el-tab-pane>
                <el-tab-pane label="关联设备" name="device">
                    <device ref="deviceViewRef" :embedded="'driver'" :driver-id="reactiveData.id"></device>
                </el-tab-pane>
                <el-tab-pane label="信息监控" name="information">
                    <el-row :gutter="20">
                        <el-col :span="8" v-for="(item, index) in InforCard()" :key="index">
                            <el-card class="inforcard" shadow="hover">
                                <p>{{ item.title }}</p>
                                <p v-for="(line, i) in item.lines" :key="i">{{ line }}</p>
                            </el-card>
                        </el-col>
                    </el-row>
                    <div id="echart1" class="echart-container" />
                    <div id="echart2" class="echart-container" />
                </el-tab-pane>
                <!-- <el-tab-pane label="驱动模型" name="model">
                    <el-empty description="暂无驱动模型数据！"></el-empty>
                </el-tab-pane>
                <el-tab-pane label="驱动事件" name="event">
                    <el-timeline>
                        <el-timeline-item timestamp="2021/7/30" placement="top">
                            <el-card>
                                <h4>驱动上线</h4>
                                <p>该驱动于 2021/7/30 20:46 上线</p>
                            </el-card>
                        </el-timeline-item>
                        <el-timeline-item timestamp="2021/7/30" placement="top">
                            <el-card>
                                <h4>驱动注册</h4>
                                <p>该驱动于 2021/7/30 20:46 注册成功</p>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </el-tab-pane> -->
            </el-tabs>
        </base-card>
    </div>
</template>
<script src="./index.ts" lang="ts" />

<style lang="scss">
.detail-content {
    margin-left: 0 !important;
    margin-right: 0 !important;

    .detail-content-left {
        .el-scrollbar {
            height: calc(100vh - 273px);
        }
    }
}
/* .third-text {
    border: 1px solid black;
    text-align: center;
    font-weight: 400;
} */

.echart-container {
    height: 320px;
    width: 100%;
    margin-top: 30px;
    margin-bottom: 20px;
}
.inforcard {
    padding: 0;
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
}
</style>
