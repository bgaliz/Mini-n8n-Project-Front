import { type NodeProps, type Node } from '@xyflow/react';
import { NodeStructure } from '../node_structure/node.component';

export function OutputWebhookNode({ data }: NodeProps<Node<{ isLoading: boolean, description: string, isDone: boolean }>>) {
  return (
    <NodeStructure 
      dotRight={true} 
      dotLeft={true} 
      text={"Output Webhook Node"}
      isLoading={data.isLoading} 
      description={data.description}
      isDone={data.isDone}
    />
  )
}