import { addEdge, Position, reconnectEdge, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useRef } from "react";
import { useDnD } from "../contexts/dndContext/DnDContext";
import { TextTelegramNode, TextTelegramToken } from "../components/input/input.component";
import { TelegramApiNode } from "../components/nodes_components/telegramApiNode";
import { OutputWebhookNode } from "../components/nodes_components/outputNode";

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

export const useReactHookFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, nodesChangeHandler] = useNodesState(initialNodes);
    const [edges, setEdges, edgesChangeHandler] = useEdgesState([]);

    const [type, _, name] = useDnD();
  
    const { screenToFlowPosition } = useReactFlow();

    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge({...params, label: "Connected"}, eds))
    }, []);

    const onReconnect = useCallback((oldEdge, newConnection) => {
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    const onReconnectEnd = useCallback((_, edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }, []);

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

    return {
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
    }
}