
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface AiAssistantProps {
  onResponse?: (response: string) => void;
  onCodeFix?: (originalCode: string, fixedCode: string) => void;
  onCodeAnalysis?: (analysis: CodeAnalysisResult) => void;
}

export interface CodeError {
  line: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  fix?: string;
}

export interface CodeAnalysisResult {
  errors: CodeError[];
  suggestions: string[];
  fixedCode?: string;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onResponse, onCodeFix, onCodeAnalysis }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [detectedIssues, setDetectedIssues] = useState<CodeAnalysisResult | null>(null);

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
      // Проверяем, есть ли в запросе код, который нужно анализировать
      const containsCode = /```[\s\S]*?```/.test(prompt) || prompt.includes('import ') || prompt.includes('function ');
      
      // Имитация API запроса к AI
      setTimeout(() => {
        if (containsCode) {
          // Анализ кода и поиск ошибок
          const analysisResult = analyzeCode(prompt);
          setDetectedIssues(analysisResult);
          
          if (onCodeAnalysis) {
            onCodeAnalysis(analysisResult);
          }
          
          // Переключаемся на вкладку анализа если нашли ошибки
          if (analysisResult.errors.length > 0) {
            setActiveTab('analysis');
          }
          
          // Формируем ответ с найденными ошибками
          const aiResponse = {
            role: 'assistant' as const,
            content: `Я проанализировал ваш код и нашел ${analysisResult.errors.length} проблем:
            
${analysisResult.errors.map((error, index) => 
  `${index + 1}. **${error.severity === 'error' ? 'Ошибка' : error.severity === 'warning' ? 'Предупреждение' : 'Информация'}**: ${error.message} (строка ${error.line}${error.column ? `, символ ${error.column}` : ''})`
).join('\n')}

${analysisResult.suggestions.length > 0 ? `\nРекомендации по улучшению:\n${analysisResult.suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n')}` : ''}

${analysisResult.errors.length > 0 ? 'Хотите, чтобы я автоматически исправил эти проблемы?' : 'Ваш код выглядит хорошо, но я предложил несколько улучшений выше.'}`
          };
          
          setConversation(prev => [...prev, aiResponse]);
        } else {
          // Обычный ответ на запрос пользователя
          const aiResponse = {
            role: 'assistant' as const,
            content: generateResponse(prompt)
          };
          
          setConversation(prev => [...prev, aiResponse]);
          
          if (onResponse) {
            onResponse(aiResponse.content);
          }
        }
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setIsLoading(false);
      
      // Добавляем сообщение об ошибке
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.'
      }]);
    }
  };
  
  const handleFixCode = () => {
    if (!detectedIssues || !detectedIssues.fixedCode) return;
    
    // Извлекаем код из запроса пользователя
    const originalCode = extractCodeFromPrompt(prompt);
    
    if (onCodeFix && originalCode) {
      onCodeFix(originalCode, detectedIssues.fixedCode);
    }
    
    // Добавляем сообщение о исправлении кода
    setConversation(prev => [...prev, {
      role: 'assistant',
      content: `Я исправил проблемы в вашем коде. Вот исправленная версия:

\`\`\`typescript
${detectedIssues.fixedCode}
\`\`\`

Все обнаруженные ошибки были устранены. Теперь код должен работать корректно.`
    }]);
    
    // Сбрасываем результаты анализа
    setDetectedIssues(null);
    setActiveTab('chat');
  };

  // Функция для анализа кода (имитация работы нейросети)
  const analyzeCode = (input: string): CodeAnalysisResult => {
    const code = extractCodeFromPrompt(input) || input;
    const lines = code.split('\n');
    const errors: CodeError[] = [];
    const suggestions: string[] = [];
    
    // Поиск распространенных проблем в импортах
    const importLines = lines.filter(line => line.trim().startsWith('import '));
    importLines.forEach((line, index) => {
      const lineNumber = lines.indexOf(line) + 1;

      // Проверка на отсутствие точки с запятой
      if (!line.trim().endsWith(';') && !line.includes('from')) {
        errors.push({
          line: lineNumber,
          message: 'Отсутствует точка с запятой в импорте',
          severity: 'warning',
          fix: line.trim() + ';'
        });
      }
      
      // Проверка на неправильный путь импорта
      if (line.includes('./pages/Projects') && line.includes('from')) {
        errors.push({
          line: lineNumber,
          message: 'Неправильный путь импорта "./pages/Projects", должен быть "./pages/Projects.tsx" или проверьте наличие файла',
          severity: 'error',
          fix: line.replace('./pages/Projects', './pages/Projects.tsx')
        });
      }

      // Проверка на неиспользуемые импорты (упрощенная логика)
      const importedItem = line.match(/import\s+{?\s*([^{}]*?)\s*}?\s+from/);
      if (importedItem && importedItem[1]) {
        const imported = importedItem[1].trim();
        const isUsed = lines.some((l, i) => i > lineNumber && l.includes(imported));
        if (!isUsed) {
          errors.push({
            line: lineNumber,
            message: `Неиспользуемый импорт: ${imported}`,
            severity: 'warning'
          });
        }
      }
    });
    
    // Проверка на незакрытые теги
    const openTags: string[] = [];
    lines.forEach((line, index) => {
      const openTagMatches = [...line.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)[^/>]*>/g)];
      const selfClosingTags = [...line.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)[^/>]*\/>/g)];
      const closeTags = [...line.matchAll(/<\/([a-zA-Z][a-zA-Z0-9]*)>/g)];
      
      // Добавляем открытые теги
      openTagMatches.forEach(match => {
        if (match[1] && !selfClosingTags.some(tag => tag[1] === match[1])) {
          openTags.push(match[1]);
        }
      });
      
      // Удаляем закрытые теги
      closeTags.forEach(match => {
        const tagIndex = openTags.lastIndexOf(match[1]);
        if (tagIndex !== -1) {
          openTags.splice(tagIndex, 1);
        } else {
          errors.push({
            line: index + 1,
            message: `Закрывающий тег без открывающего: ${match[0]}`,
            severity: 'error'
          });
        }
      });
    });
    
    // Если остались незакрытые теги
    if (openTags.length > 0) {
      errors.push({
        line: lines.length,
        message: `Незакрытые теги: ${openTags.join(', ')}`,
        severity: 'error'
      });
    }
    
    // Проверка на использование console.log
    lines.forEach((line, index) => {
      if (line.includes('console.log')) {
        errors.push({
          line: index + 1,
          message: 'Обнаружен console.log, рекомендуется удалить перед продакшеном',
          severity: 'info'
        });
      }
    });
    
    // Добавляем общие рекомендации
    suggestions.push('Используйте TypeScript для улучшения типобезопасности');
    suggestions.push('Разделяйте компоненты на более мелкие для лучшей поддерживаемости');
    
    // Проверка на useState без зависимостей в useEffect
    const useEffectLines = lines.findIndex(line => line.includes('useEffect(') && !line.includes(', []') && !line.includes(', [') && !line.includes('deps'));
    if (useEffectLines !== -1) {
      errors.push({
        line: useEffectLines + 1,
        message: 'useEffect без списка зависимостей может вызвать бесконечный цикл',
        severity: 'warning'
      });
      suggestions.push('Всегда указывайте массив зависимостей в useEffect');
    }
    
    // Создаем исправленный код
    let fixedCode = code;
    
    // Применяем исправления к коду
    errors.forEach(error => {
      if (error.fix) {
        const codeLines = fixedCode.split('\n');
        codeLines[error.line - 1] = error.fix;
        fixedCode = codeLines.join('\n');
      }
    });
    
    return {
      errors,
      suggestions,
      fixedCode: errors.some(e => e.fix) ? fixedCode : undefined
    };
  };
  
  // Извлекаем код из запроса между тройными кавычками
  const extractCodeFromPrompt = (input: string): string | null => {
    const codeMatch = input.match(/```(?:jsx|tsx|javascript|typescript|js|ts)?\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : null;
  };

  // Генерация ответа на запрос (имитация работы нейросети)
  const generateResponse = (query: string): string => {
    if (query.toLowerCase().includes('создать сайт') || query.toLowerCase().includes('создай сайт')) {
      return `Я могу помочь вам создать сайт! Для начала, давайте определим основные требования:

1. **Тип сайта**: Личный блог, интернет-магазин, лендинг, портфолио?
2. **Технологии**: Судя по вашим файлам, вы используете React с TypeScript. Это хороший выбор!
3. **Дизайн**: Какой стиль вам нравится? Минималистичный, корпоративный, креативный?

Чтобы начать, я могу создать базовую структуру проекта и компоненты. Пришлите мне примерное техническое задание, и я подготовлю необходимый код.`;
    }
    
    if (query.toLowerCase().includes('ошибка') || query.toLowerCase().includes('не работает')) {
      return `Чтобы помочь с ошибкой, мне потребуется больше информации:

1. Скопируйте и вставьте сообщение об ошибке, которое вы видите
2. Предоставьте код, в котором возникает проблема (вставьте его между \`\`\` и \`\`\`)
3. Опишите ожидаемое поведение и что происходит вместо этого

После получения этих данных я проанализирую код и предложу решение проблемы.`;
    }
    
    if (query.toLowerCase().includes('оптимизировать') || query.toLowerCase().includes('улучшить производительность')) {
      return `Для оптимизации React-приложения рекомендую следующие шаги:

1. **Мемоизация компонентов**: Используйте React.memo для предотвращения ненужных рендеров
2. **Правильная работа с состояниями**: Избегайте излишних обновлений состояния
3. **Lazy Loading**: Загружайте компоненты только когда они нужны
4. **Виртуализация списков**: Для больших списков используйте библиотеки типа react-window
5. **Оптимизация изображений**: Используйте форматы WebP, сжатие и ленивую загрузку
6. **Code Splitting**: Разделите ваш код на чанки с помощью React.lazy и Suspense

Предоставьте конкретные участки кода для оптимизации, и я помогу вам их улучшить.`;
    }
    
    return `Я проанализировал ваш запрос "${query}".

Как ваш AI-помощник, я могу:

1. Анализировать код и находить в нём ошибки
2. Предлагать улучшения и оптимизации 
3. Генерировать код для новых компонентов
4. Помогать с архитектурой приложения
5. Отвечать на вопросы по React, TypeScript и фронтенд-разработке

Чтобы лучше понять ваши потребности, пожалуйста, уточните задачу или предоставьте код для анализа (вставьте его между \`\`\` и \`\`\`). Я готов помочь с любыми вопросами по разработке!`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Brain" className="text-primary" />
          AI Ассистент
        </CardTitle>
        <CardDescription>
          Ваш помощник в разработке. Анализирует код, находит ошибки и помогает их исправить
        </CardDescription>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="chat">
              <Icon name="MessageSquare" className="mr-2" size={16} />
              Чат
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              disabled={!detectedIssues}
              className={detectedIssues ? "animate-pulse" : ""}
            >
              <Icon name="AlertCircle" className="mr-2" size={16} />
              Анализ кода
              {detectedIssues && detectedIssues.errors.length > 0 && (
                <Badge className="ml-2 bg-red-500">{detectedIssues.errors.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="chat" className="mt-0 space-y-4">
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
              placeholder="Опишите задачу или вставьте код для анализа (используйте ``` для выделения блоков кода)..."
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
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-0 space-y-4">
          {detectedIssues && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Результаты анализа кода</h3>
                  <div className="flex gap-2">
                    <Badge variant={detectedIssues.errors.filter(e => e.severity === 'error').length > 0 ? "destructive" : "outline"}>
                      Ошибок: {detectedIssues.errors.filter(e => e.severity === 'error').length}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Предупреждений: {detectedIssues.errors.filter(e => e.severity === 'warning').length}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Рекомендаций: {detectedIssues.errors.filter(e => e.severity === 'info').length + detectedIssues.suggestions.length}
                    </Badge>
                  </div>
                </div>
                
                {detectedIssues.errors.length > 0 ? (
                  <div className="space-y-2">
                    {detectedIssues.errors.map((error, index) => (
                      <Alert key={index} variant={
                        error.severity === 'error' ? "destructive" : 
                        error.severity === 'warning' ? "default" : "outline"
                      }>
                        <div className="flex items-start gap-2">
                          <Icon name={
                            error.severity === 'error' ? "XCircle" : 
                            error.severity === 'warning' ? "AlertTriangle" : "Info"
                          } />
                          <div>
                            <AlertDescription>
                              <span className="font-medium">Строка {error.line}{error.column ? `, символ ${error.column}` : ''}: </span>
                              {error.message}
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <Icon name="CheckCircle" className="text-green-500" />
                    <AlertDescription>
                      Ошибок в коде не обнаружено!
                    </AlertDescription>
                  </Alert>
                )}
                
                {detectedIssues.suggestions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Рекомендации по улучшению:</h4>
                    <ul className="space-y-1 pl-5 list-disc">
                      {detectedIssues.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {detectedIssues.fixedCode && (
                <div className="pt-4">
                  <Button onClick={handleFixCode} className="w-full">
                    <Icon name="Wrench" className="mr-2" />
                    Автоматически исправить проблемы
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Icon name="Info" size={14} />
          Вставьте код между ``` для более точного анализа
        </span>
      </CardFooter>
    </Card>
  );
};

export default AiAssistant;
