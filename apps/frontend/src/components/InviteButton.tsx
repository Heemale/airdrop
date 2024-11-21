'use client';
import React, { useState } from 'react';
import { Menu, MenuItem, Button, Tooltip } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd';
import { useCurrentAccount } from '@mysten/dapp-kit';

const InviteButton: React.FC<{ connectText: string }> = ({ connectText }) => {
  const account = useCurrentAccount();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const generateInviteLink = () => {
    if (account?.address) {
      return `${window.location.origin}?inviter=${account.address}`;
    }
    return '请先连接钱包';
  };

  const handleCopy = () => {
    messageApi.success('邀请链接已复制!');
  };

  // 按钮样式定义
  const buttonStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #fea6a1, #f7c9ab)',
    color: '#ffffff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '12px',
    padding: '8px 16px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  };

  const buttonHoverStyle: React.CSSProperties = {
    transform: 'scale(1.05)',
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',
  };

  const buttonActiveStyle: React.CSSProperties = {
    transform: 'scale(0.95)',
  };

  return (
    <>
      {contextHolder}
      <Tooltip title="分享邀请链接">
        <Button
          variant="contained"
          onClick={handleClick}
          style={buttonStyle}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.transform =
              buttonHoverStyle.transform!;
            (e.target as HTMLButtonElement).style.boxShadow =
              buttonHoverStyle.boxShadow!;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.transform = '';
            (e.target as HTMLButtonElement).style.boxShadow = '';
          }}
          onMouseDown={(e) => {
            (e.target as HTMLButtonElement).style.transform =
              buttonActiveStyle.transform!;
          }}
          onMouseUp={(e) => {
            (e.target as HTMLButtonElement).style.transform =
              buttonHoverStyle.transform!;
          }}
        >
          {connectText}
        </Button>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem disabled>邀请链接:</MenuItem>
        <MenuItem>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{generateInviteLink()}</span>
            <CopyToClipboard text={generateInviteLink()} onCopy={handleCopy}>
              <Button variant="outlined" size="small">
                复制链接
              </Button>
            </CopyToClipboard>
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};

export default InviteButton;
