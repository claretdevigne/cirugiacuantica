import Link from "next/link";
interface BreadcrumbProps {
  pageName: string | null;
  types: string 
}

const Breadcrumb = ({ pageName, types }: BreadcrumbProps) => {
  
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              {
                types === "cursos"
                  ? "Cursos /"
                    : types === "database"
                      ? "Base de datos /"
                        : types === "perfil"
                          ?  "Configuración /"
                            : "Dashboard /"
              }
            </Link>
          </li>
          <li className="font-medium text-yellow-500">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
