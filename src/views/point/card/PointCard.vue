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
    <div class="things-card">
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
                        <img :alt="data.pointName" :src="icon" />
                    </div>
                    <div class="things-card-header-name nowrap-name" @click="copyId(data.id, '位号ID')">
                        {{ data.pointName }}
                    </div>
                    <div class="things-card-header-status" title="状态"></div>
                </div>
                <div class="things-card__body">
                    <div class="things-card-body-content">
                        <ul class="things-body-content-item-column-2">
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><List /></el-icon> 所属模板: </span
                                >{{ profile.profileName }}
                            </li>
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><Location /></el-icon> 比例系数: </span
                                >{{ data.multiple }}
                            </li>
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><Location /></el-icon> 数据精度: </span
                                >{{ data.valueDecimal }}
                            </li>
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><Location /></el-icon> 单位: </span
                                >{{ data.unit }}
                            </li>
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><Edit /></el-icon> 修改日期: </span
                                >{{ timestamp(data.operateTime) }}
                            </li>
                        </ul>
                        <ul class="things-body-content-item-column-2">
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><Location /></el-icon> 数据类型: </span
                                >{{ pointTypeFlag }}
                            </li>
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><Location /></el-icon> 基础值: </span
                                >{{ data.baseValue }}
                            </li>
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><Location /></el-icon> 处理值: </span
                                >Y = {{ data.multiple }}X + {{ data.baseValue }}, 保留{{ data.valueDecimal }}位小数
                            </li>
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><Location /></el-icon> 读写标识: </span
                                >{{ rwFlag }}
                            </li>
                            <li class="nowrap-item">
                                <span
                                    ><el-icon><Sunset /></el-icon> 创建日期: </span
                                >{{ timestamp(data.createTime) }}
                            </li>
                        </ul>
                    </div>
                    <div class="things-card-body-content" title="位号描述信息">
                        <p class="nowrap-description">
                            {{ data.remark ? data.remark : '无描述信息' }}
                        </p>
                    </div>
                </div>
                <div v-if="!embedded" class="things-card__footer">
                    <div class="things-card-footer-operation">
                        <el-popconfirm :icon="SwitchButton" icon-color="#e6a23c" placement="top" title="是否确定停用该位号?" @confirm="disableThing">
                            <template #reference>
                                <el-button :disabled="'ENABLE' !== data.enableFlag" link type="primary">停用</el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm :icon="CircleCheck" icon-color="#67c23a" placement="top" title="是否确定启用该位号?" @confirm="enableThing">
                            <template #reference>
                                <el-button :disabled="'ENABLE' === data.enableFlag" link type="primary">启用</el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm
                            :icon="CircleClose"
                            icon-color="#f56c6c"
                            placement="top"
                            title="是否确定删除该位号?该位号下的配置将会被全部删除, 且该操作不可恢复!"
                            @confirm="deleteThing"
                        >
                            <template #reference>
                                <el-button link type="primary">删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-button link type="primary" @click="edit">编辑</el-button>
                        <el-button disabled link type="primary" @click="detail">详情</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" src="./index.ts" />

<style lang="scss" scoped>
    @use '@/components/card/styles/things-card.scss';
</style>
