import { useDnD } from '../../contexts/dndContext/DnDContext';
import { TextTelegramNode, TextTelegramToken } from '../input/input.component';

enum NodeText {
  TELEGRAM = 'Telegram API Node',
  OUTPUT = 'Output Webhook Node'
};
 
export default ({test}) => {
  const [_, setType, __, setName] = useDnD();
 
  const onDragStart = (event, nodeType, nodeName) => {
    if (setType && setName) {
      setType(nodeType);
      setName(nodeName);
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>

      <div className="description">Você pode arrastar esses nós para o painel.</div>
      <div className="h-5 p-8 border border-[#1a192b] rounded-sm mb-2 flex justify-center items-center cursor-grab" onDragStart={(event) => onDragStart(event, 'telegramApiNode', 'Telegram API')} draggable>
        {NodeText.TELEGRAM}
      </div>
      <div className="h-5 p-8 border border-[#1a192b] rounded-sm mb-2 flex justify-center items-center cursor-grab" onDragStart={(event) => onDragStart(event, 'outputWebhookNode', 'Output Webhook')} draggable>
        {NodeText.OUTPUT}
      </div>
    </aside>
  );
}; 