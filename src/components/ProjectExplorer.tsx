
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  children?: FileItem[];
  isOpen?: boolean;
  level?: number;
}

interface ProjectExplorerProps {
  onSelectFile?: (file: FileItem) => void;
}

const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ onSelectFile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          isOpen: true,
          children: [
            { id: '3', name: 'Button', type: 'file', extension: 'tsx' },
            { id: '4', name: 'Card', type: 'file', extension: 'tsx' },
            { id: '5', name: 'Input', type: 'file', extension: 'tsx' },
          ]
        },
        {
          id: '6',
          name: 'pages',
          type: 'folder',
          isOpen: true,
          children: [
            { id: '7', name: 'Home', type: 'file', extension: 'tsx' },
            { id: '8', name: 'About', type: 'file', extension: 'tsx' },
          ]
        },
        { id: '9', name: 'App', type: 'file', extension: 'tsx' },
        { id: '10', name: 'main', type: 'file', extension: 'tsx' },
        { id: '11', name: 'index', type: 'file', extension: 'css' },
      ]
    },
    { id: '12', name: 'package', type: 'file', extension: 'json' },
    { id: '13', name: 'tsconfig', type: 'file', extension: 'json' },
  ]);

  const toggleFolder = (id: string) => {
    const updateFilesRecursive = (items: FileItem[]): FileItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isOpen: !item.isOpen };
        }
        if (item.children) {
          return { ...item, children: updateFilesRecursive(item.children) };
        }
        return item;
      });
    };
    
    setFiles(updateFilesRecursive(files));
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return file.isOpen ? 'FolderOpen' : 'Folder';
    }
    
    switch (file.extension) {
      case 'tsx':
      case 'jsx':
        return 'FileCode';
      case 'ts':
      case 'js':
        return 'FileCode';
      case 'css':
      case 'scss':
        return 'FileType';
      case 'json':
        return 'FileCog';
      case 'md':
        return 'FileText';
      default:
        return 'File';
    }
  };

  const getIconColor = (file: FileItem) => {
    if (file.type === 'folder') {
      return 'text-yellow-500';
    }
    
    switch (file.extension) {
      case 'tsx':
      case 'jsx':
        return 'text-blue-500';
      case 'ts':
      case 'js':
        return 'text-green-500';
      case 'css':
      case 'scss':
        return 'text-pink-500';
      case 'json':
        return 'text-amber-500';
      case 'md':
        return 'text-slate-500';
      default:
        return 'text-slate-400';
    }
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map(item => {
      const isVisible = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!isVisible && (!item.children || item.children.length === 0)) {
        return null;
      }

      return (
        <React.Fragment key={item.id}>
          {isVisible && (
            <div
              className={`flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-slate-100 text-sm`}
              style={{ paddingLeft: `${(level * 12) + 8}px` }}
              onClick={() => {
                if (item.type === 'folder') {
                  toggleFolder(item.id);
                } else if (onSelectFile) {
                  onSelectFile(item);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Icon name={getFileIcon(item)} className={getIconColor(item)} size={16} />
                <span>{item.name}{item.extension ? `.${item.extension}` : ''}</span>
              </div>
            </div>
          )}
          {item.children && item.isOpen && renderFileTree(item.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Icon name="FolderTree" />
          Файлы проекта
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <Input
            placeholder="Поиск файлов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
            prefix={<Icon name="Search" size={16} className="text-slate-400" />}
          />
        </div>
        <div className="overflow-auto max-h-[400px]">
          {renderFileTree(files)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectExplorer;
