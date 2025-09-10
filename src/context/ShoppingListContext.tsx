// Path: src/context/ShoppingListContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { ShoppingList } from "@/models/ShoppingList";
import {
  fetchShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} from "@/lib/shoppingListApi";

type ShoppingListContextType = {
  lists: ShoppingList[];
  addList: (list: Omit<ShoppingList, "_id">) => Promise<void>;
  editList: (id: string, list: Partial<ShoppingList>) => Promise<void>;
  removeList: (id: string) => Promise<void>;
};

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);

  useEffect(() => {
    fetchShoppingLists().then(setLists);
  }, []);

  const addList = async (list: Omit<ShoppingList, "_id">) => {
    const newList = await createShoppingList(list);
    setLists((prev) => [...prev, newList]);
  };

  const editList = async (id: string, list: Partial<ShoppingList>) => {
    const updated = await updateShoppingList(id, list);
    setLists((prev) => prev.map((l) => (l._id === id ? updated : l)));
  };

  const removeList = async (id: string) => {
    await deleteShoppingList(id);
    setLists((prev) => prev.filter((l) => l._id !== id));
  };

  return (
    <ShoppingListContext.Provider
      value={{ lists, addList, editList, removeList }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingLists = () => {
  const context = useContext(ShoppingListContext);
  if (!context)
    throw new Error(
      "useShoppingLists must be used within ShoppingListProvider"
    );
  return context;
};
