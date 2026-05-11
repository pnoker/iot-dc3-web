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
  <el-form-item :label="$t('common.group')" :prop="groupProp">
    <el-select
      v-model="groupModel"
      class="edit-form-special"
      clearable
      filterable
      remote
      reserve-keyword
      :placeholder="$t('entityBinding.groupPlaceholder')"
      :remote-method="loadGroups"
      :loading="groupLoading"
      @visible-change="onGroupVisible"
    >
      <el-option v-for="group in groupOptions" :key="group.id" :label="group.groupName" :value="group.id" />
    </el-select>
  </el-form-item>
  <el-form-item :label="$t('common.label')" :prop="labelProp">
    <el-select
      v-model="labelModel"
      class="edit-form-special"
      clearable
      filterable
      remote
      reserve-keyword
      :placeholder="$t('entityBinding.labelPlaceholder')"
      :remote-method="loadLabels"
      :loading="labelLoading"
      @visible-change="onLabelVisible"
    >
      <el-option v-for="label in labelOptions" :key="label.id" :label="label.labelName" :value="label.id">
        <span class="entity-taxonomy-option">
          <span class="entity-taxonomy-option__color" :style="{ backgroundColor: label.labelColor || '#909399' }" />
          <span>{{ label.labelName }}</span>
        </span>
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { getGroupList } from '@/api/group';
  import { getLabelList } from '@/api/label';

  const props = defineProps({
    entityTypeFlag: {
      type: String,
      required: true,
    },
    groupId: {
      type: [String, Number],
      default: '',
    },
    labelId: {
      type: [String, Number],
      default: '',
    },
    groupProp: {
      type: String,
      default: 'groupId',
    },
    labelProp: {
      type: String,
      default: 'labelId',
    },
  });

  const emit = defineEmits(['update:groupId', 'update:labelId']);

  const groupOptions = ref<any[]>([]);
  const labelOptions = ref<any[]>([]);
  const groupLoading = ref(false);
  const labelLoading = ref(false);

  const groupModel = computed({
    get: () => props.groupId,
    set: (value) => emit('update:groupId', value),
  });

  const labelModel = computed({
    get: () => props.labelId,
    set: (value) => emit('update:labelId', value),
  });

  const loadGroups = (keyword = '') => {
    groupLoading.value = true;
    getGroupList({
      page: { size: 50, current: 1 },
      groupName: keyword,
      groupTypeFlag: props.entityTypeFlag,
      enableFlag: 'ENABLE',
    })
      .then((res: any) => {
        groupOptions.value = res.data?.records || [];
      })
      .catch(() => {
        // handled globally
      })
      .finally(() => {
        groupLoading.value = false;
      });
  };

  const loadLabels = (keyword = '') => {
    labelLoading.value = true;
    getLabelList({
      page: { size: 50, current: 1 },
      labelName: keyword,
      entityTypeFlag: props.entityTypeFlag,
      enableFlag: 'ENABLE',
    })
      .then((res: any) => {
        labelOptions.value = res.data?.records || [];
      })
      .catch(() => {
        // handled globally
      })
      .finally(() => {
        labelLoading.value = false;
      });
  };

  const onGroupVisible = (visible: boolean) => {
    if (visible) loadGroups('');
  };

  const onLabelVisible = (visible: boolean) => {
    if (visible) loadLabels('');
  };
</script>

<style lang="scss" scoped>
  .entity-taxonomy-option {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .entity-taxonomy-option__color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid var(--el-border-color-lighter);
  }
</style>
