import {
  DatagridConfigurable,
  EditButton,
  Identifier,
  RaRecord,
  useRedirect,
} from 'react-admin';
import * as React from 'react';
import { ReactElement, useState } from 'react';

const MyDatagridConfigurable = ({
  children,
  hasEdit = false,
  bulkActionButtons = false,
}: {
  children: React.ReactNode;
  hasEdit?: boolean | undefined;
  bulkActionButtons?: ReactElement | false;
}) => {
  const redirect = useRedirect();

  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  const [lastClickId, setLastClickId] = useState<Identifier | null>(null);

  const postRowClick = (
    id: Identifier,
    resource: string,
    _record: RaRecord,
  ): string | false | Promise<string | false> => {
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
    return false;
  };

  return (
    <DatagridConfigurable
      rowClick={postRowClick}
      bulkActionButtons={bulkActionButtons}
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
