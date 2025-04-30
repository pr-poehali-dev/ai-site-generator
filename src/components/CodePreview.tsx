
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface CodePreviewProps {
  code?: string;
  preview?: React.ReactNode;
}

const CodePreview: React.FC<CodePreviewProps> = ({ 
  code = "// Здесь будет отображаться сгенерированный код",
  preview 
}) => {
  const [activeTab, setActiveTab] = useState("code");

  // Простая функция для подсветки синтаксиса
  const formatCode = (code: string) => {
    // Очень базовая подсветка
    return code
      .replace(/(import|export|from|const|let|function|return|if|else|for|while)/g, '<span class="text-blue-400">$1</span>')
      .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-green-400">$1</span>')
      .replace(/(\{|\}|\(|\)|\[|\]|;|,|=>)/g, '<span class="text-yellow-400">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="text-slate-400">$1</span>');
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2">
          <Icon name="Code2" />
          Просмотр кода и результата
        </CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="code">
              <Icon name="Code" className="mr-2" size={16} />
              Код
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Icon name="Layout" className="mr-2" size={16} />
              Результат
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-4">
        <TabsContent value="code" className="mt-0">
          <div className="relative">
            <div className="absolute top-2 right-2 flex gap-1">
              <button className="p-1 hover:bg-slate-800 rounded text-xs text-slate-400">
                <Icon name="Copy" size={14} />
              </button>
              <button className="p-1 hover:bg-slate-800 rounded text-xs text-slate-400">
                <Icon name="Download" size={14} />
              </button>
            </div>
            <pre className="p-4 bg-slate-950 text-slate-100 rounded-md overflow-x-auto text-sm font-mono min-h-[300px] max-h-[600px]">
              <code dangerouslySetInnerHTML={{ __html: formatCode(code) }} />
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-0 min-h-[300px] max-h-[600px] overflow-auto border rounded-md p-4">
          {preview || (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Icon name="Monitor" size={48} className="mb-4 opacity-30" />
              <p>Здесь будет отображаться результат</p>
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default CodePreview;
