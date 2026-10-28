"use client";

import {
  Pagination,
  Product,
  ProductEditFormData,
  ProductStatus,
} from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type ProductStatusFilter = ProductStatus | "all";

type CreateProductContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  createProductData: ProductEditFormData;
  setCreateProductData: Dispatch<SetStateAction<ProductEditFormData>>;
  isEditMode: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  statusFilter: ProductStatusFilter;
  setStatusFilter: Dispatch<SetStateAction<ProductStatusFilter>>;
  pagination: Pagination;
  setPagination: Dispatch<SetStateAction<Pagination>>;
  categoryFilter: string;
  setCategoryFilter: Dispatch<SetStateAction<string>>;
};

const CreateProductContext = createContext({} as CreateProductContextType);

export const useCreateProductContext = () => {
  const ctx = useContext(CreateProductContext);

  if (!ctx) {
    throw new Error("[useProduct] must be used within a CreateProductProvider");
  }

  return ctx;
};

const CreateProductProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createProductData, setCreateProductData] =
    useState<ProductEditFormData>({} as ProductEditFormData);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
  });

  const value = {
    isOpen,
    setIsOpen,
    createProductData,
    setCreateProductData,
    isEditMode,
    setIsEditMode,
    searchValue,
    setSearchValue,
    statusFilter,
    setStatusFilter,
    pagination,
    setPagination,
    categoryFilter,
    setCategoryFilter,
  };

  useEffect(() => {
    // Keep edit data available while the dialog is open.
    if (isOpen) return;

    setCreateProductData({} as Product);
    setIsEditMode(false);
  }, [isOpen, setCreateProductData, setIsEditMode]);

  return (
    <CreateProductContext.Provider value={value}>
      {children}
    </CreateProductContext.Provider>
  );
};

export default CreateProductProvider;
