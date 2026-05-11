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
    v-model="reactiveData.visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="things-dialog"
    draggable
    :title="dialogTitle"
    @closed="reset"
  >
    <el-form v-loading="reactiveData.loading" label-position="top">
      <el-form-item :label="t('common.group')">
        <el-tree-select
          v-model="reactiveData.form.groupId"
          :data="groupTree"
          :props="{ label: 'groupName', children: 'children' }"
          :placeholder="t('entityBinding.groupPlaceholder')"
          clearable
          check-strictly
          node-key="id"
          :default-expanded-keys="groupExpandedKeys"
        />
      </el-form-item>
      <el-form-item :label="t('common.label')">
        <el-select
          v-model="reactiveData.form.labelIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          clearable
          filterable
          :placeholder="t('entityBinding.labelPlaceholder')"
        >
          <el-option v-for="label in reactiveData.labels" :key="label.id" :label="label.labelName" :value="label.id">
            <span class="entity-bind-label-option">
              <span
                class="entity-bind-label-option__color"
                :style="{ backgroundColor: label.labelColor || '#909399' }"
              />
              <span>{{ label.labelName }}</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="things-dialog-footer">
      <el-button @click="reactiveData.visible = false">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="reactiveData.submitting" @click="submit">
        {{ t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { computed, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { addGroupBind, deleteGroupBind, getGroupBindList, updateGroupBind } from '@/api/groupBind';
  import { addLabelBind, deleteLabelBind, getLabelBindList } from '@/api/labelBind';
  import { getGroupList } from '@/api/group';
  import { getLabelList } from '@/api/label';
  import { successMessage } from '@/utils/NotificationUtil';

  const ENTITY_NAME_FIELD: Record<string, string> = {
    DRIVER: 'driverName',
    PROFILE: 'profileName',
    POINT: 'pointName',
    DEVICE: 'deviceName',
  };

  const { t } = useI18n();
  const emit = defineEmits(['saved']);

  const reactiveData = reactive({
    visible: false,
    loading: false,
    submitting: false,
    entityTypeFlag: '',
    entity: {} as Record<string, any>,
    groups: [] as any[],
    labels: [] as any[],
    groupBind: null as any,
    labelBinds: [] as any[],
    form: {
      groupId: '' as string,
      labelIds: [] as string[],
    },
  });

  const entityId = computed(() => String(reactiveData.entity?.id || ''));

  const entityName = computed(() => {
    const key = ENTITY_NAME_FIELD[reactiveData.entityTypeFlag] || 'name';
    return reactiveData.entity?.[key] || entityId.value;
  });

  const dialogTitle = computed(() => {
    if (!reactiveData.entityTypeFlag) return t('entityBinding.title');
    return t('entityBinding.titleWithEntity', {
      type: reactiveData.entityTypeFlag,
      name: entityName.value,
    });
  });

  const groupTree = computed(() => {
    const nodes = reactiveData.groups.map((group) => ({
      ...group,
      id: String(group.id),
      parentGroupId: group.parentGroupId ? String(group.parentGroupId) : '',
      children: [] as any[],
    }));
    const byId = new Map<string, any>();
    nodes.forEach((node) => byId.set(node.id, node));
    const roots: any[] = [];
    nodes.forEach((node) => {
      const parent = node.parentGroupId ? byId.get(node.parentGroupId) : undefined;
      if (parent) parent.children.push(node);
      else roots.push(node);
    });
    return roots;
  });

  const groupExpandedKeys = computed(() => groupTree.value.map((group) => group.id));

  const reset = () => {
    reactiveData.loading = false;
    reactiveData.submitting = false;
    reactiveData.entityTypeFlag = '';
    reactiveData.entity = {};
    reactiveData.groups = [];
    reactiveData.labels = [];
    reactiveData.groupBind = null;
    reactiveData.labelBinds = [];
    reactiveData.form.groupId = '';
    reactiveData.form.labelIds = [];
  };

  const load = async () => {
    reactiveData.loading = true;
    try {
      const [groupRes, labelRes, groupBindRes, labelBindRes]: any[] = await Promise.all([
        getGroupList({
          page: { size: 1000, current: 1 },
          groupTypeFlag: reactiveData.entityTypeFlag,
          enableFlag: 'ENABLE',
        }),
        getLabelList({
          page: { size: 1000, current: 1 },
          entityTypeFlag: reactiveData.entityTypeFlag,
          enableFlag: 'ENABLE',
        }),
        getGroupBindList({
          page: { size: 10, current: 1 },
          entityTypeFlag: reactiveData.entityTypeFlag,
          entityId: entityId.value,
        }),
        getLabelBindList({
          page: { size: 1000, current: 1 },
          entityTypeFlag: reactiveData.entityTypeFlag,
          entityId: entityId.value,
        }),
      ]);
      reactiveData.groups = groupRes.data?.records || [];
      reactiveData.labels = labelRes.data?.records || [];
      const groupBinds = groupBindRes.data?.records || [];
      reactiveData.groupBind = groupBinds[0] || null;
      reactiveData.labelBinds = labelBindRes.data?.records || [];
      reactiveData.form.groupId = reactiveData.groupBind?.groupId ? String(reactiveData.groupBind.groupId) : '';
      reactiveData.form.labelIds = reactiveData.labelBinds.map((bind: any) => String(bind.labelId));
    } catch {
      // handled globally
    } finally {
      reactiveData.loading = false;
    }
  };

  const show = (entityTypeFlag: string, entity: Record<string, any>) => {
    reactiveData.entityTypeFlag = entityTypeFlag;
    reactiveData.entity = entity;
    reactiveData.visible = true;
    load();
  };

  const submitGroup = async () => {
    const selectedGroupId = reactiveData.form.groupId ? String(reactiveData.form.groupId) : '';
    const currentBind = reactiveData.groupBind;
    const currentGroupId = currentBind?.groupId ? String(currentBind.groupId) : '';
    if (!currentBind && selectedGroupId) {
      await addGroupBind({
        entityTypeFlag: reactiveData.entityTypeFlag,
        entityId: entityId.value,
        groupId: selectedGroupId,
      });
      return;
    }
    if (currentBind && !selectedGroupId) {
      await deleteGroupBind(String(currentBind.id));
      return;
    }
    if (currentBind && selectedGroupId && selectedGroupId !== currentGroupId) {
      await updateGroupBind({
        ...currentBind,
        entityTypeFlag: reactiveData.entityTypeFlag,
        entityId: entityId.value,
        groupId: selectedGroupId,
      });
    }
  };

  const submitLabels = async () => {
    const selected = new Set(reactiveData.form.labelIds.map((id) => String(id)));
    const current = new Map(reactiveData.labelBinds.map((bind: any) => [String(bind.labelId), bind]));
    const addIds = [...selected].filter((labelId) => !current.has(labelId));
    const removeBinds = [...current.entries()].filter(([labelId]) => !selected.has(labelId)).map(([, bind]) => bind);
    await Promise.all([
      ...addIds.map((labelId) =>
        addLabelBind({
          entityTypeFlag: reactiveData.entityTypeFlag,
          entityId: entityId.value,
          labelId,
        })
      ),
      ...removeBinds.map((bind: any) => deleteLabelBind(String(bind.id))),
    ]);
  };

  const submit = async () => {
    reactiveData.submitting = true;
    try {
      await submitGroup();
      await submitLabels();
      successMessage(t('entityBinding.saved'));
      reactiveData.visible = false;
      emit('saved');
    } catch {
      // handled globally
    } finally {
      reactiveData.submitting = false;
    }
  };

  defineExpose({ show });
</script>

<style lang="scss" scoped>
  @use '@/styles/things-dialog.scss';

  .entity-bind-label-option {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .entity-bind-label-option__color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid var(--el-border-color-lighter);
  }
</style>
