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
    <div class="blank-card">
        <el-card class="blank-card__body" shadow="hover">
            <div class="blank-card__container">
                <slot />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
    .blank-card {
        border-radius: 4px;
        box-sizing: border-box;

        ul {
            list-style: none;

            li {
                font-size: 13px;
                margin-top: 8px;
            }
        }

        :deep(.el-card) {
            width: 100%;
            box-sizing: border-box;
        }

        :deep(.el-card.blank-card__body) {
            border: 0;
        }

        :deep(.el-card__body) {
            padding: 10px 5px 0;
        }

        :deep(.el-tabs__nav) {
            margin: 0 5px;
        }
    }
</style>
