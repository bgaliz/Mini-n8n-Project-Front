import { type NodeProps, type Node } from '@xyflow/react';
import { NodeStructure } from '../node_structure/node.component';

export function TelegramApiNode({ data }: NodeProps<Node<{ isLoading: boolean, isDone: boolean }>>) {
  return (
    <NodeStructure 
      dotRight={true} 
      dotLeft={true} 
      text={"Telegram API Node"}
      isLoading={data.isLoading} 
      isDone={data.isDone}
    />
  )
}