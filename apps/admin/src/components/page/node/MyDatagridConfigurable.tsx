import {
  Button,
  DatagridConfigurable,
  EditButton,
  Identifier,
  RaRecord,
  useNotify,
} from 'react-admin';
import * as React from 'react';
import { useRef } from 'react';
import { airdropClient, devTransaction } from '@/sdk';
import { ADMIN_CAP, NODES } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { sleep } from '@/utils/time';

const MyDatagridConfigurable = ({
  children,
  hasEdit = false,
}: {
  children: React.ReactNode;
  hasEdit?: boolean | undefined;
}) => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const recordRef = useRef<RaRecord | null>(null);

  const rowClick = (
    _id: Identifier,
    _resource: string,
    record: RaRecord,
  ): string | false | Promise<string | false> => {
    recordRef.current = record;
    return false;
  };

  const handleRemove = async () => {
    const record = recordRef.current;
    if (!record) {
      await sleep(0.5);
      await handleRemove();
      return;
    }
    if (!account) return;

    try {
      const tx = airdropClient.removeNode(ADMIN_CAP, NODES, record.rank);

      try {
        await devTransaction(tx, account.address);
      } catch (e: any) {
        notify(handleDevTxError(e.message.trim()), { type: 'error' });
        return;
      }

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            notify(`提交成功, 交易hash: ${result.digest}`, { type: 'error' });
          },
          onError: ({ message }) => {
            notify(handleDevTxError(message.trim()), { type: 'error' });
          },
        },
      );
    } catch (e: any) {
      notify(handleDevTxError(e.message.trim()), { type: 'error' });
    }
  };

  return (
    <DatagridConfigurable
      bulkActionButtons={false}
      rowClick={rowClick}
      sx={{
        '& .RaDatagrid-root': {},
        '& .RaDatagrid-thead': {
          whiteSpace: 'nowrap',
        },
        '& .RaDatagrid-row': {
          whiteSpace: 'nowrap',
        },
      }}
    >
      {children}
      {hasEdit && <EditButton label="修改" />}
      <Button label="移除" onClick={handleRemove} />
    </DatagridConfigurable>
  );
};

export default MyDatagridConfigurable;
