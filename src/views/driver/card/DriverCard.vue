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
    <div class="things-card" @click="select">
        <el-card shadow="hover">
            <div class="things-card-content">
                <div
                    :class="{
                        'header-enable': 'ENABLE' === data.enableFlag,
                        'header-disable': 'ENABLE' !== data.enableFlag
                    }"
                    class="things-card__header"
                >
                    <div class="things-card-header-icon">
                        <img :alt="data.driverName" :src="icon" />
                    </div>
                    <div class="things-card-header-name nowrap-name" @click="copyId(data.id, '驱动ID')">
                        {{ data.driverName }}
                    </div>
                    <div class="things-card-header-status" title="状态">
                        <el-tag v-if="status === 'ONLINE'" effect="plain" type="success">在线</el-tag>
                        <el-tag v-else-if="status === 'MAINTAIN'" effect="plain" type="warning">维护</el-tag>
                        <el-tag v-else-if="status === 'FAULT'" effect="plain" type="danger">故障</el-tag>
                        <el-tag v-else-if="status === 'DISABLE'" effect="plain" type="info">停用</el-tag>
                        <el-tag v-else-if="status === 'REGISTERING'" effect="plain" type="info">注册中</el-tag>
                        <el-tag v-else effect="plain" type="info">离线</el-tag>
                    </div>
                </div>
                <div class="things-card__body">
                    <div class="things-card-body-content">
                        <ul>
                            <li class="nowrap-item">
                                <el-icon>
                                    <Monitor />
                                </el-icon>
                                主机: {{ data.serviceHost }}
                            </li>
                            <li class="nowrap-item">
                                <el-icon>
                                    <Promotion />
                                </el-icon>
                                驱动服务: {{ data.serviceName }}
                            </li>
                            <li class="nowrap-item">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                修改日期: {{ timestamp(data.operateTime) }}
                            </li>
                            <li class="nowrap-item">
                                <el-icon>
                                    <Sunset />
                                </el-icon>
                                创建日期: {{ timestamp(data.createTime) }}
                            </li>
                        </ul>
                    </div>
                    <div :title="data.remark ? data.remark : '驱动描述信息'" class="things-card-body-content">
                        <p class="nowrap-description">
                            {{ data.remark ? data.remark : '无描述信息' }}
                        </p>
                    </div>
                </div>
                <div v-if="!footer" class="things-card__footer">
                    <div class="things-card-footer-operation">
                        <el-button link type="primary" @click="detail">详情</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" src="./index.ts" />

<style lang="scss" scoped>
    @use '@/components/card/styles/things-card.scss';
    @use '@/views/driver/card/style.scss';
</style>
