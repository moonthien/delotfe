import React from "react";
import styled from "styled-components";
import { Plus, Search } from "lucide-react";

const SearchBar = styled.div`
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%,
    100% {
      background-position: 200% center;
    }
    50% {
      background-position: -200% center;
    }
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 350px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 44px;
  border: 2px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #64748b;
    font-weight: 400;
  }

  &:hover {
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #667eea;
  transition: all 0.3s ease;
  z-index: 2;
  pointer-events: none;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  option {
    padding: 8px;
    font-weight: 500;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    filter: brightness(1.1);
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
    transition: all 0.1s ease;
  }

  svg {
    width: 18px;
    height: 18px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }
`;

const SearchAndFilter = ({
  searchTerm = "",
  onSearchChange,
  filterValue = "",
  onFilterChange,
  filterOptions = [],
  onAdd,
  searchPlaceholder = "Tìm kiếm...",
  addButtonText = "Thêm mới",
  filterLabel = "Tất cả",
}) => {
  return (
    <SearchBar>
      <SearchWrapper>
        <SearchIcon />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </SearchWrapper>
      <FilterGroup>
        {filterOptions.length > 0 && (
          <Select
            value={filterValue}
            onChange={(e) => onFilterChange?.(e.target.value)}
          >
            <option value="all">{filterLabel}</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
        <AddButton onClick={onAdd}>
          <Plus /> {addButtonText}
        </AddButton>
      </FilterGroup>
    </SearchBar>
  );
};

export default SearchAndFilter;
