import {
  DatagridConfigurable,
  EditButton,
  Identifier,
  RaRecord,
  useRedirect,
} from 'react-admin';
import * as React from 'react';
import { useState } from 'react';

const MyDatagridConfigurable = ({
  children,
  hasEdit = false,
}: {
  children: React.ReactNode;
  hasEdit?: boolean | undefined;
}) => {
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
        '& .RaDatagrid-thead': {
          whiteSpace: 'nowrap',
        },
        '& .RaDatagrid-row': {
          whiteSpace: 'nowrap',
        },
      }}
    >
      {children}
      {hasEdit && (
        <div className="column-edit">
          <EditButton />
        </div>
      )}
    </DatagridConfigurable>
  );
};

export default MyDatagridConfigurable;
