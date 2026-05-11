/*
 * Copyright 2016-present the IoT DC3 original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { computed, defineComponent, reactive, ref } from 'vue';
import type { PropType } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useI18n } from 'vue-i18n';

import { ENTITY_TYPE_OPTIONS } from '@/config/constant/enums';

type FormMode = 'add' | 'edit';

const createEmptyForm = () => ({
  id: '' as string,
  parentGroupId: '' as string,
  groupTypeFlag: '' as string,
  groupName: '',
  groupCode: '',
  groupIndex: 0 as number,
  enableFlag: 'ENABLE',
  remark: '',
});

const collectDescendantIds = (groups: any[], id: string) => {
  const descendants = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    groups.forEach((group) => {
      const groupId = String(group.id);
      const parentId = group.parentGroupId ? String(group.parentGroupId) : '';
      if (!descendants.has(groupId) && (parentId === id || descendants.has(parentId))) {
        descendants.add(groupId);
        changed = true;
      }
    });
  }
  return descendants;
};

export default defineComponent({
  name: 'GroupEditForm',
  props: {
    groups: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  emits: ['add-thing', 'update-thing'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const formRef = ref<FormInstance>();

    const reactiveData = reactive({
      visible: false,
      mode: 'add' as FormMode,
      submitting: false,
      form: createEmptyForm(),
      originalForm: createEmptyForm(),
    });

    const rules: FormRules = {
      groupTypeFlag: [{ required: true, message: t('settings.group.groupTypeRequired'), trigger: 'change' }],
      groupName: [{ required: true, message: t('settings.group.groupNamePlaceholder'), trigger: 'blur' }],
    };

    const parentTreeOptions = computed(() => {
      const groupTypeFlag = reactiveData.form.groupTypeFlag;
      const currentId = reactiveData.form.id ? String(reactiveData.form.id) : '';
      const descendants = currentId ? collectDescendantIds(props.groups, currentId) : new Set<string>();
      const nodes = props.groups
        .filter((group) => group.groupTypeFlag === groupTypeFlag)
        .filter((group) => String(group.id) !== currentId && !descendants.has(String(group.id)))
        .map((group) => ({
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
      return [{ id: '', groupName: t('settings.group.rootGroup') }, ...roots];
    });

    const defaultExpandedKeys = computed(() => parentTreeOptions.value.map((node: any) => node.id).filter(Boolean));

    const reset = () => {
      reactiveData.form = reactiveData.mode === 'edit' ? { ...reactiveData.originalForm } : createEmptyForm();
      reactiveData.submitting = false;
      formRef.value?.clearValidate();
    };

    const show = () => {
      reactiveData.mode = 'add';
      reactiveData.originalForm = createEmptyForm();
      reactiveData.form = createEmptyForm();
      reactiveData.visible = true;
    };

    const showEdit = (row: any) => {
      reactiveData.mode = 'edit';
      const initial = {
        ...createEmptyForm(),
        ...row,
        id: String(row.id),
        parentGroupId: row.parentGroupId ? String(row.parentGroupId) : '',
        groupIndex: Number(row.groupIndex || 0),
      };
      reactiveData.originalForm = { ...initial };
      reactiveData.form = { ...initial };
      reactiveData.visible = true;
    };

    const onGroupTypeChange = () => {
      reactiveData.form.parentGroupId = '';
    };

    const done = () => {
      reactiveData.submitting = false;
      reactiveData.visible = false;
    };

    const submit = async () => {
      const valid = await formRef.value?.validate().catch(() => false);
      if (!valid) return;
      reactiveData.submitting = true;
      const payload = { ...reactiveData.form, parentGroupId: reactiveData.form.parentGroupId || null };
      if (reactiveData.mode === 'add') {
        emit('add-thing', payload, done);
      } else {
        emit('update-thing', payload, done);
      }
    };

    return {
      t,
      formRef,
      reactiveData,
      rules,
      ENTITY_TYPE_OPTIONS,
      parentTreeOptions,
      defaultExpandedKeys,
      reset,
      show,
      showEdit,
      onGroupTypeChange,
      submit,
    };
  },
});
