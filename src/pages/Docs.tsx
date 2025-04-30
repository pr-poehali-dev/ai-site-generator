
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DocsPage = () => {
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
            <Link to="/docs" className="text-sm font-medium text-primary">Документация</Link>
            <Button variant="default" size="sm">
              <Icon name="Plus" size={16} className="mr-1" />
              Новый проект
            </Button>
          </nav>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Сайдбар */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Документация</CardTitle>
                <CardDescription>Руководство пользователя</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md text-primary font-medium">
                    <Icon name="BookOpen" size={16} />
                    <span>Начало работы</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                    <Icon name="Code2" size={16} />
                    <span>AI помощник</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                    <Icon name="FileCode" size={16} />
                    <span>Создание проектов</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                    <Icon name="Layout" size={16} />
                    <span>Шаблоны</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                    <Icon name="Terminal" size={16} />
                    <span>API интеграции</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                    <Icon name="HelpCircle" size={16} />
                    <span>Частые вопросы</span>
                  </div>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Основной контент */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Начало работы с AI Web Builder</CardTitle>
                <CardDescription>
                  Узнайте, как начать создавать сайты с помощью искусственного интеллекта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Icon name="InfoCircle" className="h-4 w-4" />
                  <AlertTitle>Важная информация</AlertTitle>
                  <AlertDescription>
                    AI Web Builder находится в бета-версии. Некоторые функции могут работать нестабильно. Мы постоянно улучшаем платформу.
                  </AlertDescription>
                </Alert>

                <div className="prose max-w-none">
                  <h2>Что такое AI Web Builder?</h2>
                  <p>
                    AI Web Builder - это инновационная платформа, которая использует 
                    искусственный интеллект для создания и оптимизации веб-проектов. 
                    С помощью нашего умного помощника вы можете:
                  </p>
                  <ul>
                    <li>Создавать сайты на основе текстового описания</li>
                    <li>Находить и исправлять ошибки в коде</li>
                    <li>Оптимизировать производительность сайта</li>
                    <li>Получать рекомендации по улучшению пользовательского опыта</li>
                  </ul>

                  <h2>Как начать работу?</h2>
                  <p>
                    Для начала работы с AI Web Builder выполните следующие шаги:
                  </p>
                  <ol>
                    <li>Зарегистрируйтесь на платформе или войдите в систему</li>
                    <li>Создайте новый проект, нажав кнопку "Новый проект"</li>
                    <li>Опишите свой проект в текстовом поле AI помощника</li>
                    <li>Нажмите "Запустить AI" для генерации кода</li>
                    <li>Просмотрите результаты и внесите необходимые корректировки</li>
                  </ol>

                  <h2>Технологии</h2>
                  <p>
                    AI Web Builder использует передовые технологии и нейросети для создания 
                    высококачественных веб-проектов:
                  </p>
                  <pre className="bg-slate-100 p-4 rounded-md text-sm overflow-auto">
{`// Пример интеграции с API нейросети
const generateCode = async (prompt) => {
  const response = await fetch('https://api.aiwebbuilder.com/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  
  const data = await response.json();
  return data.generatedCode;
}`}
                  </pre>
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

export default DocsPage;
