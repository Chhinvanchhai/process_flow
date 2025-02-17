
'use client'
import React, { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  Handle,
  addEdge,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";

const nodeStyles = "bg-white shadow-md rounded-xl p-4 border w-56 cursor-pointer";

const CustomNode = ({ data, isActive, onClick }) => (
  <div 
    className={`${nodeStyles} ${isActive ? 'border-2 border-blue-500' : ''}`} 
    onClick={() => onClick(data)}
  >
    <p className="font-semibold">{data.label}</p>
    <p className="text-xs text-gray-500">{data.name}</p>
    <p className="text-xs text-gray-500">Due: {data.dueDate}</p>
    {data.status && (
      <span className={`text-xs px-2 py-1 rounded-full ${data.statusColor}`}>{data.status}</span>
    )}
    <Handle type="source" position="right" />
    <Handle type="target" position="left" />
  </div>
);

const initialNodes = [
  { id: "1", type: "custom", data: { label: "Approval by CEO", name: "Avery Milago", dueDate: "Today", status: "✅ Approved", statusColor: "bg-green-100 text-green-700" }, position: { x: 50, y: 50 } },
  { id: "2", type: "custom", data: { label: "Informed when approved", name: "Michael Cane", dueDate: "May 11", status: "🟡 In progress", statusColor: "bg-yellow-100 text-yellow-700" }, position: { x: 400, y: 50 } },
  { id: "3", type: "custom", data: { label: "Executed by", name: "Jessica Douglas", dueDate: "May 12", status: "🔴 Not started", statusColor: "bg-red-100 text-red-700" }, position: { x: 800, y: 50 } },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", label: "Approval Granted" },
  { id: "e2-3", source: "2", target: "3", label: "Processing" },
];

const WorkflowUI = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeNode, setActiveNode] = useState(null);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeDueDate, setNewNodeDueDate] = useState("");

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = () => {
    const newId = (nodes.length + 1).toString();
    const newNode = {
      id: newId,
      type: "custom",
      data: { label: newNodeLabel, name: newNodeName, dueDate: newNodeDueDate, status: "🟡 In progress", statusColor: "bg-yellow-100 text-yellow-700" },
      position: { x: Math.random() * 600, y: Math.random() * 400 },
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <button className="text-gray-600">⬅ Back</button>
        <h1 className="text-lg font-semibold">Builder</h1>
        <h1 className="text-lg font-semibold">From Design</h1>
        <button className="text-gray-600">More</button>
      </header>
      <div className="flex flex-1">
        <div className="flex-1 p-6 relative">
          <ReactFlow
            nodes={nodes.map(node => ({ ...node, data: { ...node.data, isActive: activeNode?.id === node.id } }))}
            edges={edges}
            nodeTypes={{ custom: (props) => <CustomNode {...props} onClick={setActiveNode} isActive={activeNode?.id === props.id} /> }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        <div className="w-80 bg-white p-6 shadow-lg border-l">
          <h3 className="font-semibold mb-4 text-lg">Details</h3>
          {activeNode ? (
            <>
              <p><strong>Activity:</strong> {activeNode.data.label}</p>
              <p><strong>Name:</strong> {activeNode.data.name}</p>
              <p><strong>Due Date:</strong> {activeNode.data.dueDate}</p>
              <p><strong>Status:</strong> {activeNode.data.status}</p>
            </>
          ) : (
            <p>Select an activity to view details.</p>
          )}
          <h3 className="font-semibold mt-6">Add New Activity</h3>
          <input className="w-full p-2 border rounded mt-2" placeholder="Label" value={newNodeLabel} onChange={e => setNewNodeLabel(e.target.value)} />
          <input className="w-full p-2 border rounded mt-2" placeholder="Name" value={newNodeName} onChange={e => setNewNodeName(e.target.value)} />
          <input className="w-full p-2 border rounded mt-2" placeholder="Due Date" value={newNodeDueDate} onChange={e => setNewNodeDueDate(e.target.value)} />
          <button className="mt-4 w-full bg-blue-500 text-white p-2 rounded" onClick={addNode}>Add Activity</button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowUI;
