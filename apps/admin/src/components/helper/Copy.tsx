import { useNotify } from 'react-admin';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ContentCopy } from '@mui/icons-material';

const Copy = ({
  text,
  render,
}: {
  text: string;
  render: (value: string) => string;
}) => {
  const notify = useNotify();

  const handleCopy = () => {
    notify('已复制到剪贴板', { variant: 'success' });
  };

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <div className="flex gap-1">
        <div>{render(text)}</div>
        <button style={{ marginLeft: '8px' }}>
          <ContentCopy fontSize="small" />
        </button>
      </div>
    </CopyToClipboard>
  );
};

export default Copy;
