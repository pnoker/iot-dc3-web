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
    <div class="tool-card">
        <el-card shadow="hover">
            <div class="tool-card__container">
                <el-form class="tool-card__body" ref="formDataRef" :rules="formRule" :model="reactiveData.formData" :inline="true">
                    <div class="tool-card-body-form">
                        <el-form-item prop="name" label="驱动名称">
                            <el-input class="edit-form-default" v-model="reactiveData.formData.driverName" placeholder="请输入驱动名称" clearable @keyup.enter="search"></el-input>
                        </el-form-item>
                        <el-form-item prop="serviceName" label="服务名称">
                            <el-input class="edit-form-default" v-model="reactiveData.formData.serviceName" placeholder="请输入服务名称" clearable @keyup.enter="search"></el-input>
                        </el-form-item>
                        <el-form-item prop="host" label="主机">
                            <el-input class="edit-form-default" v-model="reactiveData.formData.serviceHost" placeholder="请输入主机" clearable @keyup.enter="search"></el-input>
                        </el-form-item>
                        <el-form-item label="使能" prop="enableFlag">
                            <el-select class="edit-form-small" v-model="reactiveData.formData.enableFlag" placeholder="请选择使能" clearable>
                                <el-option label="启用" value="ENABLE"></el-option>
                                <el-option label="停用" value="DISABLE"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-form-item class="tool-card-body-button">
                        <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
                        <el-button :icon="RefreshRight" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <div class="tool-card__footer">
                    <div class="tool-card-footer-button">
                        <el-button v-if="add" type="success" :icon="Plus">新增</el-button>
                    </div>
                    <div class="tool-card-footer-page">
                        <el-pagination
                            layout="total, prev, pager, next, sizes"
                            :page-sizes="[6, 12, 24, 36, 48, 96]"
                            :page-size="+page.size"
                            :current-page="+page.current"
                            :total="+page.total"
                            background
                            @size-change="sizeChange"
                            @current-change="currentChange"
                        >
                        </el-pagination>
                        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                            <el-button :icon="Refresh" circle @click="refresh"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="排序" placement="top">
                            <el-button :icon="Sort" circle @click="sort"></el-button>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script src="./index.ts" lang="ts" />

<style lang="scss">
@import '@/components/card/styles/tool-card.scss';
</style>
