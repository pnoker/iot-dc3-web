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
    <div class="error">
        <div class="img" style="background-image: url('/images/error/error.svg')"></div>
        <div class="content">
            <h1>500</h1>
            <div class="desc">抱歉, 你访问的页面不可用</div>
            <div class="actions">
                <router-link :to="{ path: '/' }">
                    <el-button plain type="primary">返回首页</el-button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use 'style.scss';
</style>
