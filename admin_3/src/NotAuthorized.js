import React from "react";

const NotAuthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-red-600">Доступ запрещён: У вас нет прав для просмотра этой страницы.</h1>
    </div>
  );
};

export default NotAuthorized;
