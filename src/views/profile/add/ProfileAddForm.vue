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
    <el-dialog
        v-model="reactiveData.formVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        class="things-dialog"
        draggable
        title="新增模板"
    >
        <el-form ref="formDataRef" :model="reactiveData.formData" :rules="formRule">
            <el-form-item class="things-dialog-form-item" label="模板名称" prop="profileName">
                <el-input v-model="reactiveData.formData.profileName" clearable placeholder="请输入模板名称"></el-input>
            </el-form-item>
            <el-form-item class="things-dialog-form-item" label="描述" prop="remark">
                <el-input v-model="reactiveData.formData.remark" clearable maxlength="300" placeholder="请输入模板描述" show-word-limit type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <div class="things-dialog-footer">
            <slot name="footer">
                <el-button @click="cancel">取消</el-button>
                <el-button plain type="success" @click="reset">重置</el-button>
                <el-button type="primary" @click="addThing">确定</el-button>
            </slot>
        </div>
    </el-dialog>
</template>

<script lang="ts" src="./index.ts" />

<style lang="scss" scoped>
    @use '@/components/dialog/styles/things-dialog.scss';
</style>
