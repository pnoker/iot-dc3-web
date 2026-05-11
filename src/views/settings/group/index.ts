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
import { useI18n } from 'vue-i18n';

import { addGroup, deleteGroup, getGroupList, updateGroup } from '@/api/group';
import { timestampColumn } from '@/utils/DateUtil';
import { successMessage } from '@/utils/NotificationUtil';
import type { Order } from '@/config/entity';

import BlankCard from '@/components/card/blank/BlankCard.vue';
import groupTool from './tool/GroupTool.vue';
import groupEditForm from './edit/GroupEditForm.vue';

export default defineComponent({
  name: 'SettingsGroup',
  components: {
    BlankCard,
    groupTool,
    groupEditForm,
  },
  setup() {
    const { t } = useI18n();

    const editRef = ref<InstanceType<typeof groupEditForm>>();

    const reactiveData = reactive({
      loading: false,
      listData: [] as any[],
      allGroups: [] as any[],
      query: {} as Record<string, any>,
      order: false,
      page: {
        total: 0,
        size: 12,
        current: 1,
        orders: [] as Order[],
      },
    });

    const groupMap = computed(() => {
      const map = new Map<string, any>();
      reactiveData.allGroups.forEach((group) => map.set(String(group.id), group));
      return map;
    });

    const parentGroupName = (id: string | number | undefined) => {
      if (!id) return t('settings.group.rootGroup');
      return groupMap.value.get(String(id))?.groupName || String(id);
    };

    const loadAllGroups = async () => {
      const res: any = await getGroupList({ page: { size: 1000, current: 1 } });
      reactiveData.allGroups = res.data?.records || [];
    };

    const load = async () => {
      reactiveData.loading = true;
      try {
        const [listRes]: any[] = await Promise.all([
          getGroupList({ page: reactiveData.page, ...reactiveData.query }),
          loadAllGroups(),
        ]);
        const data = listRes.data || {};
        reactiveData.listData = data.records || [];
        reactiveData.page.total = data.total || 0;
      } catch {
        // handled globally
      } finally {
        reactiveData.loading = false;
      }
    };

    const search = (params: any) => {
      reactiveData.query = params || {};
      reactiveData.page.current = 1;
      load();
    };

    const reset = () => {
      reactiveData.query = {};
      reactiveData.page.current = 1;
      load();
    };

    const refresh = () => load();

    const sort = () => {
      reactiveData.order = !reactiveData.order;
      reactiveData.page.orders = [{ column: 'create_time', asc: reactiveData.order }];
      load();
    };

    const openAdd = () => editRef.value?.show();
    const openEdit = (row: any) => editRef.value?.showEdit(row);

    const onAdd = (form: any, done: () => void) => {
      addGroup(form)
        .then(() => {
          successMessage();
          load();
          done();
        })
        .catch(() => {
          // handled globally
        });
    };

    const onUpdate = (form: any, done: () => void) => {
      updateGroup(form)
        .then(() => {
          successMessage();
          load();
          done();
        })
        .catch(() => {
          // handled globally
        });
    };

    const remove = (id: string) => {
      deleteGroup(id)
        .then(() => {
          successMessage();
          load();
        })
        .catch(() => {
          // handled globally
        });
    };

    const sizeChange = (size: number) => {
      reactiveData.page.size = size;
      load();
    };

    const currentChange = (current: number) => {
      reactiveData.page.current = current;
      load();
    };

    load();

    return {
      t,
      editRef,
      reactiveData,
      parentGroupName,
      search,
      reset,
      refresh,
      sort,
      openAdd,
      openEdit,
      onAdd,
      onUpdate,
      remove,
      sizeChange,
      currentChange,
      timestampColumn,
    };
  },
});
