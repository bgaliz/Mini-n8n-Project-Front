import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState, useRef } from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Position,
  ConnectionMode,
  reconnectEdge,
  useNodeConnections,
  useNodesData,
  MarkerType,
} from '@xyflow/react';

import { DnDProvider, useDnD } from './contexts/dndContext/DnDContext';

import Sidebar from './components/sidebar/sidebar.component';
import { TextTelegramNode, TextTelegramToken } from './components/input/input.component';
import { OutputWebhookNode, TelegramApiNode } from './components/nodes/nodes.components';
import { onFetchChatId, onSendMessage } from './services/api';



const initialNodes = [
  {
    id: 'telegram_token_node',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'textTelegramToken',
    targetPosition: Position.Left,
  },
  {
    id: 'telegram_message_node',
    position: { x: 300, y: 100 },
    data: { label: 'Node 2' },
    type: 'textTelegramNode',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const nodeTypes = {
  textTelegramNode: TextTelegramNode,
  textTelegramToken: TextTelegramToken,
  telegramApiNode: TelegramApiNode,
  outputWebhookNode: OutputWebhookNode,
};

const getId = (name) => `${name} Node`.replace(/\s/g, "_").toLowerCase();

const DnDFlow  = () => {
  const reactFlowWrapper = useRef(null);
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, nodesChangeHandler] = useNodesState(initialNodes);
  const [edges, setEdges, edgesChangeHandler] = useEdgesState([]);

  const [type, _, name] = useDnD();
  const { screenToFlowPosition } = useReactFlow();


  const onConnect = useCallback((params) => {
    console.log('onConnect');
    setEdges((eds) => addEdge({...params, label: "Connected"}, eds))
  }, []);

  const onReconnect = useCallback((oldEdge, newConnection) => {
    console.log('onReconnect');
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, []);

  const onReconnectEnd = useCallback((_, edge) => {
    console.log('onReconnectEnd');
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  const handleNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  const onDrop = useCallback((event) => {
      event.preventDefault();
 
      if (!type || !name) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(name),
        type,
        position,
        data: {
          label: (`${name} Node`),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type],
  );

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

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

  const isAllEdgesConnected = () => edges.length === nodes.length - 1;

  const onExecute = async () => {
    console.log('Executing flow...'); 
    console.log('Nodes:', nodes);
    const token = nodes.find(node => node.id === 'telegram_token_node')?.data?.text;
    const message = nodes.find(node => node.id === 'telegram_message_node')?.data?.text;
    if (isAllEdgesConnected()) {
      if(token && message) {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === 'output_webhook_node'
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    loading: true,
                  },
                }
              : node
          )
        );
        // await onFetchChatId(token).finally(() => {
        //   setLoading(false);
        // });

        if(message) {
          const output_node = nodes.find(node => node.id === 'output_webhook_node');
          // await onSendMessage(message, token).finally(() => {
          //   setLoading(false);
          //   nodesChangeHandler(nodes, { ...output_node, data: { ...output_node.data, loading: false } });
          // });
          setTimeout(() => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === 'output_webhook_node'
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        description: 'Message has been send successfully!',
                        loading: false,
                      },
                    }
                  : node
              )
            );
          }, 1000);
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
          // edgeTypes={edgeTypes}
          onEdgesChange={edgesChangeHandler}
          edgesReconnectable={true}

          // Connection
          onConnect={onConnect}
          // onConnectStart={onConnectStart}
          // onConnectEnd={onConnectEnd}

          // Reconnect
          onReconnect={onReconnect}
          // onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          connectionMode={ConnectionMode.Loose}

          onDrop={onDrop}
          onDragStart={onDragStart}
          onDragOver={onDragOver}

          isValidConnection={isValidConnection}
          fitView
        >
          <Controls />
          <MiniMap />
          <button onClick={onExecute} className="fixed md:bottom-46 bottom-76 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors cursor-pointer z-10">
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
