import { TopToolbar, ListButton } from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';

const CreateEditActions = () => (
  <TopToolbar>
    <ListButton icon={<CloseIcon />} label="" />
  </TopToolbar>
);

export default CreateEditActions;
