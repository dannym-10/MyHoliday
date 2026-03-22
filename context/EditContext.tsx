import React, { createContext, useContext, useState } from "react";

type EditedItem = {
  title: string;
  date: string;
};

type EditContextType = {
  editedItems: Record<string, EditedItem>;
  updateItem: (id: string, updates: EditedItem) => void;
};

const EditContext = createContext<EditContextType | undefined>(undefined);

export const EditProvider = ({ children }: { children: React.ReactNode }) => {
  const [editedItems, setEditedItems] = useState<Record<string, EditedItem>>(
    {},
  );

  const updateItem = (id: string, updates: EditedItem) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: updates,
    }));
  };

  return (
    <EditContext.Provider value={{ editedItems, updateItem }}>
      {children}
    </EditContext.Provider>
  );
};

export const useEditContext = () => {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error("useEditContext must be used within EditProvider");
  }
  return context;
};
