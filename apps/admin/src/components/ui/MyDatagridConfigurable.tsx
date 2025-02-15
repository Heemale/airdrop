import {
  DatagridConfigurable,
  EditButton,
  Identifier,
  RaRecord,
  usePermissions,
  useRedirect,
} from 'react-admin';
import TimeTextField from '@/components/ui/TimeTextField';
import * as React from 'react';
import { useState } from 'react';

const MyDatagridConfigurable = ({
  children,
  hasEdit = false,
}: {
  children: React.ReactNode;
  hasEdit?: boolean | undefined;
}) => {
  const { permissions } = usePermissions();
  const redirect = useRedirect();

  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  const [lastClickId, setLastClickId] = useState<Identifier | null>(null);

  const postRowClick = (id: Identifier, resource: string, record: RaRecord) => {
    const currentTime = Date.now();

    if (
      lastClickTime &&
      lastClickId === id &&
      currentTime - lastClickTime <= 500
    ) {
      redirect('edit', resource, id);
    } else {
      setLastClickTime(currentTime);
      setLastClickId(id);
    }
  };

  return (
    <DatagridConfigurable
      // @ts-ignore
      rowClick={postRowClick}
      sx={{
        '& .RaDatagrid-root': {},
        '& .RaDatagrid-tableWrapper': {
          maxWidth: '83vw',
          overflowX: 'auto',
        },
        '& .RaDatagrid-thead': {
          whiteSpace: 'nowrap',
        },
        '& .RaDatagrid-row': {
          whiteSpace: 'nowrap',
        },
        // '& .column-edit': {
        //     backgroundColor: '#fee',
        //     position: 'fixed', // fixed sticky
        //     right: 10,
        //     button: 50,
        //     zIndex: 2, // 可能需要调整 z-index，以确保按钮在顶部
        // },
      }}
    >
      {children}
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
      {hasEdit && (
        <div className="column-edit">
          <EditButton />
        </div>
      )}
    </DatagridConfigurable>
  );
};

export default MyDatagridConfigurable;
