
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AiAssistant from "@/components/AiAssistant";
import CodePreview from "@/components/CodePreview";
import ProjectExplorer from "@/components/ProjectExplorer";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    // Имитация обработки запроса
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Шапка */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Icon name="Code" className="text-primary" size={24} />
            <h1 className="text-xl font-bold">AI Web Builder</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:text-primary">Главная</Link>
            <Link to="/projects" className="text-sm font-medium hover:text-primary">Проекты</Link>
            <Link to="/docs" className="text-sm font-medium hover:text-primary">Документация</Link>
            <Button variant="default" size="sm">
              <Icon name="Plus" size={16} />
              Новый проект
            </Button>
          </nav>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - инструкции и AI помощник */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>AI Web Builder</CardTitle>
                <CardDescription>
                  Создавайте сайты с помощью искусственного интеллекта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Опишите, что вы хотите создать, и наш AI помощник сгенерирует код, 
                  найдет ошибки и предложит улучшения для вашего проекта.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle" className="text-green-500 mt-0.5" size={16} />
                    <span>Анализ кода и поиск ошибок</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle" className="text-green-500 mt-0.5" size={16} />
                    <span>Генерация компонентов и страниц</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle" className="text-green-500 mt-0.5" size={16} />
                    <span>Предпросмотр созданного сайта</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Помощник</CardTitle>
                <CardDescription>
                  Задайте вопрос или опишите задачу
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    <div className="flex flex-col gap-2">
                      <Input
                        className="min-h-[100px] resize-y"
                        placeholder="Опишите, что нужно создать или исправить..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isProcessing}
                        as="textarea"
                      />
                    </div>
                    <Button type="submit" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Icon name="Loader2" className="animate-spin" />
                          Обработка...
                        </>
                      ) : (
                        <>
                          <Icon name="Zap" />
                          Запустить AI
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка - превью и результаты */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">
                  <Icon name="Eye" className="mr-2" />
                  Предпросмотр
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Icon name="Code" className="mr-2" />
                  Код
                </TabsTrigger>
                <TabsTrigger value="files">
                  <Icon name="Folder" className="mr-2" />
                  Файлы проекта
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="border rounded-md bg-white p-4 min-h-[500px]">
                      <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                        <Icon name="Layout" size={48} className="mb-4 opacity-20" />
                        <p>Здесь будет отображаться предпросмотр вашего сайта</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="code" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="border rounded-md bg-slate-950 text-slate-100 p-4 min-h-[500px] font-mono text-sm overflow-auto">
                      <p className="text-slate-400">// Здесь будет отображаться код вашего проекта</p>
                      <p className="text-blue-400">import</p> <p className="text-slate-100">React from 'react';</p>
                      <br />
                      <p className="text-blue-400">function</p> <p className="text-yellow-400">App</p><p className="text-slate-100">() {`{`}</p>
                      <p className="pl-4 text-slate-100">return (</p>
                      <p className="pl-8 text-slate-100">{`<div>Ваше приложение</div>`}</p>
                      <p className="pl-4 text-slate-100">);</p>
                      <p className="text-slate-100">{`}`}</p>
                      <br />
                      <p className="text-blue-400">export</p> <p className="text-blue-400">default</p> <p className="text-slate-100">App;</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="files" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="border rounded-md bg-white p-4 min-h-[500px]">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                          <Icon name="Folder" size={16} className="text-yellow-500" />
                          <span>src</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer ml-4">
                          <Icon name="Folder" size={16} className="text-yellow-500" />
                          <span>components</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer ml-4">
                          <Icon name="Folder" size={16} className="text-yellow-500" />
                          <span>pages</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer ml-8">
                          <Icon name="FileCode" size={16} className="text-blue-500" />
                          <span>index.tsx</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer ml-4">
                          <Icon name="FileCode" size={16} className="text-purple-500" />
                          <span>App.tsx</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer ml-4">
                          <Icon name="FileCode" size={16} className="text-green-500" />
                          <span>main.tsx</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Анализ и рекомендации</CardTitle>
                <CardDescription>
                  Результаты анализа кода и предложения по улучшению
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-green-50 border-green-200">
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle" className="text-green-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-green-700">Рекомендация по оптимизации</h3>
                        <p className="text-sm text-green-600">Рекомендуется использовать React.memo для оптимизации производительности компонента.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-amber-50 border-amber-200">
                    <div className="flex items-start gap-3">
                      <Icon name="AlertTriangle" className="text-amber-500 mt-1" />
                      <div>
                        <h3 className="font-medium text-amber-700">Предупреждение в коде</h3>
                        <p className="text-sm text-amber-600">Обнаружена потенциальная утечка памяти из-за отсутствия очистки эффектов.</p>
                        <pre className="mt-2 p-2 bg-white border border-amber-200 rounded text-xs overflow-auto">
{`useEffect(() => {
  const timer = setInterval(() => {
    // Ваш код
  }, 1000);
  // Отсутствует очистка
}, []);`}
                        </pre>
                        <p className="text-sm text-amber-600 mt-2">Исправленный вариант:</p>
                        <pre className="mt-2 p-2 bg-white border border-amber-200 rounded text-xs overflow-auto">
{`useEffect(() => {
  const timer = setInterval(() => {
    // Ваш код
  }, 1000);
  return () => clearInterval(timer);
}, []);`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Подвал */}
      <footer className="border-t border-slate-200 py-6 bg-white mt-10">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-500">© 2025 AI Web Builder. Все права защищены.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-slate-500 hover:text-primary">Условия использования</Link>
              <Link to="/privacy" className="text-sm text-slate-500 hover:text-primary">Политика конфиденциальности</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
