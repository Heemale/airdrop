import React, { useState } from "react";
import { RootNode, SubordinateNode } from "../../api/types/response";

// 树节点样式
const treeNodeStyle = {
  marginLeft: "20px", // 缩进表示层级
  padding: "4px 0",
  cursor: "pointer",
};

const nodeHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const toggleButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  color: "#666",
};

// 递归渲染树的组件
const RenderTree: React.FC<{ nodes: SubordinateNode[]; depth?: number }> = ({
  nodes,
  depth = 0,
}) => {
  return (
    <ul style={{ listStyle: "none", paddingLeft: `${depth * 20}px` }}>
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} depth={depth} />
      ))}
    </ul>
  );
};

// 渲染单个树节点的组件
const TreeNode: React.FC<{ node: SubordinateNode; depth: number }> = ({
  node,
  depth,
}) => {
  const [isOpen, setIsOpen] = useState(false); // 控制当前节点的展开状态

  const handleToggle = () => {
    setIsOpen((prev) => !prev); // 切换展开状态
  };
console.log(8672637267362783232,node.address)
  return (
    <li style={treeNodeStyle}>
      <div style={nodeHeaderStyle}>
        {/* 展开/收起按钮 */}
        {node.children && node.children.length > 0 && (
          <button onClick={handleToggle} style={toggleButtonStyle}>
            {isOpen ? "▼" : "►"}
          </button>
        )}
        {/* 节点内容 */}
        <span>{node.address ?? "children"}</span>
      </div>

      {/* 递归渲染子节点 */}
      {isOpen && node.children && node.children.length > 0 && (
        <RenderTree nodes={node.children} depth={depth + 1} />
      )}
    </li>
  );
};

// 根组件，接收数据并渲染整个树
export const TreeStructure: React.FC<{ data: RootNode[] }> = ({ data }) => {
  console.log("Data:", JSON.stringify(data, null, 2));
 if (data){
  console.log(234234234234,data)

 }
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "16px" }}>
       {data.map((rootNode, index) => (
        <div key={index}>
          {/* 渲染第一层子节点 */}
          <h3>Root Addresses:</h3>
          <pre>{rootNode.rootAddresses.join("\n")}</pre>          {rootNode.children && rootNode.children.length > 0 && (
            <RenderTree nodes={rootNode.children} depth={1} />
          )}
        </div>
      ))}
    </div>
  );
};
