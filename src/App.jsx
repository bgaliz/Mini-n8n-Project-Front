import '@xyflow/react/dist/style.css';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  ConnectionMode,
} from '@xyflow/react';

import { DnDProvider } from './contexts/dndContext/DnDContext';

import Sidebar from './components/sidebar/sidebar.component';
import { onFetchChatId, onSendMessage } from './services/api';
import { useReactHookFlow } from './hooks/useReactFlow';

const DnDFlow  = () => {  
  const {
    nodes,
    edges,
    nodeTypes,
    reactFlowWrapper,
    setNodes,
    nodesChangeHandler,
    edgesChangeHandler,
    onConnect,
    onReconnect,
    onReconnectEnd,
    onDragOver,
    onDrop,
    onDragStart,
  } = useReactHookFlow()

  const isAllEdgesConnected = () => edges.length === nodes.length - 1;
  
  const isValidConnection = (connection) => {
    switch (connection.source) {
      case 'telegram_token_node':
        if (connection.target === 'telegram_api_node' || connection.target === 'output_webhook_node') {
          return false;
        }
        break;
      case 'telegram_message_node':
        if (connection.target === 'output_webhook_node' || connection.target === 'telegram_token_node') {
          return false;
        }
        break;
      case 'telegram_api_node':
      if (connection.target === 'telegram_message_node' || connection.target === 'telegram_token_node') {
        return false;
      }
      break;
    }
    return true;
  };

  const onSetLoadingNode = (nodeId, isLoading, isDone = false, description) => {
    setNodes(nds =>
      nds.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isLoading, isDone, description } }
          : node
      )
    );
  }

  const onExecute = async () => {
    const token = nodes.find(node => node.id === 'telegram_token_node')?.data?.text;
    const message = nodes.find(node => node.id === 'telegram_message_node')?.data?.text;
    onSetLoadingNode("output_webhook_node", false, false, "")

    if (isAllEdgesConnected()) {
      if(token && message) {
        onSetLoadingNode("telegram_api_node", true)
        await onFetchChatId(token).then(() => {
          onSetLoadingNode("telegram_api_node", false, true)
        });

        if(message) {
          onSetLoadingNode("output_webhook_node", true)
          await onSendMessage(message, token).then((res) => {
            onSetLoadingNode("output_webhook_node", false, true, res.message)
          });
        };
      } else {
        console.error('Token or message is missing.');
        alert('Please provide both Telegram token and message before executing the flow.');
        return;
      }
    } else {
      console.error('Not all edges are connected to nodes.');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }} className='dndflow'>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          // Nodes
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={nodesChangeHandler}
          // Edges
          edges={edges}
          onEdgesChange={edgesChangeHandler}
          edgesReconnectable={true}
          // Connection
          onConnect={onConnect}
          // Reconnect
          onReconnect={onReconnect}
          onReconnectEnd={onReconnectEnd}
          connectionMode={ConnectionMode.Loose}
          // OnDrops
          onDrop={onDrop}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          // Map Validations
          isValidConnection={isValidConnection}
          fitView
        >
          <Controls />
          <MiniMap />
          <button 
            onClick={onExecute} 
            className="fixed md:bottom-46 bottom-76 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors cursor-pointer z-10"
          >
            Execute
          </button>
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}


export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
)

