import {
  DatagridConfigurable,
  EditButton,
  Identifier,
  RaRecord,
  useRedirect,
  FunctionField,
  useResourceContext // 新增
} from 'react-admin';
import * as React from 'react';
import { ReactElement, useState } from 'react';

const MyDatagridConfigurable = ({
  children,
  hasEdit = false,
  isShow = false,
  bulkActionButtons = false,
  sx, // 新增
}: {
  children: React.ReactNode;
  hasEdit?: boolean | undefined;
  isShow?: boolean | undefined;
  bulkActionButtons?: ReactElement | false;
  sx?: any; // 新增
}) => {
  const redirect = useRedirect();
  const resource = useResourceContext(); // 新增

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
      sx={sx} // 新增
    >
      {children}
      {isShow && (
        <FunctionField
          label="查看"
          render={record => (
            <button
              style={{ color: '#1976d2', cursor: 'pointer', background: 'none', border: 'none' }}
              onClick={e => {
                e.stopPropagation();
                redirect('show', resource, record.id); // 这里传入 resource
              }}
            >
              查看
            </button>
          )}
        />
      )}
      {hasEdit && (
        <div className="column-edit">
          <EditButton />
        </div>
      )}
    </DatagridConfigurable>
  );
};

export default MyDatagridConfigurable;
