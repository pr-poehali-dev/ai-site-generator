
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import AiAssistant, { CodeAnalysisResult } from '@/components/AiAssistant';
import ProjectExplorer from '@/components/ProjectExplorer';
import CodePreview from '@/components/CodePreview';

const Index = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysisResult | null>(null);
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(null);

  // Обработка ответа от AI
  const handleAiResponse = (response: string) => {
    // Если в ответе есть код, извлекаем его
    const codeMatch = response.match(/```(?:jsx|tsx|javascript|typescript|js|ts)?\n([\s\S]*?)\n```/);
    if (codeMatch && codeMatch[1]) {
      setGeneratedCode(codeMatch[1]);
      
      // Пытаемся создать предварительный просмотр из кода
      try {
        // Это упрощенный подход, в реальном приложении нужно использовать более безопасные методы
        const previewElement = document.createElement('div');
        previewElement.innerHTML = codeMatch[1]
          .replace(/import .+?\n/g, '') // Удаляем импорты
          .replace(/export default .+?;?$/gm, '') // Удаляем экспорты
          .replace(/className="([^"]*)"/g, 'class="$1"') // Заменяем className на class
          .replace(/{([^{}]*)}/g, (match, p1) => {
            // Упрощенная обработка JSX выражений
            if (p1.trim().startsWith('/*') || p1.includes('//')) return match;
            if (/^\s*\w+\s*$/.test(p1)) return p1.trim(); // Простая переменная
            return ''; // Сложные выражения удаляем для безопасности
          });
          
        setPreviewContent(<div dangerouslySetInnerHTML={{ __html: previewElement.innerHTML }} />);
      } catch (error) {
        console.error('Ошибка при создании предпросмотра:', error);
      }
    }
  };

  // Обработка исправления кода
  const handleCodeFix = (originalCode: string, fixedCode: string) => {
    setGeneratedCode(fixedCode);
    
    // Обновляем анализ кода, указывая, что ошибки исправлены
    if (codeAnalysis) {
      setCodeAnalysis({
        ...codeAnalysis,
        errors: [],
        suggestions: [...codeAnalysis.suggestions, 'Все ошибки успешно исправлены'],
        fixedCode: undefined
      });
    }
  };

  // Обработка анализа кода
  const handleCodeAnalysis = (analysis: CodeAnalysisResult) => {
    setCodeAnalysis(analysis);
    
    // Если есть исправленный код, обновляем его
    if (analysis.fixedCode) {
      setGeneratedCode(analysis.fixedCode);
    }
  };

  return (
    <div className="container mx-auto py-6 flex flex-col min-h-screen">
      <header className="pb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Code2" size={32} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold">AI Code Assistant</h1>
              <p className="text-sm text-slate-500">Умный помощник для создания и анализа кода</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <Button asChild variant="ghost">
              <Link to="/">
                <Icon name="Home" className="mr-2" size={16} />
                Главная
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/projects">
                <Icon name="Folder" className="mr-2" size={16} />
                Проекты
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/docs">
                <Icon name="FileText" className="mr-2" size={16} />
                Документация
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="create">
            <Icon name="Plus" className="mr-2" size={16} />
            Создать проект
          </TabsTrigger>
          <TabsTrigger value="analyze">
            <Icon name="Search" className="mr-2" size={16} />
            Анализ кода
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AiAssistant 
                onResponse={handleAiResponse} 
                onCodeFix={handleCodeFix}
                onCodeAnalysis={handleCodeAnalysis}
              />
            </div>
            <div>
              <CodePreview code={generatedCode} preview={previewContent} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analyze" className="flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1">
              <ProjectExplorer onSelectFile={(file) => {
                // В реальном приложении здесь был бы запрос к API
                // для получения содержимого файла
                setGeneratedCode(`// Содержимое файла ${file.name}${file.extension ? `.${file.extension}` : ''}\n\n// Это демонстрационный пример. В реальном приложении здесь было бы содержимое файла.`);
              }} />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-6">
              <AiAssistant 
                onResponse={handleAiResponse}
                onCodeFix={handleCodeFix}
                onCodeAnalysis={handleCodeAnalysis}
              />
              <CodePreview code={generatedCode} preview={previewContent} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <footer className="mt-6 border-t pt-4 text-center text-sm text-slate-500">
        <p>© 2025 AI Code Assistant - Интеллектуальный инструмент для разработчиков</p>
      </footer>
    </div>
  );
};

export default Index;
