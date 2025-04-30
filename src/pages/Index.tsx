
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import AiAssistant, { CodeAnalysisResult } from "@/components/AiAssistant";
import ProjectExplorer from "@/components/ProjectExplorer";
import CodePreview from "@/components/CodePreview";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  content?: string;
  children?: FileItem[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  files: FileItem[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysisResult | null>(null);
  const [previewContent, setPreviewContent] = useState<React.ReactNode | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'demo-1',
      name: 'Демо проект',
      description: 'Пример проекта для демонстрации возможностей платформы',
      createdAt: new Date(),
      files: []
    }
  ]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showProjectStructure, setShowProjectStructure] = useState(false);

  // Обработка ответа от AI-помощника
  const handleAiResponse = (response: string) => {
    console.log('Получен ответ от AI:', response);
    
    // Проверяем, содержит ли ответ HTML код для предпросмотра
    if (response.includes('<html>') || response.includes('<div') || response.includes('<body')) {
      try {
        // Создаем безопасный iframe для предпросмотра кода
        const previewFrame = (
          <div className="border rounded overflow-hidden w-full h-full min-h-[400px]">
            <iframe
              srcDoc={response.includes('<html>') ? response : `<html><body>${response}</body></html>`}
              className="w-full h-full min-h-[400px]"
              title="Предпросмотр"
              sandbox="allow-scripts"
            />
          </div>
        );
        setPreviewContent(previewFrame);
      } catch (error) {
        console.error('Ошибка при создании предпросмотра:', error);
        setPreviewContent(
          <div className="p-4 text-red-500">
            Не удалось создать предпросмотр из-за ошибки
          </div>
        );
      }
    }
    
    // Если ответ содержит код, сохраняем его для CodePreview
    const codeMatch = response.match(/```(?:html|jsx|tsx|javascript|typescript|js|ts)?\n([\s\S]*?)\n```/);
    if (codeMatch && codeMatch[1]) {
      setGeneratedCode(codeMatch[1]);
      
      // Симулируем создание структуры проекта на основе кода
      if (!showProjectStructure) {
        setShowProjectStructure(true);
        // Генерируем примерную структуру файлов на основе кода
        const newProject: Project = {
          id: `project-${Date.now()}`,
          name: 'Новый проект',
          description: 'Проект, созданный на основе запроса к AI',
          createdAt: new Date(),
          files: generateProjectFiles(codeMatch[1])
        };
        setCurrentProject(newProject);
        setProjects(prev => [...prev, newProject]);
      }
    }
  };

  // Обработка фиксации кода AI-помощником
  const handleCodeFix = (originalCode: string, fixedCode: string) => {
    console.log('Код исправлен:', { originalCode, fixedCode });
    setGeneratedCode(fixedCode);
    
    // Обновляем код в выбранном файле, если он существует
    if (selectedFile && selectedFile.content) {
      setSelectedFile({
        ...selectedFile,
        content: fixedCode
      });
    }
    
    // Создаем предпросмотр исправленного кода
    try {
      const previewFrame = (
        <div className="border rounded overflow-hidden w-full h-full min-h-[400px]">
          <iframe
            srcDoc={`<html><body>${fixedCode}</body></html>`}
            className="w-full h-full min-h-[400px]"
            title="Предпросмотр исправленного кода"
            sandbox="allow-scripts"
          />
        </div>
      );
      setPreviewContent(previewFrame);
    } catch (error) {
      console.error('Ошибка при создании предпросмотра:', error);
    }
  };

  // Обработка анализа кода
  const handleCodeAnalysis = (analysis: CodeAnalysisResult) => {
    console.log('Анализ кода:', analysis);
    setCodeAnalysis(analysis);
  };

  // Обработка выбора файла в проекте
  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file);
    if (file.content) {
      setGeneratedCode(file.content);
    } else {
      // Если содержимое файла не определено, создаем шаблон на основе расширения
      const defaultContent = getDefaultFileContent(file);
      setGeneratedCode(defaultContent);
      setSelectedFile({...file, content: defaultContent});
    }
  };

  // Генерация содержимого файла по умолчанию на основе его расширения
  const getDefaultFileContent = (file: FileItem): string => {
    if (!file.extension) return '';
    
    switch (file.extension) {
      case 'tsx':
      case 'jsx':
        return `import React from 'react';\n\nconst ${file.name} = () => {\n  return (\n    <div>\n      ${file.name} Component\n    </div>\n  );\n};\n\nexport default ${file.name};`;
      case 'ts':
      case 'js':
        return `// ${file.name}.${file.extension}\n\nexport const ${file.name} = () => {\n  console.log('${file.name} function');\n};\n`;
      case 'css':
        return `/* ${file.name}.css */\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 1rem;\n}\n`;
      case 'html':
        return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${file.name}</title>\n</head>\n<body>\n  <h1>${file.name}</h1>\n</body>\n</html>`;
      case 'json':
        return `{\n  "name": "${file.name}",\n  "version": "1.0.0"\n}`;
      case 'md':
        return `# ${file.name}\n\nЭто файл документации для проекта.\n`;
      default:
        return `// ${file.name}.${file.extension}\n`;
    }
  };

  // Генерация структуры файлов проекта на основе кода
  const generateProjectFiles = (code: string): FileItem[] => {
    // Пытаемся определить тип проекта по коду
    const isReact = code.includes('import React') || code.includes('from "react"');
    const isVite = code.includes('vite') || code.includes('import.meta');
    const hasTailwind = code.includes('className=') && (code.includes('bg-') || code.includes('text-') || code.includes('flex'));
    
    const files: FileItem[] = [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        children: [
          {
            id: 'components',
            name: 'components',
            type: 'folder',
            children: []
          },
          {
            id: 'pages',
            name: 'pages',
            type: 'folder',
            children: []
          },
          {
            id: 'app-tsx',
            name: 'App',
            type: 'file',
            extension: 'tsx',
            content: isReact ? `import React from 'react';\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>Новый проект</h1>\n        <p>Создан с помощью AI</p>\n      </header>\n    </div>\n  );\n}\n\nexport default App;` : ''
          },
          {
            id: 'index-css',
            name: 'index',
            type: 'file',
            extension: 'css',
            content: `/* Global styles */\n\nbody {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',\n    sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\ncode {\n  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;\n}`
          }
        ]
      },
      {
        id: 'public',
        name: 'public',
        type: 'folder',
        children: [
          {
            id: 'index-html',
            name: 'index',
            type: 'file',
            extension: 'html',
            content: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>AI Generated Project</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>`
          }
        ]
      },
      {
        id: 'package-json',
        name: 'package',
        type: 'file',
        extension: 'json',
        content: `{\n  "name": "ai-generated-project",\n  "private": true,\n  "version": "0.0.1",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    ${isReact ? `"react": "^18.2.0",\n    "react-dom": "^18.2.0",` : ''}\n    ${hasTailwind ? `"tailwindcss": "^3.2.4",\n    "postcss": "^8.4.21",\n    "autoprefixer": "^10.4.13",` : ''}\n    "vite": "^4.1.0"\n  }\n}`
      }
    ];

    // На основе полученного кода создаем файл компонента
    const componentName = 'GeneratedComponent';
    const componentFile: FileItem = {
      id: 'generated-component',
      name: componentName,
      type: 'file',
      extension: 'tsx',
      content: code
    };
    
    // Добавляем компонент в папку компонентов
    const componentsFolder = files[0].children?.find(f => f.id === 'components');
    if (componentsFolder && componentsFolder.children) {
      componentsFolder.children.push(componentFile);
    }
    
    return files;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Icon name="Code2" size={28} className="text-primary" />
          AI Разработчик
        </h1>
        <p className="text-slate-500">Создавайте сайты и веб-приложения с помощью искусственного интеллекта</p>
      </header>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="create">
            <Icon name="Plus" className="mr-2" size={16} />
            Создать сайт
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Icon name="Folder" className="mr-2" size={16} />
            Проекты
          </TabsTrigger>
          <TabsTrigger value="analyze">
            <Icon name="Search" className="mr-2" size={16} />
            Анализ кода
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AiAssistant 
                onResponse={handleAiResponse} 
                onCodeFix={handleCodeFix}
                onCodeAnalysis={handleCodeAnalysis}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Lightbulb" />
                    Подсказки
                  </CardTitle>
                  <CardDescription>Примеры запросов для создания сайтов</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => {
                      const request = "Создай лендинг для кофейни с использованием React и Tailwind";
                      const textarea = document.querySelector('textarea');
                      if (textarea) {
                        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                          window.HTMLTextAreaElement.prototype, "value"
                        )?.set;
                        if (nativeTextAreaValueSetter) {
                          nativeTextAreaValueSetter.call(textarea, request);
                          const event = new Event('input', { bubbles: true });
                          textarea.dispatchEvent(event);
                        }
                      }
                    }}
                  >
                    <Icon name="Coffee" className="mr-2" />
                    <div>
                      <p className="font-medium">Лендинг для кофейни</p>
                      <p className="text-xs text-slate-500 mt-1">Создай современный лендинг для кофейни с меню, отзывами и формой заказа</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => {
                      const request = "Создай блог с использованием React и добавь функционал комментариев";
                      const textarea = document.querySelector('textarea');
                      if (textarea) {
                        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                          window.HTMLTextAreaElement.prototype, "value"
                        )?.set;
                        if (nativeTextAreaValueSetter) {
                          nativeTextAreaValueSetter.call(textarea, request);
                          const event = new Event('input', { bubbles: true });
                          textarea.dispatchEvent(event);
                        }
                      }
                    }}
                  >
                    <Icon name="FileText" className="mr-2" />
                    <div>
                      <p className="font-medium">Блог с комментариями</p>
                      <p className="text-xs text-slate-500 mt-1">Создай блог с основными страницами и возможностью комментирования</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => {
                      const request = "Исправь ошибку в коде: ```import React from 'react'; function App() { return (<div>Hello</div) }```";
                      const textarea = document.querySelector('textarea');
                      if (textarea) {
                        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                          window.HTMLTextAreaElement.prototype, "value"
                        )?.set;
                        if (nativeTextAreaValueSetter) {
                          nativeTextAreaValueSetter.call(textarea, request);
                          const event = new Event('input', { bubbles: true });
                          textarea.dispatchEvent(event);
                        }
                      }
                    }}
                  >
                    <Icon name="Bug" className="mr-2" />
                    <div>
                      <p className="font-medium">Исправить ошибку в коде</p>
                      <p className="text-xs text-slate-500 mt-1">Анализ и исправление ошибок в React-компоненте</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {showProjectStructure && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div>
                <ProjectExplorer onSelectFile={handleSelectFile} />
              </div>
              <div className="lg:col-span-2">
                <CodePreview 
                  code={generatedCode} 
                  preview={previewContent}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Создан: {project.createdAt.toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        setCurrentProject(project);
                        setShowProjectStructure(true);
                        setActiveTab('create');
                      }}
                    >
                      <Icon name="Eye" className="mr-2" size={16} />
                      Просмотр
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="Edit" className="mr-2" size={16} />
                      Редактировать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Карточка для создания нового проекта */}
            <Card className="border-dashed overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <Button 
                  variant="ghost" 
                  className="h-20 w-20 rounded-full mb-4"
                  onClick={() => setActiveTab('create')}
                >
                  <Icon name="Plus" size={32} />
                </Button>
                <p className="font-medium">Создать новый проект</p>
                <p className="text-sm text-slate-500 text-center mt-1">
                  Начните с чистого листа или используйте шаблон
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AiAssistant 
                onResponse={handleAiResponse} 
                onCodeFix={handleCodeFix}
                onCodeAnalysis={handleCodeAnalysis}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FileSearch" />
                    Анализ кода
                  </CardTitle>
                  <CardDescription>Инструменты для проверки и оптимизации</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => {
                      const code = `import React, { useState } from 'react';
function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  });
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`;
                      const request = `Проанализируй этот код и найди ошибки: \`\`\`jsx\n${code}\n\`\`\``;
                      const textarea = document.querySelector('textarea');
                      if (textarea) {
                        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                          window.HTMLTextAreaElement.prototype, "value"
                        )?.set;
                        if (nativeTextAreaValueSetter) {
                          nativeTextAreaValueSetter.call(textarea, request);
                          const event = new Event('input', { bubbles: true });
                          textarea.dispatchEvent(event);
                        }
                      }
                    }}
                  >
                    <Icon name="AlertTriangle" className="mr-2" />
                    <div>
                      <p className="font-medium">Пример кода с ошибкой</p>
                      <p className="text-xs text-slate-500 mt-1">Загрузить пример кода с ошибкой для демонстрации анализа</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => {
                      const code = `// Пример компонента с возможностью оптимизации
import React, { useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchProducts = async () => {
    setLoading(true);
    const response = await fetch('https://api.example.com/products');
    const data = await response.json();
    setProducts(data);
    setLoading(false);
  };
  
  React.useEffect(() => {
    fetchProducts();
  }, []);
  
  return (
    <div>
      <h1>Список продуктов</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.id}>{product.name} - ${product.price}</li>
          ))}
        </ul>
      )}
      <button onClick={fetchProducts}>Обновить</button>
    </div>
  );
}`;
                      const request = `Оптимизируй этот код: \`\`\`jsx\n${code}\n\`\`\``;
                      const textarea = document.querySelector('textarea');
                      if (textarea) {
                        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                          window.HTMLTextAreaElement.prototype, "value"
                        )?.set;
                        if (nativeTextAreaValueSetter) {
                          nativeTextAreaValueSetter.call(textarea, request);
                          const event = new Event('input', { bubbles: true });
                          textarea.dispatchEvent(event);
                        }
                      }
                    }}
                  >
                    <Icon name="Zap" className="mr-2" />
                    <div>
                      <p className="font-medium">Оптимизировать компонент</p>
                      <p className="text-xs text-slate-500 mt-1">Загрузить пример кода для оптимизации производительности</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {codeAnalysis && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FileSearch" />
                    Результаты анализа кода
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Найденные проблемы</h3>
                      <div className="space-y-2">
                        {codeAnalysis.errors.map((error, index) => (
                          <div key={index} className={`p-3 rounded-md ${
                            error.severity === 'error' ? 'bg-red-50 text-red-700' :
                            error.severity === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            <div className="flex items-start gap-2">
                              <Icon 
                                name={
                                  error.severity === 'error' ? 'XCircle' :
                                  error.severity === 'warning' ? 'AlertTriangle' :
                                  'Info'
                                }
                                className={
                                  error.severity === 'error' ? 'text-red-500' :
                                  error.severity === 'warning' ? 'text-yellow-500' :
                                  'text-blue-500'
                                }
                              />
                              <div>
                                <p className="font-medium">Строка {error.line}{error.column ? `, символ ${error.column}` : ''}</p>
                                <p>{error.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Рекомендации</h3>
                      <div className="space-y-2">
                        {codeAnalysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="p-3 rounded-md bg-slate-50">
                            <div className="flex items-start gap-2">
                              <Icon name="Lightbulb" className="text-amber-500" />
                              <p>{suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {generatedCode && (
            <div className="mt-6">
              <CodePreview 
                code={generatedCode} 
                preview={previewContent}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
