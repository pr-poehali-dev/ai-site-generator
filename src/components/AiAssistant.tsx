
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";

interface AiAssistantProps {
  onResponse?: (response: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onResponse }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Добавляем сообщение пользователя в историю
    const newMessage = { role: 'user' as const, content: prompt };
    setConversation([...conversation, newMessage]);
    
    // Сбрасываем ввод и показываем загрузку
    setPrompt('');
    setIsLoading(true);
    
    try {
      // Имитация API запроса к AI
      setTimeout(() => {
        // Пример ответа от AI
        const aiResponse = {
          role: 'assistant' as const,
          content: `Я проанализировал ваш запрос "${newMessage.content}". 
          
Вот что я могу предложить:

1. Оптимизировать структуру компонентов для улучшения производительности
2. Добавить кэширование данных для снижения числа API запросов
3. Использовать React.memo для предотвращения лишних рендеров

Хотите, чтобы я сгенерировал код для какого-то из этих решений?`
        };
        
        setConversation(prev => [...prev, aiResponse]);
        setIsLoading(false);
        
        if (onResponse) {
          onResponse(aiResponse.content);
        }
      }, 1500);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Brain" className="text-primary" />
          AI Ассистент
        </CardTitle>
        <CardDescription>
          Опишите задачу, и я помогу с кодом, анализом или улучшениями
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* История сообщений */}
          {conversation.length > 0 && (
            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto p-2">
              {conversation.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary/10 ml-10' 
                      : 'bg-secondary/10 mr-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon 
                      name={message.role === 'user' ? 'User' : 'Bot'} 
                      className={message.role === 'user' ? 'text-primary' : 'text-secondary'}
                      size={16}
                    />
                    <span className="text-xs font-medium">
                      {message.role === 'user' ? 'Вы' : 'AI Ассистент'}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Форма ввода */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Опишите, что нужно создать или проанализировать..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-y"
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || !prompt.trim()}>
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="mr-2" />
                    Отправить
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiAssistant;
