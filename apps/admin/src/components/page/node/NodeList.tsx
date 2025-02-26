import MyDatagridConfigurable from './MyDatagridConfigurable';
import TimeTextField from '@/components/ui/TimeTextField';
import {
  FunctionField,
  NumberField,
  List,
  TextField,
  TextInput,
  BooleanField,
} from 'react-admin';
import { convertSmallToLarge } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';
import * as React from 'react';

const postFilters = [
  <TextInput key="id" name="id" source="id" label="ID" />,
  <TextInput key="rank" name="rank" source="rank" label="节点等级" />,
  <TextInput key="name" name="name" source="name" label="名称" />,
  <TextInput
    key="description"
    name="description"
    source="description"
    label="描述"
  />,
  <TextInput key="isOpen" name="isOpen" source="isOpen" label="是否开启" />,
  <TextInput
    key="isRemove"
    name="isRemove"
    source="isRemove"
    label="是否移除"
  />,
  <TextInput key="limit" name="limit" source="limit" label="可领取次数" />,
  <TextInput key="price" name="price" source="price" label="节点价格" />,
  <TextInput
    key="totalQuantity"
    name="totalQuantity"
    source="totalQuantity"
    label="总数量"
  />,
  <TextInput
    key="purchasedQuantity"
    name="purchasedQuantity"
    source="purchasedQuantity"
    label="已购买数量"
  />,
  <TextInput
    key="createAt"
    name="createAt"
    source="createAt"
    label="创建时间"
  />,
  <TextInput
    key="updateAt"
    name="updateAt"
    source="updateAt"
    label="更新时间"
  />,
];

const NodeList = () => (
  <List filters={postFilters}>
    <MyDatagridConfigurable hasEdit>
      <TextField source="id" label="ID" />
      <TextField source="rank" label="节点等级" />
      <TextField source="name" label="名称" />
      <TextField source="description" label="描述" />
      <BooleanField source="isOpen" label="是否开启" />
      <BooleanField source="isRemove" label="是否移除" />
      <NumberField source="limit" label="可领取次数" />
      <FunctionField
        source="price"
        label="节点价格"
        render={(record) =>
          convertSmallToLarge(record.price.toString(), TOKEN_DECIMAL)
        }
      />
      <FunctionField
        source="totalQuantity"
        label="总数量"
        render={(record) =>
          convertSmallToLarge(record.totalQuantity.toString(), TOKEN_DECIMAL)
        }
      />
      <FunctionField
        source="purchasedQuantity"
        label="已购买数量"
        render={(record) =>
          convertSmallToLarge(
            record.purchasedQuantity.toString(),
            TOKEN_DECIMAL,
          )
        }
      />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </MyDatagridConfigurable>
  </List>
);

export default NodeList;
