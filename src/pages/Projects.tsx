
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const ProjectsPage = () => {
  const projects = [
    {
      id: 1,
      title: "Лендинг для стартапа",
      description: "Одностраничный сайт с анимациями и формой обратной связи",
      date: "28.04.2025",
      status: "Завершен"
    },
    {
      id: 2,
      title: "Интернет-магазин",
      description: "Многостраничный сайт с каталогом товаров и корзиной",
      date: "30.04.2025",
      status: "В процессе"
    },
    {
      id: 3,
      title: "Портфолио фотографа",
      description: "Галерея работ с фильтрами и лайтбоксом",
      date: "01.05.2025",
      status: "Черновик"
    }
  ];

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
            <Link to="/projects" className="text-sm font-medium text-primary">Проекты</Link>
            <Link to="/docs" className="text-sm font-medium hover:text-primary">Документация</Link>
            <Button variant="default" size="sm">
              <Icon name="Plus" size={16} className="mr-1" />
              Новый проект
            </Button>
          </nav>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Мои проекты</h2>
          <Button>
            <Icon name="Plus" size={16} className="mr-2" />
            Создать проект
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{project.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Icon name="Pencil" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} />
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Circle" size={14} className={
                      project.status === "Завершен" ? "text-green-500" : 
                      project.status === "В процессе" ? "text-amber-500" : "text-slate-400"
                    } />
                    <span>{project.status}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Icon name="ExternalLink" size={16} className="mr-2" />
                  Открыть проект
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Card className="border-dashed bg-slate-50 flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-slate-100 transition-colors">
            <Icon name="Plus" size={48} className="text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-600">Создать проект</h3>
            <p className="text-sm text-slate-500 text-center px-6 mt-2">
              Нажмите, чтобы создать новый проект с помощью AI
            </p>
          </Card>
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

export default ProjectsPage;
