"use client";

import { BundleEditFormData, Pagination, ProductStatus } from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type BundleStatusFilter = ProductStatus | "all";

type CreateBundleContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  createBundleData: BundleEditFormData;
  setCreateBundleData: Dispatch<SetStateAction<BundleEditFormData>>;
  isEditMode: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  statusFilter: BundleStatusFilter;
  setStatusFilter: Dispatch<SetStateAction<BundleStatusFilter>>;
  pagination: Pagination;
  setPagination: Dispatch<SetStateAction<Pagination>>;
  categoryFilter: string;
  setCategoryFilter: Dispatch<SetStateAction<string>>;
};

const CreateBundleContext = createContext({} as CreateBundleContextType);

export const useCreateBundleContext = () => {
  const ctx = useContext(CreateBundleContext);

  if (!ctx) {
    throw new Error(
      "[useCreateBundleContext] must be used within a CreateBundleProvider",
    );
  }

  return ctx;
};

const CreateBundleProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createBundleData, setCreateBundleData] = useState<BundleEditFormData>(
    {} as BundleEditFormData,
  );
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<BundleStatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
  });

  const value = {
    isOpen,
    setIsOpen,
    createBundleData,
    setCreateBundleData,
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
    if (isOpen) return;

    setCreateBundleData({} as BundleEditFormData);
    setIsEditMode(false);
  }, [isOpen]);

  return (
    <CreateBundleContext.Provider value={value}>
      {children}
    </CreateBundleContext.Provider>
  );
};

export default CreateBundleProvider;
